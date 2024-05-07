#!/bin/bash

find /app/projects/$PROJECT_NAME/.gradle -type f -name "*.lock" -exec rm {} +;
cd /app/projects/$PROJECT_NAME;
$GRADLE_HOME/bin/gradle bootBuildImage --no-build-cache -PimageTag=$IMAGE_TAG;