"use client";

import React from 'react';
import TicketDetail from '@/components/tickets/TicketDetail';
import { useParams } from "next/navigation";

const TicketPage: React.FC<TicketPageProps> = () => {

	const params = useParams();
	const ticketId = params.id;
	return (
		<div className="container mx-auto py-8">
			<TicketDetail ticketId={ticketId} />
		</div>
	);
};

export default TicketPage;