# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)

## Downloading

1. `git clone git@github.com:Chaffe/nodejs2025Q2-service.git`
2. `cd ./nodejs2025Q2-service`
3. `git checkout "feature/containerization-and-database"`


## Installing NPM modules

`npm install`

## Running application

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=4000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
```

Build and start the application:

1. Build the application: `npm run docker:build` or `docker compose build`
2. Start the application: `npm run docker:up` `docker compose up`

By default, the application will run on port 4000, in development mode, so it will automatically restart when you make changes to the code in the `src` directory.

To stop the application:
`npm run docker:down` or `docker compose down`

## Testing

After starting the application, you can run the tests:

To run all tests without authorization

`npm run test`

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