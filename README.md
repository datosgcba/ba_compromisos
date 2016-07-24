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
* Navegar hacia la url

=======

Bienvenido al Repositorio de Entregas de los proyectos a la ASI, denominado GIT.
La definición de como se entrega y que documentos deben entregar se encuentra en la carpeta denominada "Instructivos-Documentos ASI" donde encontrarán un instructivo del GIT que explica el proceso y donde subir cada archivo. 
Adicionalmente se encuentran los templates de guía para completar la documentación del proyecto para avanzar con las tareas y actividades de la ASI como Documento de Arquitectura, Manual de instalación, Documento de Alcance y funcionamiento, etc.

Es obligatorio que contemplen que  el sistema operativo que deben utilizar es **RedHat 6.5**. Puede descargar la versión gratuita del mismo (Centos 6.5) desde el siguiente enlace [Descargar](https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box)

Recuerden que **ninguno** de los ambientes productivos cuentan con acceso a internet. Si para el correcto funcionamiento de la aplicación es necesario comunicarse con servidores externos los mismos debe enumerarse en el manual de instalación indicando dominio/puerto que debe estar habilitado justificando su uso en cada caso. 

NOTA:  La entrega por este medio no reemplaza los compromisos de entrega relacionado con la contratación,es decir, esto es un requerimiento obligatorio adicional a la entrega formal.
