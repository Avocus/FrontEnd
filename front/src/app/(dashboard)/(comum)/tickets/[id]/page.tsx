"use client";

import React from 'react';
import TicketDetail from '@/components/tickets/TicketDetail';
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLayout } from "@/contexts/LayoutContext";

export default function TicketPage() {

	const { updateConfig } = useLayout();

	useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

	const params = useParams();
	const ticketId = params?.id as string;;
	return (
		<div className="container mx-auto py-8">
			<TicketDetail ticketId={ticketId} />
		</div>
	);
};