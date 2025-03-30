import { hash, genSalt } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    console.info('Menghapus data yang ada...');
    await prisma.voucher.deleteMany();
    await prisma.user.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.store.deleteMany();
    await prisma.order.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.categoryProduct.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.confirmToken.deleteMany();
    await prisma.voucherProduct.deleteMany();
    await prisma.shippingCost.deleteMany();
    await prisma.storeUser.deleteMany();
    console.info('Data yang ada berhasil dihapus.');

    /* -------------------------------------------------------------------------- */
    /*                                  User Seed                                 */
    /* -------------------------------------------------------------------------- */
    const salt = await genSalt(10);

    // Superadmin User
    const superadminPassword = await hash('superadminpass', salt);
    const superadmin = await prisma.user.create({
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: superadminPassword,
        email: 'johndoe@example.com',
        emailConfirmed: true,
        role: 'SUPERADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123456',
        provider: 'CREDENTIALS',
      },
    });

    // Storeadmin User
    const storeadminPassword1 = await hash('storeadminpass', salt);
    const storeadmin1 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        username: 'janesmith',
        password: storeadminPassword1,
        email: 'janesmith@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF654321',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword2 = await hash('storeadminpass', salt);
    const storeadmin2 = await prisma.user.create({
      data: {
        name: 'Diana Siregar',
        username: 'dianasiregar',
        password: storeadminPassword2,
        email: 'dianasiregar@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF654324',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword3 = await hash('storeadminpass', salt);
    const storeadmin3 = await prisma.user.create({
      data: {
        name: 'Jadot Budi Purnomo',
        username: 'purnomo',
        password: storeadminPassword3,
        email: 'purnomo@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123321',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword4 = await hash('storeadminpass', salt);
    const storeadmin4 = await prisma.user.create({
      data: {
        name: 'Budi Gunawan',
        username: 'budigunawan',
        password: storeadminPassword4,
        email: 'budigunawan@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123399',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword5 = await hash('storeadminpass', salt);
    const storeadmin5 = await prisma.user.create({
      data: {
        name: 'Bagus Saragih',
        username: 'bagussaragih',
        password: storeadminPassword5,
        email: 'bagussaragih@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123329',
        provider: 'CREDENTIALS',
      },
    });

    const storeadminPassword6 = await hash('storeadminpass', salt);
    const storeadmin6 = await prisma.user.create({
      data: {
        name: 'Mustofa Abdurrahman',
        username: 'mustofaabduh',
        password: storeadminPassword6,
        email: 'mustofaabduh@example.com',
        emailConfirmed: true,
        role: 'STOREADMIN',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627186/education-confrence_jujt4f.jpg',
        referralNumber: 'REF123500',
        provider: 'CREDENTIALS',
      },
    });

    // Customer User
    const customerPassword = await hash('salsabila123', salt);
    const customer = await prisma.user.create({
      data: {
        name: 'Salsabila Yara',
        username: 'salsabilayara',
        password: customerPassword,
        email: 'salsabilayara@gmail.com',
        emailConfirmed: true,
        role: 'CUSTOMERS',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg',
        referralNumber: 'REF112295',
        provider: 'CREDENTIALS',
      },
    });

    const customerPassword2 = await hash('fauzan123', salt);
    await prisma.user.create({
      data: {
        name: 'Fauzan Rianda',
        username: 'fauzanrianda',
        password: customerPassword2,
        email: 'fauzanrianda@gmail.com',
        emailConfirmed: true,
        role: 'CUSTOMERS',
        profileImage:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg',
        referralNumber: 'REF999500',
        provider: 'CREDENTIALS',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Store Seed                                */
    /* -------------------------------------------------------------------------- */
    const store1 = await prisma.store.create({
      data: {
        name: 'Toko Jatipadang',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Sentosa No. 123',
        city: 'Medan',
        province: 'Sumatera Utara',
        country: 'Indonesia',
        postalCode: '20111',
        phoneNumber: '081234567890',
        slug: 'toko-kelontong-sentosa',
        latitude: 3.5951,
        longitude: 98.6722,
        maxServiceDistance: 10.0,
        isActive: true,
      },
    });

    const store2 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong Permata',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Permata No. 456',
        city: 'Pekanbaru',
        province: 'Riau',
        country: 'Indonesia',
        postalCode: '28111',
        phoneNumber: '081234567891',
        slug: 'toko-kelontong-permata',
        latitude: 0.5122,
        longitude: 101.4653,
        maxServiceDistance: 15.0,
        isActive: true,
      },
    });

    const store3 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong Jaya',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Jaya No. 789',
        city: 'Bandung',
        province: 'Jawa Barat',
        country: 'Indonesia',
        postalCode: '40111',
        phoneNumber: '081234567892',
        slug: 'toko-kelontong-jaya',
        latitude: -6.9147,
        longitude: 107.6098,
        maxServiceDistance: 20.0,
        isActive: true,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Toko Kelontong Makmur',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Makmur No. 321',
        city: 'Surabaya',
        province: 'Jawa Timur',
        country: 'Indonesia',
        postalCode: '60111',
        phoneNumber: '081234567893',
        slug: 'toko-kelontong-makmur',
        latitude: -7.2575,
        longitude: 112.7521,
        maxServiceDistance: 25.0,
        isActive: true,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Toko Kelontong Sehat',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Sehat No. 654',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postalCode: '10110',
        phoneNumber: '081234567894',
        slug: 'toko-kelontong-sehat',
        latitude: -6.2088,
        longitude: 106.8456,
        maxServiceDistance: 15.0,
        isActive: true,
      },
    });

    // Assign store admins to stores
    await prisma.storeUser.create({
      data: {
        userId: storeadmin1.id,
        storeId: store1.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin2.id,
        storeId: store2.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin3.id,
        storeId: store3.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin4.id,
        storeId: store1.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin5.id,
        storeId: store2.id,
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: storeadmin6.id,
        storeId: store3.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Category Seed                             */
    /* -------------------------------------------------------------------------- */
    const sayurCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Sayuran',
        excerpt: 'Sayuran segar',
        description: 'Berbagai jenis sayuran segar dan berkualitas',
        image: 'https://example.com/sayuran.jpg',
        slug: 'sayuran',
      },
    });

    const buahCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Buah',
        excerpt: 'Buah segar',
        description: 'Berbagai jenis buah segar dan berkualitas',
        image: 'https://example.com/buah.jpg',
        slug: 'buah',
      },
    });

    const makananRinganCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Makanan Ringan',
        excerpt: 'Makanan ringan',
        description: 'Berbagai jenis makanan ringan',
        image: 'https://example.com/makanan-ringan.jpg',
        slug: 'makanan-ringan',
      },
    });

    const minumanCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Minuman',
        excerpt: 'Minuman',
        description: 'Berbagai jenis minuman',
        image: 'https://example.com/minuman.jpg',
        slug: 'minuman',
      },
    });

    const peralatanMandiCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Peralatan Mandi',
        excerpt: 'Peralatan mandi',
        description: 'Berbagai jenis peralatan mandi',
        image: 'https://example.com/peralatan-mandi.jpg',
        slug: 'peralatan-mandi',
      },
    });

    const peralatanDapurCategory = await prisma.category.create({
      data: {
        storeId: store1.id,
        name: 'Peralatan Dapur',
        excerpt: 'Peralatan dapur',
        description: 'Berbagai jenis peralatan dapur',
        image: 'https://example.com/peralatan-dapur.jpg',
        slug: 'peralatan-dapur',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Product Seed                              */
    /* -------------------------------------------------------------------------- */
    const tomat = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Tomat',
        excerpt: 'Tomat segar',
        description: 'Tomat segar berkualitas tinggi',
        date: new Date(),
        price: 10000,
        slug: 'tomat',
        stock: 100,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/tomat.jpg' }],
          },
        },
      },
    });

    const semangka = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Semangka',
        excerpt: 'Semangka segar',
        description: 'Semangka segar berkualitas tinggi',
        date: new Date(),
        price: 5000,
        slug: 'semangka',
        stock: 150,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/semangka.jpg' }],
          },
        },
      },
    });

    const chitato = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Chitato',
        excerpt: 'Chitato',
        description: 'Chitato segar',
        date: new Date(),
        price: 5000,
        slug: 'chitato',
        stock: 150,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/chitato.jpg' }],
          },
        },
      },
    });

    const airAqua = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Air Mineral',
        excerpt: 'Air mineral',
        description: 'Air mineral segar',
        date: new Date(),
        price: 3000,
        slug: 'air-mineral',
        stock: 200,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/air-mineral.jpg' }],
          },
        },
      },
    });

    const sabunMandi = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Sabun Mandi',
        excerpt: 'Sabun mandi',
        description: 'Sabun mandi berkualitas tinggi',
        date: new Date(),
        price: 7000,
        slug: 'sabun-mandi',
        stock: 120,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/sabun-mandi.jpg' }],
          },
        },
      },
    });

    const panci = await prisma.product.create({
      data: {
        storeId: store1.id,
        name: 'Panci',
        excerpt: 'Panci',
        description: 'Panci berkualitas tinggi',
        date: new Date(),
        price: 25000,
        slug: 'panci',
        stock: 80,
        ProductImages: {
          createMany: {
            data: [{ imageUrl: 'https://example.com/panci.jpg' }],
          },
        },
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  CategoryProduct Seed                      */
    /* -------------------------------------------------------------------------- */
    await prisma.categoryProduct.create({
      data: {
        productId: tomat.id,
        categoryId: sayurCategory.id,
      },
    });

    await prisma.categoryProduct.create({
      data: {
        productId: semangka.id,
        categoryId: buahCategory.id,
      },
    });

    await prisma.categoryProduct.create({
      data: {
        productId: chitato.id,
        categoryId: makananRinganCategory.id,
      },
    });

    await prisma.categoryProduct.create({
      data: {
        productId: airAqua.id,
        categoryId: minumanCategory.id,
      },
    });

    await prisma.categoryProduct.create({
      data: {
        productId: sabunMandi.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    await prisma.categoryProduct.create({
      data: {
        productId: panci.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Address Seed                              */
    /* -------------------------------------------------------------------------- */
    const customerAddress = await prisma.address.create({
      data: {
        userId: customer.id,
        street: 'Jl. Pelangi No. 456',
        city: 'Jakarta',
        number: 123,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: true,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Cart Seed                                 */
    /* -------------------------------------------------------------------------- */
    const customerCart = await prisma.cart.create({
      data: {
        userId: customer.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  CartItem Seed                             */
    /* -------------------------------------------------------------------------- */
    await prisma.cartItem.create({
      data: {
        cartId: customerCart.id,
        productId: tomat.id,
        quantity: 2,
        price: tomat.price,
        total: +tomat.price * 2,
      },
    });

    await prisma.cartItem.create({
      data: {
        cartId: customerCart.id,
        productId: sabunMandi.id,
        quantity: 1,
        price: sabunMandi.price,
        total: +sabunMandi.price * 1,
      },
    });

    await prisma.cartItem.create({
      data: {
        cartId: customerCart.id,
        productId: semangka.id,
        quantity: 3,
        price: semangka.price,
        total: +semangka.price * 3,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Voucher Seed                              */
    /* -------------------------------------------------------------------------- */
    const voucher1 = await prisma.voucher.create({
      data: {
        userId: customer.id,
        storeId: store1.id,
        name: 'Diskon Sayuran',
        description: 'Dapatkan diskon 10% pada semua sayuran',
        code: 'DISKON10',
        discountType: 'PERCENTAGE',
        discountRate: 10,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 50000,
        maxDiscountValue: 10000,
        voucherImage: 'https://example.com/diskon-sayuran.jpg',
      },
    });

    const voucher2 = await prisma.voucher.create({
      data: {
        userId: customer.id,
        storeId: store2.id,
        name: 'Diskon Makanan Ringan',
        description: 'Dapatkan diskon 5% pada semua makanan ringan',
        code: 'DISKON5',
        discountType: 'PERCENTAGE',
        discountRate: 5,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 30000,
        maxDiscountValue: 5000,
        voucherImage: 'https://example.com/diskon-makanan-ringan.jpg',
      },
    });

    const voucher3 = await prisma.voucher.create({
      data: {
        userId: customer.id,
        storeId: store3.id,
        name: 'Diskon Minuman',
        description: 'Dapatkan diskon 15% pada semua minuman',
        code: 'DISKON15',
        discountType: 'PERCENTAGE',
        discountRate: 15,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 50000,
        maxDiscountValue: 10000,
        voucherImage: 'https://example.com/diskon-minuman.jpg',
      },
    });

    await prisma.voucherProduct.create({
      data: {
        voucherId: voucher1.id,
        productId: tomat.id,
      },
    });

    await prisma.voucherProduct.create({
      data: {
        voucherId: voucher2.id,
        productId: semangka.id,
      },
    });

    await prisma.voucherProduct.create({
      data: {
        voucherId: voucher3.id,
        productId: panci.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Order Seed                                */
    /* -------------------------------------------------------------------------- */
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        storeId: store1.id,
        shippingAddressId: customerAddress.id,
        shippingCost: 5000,
        totalAmount: 35000,
        status: 'PENDING_PAYMENT',
        paymentProof: 'https://example.com/payment-proof.jpg',
        paymentProofUploadedAt: new Date(),
        orderConfirmationAt: new Date(),
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  OrderItem Seed                            */
    /* -------------------------------------------------------------------------- */
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: tomat.id,
        quantity: 2,
        price: 10000,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: sabunMandi.id,
        quantity: 1,
        price: 5000,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: panci.id,
        quantity: 3,
        price: 3000,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  ShippingCost Seed                         */
    /* -------------------------------------------------------------------------- */
    await prisma.shippingCost.create({
      data: {
        orderId: order.id,
        shippingMethod: 'CASH_ON_DELIVERY',
        cost: 5000,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Referral Seed                             */
    /* -------------------------------------------------------------------------- */
    await prisma.referral.create({
      data: {
        referredById: superadmin.id,
        referredUserId: customer.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  ConfirmToken Seed                         */
    /* -------------------------------------------------------------------------- */
    await prisma.confirmToken.create({
      data: {
        userId: customer.id,
        token: 'abcdef123456',
        expiredDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        used: false,
      },
    });

    console.info(`Penyisipan data berhasil 🌱`);
  } catch (error) {
    console.error(`Kesalahan penyisipan data: ${error.message}`);
  } finally {
    await prisma.$disconnect();
    console.info('Koneksi Prisma terputus.');
  }
}

main();
