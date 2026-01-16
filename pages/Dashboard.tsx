import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, DataContext } from '../App';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  const { session, userRole } = useContext(AuthContext);
  const { sales, products } = useContext(DataContext);
  const [stats, setStats] = useState({
    todaySales: 0,
    monthSales: 0,
    lowStock: 0,
    totalOrders: 0
  });

  useEffect(() => {
    calculateStats();
  }, [sales, products]);

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySalesData = sales.filter(s => s.created_at.startsWith(today));
    
    // Simple logic for month (using string matching for demo)
    const currentMonth = new Date().toISOString().slice(0, 7); 
    const monthSalesData = sales.filter(s => s.created_at.startsWith(currentMonth));

    let lowStockCount = 0;
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock_quantity < 5) lowStockCount++;
      });
    });

    setStats({
      todaySales: todaySalesData.reduce((acc, curr) => acc + curr.total, 0),
      monthSales: monthSalesData.reduce((acc, curr) => acc + curr.total, 0),
      lowStock: lowStockCount,
      totalOrders: todaySalesData.length
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subText }: any) => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {subText && <p className="text-xs text-slate-500 mt-2">{subText}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo, {session?.user.email?.split('@')[0]}</h1>
        <p className="text-slate-400">Visão geral da sua loja hoje (Modo Offline).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Vendas Hoje" 
          value={`R$ ${stats.todaySales.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-emerald-500 text-emerald-500"
          subText={`${stats.totalOrders} pedidos realizados`}
        />
        <StatCard 
          title="Vendas Mês" 
          value={`R$ ${stats.monthSales.toFixed(2)}`} 
          icon={TrendingUp} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Estoque Baixo" 
          value={stats.lowStock} 
          icon={AlertTriangle} 
          color="bg-orange-500 text-orange-500"
          subText="Vars com < 5 unidades"
        />
        <StatCard 
          title="Total Pedidos" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-purple-500 text-purple-500" 
        />
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="#/pdv" className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-primary" />
            <span className="font-medium">Nova Venda</span>
          </a>
          {userRole === 'manager' && (
            <>
              <a href="#/produtos" className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <span className="font-medium">Cadastrar Produto</span>
              </a>
              <a href="#/caixa" className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <span className="font-medium">Gerenciar Caixa</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};