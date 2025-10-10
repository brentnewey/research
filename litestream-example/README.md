# Litestream Getting Started Example

This is a working example of Litestream replication based on the [official getting started guide](https://litestream.io/getting-started/).

## What is Litestream?

Litestream is a standalone disaster recovery tool for SQLite. It runs as a background process and safely replicates changes incrementally to another file or S3-compatible storage. Litestream only communicates with SQLite through the SQLite API so it will not corrupt your database.

## Prerequisites

- Docker Desktop (for running MinIO)
- Git

## Quick Start

### 1. Run the setup script

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Download Litestream and SQLite tools for your platform
- Create a sample `fruits.db` database with test data

### 2. Start MinIO (S3-compatible storage)

```bash
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

### 3. Create a MinIO bucket

1. Open http://localhost:9001 in your browser
2. Login with username: `minioadmin`, password: `minioadmin`
3. Create a new bucket named `mybkt`

### 4. Set environment variables

**Windows (PowerShell):**
```powershell
$env:LITESTREAM_ACCESS_KEY_ID='minioadmin'
$env:LITESTREAM_SECRET_ACCESS_KEY='minioadmin'
```

**Linux/macOS:**
```bash
export LITESTREAM_ACCESS_KEY_ID=minioadmin
export LITESTREAM_SECRET_ACCESS_KEY=minioadmin
```

### 5. Start Litestream replication

**Windows:**
```powershell
.\litestream.exe replicate fruits.db s3://mybkt.localhost:9000/fruits.db
```

**Linux/macOS:**
```bash
./litestream replicate fruits.db s3://mybkt.localhost:9000/fruits.db
```

Litestream will now continuously backup your database to MinIO.

### 6. Test restoration (in a new terminal)

**Windows:**
```powershell
$env:LITESTREAM_ACCESS_KEY_ID='minioadmin'
$env:LITESTREAM_SECRET_ACCESS_KEY='minioadmin'
.\litestream.exe restore -o fruits2.db s3://mybkt.localhost:9000/fruits.db
.\sqlite3.exe fruits2.db "SELECT * FROM fruits;"
```

**Linux/macOS:**
```bash
export LITESTREAM_ACCESS_KEY_ID=minioadmin
export LITESTREAM_SECRET_ACCESS_KEY=minioadmin
./litestream restore -o fruits2.db s3://mybkt.localhost:9000/fruits.db
sqlite3 fruits2.db "SELECT * FROM fruits;"
```

## What's Included

- `setup.ps1` - Windows setup script
- `setup.sh` - Linux/macOS setup script
- `etc/litestream.yml` - Example Litestream configuration file
- `etc/litestream.service` - Example systemd service file
- `LICENSE` - Apache 2.0 license from Litestream project

## Learn More

- [Litestream Documentation](https://litestream.io)
- [Litestream GitHub](https://github.com/benbjohnson/litestream)
- [Getting Started Guide](https://litestream.io/getting-started/)

## License

This example follows the Litestream project's Apache 2.0 license. See LICENSE file for details.
