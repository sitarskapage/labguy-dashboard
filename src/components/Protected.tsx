import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { GeneralContext } from '../contexts/GeneralContext';

export default function Protected() {
  const { token } = useContext(GeneralContext);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (token === null) {
      setRedirecting(true);
    } else {
      setRedirecting(false);
    }
  }, [token]);

  if (redirecting) {
    return <Navigate to={`/${import.meta.env.VITE_ADMIN_PATH}/login`} />;
  }

  return <Outlet />;
}
