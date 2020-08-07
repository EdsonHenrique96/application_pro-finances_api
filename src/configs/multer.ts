import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const pathDestination = path.resolve(__dirname, '../../tmp');

export default {
  directory: pathDestination,

  storage: multer.diskStorage({
    destination: pathDestination,
    filename(request, file, callback) {
      const hash = crypto.randomBytes(10).toString('hex');
      const filename = `${hash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
