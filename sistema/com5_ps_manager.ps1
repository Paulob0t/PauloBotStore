# COM5 PowerShell Manager - PROCESO PADRE DEL PUERTO
param(
    [string]$CommandQueueFile,
    [string]$LogFile
)

$logsDir        = Split-Path $CommandQueueFile -Parent
$saldoFile      = Join-Path $logsDir "saldo_actual.json"
$inventoryFile  = Join-Path $logsDir "coin_inventory.log"
$signalFile     = Join-Path $logsDir "nueva_moneda_signal.json"
$dispenseQueue  = Join-Path $logsDir "monedero_dispense_queue.json"
$dispenseResp   = Join-Path $logsDir "monedero_dispense_response.json"

# Mapa denominacion decimal -> hex para comandos de dispensar
$hexMap = @{ 1='1'; 2='2'; 5='5'; 10='A'; 20='14'; 50='32'; 100='64'; 200='C8'; 500='1F4' }

# Configurar puerto serial
$port = New-Object System.IO.Ports.SerialPort
$port.PortName   = "COM5"
$port.BaudRate   = 9600
$port.Parity     = [System.IO.Ports.Parity]::None
$port.DataBits   = 8
$port.StopBits   = [System.IO.Ports.StopBits]::One
$port.ReadTimeout  = 100
$port.WriteTimeout = 1000

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $log = "[$timestamp] [PS] $Message"
    Add-Content -Path $LogFile -Value $log -Force
    Write-Host $log
}

# ── Actualiza saldo_actual.json sumando $monto ─────────────────────────
function Update-Saldo {
    param([int]$Monto)
    try {
        $saldoActual = 0
        if (Test-Path $saldoFile) {
            $json = Get-Content $saldoFile -Raw | ConvertFrom-Json
            $saldoActual = [double]$json.saldo
        }
        $nuevoSaldo = $saldoActual + $Monto
        $data = @{
            saldo     = $nuevoSaldo
            timestamp = [int][double]::Parse((Get-Date -UFormat %s))
            fecha     = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        } | ConvertTo-Json -Compress
        Set-Content -Path $saldoFile -Value $data -Force
        Write-Log "SALDO: $saldoActual + $Monto = $nuevoSaldo"
    } catch {
        Write-Log "ERROR al actualizar saldo: $_"
    }
}

# ── Actualiza coin_inventory.log sumando 1 unidad de $Denom ───────────
function Update-Inventory {
    param([int]$Denom)
    try {
        # Usar hashtable para evitar problemas de Add-Member con claves numericas
        $denoms = [ordered]@{ "1"=0; "2"=0; "5"=0; "10"=0; "20"=0 }

        if (Test-Path $inventoryFile) {
            try {
                $existing = Get-Content $inventoryFile -Raw | ConvertFrom-Json
                foreach ($prop in $existing.denominaciones.PSObject.Properties) {
                    $denoms[$prop.Name] = [int]$prop.Value
                }
            } catch {}
        }

        $key = "$Denom"
        if ($denoms.Contains($key)) { $denoms[$key]++ } else { $denoms[$key] = 1 }

        $total = 0
        foreach ($k in $denoms.Keys) { $total += [int]$k * [int]$denoms[$k] }

        $ahora = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $newInv = [ordered]@{
            timestamp            = $ahora
            denominaciones       = $denoms
            total_pesos          = $total
            ultima_actualizacion = $ahora
        }
        $newInv | ConvertTo-Json | Set-Content -Path $inventoryFile -Force
        Write-Log "INVENTARIO: +$Denom pesos -> total=$total"
    } catch {
        Write-Log "ERROR al actualizar inventario: $_"
    }
}

$buffer        = ""
$lastHeartbeat = Get-Date
$lastCoinTime  = [DateTime]::MinValue
$lastCoinMonto = 0

Write-Log "Iniciando loop principal..."

