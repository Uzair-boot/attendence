// server backend
export const baseUrl = 'https://darkoi.org:5002/api';
export const SOCKET_URL = 'wss://darkoi.org:5002';

// export const baseUrl = 'http://101.53.242.10:5002/api';
// export const SOCKET_URL = 'http://101.53.242.10:5002';
// new server url
// export const baseUrl = 'https://darkoi.org:5003/api';
// export const SOCKET_URL = 'https://darkoi.org:5003';


export const handleAPICall = async (url, method, body = {}) => {
  try {
    console.log('Making request to:', url);
    const headers = {'Content-Type': 'application/json'};

    const options = {
      method,
      headers,
      ...(method !== 'GET' && {body: JSON.stringify(body)}),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', {
      message: error.message,
    });
    throw error;
  }
};
