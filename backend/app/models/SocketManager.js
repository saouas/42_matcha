import { Socket } from '../sockets/Socket';
import { UserManager } from './UserManager';

var socket_io = require('socket.io')

class SocketManager {
    static connectedUsers = new Map();
    static io;

    static init(server) {
        this.io = socket_io(server);
        this.io.on('connection', (socket) => new Socket(socket, SocketManager.onLogin, SocketManager.onDisconnect))
    }

    static onLogin(socket) {
        if (SocketManager.connectedUsers.has(socket.username))
            SocketManager.connectedUsers.set(socket.username, SocketManager.connectedUsers.get(socket.username) + 1);
        else
            SocketManager.connectedUsers.set(socket.username, 1);
    }

    static onDisconnect(socket) {
        if (!socket.username)
            return ;
        SocketManager.connectedUsers.set(socket.username, SocketManager.connectedUsers.get(socket.username) - 1);
        if (SocketManager.connectedUsers.get(socket.username) <= 0)
            SocketManager.connectedUsers.delete(socket.username);
        UserManager.updateLastSeen(socket.username);
    }

    static isOnline = (username) => {
        return this.connectedUsers.get(username) ? true : false;
    }
}

setInterval(() => {
    console.log(`users connected ${SocketManager.connectedUsers.length}`)
    console.log(SocketManager.connectedUsers);
}, 10000)

export { SocketManager }