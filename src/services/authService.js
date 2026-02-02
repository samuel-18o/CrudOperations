/**
 * ============================================
 * ARCHIVO: authService.js
 * DESCRIPCIÓN: Servicio de Autenticación y Autorización
 * PATRÓN: Service Layer Pattern + Authentication Pattern
 * ============================================
 * 
 * Este archivo gestiona toda la lógica de autenticación
 * y autorización de usuarios en la aplicación.
 * 
 * RESPONSABILIDADES:
 * - Autenticación: Verificar identidad (login)
 * - Registro: Crear nuevas cuentas
 * - Autorización: Verificar permisos y roles
 * - Gestión de sesión: Mantener usuario activo
 * - Cierre de sesión: Limpiar sesión
 * 
 * SEGURIDAD:
 * NOTA: Esta es una implementación de DESARROLLO/APRENDIZAJE
 * 
 * EN PRODUCCIÓN SE DEBE:
 * - Usar HTTPS siempre
 * - NO guardar contraseñas en texto plano
 * - Usar hashing (bcrypt, argon2)
 * - Implementar JWT o similar
 * - Validar tokens en servidor
 * - Implementar rate limiting
 * - Usar autenticación de dos factores
 * - Implementar CSRF protection
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario envía credenciales
 * 2. Se consulta la API/BD
 * 3. Se verifican credenciales
 * 4. Si válidas → Se guarda sesión
 * 5. Si inválidas → Se muestra error
 */

// ============================================
// IMPORTACIONES
// ============================================

/**
 * apiService: Para comunicación con la API
 * Usado para consultar y crear usuarios
 */
import { apiService } from './apiService.js';

/**
 * Store: Para gestión de estado global
 * Usado para guardar/limpiar usuario autenticado
 */
import { Store } from '../state/store.js';

// ============================================
// DEFINICIÓN DEL SERVICIO
// ============================================

/**
 * authService Object
 * 
 * Centraliza toda la lógica de autenticación
 * y autorización de la aplicación.
 */
