import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserLoading } from '../redux/userSlice';

export const ProtectedRoute = ({ children, onLoginClick }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);

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