import jwt from 'jsonwebtoken';
import { jwt_keys } from '../../config';
import { Validator } from '../models/Validator';
import { RoomController } from '../controllers/RoomController';
import { RoomManager } from '../models/RoomManager';

export class Socket {
    isLogged = false;
    username;
    socket;
    onDisconnect;
    onLogin;

    constructor(newSocket, onLogin, onDisconnect) {
        this.socket = newSocket;
        this.onLogin = onLogin;
        this.onDisconnect = onDisconnect;
        console.log('socket connected waiting for auth..');
        this.socket.on('login', (data) => this.authUser(data));
        this.socket.on('disconnect', (data) => this.disconnect(data))
    }

    authUser(data) {
        try {
            if (this.isLogged || !Validator.jwt_token(data.token))
                return;
            const token = jwt.verify(data.token, jwt_keys.auth_token.key)
            this.username = token.username;
            this.isLogged = true;
            this.successfullyAuth();
        } catch (e) {
            console.log(e);
        }
    }

    successfullyAuth() {
        this.onLogin(this);
        console.log(`user is successfully logged! welcome ${this.username}`)
        this.socket.join(this.username);
        this.socket.on('subscribe_DM', (data) => this.onSubscribeDM(data))
        this.socket.on('send_message', (data) => this.onSendMessage(data))
        this.socket.emit('logged', []);
    }

    onSubscribeDM(data) {
        if (!Validator.username(data.username))
            return;
        this.socket.join(`DM/${this.username}/${data.username}`);
        console.log(`user ${this.username} joined 'DM/${this.username}/${data.username}'`);
        this.emitOldMessages(data.username);
    }
    
    emitOldMessages(withUser) {
        RoomManager.getOldMessages(this.username, withUser)
        .then((messages) => {
            this.socket.emit('old_messages', messages);
        })
    }

    onSendMessage(data) {
        if (!Validator.username(data.username))
            return;
        if (!Validator.message(data.text))
            return;
        console.log('data:', data);
        RoomController.sendMessage(this.username, data.username, data.text).catch(console.log)
    }

    disconnect() {
        console.log(`user '${this.username}' disconnected`);
        this.onDisconnect(this);
    }
}
