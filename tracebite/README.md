# Tracebite Swing Application

A simple Java Swing application with a menu bar.

## Prerequisites

- Java 17 or newer (JDK 17 recommended for compatibility with jpackage)
- Gradle 8.9 or newer
- For native packaging: JDK 14-17 with jpackage support

## Building the Application

To build the application, run:

```bash
./gradlew build
```

## Running the Application

To run the application directly:

```bash
./gradlew run
```

## Creating Distribution Packages

### Basic Distribution Packages

To create basic zip/tar distributions that work on any platform with Java installed:

```bash
./gradlew jar
```

The JAR file will be created in `lib/build/libs/`.

### Creating Native Executables (Windows .exe, macOS .app, Linux packages)

The project uses the jpackage tool (via the jlink Gradle plugin) to create native executables for each platform.

#### Optional: Adding Application Icons

For better-looking native packages, you can add platform-specific icons:

- **Windows**: Add an ICO file at `lib/src/main/resources/icon.ico`
- **macOS**: Add an ICNS file at `lib/src/main/resources/icon.icns`
- **Linux**: Add a PNG file at `lib/src/main/resources/icon.png`

If these files don't exist, the application will still build but will use default icons.

#### Creating Platform-Specific Installer

To create a native installer for your current platform:

```bash
./gradlew jpackage
```

This will create:
- On Windows: An .exe installer in `lib/build/jpackage`
- On macOS: A .dmg file with the .app bundle in `lib/build/jpackage`
- On Linux: A .deb package in `lib/build/jpackage`

#### Creating Self-Contained Runtime Image

To create a modular runtime image with your application:

```bash
./gradlew jlink
```

This creates a self-contained directory with your application and a custom Java runtime.

#### Creating Zip Distribution of Runtime Image

To create a zip file of the jlink image (portable across same platform):

```bash
./gradlew jlinkZip
```

The zip file will be in `lib/build/distributions/`.

### Cross-Platform Building

Note that jpackage can only create installers for the platform you're currently on. To create installers for all platforms, you would need to run the build on each target platform.

## Notes for Developers

### Windows

For Windows, the application will have:
- A proper .exe executable
- Start menu shortcuts
- An installation wizard

### macOS

For macOS, the application will have:
- A proper .app bundle
- DMG installer
- Application icon (if provided)

### Linux

For Linux, the application will have:
- A DEB package installer
- Desktop shortcut
- Proper executable 