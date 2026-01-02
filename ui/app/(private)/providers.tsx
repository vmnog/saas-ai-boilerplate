"use client";

import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
	const [queryClient] = useState(new QueryClient());

	return (
		<SidebarProvider>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</SidebarProvider>
	);
}
