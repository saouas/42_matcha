
import { e_error } from '../models/e_error';

const env = process.env.NODE_ENV !== 'production'
const err_tab = new Map();

for (let [key, value] of Object.entries(e_error)) {
    err_tab.set(value, key);
}

export class ErrorHandler {
    static handleWebError(req, res, err) {
        res.status(400);
        if (!isNaN(err) && err_tab.has(err)) {
            res.json({
                code: err,
                message: err_tab.get(err)
            })
            env ? console.log(err_tab.get(err)) : null;
            return;
        }

        res.json({
            code: 666,
            message: 'oh ! something went wrong'
        })
        env ? console.log(err) : null;
    }
}