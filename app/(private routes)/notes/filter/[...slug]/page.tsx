import { Metadata } from 'next';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const filterValue = resolvedParams.slug ? resolvedParams.slug.join(' / ') : 'All notes';

  const title = `Filter: ${filterValue} | NoteHub`;
  const description = `Viewing notes filtered by ${filterValue} on NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://notehub.com/',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug ? resolvedParams.slug[0] : '';

  return <NotesClient tag={tag} />;
}