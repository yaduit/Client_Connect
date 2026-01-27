import { useContext } from "react";
import { LocationProvider } from "./locationProvider";
export const useLocation = () => {
  const context = useContext(LocationProvider);

  if (!context) {
    throw new Error("useLocation must be used inside LocationProvider");
  }

  return context;
};
