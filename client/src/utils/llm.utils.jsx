// This file contains all useful methods in order to communicate with the Large-Language-Model properly

import { DEFAULT_RULES_CONTEXT, CHAT_RULES_CONTEXT } from '../constants/llm.constants.js';

// An example of context for the LLM
// This context should contain the behovioral instructions for the LLM
/* const context = {
    rules: "Chaque nuit, les loups-garous choisissent une victime à éliminer. Les villageois doivent tenter de les identifier et les éliminer pendant le jour. Le jeu se termine quand tous les loups-garous sont éliminés ou quand ils sont en nombre égal aux villageois.",
    roles: {
        "player1": "hidden role",
        "player2": "hidden role",
        "player3": "hidden role",
        "player4": "VILLAGER",
        "player5": "hidden role"
    },
    previous_actions: [
        {"day": 1, "eliminated": "player6", "method": "vote"},
        {"night": 1, "eliminated": "player7", "method": "wolves"}
    ],
    current_state: {
        "remaining_players": 5,
        "current_suspicions": ["player2 is suspected by player3"],
        "alliances": ["player1 and player4 are allied"]
    },
    objective: "Consider the current suspicions and vote to eliminate a suspected loup-garou. Just answer by the name of the player you want to eliminate.",
};*/

// This method convert the players list stored in GameContext into the
// well-formatted roles object like in the example (on top of file)
const buildRolesContextFromPlayers = (players) => {
    let roles = {};
    players.forEach((player) => {
        roles[player.username] = "hidden role";
    });
    return roles;
}

// This method create the current_state object like in the example (on top of file)
// given the number of rounds and the players list
const buildCurrentStateContext = (rounds, players) => {
    const remainingPlayers = players.filter(player => player.alive).length;
    return {
        remaining_players: remainingPlayers,
        // TODO: "current_suspicions": ["player2 is suspected by player3"],
        // TODO: "alliances": ["player1 and player4 are allied"]
    }
}

// This method build context given the parameters
// - players : List of players with their roles
// - actionsHistory : Actions of the game (eg: { "day": 1, "eliminated": "player1", "method": "vote" })
// - currentState (rounds and players) : Current state of the game (eg: { "remaining_players": 3, "current_suspicions": ["player2 is suspected by player3"], "alliances": ["player3 and player4 are allied"] }
// - objective : What is the role of the LLM ?
const buildContext = (llmRules, players, actionsHistory, rounds) => ({
    rules: llmRules,
    roles: buildRolesContextFromPlayers(players),
    previous_actions: actionsHistory,
    current_state: buildCurrentStateContext(rounds, players),
    objective: "Considère les suspicions actuelles et vote contre un joueur pour éliminer un loup-garou suspecté. Réponds simplement par le nom du joueur que tu souhaites éliminer.",
})

// This method generate the answer to the given question in parameter by calling Mistral API
// It takes in parameters :
// - players : List of players with their roles
// - actionsHistory : Actions of the game (eg: { "day": 1, "eliminated": "player1", "method": "vote" })
// - currentState : Current state of the game (eg: { "remaining_players": 3, "current_suspicions": ["player2 is suspected by player3"], "alliances": ["player3 and player4 are allied"] }
// - objective : What is the role of the LLM ?
// - question : What question do you want the LLM to answer ?
const generatePlayerName = async (players, actionsHistory, rounds) => {
    const apiUrl = import.meta.env.VITE_APP_LLM_API;

    const filteredPlayers = players.filter(player => !player.isPlaying && player.alive);
    const context = buildContext(DEFAULT_RULES_CONTEXT(filteredPlayers), filteredPlayers, actionsHistory, rounds);
    const answer = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            context,
            question: "Choose a player to eliminate.",
        }),
    })
    .then(response => response.json())
    .catch(() => null);

    // If no error, return corresponding player,
    // If it is, just return the first player
    const randomPlayer = players.filter(p => !p.isPlaying && p.alive)[Math.floor(Math.random() * players.length)];
    if (answer) {
        const generatedPlayerName = findPlayerNameInString(players, answer.result);
        if (generatedPlayerName) {
            // Return player selected by the LLM or a random player if the LLM made a mistake
            return players.find(player => player.username === generatedPlayerName) || randomPlayer;
        } else {
            return randomPlayer;
        }
    } else {
        return randomPlayer;
    }
    // For dev only : return players[Math.floor(Math.random() * players.length)];
}

// This method generate an answer for the chat
// The main difference with the function on top is that it takes the question in parameter
const generateChatAnswer = async (authorOfAnswer, players, actionsHistory, rounds, question) => {
    const apiUrl = import.meta.env.VITE_APP_LLM_API;

    const context = buildContext(CHAT_RULES_CONTEXT(players, authorOfAnswer), players, actionsHistory, rounds);
    const answer = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            context,
            question,
        }),
    })
        .then(response => response.json())
        .catch(() => null);

    if (answer) {
        return answer.result
            .replace(/\\/g, "")  // Remove backslashes
            .replace(/"/g, "");  // Remove quotes
    } else {
        return "Bonne question";
    }
}


// Find player name in a sentence
const findPlayerNameInString = (players, inputString) => {
    const words = inputString.match(/\w+/g);

    // Check if any words were found; if none, return an empty string
    if (!words) {
        return null;
    }

    // Check if the username is among the words
    for (let player of players) {
        let username = player.username;
        for (let word of words) {
            if (word.replaceAll("\"", "").replaceAll("\\", "") === username) {
                return username;  // Return the username if found
            }
        }
    }

    // If the username is not found, return a message or an empty string
    return null;
}

export { generatePlayerName, generateChatAnswer };