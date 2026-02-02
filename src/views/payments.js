/**
 * ============================================
 * ARCHIVO: payments.js
 * DESCRIPCIÓN: Vista de Detalles de Pagos
 * ============================================
 * 
 * Muestra lista de todos los pagos registrados en formato tabla.
 * Vista protegida, requiere autenticación.
 * 
 * CARACTERÍSTICAS:
 * - Lista de pagos desde API
 * - Tabla con columnas: Entity, Type, Properties, Date, Amount
 * - Incluye Sidebar de navegación
 * - Loader mientras carga datos
 * - Manejo de errores con try-catch
 * 
 * OPERACIONES:
 * - READ (GET) - Consultar pagos
 * - No implementa CREATE/UPDATE/DELETE en esta vista
 */

import Sidebar from '../components/Sidebar.js';
import { apiService } from '../services/apiService.js';

export default function PaymentsView() {
  /**
   * setTimeout para cargar datos después del render
   * Llama a loadPayments() que obtiene datos de la API
   */
  setTimeout(async () => {
    await loadPayments();
  }, 0);

  return `
    ${Sidebar()}
    <div class="main-content fade-in">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Payment Details</h2>
        </div>

        <!-- Contenedor de la tabla, inicialmente muestra loader -->
        <div id="paymentsTableContainer">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * FUNCIÓN: loadPayments
 * 
 * PROPÓSITO:
 * Obtener pagos de la API y renderizar tabla
 * 
 * FLUJO:
 * 1. Llama apiService.getPayments()
 * 2. Si exitoso → renderiza tabla con renderPaymentsTable()
 * 3. Si error → muestra mensaje de error
 * 
 * MANEJO DE ERRORES:
 * - try-catch captura errores de red/API
 * - Muestra mensaje descriptivo al usuario
 */
async function loadPayments() {
  try {
    // GET /payments desde json-server
    const payments = await apiService.getPayments();
    
    // Renderiza tabla con los datos
    renderPaymentsTable(payments);
    
  } catch (error) {
    console.error('Error loading payments:', error);
    
    // Muestra mensaje de error al usuario
    document.getElementById('paymentsTableContainer').innerHTML = 
      '<p class="text-center text-danger">Error loading payments</p>';
  }
}

/**
 * FUNCIÓN: renderPaymentsTable
 * 
 * PROPÓSITO:
 * Generar HTML de la tabla de pagos
 * 
 * PARÁMETROS:
 * @param {Array} payments - Array de objetos pago
 * 
 * ESTRUCTURA DE PAGO:
 * {
 *   id: '1',
 *   entity: 'Karish',
 *   type: 'Fees',
 *   properties: 'PROPERTIES',
 *   date: '06 Dec 2021',
 *   amount: 'AED 50,000'
 * }
 * 
 * MANIPULACIÓN DEL DOM:
 * - Construye tabla con .map() y template literals
 * - .join('') convierte array a string HTML
 * - innerHTML inserta en contenedor
 */
function renderPaymentsTable(payments) {
  const container = document.getElementById('paymentsTableContainer');

  // Si no hay pagos, muestra mensaje
  if (payments.length === 0) {
    container.innerHTML = '<p class="text-center">No payments found</p>';
    return;
  }

  /**
   * Genera HTML de tabla
   * 
   * .map(): Itera sobre payments, genera HTML por cada uno
   * .join(''): Une array de strings en un solo string
   * Template literals: ${} interpola valores
   */
  container.innerHTML = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>ENTITY</th>
          <th>TYPE</th>
          <th>PROPERTIES</th>
          <th>DATE</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map(payment => `
          <tr>
            <td>${payment.entity}</td>
            <td>${payment.type}</td>
            <td>${payment.properties}</td>
            <td>${payment.date}</td>
            <td><strong>${payment.amount}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * TEMAS IMPLEMENTADOS:
 * ✅ Consumo de APIs - GET payments con apiService
 * ✅ Manipulación del DOM - Renderizado dinámico de tabla
 * ✅ Manejo de errores - try-catch, mensajes descriptivos
 * ✅ Promesas - async/await para operaciones asíncronas
 * ✅ Buenas prácticas - Código documentado, funciones específicas
 */
