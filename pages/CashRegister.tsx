import React, { useState, useContext } from 'react';
import { AuthContext, DataContext } from '../App';
import { Lock, Unlock, ArrowDownCircle, ArrowUpCircle, MinusCircle, PlusCircle, X, AlertTriangle, Wallet, Banknote, Users, Receipt } from 'lucide-react';

export const CashRegister = () => {
  const { session } = useContext(AuthContext);
  const { cashRegister, movements, openRegister, closeRegister, addMovement } = useContext(DataContext);
  const [amount, setAmount] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'entry' | 'bleed'>('bleed');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementDesc, setMovementDesc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Calculations
  const totalSales = movements.filter(m => m.type === 'sale').reduce((a, b) => a + b.amount, 0);
  const totalEntries = movements.filter(m => m.type === 'entry').reduce((a, b) => a + b.amount, 0);
  const totalBleeds = movements.filter(m => m.type === 'bleed').reduce((a, b) => a + b.amount, 0);
  
  const currentBalance = (cashRegister?.opening_balance || 0) + totalSales + totalEntries - totalBleeds;

  // Categories for Bleed (Sangria)
  const bleedCategories = [
    { id: 'sangria', label: 'Sangria (Retirada)', icon: Wallet },
    { id: 'payment', label: 'Pagamento Despesa', icon: Receipt },
    { id: 'advance', label: 'Vale Funcionário', icon: Users },
    { id: 'other', label: 'Outros', icon: AlertTriangle },
  ];

  const handleOpen = () => {
    if (!amount) return alert('Informe o valor inicial');
    openRegister(parseFloat(amount), session.user.id);
    setAmount('');
  };

  const handleCloseRegister = () => {
    if (window.confirm('Tem certeza que deseja fechar o caixa?')) {
      closeRegister();
    }
  };

  const openMovementModal = (type: 'entry' | 'bleed') => {
    setModalType(type);
    setMovementAmount('');
    setMovementDesc('');
    setSelectedCategory('');
    setIsModalOpen(true);
  };

  const handleCategorySelect = (category: string, label: string) => {
    setSelectedCategory(category);
    setMovementDesc(label);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementAmount || !movementDesc) return;
    
    if (modalType === 'bleed' && parseFloat(movementAmount) > currentBalance) {
      if(!window.confirm('ATENÇÃO: O valor da retirada é maior que o saldo atual do caixa. Deseja continuar mesmo assim?')) {
        return;
      }
    }

    addMovement(modalType, parseFloat(movementAmount), movementDesc);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Wallet className="text-primary w-8 h-8" />
        </div>
        Gerenciamento de Caixa
      </h1>

      {!cashRegister || cashRegister.status === 'closed' ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="text-red-500 w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Caixa Fechado</h2>
            <p className="text-slate-400 mb-8">Informe o fundo de troco para iniciar.</p>
            
            <div className="mb-8 text-left relative bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Fundo de Troco (R$)</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 font-bold pl-3">R$</span>
                <input 
                  type="number" 
                  className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-white text-2xl font-bold focus:ring-0 focus:outline-none placeholder-slate-700"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              onClick={handleOpen} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Abrir Caixa
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-sm">Caixa Aberto</span>
                </div>
                <button 
                  onClick={handleCloseRegister}
                  className="text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  FECHAR CAIXA
                </button>
              </div>
              
              <div className="text-center py-6 bg-slate-950/50 rounded-xl border border-slate-800/50 mb-6">
                <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Saldo em Caixa</p>
                <h2 className="text-5xl font-bold text-white tracking-tight">R$ {currentBalance.toFixed(2)}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => openMovementModal('bleed')}
                  className="group bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                >
                  <div className="bg-slate-900 group-hover:bg-red-500/20 p-3 rounded-full transition-colors">
                    <MinusCircle size={24} />
                  </div>
                  <span className="font-bold text-sm">Retirada / Sangria</span>
                </button>
                <button 
                  onClick={() => openMovementModal('entry')}
                  className="group bg-slate-800 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                >
                  <div className="bg-slate-900 group-hover:bg-blue-500/20 p-3 rounded-full transition-colors">
                    <PlusCircle size={24} />
                  </div>
                  <span className="font-bold text-sm">Suprimento</span>
                </button>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-sm">Fundo de Troco</span>
                <span className="text-white font-medium">R$ {cashRegister.opening_balance.toFixed(2)}</span>
              </div>
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-emerald-400 flex items-center gap-2 text-sm"><ArrowDownCircle size={16}/> Vendas</span>
                <span className="text-emerald-400 font-bold">+ R$ {totalSales.toFixed(2)}</span>
              </div>
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-blue-400 flex items-center gap-2 text-sm"><PlusCircle size={16}/> Suprimentos</span>
                <span className="text-blue-400 font-bold">+ R$ {totalEntries.toFixed(2)}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-red-400 flex items-center gap-2 text-sm"><MinusCircle size={16}/> Sangrias</span>
                <span className="text-red-400 font-bold">- R$ {totalBleeds.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[600px] shadow-lg">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Histórico de Movimentações</h3>
              <div className="text-xs text-slate-500">Hoje</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {movements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Banknote size={48} className="mb-4 opacity-50" />
                  <p>Nenhuma movimentação registrada.</p>
                </div>
              ) : (
                movements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                        ${mov.type === 'sale' ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20' : 
                          mov.type === 'entry' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20' : 
                          'bg-red-500/10 text-red-500 group-hover:bg-red-500/20'}`}>
                        {mov.type === 'sale' ? <ArrowDownCircle size={24} /> : 
                         mov.type === 'entry' ? <PlusCircle size={24} /> : 
                         <MinusCircle size={24} />}
                      </div>
                      <div>
                        <p className="text-white font-bold">{mov.description || (mov.type === 'sale' ? 'Venda' : mov.type === 'entry' ? 'Suprimento' : 'Sangria')}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(mov.created_at).toLocaleTimeString()} • {mov.type === 'sale' ? 'Entrada (Venda)' : mov.type === 'entry' ? 'Entrada (Manual)' : 'Saída (Manual)'}</p>
                      </div>
                    </div>
                    <span className={`font-mono text-lg font-bold
                      ${mov.type === 'bleed' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {mov.type === 'bleed' ? '-' : '+'} R$ {mov.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entry/Bleed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl w-full max-w-lg p-0 border border-slate-800 shadow-2xl transform transition-all overflow-hidden">
            <div className={`p-6 border-b border-slate-800 flex justify-between items-center ${modalType === 'bleed' ? 'bg-red-500/5' : 'bg-blue-500/5'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-3 ${modalType === 'bleed' ? 'text-red-400' : 'text-blue-400'}`}>
                <div className={`p-2 rounded-lg ${modalType === 'bleed' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                   {modalType === 'bleed' ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
                </div>
                {modalType === 'bleed' ? 'Registrar Saída (Sangria)' : 'Registrar Entrada (Suprimento)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveMovement} className="p-6 space-y-6">
              {modalType === 'bleed' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Tipo de Saída</label>
                  <div className="grid grid-cols-2 gap-3">
                    {bleedCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id, cat.label)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                          ${selectedCategory === cat.id 
                            ? 'bg-red-500/20 border-red-500/50 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                      >
                        <cat.icon size={20} />
                        <span className="text-xs font-bold">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Valor (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white text-xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder-slate-700"
                    placeholder="0.00"
                    value={movementAmount}
                    onChange={e => setMovementAmount(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder-slate-600"
                  placeholder="Descreva o motivo..."
                  value={movementDesc}
                  onChange={e => setMovementDesc(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95
                    ${modalType === 'bleed' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'}`}
                >
                  Confirmar {modalType === 'bleed' ? 'Saída' : 'Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};