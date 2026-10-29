# SI-ORA Google Workspace Add-on

Este complemento permite guardar y abrir proyectos ORA directamente desde Google Drive usando Google Workspace.

## Estructura

- `Code.gs`: lógica principal del addon.
- `appsscript.json`: configuración del proyecto Apps Script.

## Requisitos

1. Tener una cuenta de Google Workspace.
2. Crear un proyecto de Apps Script.
3. Copiar el contenido de `Code.gs` y `appsscript.json` al proyecto.

## Cómo instalar

1. Abre Google Drive y crea un nuevo proyecto de Apps Script.
2. Copia `Code.gs` en el editor.
3. Copia `appsscript.json` como configuración del proyecto.
4. En el editor de Apps Script, selecciona `Deploy > Test deployments`.
5. Prueba el complemento desde el panel de **Add-ons** de Google Drive o Gmail.

## Cómo usar

- `Guardar proyecto en Drive`: crea un archivo `.siora.json` en tu Drive.
- `Listar proyectos ORA en Drive`: muestra los archivos guardados con extensión `.siora.json`.
- `Abrir`: carga el contenido JSON de un proyecto.

## Limitaciones

- Este complemento es un punto de partida.
- Para integrar completamente con una app web de ORA, se necesita un backend adicional o una API para sincronizar datos.
