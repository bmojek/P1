import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

interface RegisterResponse {
  status: number;
  user?: User;
  message?: string;
}

interface ApiContextType {
  users: User[];
  register: (
    login: string,
    password: string,
    email: string
  ) => Promise<RegisterResponse>;
  login: (login: string, password: string) => Promise<User | null>;
  getUserList: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const register = async (
    login: string,
    password: string,
    email: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password, email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data.user]);
        return { status: response.status, user: data.user };
      } else if (response.status === 409) {
        return {
          status: response.status,
          message: "Username is already taken",
        };
      } else {
        console.error("Error registering user", response.statusText);
        return { status: response.status, message: response.statusText };
      }
    } catch (error) {
      console.error("Error registering user", error);
      return { status: 500, message: "Internal server error" };
    }
  };

  const login = async (
    login: string,
    password: string
  ): Promise<User | null> => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user as User;
      } else {
        console.error("Invalid credentials", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error logging in", error);
      return null;
    }
  };

  const getUserList = async () => {
    try {
      const response = await fetch("http://localhost:3000/userlist", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error fetching user list", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user list", error);
    }
  };

  return (
    <ApiContext.Provider value={{ users, register, login, getUserList }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
