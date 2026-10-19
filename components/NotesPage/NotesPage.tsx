'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/services/noteService';
import Link from 'next/link';

export default function NotesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetchNotes(),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Loading error: {error.message}</p>;

  return (
    <main>
      <h1>Notes List</h1>

      <Link href="/notes/action/create">Create note +</Link>

      {data?.notes && data.notes.length > 0 ? (
        <ul>
          {data.notes.map(note => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes found.</p>
      )}
    </main>
  );
}
