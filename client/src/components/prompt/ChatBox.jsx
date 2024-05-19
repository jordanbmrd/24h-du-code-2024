import {Box, Stack, Text} from "@chakra-ui/react"
import ChatMessage from './ChatMessage.jsx';
import { InputPrompt } from './InputPrompt';
import {useGame} from "../../contexts/GameContext.jsx";
import {useEffect, useRef, useState} from "react";

const ChatBox = () => {
    const messageListRef = useRef();
    const { messages, setMessages, players, getConnectedPlayer, askMessageToLLM } = useGame();

    const [isTypingUsername, setIsTypingUsername] = useState(null);

    useEffect(() => {
        // Scroll to bottom on every message
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }, [messages]);

    const handleNewMessage = async (inputValue) => {
        if (!inputValue.length)
            return;

        setMessages(m => [...m, {content: inputValue, sender: getConnectedPlayer().username}]);

        // Choose a random LLM player as sender
        // TODO: Real LLM profiles
        const llmPlayers = players.filter(player => !player.isPlaying && player.alive);
        const llmPlayer = llmPlayers[Math.floor(Math.random() * (llmPlayers.length - 1))];

        setIsTypingUsername(llmPlayer.username);

        // Generate answer
        const generatedAnswer = await askMessageToLLM(inputValue, llmPlayer.username);

        // Send the message and clear type animation
        setIsTypingUsername(null);
        if (generatedAnswer.length) {
            setMessages(m => [...m, {content: generatedAnswer, sender: llmPlayer.username}]);
        } else {
            // Default message if LLM made a mistake and doesn't send anything
            setMessages(m => [...m, {content: "Bonne question", sender: llmPlayer.username}]);
        }
    }

    return (
        <Box>
            <Box ref={messageListRef} as='div' overflowY={'auto'} border={"2px solid"} background={"header"}
                 borderColor={"border"} borderRadius="10px 10px 0 0" height="300px" padding={"10px"}>
                <Stack direction="column" justifyContent="space-between" alignItems="flex-start" height="100%">
                    <Box>
                        {messages.map((message, i) => (
                            <ChatMessage
                                key={i}
                                content={message.content}
                                sender={message.sender}/>
                        ))}
                    </Box>

                    { isTypingUsername ? (
                        <Text ml={2} fontSize="sm" fontStyle="italic" color="lightgray">{isTypingUsername} est en train d'écrire...</Text>
                    ) : null}
                </Stack>
            </Box>

            <InputPrompt onMessage={handleNewMessage}/>
        </Box>
    );
};

export default ChatBox;