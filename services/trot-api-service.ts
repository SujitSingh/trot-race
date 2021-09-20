import config from '../configs/config';
import axios from 'axios';

class TrotApiService {
  apiRoot = config.apiRoot;
  token = ''

  authenticateUser(email?: string, password?: string) {
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
  setAuthToken(tokenValue: string) {
    this.token = tokenValue;
  }
}

export = new TrotApiService();