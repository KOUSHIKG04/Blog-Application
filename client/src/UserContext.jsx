import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvidesr = ({ children }) => {
  const [UserInfo, setUserInfo] = useState({});
  return (
    <UserContext.Provider value={{ UserInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
