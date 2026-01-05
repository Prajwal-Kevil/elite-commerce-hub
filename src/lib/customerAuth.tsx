import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CustomerUser {
  email: string;
  name: string;
  createdAt: string;
}

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  user: CustomerUser | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<CustomerUser>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

const CUSTOMER_USERS_KEY = "silkroad_customers";
const CUSTOMER_AUTH_KEY = "silkroad_customer_auth";

interface StoredCustomer {
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(CUSTOMER_AUTH_KEY);
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUser({ email: parsed.email, name: parsed.name, createdAt: parsed.createdAt });
    }
  }, []);

  const getCustomers = (): StoredCustomer[] => {
    const stored = localStorage.getItem(CUSTOMER_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveCustomers = (customers: StoredCustomer[]) => {
    localStorage.setItem(CUSTOMER_USERS_KEY, JSON.stringify(customers));
  };

  const signup = (email: string, password: string, name: string): boolean => {
    const customers = getCustomers();
    const exists = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return false;
    }

    const newCustomer: StoredCustomer = {
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    customers.push(newCustomer);
    saveCustomers(customers);
    
    localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify({ 
      email, 
      name, 
      createdAt: newCustomer.createdAt 
    }));
    setIsAuthenticated(true);
    setUser({ email, name, createdAt: newCustomer.createdAt });
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const customers = getCustomers();
    const found = customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (found) {
      localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify({ 
        email: found.email, 
        name: found.name,
        createdAt: found.createdAt 
      }));
      setIsAuthenticated(true);
      setUser({ email: found.email, name: found.name, createdAt: found.createdAt });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (updates: Partial<CustomerUser>) => {
    if (!user) return;
    
    const customers = getCustomers();
    const updatedCustomers = customers.map((c) => {
      if (c.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...c, ...updates };
      }
      return c;
    });
    saveCustomers(updatedCustomers);

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(updatedUser));
  };

  return (
    <CustomerAuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
};
