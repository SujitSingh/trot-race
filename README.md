# Trot Race

## Installation
To install required dependencies run any of followings

**Using Yarn**
```
yarn install
```

**(OR) Using NPM**
```
npm install
```

## Configurations
This application uses MongoDB whose configurations values could be modified under `.env`.

## Running Application
This app can be ran under docker container by following command

```
docker-compose up
```

## Start Confirmation
There are start app console logs during start and updates. DB entries could be monitored by connecting to container DB on 

```
mongodb://sujit:passw0rd@localhost:8989/trot_race?authSource=admin
```
