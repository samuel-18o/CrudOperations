# 📋 Checklist de Sustentación - CRUD Operations SPA

## ✅ Preparación Pre-Sustentación

### Entorno de Ejecución
- [ ] json-server corriendo en http://localhost:3000
- [ ] Aplicación corriendo en Live Server (puerto 5500)
- [ ] Browser DevTools abierto (Console + Network tabs)
- [ ] db.json visible con datos de ejemplo

### Usuarios de Prueba Listos
- [ ] Admin: admin@crudops.com / admin123
- [ ] User: user@crudops.com / user123

### Archivos para Mostrar
- [ ] src/app.js - Punto de entrada
- [ ] src/router/router.js - Sistema de rutas
- [ ] src/state/store.js - Gestión de estado
- [ ] src/services/apiService.js - Consumo API
- [ ] src/services/authService.js - Autenticación
- [ ] db.json - Base de datos simulada

---

## 🎯 Temas a Demostrar (Orden Sugerido)

### 1. Introducción (2-3 min)
**Qué mostrar:**
- [ ] Arquitectura general del proyecto (estructura de carpetas)
- [ ] Tecnologías utilizadas (Vanilla JS, json-server, Bootstrap)
- [ ] Patrón SPA sin frameworks

**Qué decir:**
> "He desarrollado una SPA completa usando Vanilla JavaScript que implementa autenticación, roles de usuario, rutas protegidas y operaciones CRUD completas sobre una API REST simulada con json-server."

### 2. Autenticación y Gestión de Roles (5-7 min)
**Demostración en vivo:**
- [ ] Mostrar página de login
- [ ] Login como admin → Redirige a dashboard
- [ ] Mostrar Sidebar con opción "Create" visible
- [ ] Logout
- [ ] Login como user → Redirige a dashboard
- [ ] Mostrar que "Create" no está visible
- [ ] Intentar acceder manualmente a #/students/create
- [ ] Mostrar que redirige a /not-found (403)

**Código a explicar:**
```javascript
// authService.js
async login(email, password) {
  // Verificación de credenciales
  // Guardado en Store + localStorage
}

isAdmin() {
  // Verificación de rol
}

// router.js - Route Guards
if (adminRoutes.includes(path) && !authService.isAdmin()) {
  window.location.hash = '#/not-found';
  return;
}
```

**Puntos clave:**
- [ ] ✅ Persistencia con localStorage
- [ ] ✅ Route Guards implementados
- [ ] ✅ Roles diferenciados (admin/user)
- [ ] ✅ Validación de email único en registro

### 3. Persistencia de Datos con localStorage (3-5 min)
**Demostración en vivo:**
- [ ] Login como admin
- [ ] Abrir DevTools → Application → Local Storage
- [ ] Mostrar `currentUser` guardado en JSON
- [ ] Recargar página (F5)
- [ ] Mostrar que sigue autenticado
- [ ] Cerrar pestaña, abrir nueva
- [ ] Navegar a localhost:5500
- [ ] Mostrar que la sesión persiste

**Código a explicar:**
```javascript
// store.js
init() {
  // Recupera sesión de localStorage
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    this.state.user = JSON.parse(savedUser);
  }
}

setUser(user) {
  // Guarda en memoria Y en localStorage
  this.state.user = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
}
```

**Puntos clave:**
- [ ] ✅ Sincronización bidireccional
- [ ] ✅ Persistencia entre recargas
- [ ] ✅ Store Pattern implementado

### 4. Sistema de Rutas Dinámicas (4-6 min)
**Demostración en vivo:**
- [ ] Navegar entre páginas sin recargas
- [ ] Mostrar en DevTools → Network que no hay recargas
- [ ] Cambiar hash manualmente en URL
- [ ] Mostrar que renderiza la vista correspondiente
- [ ] Intentar acceder a ruta protegida sin login
- [ ] Mostrar redirección automática

**Código a explicar:**
```javascript
// router.js
init() {
  // Event listeners para hashchange y load
  window.addEventListener('hashchange', () => this.handleRoute());
  window.addEventListener('load', () => this.handleRoute());
}

handleRoute() {
  // Extrae ruta del hash
  // Verifica autenticación
  // Verifica permisos
  // Renderiza vista
}
```

**Puntos clave:**
- [ ] ✅ Hash-based routing
- [ ] ✅ No recargas de página
- [ ] ✅ Route Guards integrados
- [ ] ✅ Redirecciones automáticas

