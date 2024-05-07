# Build Runner

## Build The Runner

### CLI

```bash
docker build -t cybicom/dockerize-boot-services:1.0.0 -f Dockerfile.cli
```

### Slim

```bash
docker build -t cybicom/dockerize-boot-services:1.0.0 .
```

## Publish The Runner

```bash
docker push cybicom/dockerize-boot-services:1.0.0
```

```bash
docker push cybicom/dockerize-boot-services:slim-1.0.0
```

## About 

This Docker image is designed to automate the building of Spring Boot repositories into Docker images using JDK 21 and Gradle 8.7, and subsequently push them to the host's Docker registry. It supports selective building and tagging through a CLI if enabled.

### Quick Start

To use this image, ensure you have Docker installed on your host machine. Pull the image from Docker Hub and run a container with the required volume mounts and environment variables.

#### Pulling the Image

```bash
docker pull cybicom/dockerize-boot-services:1.0.0
```

```bash
docker pull cybicom/dockerize-boot-services:slim-1.0.0
```

#### Running the Container

##### Default with CLI

Use the following command to run the container:

```bash
docker run -it -v %PROJECTS%:/app/projects -v /var/run/docker.sock:/var/run/docker.sock -e CLI cybicom/dockerize-boot-services:1.0.0
```

##### Slim Without

* clone the repo
* run: npm install


```bash
node run-docker.mjs
```  

This has the cli on the outside and will use the slim version and one run docker image for each project selected.  

The script executes this docker run command for each selected project:

```bash
docker run -it -v %PROJECTS%:/app/projects -v /var/run/docker.sock:/var/run/docker.sock -e PROJECT_NAME=%PROJECT_NAME% -e DOCKER_TAG=%DOCKER_TAG% cybicom/dockerize-boot-services:slim-1.0.0
```  

This version is used by repo ci/cd, as a build runner. 

### Volume Mounts

- **Projects Directory**: Mount your local projects directory to `/app/projects` in the container. Replace `%PROJECTS%` with the path to your projects directory on your host.
  
- **Docker Socket**: Mounts the Docker socket to allow the container to communicate with the host Docker daemon, enabling it to push new images to the host's Docker registry.

### Environment Variables

- **CLI**: Set this environment variable to `true` to enable the command-line interface features within the container. When enabled, you can choose specific repositories to build and specify a tag version. If not enabled, all repositories are built and published with the 'latest' tag. Only available in non-slim version

- **PROJECT_NAME**: Specify a single project name, within `/app/projects` if you want to build just one project. This is typically used with automation or scripts that target specific projects.

- **DOCKER_TAG**: Use this to define a custom tag for the built Docker images. Defaults to 'latest' if not specified.

### Usage

After running the container, the behavior depends on the provided environment variables:
- **CLI Enabled**: Allows you to select specific Spring Boot projects to build and to specify a tag version for each.
- **CLI Disabled**: Automatically builds and publishes all detected Spring Boot projects using JDK 21 and Gradle 8.7 with the tag 'latest'.
- **PROJECT_PATH Specified**: If the `-e PROJECT_PATH` is provided, the container will build only the specified project. This is useful for targeted builds, such as in automated pipelines or for specific deployment tasks.

This process simplifies the deployment of multiple Spring Boot applications by automating their containerization.

For more information and updates, visit either     
[Docker Hub](https://hub.docker.com/repository/docker/cybicom/dockerize-boot-services/general)
[Github Repo](https://github.com/fluidnotions/publish-docker-images-using-jdk-21-and-gradle-8.7)
