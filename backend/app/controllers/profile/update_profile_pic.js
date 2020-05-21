import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { FileManager } from '../../models/FileManager';
import { UploadManager } from '../../models/UploadManager';
import { UserManager } from '../../models/UserManager';
import { public_url, folder } from '../../../config';

const update_profile_pic_schema = new SchemaValidator({
    slot: Validator.showcase_slot
})

export const update_profile_pic = (body, session, full_req) => {
    return new Promise((resolve, reject) => {
        let data;
        let file;
        update_profile_pic_schema.validate(full_req.query)
        .then((freshData) => {
            data = freshData;
            return UploadManager.upload_showcase(full_req);
        })
        .then((newFile) => {
            file = newFile;
            return UserManager.updateShowcasePic(session.username, file.filename, data.slot);
        })
        .then((old_filename) => {
            FileManager.try_to_delete(`${folder.profile_pictures}/${old_filename}`)
            resolve({
                url: `${public_url.profile_pictures}/${file.filename}`
            });
        })
        .catch((err) => {
            if (file)
                FileManager.try_to_delete(file.path)
            reject(err);
        });
    })
}