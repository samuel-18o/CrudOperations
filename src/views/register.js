/**
 * ============================================
 * ARCHIVO: register.js
 * DESCRIPCIÓN: Vista de Registro de Usuarios
 * ============================================
 * 
 * Permite crear nuevas cuentas de usuario con rol seleccionable.
 * Similar a login.js pero con validación de email único.
 * 
 * FLUJO:
 * 1. Usuario completa formulario (nombre, email, contraseña, rol)
 * 2. Submit → handleRegister
 * 3. authService.register() verifica email único
 * 4. Si exitoso → Auto-login y redirige a dashboard
 * 5. Si error → Muestra mensaje
 */

import { authService } from '../services/authService.js';

export default function RegisterView() {
  // setTimeout para esperar render antes de agregar listener
  setTimeout(() => {
    const form = document.getElementById('registerForm');
    form?.addEventListener('submit', handleRegister);
  }, 0);

  return `
    <div class="auth-wrapper fade-in">
      <div class="auth-container">
        <div class="auth-header">
          <h1>CRUD OPERATIONS</h1>
          <h2>SIGN UP</h2>
        </div>

        <form id="registerForm" class="auth-form">
          <!-- Campo: Nombre completo -->
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              class="form-control" 
              placeholder="Enter your full name"
              required
            >
          </div>

          <!-- Campo: Email - Se validará que sea único -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
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

          <!-- Campo: Rol - admin o user -->
          <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <select id="role" class="form-control" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" class="btn-primary-custom">
            Sign Up
          </button>
        </form>

        <!-- Link a login -->
        <div class="auth-footer">
          <p>Already have an account? <a href="#/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `;
}

/**
 * MANEJADOR: handleRegister
 * 
 * Procesa el registro de nuevo usuario
 * 
 * VALIDACIONES:
 * - Email único (en authService)
 * - Campos requeridos (HTML5)
 * 
 * FLUJO:
 * 1. Extrae datos del formulario
 * 2. Llama authService.register()
 * 3. Si exitoso → Auto-login y redirige
 * 4. Si error → Muestra mensaje (ej: email duplicado)
 */
async function handleRegister(e) {
  e.preventDefault(); // Previene recarga
  
  // Extrae datos del formulario
  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value
  };

  // Intenta registrar
  const result = await authService.register(userData);

  if (result.success) {
    // Registro exitoso → Auto-login y redirige
    window.location.hash = '#/dashboard';
    window.location.reload();
  } else {
    // Error → Muestra mensaje (ej: email ya existe)
    alert(result.message);
  }
}

/**
 * TEMAS IMPLEMENTADOS:
 * ✅ Autenticación - Registro de usuarios
 * ✅ Validaciones - Email único, campos requeridos
 * ✅ Gestión de roles - Selección de admin/user
 * ✅ Consumo de APIs - authService.register()
 * ✅ Manejo de errores - try-catch en authService
 */
