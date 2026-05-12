# Hito 3.5: Creación de la Landing Page y Flujo de Autenticación

Este hito se centró en construir la cara pública de la aplicación, proporcionando una experiencia de bienvenida a los usuarios y estableciendo un flujo de autenticación claro y completo.

## Resumen de Funcionalidades Implementadas

### 1. **Landing Page (`/`)**
- Se ha creado una página de inicio principal que sirve como punto de entrada a la aplicación.
- **Componentes:**
    - **Banner de Usuario (`UserBanner`):** Muestra un saludo y enlace al panel de control si el usuario está logueado, o botones de "Iniciar Sesión" y "Regístrate" si es un visitante.
    - **Vistas Previas de Sudokus (`SudokuPreviewCard`):** Muestra ejemplos visuales de tableros de Sudoku con diferentes niveles de dificultad (Fácil, Medio, Difícil) para atraer al usuario.
    - **Sección de Marketing:** Incluye textos de bienvenida, curiosidades sobre el Sudoku y una llamada a la acción (CTA) para invitar al registro.

### 2. **Flujo de Registro (`/register`)**
- Se ha creado una página dedicada exclusivamente al registro de nuevos usuarios.
- **Formulario de Registro (`RegisterForm`):**
    - **Display Name:** Se ha añadido un campo `displayName` obligatorio, que se usará como nombre público del usuario en la aplicación en lugar de su email.
    - **Registro con Email/Contraseña:** Permite el alta tradicional.
    - **Registro con Google (`LoginButton`):** Se ha añadido la opción de registro mediante OAuth con Google para un acceso más rápido.

### 3. **Página de Login (`/login`)**
- Se ha limpiado y mejorado la página de inicio de sesión.
- El título de la aplicación ahora es un enlace a la página de inicio.
- Se ha eliminado la información duplicada, dejando un único y claro enlace a la página de registro.

### 4. **Mejoras Generales de UI/UX**
- **Título de la Aplicación:** El título de la pestaña del navegador se ha actualizado a `SudokuMaster (Beta)`.
- **Estilos de Componentes:** Se han pulido los estilos de los componentes `UserBanner` y `SudokuPreviewCard` para una mejor alineación, espaciado y fidelidad visual, asegurando que los tableros de Sudoku se vean estéticamente correctos.
- **Navegación Intuitiva:** El flujo entre la landing page, el registro y el login es ahora claro y coherente.

### 5. **Refactorización del Router (`AppRouter`)**
- Se han añadido las nuevas rutas (`/register`) y se ha reestructurado la lógica para que la ruta raíz (`/`) apunte a la `LandingPage`, mientras que el panel de control del usuario reside en una ruta protegida (`/dashboard`).
