import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

export const confirmPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const querytoken = req.query.token;

    // Check if the token is present
    if (!querytoken) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const confirmTokenRecord = await prisma.confirmToken.findFirst({
      where: { token: querytoken.toString() },
      include: { user: true },
    });

    // Check if the token is valid, not used, and not expired
    if (!confirmTokenRecord || confirmTokenRecord.expiredDate < new Date()) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    const user = confirmTokenRecord.user;

    if (!user) {
      res.status(400).json({ message: 'User not found!' });
      return;
    }

    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '24h',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      })
      .status(200).send(`
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset Confirmed</title>
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
    <h1>Password Reset Confirmed!</h1>
    <p>
      Your password has been successfully reset. 
      You can now head back and log in with your new password.
    </p>
    <a href="http://localhost:3000/auth/reset-password" class="button">Go to Reset Password Page</a>
    <div class="footer">
      <p>&copy; 2025 Resend Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
        `);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
    console.error(error);
    next(error);
  }
};

// export const confirmPasswordReset = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const token = req.query.token;

//     // Check if the token is present
//     if (!token) {
//       res.status(400).json({ message: 'Token is required!' });
//       return;
//     }

//     const { newPassword } = confirmPasswordResetSchema.parse(req.body);

//     const confirmTokenRecord = await prisma.confirmToken.findFirst({
//       where: { token: token.toString() },
//       include: { user: true },
//     });

//     // Check if the token is valid, not used, and not expired
//     if (!confirmTokenRecord || confirmTokenRecord.expiredDate < new Date()) {
//       res.status(400).json({ message: 'Invalid or expired token!' });
//       return;
//     }

//     const hashedPassword = await hash(newPassword, 10);
//     await prisma.user.update({
//       where: { id: confirmTokenRecord.userId },
//       data: { password: hashedPassword },
//     });

//     await prisma.confirmToken.delete({
//       where: { id: confirmTokenRecord.id },
//     });

//     // Send a user-friendly HTML response
//     res.status(200).send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <title>Password Reset Successful</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <style>
//           body {
//             margin: 0;
//             padding: 0;
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f9;
//           }
//           .container {
//             max-width: 600px;
//             margin: 40px auto;
//             background-color: #ffffff;
//             padding: 30px;
//             border-radius: 8px;
//             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//             text-align: center;
//           }
//           h1 {
//             margin-top: 0;
//             color: #4a90e2;
//           }
//           p {
//             font-size: 16px;
//             line-height: 1.5;
//             color: #333;
//           }
//           .button {
//             display: inline-block;
//             margin-top: 20px;
//             padding: 12px 24px;
//             background-color: #4a90e2;
//             color: #ffffff;
//             text-decoration: none;
//             font-weight: bold;
//             border-radius: 4px;
//             transition: background-color 0.2s ease-in-out;
//           }
//           .button:hover {
//             background-color: #357ab8;
//           }
//           .footer {
//             margin-top: 20px;
//             font-size: 12px;
//             color: #777;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <h1>Password Reset Successful!</h1>
//           <p>
//             Your password has been successfully reset.
//             You can now head back and log in to get started.
//           </p>
//           <a href="http://localhost:3000/auth/login" class="button">Go to Login</a>
//           <div class="footer">
//             <p>&copy; 2025 Resend Platform. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ message: error.issues[0].message });
//     } else {
//       res.status(500).json({ message: 'Internal server error' });
//     }
//     console.error(error);
//     next(error);
//   }
// };
