# SudokuMaster

SudokuMaster es una aplicación web para jugar Sudoku, con autenticación, persistencia de juegos y seguimiento de progreso.

## Características de Seguridad

Esta aplicación implementa validación de contraseñas de nivel profesional:

- **Validación Centralizada**: Lógica de validación OWASP centralizada en la capa de dominio (`src/domain/auth/password.ts`).
- **Protección contra Diccionarios**: Implementación de una lista de denegación (denylist) optimizada de contraseñas comunes (más de 1000 entradas), filtrada por criterios de seguridad para máxima eficiencia ($O(1)$ lookup con `Set`).
