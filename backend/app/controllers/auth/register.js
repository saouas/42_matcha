import { Validator } from '../../models/Validator';
import { SchemaValidator } from '../../models/SchemaValidator';
import { MailManager } from '../../models/MailManager';
import { UserManager } from '../../models/UserManager';
import { bcrypt_conf, jwt_keys } from '../../../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

let register_schema = new SchemaValidator({
	username: Validator.username,
	password: Validator.password,
	mail: Validator.mail,
	first_name: Validator.first_name,
	last_name: Validator.last_name
})

export let register = (body) => {
	return new Promise((resolve, reject) => {
		let data;
		register_schema.validate(body)
		.then((freshData) => {
			data = freshData;
			return UserManager.userExist(data.username, data.mail);
		})
		.then((exist) => {
            if (exist) throw (exist);
			return bcrypt.hash(data.password, bcrypt_conf.salt_rounds);
		})
		.then((hashedPassword) => {
			return UserManager.insert(data.username, hashedPassword, data.mail, data.first_name, data.last_name);
		})
		.then((node_id) => {
			const token = jwt.sign({
				username: data.username,
				id: node_id
			}, jwt_keys.registration_token.key, {
				expiresIn: jwt_keys.registration_token.expire
			});
			return MailManager.registration_mail(data.mail, token);
		})
		.then(() => {
			resolve({
				message: "account successfully created"
			})
		})
		.catch(reject);
	})
}