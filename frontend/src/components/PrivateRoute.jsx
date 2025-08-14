import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, getUserDetails } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      await checkAuth();
      await getUserDetails();
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Checking authentication...</span>
        </Spinner>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
