@echo off
REM DatioLabs Retail - Build Installer (Batch wrapper)
REM Ejecuta: build-installer.bat [clean] [skip-frontend] [version]

set VERSION=0.1.0
set CLEAN=0
set SKIP_FRONTEND=0

for %%a in (%*) do (
    if /i "%%a"=="clean" set CLEAN=1
    if /i "%%a"=="skip-frontend" set SKIP_FRONTEND=1
    if /i "%%a"=="help" goto :HELP
    if "%%~a"=="/v:*" set VERSION=%%~a
    if "%%~a"=="-v:*" set VERSION=%%~a
)

echo ========================================
echo   DatioLabs Retail - Build Installer
echo   Version: %VERSION%
echo ========================================
echo.

REM Check Rust
where rustc >nul 2>&1
if errorlevel 1 (
    echo ERROR: Rust no encontrado. Instale desde https://rustup.rs/
    exit /b 1
)
echo [OK] Rust encontrado

REM Check Cargo
where cargo >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cargo no encontrado
    exit /b 1
)
echo [OK] Cargo encontrado

REM Check Node
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no encontrado. Instale v20+ desde https://nodejs.org/
    exit /b 1
)
echo [OK] Node.js encontrado

REM Check npm
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm no encontrado
    exit /b 1
)
echo [OK] npm encontrado

echo.

REM Generate icons if ImageMagick available
where magick >nul 2>&1
if not errorlevel 1 (
    echo Generando iconos...
    magick icons/icon.png -define icon:auto-resize=256,128,64,48,32,16 icons/icon.ico
    magick icons/icon.png -resize 150x57! icons/header.bmp
    magick icons/icon.png -resize 498x312! icons/welcome.bmp
    echo [OK] Iconos generados
) else (
    echo [WARN] ImageMagick no encontrado - use iconos pregenerados
)
echo.

REM Build frontend
if %SKIP_FRONTEND%==0 (
    echo Building frontend...
    cd /d "..\ui"
    if not exist node_modules (
        echo Instalando dependencias...
        npm ci
    )
    npm run build
    if not exist dist (
        echo ERROR: Build del frontend fallo
        exit /b 1
    )
    echo [OK] Frontend build completado
    cd /d "..\datiolabs-ui"
) else (
    echo Saltando build del frontend
)
echo.

REM Build Tauri
echo Building Tauri app...
if %CLEAN%==1 (
    echo Limpiando builds anteriores...
    cargo clean
)
set TAURI_VERSION=%VERSION%
cargo tauri build --target x86_64-pc-windows-msvc

set INSTALLER=target\release\bundle\nsis\DatioLabs Retail_%VERSION%_x64-setup.exe
if not exist "%INSTALLER%" (
    set INSTALLER=target\release\bundle\nsis\DatioLabs_Retail_%VERSION%_x64-setup.exe
)
if not exist "%INSTALLER%" (
    echo ERROR: Instalador no generado
    exit /b 1
)

echo.
echo ========================================
echo  BUILD COMPLETADO EXITOSAMENTE
echo  Instalador: %INSTALLER%
echo ========================================
exit /b 0

:HELP
echo Uso: build-installer.bat [clean] [skip-frontend] [/v:version]
echo.
echo   clean          - Ejecuta cargo clean antes de compilar
echo   skip-frontend  - Salta el build del frontend (usa dist existente)
echo   /v:X.Y.Z       - Establece la version (default: 0.1.0)
echo.
echo Ejemplos:
echo   build-installer.bat
echo   build-installer.bat clean
echo   build-installer.bat /v:1.0.0
echo   build-installer.bat clean skip-frontend /v:1.0.0