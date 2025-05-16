# Propuesta TP DSW

## Grupo
### Integrantes
* 49720 - Crocombette, Nahuel
* 49817 - Ayrton Ojeda 
* 51839 - Bruno Tomás León 
* 52948 - Lucio Albanesi 

### Repositorios
* [fullstack app](https://github.com/nahucroco/tp-dsw)

## Tema
### Descripción
Esta aplicación permite administrar eficientemente una biblioteca, gestionando libros, usuarios, préstamos y devoluciones. Facilita el control del inventario y el seguimiento de los movimientos de cada ejemplar. Su objetivo es optimizar el funcionamiento de la biblioteca y agilizar las tareas administrativas.


### Modelo
[imagen del modelo](./modelo_dsw.jpg)



## Alcance Funcional 

### Alcance Mínimo

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Libro<br>2. CRUD Usuario<br>3. CRUD Género<br>4. CRUD Idioma<br>5. CRUD Editorial<br>6. CRUD Autor<br>7. CRUD País|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Libro y CRUD Usuario<br>2. CRUD Préstamo {depende de} CRUD Libro y CRUD Usuario<br>3. CRUD ListaLectura {depende de} CRUD Usuario|
|Listado<br>+<br>detalle| 1. Listado de libros filtrado por género, muestra título y autor de libro => detalle CRUD Libro<br> 2. Listado de reservas filtrado por fecha y lector, muestra titulo y codigo de libro, estado y nombre del lector => detalle muestra datos completos de la reserva y del lector|
|CUU/Epic|1. Dejar una reseña<br>2. Sancionar a un usuario<br>3. Solicitar libro|
|Otros|1. Recomendaciones personalizadas|

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de lectores filtrado por sancion y cantidad de prestamos <br>2. Listado de préstamos filtrado por lector y libro, muestra nombre del lector, titulo y codigo del libro, y fechaInicio y fechaFin del prestamo|
|CUU/Epic|1. Cancelar reserva<br>2. Avisar disponibilidad de libro|
|Otros|1. Envío de recordatorio de devolución por email|

