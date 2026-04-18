'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items, email, address }),
      });

      const data = await res.json();
      if (data.sessionId) {
        window.location.href = data.url; 
      } else {
        alert('Failed to initialize checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <div className="text-white">Loading cart...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded border border-gray-700 text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <form onSubmit={handleCheckout} className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul className="mb-4 space-y-2">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="text-xl font-bold border-t border-gray-600 pt-4 text-right">
              Total: ${cart.total.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              data-testid="checkout-email-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
            />
          </div>

          <div data-testid="checkout-shipping-address">
            <label className="block text-sm font-medium mb-2">Shipping Address</label>
            <textarea 
              required
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={processing}
            data-testid="checkout-submit-button"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Proceed to Payment (Stripe)'}
          </button>
        </form>
      )}
    </div>
  );
}
