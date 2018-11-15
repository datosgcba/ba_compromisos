# Actualización

1. Ubicarse en la carpeta raíz del proyecto, dentro del servidor y ejecutar el pull al tag de la versión indicada.`git fetch --tags` y luego `git checkout v1.8.2RC6`.
2. Testear el correcto funcionamiento de todo ingresando a la URL. Para prod es:[https://compromisos-site.buenosaires.gob.ar/](https://compromisos-site.buenosaires.gob.ar/), deberían verse unos botones amarillos y poder renderizar las páginas de ejemplo para ser luego embebidas.
3. Modificar Archivo de Configuración por única vez:
 * Está en formato javascript.
 * Dentro de la carpeta 'dist': Crear una copia de `config.js.example` y llamarla `config.js`.
 * Modificar este nuevo archivo con los datos correspondientes:
  1. BASE_URL: será la url del conector de la API ( utilizar `https://compromisos-csv.buenosaires.gob.ar` ).
  2. HOME_CSV: url absoluta del archivo csv que alimenta la home, el buscador y las internas. (Si no se tiene aún, dejar los de ejemplo). `https://recursos-data.buenosaires.gob.ar/ckan2/compromisos/master_compromisos.csv`
  3. OBRAS_CSV: url absoluta del archivo csv que alimenta el mapa de obras. (Si no se tiene aún, dejar los de ejemplo). `https://recursos-data.buenosaires.gob.ar/ckan2/compromisos/deploy/mapa_compromisos.csv`
  4. ILUSTRACIONES_CSV: url absoluta del archivo csv que alimenta las ilustraciones de compromisos. (Si no se tiene aún, dejar los de ejemplo). `https://recursos-data.buenosaires.gob.ar/ckan2/compromisos/deploy/visualizaciones_compromisos.csv`

4. Con esto se considera concluída la actualización.
