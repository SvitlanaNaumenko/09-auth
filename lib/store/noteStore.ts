import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Draft {
  title: string;
  content: string;
  tag: string;
}

interface NoteState {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteState>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note =>
        set(state => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
      partialize: state => ({ draft: state.draft }),
    }
  )
);
