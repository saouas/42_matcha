import express from 'express';
import { login } from './controllers/auth/login';
import { hello_world } from './controllers/hello_world';
import http_log from './middlewares/http_log';
import { APIHandler } from './controllers/APIHandler';
import { register } from './controllers/auth/register';
import { activate_account } from './controllers/auth/activate_account';
import { update_profile } from './controllers/profile/update_profile';
import { needAuth } from './middlewares/needAuth';
import { update_fullname } from './controllers/profile/update_fullname';
import { update_password } from './controllers/profile/update_password';
import { update_mail } from './controllers/profile/update_mail';
import { ask_reset_password } from './controllers/auth/ask_reset_password';
import { reset_password } from './controllers/auth/reset_password';
import { update_profile_pic } from './controllers/profile/update_profile_pic';
import { add_tag } from './controllers/tag/add_tag';
import { remove_tag } from './controllers/tag/remove_tag';
import { popular_tag } from './controllers/tag/popular_tag';
import { search_tag } from './controllers/tag/search_tag';
import { check_and_validate } from './controllers/profile/check_and_validate';
import { update_localisation } from './controllers/profile/update_localisation';
import { report_user } from './controllers/profile/report_user';
import { block_user } from './controllers/profile/block_user';
import { search_profiles } from './controllers/profile/recherche';
import { show_user_profile } from './controllers/profile/show_user_profile';
import { like } from './controllers/like/like';
import { unlike } from './controllers/like/unlike';
import { visit_history } from './controllers/profile/visit_history';
import { like_history } from './controllers/profile/like_history';
import { match } from './controllers/profile/match';
import { populate_db } from './controllers/auth/populate';
import { notifications } from './controllers/notifications/notifications';
import { clear_notifications } from './controllers/notifications/clear_notifications';
import { count_notifications } from './controllers/notifications/count_notifications';

class Router {
	static auth() {
		let router = express.Router();
		console.log('auth route..')
		router.get('/populate', APIHandler(populate_db));
		router.post('/login', APIHandler(login))
		router.post('/register', APIHandler(register));
		router.get('/activate_account', APIHandler(activate_account))
		router.post('/ask_reset_password', APIHandler(ask_reset_password));
		router.post('/reset_password', APIHandler(reset_password));
		return router;
	}

	static user() {
		let router = express.Router();
		console.log('user route..');
		router.use('/', needAuth);
		router.post('/update_profile_info', APIHandler(update_profile))
		router.post('/update_fullname', APIHandler(update_fullname))
		router.post('/update_password', APIHandler(update_password))
		router.post('/update_mail', APIHandler(update_mail))
		router.post('/update_profile_pic', APIHandler(update_profile_pic))
		router.post('/tag/add', APIHandler(add_tag));
		router.post('/tag/remove', APIHandler(remove_tag));
		router.get('/tag/popular', APIHandler(popular_tag));
		router.get('/tag/search', APIHandler(search_tag))
		router.post('/check_and_validate_profile', APIHandler(check_and_validate));
		router.post('/update_localisation', APIHandler(update_localisation));
		router.post('/report_user', APIHandler(report_user));
		router.post('/block_user', APIHandler(block_user));
		router.post('/recherche', APIHandler(search_profiles));
		router.get('/show_user_profile', APIHandler(show_user_profile));
		router.post('/like', APIHandler(like));
		router.post('/unlike', APIHandler(unlike));
		router.get('/visit_history', APIHandler(visit_history));
		router.get('/like_history', APIHandler(like_history));
		router.get('/match', APIHandler(match));
		router.get('/notifications', APIHandler(notifications));
		router.post('/notifications/clear', APIHandler(clear_notifications));
		router.get('/notifications/count', APIHandler(count_notifications));
		return router;
	}

	static getRouter() {
		console.log('initialize router..');
		let router = express.Router();

		console.log('use middleware..');
		router.use(http_log);
		console.log('routes..');

		router.all('/', APIHandler(hello_world))
		router.use('/auth/', Router.auth());
		router.use('/user/', Router.user());
		console.log('end routing operations..');
		return router;
	}
}

export default Router.getRouter;