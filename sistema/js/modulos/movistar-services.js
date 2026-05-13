let movistarData = { 
  recargas: null,
  loadingServices: false,
  hapticEnabled: 'vibrate' in navigator,
  monederoSaldo: 0,
  saldoInterval: null
};

export class MovistarServices {
  static async init() {
    try {
      await this.obtenerSaldoMonedero();
      this.preloadStyles();
      requestAnimationFrame(() => {
        this.render();
        this.wire();
        this.iniciarActualizacionSaldo();
      });
    } catch (e) {
      Swal.fire('Error', 'No se pudieron cargar los servicios de Movistar', 'error');
    }
  }

  static preloadStyles() {
    if (!document.getElementById('movistar-styles')) {
      const style = document.createElement('style');
      style.id = 'movistar-styles';
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    }
  }

  static getStyles() {
    return `
      /* ===== MOVISTAR OPTIMIZADO - SIN LAG ===== */
      #movistar-kiosk-root {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(1, 157, 244, 0.15);
        display: flex; align-items: center; justify-content: center; padding: 1rem;
        animation: fadeIn 0.15s ease-out; overflow: auto;
      }
      #movistar-kiosk-wrapper { 
        width: 98%; max-width: none; max-height: 96vh; 
        display: flex; align-items: center; justify-content: center; 
      }
      .movistar-main-card {
        width: 100%; max-height: 96vh; background: white; border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden; animation: slideUp 0.2s ease-out;
        display: flex; flex-direction: column;
      }
      .movistar-header {
        background: linear-gradient(135deg, #019DF4 0%, #00C9FF 100%); 
        padding: 2.5rem; text-align: center; position: relative; flex-shrink: 0;
      }
      .movistar-header img {
        max-width: 180px; height: auto; filter: brightness(1.1);
      }
      .movistar-header h2 {
        color: white; margin: 1rem 0 0 0; font-weight: 700; font-size: 2.2rem;
      }
      .movistar-content { 
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
        background: white; color: #019DF4;
        font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; 
        border-radius: 12px; border: 2px solid #b3e5fc; margin-bottom: 2rem;
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
        outline: none; border-color: #019DF4; background: white;
        box-shadow: 0 0 0 3px rgba(1, 157, 244, 0.1);
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
        background: white; border: 2px solid #b3e5fc; border-radius: 12px; 
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
        min-width: 26px; height: 26px; background: #019DF4; color: white; 
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
      .btn-primary-movistar {
        background: linear-gradient(135deg, #019DF4 0%, #00C9FF 100%); 
        color: white; box-shadow: 0 4px 12px rgba(1, 157, 244, 0.3);
      }
      .btn-primary-movistar:hover { 
        box-shadow: 0 6px 18px rgba(1, 157, 244, 0.4); 
      }
      .btn-primary-movistar:disabled {
        opacity: 0.5; cursor: not-allowed; box-shadow: none;
      }
      .btn-secondary-movistar {
        background: white; color: #475569; border: 2px solid #e2e8f0;
      }
      .btn-secondary-movistar:hover {
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
        border-color: #019DF4; color: #019DF4;
      }
      .tab-btn.active {
        background: linear-gradient(135deg, #019DF4 0%, #00C9FF 100%);
        color: white; border-color: transparent; transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(1, 157, 244, 0.3);
      }
      .tab-content { min-height: 200px; }
      .tab-pane { display: none; }
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
        background: #019DF4; transform: scaleX(0); transition: transform 0.15s ease;
      }
      .service-item:hover:not(.insufficient-funds) {
        transform: translateY(-2px); border-color: #019DF4; 
        box-shadow: 0 8px 20px rgba(1, 157, 244, 0.15);
      }
      .service-item:hover::before { transform: scaleX(1); }
      .service-item.selected {
        background: #e0f7ff !important; border-color: #019DF4;
        box-shadow: 0 4px 12px rgba(1, 157, 244, 0.2);
      }
      .service-item.selected::before { transform: scaleX(1); }
      .service-item .service-name { 
        font-weight: 600; font-size: 0.98rem; color: #1e293b; line-height: 1.3; 
      }
      .service-item .service-price {
        display: inline-block; background: #019DF4;
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
      #movistar-kiosk-footer {
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
        #movistar-kiosk-root { padding: 0; }
        .movistar-main-card { 
          width: 100%; border-radius: 0; min-height: 100vh; 
          max-width: 100%; max-height: 100vh; 
        }
        .movistar-header { padding: 2rem 1.5rem; }
        .movistar-content { padding: 2rem 1.5rem; }
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
        movistarData.monederoSaldo = nuevoSaldo;
        this.actualizarBadgeSaldo();
      }
    } catch (error) {
      movistarData.monederoSaldo = 0;
      this.actualizarBadgeSaldo();
    }
  }

  static actualizarBadgeSaldo() {
    const badgeElement = document.getElementById('movistar-saldo');
    if (badgeElement) {
      const saldoAnterior = parseFloat(badgeElement.textContent.replace(/[^0-9.]/g, '')) || 0;
      const saldoNuevo = movistarData.monederoSaldo;
      
      badgeElement.textContent = `$${saldoNuevo.toFixed(2)}`;
      
      // Animación si el saldo cambió
      if (saldoNuevo !== saldoAnterior) {
        badgeElement.style.transform = 'scale(1.2)';
        badgeElement.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
          badgeElement.style.transform = 'scale(1)';
        }, 300);
      }
    }
    
    // Actualizar el widget principal (MI SALDO) SIN animación de conteo
    if (typeof MonederoIntegration !== 'undefined') {
      const saldoElement = document.getElementById('monedero-saldo');
      const tabSaldoElement = document.getElementById('wallet-tab-amount');
      
      if (saldoElement) {
        saldoElement.textContent = '$' + movistarData.monederoSaldo.toFixed(2);
      }
      if (tabSaldoElement) {
        tabSaldoElement.textContent = '$' + movistarData.monederoSaldo.toFixed(2);
      }
      
      // Actualizar el saldo interno del MonederoIntegration
      MonederoIntegration.saldoActual = movistarData.monederoSaldo;
    }
  }

  static async descontarSaldo(monto) {
    try {
      const response = await fetch('monedero_api.php?action=reset_saldo', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        movistarData.monederoSaldo = 0;
        this.actualizarBadgeSaldo();
        if (typeof MonederoIntegration !== 'undefined') {
          MonederoIntegration.resetearSaldo();
        }
      }
    } catch (error) {
      // Error silencioso
    }
  }

  static iniciarActualizacionSaldo() {
    if (movistarData.saldoInterval) {
      clearInterval(movistarData.saldoInterval);
    }
    
    movistarData.saldoInterval = setInterval(async () => {
      await this.obtenerSaldoMonedero();
      this.marcarServiciosInsuficientes();
    }, 300);
  }

  static detenerActualizacionSaldo() {
    if (movistarData.saldoInterval) {
      clearInterval(movistarData.saldoInterval);
      movistarData.saldoInterval = null;
    }
  }

  // 🔔 Helper: Vibración háptica
  static hapticFeedback(type = 'light') {
    if (!movistarData.hapticEnabled) return;
    
    try {
      switch(type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
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
    const colors = ['#019DF4', '#00C9FF', '#5FD800', '#10b981', '#f59e0b'];
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

  // 💰 Helper: Mostrar mensaje de saldo insuficiente
  static mostrarSaldoInsuficiente(price) {
    const faltante = price - movistarData.monederoSaldo;
    Swal.fire({
      title: '💰 Saldo insuficiente',
      html: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">💸</div>
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">
            Necesitas <strong style="color: #dc2626;">$${price.toFixed(2)}</strong>
          </p>
          <p style="font-size: 1rem; color: #6b7280; margin-bottom: 1rem;">
            Tu saldo actual: <strong style="color: #019DF4;">$${movistarData.monederoSaldo.toFixed(2)}</strong>
          </p>
          <p style="font-size: 1.2rem; font-weight: 700; color: #f59e0b;">
            Te faltan: $${faltante.toFixed(2)}
          </p>
          <div style="margin-top: 1.5rem; padding: 1rem; background: #e6faff; border-radius: 8px;">
            <p style="margin: 0; color: #0c4a6e;">
              💡 Deposita más dinero en el monedero para continuar
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#019DF4'
    });
  }

  static async loadRecargas() {
    movistarData.loadingServices = true;
    const container = document.querySelector('.movistar-main-card .service-grid');
    if (container) this.showSkeletonLoader(container);
    
    try {
      const cached = window.ServiceCache?.get('movistar_recargas');
      if (cached) { 
        movistarData.recargas = cached;
        movistarData.loadingServices = false;
        return; 
      }
      const r = await fetch('movistar_recargas_functional.php');
      const d = await r.json();
      const list = d?.services || [];
      movistarData.recargas = list;
      window.ServiceCache?.set('movistar_recargas', list);
      movistarData.loadingServices = false;
    } catch { 
      movistarData.recargas = [];
      movistarData.loadingServices = false;
    }
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

  static updateList(list) {
    const target = document.querySelector(`.movistar-main-card .service-grid`);
    if (target) {
      target.innerHTML = this.renderList(list);
      this.marcarServiciosInsuficientes();
    }
  }

  static marcarServiciosInsuficientes() {
    const items = document.querySelectorAll('.service-item');
    if (items.length === 0) return;
    
    items.forEach(item => {
      const priceElement = item.querySelector('.service-price');
      if (!priceElement) return;
      
      const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) || 0;
      
      if (price > movistarData.monederoSaldo) {
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

  static render() {
    // ⚠️ CSS LOADER DESACTIVADO - Los estilos ahora están en shop-carousel.css
    // if (!document.getElementById('movistar-styles')) {
    //   const link = document.createElement('link');
    //   link.id = 'movistar-styles';
    //   link.rel = 'stylesheet';
    //   link.href = 'css/movistar-services.css';
    //   document.head.appendChild(link);
    // }

    const bodyHTML = `
      <div class="movistar-main-card">
        <div class="movistar-header">
          <img src="images/services/movistar.png" alt="Movistar" />
          <h2>Servicios Movistar</h2>
          <div class="monedero-badge">
            <span class="monedero-icon">💰</span>
            <span class="monedero-label">Saldo:</span>
            <span class="monedero-amount" id="movistar-saldo">$${movistarData.monederoSaldo.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="movistar-content">
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
              <input type="tel" id="mv-phone" placeholder="Número Movistar (10 dígitos)" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autofocus />
              <span class="state-icon" id="mv-s1"></span>
            </div>
            
            <div class="input-wrap">
              <input type="tel" id="mv-phone2" placeholder="Confirma el número" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" />
              <span class="state-icon" id="mv-s2"></span>
            </div>
            
            <div id="mv-err" class="error-message">Los números no coinciden</div>
            
            <div class="button-group">
              <button id="mv-next" class="modern-btn btn-primary-movistar" disabled>Continuar →</button>
            </div>
          </div>
          
          <div id="tabs-step" class="service-tabs step-screen hidden-step">
            <div class="step-header">
              <div class="step-chip">📋 Paso 2: Elige tu servicio</div>
              <button id="mv-back" class="modern-btn btn-secondary-movistar">← Regresar</button>
            </div>
            
            <div class="hint-card">
              <div class="hint-item">
                <span class="hint-icon">ℹ</span>
                <span>Selecciona el servicio que necesitas de la lista de recargas disponibles</span>
              </div>
            </div>
            
            <div class="tab-buttons">
              <button class="tab-btn active" data-tab="recargas">💰 Recargas Movistar</button>
            </div>
            
            <div class="tab-content">
              <div class="tab-pane" data-tab="recargas" style="display:block;">
                <div class="service-grid"></div>
              </div>
            </div>
            
            <div class="button-group" style="margin-top: 3rem;">
              <button class="modern-btn btn-primary-movistar" id="mv-pay" style="display:none;" disabled>💳 Pagar</button>
            </div>
          </div>
        </div>
        
        <div id="movistar-kiosk-footer">
          <button class="modern-btn btn-secondary-movistar" id="mv-cancel">Cerrar</button>
        </div>
      </div>
    `;

    const footerHTML = ``;

    MovistarServices.openOverlay({ title: 'Servicios Movistar', bodyHTML, footerHTML });
  }

  static wire() {
    const body = document.querySelector('.movistar-main-card');
    const footer = document.getElementById('movistar-kiosk-footer');
    if (!body || !footer) return;

    const isValid10 = v => /^[0-9]{10}$/.test(v || '');
    const validate = () => {
      const p1 = (body.querySelector('#mv-phone')?.value || '').replace(/\D/g, '').slice(0, 10);
      const p2 = (body.querySelector('#mv-phone2')?.value || '').replace(/\D/g, '').slice(0, 10);
      const ok = isValid10(p1), cok = isValid10(p2), match = ok && cok && p1 === p2;
      const s1 = body.querySelector('#mv-s1'), s2 = body.querySelector('#mv-s2');
      const err = body.querySelector('#mv-err');
      const next = body.querySelector('#mv-next');
      if (body.querySelector('#mv-phone').value !== p1) body.querySelector('#mv-phone').value = p1;
      if (body.querySelector('#mv-phone2').value !== p2) body.querySelector('#mv-phone2').value = p2;
      if (s1) { s1.textContent = ok ? '✓' : (p1 ? '!' : ''); s1.className = 'state-icon ' + (ok ? 'ok' : (p1 ? 'err' : '')); }
      if (s2) { s2.textContent = cok ? (match ? '✓' : '!') : (p2 ? '!' : ''); s2.className = 'state-icon ' + (match ? 'ok' : (p2 ? 'err' : '')); }
      if (err) err.style.display = (p2 && !match) ? 'block' : 'none';
      if (next) next.disabled = !match;
      const pay = body.querySelector('#mv-pay');
      const selected = body.querySelector('.service-item.selected');
      if (pay) { pay.style.display = selected ? 'inline-block' : 'none'; pay.disabled = !selected || !match; }
    };

    const toTabs = () => {
      const phoneStep = body.querySelector('#phone-step');
      const tabsStep = body.querySelector('#tabs-step');
      tabsStep?.classList.add('pre-enter-right');
      phoneStep?.classList.add('slide-out-left');
      setTimeout(() => {
        phoneStep?.classList.add('hidden-step');
        phoneStep?.classList.remove('slide-out-left');
        tabsStep?.classList.remove('hidden-step');
        setTimeout(() => tabsStep?.classList.remove('pre-enter-right'), 10);
      }, 180);
      if (movistarData.recargas === null) this.loadRecargas().then(() => this.updateList(movistarData.recargas));
      else this.updateList(movistarData.recargas);
    };

    body.addEventListener('input', validate);
    
    // Auto-advance para teclado numérico
    const phone1 = body.querySelector('#mv-phone');
    const phone2 = body.querySelector('#mv-phone2');
    const nextBtn = body.querySelector('#mv-next');
    body.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const phoneStep = body.querySelector('#phone-step');
        if (!phoneStep.classList.contains('hidden-step') && !nextBtn?.disabled) {
          toTabs();
        }
        // Si estamos en phone1 con 10 dígitos, pasar a phone2
        else if (e.target === phone1 && isValid10(phone1?.value)) {
          phone2?.focus();
        }
        // Si estamos en phone2 y coinciden, enfocar botón
        else if (e.target === phone2 && !nextBtn?.disabled) {
          nextBtn?.focus();
        }
      }
    });
    
    // Re-enfocar el primer input cuando se abre el modal
    setTimeout(() => phone1?.focus(), 100);
    body.querySelector('#mv-next')?.addEventListener('click', (e) => { e.preventDefault(); if (!e.currentTarget.disabled) toTabs(); });
    body.querySelector('#mv-back')?.addEventListener('click', () => {
      const phoneStep = body.querySelector('#phone-step');
      const tabsStep = body.querySelector('#tabs-step');
      phoneStep?.classList.add('pre-enter-left');
      tabsStep?.classList.add('slide-out-right');
      setTimeout(() => {
        tabsStep?.classList.add('hidden-step');
        tabsStep?.classList.remove('slide-out-right');
        phoneStep?.classList.remove('hidden-step');
        setTimeout(() => phoneStep?.classList.remove('pre-enter-left'), 10);
      }, 180);
    });

    body.addEventListener('click', (e) => {
      const item = e.target.closest('.service-item');
      if (item) {
        if (item.classList.contains('insufficient-funds')) {
          // Vibración de error
          MovistarServices.hapticFeedback('error');
          const price = parseFloat(item.querySelector('.service-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;
          MovistarServices.mostrarSaldoInsuficiente(price);
          return;
        }
        // Vibración al seleccionar
        MovistarServices.hapticFeedback('light');
        body.querySelectorAll('.service-item.selected').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        validate();
      }
    });

    body.addEventListener('click', (e) => {
      if (e.target.closest('#mv-pay')) {
        const selected = body.querySelector('.service-item.selected');
        const phone = (body.querySelector('#mv-phone')?.value || '').slice(0, 10);
        if (!selected || !isValid10(phone)) { Swal.fire('Error', 'Selecciona un servicio y número válido', 'error'); return; }
        const name = selected.querySelector('.service-name')?.textContent?.trim() || 'Servicio Movistar';
        const priceTxt = selected.querySelector('.service-price')?.textContent || '$0';
        const sku = selected.dataset.sku;
        const price = parseFloat(priceTxt.replace(/[^0-9.]/g, '')) || 0;
        const commission = 2;
        
        // Validar saldo del monedero
        if (price > movistarData.monederoSaldo) {
          MovistarServices.hapticFeedback('error');
          MovistarServices.mostrarSaldoInsuficiente(price);
          return;
        }
        
        // 🚀 Usar payment handler con Point + Efectivo
        if (window.ServicePaymentHandler) {
          window.ServicePaymentHandler.showPaymentOptions({
            serviceName: name,
            reference: phone,
            amount: price,
            commission: commission,
            sku: sku,
            requiresRegionalization: false
          }, () => {
            MovistarServices.closeOverlay();
          });
        } else {
          // Fallback legacy
          const total = price + commission;
          Swal.fire({ title: '¿Confirmar pago?', html: `<div style="text-align:left; padding:10px;"><p><strong>Servicio:</strong> ${name}</p><p><strong>Número:</strong> ${phone}</p><p><strong>Monto:</strong> $${price.toFixed(2)}</p><p><strong>Comisión:</strong> $${commission.toFixed(2)}</p><p><strong>Total:</strong> $${total.toFixed(2)}</p></div>`, icon: 'question', showCancelButton: true, confirmButtonText: 'Pagar', cancelButtonText: 'Cancelar' }).then((res) => {
            if (res.isConfirmed) {
              // Vibración al confirmar
              MovistarServices.hapticFeedback('medium');
              Swal.fire({ 
                title: '⏳ Procesando tu recarga...', 
                html: `
                  <div style="padding: 1rem;">
                    <p style="color: #64748b; margin-bottom: 1.5rem;">Por favor espera un momento</p>
                    <div class="progress-bar">
                      <div class="progress-fill"></div>
                    </div>
                    <div style="margin-top: 1.5rem; text-align: center;">
                      <div class="movistar-spinner"></div>
                    </div>
                  </div>
                `,
                allowOutsideClick: false, 
                showConfirmButton: false
              });
              fetch('process_payment.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku, amount: price, reference: phone, commission, requiresRegionalization: false, transactionId: Date.now() }) })
                .then(r => r.json())
                .then(async d => { 
                  if (d?.success) {
                    // Descontar saldo del monedero
                    await MovistarServices.descontarSaldo(price);
                    // Vibración de éxito
                    MovistarServices.hapticFeedback('success');
                    // Confetti effect
                    MovistarServices.showConfetti();
                    Swal.fire({
                      title: '✅ ¡Pago exitoso!',
                      html: `<div style="animation: bounce 1s ease;">📱</div>`,
                      icon: 'success',
                      timer: 5000,
                      timerProgressBar: true
                    }).then(() => MovistarServices.closeOverlay()); 
                  } else { 
                    // Vibración de error
                    MovistarServices.hapticFeedback('error');
                    Swal.fire('Error', d?.error || 'Error', 'error'); 
                  } 
                });
            }
          });
        }
      }
    });

    footer.addEventListener('click', (e) => {
      if (e.target.closest('#mv-cancel')) { MovistarServices.closeOverlay(); return; }
    });
    validate();
  }
}

MovistarServices.openOverlay = ({ title, bodyHTML, footerHTML }) => {
  let root = document.getElementById('movistar-kiosk-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'movistar-kiosk-root';
    document.body.appendChild(root);
    root.innerHTML = `
      <div id="movistar-kiosk-wrapper">
        ${bodyHTML}
      </div>
    `;
    try { MovistarServices._prev = { h: document.documentElement.style.overflow, b: document.body.style.overflow }; document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; } catch { }
  }
};

MovistarServices.closeOverlay = () => {
  MovistarServices.detenerActualizacionSaldo();
  const root = document.getElementById('movistar-kiosk-root');
  if (root) root.remove();
  try { if (MovistarServices._prev) { document.documentElement.style.overflow = MovistarServices._prev.h || ''; document.body.style.overflow = MovistarServices._prev.b || ''; MovistarServices._prev = null; } } catch { }
};

// Exportar globalmente para acceso desde index.php
if (typeof window !== 'undefined') {
  window.MovistarServices = MovistarServices;
}