while ($true) {

    # ─── Auto-conexión/reconexión ────────────────────────────────────
    if (-not $port.IsOpen) {
        Write-Log "Abriendo COM5..."
        try {
            $port.Open()
            $port.Write("INT0000001`r`n")
            Write-Log "COM5 ABIERTO y aceptador HABILITADO"
            $buffer = ""
        } catch {
            Write-Log "ERROR abriendo COM5: $_ - reintentando en 3s"
            Start-Sleep -Seconds 3
            continue
        }
    }

    # ─── 1. LEER MONEDAS INSERTADAS ─────────────────────────────────
    try {
        if ($port.BytesToRead -gt 0) {
            $buffer += $port.ReadExisting()

            while ($buffer -match "`n") {
                $idx    = $buffer.IndexOf("`n")
                $line   = $buffer.Substring(0, $idx).Trim()
                $buffer = $buffer.Substring($idx + 1)

                if ($line -ne '') {
                    Write-Log "RX: $line"

                    if ($line -match 'INT000([0-9A-Fa-f]+)018') {
                        $hex   = $matches[1]
                        $monto = [Convert]::ToInt32($hex, 16)

                        # Debounce: ignorar misma moneda dentro de 300ms
                        $ahora = Get-Date
                        $diff  = ($ahora - $lastCoinTime).TotalMilliseconds
                        if ($monto -eq $lastCoinMonto -and $diff -lt 300) {
                            Write-Log "REBOTE ignorado: $monto ($([int]$diff)ms)"
                        } else {
                            Write-Log "MONEDA DETECTADA: $monto"
                            $lastCoinTime  = $ahora
                            $lastCoinMonto = $monto

                            Update-Saldo   $monto
                            Update-Inventory $monto

                            # Signal para compatibilidad con el front-end
                            @{ monto=$monto; timestamp=(Get-Date -Format "yyyy-MM-dd HH:mm:ss"); hex=$hex } `
                                | ConvertTo-Json -Compress | Set-Content -Path $signalFile -Force
                        }
                    }
                }
            }
        }
    } catch {
        Write-Log "Error leyendo serial: $_ - reconectando"
        try { $port.Close() } catch {}
        continue
    }

        # ─── 2. DISPENSAR (monedero_dispense_queue.json) ────────────────
        if ((Test-Path $dispenseQueue) -and $port.IsOpen) {
            $cmdRaw = $null
            try { $cmdRaw = Get-Content $dispenseQueue -Raw | ConvertFrom-Json } catch {}

            if ($cmdRaw -and $cmdRaw.status -eq 'RAW_CMD') {
                # Comando raw directo al hardware (para diagnóstico de tubos)
                Remove-Item $dispenseQueue -Force -ErrorAction SilentlyContinue
                $rawCmd = "$($cmdRaw.comando)`r`n"
                Write-Log "RAW_CMD: $($cmdRaw.comando)"
                try {
                    $port.Write($rawCmd)
                    Start-Sleep -Milliseconds 600
                    $rxBuf = ""
                    $deadline = (Get-Date).AddMilliseconds(800)
                    while ((Get-Date) -lt $deadline) {
                        if ($port.BytesToRead -gt 0) { $rxBuf += $port.ReadExisting() }
                        Start-Sleep -Milliseconds 50
                    }
                    Write-Log "RAW_RX: $rxBuf"
                    @{ success=$true; rx=$rxBuf; timestamp=[int][double]::Parse((Get-Date -UFormat %s)) } `
                        | ConvertTo-Json -Compress | Set-Content -Path $dispenseResp -Force
                } catch {
                    Write-Log "RAW_CMD ERROR: $_"
                    @{ success=$false; error="$_"; timestamp=[int][double]::Parse((Get-Date -UFormat %s)) } `
                        | ConvertTo-Json -Compress | Set-Content -Path $dispenseResp -Force
                }
            } elseif ($cmdRaw -and $cmdRaw.status -eq 'PENDING') {
                # Borrar cola solo después de confirmar que el puerto está abierto
                Remove-Item $dispenseQueue -Force -ErrorAction SilentlyContinue
                Write-Log "DISPENSANDO: $($cmdRaw.monto)"

                $totalDispensado = 0
                $errores         = @()

                foreach ($prop in $cmdRaw.desglose.PSObject.Properties) {
                    $denom    = [int]$prop.Name
                    $cantidad = [int]$prop.Value
                    if ($cantidad -le 0) { continue }

                    $hex = $hexMap[$denom]
                    if (-not $hex) {
                        $errores += "Denominacion $denom sin hex"
                        continue
                    }

                    for ($i = 0; $i -lt $cantidad; $i++) {
                        # Verificar puerto antes de cada moneda
                        if (-not $port.IsOpen) {
                            Write-Log "Puerto cerrado mid-dispense, reabriendo..."
                            try {
                                $port.Open()
                                $port.Write("INT0000001`r`n")
                                Start-Sleep -Milliseconds 300
                            } catch {
                                $errores += "Puerto cerrado al dispensar $denom"
                                break
                            }
                        }
                        $cmdStr = "INT000${hex}003`r`n"
                        $port.Write($cmdStr)
                        Write-Log "DISPENSED: $denom (cmd=$($cmdStr.Trim()))"
                        $totalDispensado += $denom
                        Start-Sleep -Milliseconds 500  # 500ms entre monedas (hardware necesita tiempo)
                    }
                }

                Write-Log "DISPENSE_DONE: $totalDispensado"
                @{
                    success          = ($errores.Count -eq 0)
                    total_dispensado = $totalDispensado
                    errores          = $errores
                    timestamp        = [int][double]::Parse((Get-Date -UFormat %s))
                } | ConvertTo-Json -Compress | Set-Content -Path $dispenseResp -Force
            }
        }

        # ─── 3. HEARTBEAT cada 30 s ─────────────────────────────────────
        if (((Get-Date) - $lastHeartbeat).TotalSeconds -ge 30) {
            Write-Log "HEARTBEAT - Puerto activo"
            $lastHeartbeat = Get-Date
        }

        Start-Sleep -Milliseconds 50
    }