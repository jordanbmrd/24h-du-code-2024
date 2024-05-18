import {ChakraProvider, Box} from '@chakra-ui/react'
import {GameView} from './page/GameView.jsx';
import theme from './theme';
import {RouterProvider, createBrowserRouter, Outlet} from 'react-router-dom';
import {GameProvider} from "./contexts/GameContext.jsx";
import BeforeGameView from "./page/BeforeGameView.jsx";
import Victory from "./components/animations/Victory.jsx";
import Lose from "./components/animations/Lose.jsx";

const HeaderLayout = () => (
    <>
        <Box display={'flex'}>
            {/* <Sidebar/> */}
            <Outlet/>
        </Box>
    </>
);


// Router definition
const routerWithoutLogin = [
    {
        element: <HeaderLayout/>,
        children: [
            {
                path: '/',
                element: <BeforeGameView/>,
            },
            {
                path: '/game',
                element: <GameView />,
            },
            {
                path: '/victory',
                element: <Victory />,
            },
            {
                path: '/lose',
                element: <Lose />,
            },
        ]
    },
];

const router = createBrowserRouter([...routerWithoutLogin]);

const App = () => {
    return (
        <GameProvider>
            <ChakraProvider theme={theme}>
                    <RouterProvider router={router}/>
            </ChakraProvider>
        </GameProvider>
    )
}

export default App;