// import { NextFunction, Request, Response } from 'express';
// import { prisma } from '../configs/prisma.js';
// import { Store } from '@prisma/client';

// export const getNearestStore = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { latitude, longitude } = req.body;

//   if (latitude === undefined || longitude === undefined) {
//     res.status(400).json({ error: 'Latitude and longitude are required' });
//     return;
//   }

//   try {
//     const stores: Store[] = await prisma.store.findMany({
//       where: {
//         isActive: true,
//       },
//     });

//     if (!stores || stores.length === 0) {
//       res.status(404).json({ error: 'No active stores found' });
//       return;
//     }

//     let nearestStore = stores[0];
//     let minDistance = getDistance(
//       { latitude, longitude },
//       { latitude: nearestStore.latitude, longitude: nearestStore.longitude },
//     );

//     for (let i = 1; i < stores.length; i++) {
//       const store = stores[i];
//       const distance = getDistance(
//         { latitude, longitude },
//         { latitude: store.latitude, longitude: store.longitude },
//       );

//       if (distance < minDistance) {
//         nearestStore = store;
//         minDistance = distance;
//       }
//     }

//     res.status(200).json(nearestStore);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
