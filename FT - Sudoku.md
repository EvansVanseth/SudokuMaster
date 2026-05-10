# **Proyecto**

# **Acta de Iniciación de Proyecto de Software**

Este documento formaliza el inicio del proyecto de software, estableciendo los parámetros clave, el alcance inicial y el método de trabajo.

# **Información General del Proyecto**

| Campo | Valor |
| :---- | :---- |
| Cliente | [Juan Alonso Garcia](mailto:evansvanseth@gmail.com) |
| Nombre del Proyecto | SudokuMaster |
| Fecha de Inicio Estimada | 8 may |
| Ciclo de Vida del Desarrollo | Cascada |
| Ubicación Principal del Desarrollo | [Carrer del Pare Fullana, 6](https://www.google.com/maps/place/Carrer+del+Pare+Fullana,+6/data=!4m2!3m1!19sChIJc4aFmPZ3YQ0Rv6GqtU2jPIQ) |

# **Alcance y Entregables**

El proyecto tiene como objetivo crear una aplicación para jugar al popular juego de sudoku. Como notas generales, la app permitirá el log de distintos usuarios y conservará información sobre los sudoku iniciados y completados.

# **Iteraciones y Planificación de Alto Nivel**

A continuación, se detalla una lista inicial de las Issues/Features que se abordarán, las cuales servirán como las iteraciones principales del proyecto. Esta tabla se actualizará continuamente a lo largo del ciclo de vida del proyecto.

| ID | Issue/Feature | Prioridad | Estado | FLE |
| :---- | :---- | :---- | :---- | :---- |
| H-001 | Configuración Base e Infraestructura (App / Shared) | Alta | No iniciada | 9 may |
| H-002 | Lógica de Dominio (Núcleo Hexagonal) | Alta | No iniciada | Date |
| H-003 | Autenticación, Seguridad y Base de Datos (Supabase) | Baja | No iniciada | Date |
| H-004 | Interfaz de Usuario Core (UI del Juego) |  | No iniciada | Fecha |
| H-005 | Persistencia de Datos y Autoguardado |  | No iniciada | Fecha |
| H-006 | Historial, Dashboard y Cierre |  | No iniciada | Fecha |
| F-001 |  |  | No iniciada | Fecha |

# **Documentación y Recursos Clave**

Los siguientes son enlaces a documentos y eventos importantes relacionados con la iniciación del proyecto:

* Documento de Requisitos (SOW/SRS): [DRF]()  
* Repositorio Git Principal: **EvansVanseth/SudokuMaster**  
* Reunión de Kick-off del Proyecto: Calendar event  
* Herramienta de Seguimiento de Tareas (Jira/Trello, etc.): \[Enlace a la herramienta\]

# **Aprobación**

Con la firma de las partes interesadas, se aprueba formalmente la iniciación de este proyecto con la información y el enfoque definidos.

* Representante del Cliente: [Juan Alonso Garcia](mailto:evansvanseth@gmail.com)  
* Director de Proyecto: [Juan Alonso Garcia](mailto:evansvanseth@gmail.com)

# **DRF**

# **Documento de Requisitos Funcionales (DRF) \- SudokuMaster**

# **Introducción**

Este Documento de Requisitos Funcionales (DRF) detalla los requisitos que la aplicación SudokuMaster debe cumplir. El objetivo principal de la aplicación es proporcionar una plataforma robusta y fácil de usar para jugar al Sudoku, con soporte para gestión de usuarios y persistencia del progreso de los juegos.

# **Requisitos de Usuario y Gestión de Sesión**

| ID | Requisito Funcional | Prioridad |
| :---- | :---- | :---- |
| RU-001 | El sistema DEBE permitir a un usuario registrarse con un nombre de usuario único y una contraseña. | Alta |
| RU-002 | El sistema DEBE permitir a un usuario iniciar sesión con sus credenciales registradas. | Alta |
| RU-003 | El sistema DEBE mantener la sesión del usuario iniciada hasta que el usuario decida cerrarla explícitamente (cerrar sesión). | Media |
| RU-004 | El sistema DEBE validar las credenciales de inicio de sesión y mostrar un mensaje de error claro si son incorrectas. | Alta |
| RU-005 | El sistema DEBE ofrecer una funcionalidad para recuperar la contraseña, solicitando un correo electrónico para enviar un enlace de restablecimiento (requiere FileEnlace al flujo de recuperación). | Baja |

# **Requisitos de Jugabilidad (Core del Sudoku)**

La siguiente tabla resume los requisitos clave para la experiencia de juego de Sudoku:

| ID | Requisito Funcional | Prioridad |
| :---- | :---- | :---- |
| RG-001 | El sistema DEBE generar tableros de Sudoku válidos y jugables en diferentes niveles de dificultad (Fácil, Medio, Difícil). | Alta |
| RG-002 | El usuario DEBE poder ingresar números (del 1 al 9\) en las celdas vacías del tablero. | Alta |
| RG-003 | El sistema DEBE detectar y notificar visualmente al usuario cuando se produce un error (violación de las reglas del Sudoku). | Alta |
| RG-004 | El sistema DEBE permitir al usuario borrar o cambiar un número ya ingresado en una celda vacía. | Alta |
| RG-005 | El sistema DEBE validar la solución del tablero y notificar al usuario cuando el Sudoku ha sido completado correctamente. | Alta |

# **Requisitos de Persistencia y Progreso**

El sistema DEBE asegurar que el progreso del usuario se conserve correctamente.

| ID | Requisito Funcional | Prioridad |
| :---- | :---- | :---- |
| RP-001 | El sistema DEBE guardar automáticamente el estado actual de cualquier Sudoku iniciado por el usuario. | Alta |
| RP-002 | El sistema DEBE permitir al usuario reanudar un Sudoku guardado previamente al iniciar sesión. | Alta |
| RP-003 | El sistema DEBE registrar la fecha de inicio y la duración total del tiempo de juego de cada Sudoku. | Media |
| RP-004 | El sistema DEBE mantener un historial de todos los Sudokus completados por el usuario, incluyendo la dificultad y el tiempo final. | Alta |
| RP-005 | El usuario DEBE poder visualizar una lista de sus juegos iniciados y completados en una sección de "Mi Progreso". | Alta |

# **Requisitos de Interfaz de Usuario (UI)**

| ID | Requisito Funcional | Prioridad |
| :---- | :---- | :---- |
| RUI-001 | La aplicación DEBE presentar una interfaz limpia y visualmente clara para el tablero de Sudoku. | Alta |
| RUI-002 | La aplicación DEBE diferenciar visualmente entre los números iniciales (pistas) y los números ingresados por el usuario. | Alta |
| RUI-003 | La aplicación DEBE mostrar un cronómetro visible que mida el tiempo transcurrido desde el inicio del juego. | Alta |
| RUI-004 | El sistema DEBE incluir un botón de "Pausa" que detenga el cronómetro y oculte el tablero de Sudoku, requiriendo que el usuario haga clic en un botón de "Reanudar" para continuar. | Media |
| RUI-005 | La aplicación DEBE disponer de un área de configuración para que el usuario pueda cambiar la dificultad antes de comenzar un nuevo juego y para gestionar su perfil (FileEnlace a Mockup de Perfil). | Media |

# **Entregables Adicionales**

Los siguientes entregables se vincularán al sistema una vez estén definidos:

* Reunión de Definición de Requisitos: Calendar event (Revisión de este DRF).  
* Mockups de la Interfaz Principal: File  
* Ubicación Física del Equipo de Desarrollo para Discusiones: Place  
* Contacto del Desarrollador Principal: [Juan Alonso Garcia](mailto:evansvanseth@gmail.com)  
* Fecha de Entrega de la Versión Beta: Date

# **Formalización e Historias de Usuario**

## **1\. Introducción y Alcance**

Este documento toma como base el Documento de Requisitos Funcionales (DRF) para la aplicación SudokuMaster. El objetivo de este anexo es desglosar exhaustivamente cada uno de los requisitos planteados en Historias de Usuario detalladas y Criterios de Aceptación cerrados, para garantizar que el desarrollo cubra tanto el flujo ideal ("Happy Path") como los casos extremos ("Edge Cases") relacionados con la gestión de usuarios, el motor del Sudoku, la persistencia y la interfaz.

---

## **2\. Historias de Usuario y Criterios de Aceptación por Requisito**

Requisitos de Usuario y Gestión de Sesión (RU)

Requisito Base: RU-001 \- Registro de usuario

**Historia de Usuario (US-01):** Como usuario nuevo, quiero poder registrarme en la aplicación creando un nombre de usuario único y una contraseña, para poder guardar mi progreso e historial de partidas.

* **AC1: Registro exitoso.**   
  * **Given** que el usuario se encuentra en la pantalla de "Registro",  
  * **When** introduce un nombre de usuario no existente y una contraseña válida (ej. más de 8 caracteres), y pulsa "Registrar",  
  * **Then** el sistema crea la cuenta, muestra un mensaje de éxito y lo redirige a la pantalla de inicio de sesión.  
* **AC2: Nombre de usuario duplicado.**  
  * **Given** que el usuario se encuentra en la pantalla de "Registro",  
  * **When** introduce un nombre de usuario que ya existe en la base de datos,  
  * **Then** el sistema deshabilita el botón de registro y muestra el error visual: "El nombre de usuario ya está en uso. Por favor, elige otro".  
* **AC3: Contraseña no segura.**  
  * **Given** que el usuario se encuentra en la pantalla de "Registro",  
  * **When** introduce una contraseña que no cumple con las políticas de seguridad (ej. menos de 8 caracteres),  
  * **Then** el sistema muestra el error visual: "La contraseña debe tener al menos 8 caracteres" y no permite el registro.

Requisito Base: RU-002 y RU-004 \- Inicio de sesión y validación

**Historia de Usuario (US-02):** Como usuario registrado, quiero iniciar sesión con mis credenciales para acceder a mi cuenta y continuar mis partidas guardadas.

* **AC1: Login exitoso.**  
  * **Given** que el usuario está en la pantalla de "Login",  
  * **When** introduce un nombre de usuario y contraseña correctos y pulsa "Entrar",  
  * **Then** el sistema autentica al usuario y lo redirige a la pantalla principal ("Dashboard").  
* **AC2: Credenciales incorrectas.**  
  * **Given** que el usuario está en la pantalla de "Login",  
  * **When** introduce una contraseña incorrecta para un usuario existente,  
  * **Then** el sistema deniega el acceso y muestra el error: "Nombre de usuario o contraseña incorrectos". (Nota de seguridad: No se debe especificar cuál de los dos falló).

Requisito Base: RU-003 \- Persistencia de sesión

**Historia de Usuario (US-03):** Como usuario con sesión iniciada, quiero que la aplicación recuerde mi acceso al cerrarla y volverla a abrir, para no tener que introducir mis datos cada vez.

* **AC1: Mantener sesión tras reiniciar app.**  
  * **Given** que el usuario tiene una sesión activa válida,  
  * **When** el usuario cierra la aplicación (o pestaña) por completo y vuelve a abrirla,  
  * **Then** el sistema reconoce el token de sesión y lo redirige directamente al "Dashboard" sin pedir credenciales.  
* **AC2: Cierre de sesión explícito.**  
  * **Given** que el usuario tiene una sesión activa,  
  * **When** hace clic en el botón "Cerrar sesión",  
  * **Then** el sistema invalida el token actual, borra los datos de sesión local y lo redirige a la pantalla de "Login".

Requisito Base: RU-005 \- Recuperación de contraseña

**Historia de Usuario (US-04):** Como usuario que ha olvidado su contraseña, quiero poder solicitar un enlace de recuperación a mi correo electrónico para poder restablecerla.

* **AC1: Solicitud de recuperación.**  
  * **Given** que el usuario está en la pantalla de "Recuperar Contraseña",  
  * **When** introduce un correo electrónico asociado a una cuenta válida y pulsa "Enviar",  
  * **Then** el sistema envía un correo con un token temporal y muestra el mensaje: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña".  
* **AC2: Restablecimiento de contraseña.**  
  * **Given** que el usuario hace clic en el enlace válido de su correo,  
  * **When** introduce una nueva contraseña que cumple los requisitos y la confirma,  
  * **Then** el sistema actualiza la contraseña en la base de datos y redirige al "Login".

Requisitos de Jugabilidad \- Core del Sudoku (RG)

Requisito Base: RG-001 \- Generación de tableros por dificultad

**Historia de Usuario (US-05):** Como jugador, quiero poder iniciar una nueva partida seleccionando entre las dificultades Fácil, Medio y Difícil, para que el juego se adapte a mi nivel de habilidad.

* **AC1: Generación de tablero válido.**  
  * **Given** que el usuario está en el menú de "Nueva Partida",  
  * **When** selecciona la dificultad "Medio",  
  * **Then** el sistema genera un tablero de 9x9 con una única solución matemáticamente posible, mostrando el número de pistas (celdas pre-rellenadas) correspondientes a la dificultad "Medio".

Requisito Base: RG-002 y RG-004 \- Inserción, borrado y modificación de números

**Historia de Usuario (US-06):** Como jugador, quiero poder escribir, sobreescribir o borrar números del 1 al 9 en las celdas vacías del tablero para ir resolviendo el puzzle.

* **AC1: Inserción válida.**  
  * **Given** un tablero de Sudoku activo,  
  * **When** el usuario selecciona una celda vacía y pulsa un número del 1 al 9 en su teclado (físico o en pantalla),  
  * **Then** el número aparece en la celda.  
* **AC2: Bloqueo de celdas iniciales (Pistas).**  
  * **Given** un tablero de Sudoku activo,  
  * **When** el usuario intenta seleccionar o modificar una celda que contiene un número inicial generado por el sistema,  
  * **Then** el sistema ignora la acción y no permite la modificación ni el borrado.  
* **AC3: Borrado de celda.**  
  * **Given** que el usuario ha introducido previamente un número en una celda originalmente vacía,  
  * **When** selecciona esa celda y pulsa "Borrar" o "Suprimir",  
  * **Then** la celda vuelve a estar vacía.

Requisito Base: RG-003 \- Detección de errores

**Historia de Usuario (US-07):** Como jugador, quiero que el sistema me alerte visualmente si introduzco un número que viola las reglas básicas del Sudoku (repetido en fila, columna o cuadrante de 3x3) para percatarme de mi fallo.

* **AC1: Violación de regla en Fila/Columna/Cuadrante.**  
  * **Given** un tablero de Sudoku en curso,  
  * **When** el usuario introduce un número "5" en una celda, y ya existe un "5" en esa misma fila, columna o cuadrícula de 3x3,  
  * **Then** el sistema resalta inmediatamente el número ingresado (y opcionalmente los conflictivos) en color rojo u otro indicador visual de error.  
* **AC2: Corrección de error.**  
  * **Given** una celda marcada como error,  
  * **When** el usuario borra el número conflictivo o lo cambia por uno que no viola las reglas,  
  * **Then** el sistema elimina el indicador visual de error inmediatamente.

Requisito Base: RG-005 \- Validación de solución final

**Historia de Usuario (US-08):** Como jugador, quiero que el sistema detecte automáticamente cuando he rellenado el tablero correctamente, para dar por finalizada la partida y registrar mi victoria.

* **AC1: Sudoku completado con éxito.**  
  * **Given** que al usuario le falta rellenar una sola celda,  
  * **When** introduce el último número correcto y el tablero completo cumple todas las reglas,  
  * **Then** el sistema detiene el cronómetro, bloquea el tablero para más ediciones, y muestra un modal de felicitación con el tiempo final y la dificultad.  
* **AC2: Tablero lleno pero incorrecto.**  
  * **Given** que al usuario le falta rellenar una sola celda,  
  * **When** introduce un número que llena el tablero pero no es la solución correcta (aunque no haya violaciones obvias o queden errores marcados),  
  * **Then** el sistema no finaliza la partida y permite al usuario seguir corrigiendo celdas.

Requisitos de Persistencia y Progreso (RP)

Requisito Base: RP-001 y RP-002 \- Autoguardado y reanudación

**Historia de Usuario (US-09):** Como jugador recurrente, quiero que el sistema guarde mi partida automáticamente en cada movimiento, para poder cerrar la app y continuar mi juego exactamente donde lo dejé al volver a iniciar sesión.

* **AC1: Guardado en background.**  
  * **Given** un tablero en curso,  
  * **When** el usuario realiza cualquier acción (insertar número, borrar, pausar tiempo),  
  * **Then** el estado del tablero y el tiempo del cronómetro se guardan automáticamente en la base de datos asociada a su perfil, sin interrumpir el juego.  
* **AC2: Reanudar partida pendiente.**  
  * **Given** que el usuario tiene una partida a medias guardada,  
  * **When** inicia sesión e ingresa al "Dashboard",  
  * **Then** se le presenta un botón o sección para "Reanudar Partida \[Dificultad\]", cargando el tablero exacto y el tiempo donde lo dejó.

Requisito Base: RP-003, RP-004 y RP-005 \- Historial y Mi Progreso

**Historia de Usuario (US-10):** Como jugador competitivo, quiero acceder a una sección de "Mi Progreso" para ver un listado de todos mis Sudokus jugados (terminados y pendientes), junto con la dificultad y los tiempos que he tardado, para medir mi evolución.

* **AC1: Listado de progreso.**  
  * **Given** que el usuario navega a la sección "Mi Progreso",  
  * **When** la pantalla carga,  
  * **Then** visualiza una lista ordenada cronológicamente (más recientes primero) de sus partidas, mostrando: Fecha de inicio, Dificultad, Estado (Completado/En Pausa) y Tiempo Total / Actual.

Requisitos de Interfaz de Usuario (RUI)

Requisito Base: RUI-001 y RUI-002 \- Claridad y diferenciación visual

**Historia de Usuario (US-11):** Como jugador, quiero ver un tablero limpio donde los números que me da el sistema inicialmente se diferencien claramente de los que yo voy escribiendo, para no confundirme durante la resolución.

* **AC1: Estilos tipográficos.**  
  * **Given** un tablero generado,  
  * **When** el usuario visualiza la partida,  
  * **Then** los números de pista (generados por el sistema) aparecen en negrita y en color negro estático, mientras que los números introducidos por el usuario aparecen en fuente regular y en un color distinto (ej. azul o gris oscuro).

Requisito Base: RUI-003 y RUI-004 \- Cronómetro y Pausa

**Historia de Usuario (US-12):** Como jugador, quiero poder ver el tiempo que llevo jugando y tener la opción de pausarlo, ocultando el tablero para evitar trampas, si necesito hacer una pausa en el mundo real.

* **AC1: Inicio del cronómetro.**  
  * **Given** que se genera una nueva partida o se reanuda una,  
  * **When** el tablero es visible para el usuario,  
  * **Then** el cronómetro (formato MM:SS) comienza a avanzar segundo a segundo.  
* **AC2: Pausar el juego.**  
  * **Given** un juego en curso,  
  * **When** el usuario hace clic en el botón "Pausa",  
  * **Then** el cronómetro se detiene de inmediato, el tablero de Sudoku se vuelve invisible o se cubre con una pantalla superpuesta, y el botón "Pausa" cambia a "Reanudar".  
* **AC3: Reanudar tras pausa.**  
  * **Given** un juego en estado de pausa,  
  * **When** el usuario hace clic en "Reanudar",  
  * **Then** el tablero vuelve a ser visible y el cronómetro retoma la cuenta desde el segundo exacto en que se detuvo.

Requisito Base: RUI-005 \- Área de Configuración y Perfil

**Historia de Usuario (US-13):** Como usuario, quiero acceder a una sección de perfil/configuración donde pueda ajustar opciones previas a la partida o gestionar mi cuenta.

* **AC1: Acceso a configuración.**  
  * **Given** que el usuario está autenticado,  
  * **When** navega al área de configuración/perfil,  
  * **Then** puede visualizar su nombre de usuario, cerrar sesión, y configurar preferencias (como el nivel de dificultad predeterminado para futuras partidas de Sudoku).

# **CONSULTAS SOBRE PREFERENCIAS DE LA APP**

Plataformas y Entorno de Ejecución: ¿La aplicación está pensada para ser exclusivamente web, móvil (iOS/Android mediante desarrollo nativo o multiplataforma), o de escritorio?  
WEB

Escalabilidad y Tráfico Esperado: ¿Qué volumen de usuarios estimas tener? No es lo mismo diseñar una persistencia de partidas para 100 usuarios concurrentes que para 100.000  
MÁXIMO 100 USUARIOS

Conectividad y Disponibilidad: Teniendo en cuenta que el sistema debe guardar automáticamente el estado actual del Sudoku, ¿es un requisito estricto que el usuario pueda jugar en modo offline y que el progreso se sincronice en la nube una vez recupere la conexión?    
NO SE REQUIERE MODO OFFLINE

Restricciones Tecnológicas del Equipo: Sabiendo que el ciclo de vida es en Cascada, ¿el equipo de desarrollo tiene alguna restricción, experiencia previa o preferencia por un stack tecnológico concreto (por ejemplo, React, Flutter, Firebase, AWS, Node.js)? ¿Hay un presupuesto de infraestructura muy ajustado?    
EL PRESUPUESTO DE INFRAESTRUCTURA DEBE SER GRATUITO.

Seguridad y Normativas: Además de requerir contraseñas de al menos 8 caracteres, ¿la aplicación estará sujeta a normativas de privacidad estrictas (como la GDPR en Europa) o se contempla escalar a inicios de sesión con terceros (OAuth con Google/Apple) a corto plazo?  
SE PODRÁ INICIAR SESIÓN CON UNA CUENTA DE GOOGLE.

# **REQUISITOS NO FUNCIONALES**

### **1\. Entorno de Ejecución y Usabilidad**

* **RNF-01 (Plataforma):** La aplicación debe estar basada exclusivamente en entorno Web, siendo compatible con las versiones recientes de los navegadores principales (Google Chrome, Mozilla Firefox, Apple Safari y Microsoft Edge).  
* **RNF-02 (Diseño Responsivo):** Aunque sea un juego de navegador, la interfaz de usuario (UI) debe adaptarse correctamente a diferentes tamaños de pantalla (móviles, tablets y monitores de escritorio).

### **2\. Infraestructura y Costes**

* **RNF-03 (Presupuesto Cero):** Todos los servicios de alojamiento (hosting), base de datos y autenticación deben operar estrictamente bajo la capa gratuita (*Free Tier*) de los proveedores en la nube seleccionados. El coste de mantenimiento mensual de la infraestructura debe ser 0€.  
* **RNF-04 (Despliegue):** El proceso de despliegue de la aplicación web debe poder automatizarse o realizarse de forma sencilla en plataformas de alojamiento estático o *Serverless* gratuitas.

### **3\. Rendimiento y Escalabilidad**

* **RNF-05 (Concurrencia):** El sistema (especialmente la base de datos y el servidor/backend) debe ser capaz de soportar hasta 100 usuarios simultáneos interactuando con la aplicación sin experimentar tiempos de espera superiores a 2 segundos en el guardado de partidas.  
* **RNF-06 (Guardado no bloqueante):** El autoguardado del estado del Sudoku debe realizarse en segundo plano de forma asíncrona, sin congelar la interfaz de usuario ni interrumpir la experiencia de juego.

### **4\. Disponibilidad y Conectividad**

* **RNF-07 (Dependencia de Red):** La aplicación requiere una conexión a internet activa para su funcionamiento. El sistema debe mostrar un mensaje claro de "Error de conexión" si el usuario pierde el acceso a la red, impidiendo realizar movimientos que no se puedan guardar en la nube.

### **5\. Seguridad y Autenticación**

* **RNF-08 (Autenticación de Terceros):** El sistema debe integrar el protocolo OAuth 2.0 para permitir el inicio de sesión único (SSO) utilizando cuentas de Google.  
* **RNF-09 (Autenticación Clásica):** Si se mantiene un sistema de registro nativo además del de Google, las contraseñas exigidas deben tener una longitud mínima de 8 caracteres y almacenarse en la base de datos utilizando algoritmos de *hashing* seguros (ej. bcrypt). Las contraseñas nunca deben guardarse en texto plano.  
* **RNF-10 (Privacidad de Datos):** La base de datos debe implementar reglas de seguridad a nivel de fila o documento para garantizar que un usuario autenticado solo pueda leer y escribir la información de sus propias partidas de Sudoku, y nunca las de otros jugadores.

# **SDA**

# **Documento de Diseño de Arquitectura: SudokuMaster**

## **1\. Introducción**

Este documento describe la arquitectura técnica para la aplicación **SudokuMaster**. El objetivo es proporcionar una solución robusta, escalable hasta 100 usuarios concurrentes y con coste de infraestructura 0€ (Free Tier).

## **2\. Stack Tecnológico**

| Capa | Tecnología | Función   |
| :---- | :---- | :---- |
| Frontend | React.js \+ Vite | Interfaz de usuario y lógica del motor de Sudoku. |
| Hosting | Vercel | Despliegue de la SPA y optimización de entrega (CDN). |
| BaaS | Supabase | Gestión de base de datos, Auth y API REST automática. |
| Base de Datos | PostgreSQL | Almacenamiento relacional con soporte para JSONB. |

## **3\. Arquitectura del Sistema**

La arquitectura sigue un modelo de **Cliente Pesado**. La mayor parte de la computación (generación del tablero, validación de reglas de Sudoku y gestión del temporizador) ocurre en el navegador del cliente para minimizar el consumo de recursos del servidor (Edge Functions).

### **3.1. Gestión de Estado**

Se utilizará un estado global para manejar el progreso de la partida actual. El sistema de autoguardado implementará una estrategia de *debouncing* (ej. cada 5 segundos de inactividad o tras 5 movimientos) para evitar saturar la cuota de escritura de la base de datos.

## **4\. Modelo de Datos**

La base de datos PostgreSQL en Supabase contará con las siguientes tablas principales:

| Tabla | Descripción   |
| :---- | :---- |
| **profiles** | Extensión de la tabla de usuarios de Supabase (alias, estadísticas globales). |
| **games** | ID de partida, user\_id (FK), nivel de dificultad, estado (JSONB), tiempo transcurrido y fecha de creación. |

## **5\. Seguridad y Autenticación**

Se implementará **Supabase Auth** con los siguientes proveedores:

* Google OAuth (Federated Identity).  
* Correo y Contraseña (Native Auth).

La seguridad de los datos está garantizada mediante **Row Level Security (RLS)**. La política definida será:

CREATE POLICY "Los usuarios solo ven sus propias partidas"   
ON games FOR ALL   
USING (auth.uid() \= user\_id);

## **6\. Estrategia de Despliegue**

El proyecto se integrará con un repositorio en GitHub. Cada *push* a la rama main disparará un despliegue automático en Vercel. Las variables de entorno (URL de Supabase y Anon Key) se gestionarán de forma segura en el panel de control de Vercel.

## **7\. Arquitectura de Software (Frontend)**

Para la estructura interna del código en React, se adoptará un **enfoque híbrido** que combina la organización visual de **Feature-Sliced Design (FSD)** con la robustez lógica de una **Arquitectura Hexagonal** para el motor del juego.

Esta decisión se fundamenta en la necesidad de aislar completamente las reglas matemáticas del Sudoku de la interfaz gráfica, permitiendo realizar pruebas unitarias sobre el juego sin depender del renderizado de React o de la base de datos.

### **7.1. Patrones Aplicados**

1. **Núcleo de Dominio (Hexagonal):** Toda la lógica de generación de tableros, validación de celdas y comprobación de victoria residirá en módulos de TypeScript puro. Este código no conocerá la existencia de React, el DOM ni Supabase.  
2. **Feature-Sliced Design (FSD):** El resto de la aplicación (UI y estado) se dividirá funcionalmente en módulos autónomos (ej. Autenticación, Juego, Historial) en lugar de capas técnicas (ej. todas las vistas juntas, todos los controladores juntos).

### **7.2. Estructura de Directorios Propuesta**

La estructura de carpetas dentro del directorio src/ será la siguiente:

Plaintext  
src/  
├── app/                 \# Capa de inicialización  
│   ├── providers/       \# Contextos globales (ej. AuthProvider)  
│   ├── router/          \# Configuración de rutas (React Router)  
│   └── styles/          \# Estilos globales y variables CSS/Tailwind  
│  
├── domain/              \# NÚCLEO aisalado: Lógica pura del Sudoku (Independiente de React)  
│   ├── sudokuEngine.ts  \# Algoritmos de generación y resolución de tableros  
│   ├── validator.ts     \# Reglas matemáticas (validación de filas, columnas y cuadrantes)  
│   └── types.ts         \# Interfaces de las entidades de negocio (Board, Cell, Move)  
│  
├── features/            \# Módulos funcionales de la aplicación  
│   ├── auth/            \# Todo lo relacionado con el Login y Perfil de usuario  
│   │   ├── components/  \# Formularios de login, botones OAuth  
│   │   └── hooks/       \# Lógica de conexión con Supabase Auth  
│   ├── game/            \# Interfaz específica de la partida actual  
│   │   ├── components/  \# BoardUI, Numpad, Timer, Controles  
│   │   └── store/       \# Estado local de la partida (Zustand o Context) conectando con el 'domain'  
│   └── history/         \# Historial de partidas guardadas  
│       └── components/  \# Lista de partidas, estadísticas  
│  
├── shared/              \# Recursos genéricos y reutilizables  
│   ├── ui/              \# Componentes de diseño base (Button, Modal, Card)  
│   ├── api/             \# Configuración del cliente de Supabase  
│   └── utils/           \# Funciones de formateo (ej. formato de tiempo del temporizador)  
│  
└── main.tsx             \# Punto de entrada principal de la aplicación React

### **7.3. Flujo de Dependencias (Regla Estricta)**

Para mantener la arquitectura limpia, se establecerá la siguiente regla de dependencias:

* Los módulos en features/ pueden importar de shared/ y de domain/.  
* Los módulos en domain/ **NO pueden importar** absolutamente nada de features/, app/ o dependencias externas como React o Supabase. Solo dependen de TypeScript puro.  
* Los módulos en shared/ no deben importar nada de features/ ni de domain/.

# **Roadmap**

# **Planificación de Iteraciones y Features: SudokuMaster**

## **1\. Desglose Estratégico de Hitos (Milestones)**

Para garantizar un desarrollo robusto y guiado por pruebas (TDD), el proyecto se dividirá en los siguientes hitos, priorizando la lógica de negocio pura antes de acoplarla a la interfaz gráfica o la base de datos:

* **Hito 1: Configuración Base e Infraestructura (App / Shared)**  
  * **Objetivo:** Establecer los cimientos del proyecto React \+ Vite, configurar la estructura de carpetas FSD (app/, domain/, features/, shared/) y preparar el entorno de testing (Jest/Vitest).  
  * **Testabilidad:** Se valida que la compilación básica funcione y que el pipeline de despliegue continuo (CI/CD) hacia Vercel esté conectado.  
* **Hito 2: Lógica de Dominio (Núcleo Hexagonal)**  
  * **Objetivo:** Programar el motor del Sudoku en TypeScript puro, sin dependencias de React ni Supabase. Esto incluye la generación de tableros válidos, la validación matemática de celdas (filas, columnas, cuadrantes) y la comprobación de victoria.  
  * **Testabilidad:** Creación de baterías de tests unitarios exhaustivos para asegurar que el generador respeta los niveles de dificultad (Fácil, Medio, Difícil) y que el validador detecta correctamente las violaciones de reglas.  
* **Hito 3: Autenticación, Seguridad y Base de Datos (Supabase)**  
  * **Objetivo:** Configurar el proyecto en Supabase, establecer las tablas profiles y games, aplicar las políticas de Row Level Security (RLS) e implementar los flujos de registro, login (nativo y Google OAuth) y recuperación de contraseña.  
  * **Testabilidad:** Pruebas de integración sobre los hooks de autenticación y tests de seguridad para validar que un usuario no puede acceder a las partidas de otro.  
* **Hito 4: Interfaz de Usuario Core (UI del Juego)**  
  * **Objetivo:** Desarrollar los componentes visuales del tablero, el teclado numérico (Numpad) y el cronómetro. Se acoplará la lógica de dominio (Hito 2\) con el estado de la aplicación (Zustand/Context) para permitir la jugabilidad.  
  * **Testabilidad:** Pruebas de componentes (ej. React Testing Library) para verificar la diferenciación visual entre pistas y números del usuario, el resaltado de errores y el funcionamiento del botón de pausa.  
* **Hito 5: Persistencia de Datos y Autoguardado**  
  * **Objetivo:** Conectar el estado de la partida en curso con Supabase para implementar el autoguardado asíncrono (debouncing), asegurando que el progreso no se pierda y no se congele la interfaz.  
  * **Testabilidad:** Pruebas E2E (End-to-End) simulando recargas de página para verificar que la sesión se mantiene y el tablero se reanuda en el estado exacto.  
* **Hito 6: Historial, Dashboard y Cierre**  
  * **Objetivo:** Construir la sección "Mi Progreso", listando las partidas iniciadas y completadas, y pulir el área de configuración de usuario.

# **\_Feature/Issue**

![Una mesa de trabajo profesional con post-its y un diagrama de flujo esquemático, representando la gestión de proyectos][image3]

# **Feature/Issue**

\[Escribe aquí una descripción lo más extensa posible de la feature a implementar o la issue que corregir\]

* **Rama de Git (Nueva):** \[Escriba aquí el nombre de la nueva rama de Git\]  
* **Responsable:** Person

# **Flujo de Trabajo**

La siguiente tabla detalla cada paso clave del flujo de trabajo, permitiendo asignar responsables, establecer fechas límite y enlazar recursos relevantes.

| Paso | Descripción | Fecha Límite | Estado | Enlace al Recurso |
| :---- | :---- | :---- | :---- | :---- |
| Issue/Feature | Definición inicial del problema, error o nueva funcionalidad. | Date | No iniciado | File |
| Plan | Elaboración del enfoque técnico y diseño de la solución. | Date | No iniciado  | File |
| Tareas | Desglose del Plan en tareas manejables y asignables. | Date | No iniciado | File |
| Código | Implementación de la solución (codificación). | Date | No iniciado |  |
| PR (Pull Request) | Solicitud para fusionar el código en la rama principal. | Date | No iniciado |  |
| Review | Revisión del código por pares para asegurar la calidad y el cumplimiento de estándares. | Date | No iniciado |  |

# **Notas Adicionales**

Utilice esta sección para añadir comentarios, contexto o información importante relacionada con el proceso o las entradas de la tabla.

* El objetivo es mantener una trazabilidad clara de cada elemento de trabajo.  
* Es recomendable adjuntar la ubicación del repositorio y del evento principal del proyecto, por ejemplo, la reunión de planificación de la próxima iteración Calendar event.