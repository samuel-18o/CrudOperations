/**
 * ============================================
 * ARCHIVO: app.js
 * DESCRIPCIÓN: Punto de entrada principal de la aplicación SPA
 * RESPONSABILIDAD: Inicializar todos los módulos del sistema
 * ============================================
 * 
 * Este archivo es el corazón de la aplicación. Se ejecuta cuando
 * el navegador carga index.html y realiza las siguientes tareas:
 * 
 * 1. Importa los módulos necesarios (Router, Store, Sidebar)
 * 2. Inicializa el sistema de gestión de estado (Store)
 * 3. Inicia el enrutador para la navegación SPA
 * 4. Renderiza la interfaz según el estado de autenticación
 * 
 * FLUJO DE EJECUCIÓN:
 * - Se carga cuando el DOM está listo
 * - Recupera sesión desde localStorage (si existe)
 * - Configura listeners para navegación
 * - Renderiza la vista inicial
 */

// ============================================
// IMPORTACIONES
// ============================================

/**
 * Router: Sistema de navegación de rutas
 * Desde: ./router/router.js
 * Propósito: Manejar la navegación entre páginas sin recargar el navegador
 */
import { Router } from './router/router.js';

/**
 * Store: Sistema de gestión de estado global
 * Desde: ./state/store.js
 * Propósito: Mantener el estado de la aplicación (usuario, estudiantes, pagos)
 */
import { Store } from './state/store.js';

/**
 * Sidebar: Componente de barra lateral
 * Desde: ./components/Sidebar.js
 * Propósito: Mostrar el menú de navegación y perfil del usuario
 */
import Sidebar from './components/Sidebar.js';

// ============================================
// INICIALIZACIÓN DEL SISTEMA
// ============================================

/**
 * 1. INICIALIZACIÓN DEL STORE
 * 
 * El Store.init() realiza las siguientes acciones:
 * - Verifica si existe una sesión guardada en localStorage
 * - Si existe, recupera los datos del usuario
 * - Restaura el estado de la aplicación
 * 
 * PERSISTENCIA DE DATOS:
 * - Utiliza localStorage para mantener la sesión activa
 * - Permite que el usuario no tenga que iniciar sesión cada vez
 * - Los datos persisten incluso si se cierra el navegador
 */
Store.init();

/**
 * 2. INICIALIZACIÓN DEL ROUTER
 * 
 * El Router.init() configura:
 * - Event listeners para cambios en la URL (hashchange)
 * - Event listener para carga inicial de la página (load)
 * - Sistema de protección de rutas según autenticación
 * - Redirecciones automáticas según permisos del usuario
 * 
 * RUTAS DINÁMICAS:
 * - La aplicación usa hash-based routing (#/ruta)
 * - No requiere configuración de servidor
 * - Funciona en cualquier hosting estático
 */
Router.init();

/**
 * 3. RENDERIZADO CONDICIONAL DEL SIDEBAR
 * 
 * Esta sección verifica si hay un usuario autenticado y
 * renderiza la barra lateral de navegación.
 * 
 * LÓGICA:
 * - Si Store.state.user existe → Usuario está autenticado
 * - Si existe → Muestra el Sidebar con opciones de navegación
 * - Si no existe → Solo se muestra la vista de login/register
 * 
 * MANIPULACIÓN DEL DOM:
 * - Obtiene el elemento #app del HTML
 * - Genera el HTML del Sidebar usando la función componente
 * - Inserta el Sidebar al inicio del contenedor #app
 * - Usa insertAdjacentHTML para no reemplazar contenido existente
 */
if (Store.state.user) {
  // Obtiene el contenedor principal de la aplicación
  const app = document.getElementById('app');
  
  // Genera el HTML del Sidebar llamando a la función componente
  const sidebar = Sidebar();
  
  // Inserta el Sidebar al principio del contenedor
  // 'afterbegin' = inserta como primer hijo del elemento
  app.insertAdjacentHTML('afterbegin', sidebar);
}

/**
 * 4. CONFIRMACIÓN DE INICIALIZACIÓN
 * 
 * Mensaje en consola para confirmar que la aplicación
 * se ha inicializado correctamente.
 * 
 * ÚTIL PARA:
 * - Debugging durante desarrollo
 * - Confirmar que todos los módulos se cargaron
 * - Verificar que no hay errores de carga
 */
console.log('✅ CRUD Operations App initialized');
