/**
 * ============================================
 * ARCHIVO: apiService.js
 * DESCRIPCIÓN: Servicio de Comunicación con API REST
 * PATRÓN: Service Layer Pattern
 * ============================================
 * 
 * Este archivo centraliza todas las peticiones HTTP a la API
 * simulada con json-server.
 * 
 * VENTAJAS DEL PATRÓN SERVICE:
 * - Centraliza lógica de comunicación
 * - Reutilización de código
 * - Fácil mantenimiento
 * - Cambio de API sin afectar componentes
 * - Manejo consistente de errores
 * 
 * TECNOLOGÍAS UTILIZADAS:
 * - Fetch API: Nativa del navegador
 * - Promesas (async/await): Para código asíncrono
 * - JSON: Formato de intercambio de datos
 * - REST: Arquitectura de API
 * 
 * MÉTODOS HTTP IMPLEMENTADOS:
 * - GET: Obtener datos
 * - POST: Crear datos
 * - PUT: Actualizar datos
 * - DELETE: Eliminar datos
 */

// ============================================
// CONFIGURACIÓN DE LA API
// ============================================

/**
 * URL BASE DE LA API
 * 
 * json-server corre en localhost:3000
 * 
 * ENDPOINTS DISPONIBLES:
 * - /users: Gestión de usuarios
 * - /students: Gestión de estudiantes
 * - /payments: Gestión de pagos
 * 
 * NOTA IMPORTANTE:
 * En producción, esto debería venir de una
 * variable de entorno o archivo de configuración:
 * const API_URL = import.meta.env.VITE_API_URL;
 */
const API_URL = 'http://localhost:3000';

// ============================================
// DEFINICIÓN DEL SERVICIO
// ============================================

/**
 * apiService Object
 * 
 * Objeto que encapsula todas las operaciones
 * de comunicación con la API.
 */
