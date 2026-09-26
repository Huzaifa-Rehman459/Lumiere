import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminContext = createContext(null);
const initialData = {
  products: [
    {
      id: 1,
      name: "Floral Midi Dress",
      sku: "LM-D-001",
      category: "Dresses",
      price: 49.99,
      stock: 34,
    },
    {
      id: 2,
      name: "Wide Leg Trousers",
      sku: "LM-B-002",
      category: "Bottoms",
      price: 39.99,
      stock: 21,
    },
    {
      id: 3,
      name: "Knit Sweater",
      sku: "LM-T-003",
      category: "Tops",
      price: 36.99,
      stock: 8,
    },
  ],
  orders: [
    {
      id: "#1045",
      customer: "Ayesha Khan",
      date: "2026-09-23",
      items: 2,
      total: 89.98,
      status: "Delivered",
    },
    {
      id: "#1044",
      customer: "Fatima Noor",
      date: "2026-09-23",
      items: 1,
      total: 67.5,
      status: "Processing",
    },
    {
      id: "#1043",
      customer: "Sarah Ali",
      date: "2026-09-22",
      items: 3,
      total: 120,
      status: "Shipped",
    },
  ],
  customers: [
    {
      id: 1,
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      orders: 8,
      spent: 429.9,
    },
    {
      id: 2,
      name: "Fatima Noor",
      email: "fatima@example.com",
      orders: 4,
      spent: 212.5,
    },
  ],
  categories: [
    {
      id: 1,
      name: "Dresses",
      description: "Elegant pieces for every occasion.",
    },
    { id: 2, name: "Tops", description: "Everyday essentials." },
    { id: 3, name: "Bottoms", description: "Trousers, skirts and denim." },
  ],
  reviews: [
    {
      id: 1,
      customer: "Ayesha Khan",
      product: "Floral Midi Dress",
      rating: 5,
      text: "Beautiful fabric and perfect fit!",
      status: "Published",
    },
    {
      id: 2,
      customer: "Sarah Ali",
      product: "Knit Sweater",
      rating: 4,
      text: "Very soft and comfortable.",
      status: "Pending",
    },
  ],
  coupons: [
    {
      id: 1,
      code: "WELCOME10",
      type: "Percentage",
      value: 10,
      uses: 38,
      expiry: "2026-12-31",
      status: "Active",
    },
  ],
  admins: [
    {
      id: 1,
      name: "Huzaifa",
      email: "superadmin@lumiere.com",
      role: "Super Admin",
      status: "Active",
    },
  ],
};

export function AdminProvider({ children }) {
  const [data, setData] = useState(() =>
    Object.fromEntries(
      Object.entries(initialData).map(([key, value]) => {
        try {
          return [key, JSON.parse(localStorage.getItem(`lum_${key}`)) || value];
        } catch {
          return [key, value];
        }
      }),
    ),
  );
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("lum_admin")) || null;
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    Object.entries(data).forEach(([key, value]) =>
      localStorage.setItem(`lum_${key}`, JSON.stringify(value)),
    );
  }, [data]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  };
  const updateCollection = (key, updater) => {
    setData((current) => ({
      ...current,
      [key]: typeof updater === "function" ? updater(current[key]) : updater,
    }));
  };
  const login = (email, password) => {
    const match = data.admins.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() && a.status === "Active",
    );
    if (!match || password !== "admin123") return false;
    setAdmin({ name: match.name, email: match.email, role: match.role });
    sessionStorage.setItem(
      "lum_admin",
      JSON.stringify({
        name: match.name,
        email: match.email,
        role: match.role,
      }),
    );
    return true;
  };
  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem("lum_admin");
  };
  const resetDemo = () => setData(initialData);
  const value = useMemo(
    () => ({
      data,
      updateCollection,
      notify,
      admin,
      login,
      logout,
      resetDemo,
      isAuthenticated: Boolean(admin),
      isSuperAdmin: admin?.role === "Super Admin",
    }),
    [data, admin],
  );
  return (
    <AdminContext.Provider value={{ ...value, toast }}>
      {children}
    </AdminContext.Provider>
  );
}
export const useAdmin = () => useContext(AdminContext);
