// Módulo para el manejo de formulario de productos
const ProductoFormulario = (() => {
  // Función auxiliar privada para convertir File a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Función auxiliar para mostrar mensajes
  const mostrarMensaje = (tipo, titulo, mensaje) => {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: mensaje
    });
  };

  return {
    // Configuración
    config: {
      imagenes: {
        principal: {
          maxWidth: 800,
          maxHeight: 800
        },
        secundarias: {
          maxWidth: 400,
          maxHeight: 400
        },
        maxFileSize: 2 * 1024 * 1024, // 2MB
        quality: 0.85,
        acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
      }
    },

    // Cache de elementos DOM
    elements: {},

    // Inicialización
    init() {
      this.initElements();
      this.setupEventListeners();
      this.cargarCategoriasDesdeBackend();
    },

    // Inicializar referencias DOM
    initElements() {
      this.elements = {
        categoriaSelect: document.getElementById('categoriaProducto'),
        subcategoriaSelect: document.getElementById('subcategoriaProducto'),
        btnAddCategoria: document.getElementById('btnAddCategoria'),
        btnAddSubcatModal: document.getElementById('btnAddSubcatModal'),
        modalCategoria: document.getElementById('modalCategoria'),
        modalSubcat: document.getElementById('modalSubcat'),
        form: document.querySelector('form'),
        imgInput: document.getElementById('imgInput'),
        imgPreview: document.getElementById('imgPreview'),
        imgBase64: document.getElementById('imgBase64'),
        checkDescuento: document.getElementById('checkDescuento'),
        precioProducto: document.getElementById('precioProducto'),
        precioDescuento: document.getElementById('precioDescuento'),
        grupoPrecioDescuento: document.getElementById('grupoPrecioDescuento'),
        checkDestacado: document.getElementById('destacado'),
        ordenDestacado: document.getElementById('ordenDestacado'),
        grupoOrdenDestacado: document.getElementById('grupoOrdenDestacado'),
        ubicacion: document.getElementById('ubicacion'),
        imgSecundarias: Array.from({length: 3}, (_, i) => ({
          input: document.querySelector(`input[name="img_secundaria_${i + 1}"]`),
          preview: document.getElementById(`imgSecundariaPreview${i + 1}`),
          base64: document.getElementById(`imgSecundaria${i + 1}Base64`)
        }))
      };
    },

    // Cargar categorías desde el backend
    async cargarCategoriasDesdeBackend() {
      try {
        const response = await fetch('obtener_categorias.php');
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        if (data.success && data.categorias) {
          this.renderCategorias(data.categorias);
        } else {
          mostrarMensaje('error', 'Error', data.message || 'Error al cargar categorías');
        }
      } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'Error', 'Error de conexión al cargar categorías');
      }
    },

    // Renderizar categorías en el select
    renderCategorias(categorias) {
      this.elements.categoriaSelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        option.setAttribute('data-subcats', JSON.stringify(cat.subcategorias || []));
        this.elements.categoriaSelect.appendChild(option);
      });
    },

    // Configurar todos los event listeners
    setupEventListeners() {
      // Eventos de categoría/subcategoría
      this.elements.categoriaSelect.addEventListener('change', this.handleCategoriaChange.bind(this));
      this.elements.btnAddCategoria.addEventListener('click', this.handleShowCategoriaModal.bind(this));
      this.elements.btnAddSubcatModal.addEventListener('click', this.handleShowSubcategoriaModal.bind(this));
      
      // Eventos de formulario y validación
      document.getElementById('checkSubcategorias').addEventListener('change', this.handleToggleSubcategoriaInput.bind(this));
      document.getElementById('btnGuardarCategoria').addEventListener('click', this.handleGuardarCategoria.bind(this));
      document.getElementById('btnGuardarSubcatModal').addEventListener('click', this.handleGuardarSubcategoria.bind(this));
      
      // Eventos de imágenes
      this.elements.imgInput.addEventListener('change', this.handleImagenPrincipal.bind(this));
      this.elements.imgSecundarias.forEach((img, index) => {
        img.input.addEventListener('change', (e) => this.handleImagenSecundaria(e, index + 1));
      });
      
      // Evento para el botón "Subir"
      document.querySelector('.file-upload-browse').addEventListener('click', () => {
        this.elements.imgInput.click();
      });

      // Actualizar el texto del input cuando se selecciona un archivo
      this.elements.imgInput.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || 'Ningún archivo seleccionado';
        document.querySelector('.file-upload-info').value = fileName;
      });

      // Eventos de validación de formulario
      this.elements.form.addEventListener('submit', this.handleSubmitForm.bind(this));
      this.elements.checkDescuento.addEventListener('change', this.handleToggleDescuento.bind(this));
      this.elements.checkDestacado.addEventListener('change', this.handleToggleDestacado.bind(this));
      this.elements.precioDescuento.addEventListener('input', this.handleValidacionPrecioDescuento.bind(this));
      this.elements.precioProducto.addEventListener('input', () => {
        if (this.elements.precioDescuento.value) {
          this.handleValidacionPrecioDescuento();
        }
      });

      // Validación en tiempo real
      document.getElementById('inputNuevaCategoria').addEventListener('input', this.handleValidacionCategoria.bind(this));
      document.getElementById('inputSubcatModal').addEventListener('input', this.handleValidacionSubcategoria.bind(this));
      
      // Validación de ubicación
      if (this.elements.ubicacion) {
        this.elements.ubicacion.addEventListener('input', this.handleValidacionUbicacion.bind(this));
        this.elements.ubicacion.addEventListener('blur', this.handleValidacionUbicacion.bind(this));
      }
      
      // Eventos de Enter en inputs
      document.getElementById('inputNuevaCategoria').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('btnGuardarCategoria').disabled) {
          document.getElementById('btnGuardarCategoria').click();
        }
      });
      
      document.getElementById('inputSubcatModal').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('btnGuardarSubcatModal').disabled) {
          document.getElementById('btnGuardarSubcatModal').click();
        }
      });

      // Modal focus events
      this.elements.modalCategoria.addEventListener('shown.bs.modal', () => {
        document.getElementById('inputNuevaCategoria').focus();
      });
      
      this.elements.modalSubcat.addEventListener('shown.bs.modal', () => {
        document.getElementById('inputSubcatModal').focus();
      });
    },

    // Event Handlers
    handleCategoriaChange(e) {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const subcategorias = JSON.parse(selectedOption.getAttribute('data-subcats') || '[]');

      this.elements.subcategoriaSelect.innerHTML = '<option value="" disabled selected>Selecciona una subcategoría</option>';
      subcategorias.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub.id;
        option.textContent = sub.nombre;
        this.elements.subcategoriaSelect.appendChild(option);
      });

      this.elements.subcategoriaSelect.style.display = subcategorias.length > 0 ? 'block' : 'none';
      this.elements.btnAddSubcatModal.style.display = 'inline-block';
    },

    handleShowCategoriaModal() {
      document.getElementById('inputNuevaCategoria').value = '';
      document.getElementById('checkSubcategorias').checked = false;
      document.getElementById('subcatInputSection').style.display = 'none';
      document.getElementById('inputNuevaSubcategoria').value = '';
      
      const modalCategoria = new bootstrap.Modal(this.elements.modalCategoria);
      modalCategoria.show();
    },

    handleShowSubcategoriaModal() {
      const selectedCat = this.elements.categoriaSelect.options[this.elements.categoriaSelect.selectedIndex];
      if (!selectedCat || !selectedCat.value) {
        mostrarMensaje('warning', 'Advertencia', 'Primero selecciona una categoría');
        return;
      }

      document.getElementById('nombreCategoriaSeleccionada').textContent = selectedCat.textContent;
      document.getElementById('inputSubcatModal').value = '';
      
      const modalSubcat = new bootstrap.Modal(this.elements.modalSubcat);
      modalSubcat.show();
    },

    handleToggleSubcategoriaInput(e) {
      document.getElementById('subcatInputSection').style.display = e.target.checked ? 'block' : 'none';
    },

    async handleGuardarCategoria() {
      const nombre = document.getElementById('inputNuevaCategoria').value.trim();
      const agregarSubcat = document.getElementById('checkSubcategorias').checked;
      const subcat = document.getElementById('inputNuevaSubcategoria').value.trim();

      if (!nombre) {
        mostrarMensaje('error', 'Error', 'Ingresa un nombre para la categoría');
        return;
      }

      const data = {
        categoria: nombre,
        subcategorias: agregarSubcat && subcat ? [subcat] : []
      };

      const btnGuardar = document.getElementById('btnGuardarCategoria');
      const originalText = btnGuardar.innerHTML;

      try {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Guardando...';

        const response = await fetch('guardar_categoria_y_subcategorias.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (responseData.success) {
          await this.cargarCategoriasDesdeBackend();
          const modalCategoria = bootstrap.Modal.getInstance(this.elements.modalCategoria);
          modalCategoria.hide();
          mostrarMensaje('success', '¡Éxito!', 'Categoría guardada exitosamente');
        } else {
          throw new Error(responseData.message || 'Error al guardar');
        }
      } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'Error', error.message);
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = originalText;
      }
    },

    async handleGuardarSubcategoria() {
      const selectedCat = this.elements.categoriaSelect.options[this.elements.categoriaSelect.selectedIndex];
      const subcat = document.getElementById('inputSubcatModal').value.trim();

      if (!selectedCat || !selectedCat.value || !subcat) {
        mostrarMensaje('error', 'Error', 'Completa todos los campos');
        return;
      }

      const catNombre = document.getElementById('nombreCategoriaSeleccionada').textContent;
      const data = {
        categoria: catNombre,
        subcategorias: [subcat]
      };

      const btnGuardar = document.getElementById('btnGuardarSubcatModal');
      const originalText = btnGuardar.innerHTML;

      try {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Agregando...';

        const response = await fetch('guardar_categoria_y_subcategorias.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (responseData.success) {
          await this.cargarCategoriasDesdeBackend();
          const modalSubcat = bootstrap.Modal.getInstance(this.elements.modalSubcat);
          modalSubcat.hide();
          mostrarMensaje('success', '¡Éxito!', 'Subcategoría agregada exitosamente');
        } else {
          throw new Error(responseData.message || 'Error al guardar');
        }
      } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'Error', error.message);
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = originalText;
      }
    },

    handleValidacionCategoria(e) {
      const btnGuardar = document.getElementById('btnGuardarCategoria');
      const input = e.target;
      if (input.value.trim().length >= 2) {
        btnGuardar.disabled = false;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        btnGuardar.disabled = true;
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    },

    handleValidacionSubcategoria(e) {
      const btnGuardar = document.getElementById('btnGuardarSubcatModal');
      const input = e.target;
      if (input.value.trim().length >= 2) {
        btnGuardar.disabled = false;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        btnGuardar.disabled = true;
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    },

    handleValidacionUbicacion(e) {
      const input = e.target;
      const valor = input.value.toUpperCase();
      input.value = valor;
      
      // Patrón: Una letra (A-Z) seguida de un número (0-9)
      const patron = /^[A-Z][0-9]$/;
      
      if (valor.length === 0) {
        input.classList.remove('is-valid', 'is-invalid');
        input.setCustomValidity('');
        return;
      }
      
      if (patron.test(valor)) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setCustomValidity('');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setCustomValidity('Formato inválido. Use letra + número (Ej: A1, B2)');
      }
    },

    async handleImagenPrincipal(e) {
      const file = e.target.files[0];
      if (!file) {
        this.elements.imgPreview.style.display = 'none';
        return;
      }

      try {
        if (file.size > this.config.imagenes.maxFileSize) {
          throw new Error("La imagen no debe exceder 2MB");
        }

        const base64 = await fileToBase64(file);
        this.elements.imgBase64.value = base64;
        this.elements.imgPreview.src = base64;
        this.elements.imgPreview.style.display = 'block';
      } catch (error) {
        console.error("Error al procesar imagen:", error);
        mostrarMensaje('error', 'Error', error.message);
        e.target.value = '';
        this.elements.imgPreview.style.display = 'none';
      }
    },

    async handleImagenSecundaria(e, num) {
      const file = e.target.files[0];
      const imgConfig = this.elements.imgSecundarias[num - 1];
      
      if (!file) {
        imgConfig.preview.style.display = 'none';
        return;
      }

      try {
        if (file.size > this.config.imagenes.maxFileSize) {
          throw new Error(`La imagen secundaria ${num} no debe exceder 2MB`);
        }

        const base64 = await fileToBase64(file);
        imgConfig.base64.value = base64;
        imgConfig.preview.src = base64;
        imgConfig.preview.style.display = 'block';
      } catch (error) {
        console.error(`Error al procesar imagen secundaria ${num}:`, error);
        mostrarMensaje('error', 'Error', error.message);
        e.target.value = '';
        imgConfig.preview.style.display = 'none';
      }
    },

    async handleSubmitForm(e) {
      e.preventDefault();

      const form = e.target;
      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalBtnText = btnSubmit.innerHTML;

      try {
        if (!this.elements.imgBase64.value) {
          throw new Error("La imagen principal es requerida");
        }

        // Validar ubicación
        if (this.elements.ubicacion && this.elements.ubicacion.value) {
          const patron = /^[A-Z][0-9]$/;
          if (!patron.test(this.elements.ubicacion.value.toUpperCase())) {
            throw new Error("Formato de ubicación inválido. Use letra + número (Ej: A1, B2)");
          }
        } else {
          throw new Error("La ubicación es requerida");
        }

        // Validar orden de destacado si está marcado como destacado
        if (this.elements.checkDestacado.checked) {
          const orden = parseInt(this.elements.ordenDestacado.value);
          if (!orden || orden < 1) {
            throw new Error("Debes ingresar un número de orden válido para productos destacados");
          }

          // Validar que el orden no esté ocupado
          const ordenDisponible = await this.validarOrdenDestacado(orden);
          if (!ordenDisponible) {
            throw new Error(`El número de orden ${orden} ya está ocupado. Por favor, elige otro número.`);
          }
        }

        const usaDescuento = this.elements.checkDescuento.checked;
        const precioOriginal = parseFloat(this.elements.precioProducto.value);
        const precioDescuento = parseFloat(this.elements.precioDescuento.value);

        let descuentoField = document.getElementById('descuento_calculado');
        if (descuentoField) {
          descuentoField.remove();
        }

        if (usaDescuento && precioDescuento && !isNaN(precioDescuento) && precioDescuento > 0) {
          if (precioDescuento >= precioOriginal) {
            throw new Error("El precio con descuento debe ser menor al precio original");
          }

          const porcentajeDescuento = ((precioOriginal - precioDescuento) / precioOriginal) * 100;
          
          descuentoField = document.createElement('input');
          descuentoField.type = 'hidden';
          descuentoField.name = 'descuento';
          descuentoField.id = 'descuento_calculado';
          descuentoField.value = porcentajeDescuento.toFixed(2);
          form.appendChild(descuentoField);
        }

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Guardando...
        `;

        const response = await fetch('guardar_producto.php', {
          method: 'POST',
          body: new FormData(form)
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Error al guardar el producto');
        }

        await mostrarMensaje('success', '¡Éxito!', data.message);
        form.reset();
        this.limpiarFormularioCompleto();
        
      } catch (error) {
        console.error('Error:', error);
        await mostrarMensaje('error', 'Error', error.message);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnText;
      }
    },

    handleToggleDescuento(e) {
      this.elements.grupoPrecioDescuento.style.display = e.target.checked ? 'block' : 'none';
      if (!e.target.checked) {
        this.elements.precioDescuento.value = '';
        const descuentoField = document.getElementById('descuento_calculado');
        if (descuentoField) {
          descuentoField.remove();
        }
        const label = document.querySelector('label[for="precioDescuento"]');
        if (label) {
          label.innerHTML = 'Precio de descuento';
        }
      }
    },

    handleToggleDestacado(e) {
      this.elements.grupoOrdenDestacado.style.display = e.target.checked ? 'block' : 'none';
      if (!e.target.checked) {
        this.elements.ordenDestacado.value = '';
        this.elements.ordenDestacado.classList.remove('is-valid', 'is-invalid');
      } else {
        // Solicitar al servidor el próximo orden disponible
        this.obtenerProximoOrdenDisponible();
      }
    },

    async obtenerProximoOrdenDisponible() {
      try {
        const response = await fetch('obtener_proximo_orden_destacado.php');
        if (!response.ok) throw new Error('Error al obtener orden');
        
        const data = await response.json();
        if (data.success && data.proximo_orden) {
          this.elements.ordenDestacado.value = data.proximo_orden;
          this.elements.ordenDestacado.placeholder = `Sugerido: ${data.proximo_orden}`;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    async validarOrdenDestacado(orden, idProducto = null) {
      try {
        const params = new URLSearchParams({ orden });
        if (idProducto) params.append('id_producto', idProducto);
        
        const response = await fetch(`validar_orden_destacado.php?${params}`);
        if (!response.ok) throw new Error('Error en validación');
        
        const data = await response.json();
        return data.disponible;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    },

    handleValidacionPrecioDescuento() {
      const precioOriginal = parseFloat(this.elements.precioProducto.value);
      const precioDescuento = parseFloat(this.elements.precioDescuento.value);
      const input = this.elements.precioDescuento;
      const label = document.querySelector('label[for="precioDescuento"]');
      
      if (precioOriginal && precioDescuento) {
        if (precioDescuento >= precioOriginal) {
          input.setCustomValidity('El precio con descuento debe ser menor al precio original');
          input.style.borderColor = '#dc3545';
        } else {
          input.setCustomValidity('');
          input.style.borderColor = '#28a745';
          
          const porcentaje = ((precioOriginal - precioDescuento) / precioOriginal) * 100;
          label.innerHTML = `Precio de descuento <small class="text-success">(${porcentaje.toFixed(1)}% de descuento)</small>`;
        }
      } else {
        input.setCustomValidity('');
        input.style.borderColor = '';
        label.innerHTML = 'Precio de descuento';
      }
    },

    limpiarFormularioCompleto() {
      const camposDescuento = document.querySelectorAll('input[name="descuento"], input[id="descuento_calculado"]');
      camposDescuento.forEach(campo => campo.remove());
      
      this.elements.checkDescuento.checked = false;
      this.elements.grupoPrecioDescuento.style.display = 'none';
      this.elements.precioDescuento.value = '';
      
      this.elements.checkDestacado.checked = false;
      this.elements.grupoOrdenDestacado.style.display = 'none';
      this.elements.ordenDestacado.value = '';
      
      const label = document.querySelector('label[for="precioDescuento"]');
      if (label) {
        label.innerHTML = 'Precio de descuento';
      }

      this.elements.imgPreview.style.display = 'none';
      this.elements.imgSecundarias.forEach(img => {
        img.preview.style.display = 'none';
        img.base64.value = '';
      });
    }
  };
})();

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => ProductoFormulario.init());
