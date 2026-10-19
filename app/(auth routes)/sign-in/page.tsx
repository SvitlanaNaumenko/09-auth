'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    console.log('Кнопка натиснута, надсилаємо запит...');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const data = await login({ email, password });
      console.log('Успішна відповідь від сервера:', data);

      if (data) {
        setUser(data);
      }

      router.push('/profile');
    } catch (err: unknown) {
      console.error('Помилка при логіні:', err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    }
  };

  return (
    <main style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>Sign in</h1>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
            Log in
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </main>
  );
}
