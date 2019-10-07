# [BA Compromisos](https://www.buenosaires.gob.ar/compromisos)

Proyecto de visualización y análisis de los compromisos del Gobierno de la Ciudad de Buenos Aires.

## Acerca de BA Compromisos 

BA Compromisos es un sitio web que busca informar a la ciudadanía acerca del avance de todos las compromisos de la ciudad.
El sistema es una aplicación frontend que toma información de un csv y crea visualizaciones de datos sobre el 
cumplimiento de los compromisos. Se genera una vista para cada compromiso y una vista general donde pueden verse todos. 
La misma tiene la capacidad de ser embebida dentro otras páginas correspondientes a organismos relacionados.

El proyecto original puede verse en [compromisos-site.buenosaires.gob.ar](https://compromisos-site.buenosaires.gob.ar/).
Mientras que el proyecto embebido dentro de la pagina del Gobierno de la Ciudad de Buenos Aires puede verse en [buenosaires.gob.ar/compromisos](https://www.buenosaires.gob.ar/compromisos)

Se trata de una aplicación enteramente de frontend (todos archivos estáticos), con diferentes vistas. 
Todos los datos son obtenidos desde dos archivos CSV estáticos. 
No tiene submits a backend con información ni acceso a base de datos.
Está construído como Single Page Application basado en Angular JS.

## Instrucciones para desarrolladores

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
