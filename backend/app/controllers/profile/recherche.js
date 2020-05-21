import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';

let schema_with_tags = new SchemaValidator({
	range_age: Validator.range_age,
	range_popularity_score: Validator.range_popularity_score,
	distance: Validator.distance,
	tags: Validator.tags  
});

const schema_without_tags = new SchemaValidator({
	range_age: Validator.range_age,
	range_popularity_score: Validator.range_popularity_score,
	distance: Validator.distance
})

export const search_profiles = (body, session) => {
	return new Promise((resolve, reject) => {
		let data = [];
		let ourSchema = schema_with_tags;
		if(body.tags == null || (Array.isArray(body.tags) && body.tags.length === 0)) {
			ourSchema = schema_without_tags;
			if (body['tags'])
				delete body['tags'];
		}
        ourSchema.validate(body)
        .then(() => {
			data['range_age_x'] = (body.range_age).split('+')[0];
			data['range_age_y'] = (body.range_age).split('+')[1];
			data['range_popularity_x'] = body.range_popularity_score.split('+')[0];
			data['range_popularity_y'] = body.range_popularity_score.split('+')[1];	
			data['distance'] = (body.distance);
			data['tags'] = (body.tags);	
			return (UserManager.search_profiles(session.username, data['range_age_x'], data['range_age_y'], data['range_popularity_x'], data['range_popularity_y'], data['distance'], data['tags']))
		})
		.then((results) => {
			resolve(results);
		})
		.catch(reject);
    })
}