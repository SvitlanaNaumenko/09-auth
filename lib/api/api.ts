import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study'}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
