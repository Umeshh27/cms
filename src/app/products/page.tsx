import { getProducts } from '@/lib/cms';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            data-testid={`product-card-${product.id}`}
            className="border border-gray-700 bg-gray-800 rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-48 mb-4">
              <Image 
                src={product.imageUrl || `https://via.placeholder.com/300?text=${product.name}`}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white line-clamp-1">{product.name}</h2>
            <p className="text-gray-300 mb-4">${product.price.toFixed(2)}</p>
            <Link 
              href={`/products/${product.slug}`}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
