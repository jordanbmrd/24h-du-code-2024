import PlayerStatus from './PlayerStatus.jsx';
import AlivePlayers from './AlivePlayers.jsx';
import {Box, Button, Collapse, Stack, Text} from '@chakra-ui/react'
import ChatBox from '../prompt/ChatBox';
import {useGame} from "../../contexts/GameContext.jsx";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import Time from "../../constants/time.constants.js";
import {MessageType} from "../../constants/messages.constants.js";
import PropTypes from "prop-types";
import {GameState} from "../../constants/game.constants.js";
import {getNextButtonTextFromGameState} from "../../utils/game.utils.jsx";
import PlayerSelectionModal from "../modals/PlayerSelectionModal.jsx";
import WelcomeMessage from "./WelcomeMessage.jsx";

const GameLayout = ({onNextButton}) => {
    const {time, gameState, gameMessages, loading} = useGame();

    return (
        <>
            <Stack direction="column" position={'absolute'} zIndex={1} left={3} bottom={3} width="400px">
                { /* Welcome Message */ }
                <WelcomeMessage />

                { /* Display ChatBox only if it's time of vote */}
                <Collapse in={gameState === GameState.WAITING_FOR_VOTE} animateOpacity>
                    <ChatBox/>
                </Collapse>

                { /* Alive players */ }
                <AlivePlayers/>
            </Stack>

            <Stack as='div'
                   direction="column"
                   position="absolute"
                   zIndex={1}
                   bottom={3}
                   right={3}>
                { /* Display game messages */}
                <Stack direction="column">
                    {gameMessages.slice(-10).map((message, i) => (
                        <FormattedMessage key={i} message={message}/>
                    ))}
                </Stack>

                <Stack
                    as='div'
                    marginTop={5}
                    paddingBlock={"10px"}
                    paddingInline={"30px"}
                    width="fit-content"
                    borderRadius={15}
                    background={"primary"}
                    direction={"row"}
                    justifyContent={"center"}
                    alignItems={'center'}
                    gap={'50px'}
                >
                    <PlayerStatus/>

                    { /* Day or Night */}
                    <Box as='div' display={'flex'} alignItems={'center'} gap={'5px'}>
                        {time === Time.DAY ? <SunIcon color={'premiumButton'}/> :
                            <MoonIcon boxSize={6} color={'white'}/>}
                        <Text color={"textPrimary"}>
                            {time}
                        </Text>
                    </Box>

                    { /* 'Next' button */}
                    {gameState !== GameState.START ? (
                        <Button isLoading={loading} variant={"main"} height={"40px"} width={"160px"} backgroundColor={"buttonBackground"}
                                color={'textPrimary'} onClick={onNextButton}>
                            {getNextButtonTextFromGameState(gameState)}
                        </Button>
                    ) : null}
                </Stack>
            </Stack>

            { /* Keep this line to allow the modal to open */}
            <PlayerSelectionModal/>
        </>
    );
};

GameLayout.propTypes = {
    onNextButton: PropTypes.func.isRequired,
};

// Format game message with the appropriate style
// Red for error messages
// Italic for waiting messages
// Nothing special for others
const FormattedMessage = ({message}) => {
    return message.type === MessageType.ERROR ? (
        <Text as="span" color="red" fontSize={16}>&nbsp;&nbsp;➣&nbsp;{message.content}</Text>
    ) : message.type === MessageType.WAITING ? (
        <Text as="span" fontStyle="italic" color="white" fontSize={16}>&nbsp;&nbsp;➣&nbsp;{message.content}</Text>
    ) : (
        <Text as="span" color="white" fontSize={16}>&nbsp;&nbsp;➣&nbsp;{message.content}</Text>
    );
}

FormattedMessage.propTypes = {
    message: PropTypes.shape({
        type: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired
};

export default GameLayout;