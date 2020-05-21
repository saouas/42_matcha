import { ErrorHandler } from './ErrorHandler';
import { RedirectRequest } from '../models/RedirectRequest';

export const APIHandler = (controller) => {
    return (new APIHandlerWrapper(controller).req);
}

class APIHandlerWrapper {
    constructor(controller) {
        this.controller = controller;
    }

    req = (req, res) => {
        const data = req.method == 'GET' ? req.query : req.body;
        process.env.NODE_ENV !== 'production' ? console.log(data) : null;
        this.controller(data, req.session, req)
        .then((data) => {
            if (data instanceof RedirectRequest)
                return res.redirect(data.url);
            res.json(data);
        })
        .catch((err) => {
            ErrorHandler.handleWebError(req, res, err);
        })
    }
}