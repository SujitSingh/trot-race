export = {
  PORT: process.env.PORT || 3580,
  apiRoot: process.env.API_ROOT,
  mongoDBPath: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`,
  user: {
    email: process.env.API_EMAIL,
    password: process.env.API_PASSWORD,
  }
}