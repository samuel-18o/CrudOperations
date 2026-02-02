/**
 * ============================================
 * ARCHIVO: store.js
 * DESCRIPCIÓN: Sistema de Gestión de Estado Global
 * PATRÓN: Store/State Management Pattern
 * ============================================
 * 
 * Este archivo implementa el patrón Store para centralizar
 * el estado de toda la aplicación en un solo lugar.
 * 
 * VENTAJAS DEL PATRÓN STORE:
 * - Único punto de verdad para los datos
 * - Facilita el debugging
 * - Evita prop drilling entre componentes
 * - Permite persistencia fácil con localStorage
 * 
 * ESTADO GESTIONADO:
 * - user: Datos del usuario autenticado
 * - students: Lista de estudiantes
 * - payments: Lista de pagos
 * 
 * PERSISTENCIA:
 * - Los datos del usuario se guardan en localStorage
 * - Permite mantener la sesión activa entre recargas
 * - Implementa sincronización bidireccional con localStorage
 */

// ============================================
// DEFINICIÓN DEL STORE
// ============================================

/**
 * Store Object
 * 
 * Objeto singleton que contiene:
 * - state: El estado actual de la aplicación
 * - métodos: Funciones para leer y modificar el estado
 */
export const Store = {
  /**
   * ============================================
   * ESTADO DE LA APLICACIÓN
   * ============================================
   * 
   * Objeto que contiene todas las variables de estado:
   * 
   * - user: null | Object
   *   Contiene información del usuario autenticado:
   *   { id, name, email, password, role }
   *   null cuando no hay sesión activa
   * 
   * - students: Array
   *   Lista de todos los estudiantes registrados
   *   Cada estudiante: { id, name, email, properties, counterparties, date, avatar }
   * 
   * - payments: Array
   *   Lista de todos los pagos registrados
   *   Cada pago: { id, entity, type, properties, date, amount }
   */
  state: {
    user: null,      // Usuario autenticado (null = no autenticado)
    students: [],    // Array de estudiantes
    payments: []     // Array de pagos
  },

  /**
   * ============================================
   * MÉTODO: init()
   * ============================================
   * 
   * PROPÓSITO:
   * Inicializar el Store recuperando datos persistidos
   * 
   * FLUJO:
   * 1. Busca en localStorage la clave 'currentUser'
   * 2. Si existe, la parsea de JSON a objeto
   * 3. Asigna el usuario al estado
   * 
   * CUÁNDO SE EJECUTA:
   * - Al cargar la aplicación (app.js)
   * - Antes de inicializar el Router
   * 
   * PROPÓSITO DE PERSISTENCIA:
   * - Mantener sesión activa entre recargas
   * - No perder autenticación al cerrar pestaña
   * - Mejorar experiencia de usuario
   * 
   * localStorage vs sessionStorage:
   * - localStorage: Datos persisten indefinidamente
   * - sessionStorage: Datos se borran al cerrar pestaña
   * - Usamos localStorage para mantener sesión permanente
   */
  init() {
    // Intenta recuperar el usuario guardado de localStorage
    const savedUser = localStorage.getItem('currentUser');
    
    // Si existe un usuario guardado
    if (savedUser) {
      // Convierte el string JSON a objeto JavaScript
      // y lo asigna al estado
      this.state.user = JSON.parse(savedUser);
      
      console.log('✅ Sesión recuperada de localStorage:', this.state.user.name);
    } else {
      console.log('ℹ️ No hay sesión guardada');
    }
  },

  /**
   * ============================================
   * MÉTODO: setUser(user)
   * ============================================
   * 
   * PROPÓSITO:
   * Guardar usuario autenticado en el estado y persistirlo
   * 
   * PARÁMETROS:
   * @param {Object} user - Objeto con datos del usuario
   *   - id: string - Identificador único
   *   - name: string - Nombre completo
   *   - email: string - Correo electrónico
   *   - password: string - Contraseña (hash en producción)
   *   - role: string - 'admin' o 'user'
   * 
   * FLUJO:
   * 1. Asigna el usuario al estado en memoria
   * 2. Convierte el usuario a JSON
   * 3. Lo guarda en localStorage
   * 
   * CUÁNDO SE USA:
   * - Después de login exitoso
   * - Después de registro exitoso
   * - Al actualizar perfil de usuario
   * 
   * DOBLE ALMACENAMIENTO:
   * - En memoria (state): Para acceso rápido
   * - En localStorage: Para persistencia
   */
  setUser(user) {
    // Guarda en el estado en memoria
    this.state.user = user;
    
    // Persiste en localStorage convirtiéndolo a JSON
    // JSON.stringify convierte objeto → string
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    console.log('✅ Usuario guardado en Store y localStorage:', user.name);
  },

  /**
   * ============================================
   * MÉTODO: getUser()
   * ============================================
   * 
   * PROPÓSITO:
   * Obtener el usuario actual del estado
   * 
   * RETORNA:
   * @returns {Object|null} Usuario autenticado o null
   * 
   * CUÁNDO SE USA:
   * - Para verificar si hay sesión activa
   * - Para obtener datos del usuario actual
   * - Para mostrar información en la UI
   * - Para verificar permisos/roles
   * 
   * EJEMPLO DE USO:
   * const user = Store.getUser();
   * if (user) {
   *   console.log('Bienvenido', user.name);
   * }
   */
  getUser() {
    return this.state.user;
  },

  /**
   * ============================================
   * MÉTODO: clearUser()
   * ============================================
   * 
   * PROPÓSITO:
   * Cerrar sesión del usuario eliminando datos
   * 
   * FLUJO:
   * 1. Limpia el usuario del estado en memoria
   * 2. Elimina el usuario de localStorage
   * 
   * CUÁNDO SE USA:
   * - Al hacer logout
   * - Al detectar sesión inválida
   * - Al cambiar de cuenta
   * 
   * LIMPIEZA COMPLETA:
   * - Tanto en memoria como en persistencia
   * - Previene accesos no autorizados
   * - Libera memoria
   */
  clearUser() {
    // Limpia el estado en memoria
    this.state.user = null;
    
    // Elimina de localStorage
    localStorage.removeItem('currentUser');
    
    console.log('✅ Sesión cerrada - Usuario eliminado del Store');
  },

  /**
   * ============================================
   * MÉTODO: setStudents(students)
   * ============================================
   * 
   * PROPÓSITO:
   * Guardar lista de estudiantes en el estado
   * 
   * PARÁMETROS:
   * @param {Array} students - Array de objetos estudiante
   * 
   * CUÁNDO SE USA:
   * - Después de obtener estudiantes de la API
   * - Para actualizar la lista localmente
   * - Para evitar llamadas innecesarias a la API
   * 
   * NOTA:
   * No se persiste en localStorage (solo en memoria)
   * Los estudiantes se obtienen de la API cuando se necesitan
   */
  setStudents(students) {
    this.state.students = students;
    console.log('✅ Estudiantes actualizados en Store:', students.length);
  },

  /**
   * ============================================
   * MÉTODO: getStudents()
   * ============================================
   * 
   * PROPÓSITO:
   * Obtener lista de estudiantes del estado
   * 
   * RETORNA:
   * @returns {Array} Lista de estudiantes
   * 
   * USO:
   * Para acceder a los estudiantes sin llamar a la API
   */
  getStudents() {
    return this.state.students;
  },

  /**
   * ============================================
   * MÉTODO: setPayments(payments)
   * ============================================
   * 
   * PROPÓSITO:
   * Guardar lista de pagos en el estado
   * 
   * PARÁMETROS:
   * @param {Array} payments - Array de objetos pago
   * 
   * USO:
   * Similar a setStudents, mantiene pagos en memoria
   */
  setPayments(payments) {
    this.state.payments = payments;
    console.log('✅ Pagos actualizados en Store:', payments.length);
  },

  /**
   * ============================================
   * MÉTODO: getPayments()
   * ============================================
   * 
   * PROPÓSITO:
   * Obtener lista de pagos del estado
   * 
   * RETORNA:
   * @returns {Array} Lista de pagos
   */
  getPayments() {
    return this.state.payments;
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Persistencia de datos mediante Local Storage
 *    - Método init() recupera datos
 *    - Método setUser() persiste datos
 *    - Sincronización bidireccional
 * 
 * ✅ Gestión de estado centralizada
 *    - Patrón Store implementado
 *    - Único punto de verdad
 *    - Fácil acceso desde cualquier componente
 * 
 * ✅ Buenas prácticas de programación
 *    - Código documentado
 *    - Separación de responsabilidades
 *    - Nombres descriptivos
 *    - Funciones con propósito único
 */
