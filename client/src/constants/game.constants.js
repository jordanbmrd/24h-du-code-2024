// This files contains all useful constants for playing game properly

import Time from "./time.constants.js";

const GameState = {
    START: 0,
    READY_TO_PLAY: 1,
    PLAYING: 2,
    WAITING_FOR_VOTE: 3,
    WAITING_FOR_STEER: 4,
    WAITING_FOR_WEREWOLVES: 5,
    VOTE_ENDED: 6,
    STEER_ENDED: 7,
    WON: 8,
    LOSE: 9,
}

const DAY_COLOR = "rgba(222, 249, 249, 0.85)";
const NIGHT_COLOR = "#090c1c";

const getTimeColor = (time) => {
    if (time === Time.DAY) {
        return DAY_COLOR;
    } else {
        return NIGHT_COLOR
    }
}

export { GameState, getTimeColor };