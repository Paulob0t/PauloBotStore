let telcelServices = {
    tae: null,
    paquetes: null,
    internet: null,
    monederoSaldo: 0,
    saldoInterval: null,
    loadingServices: false,
    hapticEnabled: 'vibrate' in navigator
};

// Montos predefinidos para recargas TAE
const TAE_AMOUNTS = [
    { amount: 20, label: 'Recarga $20' },
    { amount: 30, label: 'Recarga $30' },
    { amount: 50, label: 'Recarga $50' },
    { amount: 100, label: 'Recarga $100' },
    { amount: 150, label: 'Recarga $150' },
    { amount: 200, label: 'Recarga $200' },
    { amount: 300, label: 'Recarga $300' },
    { amount: 500, label: 'Recarga $500' },
];

export class TelcelServices {
    static async init() {
        try {
            // Pre-cargar CSS antes de mostrar el modal
            this.preloadStyles();
            await this.obtenerSaldoMonedero();
            // Usar requestAnimationFrame para renderizado más suave
            requestAnimationFrame(() => {
                this.render();
                this.wire();
                this.iniciarActualizacionSaldo();
            });
        } catch (e) {
            Swal.fire('Error', 'No se pudieron cargar los servicios de Telcel', 'error');
        }
    }

    static preloadStyles() {
        // Cargar estilos una sola vez al inicio
        if (!document.getElementById("telcel-styles")) {
            const style = document.createElement("style");
            style.id = "telcel-styles";
            style.textContent = this.getStyles();
            document.head.appendChild(style);
        }
    }

