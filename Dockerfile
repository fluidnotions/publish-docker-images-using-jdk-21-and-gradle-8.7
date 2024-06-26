# Set up the final image with Amazon Corretto JDK and Gradle
FROM amazoncorretto:21-alpine-jdk
# Install basic tools, Node.js dependencies, and Gradle
RUN apk add --no-cache curl tar bash libstdc++ docker-cli && \
    curl -L "https://services.gradle.org/distributions/gradle-8.7-bin.zip" -o gradle-8.7-bin.zip && \
    mkdir /opt/gradle && \
    unzip -d /opt/gradle gradle-8.7-bin.zip && \
    rm gradle-8.7-bin.zip
# Set environment variables for Gradle
ENV GRADLE_HOME=/opt/gradle/gradle-8.7
# Copy startup script and set permissions
COPY ./startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh
# Set the container's working directory
WORKDIR /app
# Command to run when the container starts (modify if needed)
CMD ["./startup.sh"]
# Expose volume for mounting Spring Boot projects
VOLUME ["/projects"]
