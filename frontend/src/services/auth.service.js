import axios from 'axios';

const API_URL = '/api/v1/auth/';

const sendPnv = (email, username, password, phoneNumber, countryCode) => {
  return axios.post(API_URL + 'register/send-pnv', {
    email,
    username,
    password,
    phone_number: phoneNumber,
    country_code: countryCode,
  });
};

const checkPnvAndRegister = (verificationId, code, email, username, password, phoneNumber, countryCode) => {
  return axios.post(API_URL + 'register/check-pnv', {
    pnv_in: {
        verification_id: verificationId,
        code: code,
    },
    user_in: {
        email,
        username,
        password,
        phone_number: phoneNumber,
        country_code: countryCode,
    }
  }).then(response => {
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};


const login = async (username, password) => {
  const response = await axios.post(API_URL + 'login', {
    username,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  sendPnv,
  checkPnvAndRegister,
  login,
  logout,
  getCurrentUser,
};
