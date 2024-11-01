#!/bin/bash

echo "Starting deployment..."

# Remove unnecessary files and folders
echo "Cleaning up unnecessary files..."
rm -rf node_modules
rm -rf src
rm -rf .git
rm -rf .gitignore
rm -rf package.json
rm -rf package-lock.json
rm -rf README.md

# Ensure the dist directory exists
if [ -d "dist" ]; then
    echo "Deploying /dist contents..."
    # Copy only the contents of the /dist folder to the deployment directory
    cp -r dist/* ./  # Adjust the path as needed
else
    echo "Error: /dist directory does not exist."
    exit 1
fi

echo "Deployment completed successfully!"