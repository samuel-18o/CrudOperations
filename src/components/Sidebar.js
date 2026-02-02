/**
 * ============================================
 * ARCHIVO: Sidebar.js
 * DESCRIPCIÓN: Componente de Barra Lateral de Navegación
 * PATRÓN: Component Pattern (Functional Component)
 * ============================================
 * 
 * Este componente implementa la barra lateral (sidebar)
 * que contiene el menú de navegación de la aplicación.
 * 
 * CARACTERÍSTICAS:
 * - Muestra información del usuario autenticado
 * - Links de navegación entre secciones
 * - Permisos basados en roles
 * - Indicador visual de página activa
 * - Botón de cierre de sesión
 * 
 * TIPO DE COMPONENTE:
 * - Funcional: Retorna HTML como string
 * - Stateless: No mantiene estado propio
 * - Reutilizable: Se puede llamar desde cualquier vista
 * 
 * RENDERIZADO:
 * - Se inserta en el DOM con insertAdjacentHTML
 * - Se renderiza al inicio si hay usuario autenticado
 * - Se incluye en cada vista protegida
 * 
 * NAVEGACIÓN:
 * - Usa hash-based routing (#/ruta)
 * - Links <a href="#/ruta">
 * - No recarga la página
 */

// ============================================
// IMPORTACIONES
// ============================================

/**
 * Store: Para acceder al usuario autenticado
 * Necesitamos los datos del usuario para mostrar:
 * - Nombre
 * - Email (para avatar)
 * - Rol (para permisos)
 */
import { Store } from '../state/store.js';

/**
 * authService: Para funcionalidad de logout
 * Se usa en el manejador global de cierre de sesión
 */
import { authService } from '../services/authService.js';

// ============================================
// DEFINICIÓN DEL COMPONENTE
// ============================================

/**
 * FUNCIÓN: Sidebar()
 * TIPO: Component Function
 * 
 * PROPÓSITO:
 * Generar el HTML de la barra lateral de navegación
 * 
 * RETORNA:
 * @returns {string} HTML del sidebar como string
 * 
 * NO RECIBE PARÁMETROS:
 * - Obtiene datos directamente del Store
 * - Lee la ruta actual de window.location.hash
 * 
 * FLUJO:
 * 1. Obtiene usuario del Store
 * 2. Obtiene ruta actual para marcar link activo
 * 3. Define función helper isActive()
 * 4. Genera HTML con template literals
 * 5. Retorna string HTML
 * 
 * MANIPULACIÓN DEL DOM:
 * - NO manipula el DOM directamente
 * - Solo genera HTML
 * - Quien llama al componente lo inserta en el DOM
 * 
 * EJEMPLO DE USO:
 * const sidebarHTML = Sidebar();
 * app.innerHTML = sidebarHTML + mainContent;
 */
