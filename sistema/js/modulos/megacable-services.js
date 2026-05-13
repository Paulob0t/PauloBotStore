let megacableData = { services: null };

export class MegacableServices {
    static async init() {
        try {
            this.render();
            this.wire();
        } catch (e) {
            Swal.fire('Error', 'No se pudieron cargar los servicios de Megacable', 'error');
        }
    }

    static async loadServices() {
        try {
            const cached = window.ServiceCache?.get('megacable');
            if (cached) { megacableData.services = cached; return; }
            const r = await fetch('megacable_saldo_functional.php');
            const d = await r.json();
            if (!d.success) throw new Error('La respuesta del servidor no fue exitosa');
            if (!d.services || !Array.isArray(d.services)) throw new Error('No se encontraron servicios en la respuesta');
            const validSkus = ['S3TELEMEGACABMXN', 'S3MEGACABLESALDOMXN'];
            const filteredServices = d.services.filter(service => service.sku && validSkus.includes(service.sku));
            if (filteredServices.length === 0) throw new Error('No se encontraron servicios de Megacable');
            megacableData.services = filteredServices.map(service => ({
                ...service,
                formatted_name: service.sku === 'S3TELEMEGACABMXN' ? 'TV Megacable' : 'Consulta de Saldo Megacable',
                description: service.sku === 'S3TELEMEGACABMXN' ? 'Pago de servicio de televisión Megacable' : 'Consulta tu saldo de Megacable'
            }));
            window.ServiceCache?.set('megacable', filteredServices);
        } catch { megacableData.services = []; }
    }

    static renderList(list) {
        if (list === null) return '<p style="text-align:center; padding:2rem; color:#6b7280; font-size:1.1rem;">⏳ Cargando servicios...</p>';
        if (!Array.isArray(list) || list.length === 0) return '<p style="text-align:center; padding:2rem; color:#6b7280; font-size:1.1rem;">📭 No hay servicios disponibles</p>';
        return list.map(s => `
            <div class="service-item" data-sku="${s.sku}">
                <div class="service-name">${s.formatted_name}</div>
                ${s.description ? `<div style="font-size:0.9rem; color:#6b7280; margin-top:0.5rem;">${s.description}</div>` : ''}
                <div style="margin-top:1rem;">
                    <span style="font-size:0.9rem; color:#0B5ED7; font-weight:700;">Seleccionar →</span>
                </div>
            </div>
        `).join('');
    }

    static updateList(list) {
        const target = document.querySelector(`.megacable-main-card .service-grid`);
        if (target) target.innerHTML = this.renderList(list);
    }

    static render() {
        // ⚠️ CSS INLINE DESACTIVADO - Los estilos del modal se cargarán solo cuando sea necesario
        // if (!document.getElementById('megacable-styles')) {
        //     const style = document.createElement('style');
        //     style.id = 'megacable-styles';
        //     style.textContent = `...`;
        //     document.head.appendChild(style);
        // }
        /* ===== MEGACABLE PROFESSIONAL DESIGN - ESTILO MOVISTAR ===== */
        
        /* Modal overlay con animación */
        #megacable-kiosk-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: linear-gradient(135deg, rgba(5, 15, 30, 0.95) 0%, rgba(10, 25, 45, 0.95) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.4s ease-out;
          overflow: auto;
          backdrop-filter: blur(12px);
        }
        
        #megacable-kiosk-wrapper {
          width: 98%;
          max-width: none;
          max-height: 96vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Card principal */
        .megacable-main-card {
          width: 100%;
          max-height: 96vh;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(11, 94, 215, 0.4), 0 0 1px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(11, 94, 215, 0.1);
          display: flex;
          flex-direction: column;
          transform-origin: center;
        }
        
