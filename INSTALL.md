# Instalación

## URL
[https://compromisos-site.buenosaires.gob.ar/](https://compromisos-site.buenosaires.gob.ar/)

## Requerimientos
Sólo requiere un servidor web que pueda servir los contenidos. La aplicación contiene su código y las librerías que necesita, ya compiladas en la carpeta `/dist`.

* Apache o NGINX
* Varnish u otro caché de estáticos (opcional, ideal para mejorar la performance)
* No se requiere hacer build de ningún tipo.
* No se requiere salida a internet desde el servidor.
* No se requieren instalación de dependencias.
* No se requiere node, npm, ni bower. (los archivos de configuración presentes en este repositorio son utilizados sólo para etapa de desarrollo).
* Todo lo necesario está compilado y minificado en estáticos (html, css, js e imágenes), dentro de la carpeta `/dist`.

## Configuración
* La única configuración requerida es la creación del ARCHIVO de configuración.
* No requiere parámetros de ambiente del servidor, ni de proceso. Es todo web y js client – side.
* La única diferencia entre ambientes será el contenido del archivo config.js

## Instalación por primera vez
### Web
1. Crear un subdominio o definir la url donde vivirá la aplicación, podría ser: `https://compromisos-site.buenosaires.gob.ar`.
2. Definir un servidor con nginx o apache y clonar el proyecto usando `git clone`.
3. Apuntar las configuraciones del web server y subdominio a la carpeta `dist`, donde se encuentran los archivos finales y compilados.

### Archivo de Configuración
1. Está en formato javascript.
2. Dentro de la carpeta 'dist': Crear una copia de `config.js.example` y llamarla `config.js`.
3. Modificar este nuevo archivo con los datos correspondientes:
  3. BASE_URL: será la url del conector de la API ( utilizar `https://compromisos-csv.buenosaires.gob.ar` ).
  3. HOME_CSV: url absoluta del archivo csv que alimenta la home, el buscador y las internas. (Si no se tiene aún, dejar los de ejemplo). `http://recursos-data.buenosaires.gob.ar/ckan2/compromisos/master_compromisos.csv`

4. Testear el correcto funcionamiento de todo ingresando a la URL creada, deberían verse unos botones amarillos y poder renderizar las páginas de ejemplo para ser luego embebidas.

5. Con esto se considera concluída la instalación.


