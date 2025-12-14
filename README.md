# Home Library Service

## Docker Hub

🐳 **Docker Hub Repository:** [chaffe01/home-library-app](https://hub.docker.com/r/chaffe01/home-library-app)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)

## Downloading

1. `git clone git@github.com:Chaffe/nodejs2025Q2-service.git`
2. `cd ./nodejs2025Q2-service`
3. `git checkout "feature/containerization-and-database"`

## Quick Start (For Reviewers)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
Create a `.env` file manually with the following content:

PORT=4000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

```bash
# 3. Build and start Docker containers
npm run docker:build
npm run docker:up

# 4. Wait for the application to be ready (check logs):
   npm run docker:logs
   
# Look for: `Application is running on: http://localhost:4000`
# **Note:** If you have problems with locale running, try to launch migrations regarding the **Migration Guide** and return to the Docker container running

# 5. Wait for containers to be ready (5-10 seconds), then run tests
npm run test
```

## 4. Stop the Application

```bash
npm run docker:down
```

## Migration Commands:

### Important Notes
Database must be running — Make sure PostgreSQL is up before running migrations. If using Docker:
`npm run docker:up`


1. Migration running: `npm run migration:run`
2. Generate a new migration: `npm run migration:generate src/database/migrations/<YourMigrationName>`
3. Create an empty migration: `npm run migration:create src/database/migrations/<YourMigrationName>`
4. Revert the last migration: `npm run migration:revert`

## Testing

**Important:** Make sure the Docker containers are running before executing tests.

### Prerequisites for Testing

1. Ensure Docker containers are running:
   ```bash
   npm run docker:up
   ```

2. Wait for the application to be ready (check logs):
   ```bash
   npm run docker:logs
   ```

   Look for: `Application is running on: http://localhost:4000`

**Note:** If you have problems with locale running, try to launch migrations regarding the **Migration Guide** and return to the Docker container running

### Run Tests

To run all tests without authorization:

```bash
npm run test
```

**Note:** Tests connect to `localhost:4000`, so the Docker container must be exposing this port.

### Auto-fix and format

`npm run lint`

`npm run format`

## Usage

The service provides the following functionality:

## Vulnerability Scanning

The project includes npm scripts for vulnerability scanning:

`npm run docker:scan` or `docker scout cves home-library-app:prod`

The `scan` script performs:

- Security audit of dependencies
- Dry run of vulnerability fixes
- Check for outdated packages

### Users

- Get all users
- Get single user by id
- Create user
- Update user's password
- Delete user

### Artists

- Get all artists
- Get single artist by id
- Create artist
- Update artist
- Delete artist

### Albums

- Get all albums
- Get single album by id
- Create album
- Update album
- Delete album

### Tracks

- Get all tracks
- Get single track by id
- Create track
- Update track
- Delete track

### Favorites

- Get all favorites
- Add track to favorites
- Delete track from favorites
- Add album to favorites
- Delete album from favorites
- Add artist to favorites
- Delete artist from favorites