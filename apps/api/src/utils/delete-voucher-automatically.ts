import cron from 'node-cron';
import { prisma } from '../configs/prisma.js';

// Function to delete inactive vouchers with zero stock
async function deleteInactiveVouchers() {
  try {
    const deletedVouchers = await prisma.voucher.deleteMany({
      where: {
        stock: 0,
        isActive: false,
      },
    });

    console.log(
      `Deleted ${deletedVouchers.count} inactive vouchers with zero stock.`,
    );
  } catch (error) {
    console.error('Error deleting inactive vouchers:', error);
  }
}

// Schedule the task to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled task to delete inactive vouchers...');
  deleteInactiveVouchers();
});

deleteInactiveVouchers();
