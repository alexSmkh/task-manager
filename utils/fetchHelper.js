import axios from 'axios';
import qs from 'qs';

import { camelize, decamelize } from './keysConverter';

const authenticityToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.content : null;
};

const headers = () => ({
  Accept: '*/*',
  'Content-Type': 'application/json',
  'X-CSRF-Token': authenticityToken(),
  'X-Requested-With': 'XMLHttpRequest',
});

axios.defaults.headers.post = headers();
axios.defaults.headers.put = headers();
axios.defaults.headers.delete = headers();

axios.interceptors.response.use(null, (error) => {
  const {
    response: { status },
  } = error;

  if (status === 422) {
    const {
      response: {
        data: { errors },
      },
    } = error;

    return Promise.reject(camelize(errors));
  }

  if (status === 500) {
    return Promise.reject(new Error('Something went wrong, please try again'));
  }

  return Promise.reject(error);
});

export default {
  get(url, params) {
    return axios
      .get(url, {
        params: decamelize(params),
        paramsSerializer: (parameters) => qs.stringify(parameters, { encode: false }),
      })
      .then(camelize);
  },
  post(url, json) {
    const body = decamelize(json);
    return axios.post(url, body).then(camelize);
  },
  put(url, json) {
    const body = decamelize(json);
    return axios.put(url, body).then(camelize);
  },
  delete(url) {
    return axios.delete(url).then(camelize);
  },
};
