# Use an official lightweight Python image.
FROM python:3.8-slim

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Copy the script that checks Docker connectivity
COPY check_docker.py /usr/src/app/check_docker.py

# Set the working directory
WORKDIR /usr/src/app

# Command to run on container start
CMD [ "python", "./check_docker.py" ]
