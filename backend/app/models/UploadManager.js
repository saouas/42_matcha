import multer from 'multer';
import { folder } from '../../config';
import { e_error } from './e_error';

const multer_config = {
    limits: {
        fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg'].includes(file.mimetype)) {
            return cb(new Error('Wrong file type'));
        }
        cb(null, true)
    }
}

/**
 * Config multer upload showcase pic
 */
const config_profile_pic = multer({
    dest: folder.profile_pictures,
    ...multer_config
})
const upload_profile_func = config_profile_pic.single('pic');


export class UploadManager {
    static uploadOne(req, uploader) {
        return new Promise((resolve, reject) => {
            uploader(req, null, (err) => {
                if (err || !req.file)
                    return reject(e_error.INVALID_FILE);
                resolve(req.file);
            })
        })
    }

    static upload_showcase(req) {
        return UploadManager.uploadOne(req, upload_profile_func)
    }
}