        /* Header con gradiente Megacable azul */
        .megacable-header {
          background: linear-gradient(135deg, #0B5ED7 0%, #0066cc 100%);
          padding: 3rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .megacable-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: headerPulse 4s ease-in-out infinite;
        }
        .megacable-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #00d4ff 0%, #0095ff 50%, #0B5ED7 100%);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }
        .megacable-header img {
          max-width: 200px;
          height: auto;
          filter: brightness(1.1) drop-shadow(0 4px 20px rgba(0,0,0,0.2));
          position: relative;
          z-index: 1;
          animation: logoFloat 3s ease-in-out infinite;
        }
        .megacable-header h2 {
          color: white;
          margin: 1.5rem 0 0 0;
          font-weight: 700;
          font-size: 2.5rem;
          text-shadow: 0 3px 12px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        /* Body con scroll */
        .megacable-content {
          padding: 3.5rem;
          background: #fafbfc;
          overflow-y: auto;
          flex: 1;
        }
        
        /* Step indicator */
        .step-chip { 
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #0B5ED7;
          font-weight: 600;
          font-size: 1.05rem;
          padding: 0.85rem 1.75rem;
          border-radius: 14px;
          border: 2px solid #d6f0ff;
          margin-bottom: 2.5rem;
          box-shadow: 0 3px 10px rgba(11, 94, 215, 0.1);
          transition: all 0.3s ease;
          animation: chipBounce 0.6s ease-out;
        }
        .step-chip:hover {
          border-color: #0B5ED7;
          box-shadow: 0 5px 15px rgba(11, 94, 215, 0.2);
          transform: translateY(-2px);
        }
        
        @keyframes chipBounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .section-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          letter-spacing: -0.3px;
        }
        
        /* Input groups */
        .input-wrap { 
          position: relative;
          margin-bottom: 1.5rem;
        }
        .input-wrap input {
          width: 100%;
          padding: 1.25rem 4rem 1.25rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1.15rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          color: #1e293b;
          font-weight: 500;
        }
        .input-wrap input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        .input-wrap input:focus {
          outline: none;
          border-color: #0B5ED7;
          background: white;
          box-shadow: 0 0 0 5px rgba(11, 94, 215, 0.1), 0 8px 16px rgba(11, 94, 215, 0.15);
          transform: translateY(-2px);
        }
        .state-icon {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 700;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }
        .state-icon.ok { 
          color: #10b981; 
          animation: checkBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .state-icon.err { 
          color: #ef4444;
          animation: errorShake 0.5s ease;
        }
        
        @keyframes checkBounce {
          0% { transform: translateY(-50%) scale(0); }
          50% { transform: translateY(-50%) scale(1.3); }
          100% { transform: translateY(-50%) scale(1); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          25% { transform: translateY(-50%) translateX(-8px); }
          75% { transform: translateY(-50%) translateX(8px); }
        }
        
        /* Error message */
        .error-message {
          color: #dc2626;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: none;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border-left: 3px solid #dc2626;
          border-radius: 8px;
        }
        
        /* Hint card */
        .hint-card {
          background: white;
          border: 2px solid #d6f0ff;
          border-radius: 16px;
          padding: 1.75rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(11, 94, 215, 0.06);
        }
        .hint-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .hint-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
        }
        .hint-item:last-child { margin-bottom: 0; }
        .hint-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #0B5ED7 0%, #0066cc 100%);
          color: white;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(11, 94, 215, 0.25);
        }
        
        /* Step header */
        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        /* Button group */
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid #e2e8f0;
          justify-content: flex-end;
          align-items: center;
        }
        
