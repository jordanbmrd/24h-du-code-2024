import {createContext, useContext, useEffect, useState} from 'react';
import Time from "../constants/time.constants.js";
import {MessageType} from "../constants/messages.constants.js";
import Role from "../constants/roles.constants.js";
import {GameState} from "../constants/game.constants.js";
import PropTypes from "prop-types";
import VoteType from "../constants/vote-types.constants.js";
import {generate} from "../utils/llm.utils.jsx";
import {generateRandomPlayers} from "../utils/game.utils.jsx";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    // Related to game
    const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(true);

    // Necessary game data
    const [loading, setLoading] = useState(false);    // Used for display the loading while generating
    const [actionsHistory, setActionsHistory] = useState([]);
    const [players, setPlayers] = useState(generateRandomPlayers());
    const [gameState, setGameState] = useState(GameState.START); // State of the game
    const [round, setRound] = useState(0); // 0 = Game not started yet
    const [time, setTime] = useState(Time.NIGHT); // Time.NIGHT by default
    const [gameMessages, setGameMessages] = useState([
        {
            content: "En attente du lancement de la partie.",
            type: MessageType.NORMAL,
        }
    ]);
    const [playerSelectionOpen, setPlayerSelectionOpen] = useState(false);

    // Chat information
    const [messages, setMessages] = useState([
        {
            content: "Initial message",
            sender: "Server"
        }
    ]);

    // useEffect actions
    useEffect(() => {
        if (gameState === GameState.STEER_ENDED) {
            // After steer choosed a player, continue night phase
            continueNightPhase();
        }
    }, [gameState, players]);

    // Utils methods

    // This method returns the currently playing player
    const getConnectedPlayer = () => {
        return players.find(p => p.isPlaying) || {};
    }

    // This method creates a player object and insert it in the players state
    const initializePlayer = (username) => {
        setPlayers(prevPlayers => [
            ...prevPlayers,
            {
                username,
                role: undefined,
                isPlaying: true,
                alive: true,
                currentRound: {
                    [VoteType.PLAYER_VOTES]: 0,
                    [VoteType.WEREWOLF_VOTES]: 0,
                }
            }
        ]);
    };

    // This method gives a role to each player (assuming there is 8 players)
    // It should be called on start of the game
    const assignRoles = () => {
        const numPlayers = players.length;
        const numWerewolves = Math.max(2, Math.floor(numPlayers / 3)); // 2 werewolves
        const numVillagers = numPlayers - numWerewolves - 1; // 1 for the seer

        const rolesToAssign = [
            Role.STEER,
            ...Array(numWerewolves).fill(Role.WEREWOLF),
            ...Array(numVillagers).fill(Role.VILLAGER)];

        const shuffledRoles = rolesToAssign.sort(() => Math.random() - 0.5);

        const updatedPlayers = players.map((player, index) => ({
            ...player,
            role: shuffledRoles[index],
        }));

        setPlayers(updatedPlayers);
        setGameState(GameState.READY_TO_PLAY);    // Roles assigned, set ready to play !
    }

    // This method starts or continue the game, it should be called AFTER initializePlayer and assignRoles
    const startNextRound = () => {
        if (!isGameOver()) {
            resetCurrentRoundValues();
            setRound(round => round + 1);
            startNightPhase();

            // The day phase will be triggered by the 'Next' button (cf. handleNextButton() method)
        } else {
            // The game is over, end it
            const connectedPlayer = getConnectedPlayer();
            if (getWinnerRoles().includes(connectedPlayer.role)) {
                setGameState(GameState.WON);
            } else {
                setGameState(GameState.LOSE);
            }
        }
    }

    // This method starts night phase
    // Night phase (first part) includes :
    // - Steer is asked to choose a player to see its role
    const startNightPhase = () => {
        setTime(Time.NIGHT);
        broadcastSeparator();

        // Steer action
        broadcastMessage(
            "Il est l'heure pour la voyante de se réveiller.",
            MessageType.NORMAL
        );

        broadcastMessage(
            "La voyante choisit un joueur.",
            MessageType.WAITING
        );

        // TODO: Process the steer action for the LLM

        setGameState(GameState.WAITING_FOR_STEER);
    }

    // This method continues night phase
    // Night phase (second part) includes :
    // - Werewolves are asked to vote for a player to kill
    const continueNightPhase = () => {
        broadcastMessage(
            "Le rôle d'un joueur a été révélé à la voyante.",
            MessageType.NORMAL,
        );

        delay(() => {
            // Werewolf action
            broadcastMessage(
                "Il est l'heure pour les loups-garous de se réveiller.",
                MessageType.NORMAL,
            );

            broadcastMessage(
                "Les loups-garous choisissent un joueur.",
                MessageType.WAITING
            );

            setGameState(GameState.WAITING_FOR_WEREWOLVES);
        });
    }

    // Last part of night phase
    // It just process the wolf vote for other players and end the night phase
    const endNightPhase = async () => {
        // Process the votes for each other wolves
        setLoading(true);
        for (const player of players) {
            if (!player.isPlaying && player.role === Role.WEREWOLF) {
                const selectedPlayer = await generateAnswer("Choose a player to eliminate.");
                voteForPlayer(selectedPlayer, VoteType.WEREWOLF_VOTES);
            }
        }
        setLoading(false);

        broadcastMessage(
            "Les loups-garous ont choisi leur cible.",
            MessageType.NORMAL,
        );

        setGameState(GameState.PLAYING);
    }

    // This method starts day phase
    // Day phase (first part) includes :
    // - Broadcast who was killed by the werewolves
    // - Vote from everyone on someone to kill (the chat should be displayed)
    const startDayPhase = () => {
        setTime(Time.DAY);
        broadcastSeparator();

        broadcastMessage("Le jour se lève !", MessageType.NORMAL);

        delay(() => {
            // Kill and broadcast who was killed by the werewolves
            killMostVotedPlayer(VoteType.WEREWOLF_VOTES);

            delay(() => {
                broadcastMessage("Les joueurs vont maintenant voter pour éliminer quelqu'un.", MessageType.NORMAL);
                broadcastMessage("Vous pouvez voter.", MessageType.WAITING);
                // Ready to get votes and broadcast the killed player
                setGameState(GameState.WAITING_FOR_VOTE);
            });
        });
    }

    // This method continues day phase
    // It should only be called after vote phase
    // Day phase (second part) includes :
    // - Role revelation from the killed one
    const continueDayPhase = async () => {
        // For every other player, do the vote
        setLoading(true);
        for (const player of players) {
            console.log("generateAnswer for " + player.username + " (" + player.role + ")");
            if (!player.isPlaying) {
                const selectedPlayer = await generateAnswer("Choose a player to eliminate.");
                console.log(actionsHistory, selectedPlayer);
                voteForPlayer(selectedPlayer, VoteType.PLAYER_VOTES);
            }
        }
        setLoading(false);

        broadcastMessage("Tous les joueurs ont voté.", MessageType.NORMAL);

        killMostVotedPlayer(VoteType.PLAYER_VOTES);

        // Get back to playing game state
        setGameState(GameState.PLAYING);
    }

    // This method should be called on click on 'Next' button
    // The 'Next' button is the action button
    // It can :
    // - Open the dialog for vote
    // - Mark the user as ready for next step (switch to day/night)
    // Action triggered depends on current GameState
    const handleNextButton = () => {
        const connectedPlayer = getConnectedPlayer();

        // This switch handles all situations that 'Next' button have to trigger
        switch(gameState) {
            case GameState.READY_TO_PLAY:
                // Game not started yet, start game !
                setGameState(GameState.PLAYING);
                setWelcomeMessageVisible(false);
                startNextRound();
                break;
            case GameState.PLAYING:
                // Game is started, launch next step
                if (time === Time.DAY) {
                    startNextRound();
                }
                else if (time === Time.NIGHT) {
                    startDayPhase();
                }
                break;
            case GameState.WAITING_FOR_VOTE:
                // Waiting for vote, open dialog
                setPlayerSelectionOpen(true);
                break;
            case GameState.WAITING_FOR_STEER:
                // Wait for the steer to vote
                if (connectedPlayer.role === Role.STEER) {
                    setPlayerSelectionOpen(true);
                } else {
                    delay(continueNightPhase);
                }
                break;
            case GameState.WAITING_FOR_WEREWOLVES:
                // Wait for the wolf to vote
                if (connectedPlayer.role === Role.WEREWOLF) {
                    setPlayerSelectionOpen(true);
                } else {
                    endNightPhase();
                }
                break;
        }
    }

    // This method determine if the game is over.
    // A game is considered as over if there is no more Villager or no more Werewolf
    const isGameOver = () => {
        const remainingRoles = players.filter(player => player.alive).map(player => player.role);
        return !remainingRoles.includes(Role.VILLAGER) || !remainingRoles.includes(Role.WEREWOLF);
    }

    // This method return the winner role
    const getWinnerRoles = () => {
        const remainingRoles = players.filter(player => player.alive).map(player => player.role);
        if (!remainingRoles.includes(Role.VILLAGER)) {
            return [Role.WEREWOLF];
        } else if (!remainingRoles.includes(Role.WEREWOLF)) {
            return [Role.VILLAGER, Role.STEER];
        }
    }

    // This method adds a vote against a player
    // 'type' parameter means the type of vote to add
    // 'type' parameter should be choosed from the VoteType enum
    const voteForPlayer = (player, type) => {
        const updatedPlayers = players.map(p => p.username === player.username ? ({
            ...player,
            currentRound: {
                ...player.currentRound,
                [type]: player.currentRound[type] + 1,
            }
        }) : p);

        setPlayers(() => updatedPlayers);
    }

    // This method kills the player with the most votes
    // It takes in parameter the VoteType
    const killMostVotedPlayer = (type) => {
        console.log("killing with these :::", players);
        const mostVotedPlayer = players.reduce((player, comparedPlayer) => player.currentRound[type] > comparedPlayer.currentRound[type] ? player : comparedPlayer);
        killPlayer(mostVotedPlayer, type);

        let message;
        switch(type) {
            case VoteType.PLAYER_VOTES:
                message = `${mostVotedPlayer.username} a été tué suite aux votes ! Il/Elle était ${mostVotedPlayer.role}.`;
                break;
            case VoteType.WEREWOLF_VOTES:
                message = `${mostVotedPlayer.username} a été tué par les loups-garous ! Il/Elle était ${mostVotedPlayer.role}.`;
                break;
        }

        broadcastMessage(
            message,
            MessageType.NORMAL,
        );
    }

    // This method kills the given player in parameter.
    // 'from' parameter means the type of vote from where the player was killed
    // 'from' should be choosed from VoteType enum
    const killPlayer = (player, from) => {
        const updatedPlayers = players.map(p => p.username === player.username ? ({
            ...player,
            alive: false,
            killedRound: round,
            killedFrom: from,
        }) : p);

        // Save killed player in history
        setActionsHistory(actionsHistory => [...actionsHistory, {
            [time]: round,
            eliminated: player.username,
            method: from,
        }]);
        // Update players list
        setPlayers(updatedPlayers);
    }

    // Reveal the role of a player after the steer selected a player
    const revealRole = (player) => {
        broadcastMessage(
            `Le rôle de ${player.username} est ${player.role}`,
            MessageType.NORMAL,
        );

        setGameState(GameState.STEER_ENDED);
    }

    // This method displays a separator for game messages
    const broadcastSeparator = () => {
        setGameMessages(messages => [...messages, {
            content: "====================",
            type: MessageType.NORMAL,
        }])
    }

    // This method broadcasts a message in game messages
    const broadcastMessage = (content, type) => {
        let prefix = "";
        switch (type) {
            case MessageType.WAITING:
                prefix = "Attente : ";
                break;
            case MessageType.ERROR:
                prefix = "Erreur : ";
                break;
            default:
                break;
        }
        setGameMessages(messages => [...messages, {
            content: `${prefix}${content}`,
            type,
        }]);
    }

    // This method resets the values for the current round
    // It includes :
    // - Player Votes
    // - Werewolf votes
    const resetCurrentRoundValues = () => {
        setPlayers(players => players.map(player => ({
            ...player,
            currentRound: {
                [VoteType.PLAYER_VOTES]: 0,
                [VoteType.WEREWOLF_VOTES]: 0,
            }
        })))
    }

    // This method delay by 1 second an action
    // Just to make the game longer but not necessary
    const delay = (callback) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            callback();
        }, 1000);
    }

    // This method call the generate method located in llm.utils.jsx
    // It generate the answer to the given question in parameter
    const generateAnswer = async (question) => {
        return await generate(players, actionsHistory, round, question);
    }

    useEffect(() => console.log(players), [players]);

    // Exported values and methods
    const values = {
        players,
        gameState,
        round,
        time,
        messages,
        gameMessages,
        playerSelectionOpen,
        loading,
    };
    const methods = {
        setMessages,
        getConnectedPlayer,
        initializePlayer,
        assignRoles,
        handleNextButton,
        setPlayerSelectionOpen,
        voteForPlayer,
        revealRole,
        continueDayPhase,
        endNightPhase,
        welcomeMessageVisible,
        setWelcomeMessageVisible,
    }

    return (
        <GameContext.Provider value={{
            ...values,
            ...methods,
        }}>
            {children}
        </GameContext.Provider>
    );
};

GameProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useGame = () => useContext(GameContext);
