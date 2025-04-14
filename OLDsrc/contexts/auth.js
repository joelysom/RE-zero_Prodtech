{
  /*   

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = (children) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (userToken) {
      const { email, type } = JSON.parse(userToken);
      const usersStorage =
        type === "cliente"
          ? JSON.parse(localStorage.getItem("users_cliente"))
          : JSON.parse(localStorage.getItem("users_tecnico"));

      const hasUser = usersStorage?.find((user) => user.email === email);

      if (hasUser) setUser(hasUser);
    }
  }, []);

  const signin = (email, password, userType) => {
    const usersStorage =
      userType === "cliente"
        ? JSON.parse(localStorage.getItem("users_cliente"))
        : JSON.parse(localStorage.getItem("users_tecnico"));

    const hasUser = usersStorage?.find(
      (user) => user.email === email && user.type === userType
    );

    if (hasUser) {
      if (hasUser.password === password) {
        const token = Math.random().toString(36).substring(2);
        localStorage.setItem(
          "user_token",
          JSON.stringify({ email, token, type: userType })
        );
        setUser({ email, password, type: userType });
        return;
      } else {
        return "E-mail ou senha incorretos";
      }
    } else {
      return "Usuário não cadastrado";
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
*/
}
