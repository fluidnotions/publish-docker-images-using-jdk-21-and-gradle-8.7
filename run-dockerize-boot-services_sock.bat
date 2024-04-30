@echo off
echo This is designed to run on Windows. If you are on Linux, you will need to modify the script accordingly.
if "%~1"=="" (
    set PROJECTS=C:\dev\roms-repos\dockerize\spring-boot-default-repos
    echo No directory provided. Using default: %PROJECTS%
) else (
    set PROJECTS=%~1
)

echo Using PROJECTS directory: %PROJECTS%

docker run -it -v %PROJECTS%:/app/projects -v /var/run/docker.sock:/var/run/docker.sock -e CLI dockerize-boot-services:1.0.0

PAUSE
