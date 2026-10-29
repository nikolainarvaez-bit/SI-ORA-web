@echo off
REM install.bat
REM Script simple para instalar SI-ORA Portable en Windows.

setlocal enabledelayedexpansion

set "DEFAULT_INSTALL=%USERPROFILE%\Documents\SI-ORA"
set /p INSTALL_DIR=Ingrese la carpeta de instalacion [Presione Enter para usar %DEFAULT_INSTALL%]: 
if "%INSTALL_DIR%"=="" set "INSTALL_DIR=%DEFAULT_INSTALL%"

REM Crear carpeta de instalacion
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

REM Copiar archivos excepto el instalador
for %%f in ("%~dp0*.*") do (
    if /i not "%%~nxf"=="install.bat" if /i not "%%~nxf"=="install.ps1" (
        copy /y "%%~f" "%INSTALL_DIR%" >nul
    )
)

echo Copiados los archivos a %INSTALL_DIR%

echo Creando acceso directo en el Escritorio...
set "SHORTCUT=%USERPROFILE%\Desktop\SI-ORA.lnk"
set "TARGET=%INSTALL_DIR%\index.html"

powershell -NoProfile -Command "
$WshShell = New-Object -ComObject WScript.Shell;
$Shortcut = $WshShell.CreateShortcut('%SHORTCUT%');
$Shortcut.TargetPath = '%TARGET%';
$Shortcut.WorkingDirectory = '%INSTALL_DIR%';
$Shortcut.Description = 'Acceso directo a SI-ORA';
$Shortcut.Save();
"

echo Acceso directo creado en el escritorio.

echo Instalacion completada. Presione cualquier tecla para cerrar...
pause >nul
