import axios from 'axios';

// server backend
// export const baseUrl = 'https://darkoi.org:5002/api';
export const baseUrl = 'http://101.53.242.10:5002/api';
// export const baseUrl = 'http://101.53.242.10:5002/api';

export const handleAPICall = async (url, method, body = {}) => {
  try {
    console.log(url, 'API URL');

    const headers = {};
    const response = await axios({
      url,
      method,
      headers,
      data: body,
    });
    return response;
  } catch (error) {
    return error;
  }
};