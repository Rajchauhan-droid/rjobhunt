import { useEffect, useState } from "react";

export const useAuthRole = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData =
      JSON.parse(localStorage.getItem("adminUser")) ||
      JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (userData) {
      setUser(userData);
      const normalizedRole = userData.role?.replace("ROLE_", "").toLowerCase();
      setRole(normalizedRole);
    }
  }, []);

  return { user, role };
};
