import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get('cart');

  let cartItems = [];
  if (cartCookie?.value) {
    try {
      cartItems = JSON.parse(cartCookie.value);
    } catch (e) {
      console.error('Failed to parse cart cookie', e);
    }
  }

  const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return NextResponse.json({
    items: cartItems,
    total: total,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const cookieStore = cookies();
    const cartCookie = cookieStore.get('cart');
    let cartItems: any[] = [];
    
    if (cartCookie?.value) {
      try {
        cartItems = JSON.parse(cartCookie.value);
      } catch (e) {
        console.error('Failed to parse cart cookie', e);
      }
    }

    const existingIndex = cartItems.findIndex((item) => item.productId === productId);
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }

    cookieStore.set('cart', JSON.stringify(cartItems), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, 
    });

    return NextResponse.json({ success: true, items: cartItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
