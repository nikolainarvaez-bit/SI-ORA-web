# Instalación de SI-ORA Portable

## Qué hace este paquete

Este paquete es un instalador portátil para SI-ORA. Al descomprimirlo, puede ejecutar el script de instalación para copiar los archivos del proyecto a una carpeta de instalación y crear un acceso directo en el escritorio.

## Pasos de instalación

1. Descomprima el paquete en una carpeta local.
2. Abra la carpeta descomprimida.
3. Ejecute uno de los instaladores:
   - `install.ps1` (PowerShell)
   - `install.bat` (Windows batch)
4. Ingrese la carpeta de instalación cuando se le solicite o presione Enter para usar la carpeta predeterminada.
5. Al finalizar, el instalador creará un acceso directo `SI-ORA.lnk` en el escritorio.
6. Use el acceso directo para abrir `index.html` desde la carpeta de instalación.

## Requisitos

- Windows 10 o superior.
- Permisos para crear archivos en la carpeta de instalación seleccionada.
- Para `install.ps1`, es posible que deba permitir la ejecución de scripts de PowerShell:
  - Ejecute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` en PowerShell si aparece un error de ejecución.

## Recomendación

Guarde el paquete comprimido en una ubicación segura. Después de instalar, puede borrar la carpeta temporal donde descomprimió el paquete.
