import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock do react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { useToast } from '@/hooks/useToast';
import toast from 'react-hot-toast';

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render success button and call toast.success', async () => {
    const TestComponent = () => {
      const { success } = useToast();
      return <button onClick={() => success('Success message')}>Success</button>;
    };

    render(<TestComponent />);
    const button = screen.getByText('Success');
    await userEvent.click(button);

    expect(toast.success).toHaveBeenCalledWith('Success message');
  });

  it('should render error button and call toast.error', async () => {
    const TestComponent = () => {
      const { error } = useToast();
      return <button onClick={() => error('Error message')}>Error</button>;
    };

    render(<TestComponent />);
    const button = screen.getByText('Error');
    await userEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith('Error message');
  });
});