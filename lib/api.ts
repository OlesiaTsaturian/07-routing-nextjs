import axios from 'axios';
import type { Note } from '../types/note';

const myToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${myToken}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
};

//   search: string,
//   page: number,
//   perPage: number,
// ): Promise<FetchNotesResponse> => {
//   const response = await api.get<FetchNotesResponse>('/notes', {
//     params: { search, page, perPage },
//   });
//   return response.data;

export interface CreateParams {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (newNote: CreateParams): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
