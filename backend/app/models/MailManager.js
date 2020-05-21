import nodemailer from 'nodemailer';
import { mail, api, web } from '../../config';
const transporter = nodemailer.createTransport(mail)

export class MailManager {
    static registration_mail(mail_to, token) {
        return new Promise((resolve, reject) => {
            const link = `${api.protocol}://${api.domain}/auth/activate_account?token=${token}`;
			const html = `<h1>Bienvenue sur Matcha!</h1><p>Commence à matcher dès maintenant ! <a href='${link}'>Clique ici</a></p`;
            const options = {
                to: mail_to,
                subject: 'Matcha - Activation de votre compte',
                html: html
            }
            transporter.sendMail(options)
            .then(() => {
                resolve();
            })
            .catch(reject);
        })
    }

    static reset_code(mail_to, token) {
        return new Promise((resolve, reject) => {
            const link = `${web.protocol}://${web.domain}/reset_password/${token}`;
            const html = `<h1>Réinitialiser votre mot de passe</h1><p>Vous avez demandé à réinitialiser votre mot de passe <a href='${link}'>Clique ici</a></p`;
            const options = {
                to: mail_to,
                subject: 'Matcha - Réinitialiser votre mot de passe',
                html: html
            }
            transporter.sendMail(options)
            .then(() => {
                resolve();
            })
            .catch(reject);
        })
    }
}