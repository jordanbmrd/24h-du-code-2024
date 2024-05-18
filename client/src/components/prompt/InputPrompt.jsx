import React from 'react';
import { Input, InputGroup, InputLeftElement, Box, Image } from '@chakra-ui/react';

export function InputPrompt({ onMessage }) {
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        // Check if 'Enter' key is pressed
        if (event.key === 'Enter') {
            onMessage(inputValue);

            setInputValue('');
        }
    };

    return (
        <Box as='div' background={"header"}>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Image src="/sendMessage.svg" />
                </InputLeftElement>
                <Input
                    color={"textPrimary"}
                    type='text'
                    placeholder='Discuter avec le village'
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </InputGroup>
        </Box>
    );
}