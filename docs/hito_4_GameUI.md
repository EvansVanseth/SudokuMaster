# Hito 4: Implementación de la Interfaz de Usuario del Juego (Game UI)

Este hito se centró en la creación de la pantalla principal de juego, permitiendo a los usuarios (tanto anónimos como registrados) jugar una partida completa de Sudoku.

---

## ✅ Funcionalidades Implementadas

### 1. **Estructura de Componentes (FSD)**
- Se ha creado la página principal del juego (`GamePage.tsx`) y se ha aislado la lógica de la UI en componentes dedicados siguiendo la arquitectura FSD del proyecto:
  - **`BoardUI.tsx`**: Renderiza el tablero de 9x9, diferenciando visualmente pistas, números de usuario, celda seleccionada, celdas relacionadas y errores.
  - **`Controls.tsx`**: Muestra el cronómetro y los botones de `Pausa`/`Reanudar` y `Salir`; el botón de `Nueva Partida` se ha retirado para priorizar el flujo de juego activo.
  - **`Numpad.tsx`**: Proporciona una interfaz prominente para introducir y borrar números en el tablero, con un diseño responsivo que se adapta a móviles.

### 2. **Gestión de Estado con Zustand**
- Se ha implementado un store (`gameStore.ts`) con Zustand para gestionar de forma centralizada todo el estado de la partida en curso, incluyendo el tablero, la celda seleccionada, el estado del juego (`jugando`, `pausado`, etc.) y el temporizador.
- El store ahora persiste el estado en `sessionStorage`, de modo que al recargar la página se conserva la partida activa, el temporizador, la dificultad y la selección actual.
- La lógica del store se integra con el `sudokuEngine` y el `validator` del dominio para generar tableros y validar los movimientos del usuario.

### 3. **Flujo de Juego para Todos los Usuarios**
- Se ha implementado la capacidad de iniciar una partida directamente desde las tarjetas de previsualización de la `LandingPage`.
- Este flujo funciona tanto para **usuarios registrados** como para **usuarios anónimos**, permitiendo probar el juego sin necesidad de una cuenta.

### 4. **Mejoras de la Experiencia de Usuario (UX)**
- **Modo Pausa**: Al pausar el juego, un overlay oscurece el tablero para evitar que se pueda seguir resolviendo.
- **Soporte de teclado de escritorio**: Se añadió navegación con las flechas para cambiar la celda seleccionada, introducción de números `1-9` desde el teclado físico, y `Backspace`/`Delete` para borrar el valor.
- **Interfaz móvil mejorada**: El `Numpad` ahora se sitúa como elemento principal en pantallas pequeñas, mientras que los controles secundarios ocupan menos espacio en el layout.
- **Modal de Confirmación de Salida**: Al hacer clic en "Salir", un modal pide confirmación. La lógica es diferente según el estado de autenticación:
  - **Usuario anónimo**: Se le informa que el progreso no se guardará y se le redirige a la `LandingPage`.
  - **Usuario registrado**: Se le informa que el progreso se guardará (funcionalidad pendiente del Hito 5) y se le redirige al `Dashboard`.

### 5. **Estilos con CSS Modules**
- Se ha refactorizado toda la UI del juego para usar **CSS Modules**, eliminando el uso de Tailwind CSS para mantener la consistencia con las convenciones de estilo del proyecto.
- Se han corregido diversos problemas de layout para asegurar que la interfaz se vea correctamente tanto en vistas de escritorio como en móvil.
- El `Numpad` ahora cuenta con un layout responsive en móviles, utilizando una rejilla compacta para mantener accesibles los botones de número.

### 6. **Corrección de Errores Críticos**
- Se han solucionado múltiples errores de **bucles de renderizado infinitos** (`Maximum update depth exceeded`) relacionados con el uso de Zustand y los `useEffect` de React.
- Se han corregido todos los errores de `linting` y `build` para asegurar la estabilidad y calidad del código.
- Se han añadido pruebas de componente con React Testing Library para validar la diferenciación visual entre pistas y números del usuario, el resaltado de errores y el overlay de pausa.

---

## 🚀 Carga del Tablero Previsualizado

- **Implementado**: La `LandingPage` guarda el tablero de vista previa seleccionado en `sessionStorage` antes de navegar a la `GamePage`.
- **Flujo**: Al hacer clic en una tarjeta de preview, se construye el estado completo de la partida (`board`, `initialBoard`, `difficulty`, `status`, `timer`) y se restaura directamente en el store de juego.
- **Resultado**: La `GamePage` ahora carga el tablero exacto mostrado en la previsualización cuando la dificultad coincide.
- **Testeo**: Cambios verificados con `npm run test` y `npm run build`.
