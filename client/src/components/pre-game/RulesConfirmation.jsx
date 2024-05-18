import { useRef } from 'react';
import { Box, Text, Button, Image } from '@chakra-ui/react';

const RulesConfirmation = ({ onConfirm }) => {
    const boxRef = useRef(null);

    return (
        <Box ref={boxRef} p="4" display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" position="relative">
            <Image src="/backgroundEyes.gif" position="absolute" top="0" left="50%" transform="translateX(-50%) rotate(-20deg)" zIndex={0} />
            <Image src="/backgroundEyes.gif" position="absolute" bottom="20" left="50%" transform="translateX(-50%)" zIndex={0} />
            <Box margin="auto" textAlign="center" zIndex={1} bg="overlay" borderRadius="15" p="20px">
                <Text color="textPrimary" fontSize="xl" mb="4">Bienvenue sur LoupGarou.AI</Text>
                <Text color="textPrimary" fontSize="xl" mb="4">Ce jeu a pour but de reproduire le jeu "Les Loups-garous de Thiercelieux"</Text>
                <Text color="textPrimary" fontSize="xl" mb="4">Nous vous souhaitons un agréable moment sur notre plateforme.</Text>
                <Text color="textPrimary" fontSize="xl" mb="4">Cette plateforme est en Alpha, en cas de soucis merci de nous contacter.</Text>
                <Button onClick={onConfirm} bg="buttonBackground">Compris !</Button>
            </Box>
        </Box>
    );
};

export default RulesConfirmation;
