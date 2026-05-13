let netflixData = { servicios: null };

export class NetflixServices {
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
      Swal.fire("Error","No se pudieron cargar los servicios de Netflix","error"); 
    }
  }

  static preloadStyles() {
    // Cargar estilos una sola vez al inicio
    if (!document.getElementById("netflix-styles")) {
      const style = document.createElement("style");
      style.id = "netflix-styles";
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    }
  }

  static getStyles() {
    return `
      /* ===== NETFLIX OPTIMIZADO - SIN LAG ===== */
      #netflix-kiosk-root {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(20, 5, 5, 0.92);
        display: flex; align-items: center; justify-content: center; padding: 1rem;
        animation: fadeIn 0.15s ease-out; overflow: auto;
      }
      #netflix-kiosk-wrapper { width: 98%; max-width: none; max-height: 96vh; display: flex; align-items: center; justify-content: center; }
      .netflix-main-card {
        width: 100%; max-height: 96vh; background: white; border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden; animation: slideUp 0.2s ease-out;
        display: flex; flex-direction: column;
      }
      .netflix-header {
        background: linear-gradient(135deg, #E50914 0%, #B20710 100%); padding: 2.5rem;
        text-align: center; position: relative; flex-shrink: 0;
      }
      .netflix-header img {
        max-width: 180px; height: auto; filter: brightness(1.1);
      }
      .netflix-header h2 {
        color: white; margin: 1rem 0 0 0; font-weight: 700; font-size: 2.2rem;
      }
      .netflix-content { padding: 3rem; background: #fafbfc; overflow-y: auto; flex: 1; }
      .step-chip {
        display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #E50914;
        font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; border-radius: 12px;
        border: 2px solid #fecaca; margin-bottom: 2rem;
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
        outline: none; border-color: #E50914; background: white;
        box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
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
        background: white; border: 2px solid #fecaca; border-radius: 12px; padding: 1.5rem;
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
        background: #E50914; color: white; border-radius: 50%;
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
      .btn-primary-netflix {
        background: linear-gradient(135deg, #E50914 0%, #B20710 100%); color: white;
        box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
      }
      .btn-primary-netflix:hover { box-shadow: 0 6px 18px rgba(229, 9, 20, 0.4); }
      .btn-primary-netflix:disabled {
        opacity: 0.5; cursor: not-allowed; box-shadow: none;
      }
      .btn-secondary-netflix {
        background: white; color: #475569; border: 2px solid #e2e8f0;
      }
      .btn-secondary-netflix:hover {
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
        background: #E50914; transform: scaleX(0); transition: transform 0.15s ease;
      }
      .service-item:hover {
        transform: translateY(-2px); border-color: #E50914; box-shadow: 0 8px 20px rgba(229, 9, 20, 0.12);
      }
      .service-item:hover::before { transform: scaleX(1); }
      .service-item.selected {
        border-color: #E50914; background: #fef2f2;
        box-shadow: 0 8px 24px rgba(229, 9, 20, 0.2);
      }
      .service-item.selected::before { transform: scaleX(1); }
      .service-item .service-name { font-weight: 600; font-size: 0.98rem; color: #1e293b; line-height: 1.3; }
      .service-item .service-price {
        display: inline-block; background: #E50914;
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
      #netflix-kiosk-footer {
        padding: 1.3rem 2rem; background: white; border-top: 2px solid #e2e8f0; display: flex;
        justify-content: center; align-items: center; gap: 1rem;
        flex-shrink: 0; border-radius: 0 0 16px 16px;
      }
      #netflix-kiosk-footer .modern-btn { min-width: 180px; }
      @media (max-width: 768px) {
        #netflix-kiosk-root { padding: 0; }
        .netflix-main-card { width: 100%; border-radius: 0; min-height: 100vh; max-width: 100%; max-height: 100vh; }
        .netflix-header { padding: 2rem 1.5rem; }
        .netflix-header img { max-width: 140px; }
        .netflix-header h2 { font-size: 1.8rem; }
        .netflix-content { padding: 2rem 1.5rem; }
        .service-grid { grid-template-columns: 1fr; gap: 1rem; }
        .button-group { flex-direction: column; }
        .modern-btn { width: 100%; min-width: unset; padding: 1.1rem 2rem; font-size: 1.05rem; }
        #netflix-kiosk-footer { padding: 1.1rem 1.3rem; }
        #netflix-kiosk-footer .modern-btn { width: 100%; padding: 1.1rem 2rem; }
      }
      @media (min-width: 769px) and (max-width: 1200px) {
        .netflix-main-card { width: 96%; max-width: none; }
        .service-grid { grid-template-columns: repeat(3, 1fr); }
        .netflix-content { padding: 2.5rem; }
      }
      @media (min-width: 1201px) {
        .netflix-main-card { width: 96%; max-width: none; }
        .service-grid { grid-template-columns: repeat(3, 1fr); }
        .netflix-content { padding: 3rem 3.5rem; }
      }
      @media (min-width: 1600px) {
        .netflix-main-card { width: 94%; max-width: none; }
        .service-grid { grid-template-columns: repeat(4, 1fr); }
        .netflix-content { padding: 3rem 4rem; }
      }
    `;
  }

  static async load() {
    try {
      const cached = window.ServiceCache?.get("netflix");
      if (cached) { netflixData.servicios = cached; return; }
      const r = await fetch("netflix_functional.php");
      const d = await r.json();
      const list = d?.services || [];
      netflixData.servicios = list;
      window.ServiceCache?.set("netflix", list);
    } catch { netflixData.servicios = []; }
  }

  static renderList(list) {
    if (list === null) {
      return `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#6b7280;">
          <i class="fa fa-spinner fa-spin" style="font-size:2.5rem; color:#E50914; margin-bottom:1rem;"></i>
          <p style="font-size:1.1rem; font-weight:600;">Cargando servicios Netflix...</p>
        </div>
      `;
    }
    if (!Array.isArray(list) || list.length === 0) {
      return `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#6b7280;">
          <i class="fa fa-exclamation-circle" style="font-size:2.5rem; color:#fbbf24; margin-bottom:1rem;"></i>
          <p style="font-size:1.1rem; font-weight:600;">No hay servicios disponibles</p>
        </div>
      `;
    }
    return list.map(s => `
      <div class="service-item" data-sku="${s.sku}">
        <div class="service-name">${s.formatted_name}</div>
        ${s.description ? `<div style="font-size:0.9rem; color:#6b7280; margin-top:0.5rem;">${s.description}</div>` : ""}
        <div class="service-price">${s.price_display}</div>
        <div style="font-size:0.85rem; color:#9ca3af; margin-top:0.5rem;">SKU: ${s.sku}</div>
      </div>
    `).join("");
  }

  static updateList(list) {
    const target = document.querySelector(`.netflix-main-card .service-grid`);
    if (target) target.innerHTML = this.renderList(list);
  }

  static render() {
    // CSS ya pre-cargado en init(), solo asegurar que exista
    this.preloadStyles();

    const bodyHTML = `
      <div class="netflix-main-card">
        <div class="netflix-header">
          <img src="images/services/netflix.png" alt="Netflix" />
          <h2>Servicios Netflix</h2>
        </div>
        <div class="netflix-content">
          <div id="phone-step" class="step-screen">
            <div class="step-chip"> Paso 1: Ingresa tu número telefónico</div>
            <div class="section-title">Número de teléfono</div>
            <div class="hint-card">
              <ul class="hint-list">
                <li class="hint-item"><span class="hint-icon">1</span><span>Escribe tu número celular de 10 dígitos</span></li>
                <li class="hint-item"><span class="hint-icon">2</span><span>Confírmalo en el segundo campo</span></li>
                <li class="hint-item"><span class="hint-icon">3</span><span>Haz clic en "Continuar"</span></li>
              </ul>
            </div>
            <div class="input-wrap">
              <input type="tel" id="nf-ref" placeholder="Número telefónico (10 dígitos)" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autofocus />
              <span class="state-icon" id="nf-s1"></span>
            </div>
            <div class="input-wrap">
              <input type="tel" id="nf-ref2" placeholder="Confirma el número" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" />
              <span class="state-icon" id="nf-s2"></span>
            </div>
            <div id="nf-err" class="error-message">Los números no coinciden</div>
            <div class="button-group">
              <button id="nf-next" class="modern-btn btn-primary-netflix" disabled>Continuar </button>
            </div>
          </div>
          <div id="services-step" class="step-screen hidden-step">
            <div class="step-header">
              <div class="step-chip"> Paso 2: Elige tu servicio</div>
              <button id="nf-back" class="modern-btn btn-secondary-netflix"> Regresar</button>
            </div>
            <div class="hint-card">
              <div class="hint-item">
                <span class="hint-icon">ℹ</span>
                <span>Selecciona el servicio que necesitas de la lista disponible</span>
              </div>
            </div>
            <div class="service-grid"></div>
            <div class="button-group" style="margin-top: 3rem;">
              <button class="modern-btn btn-primary-netflix" id="nf-pay" style="display:none;" disabled> Pagar</button>
            </div>
          </div>
        </div>
        <div id="netflix-kiosk-footer">
          <button class="modern-btn btn-secondary-netflix" id="nf-cancel">Cerrar</button>
        </div>
      </div>
    `;

    NetflixServices.openOverlay({ title: "Servicios Netflix", bodyHTML });
  }

  static wire() {
    const body = document.querySelector(".netflix-main-card");
    const footer = document.getElementById("netflix-kiosk-footer");
    if (!body || !footer) return;

    // 🚀 Cachear elementos del DOM (solo 1 vez)
    const elements = {
      ref1: body.querySelector("#nf-ref"),
      ref2: body.querySelector("#nf-ref2"),
      s1: body.querySelector("#nf-s1"),
      s2: body.querySelector("#nf-s2"),
      err: body.querySelector("#nf-err"),
      next: body.querySelector("#nf-next"),
      back: body.querySelector("#nf-back"),
      pay: body.querySelector("#nf-pay"),
      phoneStep: body.querySelector("#phone-step"),
      servicesStep: body.querySelector("#services-step"),
      cancel: footer.querySelector("#nf-cancel")
    };

    const isValid10 = v => /^[0-9]{10}$/.test(v || "");
    
    const validate = () => {
      const p1 = (elements.ref1.value || "").replace(/\D/g, "").slice(0, 10);
      const p2 = (elements.ref2.value || "").replace(/\D/g, "").slice(0, 10);
      const ok = isValid10(p1), cok = isValid10(p2), match = ok && cok && p1 === p2;
      
      // Actualizar valores limpios
      if (elements.ref1.value !== p1) elements.ref1.value = p1;
      if (elements.ref2.value !== p2) elements.ref2.value = p2;
      
      // Estado visual input 1
      elements.s1.textContent = ok ? "✓" : (p1 ? "!" : "");
      elements.s1.className = "state-icon " + (ok ? "ok" : (p1 ? "err" : ""));
      
      // Estado visual input 2
      elements.s2.textContent = cok ? (match ? "✓" : "!") : (p2 ? "!" : "");
      elements.s2.className = "state-icon " + (match ? "ok" : (p2 ? "err" : ""));
      
      // Error message
      elements.err.style.display = (p2 && !match) ? "block" : "none";
      elements.next.disabled = !match;
      
      // Botón pagar
      const selected = body.querySelector(".service-item.selected");
      elements.pay.style.display = selected ? "inline-block" : "none";
      elements.pay.disabled = !selected || !match;
    };

    const toServices = () => {
      elements.servicesStep.classList.add("pre-enter-right");
      elements.phoneStep.classList.add("slide-out-left");
      
      // Usar requestAnimationFrame para transición más suave
      requestAnimationFrame(() => {
        setTimeout(() => {
          elements.phoneStep.classList.add("hidden-step");
          elements.phoneStep.classList.remove("slide-out-left");
          elements.servicesStep.classList.remove("hidden-step");
          requestAnimationFrame(() => {
            elements.servicesStep.classList.remove("pre-enter-right");
          });
        }, 120); // Reducido de 180ms a 120ms
      });
      
      if (netflixData.servicios === null) {
        this.updateList(null); // Mostrar "Cargando..."
        this.load().then(() => this.updateList(netflixData.servicios));
      } else {
        this.updateList(netflixData.servicios);
      }
    };

    const toPhone = () => {
      elements.phoneStep.classList.add("pre-enter-left");
      elements.servicesStep.classList.add("slide-out-right");
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          elements.servicesStep.classList.add("hidden-step");
          elements.servicesStep.classList.remove("slide-out-right");
          elements.phoneStep.classList.remove("hidden-step");
          requestAnimationFrame(() => {
            elements.phoneStep.classList.remove("pre-enter-left");
          });
        }, 120);
      });
    };

    const handlePayment = () => {
      const selected = body.querySelector(".service-item.selected");
      const phone = elements.ref1.value.slice(0, 10);
      
      if (!selected || !isValid10(phone)) {
        Swal.fire("Error", "Selecciona un servicio y número válido", "error");
        return;
      }
      
      const name = selected.querySelector(".service-name")?.textContent?.trim() || "Servicio Netflix";
      const priceTxt = selected.querySelector(".service-price")?.textContent || "$0";
      const sku = selected.dataset.sku;
      const price = parseFloat(priceTxt.replace(/[^0-9.]/g, "")) || 0;
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
          NetflixServices.closeOverlay();
        });
      } else {
        Swal.fire("Error", "Sistema de pago no disponible", "error");
      }
    };

    // 🎯 Event Listeners optimizados
    body.addEventListener("input", validate);
    
    // Soporte para teclado numérico: Enter avanza en cualquier paso
    body.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
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
    
    // Re-enfocar el primer input cuando se abre el modal
    setTimeout(() => elements.ref1?.focus(), 100);
    
    // Consolidar clicks en un solo listener
    body.addEventListener("click", (e) => {
      const target = e.target;
      
      // Click en Continuar
      if (target.closest("#nf-next")) {
        e.preventDefault();
        if (!elements.next.disabled) toServices();
      }
      
      // Click en Regresar
      else if (target.closest("#nf-back")) {
        toPhone();
      }
      
      // Click en servicio
      else if (target.closest(".service-item")) {
        body.querySelectorAll(".service-item.selected").forEach(i => i.classList.remove("selected"));
        target.closest(".service-item").classList.add("selected");
        validate();
      }
      
      // Click en Pagar
      else if (target.closest("#nf-pay")) {
        handlePayment();
      }
    });
    
    elements.cancel.addEventListener("click", () => NetflixServices.closeOverlay());
    
    validate();
  }
}

NetflixServices.openOverlay = ({ title, bodyHTML }) => {
  let root = document.getElementById("netflix-kiosk-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "netflix-kiosk-root";
    document.body.appendChild(root);
    root.innerHTML = `
      <div id="netflix-kiosk-wrapper">
        ${bodyHTML}
      </div>
    `;
    try { NetflixServices._prev = { h: document.documentElement.style.overflow, b: document.body.style.overflow }; document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; } catch { }
  }
};

NetflixServices.closeOverlay = () => {
  const root = document.getElementById("netflix-kiosk-root");
  if (root) root.remove();
  try { if (NetflixServices._prev) { document.documentElement.style.overflow = NetflixServices._prev.h || ""; document.body.style.overflow = NetflixServices._prev.b || ""; NetflixServices._prev = null; } } catch { }
};

// Exportar al window para compatibilidad
if (typeof window !== 'undefined') {
  window.NetflixServices = NetflixServices;
}
