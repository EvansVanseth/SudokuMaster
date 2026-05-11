# Documentación Hito 3: Autenticación y Supabase

Este documento detalla la implementación de la infraestructura de backend y el sistema de autenticación para SudokuMaster.

## Resumen del Hito
El objetivo principal fue conectar la aplicación con Supabase para gestionar la identidad de los usuarios y permitir el inicio de sesión mediante Google OAuth y métodos tradicionales.

## Tecnologías Implementadas
- **Supabase SDK:** Integración de `@supabase/supabase-js` para la comunicación con el backend.
- **Google OAuth:** Configuración de credenciales en Google Cloud Console y Supabase.
- **Vite Env Variables:** Gestión de claves sensibles mediante `.env.local` y `security_connections.md` (protegidos por `.gitignore`).

## Arquitectura de Autenticación (FSD)

### 1. Capa Shared (API)
- **`src/shared/api/supabaseClient.ts`**: Inicializa el cliente de Supabase utilizando las variables de entorno. Es el punto de acceso único para todas las operaciones de base de datos y auth.

### 2. Capa Features (Auth)
- **`src/features/auth/context/AuthContext.tsx`**: Define el contrato del estado de autenticación (usuario, sesión, carga, login/logout).
- **`src/features/auth/components/AuthProvider.tsx`**: Implementa la lógica de gestión de sesiones. Escucha cambios en tiempo real (`onAuthStateChange`) y expone las funciones para interactuar con Google OAuth.
- **`src/features/auth/hooks/useAuth.ts`**: Hook para consumir el contexto de forma segura en cualquier componente de la aplicación.

## Pruebas de Verificación
Se ha implementado un conjunto de pruebas de integración en `src/features/auth/__tests__/authFlow.test.ts` que validan:
1.  **Registro de Usuarios:** Creación exitosa de usuarios directamente en la base de datos de Auth (bypassing email limits).
2.  **Validación de Datos:** Confirmación de que el usuario creado existe y mantiene su identidad (ID único).
3.  **Ciclo de Vida:** Eliminación correcta del usuario de prueba para mantener la base de datos limpia.

## Estado de Seguridad
- Las claves sensibles están documentadas en `security_connections.md`.
- El archivo `.gitignore` ha sido actualizado para excluir tanto `.env.local` como `security_connections.md`.

## Implementación de la Interfaz (UI)
Se ha creado un sistema de diseño premium basado en **Glassmorphism** y **Atomic Design** (adaptado a FSD):
- **Diseño Visual:** Fondo con degradados radiales, tarjetas con efecto de cristal esmerilado (`backdrop-filter`) y tipografía moderna (*Outfit*).
- **Componentes:** 
    - `LoginButton`: Botón estilizado con el logo de Google (SVG).
    - `AuthForm`: Formulario nativo de registro e inicio de sesión con email y contraseña.
    - `AuthProvider`: Envuelve la aplicación en `App.tsx` para proporcionar el estado de sesión global.
- **Flujo de Usuario:**
    - Implementación de `react-router-dom` para la navegación.
    - `ProtectedRoute`: Componente que redirige al login si no hay sesión.
    - Pantalla de bienvenida (`/login`) y Dashboard principal (`/`).

## Base de Datos y Persistencia
Se ha definido el esquema relacional en Supabase para soportar las funcionalidades futuras:
- **Tabla `profiles`**: Almacena metadatos del usuario. Se sincroniza automáticamente con el registro mediante un *Trigger* de base de datos.
- **Tabla `games`**: Diseñada para soportar el auto-guardado. Almacena el tablero en formato JSONB para máxima flexibilidad.
- **Seguridad:** Implementación de **RLS (Row Level Security)** que garantiza que cada usuario solo tiene acceso a sus propios registros, protegiendo la privacidad de los datos.

## Estructura de Contexto para Agentes
Se ha creado el directorio `CONTEXT/` que contiene:
- `supabase_schema.sql`: El script completo de inicialización de la base de datos.

---
**Hito 3 Completado ✅**
Procesos validados mediante tests de integración y verificación manual de la interfaz.
