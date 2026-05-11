
import { AuthProvider } from './features/auth/components/AuthProvider';
import { AppRouter } from './app/router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
