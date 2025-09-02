import {
    Box,
    VStack,
    Button,
    Heading,
} from '@chakra-ui/react';
// 左侧导航栏组件（桌面端）
const Sidebar = ({ tables, activeTable, onTableSelect }) => {
    return (
        <Box w="250px" bg="gray.50" p={4} borderRight="1px" borderColor="gray.200">
            <Heading size="md" mb={6} color="blue.600">
                信息管理
            </Heading>
            <VStack spacing={2} align="stretch">
                {Object.entries(tables).map(([key, config]) => (
                    <Button
                        key={key}
                        variant={activeTable === key ? "solid" : "ghost"}
                        colorScheme={activeTable === key ? "blue" : "gray"}
                        justifyContent="flex-start"
                        onClick={() => onTableSelect(key)}
                        leftIcon={<Box w={2} h={2} bg="blue.400" borderRadius="full" />}
                    >
                        {config.name}
                    </Button>
                ))}
            </VStack>
        </Box>
    );
};

export default Sidebar;