import React from 'react';
import AdvogadoTicketsList from '@/components/tickets/AdvogadoTicketsList';

const AdvogadoTicketsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <AdvogadoTicketsList />
    </div>
  );
};

export default AdvogadoTicketsPage;