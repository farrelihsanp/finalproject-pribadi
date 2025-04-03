import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../schemas/auth-schemas.js';
import { prisma } from '../configs/prisma.js';
import crypto from 'node:crypto';
import { Resend } from 'resend';
import fs from 'node:fs/promises';
import cloudinary from '../configs/cloudinary.js';
import { genSalt, hash } from 'bcryptjs';
import { UserData } from '../types/express.d.js';
import Handlebars from 'handlebars';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailOrUsername, password } = loginSchema.parse(req.body);

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!existingUser) {
      res.status(400).json({ message: 'User not found! ' });
      return;
    }

    if (!existingUser.emailConfirmed) {
      res.status(400).json({ message: 'Please complete your registration! ' });
      return;
    }

    if (!existingUser.password) {
      res.status(400).json({ message: 'User password not found!' });
      return;
    }

    const isValidPassword = await compare(password, existingUser.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials!' });
      return;
    }

    const jwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      username: existingUser.username,
      profileImage: existingUser.profileImage,
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '24h',
    });

    res
      .cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        domain:
          process.env.NODE_ENV === 'development' ? 'localhost' : 'quickmart',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ ok: true, message: 'Login succeded!', role: existingUser.role });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    req.user = null;
    res
      .clearCookie('accessToken')
      .status(200)
      .json({ message: 'Logout succesfully!' });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      referralNumber: user.referralNumber,
      emailConfirmed: user.emailConfirmed,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export const sendEmailresetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    // Generate a confirmation token
    const confirmToken = crypto.randomBytes(20).toString('hex');
    const passwordResetLink = `http://localhost:8000/api/v1/confirm/reset-password?token=${confirmToken}`;

    await prisma.confirmToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 5),
        token: confirmToken,
        userId: user.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/password-reset-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      name: user.name,
      passwordResetLink: passwordResetLink,
    });

    // Send the email
    const { error } = await resend.emails.send({
      from: 'Password Reset <reset@resend.dev>',
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token;

    if (!token) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const confirmToken = await prisma.confirmToken.findFirst({
      where: { token: token.toString() },
    });

    if (!confirmToken || confirmToken.expiredDate < new Date()) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    const { password } = req.body;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await prisma.user.update({
      where: { id: confirmToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.confirmToken.update({
      where: { id: confirmToken.id },
      data: { used: true },
    });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { name, username, password, email } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  if (!name || !username || !password || !email) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  let profileImage;

  try {
    let cloudinaryData;

    // Fetch the existing user data
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // If a new file is uploaded, upload it to Cloudinary
    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profileimage/images',
        });
        await fs.unlink(req.file.path);
        profileImage = cloudinaryData.secure_url; // Use the new image URL
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({ error: 'Image upload failed' });
        return;
      }
    } else {
      // If no new image is uploaded, retain the existing profile image
      profileImage = user.profileImage;
    }

    // Construct the data object dynamically
    const data: UserData = {};

    if (name) data.name = name;
    if (username) data.username = username;
    if (profileImage) data.profileImage = profileImage; // Use the existing or new image
    if (email) {
      data.email = email;
      const confirmToken = crypto.randomBytes(20).toString('hex');
      const confirmationLink = `http://localhost:8000/api/v1/confirm/update-email?token=${confirmToken}`;

      await prisma.confirmToken.create({
        data: {
          expiredDate: new Date(Date.now() + 1000 * 60 * 5),
          token: confirmToken,
          userId: Number(userId),
        },
      });

      const templateSource = await fs.readFile(
        'src/templates/update-email-confirmation-template.hbs',
      );
      const compiledTemplate = Handlebars.compile(templateSource.toString());
      const htmlTemplate = compiledTemplate({
        name: name || user.name,
        confirmationLink: confirmationLink,
      });

      const { error } = await resend.emails.send({
        from: 'Update email <onboarding@resend.dev>',
        to: email,
        subject: 'Update Confirmation Email',
        html: htmlTemplate,
      });

      if (error) {
        res.status(400).json({ error: 'Email update failed' });
        return;
      }
    }

    if (password) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      data.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: data,
    });

    res
      .status(200)
      .json({ message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    next(error);
  }
};
