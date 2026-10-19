'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';
import css from './EditProfile.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [username, setUsername] = useState(user?.username || '');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main
      className={css.mainContent || ''}
      style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}
    >
      <div className={css.profileCard || ''}>
        <h1 className={css.formTitle || ''}>Edit Profile</h1>

        <Image
          src={user?.avatar || 'https://ac.goit.global/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar || ''}
          style={{ borderRadius: '50%', marginBottom: '20px' }}
        />

        <form className={css.profileInfo || ''} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper || ''} style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={css.input || ''}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>

          <p style={{ marginBottom: '20px' }}>Email: {user?.email}</p>

          <div className={css.actions || ''} style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className={css.saveButton || ''}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton || ''}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
