import { Box, Divider, Text, Image, Button, Avatar, AvatarBadge } from '@chakra-ui/react';
import { AddIcon, MoonIcon } from "@chakra-ui/icons"
import { Li } from './Li';
import {useGame} from "../../contexts/GameContext.jsx";

export function Sidebar() {
    const { getConnectedPlayer } = useGame();

    return (
        <Box as='div' minWidth={'300px'} paddingInline={"10px"} height={"100vh"} background={"header"}>
            <Box as='div' display={'flex'} gap={"20px"} flexDirection={"column"} height={"100%"}>
                <Box as='div' display={'flex'} alignItems={'center'} height={"20%"}>
                    <Image src='/logo.png' alt='Logo' width={"64px"} textAlign={"center"}/>
                    <Text fontSize={'x-large'} color={"textPrimary"} fontWeight={700}>LoupGarou.AI</Text>
                </Box>
                <Divider width={"20%"} margin={"auto"} borderRadius={300}/>
                <Button variant={"main"} background={"buttonBackground"} color={"buttonText"}     marginLeft={"10px"} leftIcon={<AddIcon/>}>Nouvelle Partie</Button>
                <Box as="div" display={"flex"} gap={"20px"} height={"60%"} flexDirection={"column"} marginLeft={"10px"}>
                    <Li text={"Loup Garou Game"} to={"/"}/>
                    <Li text={"Loup Garou Game"} />
                    <Li text={"Loup Garou Game"} />
                    <Li text={"Loup Garou Game"} />
                    <Li text={"Loup Garou Game"} />
                    <Li text={"Loup Garou Game"} />
                    <Li text={"Loup Garou Game"} />
                </Box>
                <Box as='div' display={'flex'} flexDirection={"column"} marginLeft={"10px"} height={"20%"}>
                    <Box as='div' display={"flex"} alignItems={"flex-end"}  width={"80%"} paddingBottom={"10px"}>
                        <Box as='div' display={"flex"} alignItems={"center"} border={"1px solid"} borderColor={"premiumButton"} background={"premiumButton"} height={"45px"} gap={"10px"} width={"100%"} borderRadius={"25px"} padding={"5px"} >
                            <MoonIcon width={"40px"}/>
                            <Text fontSize={'large'} color={"premiumButtonText"} fontWeight={700}>Pass Alpha</Text>
                        </Box>
                    </Box>
                    <Box as='div' display={"flex"} alignItems={"flex-end"}  width={"80%"} paddingBottom={"10px"}>
                        <Box as='div' display={"flex"} alignItems={"center"} border={"1px solid"} borderColor={"buttonText"} height={"45px"} gap={"10px"} width={"100%"} borderRadius={"25px"} padding={"5px"}>
                            <Avatar size={"sm"}>
                                <AvatarBadge boxSize='1em' bg={getConnectedPlayer().username ? 'green.500' : 'red.500'} />
                            </Avatar>
                            <Text fontSize={'medium'} color={"textSecondary"} fontWeight={700}>{ getConnectedPlayer().username ?? "Hors-ligne" }</Text>
                        </Box>
                    </Box>
                </Box>
                
            </Box>
            
        </Box>
    );
}