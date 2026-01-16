import React, { useState, useContext } from 'react';
import { DataContext } from '../App';
import { ProductWithVariants, Variant } from '../types';
import { COLORS, SIZES, CATEGORIES } from '../constants';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

export const Products = () => {
  const { products, addProduct, updateProduct } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: CATEGORIES[0],
    brand: '',
    price: 0,
    promo_price: 0,
    status: 'active'
  });

  const [variants, setVariants] = useState<Partial<Variant>[]>([]);

  const handleSave = () => {
    try {
      const productPayload = {
        name: formData.name,
        code: formData.code,
        category: formData.category,
        brand: formData.brand,
        price: formData.price,
        promo_price: formData.promo_price || null,
        status: formData.status
      };

      if (editingId) {
        updateProduct(editingId, productPayload, variants);
      } else {
        addProduct(productPayload, variants);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', category: CATEGORIES[0], brand: '', price: 0, promo_price: 0, status: 'active' });
    setVariants([]);
    setEditingId(null);
  };

  const handleEdit = (product: ProductWithVariants) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      brand: product.brand,
      price: product.price,
      promo_price: product.promo_price || 0,
      status: product.status as any
    });
    setVariants(product.variants);
    setIsModalOpen(true);
  };

  const addVariant = () => {
    setVariants([...variants, { size: SIZES[0], color: COLORS[0], stock_quantity: 0 }]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Common input styles
  const inputBaseClass = "w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors";
  const inputWithIconClass = "w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Produtos (Offline)</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Código</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque Total</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/50">
                <td className="p-4">
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.category} - {p.brand}</div>
                </td>
                <td className="p-4 text-slate-300">{p.code}</td>
                <td className="p-4 text-slate-300">R$ {p.price.toFixed(2)}</td>
                <td className="p-4 text-slate-300">{p.variants.reduce((a, b) => a + (b.stock_quantity || 0), 0)}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-slate-700 rounded text-blue-400"><Edit size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-4xl p-6 border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-slate-400 font-medium border-b border-slate-800 pb-2">Informações Básicas</h3>
                
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Nome</label>
                  <input 
                    className={inputBaseClass} 
                    placeholder="Nome do Produto" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Código</label>
                     <input className={inputBaseClass} placeholder="Ref" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Marca</label>
                     <input className={inputBaseClass} placeholder="Marca" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Categoria</label>
                     <select className={inputBaseClass} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Status</label>
                     <select className={inputBaseClass} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                       <option value="active">Ativo</option>
                       <option value="inactive">Inativo</option>
                     </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Preço</label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <input type="number" className={inputWithIconClass} placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm text-slate-500 mb-1">Promoção</label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <input type="number" className={inputWithIconClass} placeholder="0.00" value={formData.promo_price} onChange={e => setFormData({...formData, promo_price: Number(e.target.value)})} />
                     </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                   <h3 className="text-slate-400 font-medium">Variações e Estoque</h3>
                   <button onClick={addVariant} className="text-primary text-sm font-bold flex items-center hover:underline"><Plus size={14} /> Adicionar</button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                   {variants.map((v, idx) => (
                     <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded border border-slate-800">
                        <select className="bg-slate-900 border border-slate-700 rounded p-1 text-sm text-white" value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)}>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select className="bg-slate-900 border border-slate-700 rounded p-1 text-sm text-white" value={v.color} onChange={e => updateVariant(idx, 'color', e.target.value)}>
                          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-white" placeholder="Qtd" value={v.stock_quantity} onChange={e => updateVariant(idx, 'stock_quantity', Number(e.target.value))} />
                        <button onClick={() => removeVariant(idx)} className="text-red-500 p-1 hover:bg-slate-800 rounded"><Trash size={14} /></button>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg hover:bg-slate-800 text-white transition-colors">Cancelar</button>
               <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors">
                  <Save size={18} /> Salvar Produto
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};