### 5. Consumo de API con Fetch (5-7 min)
**Demostración en vivo:**
- [ ] Abrir DevTools → Network
- [ ] Navegar a Students
- [ ] Mostrar petición GET /students
- [ ] Ver respuesta JSON
- [ ] Crear nuevo estudiante
- [ ] Mostrar petición POST /students con payload
- [ ] Editar estudiante
- [ ] Mostrar petición PUT /students/:id
- [ ] Eliminar estudiante
- [ ] Mostrar petición DELETE /students/:id

**Código a explicar:**
```javascript
// apiService.js
async get(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('Error fetching data');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Métodos POST, PUT, DELETE similares
```

**Puntos clave:**
- [ ] ✅ Fetch API con async/await
- [ ] ✅ try-catch para manejo de errores
- [ ] ✅ Verificación de response.ok
- [ ] ✅ Métodos HTTP: GET, POST, PUT, DELETE

### 6. Operaciones CRUD Completas (6-8 min)
**Demostración en vivo:**
- [ ] **CREATE:** Crear nuevo estudiante
  - Llenar formulario
  - Submit → POST /students
  - Mostrar en lista
  - Ver en db.json que se agregó
  
- [ ] **READ:** Ver lista de estudiantes
  - Mostrar tabla completa
  - Ver en Network la petición GET
  
- [ ] **UPDATE:** Editar estudiante existente
  - Clic en Edit → Navega a /students/edit?id=X
  - Formulario pre-llenado con datos actuales
  - Modificar campos
  - Submit → PUT /students/:id
  - Ver cambios en lista
  
- [ ] **DELETE:** Eliminar estudiante
  - Clic en Delete
  - Confirmar en alert
  - DELETE /students/:id
  - Desaparece de lista

**Código a explicar:**
```javascript
// createStudent.js
const studentData = {
  name: formData.get('name'),
  email: formData.get('email'),
  // ...
};
await apiService.createStudent(studentData); // POST

// studentsList.js
const students = await apiService.getStudents(); // GET

// editStudent.js
await apiService.updateStudent(id, studentData); // PUT

// studentsList.js
await apiService.deleteStudent(id); // DELETE
```

**Puntos clave:**
- [ ] ✅ CRUD completo implementado
- [ ] ✅ FormData API para extraer datos
- [ ] ✅ Query params para edición
- [ ] ✅ Confirmaciones antes de eliminar

### 7. Validaciones y Manejo de Errores (4-5 min)
**Demostración en vivo:**
- [ ] **HTML5 Validation:**
  - Intentar submit sin llenar campos → Muestra errores
  - Intentar email inválido → Muestra error
  
- [ ] **Email único:**
  - Intentar registrar email existente
  - Mostrar mensaje "El email ya está registrado"
  
- [ ] **Credenciales inválidas:**
  - Login con contraseña incorrecta
  - Mostrar mensaje "Credenciales inválidas"
  
- [ ] **Error de red:**
  - Detener json-server
  - Intentar cargar students
  - Mostrar mensaje de error

**Código a explicar:**
```javascript
// HTML5
<input type="email" required>

// authService.js
const existingUsers = await apiService.get(`/users?email=${email}`);
if (existingUsers.length > 0) {
  return { success: false, message: 'El email ya está registrado' };
}

// apiService.js
try {
  // petición
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

**Puntos clave:**
- [ ] ✅ Validación en múltiples niveles
- [ ] ✅ try-catch consistente
- [ ] ✅ Mensajes descriptivos
- [ ] ✅ Manejo de errores de red

### 8. Manipulación Avanzada del DOM (4-5 min)
**Código a explicar:**
```javascript
// Sidebar.js - Template literals e interpolación
return `
  <div class="sidebar">
    <img src="https://i.pravatar.cc/150?u=${user.email}">
    <div>${user.name}</div>
    ${user.role === 'admin' ? `<button>Admin Only</button>` : ''}
  </div>
`;

// Modal.js - Inserción dinámica
document.body.insertAdjacentHTML('beforeend', modalHTML);
setTimeout(() => {
  document.getElementById(this.modalId).classList.add('active');
}, 10);

