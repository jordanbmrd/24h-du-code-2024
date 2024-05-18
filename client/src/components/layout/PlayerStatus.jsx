import { Box, Text } from '@chakra-ui/react'
import {useGame} from "../../contexts/GameContext.jsx";

const PlayerStatus = () => {
    const { getConnectedPlayer } = useGame();

    return (
        <Box as='div' display={"flex"} flexDirection={"column"}>
            <Box margin={'auto'} display={'flex'} flexDirection={'column'} gap={'5px'}>
                <Box as='div'  padding={'5px'} borderRadius={'10px'}>
                    <Box as='div'>
                        <Text color={"buttonText"}>Pseudo. : {getConnectedPlayer().username}</Text>
                    </Box>
                    <Box as='div'>
                        <Text color={"buttonText"}>Rôle : {getConnectedPlayer().role}</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PlayerStatus;
