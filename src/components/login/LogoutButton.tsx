import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";

export default function LogoutButton() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setToken(null);
    navigate("/");
  };

  return (
    <Button color="inherit" variant="text" onClick={handleLogout}>
      Logout
    </Button>
  );
}
