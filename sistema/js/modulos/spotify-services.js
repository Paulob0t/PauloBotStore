let spotifyData = { servicios: null };

export class SpotifyServices {
  static async init() {
    try { 
      // Pre-cargar CSS antes de mostrar el modal
      this.preloadStyles();
      // Usar requestAnimationFrame para renderizado más suave
      requestAnimationFrame(() => {
        this.render(); 
        this.wire();
      });
    } catch { 
      Swal.fire("Error","No se pudieron cargar los servicios de Spotify","error"); 
    }
  }

  static preloadStyles() {
    // Cargar estilos una sola vez al inicio
    if (!document.getElementById("spotify-styles")) {
      const style = document.createElement("style");
      style.id = "spotify-styles";
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    }
  }

  static getStyles() {
    return `
      /* ===== SPOTIFY OPTIMIZADO - SIN LAG ===== */
      #spotify-kiosk-root {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(10, 20, 15, 0.92);
        display: flex; align-items: center; justify-content: center; padding: 1rem;
        animation: fadeIn 0.15s ease-out; overflow: auto;
      }
      #spotify-kiosk-wrapper { width: 98%; max-width: none; max-height: 96vh; display: flex; align-items: center; justify-content: center; }
      .spotify-main-card {
        width: 100%; max-height: 96vh; background: white; border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden; animation: slideUp 0.2s ease-out;
        display: flex; flex-direction: column;
      }
      .spotify-header {
        background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); padding: 2.5rem;
        text-align: center; position: relative; flex-shrink: 0;
      }
      .spotify-header img {
        max-width: 180px; height: auto; filter: brightness(1.1);
      }
      .spotify-header h2 {
        color: white; margin: 1rem 0 0 0; font-weight: 700; font-size: 2.2rem;
      }
      .spotify-content { padding: 3rem; background: #fafbfc; overflow-y: auto; flex: 1; }
      .step-chip {
        display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #1DB954;
        font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; border-radius: 12px;
        border: 2px solid #d0f5dd; margin-bottom: 2rem;
      }
      .section-title { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1.2rem; }
      .input-wrap { position: relative; margin-bottom: 1.2rem; }
      .input-wrap input {
        width: 100%; padding: 1.1rem 4rem 1.1rem 1.3rem; border: 2px solid #e2e8f0; border-radius: 12px;
        font-size: 1.1rem; transition: border-color 0.15s ease, box-shadow 0.15s ease; background: white;
        color: #1e293b; font-weight: 500;
      }
      .input-wrap input::placeholder { color: #94a3b8; font-weight: 400; }
      .input-wrap input:focus {
        outline: none; border-color: #1DB954; background: white;
        box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.1);
      }
      .state-icon {
        position: absolute; right: 1.3rem; top: 50%; transform: translateY(-50%);
        font-weight: 700; font-size: 1.3rem; transition: all 0.15s ease;
      }
      .state-icon.ok { color: #10b981; }
      .state-icon.err { color: #ef4444; }
      .error-message {
        color: #dc2626; font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; display: none;
        padding: 0.7rem 1rem; background: #fef2f2; border-left: 3px solid #dc2626; border-radius: 8px;
      }
      .hint-card {
        background: white; border: 2px solid #d0f5dd; border-radius: 12px; padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .hint-list { list-style: none; padding: 0; margin: 0; }
      .hint-item {
        display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.8rem;
        font-size: 0.95rem; color: #475569; line-height: 1.5;
      }
      .hint-item:last-child { margin-bottom: 0; }
      .hint-icon {
        display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px;
        background: #1DB954; color: white; border-radius: 50%;
        font-size: 0.75rem; font-weight: 700;
      }
      .step-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
        padding-bottom: 1.2rem; border-bottom: 2px solid #e2e8f0; flex-wrap: wrap; gap: 1rem;
      }
      .button-group {
        display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #e2e8f0;
        justify-content: flex-end; align-items: center;
      }
      .modern-btn {
        padding: 0.9rem 1.8rem; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem;
        cursor: pointer; transition: all 0.15s ease;
        min-width: 130px;
      }
      .modern-btn:active { transform: scale(0.98); }
      .btn-primary-spotify {
        background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); color: white;
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
      }
      .btn-primary-spotify:hover { box-shadow: 0 6px 18px rgba(29, 185, 84, 0.4); }
      .btn-primary-spotify:disabled {
        opacity: 0.5; cursor: not-allowed; box-shadow: none;
      }
      .btn-secondary-spotify {
        background: white; color: #475569; border: 2px solid #e2e8f0;
      }
      .btn-secondary-spotify:hover {
        background: #f8fafc; border-color: #cbd5e1;
      }
      .service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.2rem; }
      .service-item {
        background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.3rem; cursor: pointer;
        transition: all 0.15s ease; display: flex; flex-direction: column; gap: 0.7rem;
        position: relative; min-height: 140px;
      }
      .service-item::before {
        content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: #1DB954; transform: scaleX(0); transition: transform 0.15s ease;
      }
      .service-item:hover {
        transform: translateY(-2px); border-color: #1DB954; box-shadow: 0 8px 20px rgba(29, 185, 84, 0.12);
      }
      .service-item:hover::before { transform: scaleX(1); }
      .service-item.selected {
        border-color: #1DB954; background: #f0fdf4;
        box-shadow: 0 8px 24px rgba(29, 185, 84, 0.2);
      }
      .service-item.selected::before { transform: scaleX(1); }
      .service-item .service-name { font-weight: 600; font-size: 0.98rem; color: #1e293b; line-height: 1.3; }
      .service-item .service-price {
        display: inline-block; background: #1DB954;
        color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 1.2rem;
        align-self: flex-start;
      }
      .step-screen { opacity: 1; transform: translateX(0); transition: opacity 0.15s ease, transform 0.15s ease; }
      .hidden-step { display: none !important; }
      .pre-enter-right { opacity: 0; transform: translateX(15px); }
      .pre-enter-left { opacity: 0; transform: translateX(-15px); }
      .slide-out-left { opacity: 0; transform: translateX(-15px); }
      .slide-out-right { opacity: 0; transform: translateX(15px); }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      #spotify-kiosk-footer {
        padding: 1.3rem 2rem; background: white; border-top: 2px solid #e2e8f0; display: flex;
        justify-content: center; align-items: center; gap: 1rem;
        flex-shrink: 0; border-radius: 0 0 16px 16px;
      }
      #spotify-kiosk-footer .modern-btn { min-width: 180px; }
      @media (max-width: 768px) {
        #spotify-kiosk-root { padding: 0; }
        .spotify-main-card { width: 100%; border-radius: 0; min-height: 100vh; max-width: 100%; max-height: 100vh; }
        .spotify-header { padding: 2rem 1.5rem; }
        .spotify-header img { max-width: 140px; }
        .spotify-header h2 { font-size: 1.8rem; }
        .spotify-content { padding: 2rem 1.5rem; }
        .service-grid { grid-template-columns: 1fr; gap: 1rem; }
        .button-group { flex-direction: column; }
        .modern-btn { width: 100%; min-width: unset; padding: 1.1rem 2rem; font-size: 1.05rem; }
        #spotify-kiosk-footer { padding: 1.1rem 1.3rem; }
        #spotify-kiosk-footer .modern-btn { width: 100%; padding: 1.1rem 2rem; }
      }
      @media (min-width: 769px) and (max-width: 1200px) {
        .spotify-main-card { width: 96%; max-width: none; }
        .service-grid { grid-template-columns: repeat(3, 1fr); }
        .spotify-content { padding: 2.5rem; }
      }
      @media (min-width: 1201px) {
        .spotify-main-card { width: 96%; max-width: none; }
        .service-grid { grid-template-columns: repeat(3, 1fr); }
        .spotify-content { padding: 3rem 3.5rem; }
      }
      @media (min-width: 1600px) {
        .spotify-main-card { width: 94%; max-width: none; }
        .service-grid { grid-template-columns: repeat(4, 1fr); }
        .spotify-content { padding: 3rem 4rem; }
      }
    `;
  }

