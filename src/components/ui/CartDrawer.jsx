import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const {
        cartItems,
        isCartOpen,
        toggleCart,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const navigate = useNavigate();
    const overlayRef = useRef(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                toggleCart();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isCartOpen, toggleCart]);

    // Disable body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        alert("Proceeding to checkout! (This would typically navigate to a Checkout page)");
        toggleCart();
        // navigate('/checkout'); 
    };

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform translate-x-0 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <ShoppingBag className="text-blue-600" />
                        Your Cart
                        <span className="text-sm font-normal text-slate-500">
                            ({cartItems.length} items)
                        </span>
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                            <ShoppingBag size={64} className="text-slate-300" />
                            <div>
                                <h3 className="text-lg font-medium text-slate-700">Your cart is empty</h3>
                                <p className="text-slate-500">Looks like you haven't added anything yet.</p>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="mt-4 text-blue-600 font-medium hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                {/* Product Image */}
                                <div className="h-20 w-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-slate-500 hover:text-blue-600 disabled:opacity-50"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-slate-500 hover:text-blue-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50">
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-800 pt-3 border-t border-slate-200">
                                <span>Total</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
                        >
                            Checkout Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
