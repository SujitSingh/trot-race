const config = require('../configs/config.js');
const axios = require('axios');

class TrotApiService {
  apiRoot = config.apiRoot;
  token = ''

  authenticateUser(email, password) {
    return axios.post(this.apiRoot + '/auth', {
      email: email || config.user.email,
      password: password || config.user.password,
    });
  }
  getRaceStatus() {
    const headers = {
      Authorization: `Bearer ${this.token}`
    };
    return axios.get(this.apiRoot + '/results', { headers });
  }
  setAuthToken(tokenValue) {
    this.token = tokenValue;
  }
}

module.exports = new TrotApiService();