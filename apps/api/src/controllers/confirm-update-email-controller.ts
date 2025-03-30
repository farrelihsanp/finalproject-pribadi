import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

export async function confirmUpdateEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.query.token;

    if (!token) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const tokenRecord = await prisma.confirmToken.findFirst({
      where: { token: token.toString() },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    await prisma.confirmToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailConfirmed: true },
    });

    res.status(200).send(`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Updated</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Your email has been successfully updated and verified." />
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
    <h1>Email Updated!</h1>
    <p>
      Awesome—your email has been successfully updated and verified. 
    </p>
    <a href="http://localhost:3000/dashboard/customers/profile" class="button">Go to profile</a>
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

export async function checkUpdateEmailStatus(
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
