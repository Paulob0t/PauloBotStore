<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // ==========================
    // LOGIN (igual que telcel)
    // ==========================
    error_log("🔵 [Proxy] Iniciando autenticación...");
    
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://prontipagos-api-dev.domainscm.com/prontipagos-external-api-ws/ws/v1/auth/login',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => '{"username":"api.desarrollo","password":"1hFdcv4G*"}',
      CURLOPT_SSL_VERIFYPEER => false,
      CURLOPT_SSL_VERIFYHOST => false,
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
        'Accept: */*',
        'User-Agent: PostmanRuntime/7.36.1',
        'Cache-Control: no-cache',
        'Postman-Token: ' . uniqid()  
      ),
    ));

    $response = curl_exec($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if (curl_errno($curl)) {
        throw new Exception('cURL error: ' . curl_error($curl));
    }

    curl_close($curl);

    $authResponse = json_decode($response, true);
    if (!isset($authResponse['payload']['accessToken'])) {
        throw new Exception('No se pudo obtener token de autenticación');
    }
    
    $token = $authResponse['payload']['accessToken'];
    error_log("✓ [Proxy] Autenticado correctamente");

    // ==========================
    // OBTENER PRODUCTOS (igual que telcel)
    // ==========================
    $allServices = [];
    $pageNum = 0;
    $maxPages = 10;

    error_log("🔵 [Proxy] Iniciando carga de productos...");

    do {
        error_log("📄 [Proxy] Obteniendo página $pageNum...");
        
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => "https://prontipagos-api-dev.domainscm.com/prontipagos-external-api-ws/ws/protected/v1/product/list?page=$pageNum&pageSize=100",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_SSL_VERIFYPEER => false,
          CURLOPT_SSL_VERIFYHOST => false,
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Accept: */*',
            'User-Agent: PostmanRuntime/7.36.1',
            'Cache-Control: no-cache',
            'Postman-Token: ' . uniqid(),
            "Authorization: Bearer $token"
          ),
        ));
        
        $response = curl_exec($curl);
        if (curl_errno($curl)) {
            error_log("⚠️ [Proxy] Error cURL en página $pageNum: " . curl_error($curl));
            curl_close($curl);
            break;
        }
        
        $pageData = json_decode($response, true);
        curl_close($curl);
        
        $pageServices = [];
        
        if ($pageData && isset($pageData['payload'])) {
            $possibleKeys = ['content', 'data', 'products', 'services', 'items', 'list', 'results', 'productList'];
            
            foreach ($possibleKeys as $key) {
                if (isset($pageData['payload'][$key]) && is_array($pageData['payload'][$key])) {
                    $pageServices = $pageData['payload'][$key];
                    break;
                }
            }
            
            if (empty($pageServices)) {
                foreach ($pageData['payload'] as $key => $value) {
                    if (is_array($value) && !empty($value)) {
                        if (isset($value[0]) && is_array($value[0])) {
                            if (isset($value[0]['sku']) || isset($value[0]['name']) || isset($value[0]['id'])) {
                                $pageServices = $value;
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        if (!empty($pageServices)) {
            $allServices = array_merge($allServices, $pageServices);
            error_log("✓ [Proxy] Página $pageNum cargada: " . count($pageServices) . " servicios");
        } else {
            error_log("📭 [Proxy] No hay más datos en página $pageNum");
            break;
        }
        
        $pageNum++;
        usleep(100000);
        
    } while ($pageNum < $maxPages && !empty($pageServices));

    error_log("🟢 [Proxy] Total servicios obtenidos: " . count($allServices));

    // ==========================
    // CALCULAR ESTADÍSTICAS
    // ==========================
    $categories = [];
    $regions = [];
    $providers = [];

    foreach ($allServices as $service) {
        // Categorías
        $catId = $service['categoryId'] ?? 0;
        $catName = $service['categoryName'] ?? 'Sin categoría';
        if (!isset($categories[$catId])) {
            $categories[$catId] = $catName;
        }
        
        // Regiones
        $sku = strtoupper($service['sku'] ?? '');
        if (preg_match('/-R([1-9])\b/', $sku, $m)) {
            $regions[$m[1]] = true;
        }
        
        // Proveedores
        if ($catName) {
            $providers[$catName] = true;
        }
    }

    // ==========================
    // RESPUESTA
    // ==========================
    echo json_encode([
        'success' => true,
        'total' => count($allServices),
        'services' => $allServices,
        'stats' => [
            'total_services' => count($allServices),
            'total_categories' => count($categories),
            'total_regions' => count($regions),
            'total_providers' => count($providers),
            'categories' => $categories,
            'regions' => array_keys($regions),
        ],
        'message' => 'Servicios cargados correctamente',
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    error_log("🔴 [Proxy] ERROR: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Error al cargar servicios'
    ]);
}
?>
