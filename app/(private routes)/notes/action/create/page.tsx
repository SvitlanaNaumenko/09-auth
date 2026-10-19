import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description: 'Create a new personal note on NoteHub.',
  openGraph: {
    title: 'Create Note | NoteHub',
    description: 'Create a new personal note on NoteHub.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create Note Preview',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main>
      <div>
        <h1>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
