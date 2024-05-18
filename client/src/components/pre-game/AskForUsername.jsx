import {useState, useRef, useEffect} from 'react';
import {Box, Input, Button, Text, Image} from '@chakra-ui/react';
import {useGame} from "../../contexts/GameContext.jsx";
import {useNavigate} from "react-router-dom";

const AskForUsername = () => {
    const navigate = useNavigate();
    const {initializePlayer} = useGame();

    const [username, setUsername] = useState("");
    const formRef = useRef(null);

    const handleRedirectToGame = () => {
        if (username.length) {
            initializePlayer(username); // Create player and save it into game state
            localStorage.setItem("username", username);
            navigate("/game");
        }
    }

    return (
        <Box position="relative" display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <Image src='/backgroundUsername.gif' position="absolute" width="100%" height="100%" objectFit="cover"/>
            <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="rgba(0, 0, 0, 0.85)"/>
            <Box ref={formRef} display="flex" flexDirection="column" gap="10px" width="50%" margin="auto" bg="overlay"
                 borderRadius="15" p="20px" zIndex="1">
                <Text fontSize="28px" color="textPrimary" fontWeight={700}>Entrez votre nom</Text>
                <Input
                    placeholder="Nom"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    borderColor="buttonBackground"
                    _hover={{borderColor: 'buttonBackground'}}
                    _focus={{borderColor: 'buttonBackground', boxShadow: 'none'}}
                    size="lg"
                    width="100%"
                    borderRadius="5px"
                    height="50px"
                    color="buttonText"
                />
                <Button onClick={handleRedirectToGame}
                        bg="buttonBackground" color="textPrimary" width="100%">
                    Confirmer
                </Button>
            </Box>
        </Box>
    );
};

export default AskForUsername;
