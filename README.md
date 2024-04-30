# Build Runner

## Build The Runner

* docker build -t dockerize-boot-services:1.0.0 .

## About 

This Docker image is designed to automate the building of Spring Boot repositories into Docker images using JDK 21 and Gradle 8.7, and subsequently push them to the host's Docker registry. It supports selective building and tagging through a CLI if enabled.

### Quick Start

To use this image, ensure you have Docker installed on your host machine. Pull the image from Docker Hub and run a container with the required volume mounts and environment variables.

#### Pulling the Image

```bash
docker pull cybicom/dockerize-boot-services:1.0.0
```

#### Running the Container

Use the following command to run the container:

```bash
docker run -it -v %PROJECTS%:/app/projects -v /var/run/docker.sock:/var/run/docker.sock -e CLI dockerize-boot-services:1.0.0
```

### Volume Mounts

- **Projects Directory**: Mount your local projects directory to `/app/projects` in the container. Replace `%PROJECTS%` with the path to your projects directory on your host.
  
- **Docker Socket**: Mounts the Docker socket to allow the container to communicate with the host Docker daemon, enabling it to push new images the host's Docker registry.

### Environment Variables

- **CLI**: Set this environment variable to enable the command-line interface features within the container. When enabled, you can choose specific repositories to build and specify a tag version. If not enabled, all repositories are built and published with the 'latest' tag.

### Usage

After running the container, it will either:
- **CLI Enabled**: Allow you to select specific Spring Boot projects to build, and to specify a tag version for each.
- **CLI Disabled**: Automatically build and publish all detected Spring Boot projects using JDK 21 and Gradle 8.7 with the tag 'latest'.

This process simplifies the deployment of multiple Spring Boot applications by automating their containerization.

[Docker Hub](https://hub.docker.com/repository/docker/cybicom/dockerize-boot-services/general)