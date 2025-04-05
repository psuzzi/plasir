#!/usr/bin/env python3
"""
Quickstart script to create a Python virtual environment and install dependencies.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(cmd, shell=True):
    """Run a command and handle errors."""
    try:
        process = subprocess.run(cmd, shell=shell, text=True, capture_output=True, check=True)
        if process.stdout.strip():
            print(process.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stderr:
            print(e.stderr)
        return False

def main():
    """Set up Python virtual environment."""
    print("\n=== Setting up Python virtual environment ===\n")
    
    # Create virtual environment
    print("Creating virtual environment...")
    if not run_command([sys.executable, "-m", "venv", ".venv"], shell=False):
        print("Failed to create virtual environment.")
        return False
    
    # Check for requirements.txt
    req_file = Path("requirements.txt")
    if not req_file.exists():
        print("Creating empty requirements.txt file...")
        req_file.touch()
    
    # Install dependencies
    print("\nInstalling dependencies...")
    activate_cmd = ".venv\\Scripts\\activate" if platform.system() == "Windows" else "source .venv/bin/activate"
    install_cmd = f"{activate_cmd} && pip install -r requirements.txt"
    if not run_command(install_cmd):
        print("Failed to install dependencies.")
        return False
    
    # Done
    print("\n=== Setup Complete ===")
    print(f"""
To activate the virtual environment:
    {activate_cmd}

To install packages:
    pip install <package_name>

To save dependencies to requirements.txt:
    pip freeze > requirements.txt
    """)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 