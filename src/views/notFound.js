/**
 * ============================================
 * ARCHIVO: notFound.js
 * DESCRIPCIÓN: Vista de Acceso Denegado (403)
 * ============================================
 * 
 * Se muestra cuando:
 * - Usuario intenta acceder a ruta protegida sin permisos
 * - Usuario no-admin intenta acceder a ruta administrativa
 * - Ruta no existe en el Router
 * 
 * CARACTERÍSTICAS:
 * - Mensaje descriptivo de error
 * - Código 403 (Forbidden)
 * - Botón para volver a dashboard
 * - Diseño consistente con auth pages
 */

export default function NotFoundView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-container" style="text-align: center;">
        <!-- Código de error 403 Forbidden -->
        <h1 style="font-size: 5rem; color: var(--primary-color); margin-bottom: 1rem;">403</h1>
        
        <!-- Mensaje de error -->
        <h2 style="margin-bottom: 1rem;">Access Denied</h2>
        <p style="color: var(--gray-text); margin-bottom: 2rem;">
          You don't have permission to access this page.
        </p>
        
        <!-- Botón para volver -->
        <a href="#/dashboard" class="btn-primary-custom" style="display: inline-block; text-decoration: none;">
          Go to Dashboard
        </a>
      </div>
    </div>
  `;
}

/**
 * TEMAS IMPLEMENTADOS:
 * ✅ Manejo de errores - Página de error descriptiva
 * ✅ Rutas protegidas - Redirección desde Router
 * ✅ UX - Mensaje claro y opción de retorno
 */