// dashboard.js - Renderizado de tabla
container.innerHTML = `
  <table>
    ${students.map(s => `<tr><td>${s.name}</td></tr>`).join('')}
  </table>
`;
```

**Demostración en vivo:**
- [ ] Mostrar Sidebar con renderizado condicional
- [ ] Abrir modal (si se implementa)
- [ ] Ver tabla generada dinámicamente

**Puntos clave:**
- [ ] ✅ Template literals
- [ ] ✅ Interpolación con ${}
- [ ] ✅ Renderizado condicional
- [ ] ✅ .map() y .join() para listas
- [ ] ✅ classList para animaciones

### 9. Buenas Prácticas (3-4 min)
**Mostrar estructura:**
```
src/
├── app.js           ← Punto de entrada
├── router/          ← Navegación
├── state/           ← Estado global
├── services/        ← Lógica de negocio
├── components/      ← Componentes reutilizables
└── views/           ← Vistas/Páginas
```

**Código a mencionar:**
- [ ] Separación de responsabilidades (MVC)
- [ ] ES6 Modules (import/export)
- [ ] Nombres descriptivos (camelCase)
- [ ] Funciones con propósito único
- [ ] DRY (Don't Repeat Yourself)
- [ ] Comentarios exhaustivos

**Puntos clave:**
- [ ] ✅ Arquitectura modular
- [ ] ✅ Código limpio y legible
- [ ] ✅ Documentación completa
- [ ] ✅ Patrones de diseño aplicados

---

## 🗣️ Preguntas Frecuentes Anticipadas

### "¿Por qué usaste hash-based routing?"
> "Porque no requiere configuración de servidor, funciona en cualquier hosting estático y es compatible con navegadores antiguos. En producción con servidor Node.js, usaría HTML5 History API (pushState)."

### "¿Por qué localStorage y no sessionStorage?"
> "localStorage persiste indefinidamente, permitiendo que el usuario no tenga que iniciar sesión cada vez. sessionStorage se borraría al cerrar la pestaña. En producción implementaría tokens JWT con expiración."

### "¿Por qué Vanilla JS y no un framework?"
> "Para demostrar conocimiento profundo de JavaScript puro, manipulación del DOM, y cómo funcionan los frameworks por dentro. También es más ligero para proyectos pequeños."

### "¿Cómo manejas la seguridad?"
> "Esta es una implementación de aprendizaje. En producción implementaría: HTTPS, hash de contraseñas (bcrypt), tokens JWT, validación en servidor, rate limiting, CORS adecuado y protección CSRF."

### "¿Por qué Promise.all() en dashboard?"
> "Para hacer peticiones en paralelo en lugar de secuenciales, reduciendo el tiempo de carga. Si una falla, todas fallan (fail-fast), pero para casos independientes se puede usar Promise.allSettled()."

### "¿Cómo escalas esto a un proyecto grande?"
> "Implementaría: TypeScript para types, bundler (Webpack/Vite), testing (Jest/Vitest), linter (ESLint), state management más robusto (Redux/Zustand), y consideraría migrar a React/Vue para componentes reactivos."

---

## 📊 Estadísticas para Mencionar

- **Líneas de código:** ~1,500 líneas de código funcional
- **Líneas de documentación:** ~3,500 líneas de comentarios
- **Archivos:** 15 archivos JavaScript documentados al 100%
- **Cobertura de temas:** 8/8 requisitos (100%)
- **Patrones implementados:** 4 (Store, Service, Component, Route Guards)

---

## ⏱️ Timeboxing Sugerido

| Sección | Tiempo | Acumulado |
|---------|--------|-----------|
| Introducción | 3 min | 3 min |
| Autenticación y Roles | 7 min | 10 min |
| Persistencia localStorage | 5 min | 15 min |
| Rutas Dinámicas | 6 min | 21 min |
| Consumo de API | 7 min | 28 min |
| CRUD Completo | 8 min | 36 min |
| Validaciones y Errores | 5 min | 41 min |
| Manipulación DOM | 5 min | 46 min |
| Buenas Prácticas | 4 min | 50 min |
| Preguntas | 10 min | 60 min |

**Total:** ~60 minutos (ajustar según tiempo asignado)

---

## ✅ Checklist Final Pre-Sustentación

- [ ] Código sin errores en consola
- [ ] json-server funcionando
- [ ] Live Server funcionando
- [ ] db.json con datos de ejemplo
- [ ] DevTools abierto y listo
- [ ] Usuarios de prueba memorizados
- [ ] Archivos principales identificados
- [ ] Estructura del proyecto clara
- [ ] README.md revisado
- [ ] Confianza en explicación de cada parte

---

## 🎯 Mensaje Final

**Recuerda:** Has implementado y documentado exhaustivamente un proyecto completo que cumple con TODOS los requisitos. Conoces cada línea de código, cada decisión de diseño y cada concepto implementado.

**Confianza:** Tienes documentación de respaldo para cualquier pregunta. Si no recuerdas algo, sabes dónde está documentado.

**Actitud:** Profesional, seguro, pero humilde. Si no sabes algo, está bien decir "No lo implementé aquí, pero lo haría así..."

---

**¡ÉXITO EN TU SUSTENTACIÓN! 🚀**
