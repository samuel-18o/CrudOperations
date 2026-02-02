# 🎯 CRUD Operations - Sistema de Gestión SPA

Aplicación de página única (SPA) para la gestión de estudiantes y pagos con operaciones CRUD completas.

## 📋 Descripción

Sistema moderno de gestión con diseño inspirado en interfaces profesionales, que permite administrar estudiantes, visualizar pagos y gestionar usuarios con diferentes roles de acceso.

## 🚀 Características Principales

### ✨ Sistema de Autenticación
- Login y registro de usuarios
- Roles diferenciados (Admin/Usuario)
- Persistencia de sesión con localStorage
- Protección de rutas según permisos

### 👥 Gestión de Estudiantes
- **Administradores:**
  - ✅ Crear nuevos estudiantes
  - ✅ Editar información de estudiantes
  - ✅ Eliminar estudiantes
  - ✅ Ver lista completa
  
- **Usuarios:**
  - ✅ Consultar lista de estudiantes
  - ✅ Ver detalles

### 💳 Sistema de Pagos
- Visualización de detalles de pagos
- Tabla organizada con información completa
- Totales calculados automáticamente

### 📊 Dashboard Interactivo
- Estadísticas en tiempo real
- Tarjetas con métricas clave
- Vista general del sistema
- Tabla de estudiantes recientes

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+ (Vanilla)
- **Backend Mock:** json-server
- **Estilos:** Bootstrap 5 + CSS personalizado
- **Iconos:** Bootstrap Icons
- **Arquitectura:** SPA con módulos ES6

## 📂 Estructura del Proyecto

```
CRUD-Operations-SPA/
├── index.html                  # Punto de entrada
├── styles.css                  # Estilos globales
├── db.json                     # Base de datos JSON
└── src/
    ├── app.js                  # Inicializador principal
    ├── components/             # Componentes reutilizables
    │   ├── Sidebar.js          # Barra lateral de navegación
    │   └── Modal.js            # Componente modal
    ├── views/                  # Vistas/Páginas
    │   ├── login.js            # Página de inicio de sesión
    │   ├── register.js         # Página de registro
    │   ├── dashboard.js        # Dashboard principal
    │   ├── studentsList.js     # Lista de estudiantes
    │   ├── payments.js         # Vista de pagos
    │   ├── createStudent.js    # Formulario de creación
    │   ├── editStudent.js      # Formulario de edición
    │   └── notFound.js         # Página 403
    ├── router/                 # Sistema de enrutamiento
    │   └── router.js           # Router con guardián
    ├── state/                  # Gestión de estado
    │   └── store.js            # Store global
    └── services/               # Servicios API
        ├── authService.js      # Autenticación
        └── apiService.js       # Peticiones HTTP
```

## 🎯 Requisitos Previos

- Node.js (v14 o superior)
- npm (viene con Node.js)

## ⚙️ Instalación y Ejecución

### 1. Instalar json-server

```bash
npm install -g json-server
```

### 2. Iniciar el Backend

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
json-server --watch db.json --port 3000
```

Deberías ver un mensaje como:
```
Resources
http://localhost:3000/users
http://localhost:3000/students
http://localhost:3000/payments

Home
http://localhost:3000
```

### 3. Iniciar el Frontend

**Opción A: Con Live Server (VS Code)**
1. Instala la extensión "Live Server" en VS Code
2. Clic derecho en `index.html` → "Open with Live Server"
3. Se abrirá en `http://127.0.0.1:5500`

**Opción B: Con otro servidor local**
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000
```

**⚠️ Importante:** No abras el archivo HTML directamente en el navegador debido a las restricciones CORS de los módulos ES6.

## 👤 Usuarios de Prueba

### Administrador
- **Email:** admin@crudops.com
- **Password:** admin123
- **Permisos:** Acceso completo al sistema

### Usuario Normal
- **Email:** user@crudops.com
- **Password:** user123
- **Permisos:** Solo lectura

## 🗺️ Rutas Disponibles

| Ruta | Descripción | Protección |
|------|-------------|------------|
| `/` o `/login` | Inicio de sesión | Pública |
| `/register` | Registro de usuarios | Pública |
| `/dashboard` | Dashboard principal | Requiere autenticación |
| `/students` | Lista de estudiantes | Requiere autenticación |
| `/payments` | Detalles de pagos | Requiere autenticación |
| `/students/create` | Crear estudiante | Solo administradores |
| `/students/edit?id=X` | Editar estudiante | Solo administradores |
| `/not-found` | Acceso denegado | Siempre accesible |

## 📡 Endpoints API (json-server)

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users?email=X&password=Y` - Login
- `POST /users` - Crear usuario