    static getStyles() {
        return `
            /* ===== TELCEL OPTIMIZADO - SIN LAG ===== */
            #telcel-kiosk-root {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0, 30, 60, 0.92);
                display: flex; align-items: center; justify-content: center; padding: 1rem;
                animation: fadeIn 0.15s ease-out; overflow: auto;
            }
            #telcel-kiosk-wrapper { 
                width: 98%; max-width: none; max-height: 96vh; 
                display: flex; align-items: center; justify-content: center; 
            }
            .telcel-main-card {
                width: 100%; max-height: 96vh; background: white; border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden; animation: slideUp 0.2s ease-out;
                display: flex; flex-direction: column;
            }
            .telcel-header {
                background: linear-gradient(135deg, #0049a8 0%, #0066cc 100%); 
                padding: 2.5rem; text-align: center; position: relative; flex-shrink: 0;
            }
            .telcel-header img {
                max-width: 180px; height: auto; filter: brightness(1.1);
            }
            .telcel-header h2 {
                color: white; margin: 1rem 0 0 0; font-weight: 700; font-size: 2.2rem;
            }
            .telcel-content { 
                padding: 3rem; background: #fafbfc; overflow-y: auto; flex: 1; 
            }
            .monedero-badge {
                display: inline-flex; align-items: center; gap: 0.6rem;
                background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);
                padding: 0.7rem 1.3rem; border-radius: 50px;
                margin-top: 1rem; border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .monedero-icon { font-size: 1.3rem; }
            .monedero-label { color: rgba(255, 255, 255, 0.9); font-weight: 600; font-size: 0.95rem; }
            .monedero-amount { color: white; font-weight: 800; font-size: 1.2rem; }
            .step-chip {
                display: inline-flex; align-items: center; gap: 0.5rem; 
                background: white; color: #0049a8;
                font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; 
                border-radius: 12px; border: 2px solid #b3d9ff; margin-bottom: 2rem;
            }
            .section-title { 
                font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1.2rem; 
            }
            .input-wrap { position: relative; margin-bottom: 1.2rem; }
            .input-wrap input {
                width: 100%; padding: 1.1rem 4rem 1.1rem 1.3rem; 
                border: 2px solid #e2e8f0; border-radius: 12px;
                font-size: 1.1rem; transition: border-color 0.15s ease, box-shadow 0.15s ease; 
                background: white; color: #1e293b; font-weight: 500;
            }
            .input-wrap input::placeholder { color: #94a3b8; font-weight: 400; }
            .input-wrap input:focus {
                outline: none; border-color: #0049a8; background: white;
                box-shadow: 0 0 0 3px rgba(0, 73, 168, 0.1);
            }
            .state-icon {
                position: absolute; right: 1.3rem; top: 50%; transform: translateY(-50%);
                font-weight: 700; font-size: 1.3rem; transition: all 0.15s ease;
            }
            .state-icon.ok { color: #10b981; }
            .state-icon.err { color: #ef4444; }
            .error-message {
                color: #dc2626; font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; 
                display: none; padding: 0.7rem 1rem; background: #fef2f2; 
                border-left: 3px solid #dc2626; border-radius: 8px;
            }
            .hint-card {
                background: white; border: 2px solid #b3d9ff; border-radius: 12px; 
                padding: 1.5rem; margin-bottom: 1.5rem;
            }
            .hint-list { list-style: none; padding: 0; margin: 0; }
            .hint-item {
                display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.8rem;
                font-size: 0.95rem; color: #475569; line-height: 1.5;
            }
            .hint-item:last-child { margin-bottom: 0; }
            .hint-icon {
                display: inline-flex; align-items: center; justify-content: center; 
                min-width: 26px; height: 26px; background: #0049a8; color: white; 
                border-radius: 50%; font-size: 0.75rem; font-weight: 700;
            }
            .step-header {
                display: flex; justify-content: space-between; align-items: center; 
                margin-bottom: 1.5rem; padding-bottom: 1.2rem; border-bottom: 2px solid #e2e8f0; 
                flex-wrap: wrap; gap: 1rem;
            }
            .button-group {
                display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; 
                border-top: 2px solid #e2e8f0; justify-content: flex-end; align-items: center;
            }
            .modern-btn {
                padding: 0.9rem 1.8rem; border: none; border-radius: 10px; 
                font-weight: 600; font-size: 1rem; cursor: pointer; 
                transition: all 0.15s ease; min-width: 130px;
            }
            .modern-btn:active { transform: scale(0.98); }
            .btn-primary-telcel {
                background: linear-gradient(135deg, #0049a8 0%, #0066cc 100%); 
                color: white; box-shadow: 0 4px 12px rgba(0, 73, 168, 0.3);
            }
            .btn-primary-telcel:hover { 
                box-shadow: 0 6px 18px rgba(0, 73, 168, 0.4); 
            }
            .btn-primary-telcel:disabled {
                opacity: 0.5; cursor: not-allowed; box-shadow: none;
            }
            .btn-secondary-telcel {
                background: white; color: #475569; border: 2px solid #e2e8f0;
            }
            .btn-secondary-telcel:hover {
                background: #f8fafc; border-color: #cbd5e1;
            }
            .tab-buttons {
                display: flex; gap: 0.8rem; margin-bottom: 2rem; flex-wrap: wrap;
            }
            .tab-btn {
                padding: 0.9rem 1.5rem; background: white; border: 2px solid #e2e8f0;
                border-radius: 10px; font-weight: 600; cursor: pointer;
                transition: all 0.15s ease; font-size: 0.95rem; color: #475569;
            }
            .tab-btn:hover {
                border-color: #0049a8; color: #0049a8;
            }
            .tab-btn.active {
                background: linear-gradient(135deg, #0049a8 0%, #0066cc 100%);
                color: white; border-color: transparent; transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(0, 73, 168, 0.3);
            }
            .tab-content {
                min-height: 200px;
            }
            .tab-pane {
                display: none;
            }
            .service-grid { 
                display: grid; grid-template-columns: repeat(3, 1fr); 
                gap: 1rem; margin-top: 1.2rem; 
            }
            .service-item {
                background: white; border: 2px solid #e2e8f0; border-radius: 12px; 
                padding: 1.3rem; cursor: pointer; transition: all 0.15s ease; 
                display: flex; flex-direction: column; gap: 0.7rem;
                position: relative; min-height: 140px;
            }
            .service-item::before {
                content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
                background: #0049a8; transform: scaleX(0); transition: transform 0.15s ease;
            }
            .service-item:hover:not(.insufficient-funds) {
                transform: translateY(-2px); border-color: #0049a8; 
                box-shadow: 0 8px 20px rgba(0, 73, 168, 0.15);
            }
            .service-item:hover::before { transform: scaleX(1); }
            .service-item.selected {
                background: #fff9d8 !important; border-color: #0049a8;
                box-shadow: 0 4px 12px rgba(0, 73, 168, 0.2);
            }
            .service-item.selected::before { transform: scaleX(1); }
            .service-item .service-name { 
                font-weight: 600; font-size: 0.98rem; color: #1e293b; line-height: 1.3; 
            }
            .service-item .service-price {
                display: inline-block; background: #0049a8;
                color: white; padding: 0.5rem 1rem; border-radius: 8px; 
                font-weight: 700; font-size: 1.2rem; align-self: flex-start;
            }
            .service-item.insufficient-funds {
                opacity: 0.5; cursor: not-allowed; filter: grayscale(0.6);
            }
            .service-item.insufficient-funds::after {
                content: "Saldo insuficiente"; position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%); background: rgba(220, 38, 38, 0.95);
                color: white; padding: 0.5rem 1rem; border-radius: 8px;
                font-weight: 700; font-size: 0.85rem; white-space: nowrap;
            }
            .step-screen { 
                opacity: 1; transform: translateX(0); 
                transition: opacity 0.15s ease, transform 0.15s ease; 
            }
            .hidden-step { display: none !important; }
            .pre-enter-right { opacity: 0; transform: translateX(15px); }
            .pre-enter-left { opacity: 0; transform: translateX(-15px); }
            .slide-out-left { opacity: 0; transform: translateX(-15px); }
            .slide-out-right { opacity: 0; transform: translateX(15px); }
            #telcel-kiosk-footer {
                padding: 1.3rem 2rem; background: white; border-top: 2px solid #e2e8f0; 
                display: flex; justify-content: center; align-items: center; gap: 1rem;
                flex-shrink: 0; border-radius: 0 0 16px 16px;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { 
                from { opacity: 0; transform: translateY(30px); } 
                to { opacity: 1; transform: translateY(0); } 
            }
            @media (max-width: 768px) {
                #telcel-kiosk-root { padding: 0; }
                .telcel-main-card { 
                    width: 100%; border-radius: 0; min-height: 100vh; 
                    max-width: 100%; max-height: 100vh; 
                }
                .telcel-header { padding: 2rem 1.5rem; }
                .telcel-content { padding: 2rem 1.5rem; }
                .service-grid { grid-template-columns: 1fr; gap: 1rem; }
                .tab-buttons { flex-direction: column; }
                .tab-btn { width: 100%; }
            }
        `;
    }

    static async obtenerSaldoMonedero() {
        try {
            const response = await fetch('monedero_api.php?action=get_saldo');
            const data = await response.json();
            if (data.success) {
                const nuevoSaldo = parseFloat(data.saldo) || 0;
                telcelServices.monederoSaldo = nuevoSaldo;
                this.actualizarBadgeSaldo();
            }
        } catch (error) {
            telcelServices.monederoSaldo = 0;
            this.actualizarBadgeSaldo();
        }
    }

