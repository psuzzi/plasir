#!/usr/bin/env python3
"""
Icon Generator

This script generates icons for Windows, macOS, and Linux platforms from 1024x1024 images.
"""

import os
import sys
import argparse
from pathlib import Path
from PIL import Image

# Windows ICO sizes
WINDOWS_SIZES = [16, 24, 32, 48, 64, 128, 256]

# macOS ICNS sizes (names from Apple's documentation)
MACOS_SIZES = [
    (16, "16x16"),
    (32, "16x16@2x"),
    (32, "32x32"),
    (64, "32x32@2x"),
    (128, "128x128"),
    (256, "128x128@2x"),
    (256, "256x256"),
    (512, "256x256@2x"),
    (512, "512x512"),
    (1024, "512x512@2x")
]

# Linux PNG sizes
LINUX_SIZES = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]

def create_output_dirs():
    """Create output directories if they don't exist."""
    output_dir = Path("icon-gen-out")
    win_dir = output_dir / "windows_ico"
    mac_dir = output_dir / "macos_icns"
    linux_dir = output_dir / "linux_png"
    
    for directory in [output_dir, win_dir, mac_dir, linux_dir]:
        directory.mkdir(exist_ok=True)
    
    return win_dir, mac_dir, linux_dir

def check_image(image_path):
    """Check if the image exists and has the correct size (1024x1024)."""
    if not Path(image_path).exists():
        print(f"Error: Image '{image_path}' does not exist.")
        return False
    
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            if width != 1024 or height != 1024:
                print(f"Error: Image '{image_path}' must be 1024x1024 pixels. Current size: {width}x{height}")
                return False
    except Exception as e:
        print(f"Error opening image '{image_path}': {e}")
        return False
    
    return True

def create_windows_ico(image_path, output_dir):
    """Create Windows ICO file."""
    basename = os.path.basename(image_path)
    output_file = output_dir / f"{Path(basename).stem}.ico"
    
    try:
        img = Image.open(image_path)
        
        # Create images at different sizes
        images = []
        for size in WINDOWS_SIZES:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            images.append(resized_img)
        
        # Save as ICO
        img.save(output_file, format='ICO', sizes=[(i.width, i.height) for i in images])
        print(f"Created Windows ICO: {output_file}")
        return True
    except Exception as e:
        print(f"Error creating Windows ICO: {e}")
        return False

def create_macos_icns(image_path, output_dir):
    """Create macOS ICNS file."""
    basename = os.path.basename(image_path)
    output_file = output_dir / f"{Path(basename).stem}.icns"
    
    try:
        # For simplicity, we'll use PIL's built-in ICNS support
        # This doesn't include all the Apple-specific metadata but works for basic use
        img = Image.open(image_path)
        
        # Create images at different sizes
        images = []
        for size, _ in MACOS_SIZES:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            images.append(resized_img)
        
        # Save as ICNS
        img.save(output_file, format='ICNS', append_images=images[:-1])
        print(f"Created macOS ICNS: {output_file}")
        return True
    except Exception as e:
        print(f"Error creating macOS ICNS: {e}")
        return False

def create_linux_pngs(image_path, output_dir):
    """Create Linux PNG files at various sizes."""
    basename = os.path.basename(image_path)
    base_stem = Path(basename).stem
    
    try:
        img = Image.open(image_path)
        
        # Create PNGs at different sizes
        for size in LINUX_SIZES:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_file = output_dir / f"{base_stem}_{size}x{size}.png"
            resized_img.save(output_file, format='PNG')
        
        print(f"Created Linux PNGs for {base_stem}")
        return True
    except Exception as e:
        print(f"Error creating Linux PNGs: {e}")
        return False

def process_image(image_path, targets):
    """Process a single image file."""
    print(f"\nProcessing: {image_path}")
    
    if not check_image(image_path):
        return False
    
    win_dir, mac_dir, linux_dir = create_output_dirs()
    success = True
    
    if 'w' in targets:
        if not create_windows_ico(image_path, win_dir):
            success = False
    
    if 'm' in targets:
        if not create_macos_icns(image_path, mac_dir):
            success = False
    
    if 'l' in targets:
        if not create_linux_pngs(image_path, linux_dir):
            success = False
    
    return success

def main():
    """Main function to parse arguments and process images."""
    parser = argparse.ArgumentParser(description='Generate platform-specific icons from 1024x1024 images.')
    parser.add_argument('images', metavar='IMAGE', type=str, nargs='+',
                        help='Path to input image(s) (1024x1024 pixels)')
    parser.add_argument('--target', '-t', type=str, default='wml',
                        help='Target platforms: w=Windows, m=macOS, l=Linux. Default: wml (all)')
    
    args = parser.parse_args()
    
    # Validate target argument
    target = args.target.lower()
    valid_chars = {'w', 'm', 'l'}
    if not all(c in valid_chars for c in target):
        print(f"Error: Invalid target '{target}'. Must be some combination of 'w', 'm', and 'l'.")
        return 1
    
    # Process each image
    all_success = True
    for image_path in args.images:
        if not process_image(image_path, target):
            all_success = False
    
    if all_success:
        print("\nIcon generation completed successfully.")
        return 0
    else:
        print("\nIcon generation completed with errors.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 