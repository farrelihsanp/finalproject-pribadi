// import { Request, Response, NextFunction } from 'express';
// import { Role } from '@prisma/client';
// import crypto from 'node:crypto';
// import Handlebars from 'handlebars';
// import fs from 'node:fs/promises';
// import { Resend } from 'resend';
// import { registerSchema } from '../schemas/auth-schemas.js';
// import { prisma } from '../configs/prisma.js';
// import cloudinary from '../configs/cloudinary.js';
// import { genSalt, hash } from 'bcryptjs';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function register(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     let cloudinaryData;
//     const defaultImageUrl =
//       'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

//     if (req.file) {
//       try {
//         cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'profileimage/images',
//         });
//         await fs.unlink(req.file.path);
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         cloudinaryData = { secure_url: defaultImageUrl };
//       }
//     } else {
//       cloudinaryData = { secure_url: defaultImageUrl };
//     }

//     const { name, username, email, role, referralCode } = registerSchema.parse(
//       req.body,
//     );

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ email }, { username }],
//       },
//     });

//     if (existingUser) {
//       res
//         .status(400)
//         .json({ message: 'Email or username has already been used' });
//       return;
//     }

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         username,
//         email,
//         role: role as Role,
//         password: '',
//         referralNumber: '',
//         profileImage: cloudinaryData.secure_url,
//         provider: 'CREDENTIALS',
//       },
//     });

//     const referralNumber = `${newUser.id}REF${Date.now().toString().slice(-3)}`;
//     await prisma.user.update({
//       where: { id: newUser.id },
//       data: { referralNumber },
//     });

//     if (referralCode) {
//       const referringUser = await prisma.user.findUnique({
//         where: { referralNumber: referralCode },
//       });

//       if (referringUser) {
//         // Create a referral record
//         await prisma.referral.create({
//           data: {
//             referredById: referringUser.id,
//             referredUserId: newUser.id,
//           },
//         });
//       }
//     }

//     const confirmToken = crypto.randomBytes(20).toString('hex');
//     const confirmationLink = `http://localhost:8000/api/v1/confirm/email?token=${confirmToken}`;

//     await prisma.confirmToken.create({
//       data: {
//         expiredDate: new Date(Date.now() + 1000 * 60 * 5),
//         token: confirmToken,
//         userId: newUser.id,
//       },
//     });

//     const templateSource = await fs.readFile(
//       'src/templates/email-confirmation-template.hbs',
//     );
//     const compiledTemplate = Handlebars.compile(templateSource.toString());
//     const htmlTemplate = compiledTemplate({
//       name: name,
//       confirmationLink: confirmationLink,
//     });

//     const { error } = await resend.emails.send({
//       from: 'User Confirmation <onboarding@resend.dev>',
//       to: email,
//       subject: 'Confirmation Email',
//       html: htmlTemplate,
//     });

//     if (error) {
//       res.status(400).json({ error });
//       return;
//     }

//     res.status(200).json({ ok: true, message: 'Register completed!' });
//   } catch (error) {
//     next(error);
//   }
// }

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
