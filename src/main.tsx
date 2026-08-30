import MswProvider from '@/src/contexts/MswProvider';
import QueryProvider from '@/src/contexts/QueryProvider';
import RouterProvider from '@/src/contexts/RouterProvider';
import ServiceProvider from '@/src/contexts/ServiceProvider';
import '@/src/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* MSW 워커가 준비된 뒤에 앱을 렌더링해야 첫 요청까지 가로챌 수 있다 */}
		<MswProvider>
			<QueryProvider>
				<ServiceProvider>
					<RouterProvider />
				</ServiceProvider>
			</QueryProvider>
		</MswProvider>
	</StrictMode>,
);
