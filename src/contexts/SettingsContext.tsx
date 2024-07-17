import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { Root2 as Settings } from "../components/settings/settings";

interface SettingsContextType {
  settings: Settings | null;
  updateSettings: (newSettings: Settings) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  updateSettings: async () => {
    throw new Error("Settings context not initialized");
  },
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { token } = useContext(AuthContext);

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

  const updateSettings = async (newSettings: Settings) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/settings/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(newSettings),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update settings");
      }
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