  static async load() {
    try {
      const cached = window.ServiceCache?.get('spotify');
      if (cached) { spotifyData.servicios = cached; return; }
      const r = await fetch('spotify_functional.php');
      const d = await r.json();
      const list = d?.services || [];
      spotifyData.servicios = list;
      window.ServiceCache?.set('spotify', list);
    } catch { spotifyData.servicios = []; }
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
    const target = document.querySelector(`.spotify-main-card .service-grid`);
    if (target) target.innerHTML = this.renderList(list);
  }

  static render() {
    // CSS ya pre-cargado en init(), solo asegurar que exista
    this.preloadStyles();

    const bodyHTML = `
      <div class="spotify-main-card">
        <div class="spotify-header">
          <img src="images/services/spotify.png" alt="Spotify" />
          <h2>Servicios Spotify</h2>
        </div>
        
        <div class="spotify-content">
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
              <input type="tel" id="sp-ref" placeholder="Número telefónico (10 dígitos)" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autofocus />
              <span class="state-icon" id="sp-s1"></span>
            </div>
            
            <div class="input-wrap">
              <input type="tel" id="sp-ref2" placeholder="Confirma el número" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" />
              <span class="state-icon" id="sp-s2"></span>
            </div>
            
            <div id="sp-err" class="error-message">Los números no coinciden</div>
            
            <div class="button-group">
              <button id="sp-next" class="modern-btn btn-primary-spotify" disabled>Continuar →</button>
            </div>
          </div>
          
          <div id="services-step" class="step-screen hidden-step">
            <div class="step-header">
              <div class="step-chip">📋 Paso 2: Elige tu servicio</div>
              <button id="sp-back" class="modern-btn btn-secondary-spotify">← Regresar</button>
            </div>
            
            <div class="hint-card">
              <div class="hint-item">
                <span class="hint-icon">ℹ</span>
                <span>Selecciona el servicio que necesitas de la lista disponible</span>
              </div>
            </div>
            
            <div class="service-grid"></div>
            
            <div class="button-group" style="margin-top: 3rem;">
              <button class="modern-btn btn-primary-spotify" id="sp-pay" style="display:none;" disabled>💳 Pagar</button>
            </div>
          </div>
        </div>
        
        <div id="spotify-kiosk-footer">
          <button class="modern-btn btn-secondary-spotify" id="sp-cancel">Cerrar</button>
        </div>
      </div>
    `;

    SpotifyServices.openOverlay({ title: 'Servicios Spotify', bodyHTML });
  }

