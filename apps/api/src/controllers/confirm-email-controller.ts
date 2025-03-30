import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import jwt from 'jsonwebtoken';

export async function confirmEmail(
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

    const tokenRecord = await prisma.confirmToken.findFirst({
      where: { token: tokenQuery.toString() },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailConfirmed: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.userId },
    });

    if (!user) {
      res.status(400).json({ message: 'User not found!' });
      return;
    }

    // Generate JWT token for the user
    const jwtPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '24h',
    });

    // Set the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // Set to true if using HTTPS
    });

    // Send confirmation response
    res.status(200).send(`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Confirmed</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      margin-top: 0;
      color: #4a90e2;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4a90e2;
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      transition: background-color 0.2s ease-in-out;
    }
    .button:hover {
      background-color: #357ab8;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Registration Successful!</h1>
    <p>
      Awesome—your email has been successfully verified. 
      You can now head back and set a new password.
    </p>
    <a href="http://localhost:3000/dashboard/customers/set-password" class="button">Go to Page to fill Password</a>
    <div class="footer">
      <p>&copy; 2025 Resend Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
        `);
  } catch (error) {
    next(error);
  }
}

export async function checkEmailStatus(
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
      where: { id: userId, emailConfirmed: true },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ emailConfirmed: user.emailConfirmed });
  } catch (error) {
    next(error);
  }
}
