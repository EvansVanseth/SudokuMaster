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

4. **Gestión de Cuenta (Refactorización y Seguridad)**
    - Implementación de `useAccount` hook (FSD).
    - Sincronización en tiempo real del perfil con `AuthContext`.
    - Seguridad: Validación OWASP en cambio de contraseña y confirmación de email para borrado de cuenta.
    - Integración de Edge Function para borrado seguro de cuenta (`delete-account`).
    - Flujo de "Olvidé mi contraseña" completo.
    - Interfaz unificada (inputs consistentes, visualización de contraseña, modal de éxito, navegación mejorada).
    - Ajuste de modelo de datos: eliminación de campo `username` redundante.""
    - Implementación de `ScrollToTop` para navegación móvil.

5. **Refinamiento Técnico**
   - Corrección de errores de RLS en Supabase (SECURITY INVOKER en vistas).
   - Corrección de errores de Lint y Build.
    - Actualización de `FeedbackModal` para usar versión dinámica.

**Fecha**: 2026-06-21
**Versión**: 0.1.3
**Rama**: `feature/centralize-password-validation`

## Resumen de Tareas Realizadas

1. **Centralización y Optimización de Validación de Contraseñas**
   - Creación de `src/domain/auth/password.ts` con lógica centralizada (reglas OWASP).
   - Implementación de `src/domain/auth/denylist.ts` con más de 1000 contraseñas comunes.
   - Optimización de rendimiento: Uso de `Set` para búsquedas $O(1)$ y pre-filtrado de la denylist contra reglas de complejidad.
   - Refactorización de `RegisterForm.tsx` y `AccountPage.tsx` para usar el validador centralizado.
   - Creación de tests unitarios para el nuevo validador y actualización de pruebas de integración.
   - Documentación de seguridad en `README.md`.
