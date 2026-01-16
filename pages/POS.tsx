import React, { useState, useContext } from 'react';
import { AuthContext, DataContext } from '../App';
import { ProductWithVariants, CartItem, Variant, PaymentMethod } from '../types';
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Banknote, QrCode, X, Loader2 } from 'lucide-react';

export const POS = () => {
  const { products, cashRegister, createSale } = useContext(DataContext);
  const { session } = useContext(AuthContext);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (product: ProductWithVariants, variant: Variant) => {
    // Check if enough stock in context (simple check)
    // Note: In real app we should check latest from DB. Here we rely on context.
    // Also check current cart usage.
    const cartQty = cart.find(i => i.variant_id === variant.id)?.quantity || 0;
    
    if (cartQty + 1 > variant.stock_quantity) {
      alert('Estoque insuficiente!');
      return;
    }

    const existing = cart.find(item => item.variant_id === variant.id);
    const price = product.promo_price || product.price;

    if (existing) {
      setCart(cart.map(item => 
        item.variant_id === variant.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        variant_id: variant.id,
        product_id: product.id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        price: price,
        quantity: 1
      }]);
    }
    setSelectedProduct(null);
  };

  const removeFromCart = (variantId: number) => {
    setCart(cart.filter(item => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.variant_id === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        // We should check max stock here too
        const product = products.find(p => p.id === item.product_id);
        const variant = product?.variants.find(v => v.id === variantId);
        if (variant && newQty > variant.stock_quantity) {
           return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const handleCheckout = async () => {
    if (!cashRegister) {
      alert('Caixa fechado! Por favor, abra o caixa antes de realizar vendas.');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      createSale(
        total,
        discount,
        paymentMethod,
        cart.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price_at_sale: item.price,
          // for local stock update logic
          current_stock: products.find(p => p.id === item.product_id)?.variants.find(v => v.id === item.variant_id)?.stock_quantity || 0
        }))
      );

      alert('Venda realizada com sucesso!');
      setCart([]);
      setIsCheckoutOpen(false);
      setDiscount(0);
      setIsProcessing(false);
    }, 500);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar produto por nome ou código..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-20">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-4 text-left transition-all flex flex-col justify-between h-48"
            >
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</span>
                <h3 className="font-semibold text-white mt-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-slate-400 mt-1">Ref: {product.code}</p>
              </div>
              <div className="mt-4">
                {product.promo_price ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 line-through">R$ {product.price.toFixed(2)}</span>
                    <span className="text-lg font-bold text-accent">R$ {product.promo_price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-white">R$ {product.price.toFixed(2)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <ShoppingCart className="text-primary" />
          <h2 className="text-xl font-bold text-white">Carrinho</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.variant_id}-${idx}`} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center group">
                <div className="flex-1">
                  <h4 className="font-medium text-white truncate w-40">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.size} / {item.color}</p>
                  <div className="flex items-center gap-3 mt-2">
                     <button onClick={() => updateQuantity(item.variant_id, -1)} className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center hover:bg-slate-600">-</button>
                     <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.variant_id, 1)} className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center hover:bg-slate-600">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.variant_id)} className="text-slate-500 hover:text-red-400 mt-2 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-800 border-t border-slate-700">
          <div className="flex justify-between mb-2 text-slate-400">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-slate-400">
            <span>Desconto</span>
            <span>R$ {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-6 text-2xl font-bold text-white">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-lg p-6 border border-slate-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                <p className="text-slate-400">Selecione a variação</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">
                <X />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedProduct.variants.map(variant => (
                <button
                  key={variant.id}
                  disabled={variant.stock_quantity === 0}
                  onClick={() => addToCart(selectedProduct, variant)}
                  className="w-full flex justify-between items-center p-4 rounded-xl border border-slate-700 hover:border-primary bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <div className="text-left">
                    <span className="block font-bold text-white text-lg">{variant.size} - {variant.color}</span>
                    <span className="text-sm text-slate-400">Estoque: {variant.stock_quantity}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                    <Plus size={16} />
                  </div>
                </button>
              ))}
              {selectedProduct.variants.length === 0 && (
                <p className="text-center text-slate-500 py-4">Sem variações cadastradas.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl p-8 border border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Pagamento</h2>
              <button onClick={() => setIsCheckoutOpen(false)}><X /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'credit' ? 'border-primary bg-primary/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    <CreditCard />
                    <span>Crédito</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('debit')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'debit' ? 'border-primary bg-primary/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    <CreditCard />
                    <span>Débito</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('money')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'money' ? 'border-primary bg-primary/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    <Banknote />
                    <span>Dinheiro</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${paymentMethod === 'pix' ? 'border-primary bg-primary/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    <QrCode />
                    <span>Pix</span>
                  </button>
                </div>

                <div className="mt-6">
                   <label className="block text-sm font-medium text-slate-400 mb-2">Desconto (R$)</label>
                   <input 
                    type="number" 
                    value={discount} 
                    onChange={e => setDiscount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                   />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Itens</span>
                    <span>{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Desconto</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                    <span className="text-lg">Total a Pagar</span>
                    <span className="text-3xl font-bold text-emerald-400">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirmar Pagamento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};