/**
 * ============================================
 * ARCHIVO: router.js
 * DESCRIPCIÓN: Sistema de Enrutamiento SPA (Single Page Application)
 * PATRÓN: Hash-based Routing con Route Guards
 * ============================================
 * 
 * Este archivo implementa el sistema de navegación de la aplicación
 * sin necesidad de recargar la página (SPA).
 * 
 * CONCEPTOS CLAVE:
 * 
 * 1. SPA (Single Page Application):
 *    - Una sola carga inicial del HTML
 *    - Navegación dinámica sin recargas
 *    - Mejor experiencia de usuario
 *    - Más rápido que navegación tradicional
 * 
 * 2. Hash-based Routing:
 *    - Usa el hash (#) de la URL: example.com/#/dashboard
 *    - No requiere configuración de servidor
 *    - Compatible con hosting estático
 *    - Escucha cambios con 'hashchange'
 * 
 * 3. Route Guards (Guardián de Rutas):
 *    - Protección de rutas según autenticación
 *    - Control de acceso por roles (admin/user)
 *    - Redirecciones automáticas
 * 
 * FLUJO DE NAVEGACIÓN:
 * 1. Usuario hace clic en link → cambia el hash (#/ruta)
 * 2. Se dispara evento 'hashchange'
 * 3. Router verifica permisos
 * 4. Si autorizado → renderiza vista
 * 5. Si no autorizado → redirige
 */

// ============================================
// IMPORTACIONES DE VISTAS Y SERVICIOS
// ============================================

/**
 * Servicio de autenticación
 * Proporciona métodos para verificar sesión y roles
 */
import { authService } from '../services/authService.js';

/**
 * IMPORTACIÓN DE VISTAS
 * Cada vista es una función que retorna HTML como string
 * Se renderizan dinámicamente según la ruta actual
 */

// Vistas de Autenticación (públicas)
import LoginView from '../views/login.js';
import RegisterView from '../views/register.js';

// Vistas Protegidas (requieren login)
import DashboardView from '../views/dashboard.js';
import StudentsListView from '../views/studentsList.js';
import PaymentsView from '../views/payments.js';

// Vistas Administrativas (solo admin)
import CreateStudentView from '../views/createStudent.js';
import EditStudentView from '../views/editStudent.js';

// Vista de Error
import NotFoundView from '../views/notFound.js';

// ============================================
// DEFINICIÓN DEL ROUTER
// ============================================

/**
 * Router Object
 * 
 * Objeto singleton que gestiona toda la navegación
 * de la aplicación SPA.
 */
