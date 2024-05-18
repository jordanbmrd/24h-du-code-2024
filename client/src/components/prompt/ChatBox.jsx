import { Box } from "@chakra-ui/react"
import ChatMessage from './ChatMessage.jsx';
import { InputPrompt } from './InputPrompt';
import {useGame} from "../../contexts/GameContext.jsx";
import {useEffect, useRef} from "react";

const ChatBox = () => {
    const messageListRef = useRef();

    const { messages, setMessages, getConnectedPlayer } = useGame();

    useEffect(() => {
        // Scroll to bottom on every message
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }, [messages]);

    const handleNewMessage = async (inputValue) => {
        setMessages(m => [...m, {content: inputValue, sender: getConnectedPlayer().username}]);

        /*const result = await fetch(import.meta.env.VITE_APP_API + '/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({context: "Alors que nous nous rassemblons sur la place du village, la tension règne dans l'air sous la lune. Ce soir, nous devons délibérer sagement pour assurer notre survie. Chers villageois, j'ai observé des comportements étranges que nous devons corriger. \n" +
                    "\n" +
                    "**Observations:** Hier soir, dans un silence inquiétant, j'ai remarqué que [Nomdujoueur] se promenait de façon suspecte à la lisière du village. Ses actions semblaient déplacées, compte tenu des circonstances. Quelles sont les raisons qui pourraient pousser [Nom du joueur] à se trouver là à une heure aussi tardive ?\n" +
                    "\n" +
                    "**Questions à débattre:** Compte tenu de la situation actuelle, devons-nous considérer le comportement de [Nomdujoueur] comme une simple coïncidence, ou pourrait-il y avoir un motif plus sombre derrière tout cela ? Est-ce que quelqu'un d'autre a remarqué des actions similaires, ou est-ce que [Nomdujoueur] peut fournir une explication pour ses déplacements ?\n" +
                    "\n" +
                    "**Appel à l'action:** Discutons calmement et avec détermination. Vos idées et vos observations sont cruciales pour élucider ce mystère. Ensemble, nous pouvons protéger notre village et éradiquer les menaces qui s'y cachent.\n" +
                    "\n" +
                    "N'hésitez pas à nous faire part de vos réflexions et de vos observations. N'oubliez pas que notre unité est notre force et que chaque détail peut être la clé de notre survie.\n", question: chatMessages[chatMessages.length - 1] || ""})
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.result);
                try {
                    if (data.result) {
                        return data.result;
                    }
                } catch (e) {
                    return "Mmmh...";
                }
            })
            .catch((err) => {
                console.error(err);
                throw new Error("Erreur: lors de la communication avec l'IA");
            });
        const filteredPlayers = players.filter(p => p.name !== currentPlayer.name);
        setMessages(m => [...m, {message: result, playerName: filteredPlayers[Math.floor(Math.random() * (filteredPlayers.length - 1))].name}]);
        */
    }

    return (
        <Box>
            <Box ref={messageListRef} as='div' overflowY={'auto'} border={"2px solid"} background={"header"} borderColor={"border"} borderRadius="10px 10px 0 0" height="300px" padding={"10px"}>
                { messages.map((message, i) => (
                    <ChatMessage
                        key={i}
                        content={message.content}
                        sender={message.sender}/>
                )) }
            </Box>

            <InputPrompt onMessage={handleNewMessage}/>
        </Box>
    );
};

export default ChatBox;