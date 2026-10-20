import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'Profile Page',
  description: 'User profile and account information',
};

export default async function ProfilePage() {
  let user = null;

  try {
    const response = await getMe();
    user = response.data;
  } catch {
    user = null;
  }

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1>Profile Page</h1>
          <Link
            href="/profile/edit"
            style={{
              padding: '6px 12px',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
            }}
          >
            Edit Profile
          </Link>
        </div>

        <div style={{ margin: '20px 0' }}>
          <Image
            src={user?.avatar || 'https://ac.goit.global/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            style={{ borderRadius: '50%' }}
          />
        </div>

        <div>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Username: {user?.username || user?.email || 'N/A'}
          </p>
          <p style={{ fontSize: '18px' }}>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
