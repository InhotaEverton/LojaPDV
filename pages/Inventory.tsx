import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../App';
import { Search } from 'lucide-react';

export const Inventory = () => {
  const { products, updateStock } = useContext(DataContext);
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten product variants for the table
  useEffect(() => {
    const flatItems: any[] = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        flatItems.push({
          id: v.id,
          size: v.size,
          color: v.color,
          stock_quantity: v.stock_quantity,
          products: { name: p.name, code: p.code, brand: p.brand }
        });
      });
    });
    setItems(flatItems);
  }, [products]);

  const handleStockUpdate = (id: number, newQty: number) => {
    updateStock(id, newQty);
  };

  const filteredItems = items.filter(i => 
    i.products.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.products.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Controle de Estoque (Offline)</h1>
      
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 relative">
         <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
         <input 
           className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-12 text-white"
           placeholder="Buscar por produto ou código..."
           value={searchTerm}
           onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400">
             <tr>
               <th className="p-4">Produto</th>
               <th className="p-4">Cor/Tamanho</th>
               <th className="p-4">Quantidade Atual</th>
               <th className="p-4">Ajuste Rápido</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
             {filteredItems.map(item => (
               <tr key={item.id} className="hover:bg-slate-800/50">
                 <td className="p-4 text-white">
                   <div className="font-medium">{item.products.name}</div>
                   <div className="text-xs text-slate-500">{item.products.code} | {item.products.brand}</div>
                 </td>
                 <td className="p-4 text-slate-300">
                   <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs mr-2">{item.color}</span>
                   <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold">{item.size}</span>
                 </td>
                 <td className="p-4">
                   <span className={`font-bold ${item.stock_quantity < 5 ? 'text-red-500' : 'text-emerald-500'}`}>
                     {item.stock_quantity}
                   </span>
                 </td>
                 <td className="p-4 flex gap-2">
                   <input 
                     type="number"
                     className="w-20 bg-slate-950 border border-slate-700 rounded p-1 text-white text-center"
                     value={item.stock_quantity}
                     onChange={(e) => handleStockUpdate(item.id, Number(e.target.value))}
                   />
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};