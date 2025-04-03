import { hash, genSalt } from 'bcryptjs';

import { prisma } from '../src/configs/prisma.js';

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
    const customer1 = await prisma.user.create({
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
        name: 'Toko MCD Jatipadang',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Sentosa No. 123',
        city: 'Medan',
        province: 'Sumatera Utara',
        country: 'Indonesia',
        postalCode: '20111',
        phoneNumber: '081234567890',
        slug: 'toko-kelontong-sentosa',
        latitude: -6.286015044331,
        longitude: 106.83111469363126,
        maxServiceDistance: 25.0,
        isActive: true,
      },
    });

    const store2 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong Binus Lawson',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Permata No. 456',
        city: 'Pekanbaru',
        province: 'Riau',
        country: 'Indonesia',
        postalCode: '28111',
        phoneNumber: '081234567891',
        slug: 'toko-kelontong-permata',
        latitude: -6.200563589115056,
        longitude: 106.78477571923685,
        maxServiceDistance: 100.0,
        isActive: true,
        isPrimary: true,
      },
    });

    const store3 = await prisma.store.create({
      data: {
        name: 'Toko Kelontong Purwadhika',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Jaya No. 789',
        city: 'Bandung',
        province: 'Jawa Barat',
        country: 'Indonesia',
        postalCode: '40111',
        phoneNumber: '081234567892',
        slug: 'toko-kelontong-jaya',
        latitude: -6.210676140910337,
        longitude: 106.82231722418967,
        maxServiceDistance: 20.0,
        isActive: true,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Toko Kelontong SPBU Kemang',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Makmur No. 321',
        city: 'Surabaya',
        province: 'Jawa Timur',
        country: 'Indonesia',
        postalCode: '60111',
        phoneNumber: '081234567893',
        slug: 'toko-kelontong-makmur',
        latitude: -6.266846372000018,
        longitude: 106.81561643680142,
        maxServiceDistance: 50.0,
        isActive: true,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Toko Kelontong Perempatan Ampera',
        storeImage:
          'https://i.pinimg.com/736x/a6/a6/80/a6a680d5757a99612ac553be1e3b9fe9.jpg',
        address: 'Jl. Sehat No. 654',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postalCode: '10110',
        phoneNumber: '081234567894',
        slug: 'toko-kelontong-sehat',
        latitude: -6.291616589951082,
        longitude: 106.81663803093814,
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
        name: 'Sayuran',
        excerpt: 'Sayuran segar',
        description: 'Berbagai jenis sayuran segar dan berkualitas',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477309/SAYURAN_wigiuz.jpg',
        slug: 'sayuran',
      },
    });

    const buahCategory = await prisma.category.create({
      data: {
        name: 'Buah',
        excerpt: 'Buah segar',
        description: 'Berbagai jenis buah segar dan berkualitas',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/BUAH_pu071u.jpg',
        slug: 'buah',
      },
    });

    const makananRinganCategory = await prisma.category.create({
      data: {
        name: 'Makanan Ringan',
        excerpt: 'Makanan ringan',
        description: 'Berbagai jenis makanan ringan',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/MAKANAN_RINGAN_kte3tc.jpg',
        slug: 'makanan-ringan',
      },
    });

    const minumanCategory = await prisma.category.create({
      data: {
        name: 'Minuman',
        excerpt: 'Minuman',
        description: 'Berbagai jenis minuman',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/MINUMAN_glvhk8.jpg',
        slug: 'minuman',
      },
    });

    const peralatanMandiCategory = await prisma.category.create({
      data: {
        name: 'Peralatan Mandi',
        excerpt: 'Peralatan mandi',
        description: 'Berbagai jenis peralatan mandi',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477308/peralatan-mandi_bcxn91.jpg',
        slug: 'peralatan-mandi',
      },
    });

    const peralatanDapurCategory = await prisma.category.create({
      data: {
        name: 'Peralatan Dapur',
        excerpt: 'Peralatan dapur',
        description: 'Berbagai jenis peralatan dapur',
        image:
          'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743477311/peralatan-dapur_oxlwhq.jpg',
        slug: 'peralatan-dapur',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Product Seed                              */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    PRODUK TOMAT                                   */
    /* -------------------------------------------------------------------------- */
    const tomat = await prisma.product.create({
      data: {
        name: 'Tomat',
        excerpt: 'Tomat segar',
        description: 'Tomat segar berkualitas tinggi',
        slug: 'tomat',
        weight: 1.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350535/TOMAT-5_ou8ykd.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-4_ihcati.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-3_ykxgco.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-1_l7x9lq.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350534/TOMAT-2_glqtwh.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: tomat.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: tomat.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  PRODUK SEMANGKA                                  */
    /* -------------------------------------------------------------------------- */
    const semangka = await prisma.product.create({
      data: {
        name: 'Semangka',
        excerpt: 'Semangka segar',
        description: 'Semangka segar berkualitas tinggi',
        slug: 'semangka',
        weight: 5.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-2_rcr4kw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-3_wxbwb7.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-5_xtonsp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350640/SEMANGKA-4_prjrxe.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350639/SEMANGKA-1_huhysp.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: semangka.id,
        price: 5000,
        stock: 150,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: semangka.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                   PRODUK CHITATO                                  */
    /* -------------------------------------------------------------------------- */
    const chitato = await prisma.product.create({
      data: {
        name: 'Chitato',
        excerpt: 'Chitato',
        description: 'Chitato segar',
        slug: 'chitato',
        weight: 0.2,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350874/CHITATO-4_xfhn9f.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-5_qvtt6i.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-3_trl0oj.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-2_yctkai.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350873/CHITATO-1_wsc5rw.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: chitato.id,
        price: 5000,
        stock: 150,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: chitato.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK AIR AQUA                            */
    /* -------------------------------------------------------------------------- */
    const airAqua = await prisma.product.create({
      data: {
        name: 'Air Mineral',
        excerpt: 'Air mineral',
        description: 'Air mineral segar',
        slug: 'air-mineral',
        weight: 0.5,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-5_tabctd.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-4_acjzxw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350995/AQUA-3_wsusfp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350994/AQUA-1_nuzezw.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743350994/AQUA-2_alrxfo.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: airAqua.id,
        price: 3000,
        stock: 200,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: airAqua.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                             PRODUK SABUN MANDI                             */
    /* -------------------------------------------------------------------------- */
    const sabunMandi = await prisma.product.create({
      data: {
        name: 'Sabun Mandi Life Boy',
        excerpt: 'Sabun mandi',
        description: 'Sabun mandi berkualitas tinggi',
        slug: 'sabun-mandi',
        weight: 0.5,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351121/SABUN-5_li1087.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-4_renpvn.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-3_urz6mr.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-2_gqz3n6.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351120/SABUN-1_mgtopn.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: sabunMandi.id,
        price: 7000,
        stock: 120,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: sabunMandi.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK PANCI                                */
    /* -------------------------------------------------------------------------- */
    const panci = await prisma.product.create({
      data: {
        name: 'Panci',
        excerpt: 'Panci',
        description: 'Panci berkualitas tinggi',
        slug: 'panci',
        weight: 2.0,
        ProductImages: {
          createMany: {
            data: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351228/PANCI-5_uh8lrg.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351226/PANCI-4_wms6dp.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351225/PANCI-2_tnl5bu.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351225/PANCI-3_thiuyq.jpg',
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743351224/PANCI-1_adthbw.jpg',
              },
            ],
          },
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: panci.id,
        price: 75000,
        stock: 80,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: panci.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK WORTEL                               */
    /* -------------------------------------------------------------------------- */
    const wortel = await prisma.product.create({
      data: {
        name: 'Wortel',
        excerpt: 'Wortel',
        description: 'Wortel berkualitas tinggi',
        slug: 'wortel',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Wortel+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Wortel+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Wortel+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Wortel+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Wortel+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: wortel.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: wortel.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK BAYAM                                */
    /* -------------------------------------------------------------------------- */
    const bayam = await prisma.product.create({
      data: {
        name: 'Bayam',
        excerpt: 'Bayam',
        description: 'Bayam berkualitas tinggi',
        slug: 'bayam',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Bayam+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Bayam+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Bayam+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Bayam+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Bayam+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: bayam.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: bayam.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK KOL                                 */
    /* -------------------------------------------------------------------------- */
    const kol = await prisma.product.create({
      data: {
        name: 'Kol',
        excerpt: 'Kol',
        description: 'Kol berkualitas tinggi',
        slug: 'kol',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=Kol+1',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=Kol+2',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=Kol+3',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=Kol+4',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/90ee90/fff&text=Kol+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kol.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kol.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK KANGKUNG                              */
    /* -------------------------------------------------------------------------- */
    const kangkung = await prisma.product.create({
      data: {
        name: 'Kangkung',
        excerpt: 'Kangkung',
        description: 'Kangkung berkualitas tinggi',
        slug: 'kangkung',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Kangkung+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Kangkung+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Kangkung+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Kangkung+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/90ee90/fff&text=Kangkung+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kangkung.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kangkung.id,
        categoryId: sayurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK JERUK                                */
    /* -------------------------------------------------------------------------- */
    const jeruk = await prisma.product.create({
      data: {
        name: 'Jeruk',
        excerpt: 'Jeruk',
        description: 'Jeruk berkualitas tinggi',
        slug: 'jeruk',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Jeruk+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Jeruk+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Jeruk+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Jeruk+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Jeruk+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: jeruk.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: jeruk.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK PISANG                               */
    /* -------------------------------------------------------------------------- */
    const pisang = await prisma.product.create({
      data: {
        name: 'Pisang',
        excerpt: 'Pisang',
        description: 'Pisang berkualitas tinggi',
        slug: 'pisang',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Pisang+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Pisang+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Pisang+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Pisang+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Pisang+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: pisang.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: pisang.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK ANGGUR                               */
    /* -------------------------------------------------------------------------- */
    const anggur = await prisma.product.create({
      data: {
        name: 'Anggur',
        excerpt: 'Anggur',
        description: 'Anggur berkualitas tinggi',
        slug: 'anggur',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Anggur+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Anggur+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Anggur+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Anggur+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffa07a/fff&text=Anggur+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: anggur.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: anggur.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK APEL                                */
    /* -------------------------------------------------------------------------- */
    const apel = await prisma.product.create({
      data: {
        name: 'Apel',
        excerpt: 'Apel',
        description: 'Apel berkualitas tinggi',
        slug: 'apel',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl: 'https://dummyimage.com/600x400/ffa07a/fff&text=Apel+1',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffa07a/fff&text=Apel+2',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffa07a/fff&text=Apel+3',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffa07a/fff&text=Apel+4',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffa07a/fff&text=Apel+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: apel.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: apel.id,
        categoryId: buahCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK TARO                                */
    /* -------------------------------------------------------------------------- */
    const taro = await prisma.product.create({
      data: {
        name: 'Taro',
        excerpt: 'Taro',
        description: 'Taro berkualitas tinggi',
        slug: 'taro',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Taro+1',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Taro+2',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Taro+3',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Taro+4',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Taro+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: taro.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: taro.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK QTELA                                */
    /* -------------------------------------------------------------------------- */
    const qtela = await prisma.product.create({
      data: {
        name: 'Qtela',
        excerpt: 'Qtela',
        description: 'Qtela berkualitas tinggi',
        slug: 'qtela',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Qtela+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Qtela+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Qtela+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Qtela+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Qtela+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: qtela.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: qtela.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK NABATI                                */
    /* -------------------------------------------------------------------------- */
    const nabati = await prisma.product.create({
      data: {
        name: 'Nabati',
        excerpt: 'Nabati',
        description: 'Nabati berkualitas tinggi',
        slug: 'nabati',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Nabati+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Nabati+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Nabati+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Nabati+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/ffb6c1/fff&text=Nabati+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: nabati.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: nabati.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 PRODUK OREO                                */
    /* -------------------------------------------------------------------------- */
    const oreo = await prisma.product.create({
      data: {
        name: 'Oreo',
        excerpt: 'Oreo',
        description: 'Oreo berkualitas tinggi',
        slug: 'oreo',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Oreo+1',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Oreo+2',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Oreo+3',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Oreo+4',
            },
            {
              imageUrl: 'https://dummyimage.com/600x400/ffb6c1/fff&text=Oreo+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: oreo.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: oreo.id,
        categoryId: makananRinganCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK TEH BOTOL                              */
    /* -------------------------------------------------------------------------- */
    const teh_botol = await prisma.product.create({
      data: {
        name: 'Teh Botol',
        excerpt: 'Teh Botol',
        description: 'Teh Botol berkualitas tinggi',
        slug: 'teh-botol',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Teh+Botol+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Teh+Botol+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Teh+Botol+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Teh+Botol+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Teh+Botol+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: teh_botol.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: teh_botol.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK JUS MANGGA                             */
    /* -------------------------------------------------------------------------- */
    const jus_mangga = await prisma.product.create({
      data: {
        name: 'Jus Mangga',
        excerpt: 'Jus Mangga',
        description: 'Jus Mangga berkualitas tinggi',
        slug: 'jus-mangga',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Jus+Mangga+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Jus+Mangga+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Jus+Mangga+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Jus+Mangga+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Jus+Mangga+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: jus_mangga.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: jus_mangga.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SUSU UHT                              */
    /* -------------------------------------------------------------------------- */
    const susu_uht = await prisma.product.create({
      data: {
        name: 'Susu UHT',
        excerpt: 'Susu UHT',
        description: 'Susu UHT berkualitas tinggi',
        slug: 'susu-uht',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Susu+UHT+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Susu+UHT+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Susu+UHT+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Susu+UHT+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Susu+UHT+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: susu_uht.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: susu_uht.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                             PRODUK KOPI INSTAN                             */
    /* -------------------------------------------------------------------------- */
    const kopi_instan = await prisma.product.create({
      data: {
        name: 'Kopi Instan',
        excerpt: 'Kopi Instan',
        description: 'Kopi Instan berkualitas tinggi',
        slug: 'kopi-instan',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Kopi+Instan+1',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Kopi+Instan+2',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Kopi+Instan+3',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Kopi+Instan+4',
            },
            {
              imageUrl:
                'https://dummyimage.com/600x400/add8e6/fff&text=Kopi+Instan+5',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kopi_instan.id,
        price: 6000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kopi_instan.id,
        categoryId: minumanCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK PASTA GIGI                             */
    /* -------------------------------------------------------------------------- */
    const pasta_gigi = await prisma.product.create({
      data: {
        name: 'Pasta Gigi',
        excerpt: 'Pasta Gigi',
        description: 'Pasta Gigi berkualitas tinggi',
        slug: 'pasta-gigi',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658365/PASTA_GIGI_nv48uh.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658365/PASTA_GIGI_nv48uh.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658365/PASTA_GIGI_nv48uh.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658365/PASTA_GIGI_nv48uh.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658365/PASTA_GIGI_nv48uh.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: pasta_gigi.id,
        price: 8000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: pasta_gigi.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK SHAMPO                               */
    /* -------------------------------------------------------------------------- */
    const shampo = await prisma.product.create({
      data: {
        name: 'Shampo Pantene',
        excerpt: 'Shampo',
        description: 'Shampo berkualitas tinggi',
        slug: 'shampo',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658339/PANTENE_tu0vp0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658339/PANTENE_tu0vp0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658339/PANTENE_tu0vp0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658339/PANTENE_tu0vp0.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658339/PANTENE_tu0vp0.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: shampo.id,
        price: 10000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: shampo.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              PRODUK TISU BASAH                             */
    /* -------------------------------------------------------------------------- */
    const tisu_basah = await prisma.product.create({
      data: {
        name: 'Tisu Basah',
        excerpt: 'Tisu Basah',
        description: 'Tisu Basah berkualitas tinggi',
        slug: 'tisu-basah',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658307/TISU_BASAH_boaasm.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658307/TISU_BASAH_boaasm.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658307/TISU_BASAH_boaasm.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658307/TISU_BASAH_boaasm.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658307/TISU_BASAH_boaasm.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: tisu_basah.id,
        price: 12000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: tisu_basah.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                           PRODUK SABUN CUCI MUKA                           */
    /* -------------------------------------------------------------------------- */
    const sabun_cuci_muka = await prisma.product.create({
      data: {
        name: 'Sabun Cuci Muka',
        excerpt: 'Sabun Cuci Muka',
        description: 'Sabun Cuci Muka berkualitas tinggi',
        slug: 'sabun-cuci-muka',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658269/SABUN_CUCI_MUKA_kfnl9s.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658269/SABUN_CUCI_MUKA_kfnl9s.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658269/SABUN_CUCI_MUKA_kfnl9s.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658269/SABUN_CUCI_MUKA_kfnl9s.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658269/SABUN_CUCI_MUKA_kfnl9s.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: sabun_cuci_muka.id,
        price: 14000,
        stock: 100,
        isCheap: true,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: sabun_cuci_muka.id,
        categoryId: peralatanMandiCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                PRODUK WAJAN                                */
    /* -------------------------------------------------------------------------- */
    const wajan = await prisma.product.create({
      data: {
        name: 'Wajan',
        excerpt: 'Wajan',
        description: 'Wajan berkualitas tinggi',
        slug: 'wajan',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658246/WAJAN_p4cusi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658246/WAJAN_p4cusi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658246/WAJAN_p4cusi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658246/WAJAN_p4cusi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658246/WAJAN_p4cusi.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: wajan.id,
        price: 200000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: wajan.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SPATULA                               */
    /* -------------------------------------------------------------------------- */
    const spatula = await prisma.product.create({
      data: {
        name: 'Spatula',
        excerpt: 'Spatula',
        description: 'Spatula berkualitas tinggi',
        slug: 'spatula',
        weight: 0.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658190/SPATULA_czbdy8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658190/SPATULA_czbdy8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658190/SPATULA_czbdy8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658190/SPATULA_czbdy8.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658190/SPATULA_czbdy8.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: spatula.id,
        price: 60000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: spatula.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                               PRODUK SARINGAN                              */
    /* -------------------------------------------------------------------------- */
    const saringan = await prisma.product.create({
      data: {
        name: 'Saringan',
        excerpt: 'Saringan',
        description: 'Saringan berkualitas tinggi',
        slug: 'saringan',
        weight: 0.8,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658163/SARINGAN_DAPUR_mnwarc.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658163/SARINGAN_DAPUR_mnwarc.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658163/SARINGAN_DAPUR_mnwarc.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658163/SARINGAN_DAPUR_mnwarc.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658163/SARINGAN_DAPUR_mnwarc.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: saringan.id,
        price: 100000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: saringan.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                           PRODUK KOMPOR PORTABLE                           */
    /* -------------------------------------------------------------------------- */
    const kompor_portable = await prisma.product.create({
      data: {
        name: 'Kompor Portable',
        excerpt: 'Kompor Portable',
        description: 'Kompor Portable berkualitas tinggi',
        slug: 'kompor-portable',
        weight: 1.3,
        ProductImages: {
          create: [
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658134/KOMPOR_PORTABLE_ll75gi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658134/KOMPOR_PORTABLE_ll75gi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658134/KOMPOR_PORTABLE_ll75gi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658134/KOMPOR_PORTABLE_ll75gi.jpg',
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743658134/KOMPOR_PORTABLE_ll75gi.jpg',
            },
          ],
        },
      },
    });
    await prisma.storeProduct.create({
      data: {
        storeId: store1.id,
        productId: kompor_portable.id,
        price: 300000,
        stock: 100,
        isCheap: false,
      },
    });
    await prisma.categoryProduct.create({
      data: {
        productId: kompor_portable.id,
        categoryId: peralatanDapurCategory.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Address Seed                              */
    /* -------------------------------------------------------------------------- */
    const customerAddress = await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Pelangi No. 456',
        city: 'Jakarta',
        number: 123,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: true,
        isActive: true,
      },
    });

    await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Merdeka No. 123',
        city: 'Jakarta',
        number: 456,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: false,
        isActive: true,
      },
    });

    await prisma.address.create({
      data: {
        userId: customer1.id,
        street: 'Jl. Raya No. 789',
        city: 'Jakarta',
        number: 789,
        postalCode: 12540,
        country: 'Indonesia',
        isPrimary: false,
        isActive: true,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  Cart Seed                                 */
    /* -------------------------------------------------------------------------- */
    const customerCart = await prisma.cart.create({
      data: {
        userId: customer1.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  CartItem Seed                             */
    /* -------------------------------------------------------------------------- */
    // Ambil storeProduct terkait
    const tomatStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: tomat.id,
        storeId: store1.id,
      },
    });

    const sabunStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: sabunMandi.id,
        storeId: store1.id,
      },
    });

    const semangkaStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: semangka.id,
        storeId: store1.id,
      },
    });

    const panciStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: panci.id,
        storeId: store1.id,
      },
    });

    // Tambahkan ke cart
    const cartItemsData = [
      {
        product: tomat,
        storeProduct: tomatStoreProduct,
        quantity: 2,
      },
      {
        product: sabunMandi,
        storeProduct: sabunStoreProduct,
        quantity: 1,
      },
      {
        product: semangka,
        storeProduct: semangkaStoreProduct,
        quantity: 3,
      },
    ];

    for (const item of cartItemsData) {
      if (item.storeProduct) {
        await prisma.cartItem.create({
          data: {
            cartId: customerCart.id,
            storeProductId: item.storeProduct.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.storeProduct.price,
            total: Number(item.storeProduct.price) * item.quantity,
          },
        });
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Voucher Seed                              */
    /* -------------------------------------------------------------------------- */
    const voucher1 = await prisma.voucher.create({
      data: {
        userId: customer1.id,
        storeId: store1.id,
        name: 'Diskon Sayuran',
        description: 'Dapatkan diskon 10% pada semua sayuran',
        code: 'DISKON10',
        voucherType: 'PERCENTAGE',
        value: 10,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 50000,
        maxPriceReduction: 10000,
        voucherImage: 'https://example.com/diskon-sayuran.jpg',
      },
    });

    const voucher2 = await prisma.voucher.create({
      data: {
        userId: customer1.id,
        storeId: store2.id,
        name: 'Diskon Makanan Ringan',
        description: 'Dapatkan diskon 5% pada semua makanan ringan',
        code: 'DISKON5',
        voucherType: 'PERCENTAGE',
        value: 5,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 30000,
        maxPriceReduction: 5000,
        voucherImage: 'https://example.com/diskon-makanan-ringan.jpg',
      },
    });

    const voucher3 = await prisma.voucher.create({
      data: {
        userId: customer1.id,
        storeId: store3.id,
        name: 'Diskon Minuman',
        description: 'Dapatkan diskon 15% pada semua minuman',
        code: 'DISKON15',
        voucherType: 'PERCENTAGE',
        value: 15,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        stock: 100,
        isActive: true,
        minPurchase: 50000,
        maxPriceReduction: 10000,
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
        userId: customer1.id,
        slug: 'ORDER-123',
        storeId: store1.id,
        shippingAddressId: customerAddress.id,
        totalAmount: 35000,
        status: 'PENDING_PAYMENT',
        paymentMethodType: 'UNSET',
        paymentProof: 'https://example.com/payment-proof.jpg',
        paymentProofUploadedAt: new Date(),
        orderConfirmationAt: new Date(),
        shippingCost: {
          create: {
            courierName: 'JNE',
            code: 'JNE123456',
            serviceType: 'REGULER',
            description: 'JNE Reguler',
            shippingCost: 15000.0,
            estimatedTime: 3,
          },
        },
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  OrderItem Seed                            */
    /* -------------------------------------------------------------------------- */
    const orderItemsData = [
      {
        product: tomat,
        storeProduct: tomatStoreProduct,
        quantity: 2,
      },
      {
        product: sabunMandi,
        storeProduct: sabunStoreProduct,
        quantity: 1,
      },
      {
        product: panci,
        storeProduct: panciStoreProduct,
        quantity: 3,
      },
    ];

    for (const item of orderItemsData) {
      if (item.storeProduct) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            storeProductId: item.storeProduct.id,
            quantity: item.quantity,
            price: +item.storeProduct.price,
            total: Number(item.storeProduct.price) * item.quantity,
          },
        });
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Referral Seed                             */
    /* -------------------------------------------------------------------------- */
    await prisma.referral.create({
      data: {
        referredById: superadmin.id,
        referredUserId: customer1.id,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                  ConfirmToken Seed                         */
    /* -------------------------------------------------------------------------- */
    await prisma.confirmToken.create({
      data: {
        userId: customer1.id,
        token: 'abcdef123456',
        expiredDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        used: false,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                DISCOUNT SEED                               */
    /* -------------------------------------------------------------------------- */
    const discount1 = await prisma.discount.create({
      data: {
        name: 'Diskon Tomat',
        type: 'PERCENTAGE',
        value: 10,
        minPurchase: 50000,
        maxDiscount: 10000,
        expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
        DiscountProduct: {
          create: {
            productId: tomat.id,
          },
        },
      },
    });

    await prisma.discount.create({
      data: {
        name: 'Diskon Semangka',
        type: 'AMOUNT',
        value: 5000,
        minPurchase: 100000,
        maxDiscount: 10000,
        expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
        DiscountProduct: {
          create: {
            productId: semangka.id,
          },
        },
      },
    });

    await prisma.discountReport.create({
      data: {
        discountId: discount1.id,
        userId: customer1.id,
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
