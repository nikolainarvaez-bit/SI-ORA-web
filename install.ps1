# install.ps1
# Script de instalación para SI-ORA Portable.
# Este script copia los archivos del paquete descomprimido a una carpeta de instalación
# y crea un acceso directo en el escritorio.

[CmdletBinding()]
param()

function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Write-ErrorAndExit($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
    exit 1
}

$scriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path -Path $scriptFolder)) {
    Write-ErrorAndExit "No se pudo determinar la carpeta del instalador."
}

$defaultInstallFolder = Join-Path $env:USERPROFILE "Documents\SI-ORA"
$installFolder = Read-Host "Ingrese la carpeta de instalación [Presione Enter para usar '$defaultInstallFolder']"
if ([string]::IsNullOrWhiteSpace($installFolder)) {
    $installFolder = $defaultInstallFolder
}

$installFolder = [System.IO.Path]::GetFullPath($installFolder)

Write-Info "Carpeta de instalación: $installFolder"

if (-not (Test-Path -Path $installFolder)) {
    New-Item -ItemType Directory -Path $installFolder -Force | Out-Null
    Write-Info "Carpeta creada."
}

$filesToCopy = Get-ChildItem -Path $scriptFolder -File | Where-Object { $_.Name -ne 'install.ps1' -and $_.Name -ne 'install.bat' }

foreach ($file in $filesToCopy) {
    $destination = Join-Path $installFolder $file.Name
    Copy-Item -Path $file.FullName -Destination $destination -Force
    Write-Info "Copiado: $($file.Name)"
}

$shortcutName = 'SI-ORA.lnk'
$desktopFolder = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopFolder $shortcutName
$targetPath = Join-Path $installFolder 'index.html'

try {
    $wShell = New-Object -ComObject WScript.Shell
    $shortcut = $wShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $targetPath
    $shortcut.WorkingDirectory = $installFolder
    $shortcut.WindowStyle = 1
    $shortcut.Description = 'Acceso directo a SI-ORA'
    $iconPath = Join-Path $installFolder 'logo.jpg'
    if (Test-Path $iconPath) {
        $shortcut.IconLocation = "$iconPath, 0"
    }
    $shortcut.Save()
    Write-Info "Acceso directo creado en el escritorio: $shortcutName"
} catch {
    Write-Host "[WARN] No se pudo crear el acceso directo automáticamente. Verifique permisos de COM." -ForegroundColor Yellow
}

Write-Info "Instalación completada. Abra 'SI-ORA.lnk' desde el escritorio para iniciar el programa."
Write-Host `"`nPuede abrir el directorio de instalación en el Explorador: $installFolder`"`

Write-Host "Presione Enter para cerrar..."
[void][System.Console]::ReadLine()
