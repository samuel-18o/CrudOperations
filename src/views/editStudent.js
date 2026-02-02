/**
 * ============================================
 * ARCHIVO: editStudent.js
 * DESCRIPCIÓN: Vista de Edición de Estudiante (UPDATE)
 * ============================================
 * 
 * Formulario para editar estudiante existente.
 * Ruta protegida: Solo accesible para administradores.
 * 
 * FLUJO:
 * 1. Extrae ID de query params (?id=5)
 * 2. loadStudent(id) → GET /students/:id
 * 3. renderEditForm() pre-llena formulario con datos actuales
 * 4. Usuario modifica campos
 * 5. Submit → handleEditStudent
 * 6. apiService.updateStudent() → PUT /students/:id
 * 7. Redirige a /students
 * 
 * QUERY PARAMS:
 * - URLSearchParams extrae parámetros de la URL
 * - window.location.hash.split('?')[1] obtiene query string
 * - .get('id') extrae el valor del parámetro id
 * 
 * TEMAS:
 * ✅ CRUD - Read (GET) y Update (PUT)
 * ✅ Rutas dinámicas - Query params
 * ✅ Manipulación DOM - Pre-llenado de formulario
 * ✅ Manejo errores - try-catch
 */

import Sidebar from '../components/Sidebar.js';
import { apiService } from '../services/apiService.js';

export default function EditStudentView() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const studentId = urlParams.get('id');

  setTimeout(async () => {
    await loadStudent(studentId);
    const form = document.getElementById('editStudentForm');
    form?.addEventListener('submit', (e) => handleEditStudent(e, studentId));
  }, 0);

  return `
    ${Sidebar()}
    <div class="main-content fade-in">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Edit Student</h2>
        </div>

        <div id="editFormContainer">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  `;
}

async function loadStudent(id) {
  try {
    const student = await apiService.getStudent(id);
    renderEditForm(student);
  } catch (error) {
    console.error('Error loading student:', error);
    document.getElementById('editFormContainer').innerHTML = 
      '<p class="text-center text-danger">Error loading student data</p>';
  }
}

function renderEditForm(student) {
  document.getElementById('editFormContainer').innerHTML = `
    <form id="editStudentForm">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="${student.name}" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" class="form-control" value="${student.email}" required>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Properties</label>
            <input type="text" name="properties" class="form-control" value="${student.properties}" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>Counterparties</label>
            <input type="text" name="counterparties" class="form-control" value="${student.counterparties}" required>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Date</label>
            <input type="text" name="date" class="form-control" value="${student.date}" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>Avatar URL</label>
            <input type="text" name="avatar" class="form-control" value="${student.avatar}" required>
          </div>
        </div>
      </div>

      <div class="form-group">
        <button type="submit" class="btn-submit">Update Student</button>
      </div>
    </form>
  `;
}

/**
 * VALIDACIÓN DE EMAIL ÚNICO EN EDICIÓN
 * 
 * Al editar, verifica que el nuevo email no esté en uso,
 * excluyendo el email actual del estudiante que se está editando.
 * 
 * FLUJO:
 * 1. Obtiene todos los estudiantes y usuarios
 * 2. Filtra estudiantes excluyendo el que se está editando
 * 3. Verifica si el nuevo email ya existe
 * 4. Si existe, muestra error y cancela
 * 5. Si no existe, procede con la actualización
 * 
 * TEMA: ✅ Validaciones - Prevención de duplicados en UPDATE
 */
async function handleEditStudent(e, id) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const studentData = {
    name: formData.get('name'),
    email: formData.get('email'),
    properties: formData.get('properties'),
    counterparties: formData.get('counterparties'),
    date: formData.get('date'),
    avatar: formData.get('avatar')
  };

  try {
    // ===============================================
    // VALIDACIÓN: Email único entre estudiantes
    // ===============================================
    // Obtiene todos los estudiantes
    const existingStudents = await apiService.getStudents();
    
    // Verifica si el email ya existe en OTRO estudiante (excluyendo el actual)
    const emailExists = existingStudents.some(
      student => student.id !== id && 
                 student.email.toLowerCase() === studentData.email.toLowerCase()
    );
    
    if (emailExists) {
      alert('Error: El correo electrónico ya está en uso por otro estudiante. Por favor, usa otro email.');
      return; // Cancela la operación
    }

    // ===============================================
    // VALIDACIÓN OPCIONAL: Email único entre usuarios
    // ===============================================
    // Verifica que el email no pertenezca a un usuario registrado
    const existingUsers = await apiService.get('/users');
    const emailExistsInUsers = existingUsers.some(
      user => user.email.toLowerCase() === studentData.email.toLowerCase()
    );
    
    if (emailExistsInUsers) {
      alert('Error: El correo electrónico pertenece a un usuario registrado. Por favor, usa otro email.');
      return; // Cancela la operación
    }

    // Si pasa todas las validaciones, actualiza el estudiante
    await apiService.updateStudent(id, studentData);
    alert('Student updated successfully!');
    window.location.hash = '#/students';
  } catch (error) {
    alert('Error updating student');
    console.error(error);
  }
}
