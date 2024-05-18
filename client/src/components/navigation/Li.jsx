import { Box, Image, Text, useStyleConfig } from '@chakra-ui/react';
import { ChatIcon } from "@chakra-ui/icons"
import PropTypes from "prop-types";
import { useLocation, useNavigate } from 'react-router-dom';

export function Li({ text, image, to }) {
  const location = useLocation();
  const nav = useNavigate();
  
  const styles = useStyleConfig("Li", { variant: undefined });

  return (
    <Box __css={styles} onClick={() => nav(to)}>
      {image && <Image src={image} sx={styles.image}/>}
      <ChatIcon color={"white"}/>
      <Text sx={styles.text}>{text}</Text>
    </Box>
  );
}

Li.propTypes = {
  text: PropTypes.string.isRequired,
  image: PropTypes.string,
  to: PropTypes.string,
};
