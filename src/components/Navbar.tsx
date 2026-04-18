'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">My E-Commerce</Link>
      <div className="flex gap-4 items-center">
        <Link href="/products" className="hover:text-gray-300">Products</Link>
        <Link href="/checkout" className="hover:text-gray-300">Checkout</Link>
        <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded">
          <span>Cart: </span>
          <span data-testid="cart-item-count">{itemCount}</span>
        </div>
      </div>
    </nav>
  );
}