    static actualizarBadgeSaldo() {
        const badgeElement = document.getElementById('telcel-saldo');
        if (badgeElement) {
            const saldoAnterior = parseFloat(badgeElement.textContent.replace(/[^0-9.]/g, '')) || 0;
            const saldoNuevo = telcelServices.monederoSaldo;
            
            // Animación de conteo progresivo solo para el badge de Telcel
            if (Math.abs(saldoNuevo - saldoAnterior) > 0.01) {
                const duracion = 500; // duración en ms
                const inicio = performance.now();
                const diferencia = saldoNuevo - saldoAnterior;
                
                const animar = (tiempoActual) => {
                    const progreso = Math.min((tiempoActual - inicio) / duracion, 1);
                    const valorActual = saldoAnterior + (diferencia * progreso);
                    
                    badgeElement.textContent = `$${valorActual.toFixed(2)}`;
                    
                    if (progreso < 1) {
                        requestAnimationFrame(animar);
                    } else {
                        badgeElement.textContent = `$${saldoNuevo.toFixed(2)}`;
                        
                        // Efecto de escala al finalizar
                        badgeElement.style.transform = 'scale(1.2)';
                        badgeElement.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        setTimeout(() => {
                            badgeElement.style.transform = 'scale(1)';
                        }, 300);
                    }
                };
                
                requestAnimationFrame(animar);
            } else {
                badgeElement.textContent = `$${saldoNuevo.toFixed(2)}`;
            }
        }
        
        // SOLO actualizar el saldo interno del MonederoIntegration
        // NO tocar sus elementos del DOM - MonederoIntegration se encarga de eso
        if (typeof MonederoIntegration !== 'undefined') {
            // Solo actualizar el valor interno si cambió
            if (MonederoIntegration.saldoActual !== telcelServices.monederoSaldo) {
                MonederoIntegration.saldoActual = telcelServices.monederoSaldo;
            }
        }
    }

