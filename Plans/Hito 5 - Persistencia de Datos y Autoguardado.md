# Hito 5: Persistencia de Datos y Autoguardado

## Objetivo
Conectar el estado de la partida en curso con Supabase para implementar el autoguardado asíncrono (debouncing), asegurando que el progreso no se pierda y no se congele la interfaz.

## Alcance
- Guardar partidas en Supabase para usuarios autenticados.
- Mantener `sessionStorage` como persistencia local inmediata.
- Permitir múltiples partidas pendientes por usuario.
- Mostrar la elección de partida pendiente fuera de `GamePage`.
- No obligar al usuario a reanudar partidas pendientes.

## Flujo esperado
1. El usuario autenticado puede iniciar una nueva partida desde un panel de preview en `LandingPage`.
2. El usuario también puede ver una lista de partidas pendientes y elegir cuál reanudar.
3. La selección de la partida a cargar se realiza antes de navegar a `GamePage`.
4. `GamePage` solo muestra el juego ya seleccionado en el store y no decide entre nuevo o pendiente.
5. El progreso se guarda en segundo plano con debounce mientras el usuario juega.
6. Al salir, si el usuario está autenticado, se ejecuta un flush de guardado remoto.

## Implementación
### 1. Persistencia remota
- Crear `src/features/game/services/gamePersistence.ts`
- Funciones principales:
  - `saveGameStateToSupabase`
  - `loadPendingGamesForUser`
  - `loadSavedGameById`
  - `completeSavedGameIfNeeded`
- Usar `supabase` desde `src/shared/api/supabaseClient.ts`
- Esquema `games`: `id`, `user_id`, `board`, `difficulty`, `status`, `time_spent`, `is_winner`, `created_at`, `updated_at`

### 2. Store de juego
- Añadir `savedGameId?: string` a `PersistedGameState`
- Guardar/actualizar `savedGameId` en el store cuando se crea o recupera una partida remota
- Mantener `sessionStorage` como fallback local inmediato
- No mover la elección de nuevo/pendiente al `GamePage`

### 3. Auto-guardado no bloqueante
- Crear un debounce de guardado remoto dentro de la capa de persistencia o de la lógica del store
- Guardar remoto solo para usuarios autenticados
- Guardar local inmediatamente en `sessionStorage`

### 4. Selección externa de partidas pendientes
- Añadir vista/tabla de partidas pendientes en `LandingPage` o dashboard
- Mostrar: `difficulty`, `time_spent`, `updated_at`, `status`
- Permitir reanudar cualquiera de ellas sin borrarlas
- Permitir igualmente iniciar nuevas partidas desde previews

### 5. Pruebas y documentación
- Pruebas unitarias para `gamePersistence.ts` con mocks de Supabase
- Pruebas de integración del store con guardado remoto
- Actualizar `docs/hito_5_Persistencia.md` o sección nueva en la documentación existente

## Verificación
- `npm run build`
- `npm run test`
- Prueba manual: iniciar sesión, hacer un movimiento, recargar y verificar restauración
- Validar la tabla `games` en Supabase
- Verificar que salir de `GamePage` guarda el estado remoto si el usuario está autenticado
