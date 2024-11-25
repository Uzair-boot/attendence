import axios from 'axios';

// server backend
// export const baseUrl = 'https://darkoi.org:5002/api';
// const SOCKET_URL = 'wss://darkoi.org:5002';
export const baseUrl = 'http://101.53.242.10:5002/api';
export const SOCKET_URL = 'http://101.53.242.10:5002';

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
