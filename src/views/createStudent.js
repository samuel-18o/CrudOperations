/**
 * ============================================
 * ARCHIVO: createStudent.js
 * DESCRIPCIÓN: Vista de Creación de Estudiante (CREATE)
 * ============================================
 * 
 * Formulario para crear nuevo estudiante.
 * Ruta protegida: Solo accesible para administradores.
 * 
 * CAMPOS DEL FORMULARIO:
 * - name: Nombre completo
 * - email: Correo electrónico
 * - properties: Propiedades
 * - counterparties: Contrapartes
 * - date: Fecha
 * - avatar: URL del avatar
 * 
 * FLUJO:
 * 1. Usuario completa formulario
 * 2. Submit → handleCreateStudent
 * 3. FormData extrae valores
 * 4. apiService.createStudent() → POST /students
 * 5. json-server asigna ID automáticamente
 * 6. Redirige a /students
 * 
 * TEMAS:
 * ✅ CRUD - Create (POST)
 * ✅ Validaciones - HTML5 required
 * ✅ Manipulación DOM - FormData API
 * ✅ Manejo errores - try-catch
 */

import Sidebar from '../components/Sidebar.js';
import { apiService } from '../services/apiService.js';

export default function CreateStudentView() {
  setTimeout(() => {
    const form = document.getElementById('createStudentForm');
    form?.addEventListener('submit', handleCreateStudent);
  }, 0);

  return `
    ${Sidebar()}
    <div class="main-content fade-in">
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Create New Student</h2>
        </div>

        <form id="createStudentForm">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" class="form-control" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Properties</label>
                <input type="text" name="properties" class="form-control" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Counterparties</label>
                <input type="text" name="counterparties" class="form-control" required>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Date</label>
                <input type="text" name="date" class="form-control" value="06 Dec, 2021" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Avatar URL</label>
                <input type="text" name="avatar" class="form-control" value="https://i.pravatar.cc/150" required>
              </div>
            </div>
          </div>

          <div class="form-group">
            <button type="submit" class="btn-submit">Create Student</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * VALIDACIÓN DE EMAIL ÚNICO
 * 
 * Verifica que el email no exista en:
 * 1. Base de datos de estudiantes
 * 2. Base de datos de usuarios
 * 
 * FLUJO:
 * 1. Obtiene todos los estudiantes y usuarios
 * 2. Verifica si el email ya existe
 * 3. Si existe, muestra error y cancela operación
 * 4. Si no existe, procede a crear el estudiante
 * 
 * TEMA: ✅ Validaciones - Prevención de duplicados
 */
async function handleCreateStudent(e) {
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
    // Obtiene todos los estudiantes para verificar duplicados
    const existingStudents = await apiService.getStudents();
    
    // Verifica si el email ya existe en la base de datos de estudiantes
    const emailExists = existingStudents.some(
      student => student.email.toLowerCase() === studentData.email.toLowerCase()
    );
    
    if (emailExists) {
      alert('Error: El correo electrónico ya está registrado. Por favor, usa otro email.');
      return; // Cancela la operación
    }

    // ===============================================
    // VALIDACIÓN OPCIONAL: Email único entre usuarios
    // ===============================================
    // También verifica que el email no pertenezca a un usuario registrado
    const existingUsers = await apiService.get('/users');
    const emailExistsInUsers = existingUsers.some(
      user => user.email.toLowerCase() === studentData.email.toLowerCase()
    );
    
    if (emailExistsInUsers) {
      alert('Error: El correo electrónico pertenece a un usuario registrado. Por favor, usa otro email.');
      return; // Cancela la operación
    }

    // Si pasa todas las validaciones, crea el estudiante
    await apiService.createStudent(studentData);
    alert('Student created successfully!');
    window.location.hash = '#/students';
  } catch (error) {
    alert('Error creating student');
    console.error(error);
  }
}
