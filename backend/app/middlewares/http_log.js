const http_log = (req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next();
}

export default http_log;