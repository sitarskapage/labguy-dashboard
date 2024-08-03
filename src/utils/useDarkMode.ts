import { useContext } from "react";
import { GeneralContext } from "../contexts/GeneralContext";

export default function useDarkMode() {
  const { preferences } = useContext(GeneralContext);

  return preferences?.enable_dashboard_darkmode;
}
