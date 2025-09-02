import {
    Box,
    Button,
    Heading,
    VStack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';

// 移动端导航抽屉
const MobileNavDrawer = ({ isOpen, onClose, tables, activeTable, onTableSelect }) => {
    const handleTableSelect = (key) => {
        onTableSelect(key);
        onClose();
    };

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Heading size="md" color="blue.600">
                        信息管理
                    </Heading>
                </DrawerHeader>
                <DrawerBody>
                    <VStack spacing={2} align="stretch">
                        {Object.entries(tables).map(([key, config]) => (
                            <Button
                                key={key}
                                variant={activeTable === key ? "solid" : "ghost"}
                                colorScheme={activeTable === key ? "blue" : "gray"}
                                justifyContent="flex-start"
                                onClick={() => handleTableSelect(key)}
                                leftIcon={<Box w={2} h={2} bg="blue.400" borderRadius="full" />}
                            >
                                {config.name}
                            </Button>
                        ))}
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default MobileNavDrawer;