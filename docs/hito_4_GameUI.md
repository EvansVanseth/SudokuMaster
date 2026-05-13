# Hito 4: Implementación de la Interfaz de Usuario del Juego (Game UI)

Este hito se centró en la creación de la pantalla principal de juego, permitiendo a los usuarios (tanto anónimos como registrados) jugar una partida completa de Sudoku.

---

## ✅ Funcionalidades Implementadas

### 1. **Estructura de Componentes (FSD)**
- Se ha creado la página principal del juego (`GamePage.tsx`) y se ha aislado la lógica de la UI en componentes dedicados siguiendo la arquitectura FSD del proyecto:
  - **`BoardUI.tsx`**: Renderiza el tablero de 9x9, diferenciando visualmente pistas, números de usuario, celda seleccionada, celdas relacionadas y errores.
  - **`Controls.tsx`**: Muestra el cronómetro, y los botones de `Pausa`/`Reanudar`, `Nueva Partida` y `Salir`.
  - **`Numpad.tsx`**: Proporciona una interfaz para introducir y borrar números en el tablero.

### 2. **Gestión de Estado con Zustand**
- Se ha implementado un store (`gameStore.ts`) con Zustand para gestionar de forma centralizada todo el estado de la partida en curso, incluyendo el tablero, la celda seleccionada, el estado del juego (`jugando`, `pausado`, etc.) y el temporizador.
- La lógica del store se integra con el `sudokuEngine` y el `validator` del dominio para generar tableros y validar los movimientos del usuario.

### 3. **Flujo de Juego para Todos los Usuarios**
- Se ha implementado la capacidad de iniciar una partida directamente desde las tarjetas de previsualización de la `LandingPage`.
- Este flujo funciona tanto para **usuarios registrados** como para **usuarios anónimos**, permitiendo probar el juego sin necesidad de una cuenta.

### 4. **Mejoras de la Experiencia de Usuario (UX)**
- **Modo Pausa**: Al pausar el juego, un overlay oscurece el tablero para evitar que se pueda seguir resolviendo.
- **Modal de Confirmación de Salida**: Al hacer clic en "Salir", un modal pide confirmación. La lógica es diferente según el estado de autenticación:
  - **Usuario anónimo**: Se le informa que el progreso no se guardará y se le redirige a la `LandingPage`.
  - **Usuario registrado**: Se le informa que el progreso se guardará (funcionalidad pendiente del Hito 5) y se le redirige al `Dashboard`.

### 5. **Estilos con CSS Modules**
- Se ha refactorizado toda la UI del juego para usar **CSS Modules**, eliminando el uso de Tailwind CSS para mantener la consistencia con las convenciones de estilo del proyecto.
- Se han corregido diversos problemas de layout para asegurar que la interfaz se vea correctamente tanto en vistas de escritorio como en móvil.

### 6. **Corrección de Errores Críticos**
- Se han solucionado múltiples errores de **bucles de renderizado infinitos** (`Maximum update depth exceeded`) relacionados con el uso de Zustand y los `useEffect` de React.
- Se han corregido todos los errores de `linting` y `build` para asegurar la estabilidad y calidad del código.

---

## ⚠️ Dificultades No Conseguidas

### Carga del Tablero Previsualizado

- **Problema**: A pesar de varios intentos, no se logró que el tablero exacto mostrado en la previsualización de la `LandingPage` fuera el que se cargara en la `GamePage`. En su lugar, se genera un tablero nuevo aleatorio.
- **Causa Raíz Identificada**: El problema se debe a una interacción con el **Modo Estricto (`StrictMode`) de React** en el entorno de desarrollo. Este modo ejecuta los `useEffect` dos veces para detectar efectos secundarios.
  1. La primera ejecución carga correctamente el tablero de la vista previa y limpia el estado temporal.
  2. La segunda ejecución, al no encontrar ya el estado temporal, genera un nuevo tablero aleatorio, reemplazando al correcto.
- **Estado Actual**: Tras varios intentos de solución que no dieron el resultado esperado de forma consistente, el cliente ha decidido revertir los últimos cambios y no seguir invirtiendo tiempo en este problema por ahora, para poder avanzar a los siguientes hitos. La funcionalidad principal de iniciar una partida (aunque sea con otro tablero de la misma dificultad) está operativa.
