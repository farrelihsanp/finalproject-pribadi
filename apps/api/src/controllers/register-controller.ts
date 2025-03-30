import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import crypto from 'node:crypto';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import { Resend } from 'resend';
import { registerSchema } from '../schemas/auth-schemas.js';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import { genSalt, hash } from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: 'Email or username has already been used' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: '',
        username: '',
        email,
        role: 'UNSET',
        password: '',
        referralNumber: '',
        profileImage: '',
        provider: 'CREDENTIALS',
      },
    });

    const confirmToken = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `http://localhost:3000/set-password?token=${confirmToken}`;

    await prisma.confirmToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 5),
        token: confirmToken,
        userId: newUser.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/email-confirmation-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      name: name,
      confirmationLink: confirmationLink,
    });

    const { error } = await resend.emails.send({
      from: 'User Confirmation <onboarding@resend.dev>',
      to: email,
      subject: 'Confirmation Email',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    res.status(200).json({ ok: true, message: 'Register completed!' });
  } catch (error) {
    next(error);
  }
}

export async function completeRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tokenQuery = req.query.token;

    if (!tokenQuery) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const confirmToken = await prisma.confirmToken.findFirst({
      where: { token: tokenQuery.toString() },
    });

    if (!confirmToken || confirmToken.expiredDate < new Date()) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    const userId = await prisma.user.findUnique({
      where: { id: confirmToken.userId },
    });

    const { name, username, password, reTypePassword, referralCode, role } =
      req.body;

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profileimage/images',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl };
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl };
    }

    if (!password === reTypePassword) {
      res
        .status(400)
        .json({ message: 'Password and retype password are not the same' });
      return;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const referralNumber = `${userId}REF${Date.now().toString().slice(-3)}`;
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { referralNumber },
    });

    if (referralCode) {
      const referringUser = await prisma.user.findUnique({
        where: { referralNumber: referralCode },
      });

      if (!referringUser) {
        res.status(400).json({ message: 'Invalid referral code' });
        return;
      }

      if (referringUser) {
        await prisma.referral.create({
          data: {
            referredById: referringUser.id,
            referredUserId: Number(userId),
          },
        });

        // BUAT VOUCHER UNTUK YANG MASUKIN REFERRAL CODE

        await prisma.voucher.create({
          data: {
            userId: Number(referringUser.id),
            name: 'Referral Code',
            description:
              'You got a new voucher because you enter a referral code',
            code: `${userId}REF${Date.now().toString().slice(-3)}`,
            discountType: 'AMOUNT',
            discountRate: 10000,
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
            stock: 1,
            voucherImage: 'example.com',
            isActive: true,
          },
        });

        // BUAT VOUCHER UNTUK YANG PUNYA REFERRAL CODE
        await prisma.voucher.create({
          data: {
            userId: Number(userId),
            name: 'Referral Code',
            description: 'You got a new voucher from your referral code',
            code: `${referringUser.id}REF${Date.now().toString().slice(-3)}`,
            discountType: 'AMOUNT',
            discountRate: 10000,
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
            stock: 1,
            voucherImage: 'example.com',
          },
        });
      }
    }

    const finalUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        role: role as Role,
        provider: 'CREDENTIALS',
        profileImage: cloudinaryData.secure_url,
      },
    });

    if (!finalUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    await prisma.confirmToken.delete({
      where: { id: confirmToken.id },
    });

    res
      .status(200)
      .json({ ok: true, message: 'Register completed!', data: finalUser });
  } catch (error) {
    next(error);
  }
}

// export async function setupPassword(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }
//     const { newPassword, retypePassword } = req.body;

//     if (!newPassword || !retypePassword) {
//       res.status(400).json({ message: 'Password is required' });
//       return;
//     }

//     if (newPassword !== retypePassword) {
//       res.status(400).json({ message: 'Passwords do not match' });
//       return;
//     }

//     const salt = await genSalt(10);
//     const hashedPassword = await hash(newPassword, salt);

//     await prisma.user.update({
//       where: { id: Number(userId) },
//       data: { password: hashedPassword },
//     });

//     res
//       .status(200)
//       .json({ ok: true, message: 'Password has been set successfully!' });
//   } catch (error) {
//     next(error);
//   }
// }