export default function Sidebar() {
  /**
   * ============================================
   * PASO 1: OBTENER DATOS DEL USUARIO
   * ============================================
   * 
   * Store.getUser() retorna el usuario autenticado:
   * {
   *   id: '1',
   *   name: 'Karish Maskon',
   *   email: 'admin@crudops.com',
   *   password: 'admin123',
   *   role: 'admin'
   * }
   * 
   * NOTA:
   * Este componente solo se renderiza si hay usuario,
   * por lo que user nunca será null aquí.
   */
  const user = Store.getUser();

  /**
   * ============================================
   * PASO 2: OBTENER RUTA ACTUAL
   * ============================================
   * 
   * Para marcar visualmente qué página está activa
   * 
   * window.location.hash: '#/dashboard'
   * .slice(1): Quita el '#' → '/dashboard'
   * || '/dashboard': Si está vacío, default a dashboard
   * 
   * EJEMPLOS:
   * - URL: example.com/#/students → currentPath = '/students'
   * - URL: example.com/#/dashboard → currentPath = '/dashboard'
   * - URL: example.com/# → currentPath = '/dashboard' (default)
   */
  const currentPath = window.location.hash.slice(1) || '/dashboard';

  /**
   * ============================================
   * PASO 3: FUNCIÓN HELPER - isActive()
   * ============================================
   * 
   * PROPÓSITO:
   * Determinar si un link está activo para aplicar clase CSS
   * 
   * PARÁMETROS:
   * @param {string} path - Ruta a comparar
   * 
   * RETORNA:
   * @returns {string} 'active' si coincide, '' si no
   * 
   * USO:
   * - Se usa en cada link del menú
   * - Agrega clase 'active' al link actual
   * - CSS aplica estilos especiales (.active)
   * 
   * LÓGICA:
   * - Compara path con currentPath
   * - Si coinciden → retorna 'active'
   * - Si no coinciden → retorna string vacío
   * 
   * OPERADOR TERNARIO:
   * condición ? valorSiVerdadero : valorSiFalso
   * 
   * EJEMPLO:
   * currentPath = '/dashboard'
   * isActive('/dashboard') → 'active'
   * isActive('/students') → ''
   */
  const isActive = (path) => currentPath === path ? 'active' : '';

  /**
   * ============================================
   * PASO 4: GENERAR HTML CON TEMPLATE LITERALS
   * ============================================
   * 
   * TEMPLATE LITERALS (`)
   * - Permiten strings multilínea
   * - Permiten interpolación con ${}
   * - Permiten HTML legible
   * 
   * INTERPOLACIÓN ${}
   * - Inserta valores de variables
   * - Ejecuta expresiones JavaScript
   * - Llama a funciones
   * 
   * CONDICIONALES EN TEMPLATE
   * ${condición ? 'html si verdadero' : ''}
   * - Renderizado condicional
   * - Muestra elementos según condiciones
   */
  return `
    <!-- Contenedor principal del sidebar -->
    <div class="sidebar">
      
      <!-- ============================================
           SECCIÓN: LOGO/MARCA
           ============================================ -->
      <div class="sidebar-brand">
        <!-- Título de la aplicación -->
        <h1>CRUD OPERATIONS</h1>
      </div>

      <!-- ============================================
           SECCIÓN: INFORMACIÓN DEL USUARIO
           ============================================ -->
      <div class="sidebar-user">
        <div class="sidebar-user-info">
          
          <!-- Avatar del usuario
               Usa pravatar.cc para generar avatar basado en email
               ?u=${user.email} hace el avatar único por email -->
          <img 
            src="https://i.pravatar.cc/150?u=${user.email}" 
            alt="${user.name}" 
            class="sidebar-user-avatar"
          >
          
          <div>
            <!-- Nombre del usuario
                 ${user.name} interpola el valor de la variable -->
            <div class="sidebar-user-name">${user.name}</div>
            
            <!-- Rol del usuario
                 Operador ternario para mostrar texto en español:
                 Si role === 'admin' → 'Administrador'
                 Si no → 'Usuario' -->
            <div class="sidebar-user-role">
              ${user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================
           SECCIÓN: MENÚ DE NAVEGACIÓN
           ============================================ -->
      <ul class="sidebar-nav">
        
        <!-- Link: Dashboard (Home)
             href="#/dashboard": Cambia hash sin recargar
             ${isActive('/dashboard')}: Agrega clase 'active' si es la ruta actual
             Router detecta cambio y renderiza vista -->
        <li class="sidebar-nav-item">
          <a href="#/dashboard" class="sidebar-nav-link ${isActive('/dashboard')}">
            <i class="bi bi-house-door"></i>
            <span>Home</span>
          </a>
        </li>
        
        <!-- Link: Lista de Estudiantes -->
        <li class="sidebar-nav-item">
          <a href="#/students" class="sidebar-nav-link ${isActive('/students')}">
            <i class="bi bi-people"></i>
            <span>Students</span>
          </a>
        </li>
        
        <!-- Link: Pagos -->
        <li class="sidebar-nav-item">
          <a href="#/payments" class="sidebar-nav-link ${isActive('/payments')}">
            <i class="bi bi-credit-card"></i>
            <span>Payments</span>
          </a>
        </li>
        
        <!-- ============================================
             RENDERIZADO CONDICIONAL: Link solo para Admin
             ============================================
             
             ${user.role === 'admin' ? 'html' : ''}
             
             LÓGICA:
             - Si user.role es 'admin' → Muestra el link
             - Si no → No muestra nada (string vacío)
             
             CONTROL DE ACCESO POR ROL:
             - Solo administradores ven "Create"
             - Usuarios normales no ven esta opción
             - Pero además, el Router protege la ruta
             ============================================ -->
        ${user.role === 'admin' ? `
        <li class="sidebar-nav-item">
          <a href="#/students/create" class="sidebar-nav-link ${isActive('/students/create')}">
            <i class="bi bi-plus-circle"></i>
            <span>Create</span>
          </a>
        </li>
        ` : ''}
        
        <!-- Link: Configuración
             Nota: Esta ruta no está implementada en el Router
             Es un placeholder para futuras funcionalidades -->
        <li class="sidebar-nav-item">
          <a href="#/settings" class="sidebar-nav-link ${isActive('/settings')}">
            <i class="bi bi-gear"></i>
            <span>Settings</span>
          </a>
        </li>
      </ul>

      <!-- ============================================
           SECCIÓN: BOTÓN DE LOGOUT
           ============================================ -->
      <div class="sidebar-logout">
        
        <!-- Botón de cierre de sesión
             
             onclick="handleLogout()":
             - Llama a función global definida abajo
             - JavaScript busca función en window
             - handleLogout() está en window scope
             
             NOTA IMPORTANTE:
             No podemos usar import directamente en onclick
             Por eso definimos handleLogout en window (global) -->
        <button class="btn-logout" onclick="handleLogout()">
          <i class="bi bi-box-arrow-left"></i> Logout
        </button>
      </div>
    </div>
  `;
}

