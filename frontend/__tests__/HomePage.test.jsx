import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import { useAuthStore } from '../src/store/authStore';

describe('HomePage', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, username: null });
  });

  it('redirects to login when not authenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<div data-testid="login-route">Login</div>} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('login-route')).toBeInTheDocument();
    });
  });

  it('shows dashboard actions when authenticated', () => {
    useAuthStore.setState({ token: 'x', username: 'u' });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /add employee/i })).toBeInTheDocument();
  });
});
