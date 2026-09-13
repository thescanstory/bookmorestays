import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  sharedUrl: string | null;
  setSharedUrl: (url: string | null) => void;
  currentHotelResult: unknown | null;
  setCurrentHotelResult: (result: unknown | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  sharedUrl: null,
  setSharedUrl: (url) => set({ sharedUrl: url }),
  currentHotelResult: null,
  setCurrentHotelResult: (result) => set({ currentHotelResult: result }),
}));
