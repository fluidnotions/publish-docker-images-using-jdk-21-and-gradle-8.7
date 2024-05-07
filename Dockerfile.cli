# Stage 1: Install Node.js
FROM node:20-alpine as node_base
# Stage 2: Set up the final image with Amazon Corretto JDK and Gradle
FROM amazoncorretto:21-alpine-jdk
# Install basic tools, Node.js dependencies, and Gradle
RUN apk add --no-cache curl tar bash libstdc++ docker-cli && \
    curl -L "https://services.gradle.org/distributions/gradle-8.7-bin.zip" -o gradle-8.7-bin.zip && \
    mkdir /opt/gradle && \
    unzip -d /opt/gradle gradle-8.7-bin.zip && \
    rm gradle-8.7-bin.zip
# Set environment variables for Gradle
ENV GRADLE_HOME=/opt/gradle/gradle-8.7
ENV PATH=$PATH:$GRADLE_HOME/bin
# Copy Node.js binaries and libraries from the first stage
COPY --from=node_base /usr/local/bin /usr/local/bin
COPY --from=node_base /usr/local/lib /usr/local/lib
# Copy the .mjs CLI app into the image
COPY ./dist/index.mjs /app/index.mjs
# Set the container's working directory
WORKDIR /app
# Set permissions to execute the .mjs script
RUN chmod +x /app/index.mjs
# Command to run when the container starts (modify if needed)
CMD ["node", "index.mjs"]
# Expose volume for mounting Spring Boot projects
VOLUME ["/projects"]
