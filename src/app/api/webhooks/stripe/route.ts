import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    let itemsData = [];
    if (session.metadata && session.metadata.items) {
      itemsData = JSON.parse(session.metadata.items);
    }

    try {
      let user = await prisma.user.findUnique({
        where: { email: session.customer_email || 'guest@example.com' },
      });

      if (!user) {
         user = await prisma.user.create({
            data: {
                email: session.customer_email || 'guest@example.com',
                password: 'random-password', 
            }
         });
      }

      const amountTotal = (session.amount_total || 0) / 100;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          total: amountTotal,
          status: 'PAID',
          stripeSessionId: session.id,
        },
      });

      for (const item of itemsData) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (product) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
            },
          });
          
          await prisma.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }
      
      console.log(`Order created successfully: ${order.id}`);
    } catch (dbError) {
      console.error('Error writing to DB during webhook', dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
