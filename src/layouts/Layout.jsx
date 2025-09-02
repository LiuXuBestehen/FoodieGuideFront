import { Flex, Box } from '@chakra-ui/react';
import Navigation from '../pages/nav/Navigation.jsx';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <Flex
                direction="column"
                h="100vh"     // 高度占满视口
                w="100vw"     // 宽度占满视口
                overflow="hidden"
            >
                <Navigation />
                <Box
                    flex="1"    // 剩余空间全部给 iframe
                    position="relative"
                    overflow="auto"
                >
                    <Outlet />
                </Box>
            </Flex>
        </>
    );
};

export default Layout;