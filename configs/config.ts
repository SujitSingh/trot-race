const {
  PORT,
  API_ROOT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB_NAME,
  API_EMAIL,
  API_PASSWORD
} = process.env;

export = {
  PORT: PORT || 3580,
  apiRoot: API_ROOT,
  mongoDBPath: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`,
  user: {
    email: API_EMAIL || 'someone@email.com',
    password: API_PASSWORD || 'lTgAYaLP9jRs',
  }
}
