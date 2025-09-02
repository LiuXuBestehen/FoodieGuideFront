import React, { useEffect, useRef } from 'react';
import {
    Button,
    HStack,
    Input,
    IconButton,
    Text,
    Stack,
    useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import { tableConfigs } from '../../constants/tableConfig';

// 搜索栏组件
const SearchBar = ({ activeTable, onSearch, onAdd, onMenuOpen }) => {
    const refSearchInput = useRef(null);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleSearch = () => {
        onSearch(refSearchInput.current.value);
    };

    useEffect(() => {
        if (refSearchInput.current) {
            refSearchInput.current.value = "";
        }
    }, [activeTable]);

    return (
        <Stack
            spacing={4}
            mb={6}
            p={4}
            bg="white"
            borderRadius="md"
            shadow="sm"
            direction={isMobile ? "column" : "row"}
            align={isMobile ? "stretch" : "center"}
        >
            {isMobile && (
                <HStack>
                    <IconButton
                        icon={<HamburgerIcon />}
                        onClick={onMenuOpen}
                        variant="outline"
                        colorScheme="blue"
                    />
                    <Text fontSize="lg" fontWeight="bold">
                        {tableConfigs[activeTable]?.name || '数据管理'}
                    </Text>
                </HStack>
            )}

            <HStack spacing={2} width="100%">
                <Input
                    placeholder="请输入名称进行模糊查询..."
                    ref={refSearchInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    flex={1}
                />
                <Button
                    leftIcon={<SearchIcon />}
                    onClick={handleSearch}
                    colorScheme="blue"
                    size={isMobile ? "sm" : "md"}
                >
                    搜索
                </Button>
            </HStack>

            <Button
                leftIcon={<AddIcon />}
                onClick={onAdd}
                colorScheme="green"
                size={isMobile ? "sm" : "md"}
                width={isMobile ? "100%" : "auto"}
            >
                新增
            </Button>
        </Stack>
    );
};

export default SearchBar;