  static wire() {
    const elements = {
      body: document.querySelector('.spotify-main-card'),
      footer: document.getElementById('spotify-kiosk-footer'),
      ref1: null, ref2: null, s1: null, s2: null, err: null, next: null,
      phoneStep: null, servicesStep: null, back: null, pay: null
    };

    if (!elements.body || !elements.footer) return;

    // Cache de elementos una sola vez
    elements.ref1 = elements.body.querySelector('#sp-ref');
    elements.ref2 = elements.body.querySelector('#sp-ref2');
    elements.s1 = elements.body.querySelector('#sp-s1');
    elements.s2 = elements.body.querySelector('#sp-s2');
    elements.err = elements.body.querySelector('#sp-err');
    elements.next = elements.body.querySelector('#sp-next');
    elements.phoneStep = elements.body.querySelector('#phone-step');
    elements.servicesStep = elements.body.querySelector('#services-step');
    elements.back = elements.body.querySelector('#sp-back');
    elements.pay = elements.body.querySelector('#sp-pay');

    const isValid10 = v => /^[0-9]{10}$/.test(v || '');
    
    const validate = () => {
      const p1 = (elements.ref1?.value || '').replace(/\D/g, '').slice(0, 10);
      const p2 = (elements.ref2?.value || '').replace(/\D/g, '').slice(0, 10);
      const ok = isValid10(p1), cok = isValid10(p2), match = ok && cok && p1 === p2;
      
      if (elements.ref1.value !== p1) elements.ref1.value = p1;
      if (elements.ref2.value !== p2) elements.ref2.value = p2;
      
      if (elements.s1) { 
        elements.s1.textContent = ok ? '✓' : (p1 ? '!' : ''); 
        elements.s1.className = 'state-icon ' + (ok ? 'ok' : (p1 ? 'err' : '')); 
      }
      if (elements.s2) { 
        elements.s2.textContent = cok ? (match ? '✓' : '!') : (p2 ? '!' : ''); 
        elements.s2.className = 'state-icon ' + (match ? 'ok' : (p2 ? 'err' : '')); 
      }
      if (elements.err) elements.err.style.display = (p2 && !match) ? 'block' : 'none';
      if (elements.next) elements.next.disabled = !match;
      
      const selected = elements.body.querySelector('.service-item.selected');
      if (elements.pay) { 
        elements.pay.style.display = selected ? 'inline-block' : 'none'; 
        elements.pay.disabled = !selected || !match; 
      }
      
      // 🎯 Auto-avance: si ref1 tiene 10 dígitos, mover foco a ref2
      if (ok && document.activeElement === elements.ref1 && !p2) {
        elements.ref2?.focus();
      }
      // 🎯 Auto-avance: si ref2 tiene 10 dígitos y coinciden, enfocar botón
      if (match && document.activeElement === elements.ref2) {
        elements.next?.focus();
      }
    };

    const toServices = () => {
      requestAnimationFrame(() => {
        elements.servicesStep?.classList.add('pre-enter-right');
        elements.phoneStep?.classList.add('slide-out-left');
        setTimeout(() => {
          elements.phoneStep?.classList.add('hidden-step');
          elements.phoneStep?.classList.remove('slide-out-left');
          elements.servicesStep?.classList.remove('hidden-step');
          requestAnimationFrame(() => elements.servicesStep?.classList.remove('pre-enter-right'));
        }, 120);
      });
      if (spotifyData.servicios === null) this.load().then(() => this.updateList(spotifyData.servicios));
      else this.updateList(spotifyData.servicios);
    };

    const toPhone = () => {
      requestAnimationFrame(() => {
        elements.phoneStep?.classList.add('pre-enter-left');
        elements.servicesStep?.classList.add('slide-out-right');
        setTimeout(() => {
          elements.servicesStep?.classList.add('hidden-step');
          elements.servicesStep?.classList.remove('slide-out-right');
          elements.phoneStep?.classList.remove('hidden-step');
          requestAnimationFrame(() => elements.phoneStep?.classList.remove('pre-enter-left'));
        }, 120);
      });
    };

    const handlePayment = async () => {
      const selected = elements.body.querySelector('.service-item.selected');
      const phone = (elements.ref1?.value || '').slice(0, 10);
      if (!selected || !isValid10(phone)) { 
        Swal.fire('Error', 'Selecciona un servicio y número válido', 'error'); 
        return; 
      }
      
      const name = selected.querySelector('.service-name')?.textContent?.trim() || 'Servicio Spotify';
      const priceTxt = selected.querySelector('.service-price')?.textContent || '$0';
      const sku = selected.dataset.sku;
      const override = parseFloat(selected.dataset.overridePrice || '');
      const price = (isFinite(override) && override > 0 ? override : (parseFloat(priceTxt.replace(/[^0-9.]/g, '')) || 0));
      const commission = 2;
      
      if (window.ServicePaymentHandler) {
        window.ServicePaymentHandler.showPaymentOptions({
          serviceName: name,
          reference: phone,
          amount: price,
          commission: commission,
          sku: sku,
          requiresRegionalization: false
        }, () => {
          SpotifyServices.closeOverlay();
        });
      } else {
        const total = price + commission;
        Swal.fire({
          title: '¿Confirmar pago?',
          html: `<div style="text-align:left; padding:10px;"><p><strong>Servicio:</strong> ${name}</p><p><strong>Número:</strong> ${phone}</p><p><strong>Monto:</strong> $${price.toFixed(2)}</p><p><strong>Comisión:</strong> $${commission.toFixed(2)}</p><p><strong>Total:</strong> $${total.toFixed(2)}</p></div>`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Pagar',
          cancelButtonText: 'Cancelar'
        }).then((res) => {
          if (res.isConfirmed) {
            Swal.fire({ title: 'Procesando...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
            fetch('process_payment.php', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ sku, amount: price, reference: phone, commission, requiresRegionalization: false, transactionId: Date.now() }) 
            })
            .then(r => r.json())
            .then(d => { 
              if (d?.success) { 
                Swal.fire('¡Pago exitoso!', '', 'success').then(() => SpotifyServices.closeOverlay()); 
              } else { 
                Swal.fire('Error', d?.error || 'Error', 'error'); 
              } 
            });
          }
        });
      }
    };

