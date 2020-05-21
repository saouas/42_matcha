import fs from 'fs';

export class FileManager {
    static try_to_delete = (file_path) => {
        try {
            if (file_path && fs.existsSync(file_path))
                fs.unlinkSync(file_path);
        }
        catch (err) {
            console.log(err);
        }
    }
}