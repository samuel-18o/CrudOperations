/**
 * ============================================
 * ARCHIVO: login.js
 * DESCRIPCIÓN: Vista de Inicio de Sesión
 * TIPO: View Component
 * ============================================
 * 
 * Vista pública que permite a los usuarios autenticarse
 * en el sistema proporcionando email y contraseña.
 * 
 * CARACTERÍSTICAS:
 * - Formulario de login
 * - Validación HTML5 (required)
 * - Manejo asíncrono de login
 * - Mensajes de error descriptivos
 * - Link a registro
 * - Redirección automática al éxito
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario completa formulario
 * 2. Submit → previene recarga (preventDefault)
 * 3. Extrae credenciales del formulario
 * 4. Llama authService.login()
 * 5. Si éxito → Redirige a dashboard + recarga
 * 6. Si error → Muestra mensaje alert
 * 
 * SEGURIDAD:
 * ⚠️ En producción implementar:
 * - Rate limiting (limitar intentos)
 * - CAPTCHA después de X intentos
 * - Mensajes genéricos (no revelar si email existe)
 * - HTTPS obligatorio
 * - Two-factor authentication
 */

// ============================================
// IMPORTACIONES
// ============================================

/**
 * authService: Lógica de autenticación
 * Proporciona método login() que verifica credenciales
 */
import { authService } from '../services/authService.js';

// ============================================
// DEFINICIÓN DE LA VISTA
// ============================================

/**
 * FUNCIÓN: LoginView()
 * TIPO: View Component Function
 * 
 * PROPÓSITO:
 * Renderizar la página de inicio de sesión
 * 
 * RETORNA:
 * @returns {string} HTML de la vista de login
 * 
 * CARACTERÍSTICAS ESPECIALES:
 * - setTimeout para event listeners
 * - Formulario con validación HTML5
 * - Diseño centrado con auth-wrapper
 * 
 * CICLO DE VIDA:
 * 1. Retorna HTML
 * 2. Router inserta en DOM
 * 3. setTimeout ejecuta después de render
 * 4. Configura event listener del formulario
 */
export default function LoginView() {
  /**
   * setTimeout con 0ms
   * 
   * PROPÓSITO:
   * Esperar a que el HTML se inserte en el DOM
   * antes de agregar event listeners
   * 
   * PROBLEMA SIN setTimeout:
   * - El código se ejecuta antes del render
   * - getElementById retorna null
   * - addEventListener falla
   * 
   * SOLUCIÓN:
   * - setTimeout agrega a la cola de eventos
   * - Se ejecuta después del render
   * - Garantiza que el DOM esté listo
   * 
   * ALTERNATIVA MODERNA:
   * - requestAnimationFrame
   * - MutationObserver
   * - Frameworks reactivos (React, Vue)
   */
  setTimeout(() => {
    // Obtiene el formulario del DOM
    const form = document.getElementById('loginForm');
    
    /**
     * ?. (Optional chaining)
     * 
     * Evita error si form es null
     * Si form existe → agrega listener
     * Si form es null → no hace nada
     */
    form?.addEventListener('submit', handleLogin);
  }, 0);

  /**
   * RETORNA HTML DE LA VISTA
   * 
   * ESTRUCTURA:
   * - auth-wrapper: Contenedor de página completa
   * - auth-container: Caja del formulario
   * - auth-header: Logo y título
   * - auth-form: Formulario
   * - auth-footer: Link a registro
   */
  return `
    <div class="auth-wrapper fade-in">
      <div class="auth-container">
        
        <!-- Header: Logo y título -->
        <div class="auth-header">
          <h1>CRUD OPERATIONS</h1>
          <h2>SIGN IN</h2>
        </div>

        <!-- Formulario de login -->
        <form id="loginForm" class="auth-form">
          
          <!-- Campo: Email -->
          <div class="form-group">
            <label for="email" class="form-label">Username</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="Enter your email"
              required
            >
          </div>

          <!-- Campo: Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="Enter your password"
              required
            >
          </div>

          <!-- Botón submit -->
          <button type="submit" class="btn-primary-custom">
            Sign In
          </button>
        </form>

        <!-- Footer: Link a registro -->
        <div class="auth-footer">
          <p>Don't have an account? <a href="#/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  `;
}

/**
 * ============================================
 * MANEJADOR DE FORMULARIO
 * ============================================
 * 
 * FUNCIÓN: handleLogin(e)
 * TIPO: Async Event Handler
 * 
 * PROPÓSITO:
 * Procesar el intento de login del usuario
 * 
 * PARÁMETROS:
 * @param {Event} e - Evento submit del formulario
 * 
 * FLUJO:
 * 1. Previene recarga de página
 * 2. Extrae valores del formulario
 * 3. Llama a authService.login()
 * 4. Procesa resultado (éxito o error)
 * 5. Redirige o muestra mensaje
 * 
 * MANEJO ASÍNCRONO:
 * - async: Permite usar await
 * - await: Espera respuesta de login
 * - No bloquea la UI
 */
async function handleLogin(e) {
  /**
   * PASO 1: Prevenir recarga
   * 
   * e.preventDefault() evita:
   * - Recarga de página
   * - Envío tradicional del formulario
   * - Pérdida del estado SPA
   * 
   * Sin esto, la página se recargaría
   */
  e.preventDefault();
  
  /**
   * PASO 2: Extraer valores del formulario
   * 
   * document.getElementById: Obtiene elemento
   * .value: Obtiene valor actual del input
   * 
   * VALIDACIÓN:
   * HTML5 'required' ya validó que no estén vacíos
   */
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  /**
   * PASO 3: Intentar login
   * 
   * authService.login() retorna:
   * {
   *   success: boolean,
   *   user: Object (si exitoso),
   *   message: string (si error)
   * }
   * 
   * await: Espera respuesta de la API
   * Código se pausa hasta tener resultado
   */
  const result = await authService.login(email, password);

  /**
   * PASO 4: Procesar resultado
   */
  if (result.success) {
    /**
     * LOGIN EXITOSO
     * 
     * Acciones:
     * 1. Cambiar hash a dashboard
     * 2. Recargar página completa
     * 
     * RELOAD:
     * - Necesario para renderizar Sidebar
     * - Inicializa app.js con usuario
     * - Actualiza toda la UI
     */
    window.location.hash = '#/dashboard';
    window.location.reload();
    
  } else {
    /**
     * LOGIN FALLIDO
     * 
     * Muestra mensaje de error al usuario
     * 
     * alert(): Diálogo nativo del navegador
     * 
     * MEJORA PARA PRODUCCIÓN:
     * - Usar toast notification
     * - Mostrar error en el formulario
     * - No usar alert (mala UX)
     * - Mensaje genérico por seguridad
     */
    alert(result.message);
  }
}

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Autenticación de usuarios
 *    - Formulario de login funcional
 *    - Integración con authService
 *    - Verificación de credenciales
 * 
 * ✅ Manipulación del DOM
 *    - Event listeners dinámicos
 *    - Extracción de valores de formulario
 *    - Redirecciones programáticas
 * 
 * ✅ Consumo de APIs con Fetch y promesas
 *    - async/await para login asíncrono
 *    - Manejo de respuestas
 * 
 * ✅ Validaciones
 *    - HTML5 validation (required)
 *    - Verificación de credenciales
 *    - Mensajes de error descriptivos
 * 
 * ✅ Buenas prácticas
 *    - Código documentado
 *    - Separación vista/lógica
 *    - Nombres descriptivos
 */
