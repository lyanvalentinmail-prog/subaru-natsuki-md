# functions/

Aquí van las **funciones de apoyo** que usan los comandos de `commands/` cuando necesitan
datos o procesos externos.

Reglas del proyecto:

1. **Preferir siempre soluciones sin API** (lógica local, datos en archivos JSON propios,
   generadores o algoritmos que funcionen offline).
2. Solo si no hay otra opción, usar una API externa, y dejar la clave en variables de
   entorno (nunca escrita en el código ni subida a GitHub).
3. Esta carpeta **no** se carga como comandos: el bot solo lee `commands/`.

Ejemplo de organización (cuando se necesite):

```
functions/
  ai/          -> funciones para comandos de commands/ai/
  downloads/   -> funciones para commands/downloads/
  ...
```
