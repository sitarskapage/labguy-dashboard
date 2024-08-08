import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { GeneralContext } from '../../contexts/GeneralContext';

export default function LogoutButton() {
  const { setToken } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setToken(null);
    navigate('login');
  };

  return (
    <Button color="inherit" variant="text" onClick={handleLogout}>
      Logout
    </Button>
  );
}
