# bsa-api

This project contains an API for the BSA interview.

This project was develop using Windows 11.

## Requirements

- npm v8.5.5

- node v16.15.0

### Environment set up

1. Copy the .env.example file and rename it to .env and customize the variables you want.

2. Run the following command:

```

npm install

```

### Run tests

1. Run the following commands:

```

npm run test

```

### Run swagger documentation

1. Run the following commands:

```

npm run start

```

2. By default swagger is available at the following url:
   http://localhost:8000/swagger
   If you customized the SERVER_PORT and SWAGGER_ROUTE variables, please substitute those values in the url as follows:

http://localhost:{SERVER_PORT}/{SWAGGER_ROUTE}

If you prefer, you can use the postman collection inside the /docs folder.
