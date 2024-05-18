import {Box, Stack, Text} from "@chakra-ui/react";
import {useGame} from "../../contexts/GameContext.jsx";

const WelcomeMessage = () => {
    const { welcomeMessageVisible, setWelcomeMessageVisible } = useGame();

    return welcomeMessageVisible ? (
        <Stack direction="column" wrap="wrap" justifyContent="center" alignItems="center" padding={"12px 15px 10px 15px"} as='div' width={'100%'} height={'fit-content'} background={"header"} borderRadius={15} position="relative">
            <Text as="h4" fontSize="4xl" color="red.300" fontFamily="Angel Wish">Bienvenue !</Text>
            <Text as="p" color="white" textAlign="center">
                Cette interface vous permet de joueur au loup-garou.<br/>
                <br/>
                Les joueurs dans votre partie se situe juste en dessous de ce message. Vous pourrez voir s'ils sont
                morts à cet endroit.<br/>
                Les informations du jeu s'afficheront sur la droite de votre écran.<br/>
                <br/>
                Lorsque vous vous sentirez prêt, cliquez sur 'Commencer' en bas à droite de votre écran.<br/>
                <br/>
                Prêt ? Lancez la partie !
            </Text>

            <Box onClick={() => setWelcomeMessageVisible(false)} position="absolute" top={3} right={5} _hover={{ cursor: "pointer", transform: "scale(1.1)" }} padding={1}>
                <Text fontSize="xl" color="white">&times;</Text>
            </Box>
        </Stack>
    ) : null;
}

export default WelcomeMessage;