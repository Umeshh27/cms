import { prisma } from './prisma';
import { unstable_cache } from 'next/cache';

export const getProducts = unstable_cache(
  async () => {
    return await prisma.product.findMany();
  },
  ['cms-products'],
  {
    tags: ['products'], 
  }
);

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug },
    });
  },
  ['cms-product-slug'],
  {
    tags: ['products'], 
  }
);
