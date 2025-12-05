const API_URL = '/api';
;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
}

// Auth functions
export async function signUp(email: string, password: string, username: string) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  return handleResponse<{ token: string; user: User }>(response);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ token: string; user: User }>(response);
}

// Profile functions
export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse<User>(response);
}

export async function updateProfile(token: string, username: string) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return handleResponse<User>(response);
}

export async function updateStreak(token: string) {
  const response = await fetch(`${API_URL}/profile/streak`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse<{ streak: number; last_streak_date: string }>(response);
}

// Notes functions
export async function getNotes(token: string) {
  const response = await fetch(`${API_URL}/notes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse<Note[]>(response);
}

export async function createNote(token: string, title: string, content: string) {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse<Note>(response);
}

export async function updateNote(token: string, id: string, title: string, content: string) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse<Note>(response);
}

export async function deleteNote(token: string, id: string) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'An error occurred');
  }
}

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  streak: number;
  last_streak_date?: string;
  photoUrl?: string | null;
}

export interface Note {
  _id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
} 