    // Soporte para teclado numérico: Enter avanza en cualquier paso
    elements.body.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        
        // Si estamos en el paso de teléfono y es válido, avanzar
        if (!elements.phoneStep.classList.contains('hidden-step') && !elements.next.disabled) {
          toServices();
        }
        // Si estamos en ref1 con 10 dígitos, pasar a ref2
        else if (e.target === elements.ref1 && isValid10(elements.ref1.value)) {
          elements.ref2?.focus();
        }
        // Si estamos en ref2 y coinciden, enfocar botón
        else if (e.target === elements.ref2 && !elements.next.disabled) {
          elements.next?.focus();
        }
      }
    });
    
    // Validación en tiempo real
    elements.body.addEventListener('input', validate);
    
    // Re-enfocar el primer input cuando se abre el modal
    setTimeout(() => elements.ref1?.focus(), 100);
    
    // Evento único consolidado - Event delegation
    elements.body.addEventListener('click', async (e) => {
      // Botón siguiente
      if (e.target.closest('#sp-next')) {
        e.preventDefault();
        if (!e.target.closest('#sp-next').disabled) toServices();
        return;
      }
      
      // Botón regresar
      if (e.target.closest('#sp-back')) {
        toPhone();
        return;
      }
      
      // Botón pagar
      if (e.target.closest('#sp-pay')) {
        await handlePayment();
        return;
      }
      
      // Click en servicio
      const item = e.target.closest('.service-item');
      if (item) {
        elements.body.querySelectorAll('.service-item.selected').forEach(i => i.classList.remove('selected'));
        const priceTxt = item.querySelector('.service-price')?.textContent || '$0';
        const price = parseFloat(priceTxt.replace(/[^0-9.]/g, '')) || 0;
        let chosenPrice = price;
        
        if (price === 0) {
          const res = await Swal.fire({
            title: 'Elige monto',
            input: 'select',
            inputOptions: { '100': '$100', '200': '$200', '300': '$300' },
            inputPlaceholder: 'Selecciona un monto',
            showCancelButton: true,
            confirmButtonText: 'Usar monto',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1DB954'
          });
          if (!res.isConfirmed || !res.value) return;
          chosenPrice = parseFloat(res.value);
          const priceEl = item.querySelector('.service-price');
          if (priceEl) priceEl.textContent = `$${chosenPrice.toFixed(2)}`;
          item.dataset.overridePrice = String(chosenPrice);
        }
        item.classList.add('selected');
        validate();
      }
    });

    elements.body.addEventListener('input', validate);
    elements.body.addEventListener('keyup', (e) => { 
      if (e.key === 'Enter' && !elements.next?.disabled) toServices(); 
    });

    elements.footer.addEventListener('click', (e) => {
      if (e.target.closest('#sp-cancel')) { 
        SpotifyServices.closeOverlay(); 
      }
    });
    
    validate();
  }
}

SpotifyServices.openOverlay = ({ title, bodyHTML }) => {
  let root = document.getElementById('spotify-kiosk-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'spotify-kiosk-root';
    document.body.appendChild(root);
    root.innerHTML = `
      <div id="spotify-kiosk-wrapper">
        ${bodyHTML}
      </div>
    `;
    try { 
      SpotifyServices._prev = { 
        h: document.documentElement.style.overflow, 
        b: document.body.style.overflow 
      }; 
      document.documentElement.style.overflow = 'hidden'; 
      document.body.style.overflow = 'hidden'; 
    } catch { }
  }
};

SpotifyServices.closeOverlay = () => {
  const root = document.getElementById('spotify-kiosk-root');
  if (root) root.remove();
  try { 
    if (SpotifyServices._prev) { 
      document.documentElement.style.overflow = SpotifyServices._prev.h || ''; 
      document.body.style.overflow = SpotifyServices._prev.b || ''; 
      SpotifyServices._prev = null; 
    } 
  } catch { }
};

// Exportar globalmente para acceso desde index.php
if (typeof window !== 'undefined') {
  window.SpotifyServices = SpotifyServices;
}

