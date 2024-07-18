import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { Root2 as Settings } from "../components/settings/settings";
import { Alert, AlertProps, Snackbar } from "@mui/material";

interface GeneralContextType {
  settings: Settings | null;
  setSettings: Dispatch<React.SetStateAction<Settings | null>>;
  loading: boolean;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
  snackbar: Pick<AlertProps, "children" | "severity"> | null;
  setSnackbar: Dispatch<
    React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>
  >;
}

export const GeneralContext = createContext<GeneralContextType>({
  settings: null,
  setSettings: () => null,
  loading: false,
  setLoading: () => false,
  snackbar: null,
  setSnackbar: () => null,
});

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_API_URL}/settings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [token]);
  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <GeneralContext.Provider
      value={{
        settings,
        setSettings,
        loading,
        setLoading,
        snackbar,
        setSnackbar,
      }}>
      {children}
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={snackbar.severity == "error" ? null : 6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </GeneralContext.Provider>
  );
};