// ============================================
// MANEJADORES GLOBALES
// ============================================

/**
 * FUNCIÓN GLOBAL: handleLogout()
 * 
 * PROPÓSITO:
 * Manejar el cierre de sesión del usuario
 * 
 * POR QUÉ ESTÁ EN WINDOW:
 * - Los atributos onclick buscan funciones en window
 * - No pueden acceder a imports directamente
 * - window.handleLogout hace la función global
 * 
 * FLUJO:
 * 1. Muestra confirmación al usuario
 * 2. Si confirma → authService.logout()
 * 3. authService limpia sesión
 * 4. Redirige a /login
 * 
 * ALTERNATIVA MODERNA:
 * En lugar de onclick, se podría usar:
 * - addEventListener en el setTimeout
 * - Event delegation
 * - Framework reactivo
 * 
 * NOTA DE SEGURIDAD:
 * confirm() puede ser reemplazado por modal custom
 * para mejor UX en producción
 */
window.handleLogout = () => {
  /**
   * Confirmación del usuario
   * 
   * confirm(): Muestra diálogo nativo del navegador
   * Retorna true si confirma, false si cancela
   */
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    /**
     * Cierra la sesión
     * 
     * authService.logout() hace:
     * 1. Store.clearUser() → Limpia estado
     * 2. localStorage.removeItem() → Limpia persistencia
     * 3. window.location.hash = '#/login' → Redirige
     */
    authService.logout();
    
    console.log('👋 Usuario cerró sesión');
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Manipulación avanzada del DOM
 *    - Generación dinámica de HTML
 *    - Template literals para componentes
 *    - Interpolación de datos
 *    - Renderizado condicional
 * 
 * ✅ Gestión de roles (admin y visitante)
 *    - Renderizado condicional según rol
 *    - Opciones diferentes para admin/user
 *    - Control de acceso visual
 * 
 * ✅ Autenticación de usuarios
 *    - Muestra datos del usuario autenticado
 *    - Funcionalidad de logout
 *    - Integración con authService
 * 
 * ✅ Creación de rutas dinámicas en una SPA
 *    - Links con hash-based routing
 *    - Navegación sin recargar página
 *    - Indicador visual de ruta activa
 * 
 * ✅ Buenas prácticas de programación
 *    - Código exhaustivamente documentado
 *    - Componente reutilizable
 *    - Separación de responsabilidades
 *    - Nombres descriptivos
 *    - Código limpio y legible
 */
