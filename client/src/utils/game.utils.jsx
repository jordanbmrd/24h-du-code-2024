// This file contains all useful methods for playing game properly

import Role from "../constants/roles.constants.js";
import {GameState} from "../constants/game.constants.js";
import {names, uniqueNamesGenerator} from "unique-names-generator";
import VoteType from "../constants/vote-types.constants.js";

// This method generate players with random information
const generateRandomPlayers = () => {
    let randomPlayers = [];

    const nameGeneratorConfig = {
        dictionaries: [names],
        length: 1,
    };

    for (let i = 0; i < 7; i++) {
        randomPlayers.push({
            username: uniqueNamesGenerator(nameGeneratorConfig),
            role: undefined,
            alive: true,
            currentRound: {
                [VoteType.PLAYER_VOTES]: 0,
                [VoteType.WEREWOLF_VOTES]: 0,
            },
        });
    }

    return randomPlayers;
}

const get3DModelPathFromRole = (role) => {
    let modelValue;
    switch (role) {
        case Role.WEREWOLF:
            modelValue = {
                path: "/3DModels/werewolf/scene.gltf",
                size: {
                    x: 30, y: 30, z: 30,
                }
            };
            break;
        case Role.STEER:
            modelValue = {
                path: "/3DModels/witch/scene.gltf",
                size: {
                    x: 100, y: 100, z: 100,
                }
            };
            break;
        case Role.VILLAGER:
            modelValue = {
                path: "/3DModels/villager/scene.gltf",
                size: {
                    x: 100, y: 100, z: 100,
                }
            };
            break;
        default:    // Shouldn't be called, Villager model by default
            modelValue = {
                path: "/3DModels/villager/scene.gltf",
                size: {
                    x: 100, y: 100, z: 100,
                }
            };
            break;
    }

    return modelValue;
}

const getNextButtonTextFromGameState = (gameState) => {
    let message;

    switch (gameState) {
        case GameState.READY_TO_PLAY:
            message = 'Commencer';
            break;
        case GameState.WAITING_FOR_VOTE:
            message = 'Voter';
            break;
        default:
            message = 'Suivant';
            break;
    }

    return message;
}

export { generateRandomPlayers, get3DModelPathFromRole, getNextButtonTextFromGameState };
