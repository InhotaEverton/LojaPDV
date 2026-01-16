import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { POS } from './pages/POS';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { CashRegister } from './pages/CashRegister';
import { Reports } from './pages/Reports';
import { Dashboard } from './pages/Dashboard';
import { UserRole, ProductWithVariants, CashRegister as CashRegisterType } from './types';

// --- Types for Mock Data Context ---
interface DataContextType {
  products: ProductWithVariants[];
  sales: any[];
  cashRegister: CashRegisterType | null;
  movements: any[];
  addProduct: (product: any, variants: any[]) => void;
  updateProduct: (id: number, product: any, variants: any[]) => void;
  updateStock: (variantId: number, newQty: number) => void;
  createSale: (total: number, discount: number, method: string, items: any[]) => void;
  openRegister: (amount: number, userId: string) => void;
  closeRegister: () => void;
  addMovement: (type: 'entry' | 'bleed', amount: number, description: string) => void;
}

export const DataContext = createContext<DataContextType>({} as any);

// --- Mock Data Provider ---
const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  // Initial Seed Data
  const [products, setProducts] = useState<ProductWithVariants[]>([
    {
      id: 1, name: 'Camiseta Básica', code: 'CAM001', category: 'Camisetas', brand: 'Hering', price: 49.90, promo_price: 0, status: 'active',
      variants: [
        { id: 101, product_id: 1, size: 'M', color: 'Preto', stock_quantity: 10 },
        { id: 102, product_id: 1, size: 'G', color: 'Preto', stock_quantity: 5 },
        { id: 103, product_id: 1, size: 'M', color: 'Branco', stock_quantity: 8 }
      ]
    },
    {
      id: 2, name: 'Calça Jeans Slim', code: 'JEANS01', category: 'Calças', brand: 'Levis', price: 199.90, promo_price: 0, status: 'active',
      variants: [
        { id: 201, product_id: 2, size: '40', color: 'Jeans', stock_quantity: 15 },
        { id: 202, product_id: 2, size: '42', color: 'Jeans', stock_quantity: 12 }
      ]
    },
    {
      id: 3, name: 'Vestido Floral', code: 'VEST001', category: 'Vestidos', brand: 'Zara', price: 129.90, promo_price: 0, status: 'active',
      variants: [
        { id: 301, product_id: 3, size: 'P', color: 'Vermelho', stock_quantity: 3 }
      ]
    }
  ]);

  const [sales, setSales] = useState<any[]>([]);
  const [cashRegister, setCashRegister] = useState<CashRegisterType | null>(null);
  const [movements, setMovements] = useState<any[]>([]);

  const addProduct = (productData: any, variantsData: any[]) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newVariants = variantsData.map((v, idx) => ({
      ...v,
      id: Date.now() + idx,
      product_id: newId
    }));
    const newProduct = { ...productData, id: newId, variants: newVariants };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id: number, productData: any, variantsData: any[]) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        // Re-generate variant IDs for simplicity in mock
        const newVariants = variantsData.map((v, idx) => ({
          ...v,
          id: v.id || Date.now() + idx,
          product_id: id
        }));
        return { ...productData, id, variants: newVariants };
      }
      return p;
    }));
  };

  const updateStock = (variantId: number, newQty: number) => {
    setProducts(products.map(p => ({
      ...p,
      variants: p.variants.map(v => v.id === variantId ? { ...v, stock_quantity: newQty } : v)
    })));
  };

  const openRegister = (amount: number, userId: string) => {
    const newRegister: CashRegisterType = {
      id: Date.now(),
      user_id: userId,
      opening_balance: amount,
      status: 'open',
      opened_at: new Date().toISOString()
    };
    setCashRegister(newRegister);
  };

  const closeRegister = () => {
    if (cashRegister) {
      setCashRegister({ ...cashRegister, status: 'closed', closed_at: new Date().toISOString() });
      setCashRegister(null);
      setMovements([]);
    }
  };

  const addMovement = (type: 'entry' | 'bleed', amount: number, description: string) => {
    if (cashRegister) {
      const newMovement = {
        id: Date.now(),
        register_id: cashRegister.id,
        type,
        amount,
        description,
        created_at: new Date().toISOString()
      };
      setMovements([newMovement, ...movements]);
    }
  };

  const createSale = (total: number, discount: number, method: string, items: any[]) => {
    const saleId = Date.now();
    const newSale = {
      id: saleId,
      total,
      discount,
      payment_method: method,
      created_at: new Date().toISOString(),
      items
    };
    setSales([...sales, newSale]);

    // Update Stock
    items.forEach(item => {
      updateStock(item.variant_id, Math.max(0, item.current_stock - item.quantity));
    });

    // Add movement if register is open
    if (cashRegister) {
      setMovements([
        { id: Date.now(), register_id: cashRegister.id, type: 'sale', amount: total, description: `Venda #${saleId}`, created_at: new Date().toISOString() },
        ...movements
      ]);
    }
  };

  return (
    <DataContext.Provider value={{
      products, sales, cashRegister, movements,
      addProduct, updateProduct, updateStock, createSale, openRegister, closeRegister, addMovement
    }}>
      {children}
    </DataContext.Provider>
  );
};

// --- Auth Context ---
interface AuthContextType {
  session: any;
  userRole: UserRole | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({ session: null, userRole: null, signIn: () => {}, signOut: () => {} });

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const signIn = (email: string) => {
    const role = email.includes('admin') ? 'manager' : 'seller';
    const fakeSession = { user: { id: 'mock-id', email } };
    setSession(fakeSession);
    setUserRole(role);
    localStorage.setItem('mock_session', JSON.stringify(fakeSession));
    localStorage.setItem('mock_role', role);
  };

  const signOut = () => {
    setSession(null);
    setUserRole(null);
    localStorage.removeItem('mock_session');
    localStorage.removeItem('mock_role');
  };

  useEffect(() => {
    const stored = localStorage.getItem('mock_session');
    const role = localStorage.getItem('mock_role');
    if (stored) {
      setSession(JSON.parse(stored));
      if (role) setUserRole(role as UserRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, userRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { session, userRole } = useContext(AuthContext);

  if (!session) return <Navigate to="/login" replace />;
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="pdv" element={
                <ProtectedRoute>
                  <POS />
                </ProtectedRoute>
              } />
              
              <Route path="produtos" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <Products />
                </ProtectedRoute>
              } />
              
              <Route path="estoque" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              <Route path="caixa" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <CashRegister />
                </ProtectedRoute>
              } />
              
              <Route path="relatorios" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <Reports />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </DataProvider>
  );
}