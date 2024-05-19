import { Box, Image, Stack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const WolfNotification = ({ message, isStatic=false}) => {
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        if (message && !isStatic) {
            const timer = setTimeout(() => {
                setAnimateOut(true);
            }, 9000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <Stack
            zIndex={1500}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={isStatic ? 8 : 20}
            position="absolute"
            top={isStatic ? 30 : 60}
            right={isStatic ? 10 : 20}
            sx={{
                animation: animateOut ? 'slideOutToRight 0.5s ease-out forwards' : 'slideInFromRight 0.5s ease-out forwards',
                '@keyframes slideInFromRight': {
                    from: { opacity: 0, transform: 'translateX(100%)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                },
                '@keyframes slideOutToRight': {
                    from: { opacity: 1, transform: 'translateX(0)' },
                    to: { opacity: 0, transform: 'translateX(100%)' }
                }
            }}>
            {message ? (
                <Text
                    _hover={{
                        transform: "scale(1.025)",
                        transitionDuration: "0.3s",
                        cursor: "pointer",
                    }}
                    sx={{
                        transitionDuration: "0.2s",
                        position: 'relative',
                        maxWidth: '30em',
                        backgroundColor: 'rgb(31, 31, 31)',
                        color: 'white',
                        padding: '0.75em 1.5em',
                        fontSize: '1em',
                        borderRadius: '1rem',
                        boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            left: '100%',
                            top: '50%',
                            transform: 'translateX(-10%) translateY(-50%) rotateY(180deg)',
                            border: '.75rem solid transparent',
                            borderLeft: 'none',
                            borderRightColor: 'rgb(31, 31, 31)',
                            filter: 'drop-shadow(-0.0625rem 0 0.0625rem rgba(0, 0, 0, 0.1))',
                        }
                    }}>
                    {message}
                </Text>
            ) : null}
            <Box gap={3} boxSize="40px" _hover={{ transform: "rotate(15deg)", transitionDuration: "0.5s", cursor: "pointer" }} transitionDuration="0.5s">
                <Image src="favicons/android-chrome-512x512.png" alt="Werewolf" />
            </Box>
        </Stack>
    );
}

WolfNotification.propTypes = {
    message: PropTypes.string,
}

export default WolfNotification;
