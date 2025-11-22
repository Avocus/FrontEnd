import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ListaEntidade, EntityItem } from '@/components/common/ListaEntidade';

// Mock do useToast
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    error: jest.fn(),
  }),
}));

describe('ListaEntidade', () => {
  const mockLoadFunction = jest.fn();
  const mockItems: EntityItem[] = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '123456789',
      status: 'ativo',
    },
  ];

  beforeEach(() => {
    mockLoadFunction.mockResolvedValue(mockItems);
  });

  it('should render loading state initially', () => {
    render(
      <ListaEntidade
        loadFunction={mockLoadFunction}
        hasSearch={false}
      />
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should render items after loading', async () => {
    render(
      <ListaEntidade
        loadFunction={mockLoadFunction}
        hasSearch={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    // Check that email is present somewhere in the document
    expect(screen.getByText(/joao@example\.com/)).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });
});