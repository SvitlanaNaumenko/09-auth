import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '../../types/note';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

// Допоміжна функція для отримання заголовка з кукі для сервера
const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
};

// 1. Отримання списку нотаток на сервері
export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const headers = await getServerHeaders();
  const response = await api.get('/notes', {
    params,
    headers,
  });
  return response.data;
};

// 2. Отримання однієї нотатки за ID на сервері
export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getServerHeaders();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers,
  });
  return response.data;
};

// 3. Отримання профілю користувача (getMe) на сервері
export const getMe = async () => {
  const headers = await getServerHeaders();
  const response = await api.get('/users/me', {
    headers,
  });
  return response.data;
};

// 4. Перевірка сесії (checkSession) на сервері
export const checkSession = async () => {
  const headers = await getServerHeaders();
  const response = await api.get('/auth/session', {
    headers,
  });
  return response;
};
