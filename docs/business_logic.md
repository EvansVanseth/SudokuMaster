# Lógica de Negocio y Motor de Sudoku

Este documento detalla el funcionamiento interno del núcleo de SudokuMaster, ubicado en la carpeta `src/domain/`. Siguiendo una **Arquitectura Hexagonal**, este núcleo es una librería de TypeScript puro, agnóstica a React y a la persistencia.

## 1. Entidades de Dominio (`types.ts`)

El sistema se basa en tres tipos principales:
- **`Grid`**: Una matriz de 9x9 de números (`number[][]`) donde `0` representa una celda vacía. Se usa para cálculos internos.
- **`Cell`**: El objeto que consume la UI. Contiene:
  - `value`: El número actual o `null`.
  - `isClue`: Booleano que indica si es una pista inicial (no editable).
  - `isError`: Booleano que indica si la celda viola las reglas del Sudoku.
- **`Board`**: Una matriz de 9x9 de objetos `Cell`.

## 2. Validador Puro (`validator.ts`)

Contiene la lógica matemática para verificar las reglas del Sudoku:
- **Validación de Reglas**: Funciones individuales para comprobar filas, columnas y cuadrantes 3x3.
- **`isMoveValid`**: Determina si colocar un número en una posición específica crearía un conflicto inmediato.
- **`isBoardSolved`**: Verifica que el tablero esté completo (sin ceros) y que no existan conflictos en ninguna celda.

## 3. Motor de Sudoku (`sudokuEngine.ts`)

El motor es el componente más complejo y utiliza algoritmos avanzados para garantizar rendimiento y jugabilidad.

### Solver (Backtracking + MRV)
Para resolver tableros y verificar la validez de los puzzles, se utiliza un algoritmo de backtracking optimizado con:
- **Bitmasks**: Las restricciones de filas, columnas y cajas se almacenan en máscaras de bits, reduciendo la comprobación de candidatos de $O(N)$ a $O(1)$.
- **Heurística MRV (Minimum Remaining Values)**: En cada paso, el algoritmo elige la celda con el menor número de candidatos posibles, reduciendo drásticamente el espacio de búsqueda.

### Generación de Puzzles
El proceso de generación sigue estos pasos:
1. **Generación de Tablero Resuelto**: Se crea un tablero válido completo usando el solver con aleatoriedad.
2. **Eliminación Simétrica**: Para que el puzzle sea estéticamente profesional, las celdas se eliminan por pares simétricos respecto al centro (180°).
3. **Garantía de Unicidad**: Antes de eliminar una celda, el motor verifica que el tablero resultante siga teniendo una **solución única**.
   - **Límite de Nodos**: Para evitar bloqueos en dificultades altas, la verificación de unicidad tiene un límite de exploración (2000 nodos). Si no se encuentra una segunda solución dentro de ese límite, el puzzle se acepta como único (garantía estadística).

### Dificultades
El nivel de dificultad se controla mediante el número de celdas eliminadas:
- **Fácil**: ~45 pistas visibles (36 eliminadas).
- **Medio**: ~35 pistas visibles (46 eliminadas).
- **Difícil**: ~29 pistas visibles (52 eliminadas).

## 4. Tests Unitarios

La integridad de la lógica de negocio está garantizada por una suite de tests en Vitest:
- **`validator.test.ts`**: Valida las reglas matemáticas y la detección de errores.
- **`sudokuEngine.test.ts`**: Valida que los puzzles generados sean resolubles, respeten los rangos de pistas y mantengan la aleatoriedad.
