import React, {
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
}

// initial values
const initialAuthContext: AuthContextType = {
  token: null,
  setToken: () => {},
};

//  props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
