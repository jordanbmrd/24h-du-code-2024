import {Slide, Stack, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const Lose = () => {
    const navigate = useNavigate();

    const handleRestart = () => {
        navigate('/game');
        window.location.reload();
    }

    return (
        <Slide direction="down" in={true}>
            <Stack position="absolute" zIndex={1000} justifyContent="center" alignItems="center" width="100vw" height="100vh" backgroundColor="rgba(0, 0, 0, 1)">
                <Text fontSize="140px" fontFamily="Angel Wish" color="red.500">Éliminé !</Text>
                <Text _hover={{ cursor: "pointer" }} onClick={handleRestart} fontSize="4xl" fontFamily="Angel Wish" color="red.500">Cliquer ici pour relancer</Text>
            </Stack>
        </Slide>
    );
}

export default Lose;