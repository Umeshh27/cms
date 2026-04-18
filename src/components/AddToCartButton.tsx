'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ productId, stock }: { productId: string, stock: number }) {
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(productId, 1);
    setAdding(false);
  };

  const isOutOfStock = stock <= 0;

  return (
    <button
      data-testid="add-to-cart-button"
      onClick={handleAddToCart}
      disabled={isOutOfStock || isLoading || adding}
      className={`py-3 px-6 rounded font-semibold transition-colors ${
        isOutOfStock 
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
