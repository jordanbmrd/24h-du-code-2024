import {useState} from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Button,
    Avatar,
    Text,
    Flex,
    HStack, VStack,
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import {useGame} from "../../contexts/GameContext.jsx";
import VoteType from "../../constants/vote-types.constants.js";
import {GameState} from "../../constants/game.constants.js";

const PlayerSelectionModal = () => {
    const {players, setPlayers, gameState, playerSelectionOpen, setPlayerSelectionOpen, voteForPlayer, revealRole, continueDayPhase, endNightPhase} = useGame();

    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleSelect = () => {
        if (selectedPlayer) {
            if (gameState === GameState.WAITING_FOR_VOTE) {
                // Add 1 player vote against the selected player and clear the state
                setPlayers(prevPlayers => voteForPlayer(prevPlayers, selectedPlayer, VoteType.PLAYER_VOTES));
                continueDayPhase();
            } else if (gameState === GameState.WAITING_FOR_STEER) {
                // Reveal the role of the selected player
                revealRole(selectedPlayer);
            } else if (gameState === GameState.WAITING_FOR_WEREWOLVES) {
                // Add 1 wolf vote against the selected player
                setPlayers(prevPlayers => voteForPlayer(prevPlayers, selectedPlayer, VoteType.WEREWOLF_VOTES));
                endNightPhase();
            }
            setPlayerSelectionOpen(false);
            setSelectedPlayer(null);
        }
    };

    return (
        <Modal
            isOpen={playerSelectionOpen}
            onClose={() => setPlayerSelectionOpen(false)}
            size="full"
            motionPreset="slideInBottom"
        >
            <ModalOverlay/>
            <ModalContent bg="rgba(0, 0, 0, 0.7)" borderRadius="md">
                <ModalCloseButton color="white"/>
                <ModalBody>
                    <HStack justifyContent="center" alignItems="center">
                      <VStack justifyContent="center" alignItems="center" height="90vh" gap={10}>
                        <Text textAlign="center" fontSize="2xl" fontWeight="bold" color="white">
                          Choisissez contre un joueur :
                        </Text>

                        { /* Display player list */ }
                        <HStack justifyContent="center" alignItems="center" spacing={8}>
                          {players.filter(player => !player.isPlaying && player.alive).map((player, i) => (
                              <Flex
                                  key={i}
                                  direction="column"
                                  align="center"
                                  justify="center"
                                  cursor="pointer"
                                  outline={selectedPlayer === player ? "1px solid white" : "unset"}
                                  gap={5}
                                  p={5}
                                  borderRadius="md"
                                  onClick={() => setSelectedPlayer(player)}
                                  transitionDuration="0.2s"
                                  _hover={{transform: "scale(1.2)", transitionDuration: "0.4s"}}
                              >
                                <Avatar
                                    size="xl"
                                    icon={!player.alive ? <CloseIcon/> : undefined}
                                    backgroundColor={!player.alive ? "red" : undefined}
                                />
                                <Text color="white" textAlign="center">
                                  {player.username}
                                </Text>
                              </Flex>
                          ))}
                        </HStack>

                        { /* When a player is selected */ }
                        {selectedPlayer ? (<>
                          <Text textAlign="center" fontSize="sm" color="white">
                            Vous avez sélectionné <b>{selectedPlayer.username}</b>
                          </Text>
                          <Button onClick={handleSelect} color="textPrimary" backgroundColor="buttonBackground">Confirmer</Button>
                        </>) : null}

                      </VStack>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PlayerSelectionModal;
