import '@testing-library/jest-dom';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Search: () => 'SearchIcon',
  Mail: () => 'MailIcon',
  Phone: () => 'PhoneIcon',
  Loader2: () => 'LoaderIcon',
  Star: () => 'StarIcon',
}));