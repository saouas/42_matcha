export const hello_world = (body) => {
    return new Promise((resolve, reject) => {
        resolve({
            message: 'hello world! 🍓'
        });
    })
}