const e_sexual_orientation = {
    MALE_HETERO: '1',
    MALE_BISEXUAL: '2',
    MALE_GAY: '3',
    FEMALE_HETERO: '4',
    FEMALE_BISEXUAL: '5',
    FEMALE_GAY: '6'
}

const mapOfSexuality = new Map()
// gender male
mapOfSexuality.set(e_sexual_orientation.MALE_HETERO, [
    e_sexual_orientation.FEMALE_HETERO,
    e_sexual_orientation.FEMALE_BISEXUAL
])
mapOfSexuality.set(e_sexual_orientation.MALE_BISEXUAL, [
    e_sexual_orientation.FEMALE_HETERO,
    e_sexual_orientation.FEMALE_BISEXUAL,
    e_sexual_orientation.MALE_GAY,
    e_sexual_orientation.MALE_BISEXUAL,
])
mapOfSexuality.set(e_sexual_orientation.MALE_GAY, [
    e_sexual_orientation.MALE_BISEXUAL,
    e_sexual_orientation.MALE_GAY
])

// gender female
mapOfSexuality.set(e_sexual_orientation.FEMALE_HETERO, [
    e_sexual_orientation.MALE_HETERO,
    e_sexual_orientation.MALE_BISEXUAL
])
mapOfSexuality.set(e_sexual_orientation.FEMALE_BISEXUAL, [
    e_sexual_orientation.FEMALE_BISEXUAL,
    e_sexual_orientation.FEMALE_GAY,
    e_sexual_orientation.MALE_BISEXUAL,
    e_sexual_orientation.MALE_HETERO
])
mapOfSexuality.set(e_sexual_orientation.FEMALE_GAY, [
    e_sexual_orientation.FEMALE_BISEXUAL,
    e_sexual_orientation.FEMALE_GAY
])

export class SexualityManager {
    static getSexualOrientation(gender, sexual_orientation) {
        if (gender == '1') {
            if (sexual_orientation == '1') return e_sexual_orientation.MALE_HETERO;
            if (sexual_orientation == '2') return e_sexual_orientation.MALE_BISEXUAL;
            if (sexual_orientation == '3') return e_sexual_orientation.MALE_GAY;
        } else {
            if (sexual_orientation == '1') return e_sexual_orientation.FEMALE_HETERO;
            if (sexual_orientation == '2') return e_sexual_orientation.FEMALE_BISEXUAL;
            if (sexual_orientation == '3') return e_sexual_orientation.FEMALE_GAY;
        }
        return 0
    }

    static getMatchingOrientations(sexual_orientation) {
        if (mapOfSexuality.has(sexual_orientation))
            return mapOfSexuality.get(sexual_orientation);
        return (0);
    }
}