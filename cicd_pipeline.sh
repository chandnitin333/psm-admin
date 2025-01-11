#!/bin/bash

# Function to display environments
show_environments() {
    echo "Available Environments:"
    echo "1. Development"
    echo "2. Staging"
    echo "3. Production"
}

# Function to select an environment
choose_environment() {
    read -p "Choose an environment (1-3): " env_choice
    case $env_choice in
        1) ENV="Development" ;;
        2) ENV="Staging" ;;
        3) ENV="Production" ;;
        *) echo "Invalid choice. Exiting."; exit 1 ;;
    esac
    echo "Selected Environment: $ENV"
}

# Function to display branches
show_branches() {
    echo "Fetching available branches..."
    git fetch --all > /dev/null 2>&1
    git branch -r
}

# Function to select a branch
choose_branch() {
    read -p "Enter the branch name to deploy: " BRANCH
    echo "Selected Branch: $BRANCH"
}

# Function to run npm build
run_npm_build() {
    read -p "Do you want to run 'npm build'? (yes/no): " build_choice
    if [[ "$build_choice" == "yes" ]]; then
        echo "Running npm build..."
        npm install && npm run build
        echo "Build completed!"
    else
        echo "Skipping npm build."
    fi
}

# Main Script
echo "===== Jetking CI/CD Pipeline ====="
show_environments
choose_environment
show_branches
choose_branch
run_npm_build

echo "Pipeline setup for $ENV environment with branch '$BRANCH' is complete!"