        /* Modern buttons */
        .modern-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 140px;
          letter-spacing: 0.2px;
        }
        .modern-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .modern-btn:hover::before {
          width: 300px;
          height: 300px;
        }
        .modern-btn:active {
          transform: scale(0.98);
        }
        
        .btn-primary-megacable {
          background: linear-gradient(135deg, #0B5ED7 0%, #0066cc 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(11, 94, 215, 0.35);
        }
        .btn-primary-megacable:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(11, 94, 215, 0.45);
        }
        .btn-primary-megacable:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 8px rgba(11, 94, 215, 0.2);
        }
        
        .btn-secondary-megacable {
          background: white;
          color: #475569;
          border: 2px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .btn-secondary-megacable:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        /* Service grid */
        .service-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-top: 1.5rem;
        }
        
        /* Service item card */
        .service-item {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
          min-height: 130px;
        }
        .service-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0B5ED7 0%, #0066cc 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .service-item:hover {
          transform: translateY(-4px);
          border-color: #0B5ED7;
          box-shadow: 0 12px 28px rgba(11, 94, 215, 0.15);
        }
        .service-item:hover::before {
          transform: scaleX(1);
        }
        .service-item.selected {
          border-color: #0B5ED7;
          background: linear-gradient(135deg, #e6faff 0%, #d6f0ff 100%);
          box-shadow: 0 12px 32px rgba(11, 94, 215, 0.25);
        }
        .service-item.selected::before {
          transform: scaleX(1);
        }
        .service-item .service-name {
          font-weight: 600;
          font-size: 1rem;
          color: #1e293b;
          line-height: 1.4;
        }
        
        /* Step screens */
        .step-screen {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .hidden-step {
          display: none !important;
        }
        .pre-enter-right {
          opacity: 0;
          transform: translateX(20px);
        }
        .pre-enter-left {
          opacity: 0;
          transform: translateX(-20px);
        }
        .slide-out-left {
          opacity: 0;
          transform: translateX(-20px);
        }
        .slide-out-right {
          opacity: 0;
          transform: translateX(20px);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(12px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes headerPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.08) rotate(1deg);
            opacity: 0.9;
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          #megacable-kiosk-root {
            padding: 0;
          }
          .megacable-main-card {
            width: 100%;
            border-radius: 0;
            min-height: 100vh;
            max-width: 100%;
            max-height: 100vh;
          }
          .megacable-header {
            padding: 2.5rem 2rem;
          }
          .megacable-header img {
            max-width: 150px;
          }
          .megacable-header h2 {
            font-size: 2rem;
          }
          .megacable-content {
            padding: 2.5rem 2rem;
          }
          .service-grid {
            grid-template-columns: 1fr;
          }
          .button-group {
            flex-direction: column;
          }
          .modern-btn { 
            width: 100%; 
            min-width: unset;
            padding: 1.25rem 2rem;
            font-size: 1.1rem;
          }
          .step-header {
            flex-direction: column;
            align-items: stretch;
          }
          .section-title {
            font-size: 1.3rem;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
          .megacable-main-card {
            width: 96%;
            max-width: none;
          }
          .megacable-content {
            padding: 3rem;
          }
        }
        
        @media (min-width: 1201px) {
          .megacable-main-card {
            width: 96%;
            max-width: none;
          }
          .megacable-content {
            padding: 3.5rem 4.5rem;
          }
        }
        
        @media (min-width: 1600px) {
          .megacable-main-card {
            width: 94%;
            max-width: none;
          }
          .megacable-content {
            padding: 4rem 5rem;
          }
        }
        
        @media (max-width: 900px) and (orientation: landscape) {
          .megacable-main-card {
            max-height: 98vh;
            width: 100%;
          }
          .megacable-header {
            padding: 1.75rem 2rem;
          }
          .megacable-header img {
            max-width: 120px;
          }
          .megacable-header h2 {
            font-size: 1.6rem;
            margin-top: 0.8rem;
          }
          .megacable-content {
            padding: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .megacable-header h2 {
            font-size: 1.8rem;
          }
          .section-title {
            font-size: 1.2rem;
          }
        }
        
        /* Footer styles */
        #megacable-kiosk-footer {
          padding: 1.5rem 2rem;
          background: white;
          border-top: 2px solid #e2e8f0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          border-radius: 0 0 24px 24px;
        }
        
        #megacable-kiosk-footer .modern-btn {
          min-width: 200px;
        }
        
        @media (max-width: 768px) {
          #megacable-kiosk-footer {
            padding: 1.25rem 1.5rem;
          }
          #megacable-kiosk-footer .modern-btn {
            width: 100%;
            padding: 1.25rem 2rem;
          }
        }
      `;
            // document.head.appendChild(style);
        // }

        const bodyHTML = `
          <div class="megacable-main-card">
            <div class="megacable-header">
              <img src="https://megacable.com.mx/images/megacable.svg" alt="Megacable" />
              <h2>Servicios Megacable</h2>
            </div>
            
            <div class="megacable-content">
              <div id="mega-step-1" class="step-screen">
                <div class="step-chip">📺 Paso 1: Ingresa tu número de suscriptor</div>
                
                <div class="section-title">Número de suscriptor</div>
                
                <div class="hint-card">
                  <ul class="hint-list">
                    <li class="hint-item"><span class="hint-icon">①</span><span>Escribe tu número de suscriptor (8-12 dígitos)</span></li>
                    <li class="hint-item"><span class="hint-icon">②</span><span>Confírmalo en el segundo campo</span></li>
                    <li class="hint-item"><span class="hint-icon">③</span><span>Haz clic en "Continuar"</span></li>
                  </ul>
                </div>

                <div class="input-wrap">
                  <input type="tel" id="megacable-service-number" placeholder="Número de suscriptor (8-12 dígitos)" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autofocus />
                  <span class="state-icon" id="mega-s1"></span>
                </div>
                
                <div class="input-wrap">
                  <input type="tel" id="megacable-service-number-2" placeholder="Confirma el número" inputmode="numeric" pattern="[0-9]*" />
                  <span class="state-icon" id="mega-s2"></span>
                </div>
                
                <div id="megacable-number-error" class="error-message">Los números no coinciden</div>
                
                <div class="button-group">
                  <button id="mega-next" class="modern-btn btn-primary-megacable" disabled>Continuar →</button>
                </div>
              </div>
              
              <div id="mega-step-2" class="step-screen hidden-step">
                <div class="step-header">
                  <div class="step-chip">📋 Paso 2: Elige el servicio y monto</div>
                  <button id="mega-back" class="modern-btn btn-secondary-megacable">← Regresar</button>
                </div>
                
                <div class="hint-card">
                  <div class="hint-item">
                    <span class="hint-icon">ℹ</span>
                    <span>Selecciona el servicio que necesitas e ingresa el monto a pagar</span>
                  </div>
                </div>
                
                <div class="service-grid"></div>

                <div class="input-wrap" style="margin-top: 1.5rem;">
                  <input type="number" id="megacable-amount" placeholder="Monto a pagar" min="0.01" step="0.01" />
                </div>
                
                <div id="megacable-amount-error" class="error-message">Monto inválido (debe ser mayor a 0)</div>
                
                <div style="font-size:0.95rem; color:#64748b; margin-top:1rem; padding:0.75rem 1rem; background:#f8fafc; border-radius:10px; font-weight:600;">
                  Comisión: $8.00
                </div>
                
                <div class="button-group" style="margin-top: 3rem;">
                  <button class="modern-btn btn-primary-megacable" id="process-megacable" disabled>💳 Pagar</button>
                </div>
              </div>
            </div>
            
            <div id="megacable-kiosk-footer">
              <button class="modern-btn btn-secondary-megacable" id="cancel-service">Cerrar</button>
            </div>
          </div>
        `;

        const footerHTML = ``;

        MegacableServices.openOverlay({ title: 'Servicios Megacable', bodyHTML, footerHTML });
    }

    static wire() {
        const body = document.querySelector('.megacable-main-card');
        const footer = document.getElementById('megacable-kiosk-footer');
        if (!body || !footer) return;

        const isValid = v => /^\d{8,12}$/.test(v || '');
        const validate = () => {
            const p1 = (body.querySelector('#megacable-service-number')?.value || '').replace(/\D/g, '');
            const p2 = (body.querySelector('#megacable-service-number-2')?.value || '').replace(/\D/g, '');
            const ok = isValid(p1), cok = isValid(p2), match = ok && cok && p1 === p2;
            const s1 = body.querySelector('#mega-s1'), s2 = body.querySelector('#mega-s2');
            const err = body.querySelector('#megacable-number-error');
            const next = body.querySelector('#mega-next');
            if (body.querySelector('#megacable-service-number').value !== p1) body.querySelector('#megacable-service-number').value = p1;
            if (body.querySelector('#megacable-service-number-2').value !== p2) body.querySelector('#megacable-service-number-2').value = p2;
            if (s1) { s1.textContent = ok ? '✓' : (p1 ? '!' : ''); s1.className = 'state-icon ' + (ok ? 'ok' : (p1 ? 'err' : '')); }
            if (s2) { s2.textContent = cok ? (match ? '✓' : '!') : (p2 ? '!' : ''); s2.className = 'state-icon ' + (match ? 'ok' : (p2 ? 'err' : '')); }
            if (err) err.style.display = (p2 && !match) ? 'block' : 'none';
            if (next) next.disabled = !match;
            
            const selected = body.querySelector('.service-item.selected');
            const amountInput = body.querySelector('#megacable-amount');
            const sku = selected?.dataset?.sku;
            const isSaldo = sku === 'S3MEGACABLESALDOMXN';
            if (isSaldo && amountInput) { amountInput.disabled = true; amountInput.value = '1'; }
            else if (amountInput) { amountInput.disabled = false; }
            const amtErr = body.querySelector('#megacable-amount-error');
            const payBtn = body.querySelector('#process-megacable');
            const amt = parseFloat(amountInput?.value);
            const validAmt = isSaldo || (!isNaN(amt) && amt > 0);
            if (amtErr) amtErr.style.display = (!isSaldo && amountInput?.value && !validAmt) ? 'block' : 'none';
            if (payBtn) payBtn.disabled = !(selected && validAmt && match);
        };

        const toStep2 = () => {
            const step1 = body.querySelector('#mega-step-1');
            const step2 = body.querySelector('#mega-step-2');
            step2?.classList.add('pre-enter-right');
            step1?.classList.add('slide-out-left');
            setTimeout(() => {
                step1?.classList.add('hidden-step');
                step1?.classList.remove('slide-out-left');
                step2?.classList.remove('hidden-step');
                setTimeout(() => step2?.classList.remove('pre-enter-right'), 10);
            }, 180);
            if (megacableData.services === null) this.loadServices().then(() => this.updateList(megacableData.services));
            else this.updateList(megacableData.services);
        };

        body.addEventListener('input', validate);
        body.addEventListener('keyup', (e) => { if (e.key === 'Enter' && !body.querySelector('#mega-next')?.disabled) toStep2(); });
        body.querySelector('#mega-next')?.addEventListener('click', (e) => { e.preventDefault(); if (!e.currentTarget.disabled) toStep2(); });
        body.querySelector('#mega-back')?.addEventListener('click', () => {
            const step1 = body.querySelector('#mega-step-1');
            const step2 = body.querySelector('#mega-step-2');
            step1?.classList.add('pre-enter-left');
            step2?.classList.add('slide-out-right');
            setTimeout(() => {
                step2?.classList.add('hidden-step');
                step2?.classList.remove('slide-out-right');
                step1?.classList.remove('hidden-step');
                setTimeout(() => step1?.classList.remove('pre-enter-left'), 10);
            }, 180);
        });

        body.addEventListener('click', (e) => {
            const item = e.target.closest('.service-item');
            if (item) {
                body.querySelectorAll('.service-item.selected').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                validate();
            }
            if (e.target.closest('#process-megacable')) {
                const selected = body.querySelector('.service-item.selected');
                if (!selected) { Swal.fire('Error', 'Selecciona un servicio', 'error'); return; }
                const serviceNumber = (body.querySelector('#megacable-service-number')?.value || '').replace(/\D/g, '');
                const sku = selected.dataset.sku;
                const serviceName = selected.querySelector('.service-name')?.textContent || 'Servicio Megacable';
                const amount = parseFloat(body.querySelector('#megacable-amount')?.value);
                const isSaldo = sku === 'S3MEGACABLESALDOMXN';
                const finalAmount = isSaldo ? 1 : amount;
                const commission = 8;
                if (!/^\d{8,12}$/.test(serviceNumber) || (!isSaldo && (isNaN(amount) || amount <= 0))) { Swal.fire('Error', 'Completa todos los campos correctamente', 'error'); return; }
                
                // 🚀 Usar payment handler con Point + Efectivo
                if (window.ServicePaymentHandler) {
                    window.ServicePaymentHandler.showPaymentOptions({
                        serviceName: serviceName,
                        reference: serviceNumber,
                        amount: finalAmount,
                        commission: commission,
                        sku: sku,
                        requiresRegionalization: false
                    }, () => {
                        MegacableServices.closeOverlay();
                    });
                } else {
                    // Fallback legacy
                    const totalAmount = finalAmount + commission;
                    Swal.fire({ title: '¿Confirmar pago?', html: `<div style="text-align:left; padding:10px;"><p><strong>Servicio:</strong> ${serviceName}</p><p><strong>Número:</strong> ${serviceNumber}</p><p><strong>Monto:</strong> $${finalAmount.toFixed(2)}</p><p><strong>Comisión:</strong> $${commission.toFixed(2)}</p><p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p></div>`, icon: 'question', showCancelButton: true, confirmButtonText: 'Pagar', cancelButtonText: 'Cancelar' }).then((res) => {
                        if (res.isConfirmed) {
                            Swal.fire({ title: 'Procesando...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
                            fetch('process_payment.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku, amount: finalAmount, reference: serviceNumber, commission, requiresRegionalization: false, transactionId: Date.now() }) })
                                .then(r => r.json())
                                .then(d => { if (d?.success) { Swal.fire('¡Pago exitoso!', '', 'success').then(() => MegacableServices.closeOverlay()); } else { Swal.fire('Error', d?.error || 'Error', 'error'); } });
                        }
                    });
                }
            }
        });

        footer.addEventListener('click', (e) => {
            if (e.target.closest('#cancel-service')) { MegacableServices.closeOverlay(); return; }
        });
        validate();
    }
}

MegacableServices.openOverlay = ({ title, bodyHTML, footerHTML }) => {
    let root = document.getElementById('megacable-kiosk-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'megacable-kiosk-root';
        document.body.appendChild(root);
        root.innerHTML = `
          <div id="megacable-kiosk-wrapper">
            ${bodyHTML}
          </div>
        `;
        try { MegacableServices._prev = { h: document.documentElement.style.overflow, b: document.body.style.overflow }; document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; } catch { }
    }
};

MegacableServices.closeOverlay = () => {
    const root = document.getElementById('megacable-kiosk-root');
    if (root) root.remove();
    try { if (MegacableServices._prev) { document.documentElement.style.overflow = MegacableServices._prev.h || ''; document.body.style.overflow = MegacableServices._prev.b || ''; MegacableServices._prev = null; } } catch { }
};
