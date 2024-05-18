import {Box, Stack, Text} from "@chakra-ui/react";
import {useGame} from "../../contexts/GameContext.jsx";
import {RandomAvatar} from "react-random-avatars";
import {CloseIcon} from "@chakra-ui/icons";

const AlivePlayers = () => {
    const {players, getConnectedPlayer} = useGame();

    return (
        <Stack direction="row" gap={5} wrap="wrap" justifyContent="space-around" alignItems="center"
               padding={"12px 15px 10px 15px"} as='div' width={'100%'} height={'fit-content'} background={"header"}
               borderRadius={15}>
            { /* Display players */}
            {players.map((player, index) => (
                <Box display={"flex"} gap={2} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                     key={index} width={'20%'}>
                    {player.alive ? (
                            <RandomAvatar name={player.username} size={50}/>)
                        : (
                            <CloseIcon padding={2} fontSize={50} color="red"/>
                        )}
                    <Stack direction="column" justifyContent="center" alignItems="center" gap={0}>
                        <Text
                            color={"textPrimary"}
                            fontWeight={player.username === getConnectedPlayer().username ? "bold" : "unset"}>
                            {player.username}
                        </Text>
                        { !player.alive ? (
                            <Text as="span" color="white" fontSize="xs">({player.role})</Text>
                        ) : null }
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
};

export default AlivePlayers;