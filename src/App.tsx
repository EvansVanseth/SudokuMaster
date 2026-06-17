
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/components/AuthProvider';
import { AppRouter } from './app/router/AppRouter';
import { AppLayout } from './app/layouts/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
