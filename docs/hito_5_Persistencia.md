# Hito 5: Persistencia de Datos y Autoguardado

## Resumen
La funcionalidad de persistencia permite guardar el estado de las partidas de los usuarios en tiempo real (debounced) y recuperar partidas previamente interrumpidas. La arquitectura usa persistencia a dos niveles: `sessionStorage` para el cliente inmediato (previniendo pérdidas por recargas de página) y la base de datos remota en **Supabase** para persistencia a largo plazo de usuarios autenticados.

## Persistencia Local (`sessionStorage`)
El store de Zustand (`src/features/game/store/gameStore.ts`) persiste todo el estado de la partida (`board`, `initialBoard`, `timer`, `status`, `difficulty`, `savedGameId`) directamente en el `sessionStorage`. Esto es síncrono y se ejecuta cada vez que el estado cambia mediante las acciones (`enterNumber`, `tickTimer`, etc). 

## Persistencia Remota (Supabase)
### Servicios
Los servicios de base de datos se encuentran en `src/features/game/services/gamePersistence.ts`:
- **`saveGameStateToSupabase`**: Inserta o actualiza una partida en la tabla `games`. Si ya existe `savedGameId` en el estado, realiza un `UPDATE`, sino un `INSERT`.
- **`loadPendingGamesForUser`**: Busca partidas cuyo `status` sea `in_progress` ordenadas por `updated_at`.
- **`loadSavedGameById`**: Carga una partida específica por su ID.
- **`deleteSavedGame`**: Permite a los usuarios eliminar permanentemente una partida pendiente de la base de datos.
- **`remoteGameRecordToPersistedState`**: Adapta el formato devuelto por Supabase al formato `PersistedGameState` que utiliza el store local.

### Autoguardado (Debouncing)
El autoguardado remoto se implementa en `src/pages/GamePage.tsx` usando un `React.useEffect`. Cuando ocurren cambios en el tablero, tiempo u otros metadatos relevantes, se dispara un temporizador de 1200ms (`setTimeout`). Si ocurre otro cambio antes de que termine, el temporizador se reinicia.
Una vez completado el tiempo, se llama a `flushRemoteSave`, que sincroniza el estado actual con Supabase en segundo plano.

## Interfaz y UX (Dashboard)
- **Gestión de Partidas**: El Dashboard (`AppRouter.tsx`) ha sido rediseñado para ser más intuitivo y espacioso.
- **Acciones**: Cada partida pendiente incluye botones para "Reanudar" y "Eliminar" (con confirmación).
- **Traducción**: Las dificultades se muestran traducidas al español (Fácil, Media, Difícil).
- **Navegación**: Se han añadido botones claros para volver a la Landing Page ("Volver al Inicio") y cerrar sesión.
- **Optimización Mobile**: La tabla de partidas se transforma en una vista de lista con tarjetas adaptables en dispositivos móviles, asegurando que los botones de acción sean fáciles de pulsar y que la información use el 100% del ancho disponible.

## Pruebas
- **Unitarias**: Cobertura completa de los servicios de persistencia en `gamePersistence.test.ts`, incluyendo mocks del cliente de Supabase y validación de flujos de error.
- **Integridad**: Verificación de que el `tbody` y la estructura de la tabla no restrinjan el ancho en vistas móviles mediante ajustes específicos en `index.css`.
