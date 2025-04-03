import cron from 'node-cron';
import { prisma } from '../configs/prisma.js';
import { OrderStatus } from '@prisma/client';

const BUFFER_TIME = 15 * 60 * 1000;

const updateOrderStatus = async () => {
  try {
    const shippedOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.SHIPPED,
      },
      include: {
        shippingCost: true,
      },
    });

    for (const order of shippedOrders) {
      const shippingCost = order.shippingCost;

      if (shippingCost && shippingCost.estimatedTime) {
        if (
          typeof shippingCost.estimatedTime !== 'number' ||
          shippingCost.estimatedTime <= 0
        ) {
          console.warn(
            `Invalid estimatedTime for order ID ${order.id}: ${shippingCost.estimatedTime}`,
          );
          continue;
        }

        const shippingAt = order.shippingAt;
        const estimatedDeliveryTime = shippingAt
          ? new Date(
              shippingAt.getTime() +
                shippingCost.estimatedTime * 24 * 60 * 60 * 1000,
            )
          : null;
        const currentTime = new Date();

        if (estimatedDeliveryTime) {
          if (
            currentTime >
            new Date(estimatedDeliveryTime.getTime() + BUFFER_TIME)
          ) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.DELIVERED,
                deliveredAt: new Date(),
              },
            });
            console.log(`Order ID ${order.id} status updated to DELIVERED.`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

cron.schedule('* * * * *', updateOrderStatus, {
  scheduled: true,
  timezone: 'Asia/Jakarta',
});

console.log('Cron job scheduled to update order status every minute.');
