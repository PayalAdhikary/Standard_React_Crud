import axios from 'axios';

export default class AxiosServices {
  post(url, data, isAuthRequired = false, headers = {}) {
    const finalHeaders = this.getHeaders(isAuthRequired, headers);
    return axios.post(url, data, { headers: finalHeaders });
  }

  get(url, isAuthRequired = false) {
    const headers = this.getHeaders(isAuthRequired);
    return axios.get(url, { headers });
  }

  put(url, data, isAuthRequired = false) {
    const headers = this.getHeaders(isAuthRequired);
    return axios.put(url, data, { headers });
  }

  filePost(url, formData, isAuthRequired = false) {
    const headers = this.getHeaders(isAuthRequired, {
      'Content-Type': 'multipart/form-data', // Ensure this header is set for file uploads
    });
    return axios.post(url, formData, { headers });
  }

  getHeaders(isAuthRequired, additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    if (isAuthRequired) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }
}
