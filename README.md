# compromisos-site

Dashboard de progreso de Compromisos de Gobierno.

## Probar el proyecto de manera standalone
* Clonar el proyecto
* Archivo de configuración: En /dist duplicar el archivo config.js.example con el nombre config.js.
* Instalar NodeJS: [Node Js Oficial](http://nodejs.org)
* Instalar http-server
`npm install http-server -g`
* Ir a Directorio /dist y ejecutar servidor
`cd dist`
`http-server ./`
* Abrir navegador 
Dirección: `http://localhost:8080`

## Para desarrolladores
* Archivo de configuración: En /app duplicar el archivo config.js.example con el nombre config.js.
* Correr la aplicación desde /app -> Hacer los cambios en /app y con live reloading se actualizará en http://localhost:10000
`grunt server`
* Compilar
`grunt build`

## Probar los compilados. 
* Levanta la aplicación en http://localhost:10000 desde /dist
`grunt server:dist`

## Instalar en producción
* Hacer clone y/o pull del proyecto 
* Apuntar la configuración del web server a la carpera /dist
* En /dist duplicar el archivo config.js.example con el nombre config.js.
