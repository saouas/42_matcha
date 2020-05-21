export class Validator {
	/*
		Validation login :
		- 3 à 20 caractères
		- Alphanum
		- Underscore
	*/
	static username(val) {
		return new RegExp(/^[a-z0-9_]{3,20}$/).test(val);
	}


	/*
		Validation password:
		- Commence par un alphanum
		- 1 minuscule , 1majuscule, 1 chiffre obligatoires
		- 1 caractère spécial obligatoire
		- Longueur minimum 8 caractères
	*/
	static password(val) {
		return new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).test(val);
	}


	/**
	 * First name
	 * Prénom avec caractères spéciaux, tirets.
	 * @param {string} val 
	 */
	static first_name(val) {
		return new RegExp(/^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð,.'-]{2,20}$/).test(val);
	}

	/**
	 * Last name
	 * Nom avec caractères spéciaux, tirets.
	 * @param {string} val 
	 */
	static last_name(val) {
		return new RegExp(/^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž∂ð,.'-]{2,20}$/).test(val);
	}

    /*
        Validation mail:
        - RFC2822 Norme mail
    */
	static mail(val) {
		return new RegExp(/^[^\W][a-z0-9_]+(\.[a-z0-9_]+)*@[a-z0-9_]+(\.[a-z0-9_]+)*\.[a-z]{2,4}$/).test(val);
	}

	/*
		JWT token
	*/
	static jwt_token(val) {
		return new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).test(val);
	}

	/**
	 * Homme - 1
	 * Femme - 2
	 * @param {number} val 
	 */
	static gender(val) {
		return (['1', '2'].includes(val));
	}


	/**
	 * 1 - Hétérosexuel
	 * 2 - Bisexuel
	 * 3 - Gay
	 * @param {number} val 
	 */
	static sexual_orientation(val) {
		return (['1', '2', '3'].includes(val));
	}

	/**
	 * 1 caractère au minimum
	 * 80 caractères maximum
	 * @param {string} val 
	 */
	static biography(val) {
		return (new RegExp(/^.{1,80}$/).test(val));
	}

	/**
	 * 4 slots de showcase
	 * 0 - h
	 * @param {string} val 
	 */
	static showcase_slot(val) {
		return (['0', '1', '2', '3', '4'].includes(val));
	}

	/**
	 * Nom d'un tag
	 * @param {string} val 
	 */
	static tag(val) {
		return (new RegExp(/^[a-z]{3,10}$/)).test(val);
	}

	/**
	 * Nom d'un tag lors d'une recherche
	 * @param {string} val 
	 */
	static search_tag(val) {
		return (new RegExp(/^[a-z]{1,10}$/)).test(val);
	}

	/**
	 * Age utilisateur
	 * @param {string} age
	 * Entre 1 et 100 ans inclus
	 */

	static age(val){
		return new RegExp(/^[1-9][0-9]?$|^100$/).test(val);
	}

	/**
	  * Geographie : latitude
	  * @param {string} lat
	  */
	static lat(val){
		return new RegExp (/^[-]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/).test(val);
	}

	/**
	  * Geographie : longitude
	  * @param {string} lon
	  */
	static lon(val){
		return new RegExp (/^[-]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/).test(val);
	}

	static profile_pic_0(val)
	{
		return new RegExp(/^[a-z0-9]{1,}$/).test(val);
	}

	/**
	 * Flag report reason : 1-3
	 * @param {string} flag 
	 */
	static flag_report(val) {
		return (['1', '2', '3'].includes(val));
	}

	/**
	 * Range Age norme : val = 'X+Y'
	 * @param {string} val  
	 */

	static range_age(val) {
		if (typeof val !== 'string')
			return false;
		if(val.split('+').length !== 2)
			return false;

		let x = val.split('+')[0];
		let y = val.split('+')[1];

		if (x <= y) {
			return ((new RegExp(/^[1-9][0-9]?$|^100$/).test(x)) && (new RegExp(/^[1-9][0-9]?$|^100$/).test(y)));
		}
		else {
			return (false);
		}
	}

	/**
	 * Range popularity score : val = 'X+Y'
	 * @param {string} val
	 */

	static range_popularity_score(val) {
		if (typeof val !== 'string')
			return false;
		if(val.split('+').length !== 2)
			return false;
		
		let x = val.split('+')[0];
		let y = val.split('+')[1];
		if (Number(x) <= Number(y)) {
			return ((new RegExp(/^[0-9]?$|^10$/).test(x)) && (new RegExp(/^[0-9]?$|^10$/).test(y)));
		}
		else {
			return (false);
		}
	}

	/**
	 * Distance en km 1-1000 KM
	 * @param {string} val
	 */

	static distance(val) {
		return (new RegExp(/^([1-9][0-9]{0,5}|100000|0)$/).test(val));
	}

	/**
	 * Tableau de tags ['fb', 'moto', 'tech'] 
	 * @param {string} val
	 */

	static tags(val) {
		let count = 0;
		console.log(val)
		console.log(typeof val)
		if(typeof val === 'string'){
			console.log(Validator.tag(val))
			return (Validator.tag(val))
		}
		if (!Array.isArray(val))
			return false;

		val.forEach(element => {
			if (Validator.tag(element) === false) {
				count++;
				return false;
			}
		});
		if (count === 0)
			return true;
	}

	static message(val) {
		return new RegExp(/^.+$/).test(val);
	}

}
