
export class GameTurn {

    constructor(GAMES_RULES = {
        "NB_DICE_SIDES":6,
        "SCORING_DICE_VALUES": [1, 5],
        "SCORING_MULTIPLIER": [100, 50],
        "THRESHOLD_BONUS": 3,
        "STD_BONUS_MULTIPLIER": 100,
        "ACE_BONUS_MULTIPLIER": 1000,
        "DEFAULT_DICES_NB":5
    }) {
        this.NB_DICE_SIDES = GAMES_RULES.NB_DICE_SIDES;
        this.SCORING_DICE_VALUES = GAMES_RULES.SCORING_DICE_VALUES;
        this.SCORING_MULTIPLIER = GAMES_RULES.SCORING_MULTIPLIER;
        this.THRESHOLD_BONUS = GAMES_RULES.THRESHOLD_BONUS;
        this.STD_BONUS_MULTIPLIER = GAMES_RULES.STD_BONUS_MULTIPLIER;
        this.ACE_BONUS_MULTIPLIER = GAMES_RULES.ACE_BONUS_MULTIPLIER;
        this.DEFAULT_DICES_NB = GAMES_RULES.DEFAULT_DICES_NB;

        this.remaining_dice_to_roll = this.DEFAULT_DICES_NB;
        this.roll_again = true;
        this.turn_score = 0;
    } 

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    roll_dices(nb_dices_to_roll) {

        const array_value_occurences = Array(this.NB_DICE_SIDES);
        array_value_occurences.fill(0);
    
        let dices_rolled = 0;
    
        while (dices_rolled < nb_dices_to_roll) {
            const rolled_dice_value = this.getRandomInt(1, this.NB_DICE_SIDES);
            array_value_occurences[rolled_dice_value - 1] += 1;
            dices_rolled++;
        }
    
        return array_value_occurences;
    }

    analyse_bonus_score(array_value_occurences) {

        const array_scoring_value_occurences = Array(this.NB_DICE_SIDES);
        array_scoring_value_occurences.fill(0);
    
        let bonus_score = 0;
        let side_value_index = 0;
    
        while (side_value_index < array_value_occurences.length) {
            const side_value_occurrences = array_value_occurences[side_value_index];
    
            const nb_of_bonus = Math.floor(side_value_occurrences/this.THRESHOLD_BONUS);
            if (nb_of_bonus > 0) {
                
                let bonus_multiplier = this.STD_BONUS_MULTIPLIER;
                if (side_value_index == 0) {
                    bonus_multiplier = this.ACE_BONUS_MULTIPLIER;
                }
    
                bonus_score += nb_of_bonus * bonus_multiplier * (side_value_index + 1);
    
                //update the occurrence list after bonus rules for scoring dices and non scoring dices
                array_value_occurences[side_value_index] %= this.THRESHOLD_BONUS;
                array_scoring_value_occurences[side_value_index] = nb_of_bonus * this.THRESHOLD_BONUS;
    
            }
            side_value_index++;
        }
        return {
                'score': bonus_score,
                'scoring_dice': array_scoring_value_occurences,
                'non_scoring_dice': array_value_occurences
            }
    }

    analyse_standard_score(array_value_occurences) {

        const array_scoring_value_occurences = Array(this.NB_DICE_SIDES);
        array_scoring_value_occurences.fill(0);
    
        let standard_score = 0;
        let scoring_dice_value_index = 0;
    
        while(scoring_dice_value_index < this.SCORING_DICE_VALUES.length) {
            const scoring_value = this.SCORING_DICE_VALUES[scoring_dice_value_index];
            const scoring_multiplier = this.SCORING_MULTIPLIER[scoring_dice_value_index];
    
            standard_score += array_value_occurences[scoring_value - 1] * scoring_multiplier;
    
            //update the occurrence list after standard rules for scoring dices and non scoring dices
            array_scoring_value_occurences[scoring_value - 1] = array_value_occurences[scoring_value - 1];
            array_value_occurences[scoring_value - 1] = 0;
    
            scoring_dice_value_index++;
        }
    
        return {
            'score': standard_score,
            'scoring_dice': array_scoring_value_occurences,
            'non_scoring_dice': array_value_occurences
        }
    
    }

    analyse_score(array_value_occurences) {
        const analysis_score_bonus = this.analyse_bonus_score(array_value_occurences);
        const score_bonus = analysis_score_bonus['score'];
        const scoring_dice_from_bonus = analysis_score_bonus['scoring_dice'];
        const non_scoring_dice_from_bonus = analysis_score_bonus['non_scoring_dice'];
    
        const analysis_score_std = this.analyse_standard_score(non_scoring_dice_from_bonus);
        const score_std = analysis_score_std['score'];
        const scoring_dice_from_std = analysis_score_std['scoring_dice'];
        const non_scoring_dice_from_std = analysis_score_std['non_scoring_dice'];
    
        // the occurrence list of scoring dice value is the sum from scoring dice by bonus and standard rules
        const array_scoring_value_occurences = Array(this.NB_DICE_SIDES);
        array_scoring_value_occurences.fill(0);
    
        let side_value_index = 0;
    
        while(side_value_index < this.NB_DICE_SIDES) {
            array_scoring_value_occurences[side_value_index] = 
                scoring_dice_from_bonus[side_value_index] + scoring_dice_from_std[side_value_index];
            side_value_index++;
        }
    
        return {
            'score': score_std + score_bonus,
            'scoring_dice': array_scoring_value_occurences,
            'non_scoring_dice': non_scoring_dice_from_std
        }
    }

    play() {
        console.log(this.remaining_dice_to_roll)
        const array_value_occurences = this.roll_dices(this.remaining_dice_to_roll);
        const roll_score = this.analyse_score(array_value_occurences);
        this.remaining_dice_to_roll = roll_score["non_scoring_dice"]
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        if(roll_score['score'] === 0) {
            this.roll_again = false;
            const lost_points = this.turn_score;
            this.turn_score = 0;
            return {
                "score":0,
                "remaining_dices":0,
                "lost_points":lost_points
            }
        }

        this.turn_score += roll_score['score'];
        if(this.remaining_dice_to_roll === 0) {
            this.remaining_dice_to_roll = this.DEFAULT_DICES_NB;
        }

        return {
            "score":this.turn_score,
            "remaining_dices":this.remaining_dice_to_roll,
        }
    }

}

