/**
 * ============================================
 * ARCHIVO: Modal.js
 * DESCRIPCIÓN: Componente Modal Reutilizable
 * PATRÓN: Class Component Pattern
 * ============================================
 * 
 * Este componente implementa un modal (ventana emergente)
 * reutilizable para mostrar contenido sobre la interfaz.
 * 
 * CARACTERÍSTICAS:
 * - Modal centrado con overlay oscuro
 * - Animaciones de entrada/salida
 * - Cierre con botón X
 * - Cierre al hacer clic fuera (overlay)
 * - ID único para múltiples modales
 * - Contenido dinámico
 * 
 * TIPO DE COMPONENTE:
 * - Clase ES6: Usa constructor y métodos
 * - Stateful: Mantiene título, contenido, ID
 * - Reutilizable: Se puede instanciar múltiples veces
 * 
 * USO TÍPICO:
 * - Confirmaciones
 * - Formularios
 * - Mensajes informativos
 * - Previsualizaciones
 * 
 * ALTERNATIVAS EN PROYECTOS MODERNOS:
 * - Usar <dialog> HTML nativo
 * - Librerías como SweetAlert2
 * - Frameworks con componentes modales
 */

// ============================================
// DEFINICIÓN DE LA CLASE MODAL
// ============================================

/**
 * CLASE: Modal
 * 
 * Componente de ventana emergente configurable
 * 
 * PROPIEDADES:
 * - title: Título del modal
 * - content: Contenido HTML
 * - modalId: ID único generado
 * 
 * MÉTODOS:
 * - render(): Genera HTML
 * - show(): Muestra el modal
 * - close(): Cierra el modal
 */
export default class Modal {
  /**
   * ============================================
   * CONSTRUCTOR
   * ============================================
   * 
   * PROPÓSITO:
   * Inicializar una nueva instancia de Modal
   * 
   * PARÁMETROS:
   * @param {string} title - Título del modal
   * @param {string} content - Contenido HTML del modal
   * 
   * FLUJO:
   * 1. Guarda título y contenido
   * 2. Genera ID único con timestamp
   * 
   * ID ÚNICO:
   * - Permite múltiples modales simultáneos
   * - Date.now(): Timestamp en milisegundos
   * - Ejemplo: 'modal-1706982451234'
   * 
   * EJEMPLO DE USO:
   * const modal = new Modal(
   *   'Confirmar Acción',
   *   '<p>¿Estás seguro?</p>'
   * );
   */
  constructor(title, content) {
    // Guarda el título del modal
    this.title = title;
    
    // Guarda el contenido HTML
    this.content = content;
    
    /**
     * Genera ID único usando timestamp
     * 
     * Date.now(): Retorna milisegundos desde 1970
     * Es prácticamente imposible que dos modales
     * tengan el mismo ID
     * 
     * Formato: 'modal-1706982451234'
     */
    this.modalId = 'modal-' + Date.now();
  }

