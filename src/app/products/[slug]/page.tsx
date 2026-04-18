import { getProductBySlug, getProducts } from '@/lib/cms';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | My E-Commerce`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="relative w-full md:w-1/2 h-96">
        <Image 
          src={product.imageUrl || `https://via.placeholder.com/600?text=${product.name}`}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col flex-1">
        <h1 data-testid="product-title" className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-gray-300 mb-6">
          <span data-testid="product-price">${product.price.toFixed(2)}</span>
        </p>
        <p className="text-gray-400 mb-8 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        
        <div className="mb-6">
          <span className={`px-3 py-1 rounded text-sm ${product.stock > 0 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </div>
  );
}
