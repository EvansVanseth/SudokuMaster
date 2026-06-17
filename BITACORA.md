# Bitácora de Desarrollo SudokuMaster

**Fecha**: 2026-06-17
**Versión**: 0.1.0
**Rama**: `feature/minor-adjustments`

## Resumen de Tareas Realizadas

1. **Sincronización de Versión y Footer Global**
   - Configuración de `__APP_VERSION__` global mediante Vite.
   - Implementación de `AppLayout` y `Footer` global.

2. **Filtrado de Estadísticas**
   - Corrección de la lógica de estadísticas: ahora solo cuentan partidas con `status = 'completed'`.
   - Ajuste en `gamePersistence.ts` para filtrado eficiente en base de datos.

3. **Leaderboard**
   - Creación de vista SQL `top_players_view` en Supabase con cálculo de puntuación (Easy: 1, Medium: 3, Hard: 5).
   - Implementación de `LeaderboardPage` y `LeaderboardSection` con diseño de podio elegante.
   - Integración en `LandingPage`.

4. **Gestión de Cuenta**
   - Creación de `AccountPage` (visualización de email, actualización de `full_name`).
   - Implementación de Logout y estructura para futuras funciones (Cambio contraseña, Eliminar cuenta).
   - Integración del botón "Mi Cuenta" en el Dashboard.

5. **Refinamiento Técnico**
   - Corrección de errores de RLS en Supabase (SECURITY INVOKER en vistas).
   - Corrección de errores de Lint y Build.
   - Actualización de `FeedbackModal` para usar versión dinámica.