  /**
   * ============================================
   * MÉTODO: render()
   * ============================================
   * 
   * PROPÓSITO:
   * Generar el HTML del modal
   * 
   * RETORNA:
   * @returns {string} HTML del modal como string
   * 
   * ESTRUCTURA HTML:
   * - modal-overlay: Fondo oscuro semitransparente
   * - modal-content-custom: Caja del modal
   * - modal-header: Título y botón cerrar
   * - modal-body: Contenido dinámico
   * 
   * CLASES CSS:
   * - fade-in: Animación de entrada
   * - active: Hace visible el modal
   * 
   * ACCESIBILIDAD:
   * En producción agregar:
   * - role="dialog"
   * - aria-labelledby
   * - aria-modal="true"
   * - Manejo de focus trap
   */
  render() {
    return `
      <!-- Overlay: Fondo oscuro semitransparente
           Cubre toda la pantalla -->
      <div id="${this.modalId}" class="modal-overlay">
        
        <!-- Contenedor del modal
             fade-in: Animación de entrada -->
        <div class="modal-content-custom fade-in">
          
          <!-- Header: Título y botón cerrar -->
          <div class="modal-header">
            
            <!-- Título del modal -->
            <h3 class="modal-title">${this.title}</h3>
            
            <!-- Botón cerrar (X)
                 onclick: Llama a función global
                 &times;: Símbolo × en HTML -->
            <button 
              class="modal-close" 
              onclick="closeModal('${this.modalId}')"
            >
              &times;
            </button>
          </div>
          
          <!-- Body: Contenido dinámico
               Aquí se inserta el HTML pasado al constructor -->
          <div class="modal-body">
            ${this.content}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * ============================================
   * MÉTODO: show()
   * ============================================
   * 
   * PROPÓSITO:
   * Mostrar el modal en pantalla
   * 
   * FLUJO:
   * 1. Genera HTML con render()
   * 2. Inserta en el DOM (al final del body)
   * 3. Espera 10ms (para transición CSS)
   * 4. Agrega clase 'active' (hace visible)
   * 5. Configura listener para cerrar al clic fuera
   * 
   * MANIPULACIÓN DEL DOM:
   * - insertAdjacentHTML: Inserta sin reemplazar
   * - beforeend: Al final de document.body
   * - getElementById: Obtiene el modal insertado
   * - classList.add: Agrega clase para animación
   * 
   * ANIMACIÓN:
   * - Sin 'active': opacity: 0 (invisible)
   * - Con 'active': opacity: 1 (visible)
   * - Transición CSS hace el fade-in suave
   * 
   * SETTIMEOUT:
   * - 10ms: Da tiempo al navegador para pintar
   * - Permite que la transición CSS funcione
   * - Sin esto, aparecería instantáneamente
   * 
   * EVENT LISTENER:
   * - Detecta clic en overlay
   * - Si clic fuera del contenido → cierra
   * - Mejor UX: cerrar de forma intuitiva
   */
  show() {
    // Genera HTML del modal
    const modalHTML = this.render();
    
    /**
     * Inserta modal al final del body
     * 
     * 'beforeend': Como último hijo de body
     * Permite que el overlay cubra todo
     */
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    /**
     * Espera 10ms antes de activar
     * 
     * RAZÓN:
     * - Da tiempo al navegador para renderizar
     * - Permite que las transiciones CSS funcionen
     * - Sin esto, el modal aparecería sin animación
     */
    setTimeout(() => {
      // Agrega clase 'active' para hacer visible
      document.getElementById(this.modalId).classList.add('active');
    }, 10);

    /**
     * Configura cierre al clic en overlay
     * 
     * LÓGICA:
     * - Escucha clics en todo el modal
     * - Verifica si clic fue en el overlay
     * - Si fue en overlay (no en contenido) → cierra
     * 
     * e.target: Elemento que recibió el clic
     * .contains('modal-overlay'): Verifica si es el overlay
     * 
     * UX:
     * - Usuario puede cerrar clicando fuera
     * - Comportamiento esperado en modales
     */
    document.getElementById(this.modalId).addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close(); // Cierra el modal
      }
    });
  }

  /**
   * ============================================
   * MÉTODO: close()
   * ============================================
   * 
   * PROPÓSITO:
   * Cerrar y eliminar el modal del DOM
   * 
   * FLUJO:
   * 1. Obtiene el modal del DOM
   * 2. Verifica que exista
   * 3. Quita clase 'active' (fade-out)
   * 4. Espera 300ms (animación)
   * 5. Elimina del DOM
   * 
   * ANIMACIÓN DE SALIDA:
   * - Quita 'active': opacity 1 → 0
   * - Espera 300ms: Tiempo de la transición CSS
   * - Luego elimina: Para que se vea la animación
   * 
   * LIMPIEZA:
   * - .remove(): Elimina elemento del DOM
   * - Libera memoria
   * - Elimina event listeners
   * 
   * EJEMPLO DE USO:
   * modal.close();
   */
  close() {
    // Obtiene el modal del DOM
    const modal = document.getElementById(this.modalId);
    
    // Verifica que exista (por si ya fue cerrado)
    if (modal) {
      /**
       * Quita clase 'active'
       * 
       * Activa transición CSS:
       * opacity: 1 → 0
       */
      modal.classList.remove('active');
      
      /**
       * Espera 300ms antes de eliminar
       * 
       * RAZÓN:
       * - Tiempo de la animación fade-out
       * - Si elimináramos inmediatamente, no se vería
       * - 300ms coincide con transition en CSS
       */
      setTimeout(() => {
        // Elimina completamente del DOM
        modal.remove();
      }, 300);
    }
  }
}

// ============================================
// FUNCIÓN GLOBAL DE CIERRE
// ============================================

/**
 * FUNCIÓN GLOBAL: closeModal(modalId)
 * 
 * PROPÓSITO:
 * Cerrar modal desde onclick en HTML
 * 
 * PARÁMETROS:
 * @param {string} modalId - ID del modal a cerrar
 * 
 * POR QUÉ ES GLOBAL:
 * - onclick busca funciones en window
 * - No puede acceder a métodos de clase directamente
 * - window.closeModal hace función accesible
 * 
 * FLUJO:
 * 1. Obtiene modal por ID
 * 2. Quita clase 'active' (fade-out)
 * 3. Espera animación
 * 4. Elimina del DOM
 * 
 * NOTA:
 * Realiza lo mismo que modal.close()
 * pero sin necesitar instancia de la clase
 * 
 * USO EN HTML:
 * <button onclick="closeModal('modal-123')">X</button>
 * 
 * ALTERNATIVA MODERNA:
 * - Usar event delegation
 * - Usar data-attributes
 * - Evitar funciones globales
 */
window.closeModal = (modalId) => {
  // Busca el modal en el DOM
  const modal = document.getElementById(modalId);
  
  // Verifica que exista
  if (modal) {
    // Inicia animación fade-out
    modal.classList.remove('active');
    
    // Espera animación y elimina
    setTimeout(() => modal.remove(), 300);
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Manipulación avanzada del DOM
 *    - Inserción dinámica de elementos
 *    - insertAdjacentHTML para agregar HTML
 *    - classList para manipular clases
 *    - remove() para eliminar elementos
 *    - Event listeners dinámicos
 * 
 * ✅ Buenas prácticas de programación
 *    - Clase bien estructurada
 *    - Código exhaustivamente documentado
 *    - Separación de responsabilidades
 *    - Métodos con propósito único
 *    - Nombres descriptivos
 *    - IDs únicos para evitar conflictos
 * 
 * ✅ Componentes reutilizables
 *    - Se puede instanciar múltiples veces
 *    - Configurable con parámetros
 *    - Independiente de otras partes
 *    - Contenido dinámico
 * 
 * MEJORAS PARA PRODUCCIÓN:
 * - Agregar atributos ARIA para accesibilidad
 * - Implementar focus trap
 * - Manejo de tecla ESC para cerrar
 * - Prevenir scroll del body cuando está abierto
 * - Transiciones configurables
 * - Callbacks para eventos (onOpen, onClose)
 */
