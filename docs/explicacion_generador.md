# ¿Cómo se crea un Sudoku? (Explicación para todos)

¿Alguna vez te has preguntado cómo una computadora inventa un Sudoku desde cero? No es solo poner números al azar; es un proceso de "arte matemático" que sigue tres pasos principales. Aquí te lo explicamos de forma sencilla.

---

## 1. El lienzo lleno: Crear un tablero resuelto

Imagina que quieres pintar un cuadro, pero tienes prohibido que el mismo color se repita en la misma fila, columna o cuadro pequeño.

La computadora empieza con un tablero vacío y elige un número al azar para la primera casilla. Luego busca uno para la segunda, y así sucesivamente. 
- **¿Qué pasa si se equivoca?** Si llega a un punto donde no puede poner ningún número sin romper las reglas, la computadora "vuelve atrás" (como si borrara sus últimos pasos con una goma) y prueba un número diferente. 
- A este proceso de probar, fallar, retroceder y volver a intentar se le llama **Backtracking**. 

Al final de este paso, tenemos un Sudoku completo y perfecto, pero... ¡está todo resuelto! No es un juego todavía.

## 2. Esculpir el puzzle: Quitar números

Ahora viene la parte divertida: empezar a quitar números para que tú los rellenes. Pero no podemos quitarlos a lo loco.

### El secreto de la solución única
Un buen Sudoku **solo debe tener una forma posible de resolverse**. Si quitas demasiados números, podrías crear un tablero que se pueda completar de dos o tres maneras distintas, y eso frustraría a cualquier jugador.

Para evitar esto, cada vez que la computadora quiere quitar un número, hace un truco:
1. Quita el número temporalmente.
2. Se pregunta a sí misma: "¿Puedo resolver esto de otra forma?".
   - **¿Cómo lo sabe?** La computadora guarda en su memoria la solución original. Luego "olvida" el número que acaba de quitar e intenta rellenar el hueco usando de nuevo la técnica de probar y borrar (Backtracking), pero con una regla extra: **esta vez tiene prohibido llegar al mismo resultado que antes**. Si logra completar el tablero siguiendo un camino distinto, significa que el Sudoku tiene más de una solución.
3. Si la respuesta es "Sí, he encontrado otra forma de resolverlo", entonces **no quita ese número** y lo devuelve a su sitio para proteger la unicidad.
4. Si la respuesta es "No hay ninguna otra forma humana o matemática de completarlo", entonces lo quita definitivamente.

## 3. La estética: Simetría perfecta

Si te fijas en los Sudokus de los periódicos, verás que los números que aparecen suelen formar un dibujo simétrico. Si giras el periódico 180 grados, el dibujo de las pistas sigue siendo el mismo.

Nuestro generador hace lo mismo. Cuando decide quitar un número (por ejemplo, el de la esquina superior izquierda), automáticamente intenta quitar también su "pareja" en el lado opuesto (la esquina inferior derecha). Esto hace que el tablero se vea ordenado y profesional.

---

## Resumen de dificultades

El nivel de dificultad depende simplemente de **cuántos números logramos quitar** antes de que el tablero se vuelva imposible de resolver de una única forma:

- **Fácil**: Dejamos muchos números (~45 pistas). Es como un camino con muchas señales.
- **Medio**: Quitamos más (~35 pistas). Tienes que empezar a usar la lógica para avanzar.
- **Difícil**: Quitamos todos los que podemos, dejando el mínimo posible para que la solución siga siendo única (~29 pistas). ¡Solo para expertos!

---

¡Y eso es todo! La próxima vez que juegues, recuerda que detrás de esos números hubo una computadora "probando y borrando" miles de veces en una fracción de segundo para crear el reto perfecto para ti.
