import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Alert, AlertProps, Snackbar } from '@mui/material';
import { Preferences } from '../schema/schema';

dayjs.extend(duration);

interface GeneralContextType {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  preferences: Preferences | null;
  setPreferences: Dispatch<SetStateAction<Preferences | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  snackbar: Pick<AlertProps, 'children' | 'severity'> | null;
  setSnackbar: Dispatch<
    SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>
  >;
  setExpiresIn: Dispatch<SetStateAction<number | null>>;
}

export const GeneralContext = createContext<GeneralContextType>({
  token: null,
  setToken: () => null,
  preferences: null,
  setPreferences: () => null,
  loading: false,
  setLoading: () => false,
  snackbar: null,
  setSnackbar: () => null,
  setExpiresIn: () => null
});

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const fetchPreferences = useCallback(async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/preferences`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      setSnackbar({
        children: (error as Error).message,
        severity: 'error'
      });
    }
  }, []);

  const startTokenExpiryTimer = useCallback((expiresIn: number) => {
    const timer = setTimeout(() => {
      setToken(null);
      setExpiresIn(null);
      setSnackbar({
        children: `Authentication token expired. Please log in again.`,
        severity: 'error'
      });
    }, expiresIn);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    token && fetchPreferences(token);
  }, [fetchPreferences, token]);

  useEffect(() => {
    expiresIn && startTokenExpiryTimer(expiresIn);
  }, [expiresIn, startTokenExpiryTimer]);

  return (
    <GeneralContext.Provider
      value={{
        token,
        setToken,
        preferences,
        setPreferences,
        loading,
        setLoading,
        snackbar,
        setSnackbar,
        setExpiresIn
      }}
    >
      {children}

      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={snackbar.severity === 'error' ? null : 6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </GeneralContext.Provider>
  );
};
