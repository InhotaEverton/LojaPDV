import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FileDown } from 'lucide-react';

export const Reports = () => {
  const { sales } = useContext(DataContext);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Group by day
    const grouped = sales.reduce((acc: any, curr) => {
      const date = curr.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    }, {});

    const chartData = Object.keys(grouped).map(date => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      total: grouped[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);

    setData(chartData);
  }, [sales]);

  const handleExport = () => {
    alert('Funcionalidade de exportação simulação: PDF gerado!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Relatórios de Vendas (Offline)</h1>
        <button onClick={handleExport} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
          <FileDown size={18} /> Exportar PDF
        </button>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-96">
        <h3 className="text-lg font-medium text-slate-400 mb-6">Faturamento Diário</h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
           <div className="h-full flex items-center justify-center text-slate-500">Sem dados de vendas para exibir</div>
        )}
      </div>
    </div>
  );
};