import PropTypes from 'prop-types';
import {Avatar, AvatarBadge, Box, Stack, Text} from '@chakra-ui/react'
import { MoonIcon } from "@chakra-ui/icons"

const ChatMessage = ({ content, sender }) => (
    <Stack direction={"row"} alignItems={"flex-start"} padding={"10px"} gap={"15px"}>
        <Avatar size={"xs"} marginTop={1}>
            <AvatarBadge boxSize='1em' bg='green.500' />
        </Avatar>

        <Box>
            <Box display={'flex'} alignItems={'center'} gap={'7px'}>
                <Text color={"textPrimary"}>
                    { sender }
                </Text>
                <MoonIcon boxSize={3} color={"premiumButton"}/>
            </Box>

            <Text color={"textSecondary"}>
                { content }
            </Text>
        </Box>
    </Stack>
);

ChatMessage.propTypes = {
    content: PropTypes.string,
    sender: PropTypes.string,
};

export default ChatMessage;