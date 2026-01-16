import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  BarChart3, 
  LogOut, 
  Wallet,
  Menu,
  X
} from 'lucide-react';

export const Layout = () => {
  const { signOut, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">M</div>
          <h1 className="text-xl font-bold tracking-tight">ModaPDV</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/pdv" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCart size={20} />
            <span>PDV</span>
          </NavLink>

          {userRole === 'manager' && (
            <>
              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gerência
              </div>
              <NavLink to="/produtos" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                <Package size={20} />
                <span>Produtos</span>
              </NavLink>
              <NavLink to="/estoque" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                <ClipboardList size={20} />
                <span>Estoque</span>
              </NavLink>
              <NavLink to="/caixa" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                <Wallet size={20} />
                <span>Caixa</span>
              </NavLink>
              <NavLink to="/relatorios" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 size={20} />
                <span>Relatórios</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        <Outlet />
      </main>
      
      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};