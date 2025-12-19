# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

1. `git clone git@github.com:Chaffe/nodejs2025Q2-service.git`
2. `cd ./nodejs2025Q2-service`
3. `git checkout "feature/authentication"`

## Installing NPM modules

```
npm install
```

## Running application

```
npm run start:dev
```

## Testing

Create the `.env` file on base of `.env.example` file with the next variables:
```
PORT=4000

LOG_LEVEL=2
LOG_MAX_FILE_SIZE_KB=100

JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_SECRET_REFRESH_KEY=your-refresh-secret-key-change-in-production
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

CRYPT_SALT=10
```

**Important:** Make sure the application is running before executing tests. If application isn't started, enter:
```
npm run start:dev
```

After application running open new terminal and follow next steps:

1) To run all test with authorization

```
npm run test:auth
```

2) To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

3) To run all test with refresh

```
npm run test:refresh
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
