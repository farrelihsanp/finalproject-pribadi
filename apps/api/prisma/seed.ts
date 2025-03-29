import { hash, genSalt } from 'bcryptjs';
import { prisma } from '../src/configs/prisma.js';

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    await prisma.user.deleteMany();

    /* -------------------------------------------------------------------------- */
    /*                                  User Seed                                 */
    /* -------------------------------------------------------------------------- */
    const salt = await genSalt(10);
    const hashedPassword = await hash('newpass', salt);

    await prisma.user.create({
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: hashedPassword,
        email: 'john.doe@mail.com',
        emailConfirmed: false,
        role: 'CUSTOMERS',
        profileImage:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        referralNumber: 'REF123456',
        walletBalance: 100000,
      },
    });

    console.info(`Seeding successfully 🌱`);
  } catch (error) {
    console.error(`Seeding error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
