import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import RulesConfirmation from '../components/pre-game/RulesConfirmation.jsx';
import AskForUsername from '../components/pre-game/AskForUsername.jsx';

const BeforeGameView = () => {
  const [step, setStep] = useState(0);  // Step 0 for rules and Step 1 for asking username

  // Handles the transition from confirmation to username choice
  const handleConfirmRules = () => {
    setStep(1);
  };

  return (
    <Box height={"100%"} width={"100%"}>
      {step === 0 ?
        <RulesConfirmation onConfirm={handleConfirmRules} />
        : <AskForUsername />
      }
    </Box>
  );
};

export default BeforeGameView;