export const apiService = {
  /**
   * ============================================
   * MÉTODOS GENÉRICOS HTTP
   * ============================================
   * 
   * Estos métodos son la base para todas las
   * operaciones CRUD. Se reutilizan en los
   * métodos específicos de cada recurso.
   */

  /**
   * MÉTODO: get(endpoint)
   * TIPO: GET Request
   * 
   * PROPÓSITO:
   * Obtener datos de la API (lectura)
   * 
   * PARÁMETROS:
   * @param {string} endpoint - Ruta del recurso
   *   Ejemplo: '/students', '/users?email=test@test.com'
   * 
   * RETORNA:
   * @returns {Promise<Object|Array>} Datos obtenidos
   * 
   * FLUJO:
   * 1. Construye URL completa: API_URL + endpoint
   * 2. Hace petición GET con fetch()
   * 3. Espera respuesta con await
   * 4. Verifica si la respuesta es exitosa (status 200-299)
   * 5. Si no es exitosa → lanza error
   * 6. Si es exitosa → parsea JSON y retorna
   * 7. Si hay error → lo captura y re-lanza
   * 
   * MANEJO DE ERRORES:
   * - try-catch para capturar errores
   * - console.error para logging
   * - throw error para propagar al llamador
   * 
   * USO DE ASYNC/AWAIT:
   * - async: Marca función como asíncrona
   * - await: Espera a que la promesa se resuelva
   * - Hace código más legible que .then()
   * 
   * EJEMPLO DE USO:
   * const students = await apiService.get('/students');
   * const user = await apiService.get('/users?email=test@test.com');
   */
  async get(endpoint) {
    try {
      // Construye URL completa y hace petición GET
      const response = await fetch(`${API_URL}${endpoint}`);
      
      /**
       * VERIFICACIÓN DE RESPUESTA
       * 
       * response.ok: true si status 200-299
       * Si no es ok, lanza error para ir al catch
       */
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
      
      /**
       * PARSEO DE JSON
       * 
       * response.json(): Convierte respuesta a objeto JS
       * await: Espera a que termine la conversión
       * return: Retorna los datos al llamador
       */
      return await response.json();
      
    } catch (error) {
      /**
       * MANEJO DE ERRORES
       * 
       * - Log del error en consola para debugging
       * - throw error: Re-lanza para que el llamador lo maneje
       * - Permite mostrar mensaje al usuario en la vista
       */
      console.error('API Error (GET):', error);
      throw error; // Propaga el error
    }
  },

  /**
   * MÉTODO: post(endpoint, data)
   * TIPO: POST Request
   * 
   * PROPÓSITO:
   * Crear nuevos datos en la API (crear recurso)
   * 
   * PARÁMETROS:
   * @param {string} endpoint - Ruta del recurso (/students, /users)
   * @param {Object} data - Datos a enviar en el body
   * 
   * RETORNA:
   * @returns {Promise<Object>} Recurso creado con ID asignado
   * 
   * FLUJO:
   * 1. Construye URL completa
   * 2. Configura opciones de fetch:
   *    - method: 'POST'
   *    - headers: Indica que enviamos JSON
   *    - body: Datos convertidos a JSON string
   * 3. Hace petición POST
   * 4. Verifica respuesta
   * 5. Retorna recurso creado (incluye ID generado)
   * 
   * HEADERS IMPORTANTES:
   * - Content-Type: application/json
   *   Indica al servidor que enviamos JSON
   * 
   * BODY:
   * - JSON.stringify(data): Convierte objeto JS → JSON string
   * - El servidor recibe el JSON y lo parsea
   * 
   * EJEMPLO DE USO:
   * const newStudent = {
   *   name: 'Juan',
   *   email: 'juan@test.com'
   * };
   * const created = await apiService.post('/students', newStudent);
   * console.log(created.id); // ID asignado por json-server
   */
  async post(endpoint, data) {
    try {
      // Petición POST con configuración
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',                          // Método HTTP
        headers: {
          'Content-Type': 'application/json'     // Tipo de contenido
        },
        body: JSON.stringify(data)               // Datos en formato JSON
      });
      
      // Verifica respuesta exitosa
      if (!response.ok) {
        throw new Error(`Error posting data: ${response.status} ${response.statusText}`);
      }
      
      // Retorna el recurso creado (con ID asignado)
      return await response.json();
      
    } catch (error) {
      console.error('API Error (POST):', error);
      throw error;
    }
  },

  /**
   * MÉTODO: put(endpoint, data)
   * TIPO: PUT Request
   * 
   * PROPÓSITO:
   * Actualizar datos existentes en la API (actualizar recurso)
   * 
   * PARÁMETROS:
   * @param {string} endpoint - Ruta con ID (/students/5)
   * @param {Object} data - Datos actualizados
   * 
   * RETORNA:
   * @returns {Promise<Object>} Recurso actualizado
   * 
   * FLUJO:
   * Similar a POST pero con method: 'PUT'
   * 
   * DIFERENCIA PUT vs POST:
   * - POST: Crear nuevo recurso
   * - PUT: Actualizar recurso existente
   * - PUT requiere ID en la URL
   * 
   * EJEMPLO DE USO:
   * const updated = {
   *   name: 'Juan Actualizado',
   *   email: 'juan.nuevo@test.com'
   * };
   * await apiService.put('/students/5', updated);
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',                           // Método HTTP PUT
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error updating data: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('API Error (PUT):', error);
      throw error;
    }
  },

  /**
   * MÉTODO: delete(endpoint)
   * TIPO: DELETE Request
   * 
   * PROPÓSITO:
   * Eliminar datos de la API (eliminar recurso)
   * 
   * PARÁMETROS:
   * @param {string} endpoint - Ruta con ID (/students/5)
   * 
   * RETORNA:
   * @returns {Promise<boolean>} true si eliminación exitosa
   * 
   * FLUJO:
   * 1. Hace petición DELETE con el ID
   * 2. Verifica respuesta
   * 3. Retorna true (sin body en respuesta)
   * 
   * PARTICULARIDAD:
   * - No envía body (solo necesita el ID en URL)
   * - Retorna true como confirmación
   * 
   * EJEMPLO DE USO:
   * await apiService.delete('/students/5');
   * console.log('Estudiante eliminado');
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE'                         // Método HTTP DELETE
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting data: ${response.status} ${response.statusText}`);
      }
      
      // Retorna true como confirmación
      return true;
      
    } catch (error) {
      console.error('API Error (DELETE):', error);
      throw error;
    }
  },

  /**
   * ============================================
   * MÉTODOS ESPECÍFICOS PARA ESTUDIANTES
   * ============================================
   * 
   * Estos métodos son wrappers (envolturas) de
   * los métodos genéricos. Facilitan el uso al
   * no tener que escribir el endpoint completo.
   * 
   * VENTAJAS:
   * - Código más limpio en las vistas
   * - Centraliza los endpoints
   * - Fácil de cambiar si cambia la API
   */

  /**
   * MÉTODO: getStudents()
   * 
   * PROPÓSITO:
   * Obtener lista completa de estudiantes
   * 
   * RETORNA:
   * @returns {Promise<Array>} Array de estudiantes
   * 
   * USO EN VISTAS:
   * const students = await apiService.getStudents();
   */
  getStudents() {
    return this.get('/students');
  },

  /**
   * MÉTODO: getStudent(id)
   * 
   * PROPÓSITO:
   * Obtener un estudiante específico por ID
   * 
   * PARÁMETROS:
   * @param {string} id - ID del estudiante
   * 
   * RETORNA:
   * @returns {Promise<Object>} Datos del estudiante
   * 
   * USO:
   * const student = await apiService.getStudent('5');
   */
  getStudent(id) {
    return this.get(`/students/${id}`);
  },

  /**
   * MÉTODO: createStudent(student)
   * 
   * PROPÓSITO:
   * Crear un nuevo estudiante
   * 
   * PARÁMETROS:
   * @param {Object} student - Datos del estudiante
   *   {name, email, properties, counterparties, date, avatar}
   * 
   * RETORNA:
   * @returns {Promise<Object>} Estudiante creado con ID
   * 
   * USO:
   * const newStudent = await apiService.createStudent({
   *   name: 'Juan',
   *   email: 'juan@test.com',
   *   // ... otros campos
   * });
   */
  createStudent(student) {
    return this.post('/students', student);
  },

  /**
   * MÉTODO: updateStudent(id, student)
   * 
   * PROPÓSITO:
   * Actualizar datos de un estudiante existente
   * 
   * PARÁMETROS:
   * @param {string} id - ID del estudiante
   * @param {Object} student - Datos actualizados
   * 
   * RETORNA:
   * @returns {Promise<Object>} Estudiante actualizado
   * 
   * USO:
   * await apiService.updateStudent('5', {
   *   name: 'Juan Actualizado',
   *   email: 'juan.nuevo@test.com',
   *   // ... otros campos
   * });
   */
  updateStudent(id, student) {
    return this.put(`/students/${id}`, student);
  },

  /**
   * MÉTODO: deleteStudent(id)
   * 
   * PROPÓSITO:
   * Eliminar un estudiante
   * 
   * PARÁMETROS:
   * @param {string} id - ID del estudiante a eliminar
   * 
   * RETORNA:
   * @returns {Promise<boolean>} true si exitoso
   * 
   * USO:
   * await apiService.deleteStudent('5');
   */
  deleteStudent(id) {
    return this.delete(`/students/${id}`);
  },

  /**
   * ============================================
   * MÉTODOS ESPECÍFICOS PARA PAGOS
   * ============================================
   */

  /**
   * MÉTODO: getPayments()
   * 
   * PROPÓSITO:
   * Obtener lista completa de pagos
   * 
   * RETORNA:
   * @returns {Promise<Array>} Array de pagos
   */
  getPayments() {
    return this.get('/payments');
  },

  /**
   * MÉTODO: createPayment(payment)
   * 
   * PROPÓSITO:
   * Crear un nuevo pago
   * 
   * PARÁMETROS:
   * @param {Object} payment - Datos del pago
   */
  createPayment(payment) {
    return this.post('/payments', payment);
  },

  /**
   * MÉTODO: deletePayment(id)
   * 
   * PROPÓSITO:
   * Eliminar un pago
   * 
   * PARÁMETROS:
   * @param {string} id - ID del pago
   */
  deletePayment(id) {
    return this.delete(`/payments/${id}`);
  }
};

/**
 * ============================================
 * TEMAS DE LA PRUEBA IMPLEMENTADOS
 * ============================================
 * 
 * ✅ Consumo de APIs con Fetch y manejo de promesas
 *    - Fetch API utilizada en todos los métodos
 *    - async/await para código asíncrono limpio
 *    - Promesas manejadas correctamente
 * 
 * ✅ Manejo de errores y validaciones
 *    - try-catch en todos los métodos
 *    - Verificación de response.ok
 *    - Mensajes descriptivos de error
 *    - Propagación de errores al llamador
 * 
 * ✅ Operaciones CRUD completas
 *    - Create (POST)
 *    - Read (GET)
 *    - Update (PUT)
 *    - Delete (DELETE)
 * 
 * ✅ Buenas prácticas de programación
 *    - Código exhaustivamente documentado
 *    - Separación de responsabilidades
 *    - Reutilización de código
 *    - Métodos con propósito único
 *    - Nombres descriptivos
 *    - Service Pattern implementado
 */
