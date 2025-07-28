import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';

global.IntersectionObserver = global.IntersectionObserver || class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};


// 👇 Mock react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

// 👇 Mock react-redux
vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}));

// 👇 Mock RTK Query hook
vi.mock('../../features/auth/authApi', () => ({
  useLoginUserMutation: () => [
    vi.fn(() => Promise.resolve({ user: { name: 'Test', _id: '123' } })),
    { isLoading: false },
  ],
}));

// 👇 Mock posthog
vi.mock('posthog-js', () => ({
  identify: vi.fn(),
  capture: vi.fn(),
}));

test('renders login form and submits data', async () => {
  render(<Login />);

  // Fill inputs
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'password123' },
  });

  // Click login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Wait for async stuff to settle
  await waitFor(() => {
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });
});