    static async descontarSaldo(monto) {
        try {
            // Calcular nuevo saldo
            const nuevoSaldo = Math.max(0, telcelServices.monederoSaldo - monto);
            
            // 🔥 ACTUALIZAR INMEDIATAMENTE en UI ANTES de esperar backend
            telcelServices.monederoSaldo = nuevoSaldo;
            this.actualizarBadgeSaldo();
            
            // Actualizar MonederoIntegration inmediatamente
            if (typeof MonederoIntegration !== 'undefined') {
                MonederoIntegration.actualizarSaldo(nuevoSaldo);
            }
            
            // 🔔 DISPARAR EVENTO para que todo se sincronice
            window.dispatchEvent(new CustomEvent('monederoSaldoChanged', {
                detail: { saldo: nuevoSaldo, diferencia: -monto }
            }));
            
            // Establecer el nuevo saldo en el backend (async en background)
            const response = await fetch('monedero_api.php?action=set_saldo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `saldo=${nuevoSaldo}`
            });
            const data = await response.json();
            
            if (!data.success) {
                console.error('Error al actualizar saldo en backend:', data);
            }
        } catch (error) {
            console.error('Error al descontar saldo:', error);
        }
    }

    static iniciarActualizacionSaldo() {
        if (telcelServices.saldoInterval) {
            clearInterval(telcelServices.saldoInterval);
        }
        
        // Sincronizar con MonederoIntegration en lugar de hacer polling independiente
        telcelServices.saldoInterval = setInterval(() => {
            // Si existe MonederoIntegration, usar su saldo directamente
            if (typeof MonederoIntegration !== 'undefined') {
                const nuevoSaldo = MonederoIntegration.saldoActual;
                
                // Solo actualizar si el saldo cambió
                if (nuevoSaldo !== telcelServices.monederoSaldo) {
                    telcelServices.monederoSaldo = nuevoSaldo;
                    this.actualizarBadgeSaldo();
                    this.marcarServiciosInsuficientes();
                }
            } else {
                // Fallback: si no existe MonederoIntegration, hacer polling normal
                this.obtenerSaldoMonedero().then(() => {
                    this.marcarServiciosInsuficientes();
                });
            }
        }, 200); // Chequeo rápido para estar sincronizado
    }

    static detenerActualizacionSaldo() {
        if (telcelServices.saldoInterval) {
            clearInterval(telcelServices.saldoInterval);
            telcelServices.saldoInterval = null;
        }
    }

    // 🎨 Helper: Mostrar mensaje de saldo insuficiente
    static mostrarSaldoInsuficiente(price) {
        const comision = 2;
        const total = price + comision;
        const faltante = total - telcelServices.monederoSaldo;
        Swal.fire({
            title: '💰 Saldo insuficiente',
            html: `
                <div style="text-align: center; padding: 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💸</div>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                        Monto recarga: <strong style="color: #0049a8;">$${price.toFixed(2)}</strong>
                    </p>
                    <p style="font-size: 0.95rem; margin-bottom: 1rem; color: #6b7280;">
                        Comisión: <strong>+$${comision.toFixed(2)}</strong>
                    </p>
                    <hr style="margin: 1rem 0; border: none; border-top: 2px solid #e5e7eb;">
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                        Total necesario: <strong style="color: #dc2626;">$${total.toFixed(2)}</strong>
                    </p>
                    <p style="font-size: 1rem; color: #6b7280; margin-bottom: 1rem;">
                        Tu saldo actual: <strong style="color: #7c3aed;">$${telcelServices.monederoSaldo.toFixed(2)}</strong>
                    </p>
                    <p style="font-size: 1.2rem; font-weight: 700; color: #f59e0b;">
                        Te faltan: $${faltante.toFixed(2)}
                    </p>
                    <div style="margin-top: 1.5rem; padding: 1rem; background: #fef3c7; border-radius: 8px;">
                        <p style="margin: 0; color: #92400e;">
                            🪙 Inserta más monedas o billetes
                        </p>
                    </div>
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#0049a8'
        });
    }

    // 🎉 Helper: Mostrar mensaje de recarga exitosa
    static async mostrarRecargaExitosa(name, phone, price, codeDesc = null) {
        // Vibración de éxito
        this.hapticFeedback('success');
        
        const comision = 2;
        const totalCobrado = price + comision;
        const saldoInicial = telcelServices.monederoSaldo + totalCobrado; // Saldo antes de descontar
        const cambio = saldoInicial - totalCobrado;
        
        await Swal.fire({
            title: '✅ ¡Recarga exitosa!',
            html: `
                <div style="text-align: left; padding: 1.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 2px solid #86efac;">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 4rem; animation: bounce 1s ease;">📱</div>
                    </div>
                    <p style="margin: 0.75rem 0; font-size: 1.05rem;"><strong>📱 Servicio:</strong> ${name}</p>
                    <p style="margin: 0.75rem 0; font-size: 1.05rem;"><strong>📞 Número:</strong> <span style="color: #0049a8;">${phone}</span></p>
                    ${codeDesc ? `<p style="margin: 0.75rem 0; font-size: 0.95rem; color: #6b7280;"><strong>Estado:</strong> ${codeDesc}</p>` : ''}
                    <hr style="margin: 1.5rem 0; border: none; border-top: 2px dashed #86efac;">
                    <p style="margin: 0.75rem 0; font-size: 1.2rem;"><strong>💰 Saldo insertado:</strong> <span style="color: #7c3aed; font-weight: 700;">$${saldoInicial.toFixed(2)}</span></p>
                    <p style="margin: 0.75rem 0; font-size: 1.2rem;"><strong>💳 Costo recarga:</strong> <span style="color: #dc2626; font-weight: 700;">-$${price.toFixed(2)}</span></p>
                    <p style="margin: 0.75rem 0; font-size: 1rem; color: #6b7280;"><strong>🏷️ Comisión:</strong> <span style="color: #f59e0b; font-weight: 600;">-$${comision.toFixed(2)}</span></p>
                    <hr style="margin: 1.5rem 0; border: none; border-top: 3px solid #22c55e;">
                    <p style="margin: 0.75rem 0; font-size: 1.5rem; text-align: center;"><strong>💵 Tu cambio:</strong> <span style="color: #10b981; font-weight: 800;">$${cambio.toFixed(2)}</span></p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Perfecto',
            confirmButtonColor: '#0049a8',
            timer: 5000,
            timerProgressBar: true
        });
        
        // 💸 DESCONTAR saldo DESPUÉS de mostrar alerta
        await this.descontarSaldo(totalCobrado);
        
        // Confetti effect
        this.showConfetti();
    }

    // 🔔 Helper: Vibración háptica
    static hapticFeedback(type = 'light') {
        if (!telcelServices.hapticEnabled) return;
        
        try {
            switch(type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate([30, 10, 30]);
                    break;
                case 'success':
                    navigator.vibrate([20, 10, 20, 10, 40]);
                    break;
                case 'error':
                    navigator.vibrate([50, 30, 50]);
                    break;
            }
        } catch (e) {
            // Vibration not supported
        }
    }

    // 🎊 Helper: Efecto confetti
    static showConfetti() {
        const colors = ['#0049a8', '#0066cc', '#00d4ff', '#10b981', '#f59e0b'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    // 🍞 Helper: Toast notification
    static showToast(message, type = 'info', duration = 3000) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div style="font-size: 1.5rem;">${icons[type]}</div>
            <div style="font-weight: 600; color: #1e293b;">${message}</div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // 💀 Helper: Skeleton loader
    static showSkeletonLoader(container) {
        const skeletonHTML = `
            <div class="skeleton-loader">
                ${Array(6).fill(0).map(() => `
                    <div class="skeleton-item">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line price"></div>
                    </div>
                `).join('')}
            </div>
        `;
        container.innerHTML = skeletonHTML;
    }

    static async loadTAE(phone = '') {
        telcelServices.loadingServices = true;
        const container = document.getElementById('tae-services');
        if (container) this.showSkeletonLoader(container);
        
        try {
            telcelServices.tae = TAE_AMOUNTS.map(item => ({
                sku: '',
                formatted_name: item.label,
                description: 'Recarga Telcel',
                price_display: `$${item.amount.toFixed(2)}`,
                amount: item.amount
            }));
        } catch (err) { 
            telcelServices.tae = []; 
        }
    }

    static async loadPaquetes(phone = '') {
        try {
            const cacheKey = `telcel_paquetes_${phone}`;
            const cached = window.ServiceCache?.get(cacheKey);
            if (cached) { 
                telcelServices.paquetes = cached;
                return; 
            }
            const url = phone ? `telcel_paquetes_amigo.php?phone=${encodeURIComponent(phone)}` : 'telcel_paquetes_amigo.php';
            const r = await fetch(url, { cache: 'no-store' });
            const d = await r.json();
            const list = d?.services || [];
            telcelServices.paquetes = list;
            window.ServiceCache?.set(cacheKey, list);
        } catch (err) { 
            telcelServices.paquetes = []; 
        }
    }

    static async loadInternet(phone = '') {
        try {
            const cacheKey = `telcel_internet_${phone}`;
            const cached = window.ServiceCache?.get(cacheKey);
            if (cached) { telcelServices.internet = cached; return; }
            const url = phone ? `telcel_internet_amigo.php?phone=${encodeURIComponent(phone)}` : 'telcel_internet_amigo.php';
            const r = await fetch(url);
            const d = await r.json();
            const list = d?.services || [];
            telcelServices.internet = list;
            window.ServiceCache?.set(cacheKey, list);
        } catch (err) { 
            telcelServices.internet = []; 
        }
    }

    static render() {
        // ⚠️ CSS LOADER DESACTIVADO - Los estilos ahora están en shop-carousel.css
        // if (!document.getElementById('telcel-styles')) {
        //     const link = document.createElement('link');
        //     link.id = 'telcel-styles';
        //     link.rel = 'stylesheet';
        //     link.href = 'css/telcel-services.css';
        //     document.head.appendChild(link);
        // }

        const bodyHTML = `
          <div class="telcel-main-card">
            <div class="telcel-header">
              <img src="images/providers/telcel.jpg" alt="Telcel" />
              <h2>Servicios Telcel</h2>
              <div class="monedero-badge">
                <span class="monedero-icon">💰</span>
                <span class="monedero-label">Saldo:</span>
                <span class="monedero-amount" id="telcel-saldo">$${telcelServices.monederoSaldo.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="telcel-content">
              <!-- Step 1: Captura de número -->
              <div id="phone-step" class="step-screen">
                <div class="step-chip">📱 Paso 1: Ingresa tu número telefónico</div>
                
                <div class="section-title">Número de teléfono</div>
                
                <div class="hint-card">
                  <ul class="hint-list">
                    <li class="hint-item"><span class="hint-icon">①</span><span>Escribe tu número celular de 10 dígitos</span></li>
                    <li class="hint-item"><span class="hint-icon">②</span><span>Confírmalo en el segundo campo</span></li>
                    <li class="hint-item"><span class="hint-icon">③</span><span>Haz clic en "Continuar"</span></li>
                  </ul>
                </div>

                <div class="input-wrap">
                  <input type="tel" id="phone-number" placeholder="Número Telcel (10 dígitos)" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autofocus />
                  <span class="state-icon" id="phone1-state"></span>
                </div>
                
                <div class="input-wrap">
                  <input type="tel" id="phone-number-confirm" placeholder="Confirma el número" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" />
                  <span class="state-icon" id="phone2-state"></span>
                </div>
                
                <div id="phone-error" class="error-message">Los números no coinciden</div>
                
                <div class="button-group">
                  <button id="close-from-phones" class="modern-btn btn-secondary-telcel">Cerrar</button>
                  <button id="next-step" class="modern-btn btn-primary-telcel" disabled>Continuar →</button>
                </div>
              </div>
              
              <!-- Step 2: Selección de categoría y servicio -->
              <div id="tabs-step" class="service-tabs step-screen hidden-step">
                <div class="step-header">
                  <div class="step-chip">📋 Paso 2: Elige tu servicio</div>
                  <button id="back-from-tabs" class="modern-btn btn-secondary-telcel">← Regresar</button>
                </div>
                
                <div class="hint-card">
                  <div class="hint-item">
                    <span class="hint-icon">ℹ</span>
                    <span>Selecciona una categoría y luego el servicio que necesitas</span>
                  </div>
                </div>
                
                <div class="tab-buttons">
                  <button class="tab-btn" data-tab="tae">💰 Recargas</button>
                  <button class="tab-btn" data-tab="paquetes">📦 Paquetes</button>
                  <button class="tab-btn" data-tab="internet">🌐 Internet</button>
                </div>
                
                <div class="tab-content">
                  <div id="tab-empty" style="padding:2rem; text-align:center; color:#6b7280; font-size:1.1rem;">
                    👆 Selecciona una categoría para ver los servicios disponibles
                  </div>
                  <div class="tab-pane" data-tab="tae" style="display:none;">
                    <div class="service-grid"></div>
                  </div>
                  <div class="tab-pane" data-tab="paquetes" style="display:none;">
                    <div class="service-grid"></div>
                  </div>
                  <div class="tab-pane" data-tab="internet" style="display:none;">
                    <div class="service-grid"></div>
                  </div>
                </div>
                
                <div class="button-group" style="margin-top: 3rem;">
                  <button class="modern-btn btn-primary-telcel" id="process-service" style="display:none;" disabled>💳 Pagar</button>
                </div>
              </div>
            </div>
            
            <div id="telcel-kiosk-footer">
              <button class="modern-btn btn-secondary-telcel" id="cancel-service">Cerrar</button>
            </div>
          </div>
        `;

        const footerHTML = ``;

        TelcelServices.openOverlay({ title: 'Servicios Telcel', bodyHTML, footerHTML });
    }

    static renderList(list) {
        if (list === null) return '<p style="text-align:center; padding:2rem; color:#6b7280; font-size:1.1rem;">⏳ Cargando servicios...</p>';
        if (!Array.isArray(list) || list.length === 0) return '<p style="text-align:center; padding:2rem; color:#6b7280; font-size:1.1rem;">📭 No hay servicios disponibles</p>';
        return list.map(s => `
            <div class="service-item" data-sku="${s.sku}">
                <div class="service-name">${s.formatted_name}</div>
                ${s.description ? `<div style="font-size:0.9rem; color:#6b7280; margin-top:0.5rem;">${s.description}</div>` : ''}
                <div class="service-price">${s.price_display}</div>
                <div style="font-size:0.85rem; color:#9ca3af; margin-top:0.5rem;">SKU: ${s.sku}</div>
            </div>
        `).join('');
    }

    static updateList(tab, list) {
        const target = document.querySelector(`.tab-pane[data-tab="${tab}"] .service-grid`);
        if (target) {
            target.innerHTML = this.renderList(list);
            this.marcarServiciosInsuficientes();
        }
    }

    static marcarServiciosInsuficientes() {
        const items = document.querySelectorAll('.service-item');
        if (items.length === 0) return; // No hay servicios cargados aún
        
        const comision = 2;
        
        items.forEach(item => {
            const priceElement = item.querySelector('.service-price');
            if (!priceElement) return;
            
            const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) || 0;
            const total = price + comision;
            
            if (total > telcelServices.monederoSaldo) {
                if (!item.classList.contains('insufficient-funds')) {
                    item.classList.add('insufficient-funds');
                }
            } else {
                if (item.classList.contains('insufficient-funds')) {
                    item.classList.remove('insufficient-funds');
                }
            }
        });
    }

    static wire() {
        const body = document.querySelector('.telcel-main-card');
        const footer = document.getElementById('telcel-kiosk-footer');
        if (!body || !footer) return;

        if (TelcelServices._h) {
            const { c1, c2, c3, i1, i2 } = TelcelServices._h;
            if (c1) body.removeEventListener('click', c1);
            if (c2) body.removeEventListener('input', c2);
            if (c3) footer.removeEventListener('click', c3);
            try {
                const p = body.querySelector('#phone-number');
                const c = body.querySelector('#phone-number-confirm');
                if (p && i1) { ['input', 'keyup', 'change', 'paste'].forEach(ev => p.removeEventListener(ev, i1)); }
                if (c && i2) { ['input', 'keyup', 'change', 'paste'].forEach(ev => c.removeEventListener(ev, i2)); }
            } catch { }
        }

        const isValid10 = v => /^[0-9]{10}$/.test(v || '');
        const showStep = (fromEl, toEl, direction = 'right') => {
            if (!fromEl || !toEl) return;
            requestAnimationFrame(() => {
                toEl.classList.add('pre-enter-' + (direction === 'right' ? 'right' : 'left'));
                fromEl.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
                setTimeout(() => {
                    fromEl.classList.add('hidden-step');
                    fromEl.classList.remove('slide-out-left', 'slide-out-right');
                    toEl.classList.remove('hidden-step');
                    requestAnimationFrame(() => {
                        toEl.classList.remove('pre-enter-right', 'pre-enter-left');
                    });
                }, 120);
            });
        };
        const validate = () => {
            const phone = body.querySelector('#phone-number');
            const confirm = body.querySelector('#phone-number-confirm');
            const err = body.querySelector('#phone-error');
            const next = body.querySelector('#next-step');
            const btn = body.querySelector('#process-service');
            const selected = body.querySelector('.service-item.selected');
            const s1 = body.querySelector('#phone1-state');
            const s2 = body.querySelector('#phone2-state');
            const p = (phone?.value || '').replace(/\D/g, '');
            const c = (confirm?.value || '').replace(/\D/g, '');
            if (phone && phone.value !== p) phone.value = p.slice(0, 10);
            if (confirm && confirm.value !== c) confirm.value = c.slice(0, 10);
            const ok = isValid10(p);
            const cok = isValid10(c);
            const match = ok && cok && p === c;
            if (err) err.style.display = (c.length > 0 && !match) ? 'block' : 'none';
            if (s1) { 
                s1.textContent = ok ? '✓' : (p.length ? '!' : ''); 
                s1.className = 'state-icon ' + (ok ? 'ok' : (p.length ? 'err' : '')); 
            }
            if (s2) { 
                s2.textContent = (c.length ? (match ? '✓' : '!') : ''); 
                s2.className = 'state-icon ' + ((c.length && match) ? 'ok' : (c.length ? 'err' : '')); 
            }
            if (next) next.disabled = !match;
            if (btn) {
                btn.style.display = selected ? 'inline-block' : 'none';
                btn.disabled = !(selected && match);
            }
            
            // 🎯 Auto-avance: si phone tiene 10 dígitos, mover foco a confirm
            if (ok && document.activeElement === phone && !c) {
                confirm?.focus();
            }
            // 🎯 Auto-avance: si confirm tiene 10 dígitos y coinciden, enfocar botón
            if (match && document.activeElement === confirm) {
                next?.focus();
            }
        };
        const onClick = (e) => {
            const tab = e.target.closest('.tab-btn');
            if (tab) {
                // Vibración al cambiar de tab
                TelcelServices.hapticFeedback('light');
                
                const id = tab.dataset.tab;
                body.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tab.classList.add('active');
                body.querySelector('#tab-empty')?.setAttribute('style', 'display:none;');
                body.querySelectorAll('.tab-pane').forEach(p => { p.style.display = (p.dataset.tab === id) ? 'block' : 'none'; });
                body.querySelectorAll('.service-item.selected').forEach(i => { i.classList.remove('selected'); i.style.background = 'white'; });
                
                const paneGrid = body.querySelector(`.tab-pane[data-tab="${id}"] .service-grid`);
                const phone = (body.querySelector('#phone-number')?.value || '').replace(/\D/g, '').slice(0, 10);
                const ensureLoaded = async () => {
                    if (id === 'tae' && telcelServices.tae === null) { await TelcelServices.loadTAE(phone); }
                    if (id === 'paquetes' && telcelServices.paquetes === null) { await TelcelServices.loadPaquetes(phone); }
                    if (id === 'internet' && telcelServices.internet === null) { await TelcelServices.loadInternet(phone); }
                    TelcelServices.updateList(id, telcelServices[id] || []);
                    // Forzar actualización de marcas después de cargar
                    setTimeout(() => TelcelServices.marcarServiciosInsuficientes(), 100);
                };
                if (paneGrid && !paneGrid.innerHTML.trim()) {
                    paneGrid.innerHTML = '<p style="text-align:center; color:#777; padding:14px;">Cargando...</p>';
                    ensureLoaded().then(() => { });
                }
                
                validate();
                return;
            }
            const item = e.target.closest('.service-item');
            if (item) {
                if (item.classList.contains('insufficient-funds')) {
                    // Vibración de error
                    TelcelServices.hapticFeedback('error');
                    const price = parseFloat(item.querySelector('.service-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;
                    TelcelServices.mostrarSaldoInsuficiente(price);
                    return;
                }
                // Vibración de selección
                TelcelServices.hapticFeedback('light');
                body.querySelectorAll('.service-item.selected').forEach(i => { i.classList.remove('selected'); i.style.background = 'white'; });
                item.classList.add('selected');
                item.style.background = '#fff9d8';
                validate();
                return;
            }
            
            // Manejar click en botón de pagar
            if (e.target.closest('#process-service')) {
                // Vibración media al procesar
                TelcelServices.hapticFeedback('medium');
                const selected = body.querySelector('.service-item.selected');
                const phone = (body.querySelector('#phone-number')?.value || '').slice(0, 10);
                
                if (!selected || !isValid10(phone)) { 
                    Swal.fire('Error', 'Selecciona un servicio y número válido', 'error'); 
                    return; 
                }
                
                const name = selected.querySelector('.service-name')?.textContent?.trim() || 'Servicio Telcel';
                const priceTxt = selected.querySelector('.service-price')?.textContent || '$0';
                const sku = selected.dataset.sku || ''; // SKU puede estar vacío para recargas
                const price = parseFloat(priceTxt.replace(/[^0-9.]/g, '')) || 0;
                const comision = 2;
                const total = price + comision;
                
                // Validar saldo del monedero (incluyendo comisión)
                if (total > telcelServices.monederoSaldo) {
                    TelcelServices.mostrarSaldoInsuficiente(price);
                    return;
                }
                
                // 🚀 Usar el nuevo payment handler con Point + Efectivo
                if (window.ServicePaymentHandler) {
                    window.ServicePaymentHandler.showPaymentOptions({
                        serviceName: name,
                        reference: phone,
                        amount: price,
                        commission: comision,
                        sku: sku,
                        requiresRegionalization: true
                    }, async (paymentResult) => {
                        // Solo mostrar alerta si el pago fue exitoso
                        if (paymentResult && paymentResult.success) {
                            // mostrarRecargaExitosa ya descuenta el saldo internamente
                            await TelcelServices.mostrarRecargaExitosa(name, phone, price);
                            TelcelServices.closeOverlay();
                        }
                    });
                } else {
                    // Fallback: método directo (legacy)
                    Swal.fire({
                        title: '💳 Confirmar pago',
                        html: `
                            <div style="text-align: left; padding: 1.5rem; background: #f9fafb; border-radius: 12px;">
                                <p style="margin: 0.75rem 0; font-size: 1.1rem;"><strong>📱 Servicio:</strong> ${name}</p>
                                <p style="margin: 0.75rem 0; font-size: 1.1rem;"><strong>📞 Número:</strong> <span style="color: #0049a8;">${phone}</span></p>
                                <hr style="margin: 1rem 0; border: none; border-top: 2px solid #e5e7eb;">
                                <p style="margin: 0.75rem 0; font-size: 1.1rem;"><strong>Monto recarga:</strong> <span style="color: #0049a8;">$${price.toFixed(2)}</span></p>
                                <p style="margin: 0.75rem 0; font-size: 1rem; color: #6b7280;"><strong>Comisión:</strong> +$${comision.toFixed(2)}</p>
                                <hr style="margin: 1rem 0; border: none; border-top: 3px solid #0049a8;">
                                <p style="margin: 0.75rem 0; font-size: 1.4rem; text-align: center;"><strong>Total a pagar:</strong> <span style="color: #7c3aed; font-weight: 700;">$${total.toFixed(2)}</span></p>
                            </div>
                        `,
                        icon: 'question', 
                        showCancelButton: true, 
                        confirmButtonText: '✅ Confirmar',
                        confirmButtonColor: '#0049a8',
                        cancelButtonText: '❌ Cancelar',
                        cancelButtonColor: '#dc2626'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            Swal.fire({ 
                                title: '⏳ Procesando tu recarga...', 
                                html: `
                                    <div style="padding: 1rem;">
                                        <p style="color: #64748b; margin-bottom: 1.5rem;">Por favor espera un momento</p>
                                        <div class="progress-bar">
                                            <div class="progress-fill"></div>
                                        </div>
                                        <div style="margin-top: 1.5rem; text-align: center;">
                                            <div class="telcel-spinner"></div>
                                        </div>
                                    </div>
                                `,
                                allowOutsideClick: false, 
                                showConfirmButton: false, 
                                didOpen: () => Swal.showLoading() 
                            });
                            
                            const payload = { 
                                sku, 
                                amount: price, 
                                reference: phone, 
                                requiresRegionalization: true, 
                                transactionId: Date.now() 
                            };
                            
                            fetch('process_payment.php', { 
                                method: 'POST', 
                                headers: { 'Content-Type': 'application/json' }, 
                                body: JSON.stringify(payload) 
                            })
                            .then(async (r) => await r.json())
                            .then(async (d) => {
                                Swal.close();
                                
                                if (d?.success) {
                                    const codeDesc = d?.data?.payload?.codeDescription;
                                    // mostrarRecargaExitosa ya descuenta el saldo internamente
                                    await TelcelServices.mostrarRecargaExitosa(name, phone, price, codeDesc);
                                    TelcelServices.closeOverlay();
                                } else {
                                    let errorMessage = d?.error || d?.message || 'Ocurrió un error al procesar tu recarga';
                                    const codeDesc = d?.data?.payload?.codeDescription || d?.payload?.codeDescription;
                                    if (codeDesc) errorMessage += `\n\n${codeDesc}`;
                                    
                                    Swal.fire({
                                        title: '❌ Error en la recarga',
                                        text: errorMessage,
                                        icon: 'error',
                                        confirmButtonText: 'Entendido',
                                        confirmButtonColor: '#0049a8'
                                    });
                                }
                            })
                            .catch(err => {
                                Swal.close();
                                Swal.fire({
                                    title: '⚠️ Error de conexión',
                                    text: 'No se pudo conectar con el servidor. Por favor intenta de nuevo.',
                                    icon: 'error',
                                    confirmButtonText: 'Entendido',
                                    confirmButtonColor: '#0049a8'
                                });
                            });
                        }
                    });
                }
                return;
            }
        };

        // Soporte para teclado numérico: Enter avanza en cualquier paso
        body.addEventListener('keydown', (e) => {
            const phone = body.querySelector('#phone-number');
            const confirm = body.querySelector('#phone-number-confirm');
            const phoneStep = body.querySelector('#phone-step');
            const next = body.querySelector('#next-step');
            
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // Si estamos en el paso de teléfono y es válido, avanzar
                if (!phoneStep.classList.contains('hidden-step') && !next.disabled) {
                    const tabsStep = body.querySelector('#tabs-step');
                    const p = (phone?.value || '').replace(/\D/g, '').slice(0, 10);
                    if (telcelServices.tae === null) TelcelServices.loadTAE(p);
                    if (telcelServices.paquetes === null) TelcelServices.loadPaquetes(p);
                    if (telcelServices.internet === null) TelcelServices.loadInternet(p);
                    showStep(phoneStep, tabsStep, 'right');
                }
                // Si estamos en phone con 10 dígitos, pasar a confirm
                else if (e.target === phone && isValid10(phone.value)) {
                    confirm?.focus();
                }
                // Si estamos en confirm y coinciden, enfocar botón
                else if (e.target === confirm && !next.disabled) {
                    next?.focus();
                }
            }
        });

        const onFooter = (e) => {
            if (e.target.closest('#cancel-service')) { 
                TelcelServices.closeOverlay(); 
                return; 
            }
        };

        // Validación en tiempo real
        body.addEventListener('input', validate);
        
        // Re-enfocar el primer input cuando se abre el modal
        setTimeout(() => body.querySelector('#phone-number')?.focus(), 100);
        
        body.addEventListener('click', onClick);
        footer.addEventListener('click', onFooter);
        
        const next = body.querySelector('#next-step');
        if (next) {
            next.addEventListener('click', (ev) => {
                ev.preventDefault();
                const phoneStep = body.querySelector('#phone-step');
                const tabsStep = body.querySelector('#tabs-step');
                const phone = body.querySelector('#phone-number');
                const confirm = body.querySelector('#phone-number-confirm');
                const p = (phone?.value || '').replace(/\D/g, '').slice(0, 10);
                const c = (confirm?.value || '').replace(/\D/g, '').slice(0, 10);
                const match = isValid10(p) && isValid10(c) && p === c;
                if (!match) return;
                if (telcelServices.tae === null) TelcelServices.loadTAE(p);
                if (telcelServices.paquetes === null) TelcelServices.loadPaquetes(p);
                if (telcelServices.internet === null) TelcelServices.loadInternet(p);
                showStep(phoneStep, tabsStep, 'right');
            });
        }
        const backBtn = body.querySelector('#back-from-tabs');
        if (backBtn) {
            backBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                const phoneStep = body.querySelector('#phone-step');
                const tabsStep = body.querySelector('#tabs-step');
                showStep(tabsStep, phoneStep, 'left');
            });
        }
        body.querySelector('#close-from-phones')?.addEventListener('click', () => { TelcelServices.closeOverlay(); });
        footer.addEventListener('click', onFooter);
        TelcelServices._h = { c1: onClick, c2: onInput, c3: onFooter, i1: direct, i2: direct };
        validate();
    }
}

TelcelServices.openOverlay = ({ title, bodyHTML, footerHTML }) => {
    let root = document.getElementById('telcel-kiosk-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'telcel-kiosk-root';
        document.body.appendChild(root);
        root.innerHTML = `
          <div id="telcel-kiosk-wrapper">
            ${bodyHTML}
          </div>
        `;
        try { TelcelServices._prev = { h: document.documentElement.style.overflow, b: document.body.style.overflow }; document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; } catch { }
    }
};

TelcelServices.closeOverlay = () => {
    // Detener actualización del saldo
    TelcelServices.detenerActualizacionSaldo();
    
    const root = document.getElementById('telcel-kiosk-root');
    if (root) root.remove();
    try { if (TelcelServices._prev) { document.documentElement.style.overflow = TelcelServices._prev.h || ''; document.body.style.overflow = TelcelServices._prev.b || ''; TelcelServices._prev = null; } } catch { }
};

// Exportar globalmente para acceso desde index.php
if (typeof window !== 'undefined') {
    window.TelcelServices = TelcelServices;
}

