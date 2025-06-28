import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

const ProtectedRoute = ({ children, onLoginClick }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    if (onLoginClick) {
      onLoginClick();
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 