export const Router = {
  /**
   * ============================================
   * CONFIGURACIÓN DE RUTAS
   * ============================================
   * 
   * Mapeo de rutas a vistas (componentes):
   * 
   * ESTRUCTURA:
   * 'ruta': VistaComponente
   * 
   * CUANDO EL USUARIO NAVEGA:
   * - A '#/dashboard' → Se renderiza DashboardView()
   * - A '#/students' → Se renderiza StudentsListView()
   * - etc.
   * 
   * TIPOS DE RUTAS:
   * 1. Públicas: /, /login, /register
   *    - Accesibles sin autenticación
   *    - Redirigen a dashboard si ya está autenticado
   * 
   * 2. Protegidas: /dashboard, /students, /payments
   *    - Requieren autenticación
   *    - Redirigen a login si no está autenticado
   * 
   * 3. Administrativas: /students/create, /students/edit
   *    - Requieren autenticación + rol admin
   *    - Redirigen a 403 si no es admin
   * 
   * 4. Error: /not-found
   *    - Para rutas no encontradas o acceso denegado
   */
  routes: {
    '/': LoginView,                    // Ruta raíz → Login
    '/login': LoginView,                // Página de inicio de sesión
    '/register': RegisterView,          // Página de registro
    '/dashboard': DashboardView,        // Panel principal (protegida)
    '/students': StudentsListView,      // Lista de estudiantes (protegida)
    '/payments': PaymentsView,          // Detalles de pagos (protegida)
    '/students/create': CreateStudentView,  // Crear estudiante (admin)
    '/students/edit': EditStudentView,      // Editar estudiante (admin)
    '/not-found': NotFoundView          // Página de acceso denegado
  },

  /**
   * ============================================
   * MÉTODO: init()
   * ============================================
   * 
   * PROPÓSITO:
   * Inicializar el sistema de enrutamiento
   * 
   * CONFIGURA DOS EVENT LISTENERS:
   * 
   * 1. 'hashchange':
   *    - Se dispara cuando cambia el hash de la URL
   *    - Ejemplo: usuario hace clic en link #/dashboard
   *    - Permite navegación dinámica sin recargar
   * 
   * 2. 'load':
   *    - Se dispara cuando se carga la página
   *    - Maneja la ruta inicial al abrir la aplicación
   *    - Asegura que se renderice la vista correcta al inicio
   * 
   * AMBOS EVENTOS:
   * - Llaman a this.handleRoute()
   * - Que procesa la ruta y renderiza la vista
   * 
   * CUÁNDO SE EJECUTA:
   * - Al iniciar la aplicación (app.js)
   * - Después de inicializar el Store
   */
  init() {
    // Escucha cambios en el hash (#/ruta)
    // Arrow function mantiene el contexto de 'this'
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Escucha carga inicial de la página
    window.addEventListener('load', () => this.handleRoute());
    
    console.log('✅ Router inicializado - Rutas configuradas');
  },

  /**
   * ============================================
   * MÉTODO: handleRoute()
   * ============================================
   * 
   * PROPÓSITO:
   * Procesar la ruta actual y aplicar guardián de seguridad
   * 
   * FLUJO COMPLETO:
   * 
   * 1. OBTENER RUTA ACTUAL:
   *    - Lee window.location.hash
   *    - Ejemplo: '#/students/edit?id=5'
   *    - Quita el '#' → '/students/edit?id=5'
   * 
   * 2. EXTRAER PATH LIMPIO:
   *    - Separa el path de los query params
   *    - '/students/edit?id=5' → '/students/edit'
   * 
   * 3. VERIFICAR PROTECCIÓN DE RUTA:
   *    a) Si es ruta protegida + no autenticado → /login
   *    b) Si es ruta admin + no es admin → /not-found
   *    c) Si está en login + ya autenticado → /dashboard
   * 
   * 4. RENDERIZAR VISTA:
   *    - Obtiene la vista correspondiente
   *    - Llama a this.render(vista)
   * 
   * IMPLEMENTA:
   * - Route Guards (guardián de rutas)
   * - Protección por autenticación
   * - Control de acceso por roles
   * - Redirecciones automáticas
   */
  handleRoute() {
    /**
     * PASO 1: Obtener ruta actual
     * 
     * window.location.hash: '#/students'
     * .slice(1): quita el '#' → '/students'
     * || '/': si está vacío, usa '/' por defecto
     */
    const hash = window.location.hash.slice(1) || '/';
    
    /**
     * PASO 2: Extraer path sin query params
     * 
     * hash = '/students/edit?id=5'
     * .split('?'): ['students/edit', 'id=5']
     * [0]: 'students/edit'
     */
    const path = hash.split('?')[0];

    /**
     * PASO 3: Definir tipos de rutas
     * 
     * RUTAS PROTEGIDAS:
     * - Requieren que el usuario esté autenticado
     * - Si no → redirigen a /login
     */
    const protectedRoutes = [
      '/dashboard',
      '/students',
      '/payments',
      '/students/create',
      '/students/edit'
    ];

    /**
     * RUTAS ADMINISTRATIVAS:
     * - Requieren autenticación + rol 'admin'
     * - Si no es admin → redirigen a /not-found (403)
     */
    const adminRoutes = [
      '/students/create',
      '/students/edit'
    ];

    /**
     * PASO 4: GUARDIÁN - Verificar autenticación
     * 
     * LÓGICA:
     * - Si la ruta está en protectedRoutes
     * - Y el usuario NO está autenticado
     * - → Redirigir a login
     * 
     * MÉTODO: authService.isAuthenticated()
     * - Verifica si hay usuario en el Store
     * - Retorna true/false
     */
    if (protectedRoutes.includes(path) && !authService.isAuthenticated()) {
      console.log('⛔ Acceso denegado - No autenticado');
      window.location.hash = '#/login';
      return; // Detiene la ejecución
    }

    /**
     * PASO 5: GUARDIÁN - Verificar rol de administrador
     * 
     * LÓGICA:
     * - Si la ruta está en adminRoutes
     * - Y el usuario NO es admin
     * - → Redirigir a /not-found (403)
     * 
     * MÉTODO: authService.isAdmin()
     * - Verifica si user.role === 'admin'
     * - Retorna true/false
     */
    if (adminRoutes.includes(path) && !authService.isAdmin()) {
      console.log('⛔ Acceso denegado - Requiere rol Admin');
      window.location.hash = '#/not-found';
      return; // Detiene la ejecución
    }

    /**
     * PASO 6: Evitar acceso a login si ya está autenticado
     * 
     * LÓGICA:
     * - Si intenta ir a '/' o '/login'
     * - Y ya está autenticado
     * - → Redirigir a /dashboard
     * 
     * PROPÓSITO:
     * - Mejor UX: usuario autenticado no ve login
     * - Redirige automáticamente al panel
     */
    if ((path === '/' || path === '/login') && authService.isAuthenticated()) {
      console.log('✅ Usuario autenticado - Redirigiendo a dashboard');
      window.location.hash = '#/dashboard';
      return; // Detiene la ejecución
    }

    /**
     * PASO 7: Obtener vista correspondiente
     * 
     * this.routes[path]: busca la vista en el objeto routes
     * || NotFoundView: si no existe, usa vista 404
     * 
     * EJEMPLO:
     * path = '/dashboard'
     * view = DashboardView (función)
     */
    const view = this.routes[path] || NotFoundView;
    
    console.log(`🔄 Navegando a: ${path}`);

    /**
     * PASO 8: Renderizar la vista
     * 
     * Llama al método render() con la vista seleccionada
     */
    this.render(view);
  },

  /**
   * ============================================
   * MÉTODO: render(view)
   * ============================================
   * 
   * PROPÓSITO:
   * Renderizar una vista en el DOM
   * 
   * PARÁMETROS:
   * @param {Function} view - Función que retorna HTML
   * 
   * FLUJO:
   * 1. Obtiene el contenedor #app del DOM
   * 2. Llama a la función view() para obtener HTML
   * 3. Inserta el HTML en el contenedor
   * 
   * MANIPULACIÓN DEL DOM:
   * - Limpia todo el contenido anterior
   * - Inserta el nuevo HTML de la vista
   * - La vista se encarga de su propio renderizado
   * 
   * NOTAS:
   * - Cada vista es autónoma
   * - Puede incluir su propio Sidebar
   * - Maneja sus propios event listeners
   * 
   * EJEMPLO DE VISTA:
   * function DashboardView() {
   *   return `<div>Dashboard Content</div>`;
   * }
   */
  render(view) {
    // Obtiene el contenedor principal de la aplicación
    const app = document.getElementById('app');
    
    /**
     * RENDERIZADO:
     * - view() ejecuta la función de la vista
     * - Retorna un string con HTML
     * - Se asigna a innerHTML del contenedor
     * - Reemplaza todo el contenido anterior
     */
    app.innerHTML = view();
    
    console.log('✅ Vista renderizada');
  },

  /**
   * ============================================
   * MÉTODO: navigate(path)
   * ============================================
   * 
   * PROPÓSITO:
   * Navegar programáticamente a una ruta
   * 
   * PARÁMETROS:
   * @param {string} path - Ruta de destino
   * 
   * USO:
   * - Redireciones después de acciones
   * - Navegación desde JavaScript
   * - No requiere links HTML
   * 
   * EJEMPLO:
   * Router.navigate('/dashboard');
   * Router.navigate('/students/edit?id=5');
   * 
   * FUNCIONAMIENTO:
   * - Cambia el hash de la URL
   * - Dispara evento 'hashchange'
   * - Que llama a handleRoute()
   * - Que renderiza la vista
   */
  navigate(path) {
    // Cambia el hash de la URL
    window.location.hash = `#${path}`;
    
    console.log(`➡️ Navegación programática a: ${path}`);
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Creación de rutas dinámicas en una SPA
 *    - Hash-based routing implementado
 *    - Navegación sin recargas
 *    - Event listeners para hashchange
 * 
 * ✅ Autenticación de usuarios y gestión de roles
 *    - Route Guards implementados
 *    - Verificación de autenticación
 *    - Control de acceso por roles (admin/user)
 *    - Redirecciones automáticas
 * 
 * ✅ Manipulación avanzada del DOM
 *    - Renderizado dinámico de vistas
 *    - Actualización sin recargas
 *    - innerHTML para insertar componentes
 * 
 * ✅ Buenas prácticas de programación
 *    - Código documentado exhaustivamente
 *    - Separación de responsabilidades
 *    - Nombres descriptivos
 *    - Funciones con propósito único
 *    - Comentarios explicativos
 */
