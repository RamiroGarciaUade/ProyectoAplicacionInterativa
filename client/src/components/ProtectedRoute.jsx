import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, onLoginClick }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    onLoginClick();
    return null;
  }

  return children;
}; 