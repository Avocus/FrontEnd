/**
 * Interface para itens de navegação (navbar, sidebar)
 */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

/**
 * Interface para conteúdo/cards de biblioteca e videoteca
 */
export interface Content {
  id: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  date?: string;
  author?: string;
  category?: string;
  views?: number;
  time?: string;
}

/**
 * Interface para props de componentes de detalhe de caso/processo
 */
export interface CasoDetailProps {
  id?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
} 