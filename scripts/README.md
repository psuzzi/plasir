# Scripts Directory

This directory contains utility scripts for the project, including both Python and Bash scripts.

## Setup

1. Run the quickstart script to create and configure the Python virtual environment:
   ```bash
   ./quickstart.py
   ```
   or
   ```bash
   python3 quickstart.py
   ```

2. Activate the virtual environment:
   - On Unix/macOS:
     ```bash
     source .venv/bin/activate
     ```
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```

## Icon Generator

The `icon_generator.py` script creates platform-specific icons for Windows, macOS, and Linux from 1024x1024 source images.

### Usage

```bash
python icon_generator.py [--target TARGET] IMAGE [IMAGE ...]
```

#### Arguments:
- `IMAGE`: Path to input image(s) (must be 1024x1024 pixels)
- `--target`, `-t`: Target platforms to generate icons for:
  - `w`: Windows (.ico)
  - `m`: macOS (.icns)
  - `l`: Linux (.png)
  - Default: `wml` (all platforms)

#### Example:
```bash
# Generate icons for all platforms
python icon_generator.py my_icon.png

# Generate icons only for Windows and macOS
python icon_generator.py --target wm my_icon.png

# Process multiple images
python icon_generator.py icon1.png icon2.png
```

### Output

The script creates an `icon-gen-out` directory with the following structure:
```
icon-gen-out/
  ├── windows_ico/
  │   └── my_icon.ico
  ├── macos_icns/
  │   └── my_icon.icns
  └── linux_png/
      ├── my_icon_16x16.png
      ├── my_icon_24x24.png
      ├── ...
      └── my_icon_1024x1024.png
```

## Directory Structure

- `requirements.txt`: Python package dependencies
- `quickstart.py`: Setup script for creating the virtual environment
- `icon_generator.py`: Tool for generating platform-specific icons
- `*.py`: Python scripts
- `*.sh`: Bash scripts

## Best Practices

- Keep scripts focused and modular
- Document script usage in comments
- Use the virtual environment for Python scripts
- Follow shell script best practices for bash scripts 