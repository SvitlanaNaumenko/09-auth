import { api } from './api';
import type { Note, CreateNoteDto } from '../../types/note';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

// 1. Отримання списку нотаток
export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page) queryParams.page = params.page;
  if (params.perPage) queryParams.perPage = params.perPage;
  if (params.search && params.search.trim() !== '') queryParams.search = params.search.trim();
  if (params.tag && params.tag !== 'all') queryParams.tag = params.tag;

  const response = await api.get<FetchNotesResponse>('/notes', { params: queryParams });
  return response.data;
};

// 2. Отримання нотатки за ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

// 3. Створення нотатки
export const createNote = async (noteData: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

// 4. Видалення нотатки
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

// 5. Аутентифікація: Логін
export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// 6. Аутентифікація: Реєстрація
export const register = async (credentials: RegisterCredentials) => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
};

// 7. Аутентифікація: Вихід
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// 8. Перевірка та оновлення сесії
export const checkSession = async () => {
  const response = await api.get('/auth/session');
  return response.data;
};

// 9. Отримання даних користувача
export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (data: { username: string }) => {
  const response = await api.patch('/users/me', data);
  return response.data;
};
