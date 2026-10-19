import axios from 'axios';

// Створюємо окремий інстанс для нового бекенду аутентифікації
const authApi = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export interface AuthCredentials {
  email: string;
  password: string;
}

// 1. Логін користувача
export const loginUser = async (credentials: AuthCredentials) => {
  const response = await authApi.post('/auth/login', credentials);
  return response.data;
};

// 2. Реєстрація нового користувача
export const registerUser = async (credentials: AuthCredentials) => {
  const response = await authApi.post('/auth/register', credentials);
  return response.data;
};

// 3. Вихід із системи
export const logoutUser = async () => {
  const response = await authApi.post('/auth/logout');
  return response.data;
};

// 4. Перевірка активної сесії
export const checkSession = async () => {
  const response = await authApi.get('/auth/session');
  return response.data;
};

// 5. Отримати профіль поточного користувача
export const getCurrentUser = async () => {
  const response = await authApi.get('/users/me');
  return response.data;
};

// 6. Оновити дані поточного користувача (PATCH)
export const updateUserProfile = async (userData: { name?: string; email?: string }) => {
  const response = await authApi.patch('/users/me', userData);
  return response.data;
};
