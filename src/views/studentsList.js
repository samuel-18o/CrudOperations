/**
 * ============================================
 * ARCHIVO: studentsList.js
 * DESCRIPCIÓN: Vista de Lista de Estudiantes con CRUD
 * ============================================
 * 
 * Muestra tabla completa de estudiantes con operaciones:
 * - READ: Consultar todos los estudiantes
 * - UPDATE: Botón editar (solo admin)
 * - DELETE: Botón eliminar (solo admin)
 * 
 * CONTROL DE ACCESO POR ROL:
 * - Admin: Ve botones Editar y Eliminar + botón "Add Student"
 * - User: Solo ve la lista (sin botones de acción)
 * 
 * FUNCIONES GLOBALES:
 * - editStudent(id): Navega a vista de edición
 * - deleteStudent(id): Elimina con confirmación
 * 
 * TEMAS:
 * ✅ CRUD - Read (GET) y Delete
 * ✅ Gestión de roles - Renderizado condicional según isAdmin()
 * ✅ Manejo de errores - try-catch con mensajes
 */

import Sidebar from '../components/Sidebar.js';
import { apiService } from '../services/apiService.js';
import { authService } from '../services/authService.js';

export default function StudentsListView() {
  setTimeout(async () => {
    await loadStudents();
  }, 0);

  const isAdmin = authService.isAdmin();

  return `
    ${Sidebar()}
    <div class="main-content fade-in">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Students List</h2>
          ${isAdmin ? '<a href="#/students/create" class="btn-add"><i class="bi bi-plus-circle"></i> Add Student</a>' : ''}
        </div>

        <div id="studentsTableContainer">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  `;
}

async function loadStudents() {
  try {
    const students = await apiService.getStudents();
    renderStudentsTable(students);
  } catch (error) {
    console.error('Error loading students:', error);
    document.getElementById('studentsTableContainer').innerHTML = 
      '<p class="text-center text-danger">Error loading students</p>';
  }
}

function renderStudentsTable(students) {
  const container = document.getElementById('studentsTableContainer');
  const isAdmin = authService.isAdmin();

  if (students.length === 0) {
    container.innerHTML = '<p class="text-center">No students found</p>';
    return;
  }

  container.innerHTML = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>PROPERTIES</th>
          <th>COUNTERPARTIES</th>
          <th>DATE</th>
          ${isAdmin ? '<th>ACTIONS</th>' : ''}
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
            ${isAdmin ? `
              <td>
                <div class="table-actions">
                  <button class="btn-icon edit" onclick="editStudent('${student.id}')">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn-icon delete" onclick="deleteStudent('${student.id}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            ` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

window.editStudent = (id) => {
  window.location.hash = `#/students/edit?id=${id}`;
};

window.deleteStudent = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;

  try {
    await apiService.deleteStudent(id);
    await loadStudents();
    alert('Estudiante eliminado correctamente');
  } catch (error) {
    alert('Error al eliminar estudiante');
  }
};
