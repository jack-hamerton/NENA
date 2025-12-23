
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/studies';

const createStudy = (studyData) => {
  return axios.post(`${API_URL}/`, studyData);
};

const getStudies = () => {
  return axios.get(`${API_URL}/`);
};

const searchStudies = (query) => {
  return axios.get(`${API_URL}/search?q=${query}`);
};

const verifyStudyAccess = (studyId, code) => {
  return axios.post(`${API_URL}/${studyId}/verify`, { code });
};

const getStudy = (studyId) => {
  return axios.get(`${API_URL}/${studyId}`);
};

const submitAnswers = (studyId, answers) => {
  return axios.post(`${API_URL}/${studyId}/answers`, { answers });
};

const getStudyResults = (studyId) => {
  return axios.get(`${API_URL}/${studyId}/results`);
};

const studyService = {
  createStudy,
  getStudies,
  searchStudies,
  verifyStudyAccess,
  getStudy,
  submitAnswers,
  getStudyResults,
};

export default studyService;
