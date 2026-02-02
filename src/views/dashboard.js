/**
 * ============================================
 * ARCHIVO: dashboard.js  
 * DESCRIPCIÓN: Vista Principal del Dashboard
 * ============================================
 * 
 * Panel de control con estadísticas y lista de estudiantes recientes.
 * Vista protegida que requiere autenticación.
 * 
 * CARACTERÍSTICAS:
 * - 4 tarjetas de estadísticas (Courses, Students, Payments, Users)
 * - Tabla de estudiantes recientes (últimos 5)
 * - Promise.all() para cargar múltiples datos en paralelo
 * - Actualización dinámica de contadores
 * - Datos guardados en Store para reutilización
 * 
 * OPERACIONES:
 * - READ (GET) - Consulta students y payments
 * - Estado global - Guarda en Store
 * 
 * TEMAS IMPLEMENTADOS:
 * ✅ Consumo de APIs - Promise.all() para peticiones paralelas
 * ✅ Manipulación del DOM - Actualización dinámica de contadores y tabla
 * ✅ Gestión de estado - Store.setStudents(), Store.setPayments()
 */

import Sidebar from '../components/Sidebar.js';
import { apiService } from '../services/apiService.js';
import { Store } from '../state/store.js';

export default function DashboardView() {
  setTimeout(async () => {
    await loadDashboardData();
  }, 0);

  return `
    ${Sidebar()}
    <div class="main-content fade-in">
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-icon blue">
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <div class="stat-card-title">COURSES</div>
          </div>
          <div class="stat-card-value" id="coursesCount">0</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-icon green">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-card-title">STUDENTS</div>
          </div>
          <div class="stat-card-value" id="studentsCount">0</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-card-icon orange">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stat-card-title">PAYMENTS</div>
          </div>
          <div class="stat-card-value" id="paymentsTotal">AED 0</div>
        </div>

        <div class="stat-card highlighted">
          <div class="stat-card-header">
            <div class="stat-card-icon yellow">
              <i class="bi bi-person-check"></i>
            </div>
            <div class="stat-card-title">USERS</div>
          </div>
          <div class="stat-card-value" id="usersCount">0</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Recent Students</h2>
          <a href="#/students" class="btn-add">View All</a>
        </div>

        <div id="studentsTableContainer">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * FUNCIÓN: loadDashboardData
 * 
 * PROPÓSITO:
 * Cargar datos de estudiantes y pagos en paralelo
 * 
 * FLUJO:
 * 1. Promise.all() ejecuta ambas peticiones simultáneamente
 * 2. Guarda datos en Store para reutilización
 * 3. Actualiza contadores de las tarjetas estadísticas
 * 4. Renderiza tabla con últimos 5 estudiantes
 * 
 * PROMISE.ALL():
 * - Ejecuta múltiples promesas en paralelo
 * - Más eficiente que await secuencial
 * - Retorna array con resultados en orden
 * - Si una falla, todas fallan (ir a catch)
 */
async function loadDashboardData() {
  try {
    /**
     * Promise.all() ejecuta ambas peticiones al mismo tiempo
     * Destructuring: [students, payments] extrae los resultados
     * Más rápido que esperar una después de la otra
     */
    const [students, payments] = await Promise.all([
      apiService.getStudents(),
      apiService.getPayments()
    ]);

    // Guarda en Store para uso en otras vistas
    Store.setStudents(students);
    Store.setPayments(payments);

    // Actualiza contadores en tarjetas estadísticas
    document.getElementById('coursesCount').textContent = '243'; // Valor fijo demo
    document.getElementById('studentsCount').textContent = students.length;
    document.getElementById('usersCount').textContent = '3'; // Valor fijo demo
    
    // Calcula total de pagos (demo: cantidad × 50000)
    const totalPayments = payments.length * 50000;
    document.getElementById('paymentsTotal').textContent = `AED ${totalPayments.toLocaleString()}`;

    // Renderiza solo los últimos 5 estudiantes
    // .slice(0, 5) extrae los primeros 5 elementos del array
    renderStudentsTable(students.slice(0, 5));
    
  } catch (error) {
    // Captura errores de red o API
    console.error('Error loading dashboard:', error);
    // Nota: En producción mostrar mensaje al usuario
  }
}

/**
 * FUNCIÓN: renderStudentsTable
 * 
 * PROPÓSITO:
 * Renderizar tabla de estudiantes recientes
 * 
 * PARÁMETROS:
 * @param {Array} students - Array de estudiantes (máximo 5)
 * 
 * MANIPULACIÓN DOM:
 * - Genera HTML con map() y template literals
 * - join('') convierte array de strings en un string
 * - innerHTML inserta en contenedor
 */
function renderStudentsTable(students) {
  const container = document.getElementById('studentsTableContainer');
  
  // Si no hay estudiantes, muestra mensaje
  if (students.length === 0) {
    container.innerHTML = '<p class="text-center">No students found</p>';
    return;
  }

  /**
   * Genera tabla con datos
   * .map() itera sobre cada estudiante
   * Template literals ${} interpolan valores
   * .join('') une todo en un string
   */
  container.innerHTML = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>PROPERTIES</th>
          <th>COUNTERPARTIES</th>
          <th>DATE</th>
        </tr>
      </thead>
      <tbody>
        ${students.map(student => `
          <tr>
            <td>
              <div class="table-user">
                <img src="${student.avatar}" alt="${student.name}" class="table-user-avatar">
                <span class="table-user-name">${student.name}</span>
              </div>
            </td>
            <td>${student.email}</td>
            <td>${student.properties}</td>
            <td>${student.counterparties}</td>
            <td>${student.date}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
