# BOOKING server for SAGIROV.com  

## Installation

```bash
npm install
```

## Database Setup
```bash
npx sequelize-cli db:migrate
```

```bash
npx sequelize-cli db:seed:all
```

## Running the app

```bash
# production
npm run start

# watch mode
npm run start:dev
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```


## Docker Support (Optional)
docker compose up --build
