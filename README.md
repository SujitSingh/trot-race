## Trot Race

### Installation instruction
To install required dependencies run any of followings

**Using Yarn**
```
yarn install
```

**(OR) Using NPM**
```
npm install
```

### Configurations
This application uses MongoDB as DB. Required configurations value could be added under the file `.env`. Followings steps helps in updating required configuration values.

1. MongoDB connection configuration should be updated using `MONGO_HOST`, `MONGO_DB_NAME`, `MONGO_USER` and `MONGO_PASSWORD`.
2. In the same `.env` file, update the `API_ROOT` and `API_PASSWORD` to the desired values. Value of `API_EMAIL` can also be updated, if needed.

### Running Application
Depending on installation command, any of following would start the application.
```
yarn start
```
```
npm start
```

### App start confirmation
There is a app start console log during app start time. Further updates could only be monitored using actual DB entries.