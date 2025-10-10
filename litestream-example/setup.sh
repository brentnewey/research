#!/bin/bash
# Litestream Example Setup Script
# Downloads required tools and sets up the example database

set -e

echo "Setting up Litestream example..."

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM="linux";;
    Darwin*)    PLATFORM="darwin";;
    *)          echo "Unsupported OS: $OS"; exit 1;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
    x86_64)     ARCH="amd64";;
    arm64)      ARCH="arm64";;
    aarch64)    ARCH="arm64";;
    *)          echo "Unsupported architecture: $ARCH"; exit 1;;
esac

# Download SQLite (if not already installed)
if ! command -v sqlite3 &> /dev/null; then
    echo "SQLite not found. Please install sqlite3 for your platform:"
    echo "  Ubuntu/Debian: sudo apt-get install sqlite3"
    echo "  macOS: brew install sqlite3"
    echo "  Fedora: sudo dnf install sqlite"
    exit 1
fi

# Download Litestream
LITESTREAM_VERSION="v0.5.0"
LITESTREAM_URL="https://github.com/benbjohnson/litestream/releases/download/${LITESTREAM_VERSION}/litestream-${LITESTREAM_VERSION}-${PLATFORM}-${ARCH}.tar.gz"
echo "Downloading Litestream for ${PLATFORM}-${ARCH}..."

if [ ! -f "litestream.tar.gz" ]; then
    curl -L -o litestream.tar.gz "$LITESTREAM_URL"
fi

echo "Extracting Litestream..."
tar -xzf litestream.tar.gz
rm litestream.tar.gz

# Create sample database
echo "Creating sample database..."
sqlite3 fruits.db <<EOF
CREATE TABLE fruits (name TEXT, color TEXT);
INSERT INTO fruits (name, color) VALUES ('apple', 'red');
INSERT INTO fruits (name, color) VALUES ('banana', 'yellow');
EOF

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Docker Desktop"
echo "2. Run: docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ':9001'"
echo "3. Create bucket 'mybkt' at http://localhost:9001 (minioadmin/minioadmin)"
echo "4. Set environment variables:"
echo "   export LITESTREAM_ACCESS_KEY_ID=minioadmin"
echo "   export LITESTREAM_SECRET_ACCESS_KEY=minioadmin"
echo "5. Run: ./litestream replicate fruits.db s3://mybkt.localhost:9000/fruits.db"
