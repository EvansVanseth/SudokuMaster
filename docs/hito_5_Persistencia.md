# Hito 5: Persistencia de Datos y Autoguardado

## Resumen
La funcionalidad de persistencia permite guardar el estado de las partidas de los usuarios en tiempo real (debounced) y recuperar partidas previamente interrumpidas. La arquitectura usa persistencia a dos niveles: `sessionStorage` para el cliente inmediato (previniendo pérdidas por recargas de página) y la base de datos remota en **Supabase** para persistencia a largo plazo de usuarios autenticados.

## Persistencia Local (`sessionStorage`)
El store de Zustand (`src/features/game/store/gameStore.ts`) persiste todo el estado de la partida (`board`, `initialBoard`, `timer`, `status`, `difficulty`, `savedGameId`) directamente en el `sessionStorage`. Esto es síncrono y se ejecuta cada vez que el estado cambia mediante las acciones (`enterNumber`, `tickTimer`, etc). 

## Persistencia Remota (Supabase)
### Servicios
Los servicios de base de datos se encuentran en `src/features/game/services/gamePersistence.ts`:

### Autoguardado (Debouncing)
El autoguardado remoto se implementa en `src/pages/GamePage.tsx` usando un `React.useEffect`. Cuando ocurren cambios en el tablero, tiempo u otros metadatos relevantes, se dispara un temporizador de 1200ms (`setTimeout`). Si ocurre otro cambio antes de que termine, el temporizador se reinicia.
Una vez completado el tiempo, se llama a `flushRemoteSave`, que sincroniza el estado actual con Supabase en segundo plano.

## Detección de Victoria y comportamiento al resolver

Se añadieron varias modificaciones importantes para detectar cuando un tablero está resuelto y reflejarlo en la UI y en la persistencia:

- **Detección en el dominio:** La función `isBoardSolved` en [src/domain/validator.ts](src/domain/validator.ts#L138-L152) comprueba que todas las celdas tengan valor y que ninguna esté marcada como error. Esta función se usa como fuente de verdad para determinar victoria.
- **Store:** Las acciones `enterNumber` y `deleteNumber` en [src/features/game/store/gameStore.ts](src/features/game/store/gameStore.ts) ahora:
	- validan el tablero con `validateBoard`,
	- llaman a `isBoardSolved(updatedBoard)` y, si devuelve `true`, actualizan el `status` a `solved` y persisten el estado en `sessionStorage`.
- **Temporizador y controles:** El efecto que llama a `tickTimer` depende de `status === 'playing'`, por lo que al pasar a `solved` el contador deja de incrementarse automáticamente. Además, la UI deshabilita los controles relevantes (numpad, botón `Borrar`, y `Pausa`) para evitar interacciones posteriores; solo `Salir` permanece activo. Los cambios están en:
	- [src/features/game/components/Controls.tsx](src/features/game/components/Controls.tsx)
	- [src/features/game/components/Numpad.tsx](src/features/game/components/Numpad.tsx)

- **UI visual:** Al detectarse `solved`, el componente de tablero ([src/features/game/components/BoardUI.tsx](src/features/game/components/BoardUI.tsx)) pinta las celdas en un azul claro y muestra un overlay tipo "cuño" con el texto **Resuelto** (clase `.solvedStamp`) rotado ~30° y con una pequeña animación. Estilos asociados en [src/features/game/components/BoardUI.module.css](src/features/game/components/BoardUI.module.css).

- **Guardado inmediato y marcado como completada:** Cuando el estado pasa a `solved` se dispara un `flushRemoteSave` inmediato desde [src/pages/GamePage.tsx](src/pages/GamePage.tsx). Si la partida ya existía en la base de datos (`savedGameId`), se llama a `completeSavedGameIfNeeded` para marcarla como `completed` / `is_winner = true` sin esperar al debounce.

- **Centralización del guardado al salir:** La lógica para "guardar y salir" se centralizó en el store. `toggleConfirmExit` en [src/features/game/store/gameStore.ts](src/features/game/store/gameStore.ts) ahora acepta opcionalmente un `userId` y un callback `onAfter`. Si se pasa `userId` la función hará el guardado remoto y ejecutará `onAfter()` (por ejemplo navegar al dashboard). Si no se pasa `userId`, simplemente alterna la visibilidad del modal de confirmación para usuarios anónimos.

- **Impacto en pruebas:** Se recomienda actualizar/añadir tests unitarios e integración para cubrir:
	- `enterNumber`/`deleteNumber` marcando `status: 'solved'` cuando corresponda;
	- componentes UI deshabilitados al resolver;
	- el efecto que dispara `flushRemoteSave` y la llamada a `completeSavedGameIfNeeded`.

Estas modificaciones mejoran la experiencia del usuario al resolver una partida (feedback visual y detención de la partida) y aseguran que el estado final se persista correctamente tanto local como remotamente.

## Interfaz y UX (Dashboard)
- **Gestión de Partidas**: El Dashboard (`AppRouter.tsx`) ha sido rediseñado para ser más intuitivo y espacioso.
- **Acciones**: Cada partida pendiente incluye botones para "Reanudar" y "Eliminar" (con confirmación).
- **Traducción**: Las dificultades se muestran traducidas al español (Fácil, Media, Difícil).
- **Navegación**: Se han añadido botones claros para volver a la Landing Page ("Volver al Inicio") y cerrar sesión.
- **Optimización Mobile**: La tabla de partidas se transforma en una vista de lista con tarjetas adaptables en dispositivos móviles, asegurando que los botones de acción sean fáciles de pulsar y que la información use el 100% del ancho disponible.

## Pruebas
- **Unitarias**: Cobertura completa de los servicios de persistencia en `gamePersistence.test.ts`, incluyendo mocks del cliente de Supabase y validación de flujos de error.
- **Integridad**: Verificación de que el `tbody` y la estructura de la tabla no restrinjan el ancho en vistas móviles mediante ajustes específicos en `index.css`.
