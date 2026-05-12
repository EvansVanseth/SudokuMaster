### **Plan de Desarrollo: Landing Page con Display Name**

**Objetivo:** Crear una landing page que invite al registro, permita el login y muestre un `displayName` del usuario en lugar de su email.

---

#### **Fase 1: Estructura de Ficheros y Rutas (Sin cambios)**

1.  **Crear la Ruta:**
    *   En `src/app/router/AppRouter.tsx`, añadir una nueva ruta para `/` que renderice el componente de la landing page.

2.  **Crear Nuevos Componentes (Scaffolding):**
    *   `src/features/auth/components/RegisterForm.tsx`: Un nuevo formulario para el registro.
    *   `src/features/auth/components/UserBanner.tsx`: Componente que mostrará "Login/Registro" o el `displayName` del usuario.
    *   `src/shared/ui/SudokuPreviewCard.tsx`: Una tarjeta para mostrar los tableros de Sudoku de ejemplo.
    *   `src/app/pages/LandingPage.tsx`: La página principal que unirá todos los componentes.

---

#### **Fase 2: Lógica de Autenticación (Modificada)**

3.  **Actualizar `AuthProvider.tsx`:**
    *   Modificaré la función `signUpWithEmail` para que acepte un `displayName` como tercer argumento.
    *   Dentro de `signUpWithEmail`, pasaré el `displayName` a `supabase.auth.signUp` a través del campo `options: { data: { display_name: displayName } }`. Esto lo almacenará en los metadatos del usuario.
    *   Actualizaré el `AuthContext` para que el hook `useAuth` exporte la nueva firma de `signUpWithEmail`.

4.  **Componente `RegisterForm.tsx` (Modificado):**
    *   Añadiré un nuevo campo de texto al formulario para el **Display Name**, que será obligatorio.
    *   Al enviar el formulario, llamaré a la función `signUpWithEmail` actualizada con el `email`, `password` y `displayName`.

---

#### **Fase 3: Desarrollo de Componentes de UI (Modificada)**

5.  **Componente `UserBanner.tsx` (Modificado):**
    *   Usará el hook `useAuth` para acceder al objeto `user`.
    *   **Si no está logueado:** (Sin cambios) Mostrará botones para "Iniciar Sesión" y "Darse de Alta".
    *   **Si está logueado:**
        *   Obtendrá el nombre a mostrar del usuario. La lógica será: usar `user.user_metadata.display_name` (para registro por email) o `user.user_metadata.full_name` (para proveedores como Google), con un fallback al email si ninguno existe.
        *   Mostrará un saludo como "Hola, [displayName]" y los botones de acción pertinentes.

6.  **Componente `SudokuPreviewCard.tsx` (Sin cambios):**
    *   Diseñaré una tarjeta visualmente atractiva que muestre una imagen estática de un Sudoku a medio resolver.

---

#### **Fase 4: Construcción de la Landing Page (Sin cambios)**

7.  **Componente `LandingPage.tsx`:**
    *   Diseñaré el layout, integraré el `UserBanner`, los `SudokuPreviewCard` y los textos de marketing y curiosidades.

---

#### **Fase 5: Verificación (Modificada)**

8.  **Pruebas Manuales:**
    *   Verificaré que el nuevo campo `displayName` en el formulario de registro funciona y es obligatorio.
    *   Comprobaré que tras el registro, el `displayName` se muestra correctamente en el `UserBanner`.
    *   Haré login con un usuario de Google para asegurar que su nombre también se muestra correctamente.
    *   Revisaré que el diseño general siga siendo coherente.