### Estudiantes
- `GET /students` - Listar estudiantes
- `GET /students/:id` - Obtener estudiante
- `POST /students` - Crear estudiante
- `PUT /students/:id` - Actualizar estudiante
- `DELETE /students/:id` - Eliminar estudiante

### Pagos
- `GET /payments` - Listar pagos
- `POST /payments` - Crear pago
- `DELETE /payments/:id` - Eliminar pago

## 🎨 Características de Diseño

- ✅ Diseño responsive (mobile-first)
- ✅ Sidebar fijo con navegación intuitiva
- ✅ Colores corporativos (amarillo #FDB913)
- ✅ Animaciones suaves y transiciones
- ✅ Iconografía moderna con Bootstrap Icons
- ✅ Tablas personalizadas con hover effects
- ✅ Formularios estilizados
- ✅ Sistema de alertas y notificaciones

## 🔄 Flujo de la Aplicación

1. **Carga Inicial:**
   - Se carga `index.html`
   - Se ejecuta `app.js`
   - Se inicializa el Store (recupera sesión)
   - Se inicia el Router

2. **Autenticación:**
   - Usuario ingresa a `/login`
   - Credenciales se validan contra la API
   - Se guarda sesión en localStorage y Store
   - Se redirige a `/dashboard`
   - Se renderiza el Sidebar

3. **Navegación:**
   - Router escucha cambios en el hash
   - Guardián valida permisos
   - Se renderiza la vista correspondiente
   - Sidebar se mantiene visible

4. **Operaciones CRUD:**
   - Vistas usan `apiService.js`
   - Peticiones HTTP a json-server
   - UI se actualiza dinámicamente

## 🔐 Sistema de Permisos

### Administrador (Admin)
- Acceso total al sistema
- Puede crear, editar y eliminar estudiantes
- Visualiza todas las estadísticas
- Gestiona usuarios

### Usuario (User)
- Solo lectura de estudiantes
- Visualiza pagos
- No puede modificar datos

## 💡 Características Técnicas

- ✅ SPA 100% funcional sin frameworks
- ✅ Módulos ES6 para mejor organización
- ✅ Router personalizado con hash navigation
- ✅ Store centralizado para estado global
- ✅ Persistencia con localStorage
- ✅ Componentes reutilizables
- ✅ Separación de responsabilidades
- ✅ Código limpio y documentado
- ✅ Manejo de errores
- ✅ Validación de formularios

## 🎓 Conceptos Aplicados

- **Arquitectura SPA:** Single Page Application
- **Patrón de diseño:** MVC (Model-View-Controller)
- **Estado global:** Centralizado con Store
- **Routing:** Basado en hash con guardián
- **Modularización:** ES6 Modules
- **API REST:** Comunicación con json-server
- **Autenticación:** JWT-like con localStorage
- **Autorización:** Control de acceso basado en roles

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verifica que json-server esté instalado
json-server --version

# Reinstala si es necesario
npm install -g json-server
```

### Error de CORS
Asegúrate de abrir el proyecto con un servidor local (Live Server, http-server, etc.) y no directamente desde el sistema de archivos.

### No se guardan los datos
json-server guarda automáticamente en `db.json`. Verifica que el servidor esté corriendo en el puerto 3000.

### Sesión no persiste
Verifica que localStorage esté habilitado en tu navegador y no estés en modo incógnito.

## 📝 Notas de Desarrollo

- Los IDs se generan automáticamente con json-server
- Los avatares usan el servicio pravatar.cc
- Las fechas están en formato "DD MMM, YYYY"
- Los montos están en AED (Dirham de Emiratos Árabes)

## 🚀 Mejoras Futuras

- [ ] Implementar búsqueda y filtros
- [ ] Añadir paginación
- [ ] Sistema de notificaciones toast
- [ ] Exportar datos a PDF/Excel
- [ ] Dashboard con gráficos
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

## 👨‍💻 Autor

Desarrollado como proyecto de aprendizaje de arquitectura SPA con Vanilla JavaScript.

---

**¡Disfruta del proyecto! 🎉**

Para cualquier duda o sugerencia, no dudes en abrir un issue en el repositorio.
