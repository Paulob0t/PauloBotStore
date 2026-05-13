const providers = [
  {
    id: 'telcel',
    label: 'Telcel',
    color: '#1E88E5',
  icon: 'images/providers/telcel.jpg',
  init: async () => (await import('./telcel-services.js')).TelcelServices.init(),
    ensureRendered: () => {
    }
  },
  {
    id: 'movistar',
    label: 'Movistar',
    color: '#019DF4',
  icon: 'images/providers/Movistar-Logo-2004.jpg',
  init: async () => (await import('./movistar-services.js')).MovistarServices.init(),
    ensureRendered: () => {}
  },
  {
    id: 'spotify',
    label: 'Spotify',
    color: '#1DB954',
  icon: 'images/providers/51rttY7a+9L.png',
  init: async () => (await import('./spotify-services.js')).SpotifyServices.init(),
    ensureRendered: () => {}
  },
  {
    id: 'netflix',
    label: 'Netflix',
    color: '#E50914',
  icon: 'images/providers/Netflix-Symbol.png',
  init: async () => (await import('./netflix-services.js')).NetflixServices.init(),
    ensureRendered: () => {}
  },
  {
    id: 'cfe',
    label: 'CFE',
    color: '#7EBC12',
  icon: 'images/providers/16806759686086.jpg',
  init: async () => (await import('./cfe-services.js')).CFEServices.init(),
    ensureRendered: () => {}
  },
  {
    id: 'megacable',
    label: 'Megacable',
    color: '#0B5ED7',
  icon: 'images/providers/Megacable.jpg',
  init: async () => (await import('./megacable-services.js')).MegacableServices.init(),
    ensureRendered: () => {}
  }
];

function clearProducts() {
  const products = document.getElementById('products-container');
  if (products) products.innerHTML = '';
}

function hideCatalogGrids() {
  const cats = document.getElementById('categories-container');
  const subs = document.getElementById('subcategories-container');
  if (cats) cats.style.display = 'none';
  if (subs) subs.style.display = 'none';
}

function showServicesMenu() {
  const services = document.getElementById('services-container');
  const products = document.getElementById('products-container');
  if (!services) return;
  services.style.display = 'grid';
  if (products) products.style.display = 'none'; 
  hideCatalogGrids();
}

function ensureButtons() {
  const container = document.getElementById('services-container');
  if (!container) return;
  if (container.dataset.ready === '1') return;

 container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 110px)';
    container.style.justifyContent = 'center';
    container.style.justifyItems = 'center';
    container.style.gap = '22px 130px';
    container.style.padding = '8px 200px 8px 200px';

  container.innerHTML = providers.map(p => `
    <button class="service-menu-btn" data-provider="${p.id}" style="
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 200px; height: 200px; border-radius: 999px; border: 3px solid ${p.color};
        background: #fff; color: #222; font-weight: 700; cursor: pointer;
        transition: transform .15s ease, box-shadow .15s ease; box-shadow: 0 4px 14px rgba(0,0,0,.08);
    ">
      <img alt="${p.label}" src="${p.icon}" style="width: 170px; height: 100px; object-fit: contain;" />
      
    </button>
  `).join('');
  container.dataset.ready = '1';

  container.querySelectorAll('.service-menu-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 6px 16px rgba(0,0,0,.12)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translateY(0)'; btn.style.boxShadow = '0 4px 14px rgba(0,0,0,.08)'; });
    btn.addEventListener('click', async (ev) => {
      const id = ev.currentTarget.getAttribute('data-provider');
      const prov = providers.find(pp => pp.id === id);
      if (!prov) return;
      clearProducts();
      showServicesMenu();
      const products = document.getElementById('products-container');
      if (products) {
        products.style.display = 'grid';
        products.style.gridTemplateColumns = 'repeat(auto-fill, minmax(360px, 1fr))';
        products.style.gap = '16px';
        products.dataset.layout = 'services';
      }
      if (window.categoryIndicator) {
        window.categoryIndicator.setType('servicios');
        window.categoryIndicator.setCategory(prov.label);
      }
      await prov.init();
    });
  });
}

function fixSwitchBug() {
  document.addEventListener('viewChange', (e) => {
    const view = e?.detail?.view;
    const services = document.getElementById('services-container');
    const products = document.getElementById('products-container');
    const cats = document.getElementById('categories-container');
    const subs = document.getElementById('subcategories-container');
    if (view === 'servicios') {
      if (services) services.style.display = 'grid';
      if (products) {
        products.style.display = 'grid';
        products.innerHTML = ''; 
      }
      if (cats) cats.style.display = 'none';
      if (subs) subs.style.display = 'none';
    }
  });
}

function wireSwitchButtons() {
  const productosBtn = document.getElementById('productos-btn');
  const serviciosBtn = document.getElementById('servicios-btn');
  if (!productosBtn || !serviciosBtn) return;

  serviciosBtn.addEventListener('click', () => {
    showServicesMenu();
    ensureButtons();
    if (window.categoryIndicator) {
      window.categoryIndicator.setType('servicios');
      window.categoryIndicator.setCategory('Servicios');
    }
  });

  productosBtn.addEventListener('click', () => {
    const services = document.getElementById('services-container');
    if (services) services.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  //console.log('🎬 services-menu.js inicializado');
  wireSwitchButtons();
  fixSwitchBug();
  
  // Escuchar el evento de servicios solicitados
  document.addEventListener('servicesRequested', () => {
    // console.log('🎯 Evento servicesRequested recibido');
    showServicesMenu();
    ensureButtons();
  });
  
  const servicesActive = document.querySelector('#servicios-btn.active');
  if (servicesActive) {
    //console.log('✅ Botón servicios activo al cargar');
    showServicesMenu();
    ensureButtons();
  }
});

// Exponer función globalmente para que view-switcher pueda usarla
window.ensureServiceButtons = ensureButtons;
