# Plan para Implementar el Hito 4: UI del Juego con Acceso Anónimo

El objetivo es crear la pantalla principal del juego donde un usuario pueda jugar una partida completa de Sudoku. Se permitirá que tanto usuarios anónimos como autenticados puedan iniciar una partida directamente desde la landing page. Las partidas anónimas no tendrán persistencia.

---

### Fase 1: Estructura y Gestión de Estado

1.  **Crear el "Slice" de la Funcionalidad del Juego:**
    *   Crear el directorio `src/features/game`.
    *   Dentro, crear los subdirectorios `components` y `store`.

2.  **Configurar el Gestor de Estado del Juego (`gameStore`):**
    *   Crear el archivo `src/features/game/store/gameStore.ts`.
    *   Usar Zustand para gestionar el estado del juego, incluyendo:
        *   `board: Board`
        *   `initialBoard: Board`
        *   `selectedCell: { row: number; col: number } | null`
        *   `status: 'playing' | 'paused' | 'solved'`
        *   `timer: number`
    *   Definir acciones, incluyendo `startGame(difficulty: Difficulty)`.

---

### Fase 2: Desarrollo de Componentes de UI

3.  **Crear la Página del Juego (`GamePage`):**
    *   Crear el componente `src/pages/GamePage.tsx`.
    *   Esta página compondrá los componentes `BoardUI`, `Controls`, y `Numpad`.

4.  **Desarrollar el Tablero de Sudoku (`BoardUI`):**
    *   Crear `src/features/game/components/BoardUI.tsx`.
    *   Renderizar la cuadrícula de 9x9, diferenciando visualmente las pistas, la celda seleccionada y los errores.

5.  **Desarrollar los Controles del Juego (`Controls`):**
    *   Crear `src/features/game/components/Controls.tsx`.
    *   Componente para mostrar el cronómetro y los botones de Pausa/Reanudar y Nueva Partida.

6.  **Desarrollar el Teclado Numérico (`Numpad`):**
    *   Crear `src/features/game/components/Numpad.tsx`.
    *   Componente para la entrada de números (1-9) y la función de borrado.

---

### Fase 3: Integración, Lógica y Flujo de Entrada

7.  **Actualizar la Landing Page:**
    *   Hacer que los componentes `SudokuPreviewCard` en la `LandingPage` sean clickeables.
    *   Al hacer clic, navegar a la página del juego, pasando la dificultad (`easy`, `medium`, `hard`) como parámetro.

8.  **Actualizar el Enrutador (`AppRouter`):**
    *   Añadir una ruta dinámica, por ejemplo `/game/:difficulty`, que renderice la `GamePage`.
    *   La `GamePage` leerá el parámetro `difficulty` de la URL para llamar a la acción `startGame`.

9.  **Integrar la Lógica de Dominio:**
    *   Conectar el `gameStore` con el `sudokuEngine` para la generación de tableros y con el `validator.ts` para la validación de movimientos.

---

### Fase 4: Verificación

10. **Escribir Pruebas (Tests):**
    *   Añadir pruebas para el nuevo flujo de navegación desde la `LandingPage`.
    *   Crear pruebas de componentes para `BoardUI`, `Controls` y pruebas unitarias/integración para la lógica del `gameStore`.
