# InfraDraw

¡Bienvenido a **InfraDraw**!  
Una aplicación web moderna para crear, visualizar y editar diagramas de arquitectura de software de manera colaborativa y sencilla.

---

## 🚀 Características principales

- **Editor visual de diagramas**: Arrastra y suelta componentes, zonas y cajas de texto.
- **Soporte para relaciones personalizadas** entre componentes.
- **Biblioteca de componentes** reutilizables y buscables.
- **Sidebar interactivo** con herramientas y configuración del tablero.
- **Notificaciones y toasts** personalizables.
- **Estadísticas de uso** y tableros recientes.
- **Integración con React Flow** para una experiencia fluida y potente.
- **Editor en linea de JSON y visualización** para mejorar la comprension de los datos.
- **Estilos modernos** con TailwindCSS y shadcn/ui.

---

## 🛠️ Tecnologías utilizadas

- **React 18** + **TypeScript**
- **Vite** para desarrollo ultrarrápido
- **@xyflow/react** (React Flow) para diagramas
- **TailwindCSS** y **shadcn/ui** para UI
- **Radix UI** para componentes accesibles
- **Sonner** y sistema propio de toasts
- **Docker** para despliegue sencillo

---

## 📦 Instalación y ejecución

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/Paulo-Ariel-Pareja/InfraDraw-frontend
   cd infradraw-frontend
    ```
2. **Instala las dependencias:**
    ```sh
    npm install
    ```
3. **Inicia el entorno de desarrollo:**
    ```sh
    VITE_PORT=8080 #opcional, por defecto inicia en el puerto 8080
    VITE_API_URL=http://localhost:3000/api
    VITE_USER_ADMIN=admin
    VITE_USER_PASSWORD=ESTEES
    ```
4. **Clona, configura y ejecuta el backend**
   ```sh
    https://github.com/Paulo-Ariel-Pareja/InfraDraw-backend
    ```
5. **Accede a la app:**
    ```sh
    Abre http://localhost:8080 en tu navegador.
    ```

## 🐳 Despliegue con Docker
1. Construye la imagen:
    ```sh
    docker build -t infradraw-frontend .
    ```
2. Ejecuta el contenedor:
    ```sh
    docker run -p 8080:8080 infradraw-frontend
    ```
## 📁 Estructura del proyecto

    ```sh
    frontend/
    ├── src/
    │   ├── components/        # Componentes principales y UI
    │   ├── hooks/             # Custom hooks (useDiagramState, use-toast, etc.)
    │   ├── pages/             # Páginas principales (Editor, Público, etc.)
    │   ├── services/          # Servicios de datos y API
    │   ├── types/             # Tipos y modelos TypeScript
    │   └── utils/             # Utilidades varias
    ├── public/                # Archivos estáticos
    ├── [package.json](http://_vscodecontentref_/0)
    ├── Dockerfile
    └── ...
    ```
## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!
Por favor, abre un issue o pull request para sugerir mejoras, reportar bugs o proponer nuevas funcionalidades.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE.md](LICENSE.md) para más detalles.
---

¡Crea diagramas increíbles y comparte tus arquitecturas con el mundo!
---

¡Contribuciones y sugerencias son bienvenidas! ⭐  
¿Dudas? Abre un issue o contacta a [Paulo Ariel Pareja](mailto:info@paulopareja.com.ar)