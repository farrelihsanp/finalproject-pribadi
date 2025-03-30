import multer from 'multer';
import path from 'node:path';

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/images');
    },
    filename: (req, file, cb) => {
      const uniquePrefix = `img-${Date.now()}`;
      cb(null, uniquePrefix + path.extname(file.originalname));
    },
  }),
});

// BACKUP KODE TERBARU

// import multer from 'multer';
// import path from 'node:path';
// import { Request } from 'express'; // Import Request type from express
// import { File } from 'multer';

// // Fungsi untuk memeriksa ekstensi file
// const fileFilter = (
//   _req: Request, // Use the Request type from express
//   file: File,
//   cb: (error: Error | null, accepted: boolean) => void,
// ) => {
//   // Daftar ekstensi file yang diperbolehkan
//   const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
//   // Mendapatkan ekstensi file dari nama file asli
//   const fileExtension = path.extname(file.originalname).toLowerCase();

//   // Memeriksa apakah ekstensi file ada dalam daftar yang diperbolehkan
//   if (allowedExtensions.includes(fileExtension)) {
//     cb(null, true); // File diterima
//   } else {
//     cb(
//       new Error(
//         'Tipe file tidak diperbolehkan. Hanya file .jpg, .jpeg, .png, dan .gif yang diperbolehkan.',
//       ),
//       false,
//     ); // File ditolak
//   }
// };

// export const upload = multer({
//   storage: multer.diskStorage({
//     destination: (
//       _req: Request,
//       _file: File,
//       cb: (error: Error | null, destination: string) => void,
//     ) => {
//       cb(null, 'public/images');
//     },
//     filename: (
//       _req: Request,
//       file: File,
//       cb: (error: Error | null, filename: string) => void,
//     ) => {
//       const uniquePrefix = `img-${Date.now()}`;
//       cb(null, uniquePrefix + path.extname(file.originalname));
//     },
//   }),
//   fileFilter: fileFilter, // Menambahkan fungsi fileFilter
//   limits: {
//     fileSize: 1048576, // Ukuran maksimum file 1MB
//   },
// });