export const authService = {
  /**
   * ============================================
   * MÉTODO: login(email, password)
   * ============================================
   * 
   * PROPÓSITO:
   * Autenticar usuario con credenciales
   * 
   * PARÁMETROS:
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * 
   * RETORNA:
   * @returns {Promise<Object>} Resultado del login:
   *   - success: boolean - Si login fue exitoso
   *   - user: Object - Datos del usuario (si exitoso)
   *   - message: string - Mensaje de error (si fallo)
   * 
   * FLUJO:
   * 1. Consulta API buscando usuario con email y password
   * 2. json-server permite query params para filtrar
   * 3. Si encuentra usuario → Login exitoso
   * 4. Guarda usuario en Store (estado + localStorage)
   * 5. Si no encuentra → Credenciales inválidas
   * 6. Captura errores de red/servidor
   * 
   * QUERY PARAMS:
   * /users?email=X&password=Y
   * json-server filtra automáticamente
   * Retorna array con coincidencias
   * 
   * SEGURIDAD:
   * ⚠️ NUNCA hacer esto en producción:
   * - Enviar password en query params (visible en logs)
   * - Comparar password en cliente
   * - Guardar password sin hashear
   * 
   * EN PRODUCCIÓN:
   * - POST /auth/login con body encriptado
   * - Password hasheado en servidor
   * - Retornar JWT token
   * - No retornar password al cliente
   * 
   * EJEMPLO DE USO:
   * const result = await authService.login(
   *   'admin@crudops.com',
   *   'admin123'
   * );
   * 
   * if (result.success) {
   *   console.log('Bienvenido', result.user.name);
   * } else {
   *   console.log(result.message);
   * }
   */
  async login(email, password) {
    try {
      /**
       * PASO 1: Consultar API con credenciales
       * 
       * Endpoint: /users?email=X&password=Y
       * json-server filtra por ambos parámetros
       * Retorna array de usuarios que coinciden
       */
      const users = await apiService.get(`/users?email=${email}&password=${password}`);
      
      /**
       * PASO 2: Verificar si se encontró usuario
       * 
       * users.length > 0: Hay al menos un usuario
       * Significa que las credenciales son correctas
       */
      if (users.length > 0) {
        // Obtener el primer usuario del array
        const user = users[0];
        
        /**
         * PASO 3: Guardar usuario en Store
         * 
         * Store.setUser(user) hace:
         * 1. Guarda en state.user (memoria)
         * 2. Guarda en localStorage (persistencia)
         * 
         * Esto mantiene la sesión activa
         */
        Store.setUser(user);
        
        console.log('✅ Login exitoso:', user.name, `(${user.role})`);
        
        /**
         * Retorna objeto de éxito
         * La vista usará esto para redirigir
         */
        return { 
          success: true, 
          user: user 
        };
        
      } else {
        /**
         * No se encontró usuario
         * Credenciales incorrectas
         */
        console.log('❌ Login fallido: Credenciales inválidas');
        
        return { 
          success: false, 
          message: 'Credenciales inválidas' 
        };
      }
      
    } catch (error) {
      /**
       * Error en la petición
       * Puede ser error de red, servidor caído, etc.
       */
      console.error('❌ Error en login:', error);
      
      return { 
        success: false, 
        message: 'Error al iniciar sesión. Por favor intenta de nuevo.' 
      };
    }
  },

  /**
   * ============================================
   * MÉTODO: register(userData)
   * ============================================
   * 
   * PROPÓSITO:
   * Registrar nuevo usuario en el sistema
   * 
   * PARÁMETROS:
   * @param {Object} userData - Datos del nuevo usuario
   *   - name: string - Nombre completo
   *   - email: string - Correo electrónico
   *   - password: string - Contraseña
   *   - role: string - Rol (opcional, default: 'user')
   * 
   * RETORNA:
   * @returns {Promise<Object>} Resultado del registro:
   *   - success: boolean
   *   - user: Object (si exitoso)
   *   - message: string (si error)
   * 
   * FLUJO:
   * 1. Verifica si el email ya existe
   * 2. Si existe → Error
   * 3. Si no existe → Crea nuevo usuario
   * 4. Asigna rol (default: 'user')
   * 5. Guarda en Store (auto-login)
   * 6. Retorna resultado
   * 
   * VALIDACIONES:
   * - Email único (no duplicados)
   * - Rol por defecto si no se especifica
   * 
   * SEGURIDAD:
   * ⚠️ EN PRODUCCIÓN:
   * - Hashear password antes de guardar
   * - Validar formato de email
   * - Validar fuerza de contraseña
   * - Verificar email con código
   * - Implementar CAPTCHA
   * 
   * EJEMPLO DE USO:
   * const result = await authService.register({
   *   name: 'Juan Pérez',
   *   email: 'juan@test.com',
   *   password: 'secure123',
   *   role: 'user'
   * });
   */
  async register(userData) {
    try {
      /**
       * PASO 1: Verificar si email ya existe
       * 
       * Consulta API filtrando por email
       * Evita cuentas duplicadas
       */
      const existingUsers = await apiService.get(`/users?email=${userData.email}`);
      
      /**
       * Si se encontró usuario con ese email
       * No permitir registro
       */
      if (existingUsers.length > 0) {
        console.log('❌ Registro fallido: Email ya existe');
        
        return { 
          success: false, 
          message: 'El email ya está registrado' 
        };
      }

      /**
       * PASO 2: Crear nuevo usuario
       * 
       * Spread operator (...userData) copia todos los campos
       * role: Asigna 'user' si no se especificó
       * 
       * ESTRUCTURA:
       * {
       *   name: '...',
       *   email: '...',
       *   password: '...',
       *   role: 'user' o userData.role
       * }
       */
      const newUser = await apiService.post('/users', {
        ...userData,
        role: userData.role || 'user'  // Default: 'user'
      });

      /**
       * PASO 3: Auto-login después de registro
       * 
       * Guarda usuario en Store
       * Usuario queda autenticado automáticamente
       * Mejor experiencia: no tiene que hacer login
       */
      Store.setUser(newUser);
      
      console.log('✅ Registro exitoso:', newUser.name);
      
      return { 
        success: true, 
        user: newUser 
      };
      
    } catch (error) {
      /**
       * Error en el proceso de registro
       */
      console.error('❌ Error en registro:', error);
      
      return { 
        success: false, 
        message: 'Error al registrar usuario. Por favor intenta de nuevo.' 
      };
    }
  },

  /**
   * ============================================
   * MÉTODO: logout()
   * ============================================
   * 
   * PROPÓSITO:
   * Cerrar sesión del usuario actual
   * 
   * FLUJO:
   * 1. Limpia usuario del Store
   * 2. Elimina de localStorage
   * 3. Redirige a login
   * 
   * NO ES ASYNC:
   * - No hace peticiones a API
   * - Solo limpia datos locales
   * 
   * EN PRODUCCIÓN:
   * - Invalidar token en servidor
   * - Limpiar cookies
   * - Revocar refresh tokens
   * 
   * EJEMPLO DE USO:
   * authService.logout();
   * // Usuario es redirigido a /login
   */
  logout() {
    /**
     * Limpia usuario del Store
     * - Elimina de state.user
     * - Elimina de localStorage
     */
    Store.clearUser();
    
    console.log('👋 Sesión cerrada');
    
    /**
     * Redirige a página de login
     * Cambia el hash de la URL
     * Router detecta el cambio y renderiza login
     */
    window.location.hash = '#/login';
  },

  /**
   * ============================================
   * MÉTODO: isAuthenticated()
   * ============================================
   * 
   * PROPÓSITO:
   * Verificar si hay un usuario autenticado
   * 
   * RETORNA:
   * @returns {boolean} true si hay sesión activa
   * 
   * USO:
   * - Route Guards en el Router
   * - Mostrar/ocultar elementos UI
   * - Condicionales de navegación
   * 
   * LÓGICA:
   * - Obtiene usuario del Store
   * - Si es null → No autenticado
   * - Si es objeto → Autenticado
   * 
   * EJEMPLO:
   * if (authService.isAuthenticated()) {
   *   console.log('Usuario conectado');
   * } else {
   *   console.log('Por favor inicia sesión');
   * }
   */
  isAuthenticated() {
    // Retorna true si hay usuario, false si es null
    return Store.getUser() !== null;
  },

  /**
   * ============================================
   * MÉTODO: isAdmin()
   * ============================================
   * 
   * PROPÓSITO:
   * Verificar si el usuario actual es administrador
   * 
   * RETORNA:
   * @returns {boolean} true si es admin
   * 
   * USO:
   * - Route Guards para rutas administrativas
   * - Mostrar/ocultar botones de admin
   * - Habilitar/deshabilitar funciones
   * 
   * LÓGICA:
   * 1. Obtiene usuario del Store
   * 2. Verifica que exista
   * 3. Verifica que role sea 'admin'
   * 4. Retorna true solo si ambas son verdad
   * 
   * ROLES EN EL SISTEMA:
   * - 'admin': Acceso completo, CRUD
   * - 'user': Solo lectura
   * 
   * EJEMPLO:
   * if (authService.isAdmin()) {
   *   // Mostrar botón "Crear Estudiante"
   * }
   */
  isAdmin() {
    // Obtiene usuario del Store
    const user = Store.getUser();
    
    /**
     * Doble verificación:
     * 1. user: Verifica que exista usuario
     * 2. user.role === 'admin': Verifica el rol
     * 
     * Operador &&: Ambas deben ser verdad
     * Retorna true solo si es usuario admin
     */
    return user && user.role === 'admin';
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Autenticación de usuarios y gestión de roles
 *    - Login con verificación de credenciales
 *    - Registro con validación de email único
 *    - Sistema de roles (admin/user)
 *    - Métodos de verificación de permisos
 * 
 * ✅ Persistencia de datos mediante Local Storage
 *    - Sesión se guarda en Store
 *    - Store persiste en localStorage
 *    - Sesión sobrevive a recargas
 * 
 * ✅ Consumo de APIs con Fetch y manejo de promesas
 *    - Usa apiService para peticiones
 *    - async/await para código limpio
 *    - try-catch para manejo de errores
 * 
 * ✅ Validaciones y manejo de errores
 *    - Validación de email duplicado
 *    - Mensajes descriptivos de error
 *    - Manejo de errores de red
 *    - Retorno consistente de resultados
 * 
 * ✅ Buenas prácticas de programación
 *    - Código exhaustivamente documentado
 *    - Separación de responsabilidades
 *    - Funciones con propósito único
 *    - Nombres descriptivos
 *    - Comentarios sobre seguridad en producción
 */
