#!/bin/bash
# PhantomJS Installer and Launcher - Bash Script
# Version 1.0
# Copyright (c) 2025 Origan

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo "[ERROR] This script must be run as root."
    exit 1
fi

# Set variables
NODE_PATH=$(which node)
SCRIPT_PATH=$(dirname "$0")/PhantomSetup.js
LOG_FILE=$(dirname "$0")/phantom_install.log

# Check for Node.js installation
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    exit 1
fi

# Main menu
while true; do
    clear
    echo "============================================"
    echo "   PhantomJS Installer And Launcher"
    echo "============================================"
    echo "1. Install PhantomJS"
    echo "2. Launch PhantomJS"
    echo "3. Exit"
    echo "============================================"
    read -p "Choose an option (1-3): " choice

    case $choice in
        1)
            echo "Starting PhantomJS installation..."
            $NODE_PATH $SCRIPT_PATH > $LOG_FILE 2>&1
            if [ $? -eq 0 ]; then
                echo "Installation completed successfully!"
                echo "Check $LOG_FILE for details."
            else
                echo "[ERROR] Installation failed."
                echo "Check $LOG_FILE for more information."
            fi
            read -p "Press Enter to continue..."
            ;;
        2)
            echo "Launching PhantomJS..."
            $NODE_PATH $SCRIPT_PATH
            if [ $? -eq 0 ]; then
                echo "PhantomJS launched successfully!"
            else
                echo "[ERROR] PhantomJS launch failed."
            fi
            read -p "Press Enter to continue..."
            ;;
        3)
            exit 0
            ;;
        *)
            echo "Invalid choice, please try again."
            read -p "Press Enter to continue..."
            ;;
    esac
done
