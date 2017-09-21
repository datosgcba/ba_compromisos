Este documento es una guia para actualizar "`Frontend Angular2 Promoción Horizontal`". Asegurese que existe la actualización de la versión actual a la versión a que quiere actualizar como "Actualización de `x.x.x` a `y.y.y`".

## Actualización de `0.1.0` a `0.1.1`

Realice los siguientes pasos para actualizar el código:

    git checkout .
    git fetch
    git fetch --tags
    git checkout v00.01.01

Ejecutar en el raiz del proyecto

	rm node_modules/* -r
	npm install

Luego reconstruya el código ejecutando

	npm run build

Y por último, restaure el `.htaccess` que se encuentra del de `PROJECT_ROOT/app`

	git checkout app/.htaccess

Finalmente reinicie el servidor.