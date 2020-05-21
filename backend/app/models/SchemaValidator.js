import { e_error } from './e_error';

export class SchemaValidator {
	constructor(rules) {
		this.funcsTemplates = new Map();
		for (let [key, value] of Object.entries(rules)) {
			this.funcsTemplates.set(key, value);
		}
	}

	validate = (body) => {
		return new Promise((resolve) => {
			let funcs = new Map(this.funcsTemplates);
			const stop = () => {
				throw(e_error.BAD_VALIDATION);
			}

			if (funcs.size !== Object.keys(body).length)
				stop();
			for (let [key, value] of Object.entries(body)) {
				if (value === undefined || value === null)
					stop();	
				if (!(funcs.has(key)))
					stop();
				if (!funcs.get(key)(value))
					stop();
				funcs.delete(key);
			}
			resolve(body);
		})
		
	}
}