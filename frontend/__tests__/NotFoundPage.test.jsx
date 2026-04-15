import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 message', () => {
    render(
      <MemoryRouter initialEntries={['/missing']}>
        <Routes>
          <Route path="/missing" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
