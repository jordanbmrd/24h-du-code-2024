// This file contains all useful methods in order to communicate with the Large-Language-Model properly

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
const buildContext = (players, actionsHistory, rounds) => ({
    rules: "YOU ARE THE WORLD'S BEST STRATEGY ANALYST FOR THE GAME \"LES LOUPS-GAROUS DE THIERCELIEUX,\" RECOGNIZED FOR YOUR ABILITY TO ANALYZE GAME STATES AND MAKE THE MOST LOGICAL AND STRATEGIC DECISIONS. YOUR TASK IS TO REVIEW THE PROVIDED GAME CONTEXT AND IDENTIFY THE MOST SUSPECT PLAYER TO ELIMINATE.\n" +
        "\n" +
        "**Key Objectives:**\n" +
        "- REVIEW THE CURRENT GAME STATE, INCLUDING REMAINING PLAYERS, SUSPICIONS, AND ALLIANCES.\n" +
        "- ANALYZE THE SUSPECT LIST AND CHOOSE THE MOST LOGICAL PLAYER TO ELIMINATE.\n" +
        "- PROVIDE A CLEAR AND CONCISE DECISION BY RETURNING ONLY THE NAME OF THE PLAYER TO BE ELIMINATED.\n" +
        "\n" +
        "**Chain of Thoughts:**\n" +
        "1. **Review Game Rules and Context:**\n" +
        "   - Understand the rules of \"Les Loups-Garous de Thiercelieux.\"\n" +
        "   - Familiarize yourself with the current game state, remaining players, suspicions, and alliances.\n" +
        "\n" +
        "2. **Make a Strategic Decision:**\n" +
        "   - Based on the analysis, identify the player with the highest suspicion.\n" +
        "   - Choose the player who is most likely to be a loup-garou according to the current suspicions and alliances.\n" +
        "\n" +
        "3. **Provide the Decision:**\n" +
        "   - Return the name (ONLY THE NAME) of the player to be eliminated without additional context or explanations.\n" +
        "\n" +
        "**What Not To Do:**\n" +
        "- DO NOT PROVIDE A GENERIC OR NON-COMMITTAL RESPONSE.\n" +
        "- DO NOT RETURN ANYTHING OTHER THAN THE NAME OF THE PLAYER TO BE ELIMINATED.\n" +
        "- DO NOT IGNORE THE CURRENT SUSPICIONS AND ALLIANCES IN THE ANALYSIS.\n" +
        "- DO NOT PROVIDE PERSONAL OPINIONS OR IRRELEVANT INFORMATION.\n" +
        "\n" +
        "**Example Response:**\n" +
        + players[0].username + "\n",
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
const generate = async (players, actionsHistory, rounds, question) => {
    const apiUrl = import.meta.env.VITE_APP_LLM_API;

    const context = buildContext(players, actionsHistory, rounds);
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

    // If no error, return corresponding player,
    // If it is, just return the first player
    const generatedPlayerName = findPlayerNameInString(players, answer.result);
    console.log(generatedPlayerName, answer.result);
    const randomPlayer = players[Math.floor(Math.random() * (players.length) + players.length)];
    if (generatedPlayerName) {
        // Return player selected by the LLM or a random player if the LLM made a mistake
        return players.find(player => player.username === generatedPlayerName) || randomPlayer;
    } else {
        return randomPlayer;
    }
    // For dev only : return players[Math.floor(Math.random() * (players.length - 0) + players.length)];
}

const findPlayerNameInString = (players, inputString) => {
    const words = inputString.match(/\w+/g);
    console.log(words);

    // Check if any words were found; if none, return an empty string
    if (!words) {
        return null;
    }

    // Check if the username is among the words
    for (let player of players) {
        let username = player.username;
        for (let word of words) {
            if (word === username) {
                return username;  // Return the username if found
            }
        }
    }

    // If the username is not found, return a message or an empty string
    return null;
}

export { generate };