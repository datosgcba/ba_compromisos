# [BA Compromisos](https://www.buenosaires.gob.ar/compromisos)

Proyecto de visualización y análisis de los compromisos del Gobierno de la Ciudad de Buenos Aires.

## Acerca de BA Compromisos 

BA Compromisos es un sitio web que busca informar a la ciudadanía acerca del avance de todos las compromisos de la ciudad.
El sistema es una aplicación frontend que toma información de un csv y crea visualizaciones de datos sobre el 
cumplimiento de los compromisos. Se genera una vista para cada compromiso y una vista general donde pueden verse todos. 
La misma tiene la capacidad de ser embebida dentro otras páginas correspondientes a organismos relacionados.

El proyecto original puede verse en [compromisos-site.buenosaires.gob.ar](https://compromisos-site.buenosaires.gob.ar/).
Mientras que el proyecto embebido dentro de la pagina del Gobierno de la Ciudad de Buenos Aires puede verse en
[buenosaires.gob.ar/compromisos](https://www.buenosaires.gob.ar/compromisos)

Se trata de una aplicación enteramente de frontend (todos archivos estáticos), con diferentes vistas. 
Todos los datos son obtenidos desde dos archivos CSV estáticos. 
No tiene submits a backend con información ni acceso a base de datos.
Está construído como Single Page Application basado en Angular JS.

## Archivos de datos

El sitio utiliza 2 archivos de datos para poder mostrar la información de los compromisos. El primer archivo `data.csv`
contiene datos de los compromisos, mientras que el segundo archivo `mapa.csv` contiene datos de la ubicación geografica
de estos. Ambos archivos son archivos de datos en tabla que siguen el formato 
[csv](https://es.wikipedia.org/wiki/Valores_separados_por_comas). Dentro del repositorio se incluye, a modo de muestra,
una copia de los archivos `data.csv` y `mapa.csv` utilizados en 
[buenosaires.gob.ar/compromisos](https://www.buenosaires.gob.ar/compromisos). Estos archivos deben ser reemplezados por
los archivos correspondientes a los compromisos de la institución que desea replicar el sitio.

A continuación se detalla la estructura que deben tener los archivos para el correcto funcionamiento del sitio.

### data.csv

| Nombre de la columna                   | Tipo de dato      | Detalle                                              |
| -------------------------------------- | ----------------- | ---------------------------------------------------- |
| `numero`                               | Numerico          | Numero identificador del compromiso                  |
| `compromiso`                           | Texto             | Descripción del compromiso                           |
| `titulo`                               | Texto             | Titulo del compromiso                                |
| `desc`                                 | Texto             | Descripción del compromiso                           |
| `categoria`                            | Texto             | Categoria del compromiso                             |
| `slug`                                 | Texto             | Categoria de uso interno del compromiso              |
| `area1`                                | Texto             | Area gubernamental del compromiso                    |
| `area2`                                | Texto             | Area gubernamental del compromiso                    |
| `area3`                                | Texto             | Area gubernamental del compromiso                    |
| `area4`                                | Texto             | Area gubernamental del compromiso                    |
| `embed_map_titulo`                     | Texto             | Titulo del mapa a embeber en el detalle del compromiso (opcional) |
| `embed_map_url`                        | Texto (url)       | Url del mapa a embeber (opcional)                    |
| `imagen`                               | Texto (url)       | Url de la imagen del compromiso                      |
| `cumplimiento`                         | Numerico          | Año del cumplimiento del compromiso                  |
| `cumplimiento_label`                   | Texto             | Detalle del año del cumplimiento                     |
| `porcentaje_completado`                | Numerico          | Porcentaje cumplido del compromiso                   |
| `cumplimiento_2`                       | Numerico          | Año del cumplimiento de la segunda fase del compromiso |
| `cumplimiento_2_label`                 | Texto             | Detalle del complimiento de la segunda fase          |
| `cumplimiento_2_porcentaje_completado` | Numerico          | Porcentaje complico de la segunda fase del complimiento |
| `url_interna`                          | Texto (url)       | Url externa para conocer mas sobre el compromiso     |

### mapa.csv

| Nombre de la columna          | Tipo de dato      | Detalle                                              |
| ----------------------------- | ----------------- | ---------------------------------------------------- |
| `direccion`                   | Texto             | Dirección del compromiso                             |
| `latitude`                    | Numerico          | Latittud de la ubicación del compromiso              |
| `longitude`                   | Numerico          | Longitud de la ubicación del compromiso              |
| `numero`                      | Numerico          | Numero identificador del compromiso                  |
| `compromiso`                  | Texto             | Descripción del compromiso                           |
| `accion`                      | Texto             | Descripción de la acción asociada al compromiso      |


## Instrucciones para modificar el sitio

Para realizar modificaciones al sitio actual, realizar los siguientes pasos

* Clonar el proyecto usando git
* Instalar NodeJS. Recomendamos usar [nvm](https://github.com/creationix/nvm). Una vez instalado `nvm` ejecutar 
`nvm use` en la carpeta raiz del proyecto para asegurarse de usar la misma version de node.
* Instalar las dependencias de npm via `npm install` en la carpeta raiz del proyecto 
* Instalar el cli de bower via `npm install -g bower`
* Instalar las dependencias de bower via `bower install` en la carpeta raiz del proyecto
* Ubicar los archivos de datos: `data.csv` y `mapa.csv` dentro de la carpeta `app`
* Levantar el servidor de desarrollo via `grunt serve` en la carpeta raiz del proyecto
* Hacer los cambios en /app y con live reloading se actualizará en http://localhost:10000
* Una vez que se cuenta con los cambios deseados, compilar assets via `grunt build` en la carpeta raiz del proyecto

### Adaptación estetica

En caso de necesitar agregar cambios al css del sitio, ubicarlos en el archivo `app/styles/custom.css`. Este archivo
tiene precedencia por sobre los estilos base del sitio. 

Una vez modificado este archivo, ejecutar el comando `grunt build` para empaquetar los cambios y disponibilizarlos
en la carpeta `dist` con el resto de los assets productivos.

## Levantar el proyecto en un ambiente productivo

### Requerimientos

Sólo requiere un servidor web que pueda servir los contenidos. 
La aplicación contiene su código y las librerías que necesita, ya compiladas en la carpeta `/dist`.

* Apache o NGINX
* Varnish u otro caché de estáticos (opcional, ideal para mejorar la performance)
* No se requiere hacer build de ningún tipo.
* No se requiere salida a internet desde el servidor.
* No se requieren instalación de dependencias.
* Todo lo necesario está compilado y minificado en estáticos (html, css, js e imágenes), dentro de la carpeta `/dist`.
* No requiere parámetros de ambiente del servidor, ni de proceso. Es todo web y js client – side.
* Es necesario contar con los dos archivos de datos `data.csv` y `mapa.csv` dentro de la carpeta `/dist`

### Instalación por primera vez

1. Crear un dominio o definir la url donde vivirá la aplicación, podría ser: 
`https://obras-site.buenosaires.gob.ar/`.
2. Definir un servidor con nginx o apache y clonar el proyecto usando 
`git clone https://github.com/datosgcba/ba_obras.git`.
3. Apuntar las configuraciones del web server y subdominio a la carpeta `dist`, donde se encuentran los archivos 
finales y compilados.
4. Embeber el sitio dentro de una pagina pre existente via un iframe. Ver ejemplo en 
[buenosaires.gob.ar/compromisos](https://www.buenosaires.gob.ar/compromisos)
