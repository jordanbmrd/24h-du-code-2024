import {Box, Spinner} from "@chakra-ui/react"
import DisplayModel3D from "../components/3d-display/DisplayModel3D"
import GameLayout from "../components/layout/GameLayout.jsx"
import {useGame} from "../contexts/GameContext.jsx";
import {get3DModelPathFromRole} from "../utils/game.utils.jsx";
import {useEffect, useMemo, useState} from "react";
import {GameState, getTimeColor} from "../constants/game.constants.js";
import {useNavigate} from "react-router-dom";
import Role from "../constants/roles.constants.js";
import WolfNotification from "../components/layout/WolfNotification.jsx";

export function GameView() {
    const navigate = useNavigate();
    const {
        players,
        time,
        round,
        gameState,
        getConnectedPlayer,
        initializePlayer,
        assignRoles,
        handleNextButton
    } = useGame();

    const [loading, setLoading] = useState(true);
    const [modelsLoading, setModelsLoading] = useState(true);

    useEffect(() => {
        // Retrieve username
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            initializePlayer(storedUsername);
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        // Assign roles if player has been initialized and game is not started
        if (Object.keys(getConnectedPlayer()).length > 0 && round === 0 && gameState === GameState.START) {
            assignRoles();
            setLoading(false);
        }
    }, [players]);

    useEffect(() => {
        const redirectUrl = gameState === GameState.WON ? '/victory' : gameState === GameState.LOSE ? '/lose' : null;
        navigate(redirectUrl);

        processAutoNext();
    }, [gameState]);

    // Automatically trigger next step when needed
    const processAutoNext = () => {
        const connectedPlayer = getConnectedPlayer();

        const triggerNextButtonConditions = gameState === GameState.WAITING_FOR_STEER && connectedPlayer.role !== Role.STEER
            || gameState === GameState.WAITING_FOR_WEREWOLVES && connectedPlayer.role !== Role.WEREWOLF;

        if (triggerNextButtonConditions) {
            handleNextButton();
        }
    }

    // Memoize props for Display3DModel to prevent re-rendering
    const memoized3DModelProps = useMemo(() => {
        return {
            model3D: get3DModelPathFromRole(getConnectedPlayer().role),
            setModelsLoading: setModelsLoading
        };
    }, [getConnectedPlayer().role, setModelsLoading]);

    return (
        <Box display={'flex'} flexDirection={'column'} width={"100%"}>
            { gameState === GameState.READY_TO_PLAY ? <WolfNotification message="Les loups-garous ne vous font pas peur ? Lancez la partie !" isStatic={true} /> : null }

            {/* 3D Model */}
            <Box width={"100%"} height={"100%"} position={"relative"}
                 background={(!loading && !modelsLoading) ? getTimeColor(time) : "black"}
                 transition="background-color 0.5s">
                {/* Loader */}
                {modelsLoading ? (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                        }}
                    >
                        <Spinner color="white"/>
                    </div>
                ) : null}

                <DisplayModel3D {...memoized3DModelProps} />
            </Box>

            {/* Other components */}
            <GameLayout onNextButton={handleNextButton}/>
        </Box>
    );
}