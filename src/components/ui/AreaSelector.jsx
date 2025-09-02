import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Collapse,
    Text,
    VStack,
    HStack,
    Icon,
    useDisclosure,
    Tooltip,
    IconButton,
    useOutsideClick,
    useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';

// 单个树节点组件
const TreeNodeItem = React.memo(({
    node,
    level = 0,
    onSelect,
    selectedId,
    expandedNodes,
    onToggleExpand
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedId === node.id;

    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
    const selectedBgColor = useColorModeValue('blue.50', 'blue.900');

    const handleClick = useCallback(() => {
        onSelect(node);
    }, [node, onSelect]);

    const handleToggleExpand = useCallback((e) => {
        e.stopPropagation();
        onToggleExpand(node.id);
    }, [node.id, onToggleExpand]);

    return (
        <Box>
            <HStack
                spacing={1}
                py={2}
                px={3}
                pl={3 + level * 20}
                cursor="pointer"
                bg={isSelected ? selectedBgColor : 'transparent'}
                _hover={{ bg: isSelected ? selectedBgColor : hoverBgColor }}
                onClick={handleClick}
                borderRadius="md"
                transition="background-color 0.1s"
            >
                {hasChildren ? (
                    <Icon
                        as={isExpanded ? ChevronDownIcon : ChevronRightIcon}
                        boxSize={4}
                        color="gray.500"
                        onClick={handleToggleExpand}
                        _hover={{ color: 'gray.700' }}
                    />
                ) : (
                    <Box boxSize={4} />
                )}
                <Text fontSize="sm" flex={1} noOfLines={1}>
                    {node.name}
                </Text>
            </HStack>

            {hasChildren && (
                <Collapse in={isExpanded} animateOpacity>
                    <VStack spacing={0} align="stretch">
                        {node.children.map((child) => (
                            <TreeNodeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onSelect={onSelect}
                                selectedId={selectedId}
                                expandedNodes={expandedNodes}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}
                    </VStack>
                </Collapse>
            )}
        </Box>
    );
});

// 主组件 - 适配 MenuList 使用
const AreaSelector = ({
    data = [],
    onSelect,
    intiSelectedRegion = null,
    placeholder = "请选择地区",
    showTrigger = true,  // 是否显示触发按钮
    isMenuMode = false,
    showClearButton = true  // 是否为菜单模式
}) => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dropdownRef = React.useRef();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        setSelectedRegion(intiSelectedRegion)
    }, [intiSelectedRegion])


    // 构建树结构 - 使用 useMemo 优化性能
    const treeData = useMemo(() => {
        const nodeMap = new Map();
        const rootNodes = [];

        if (data.length === 0) {
            return []
        }

        // 首先创建所有节点的映射
        data.forEach(item => {
            nodeMap.set(item.id, { ...item, children: [] });
        });

        // 构建树结构
        data.forEach(item => {
            const node = nodeMap.get(item.id);
            if (item.province_id === 0) {
                rootNodes.push(node);
            } else {
                const parent = nodeMap.get(item.province_id);
                if (parent) {
                    parent.children.push(node);
                }
            }
        });

        return rootNodes;
    }, [data]);

    // 处理选择
    const handleSelect = useCallback((node) => {
        setSelectedRegion(node);
        onSelect?.(node);
        if (!isMenuMode) {
            onClose();
        }
    }, [onSelect, onClose, isMenuMode]);

    // 处理清空
    const handleClear = useCallback((e) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发下拉框开关
        setSelectedRegion(null);
        setExpandedNodes(new Set()); // 同时清空展开状态
        onSelect?.(null);
    }, [onSelect]);

    // 处理展开/收起
    const handleToggleExpand = useCallback((nodeId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    }, []);


    // 点击外部关闭下拉菜单 - 只在非菜单模式下使用
    useOutsideClick({
        ref: dropdownRef,
        handler: isMenuMode ? undefined : onClose,
    });

    // 树形内容组件
    const TreeContent = () => (
        <Box
            maxH="300px"
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#CBD5E0',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#A0AEC0',
                },
            }}
        >
            <VStack spacing={0} align="stretch" p={1}>
                {treeData.map((node) => (
                    <TreeNodeItem
                        key={node.id}
                        node={node}
                        level={0}
                        onSelect={handleSelect}
                        selectedId={selectedRegion?.id}
                        expandedNodes={expandedNodes}
                        onToggleExpand={handleToggleExpand}
                    />
                ))}
            </VStack>
        </Box>
    );

    // 如果是菜单模式，直接返回树形内容
    if (isMenuMode) {
        return (
            <Box>
                {showClearButton && selectedRegion && (
                    <Box p={2} borderBottom="1px solid" borderColor={borderColor}>
                        <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.600">
                                已选择: {selectedRegion.name}
                            </Text>
                            <Tooltip label="清空选择">
                                <IconButton
                                    size="xs"
                                    variant="ghost"
                                    icon={<CloseIcon />}
                                    onClick={handleClear}
                                    aria-label="清空选择"
                                />
                            </Tooltip>
                        </HStack>
                    </Box>
                )}
                <TreeContent />
            </Box>
        );
    }

    // 标准下拉选择器模式
    return (
        <Box position="relative" w="300px">
            {showTrigger && (
                <HStack spacing={0} position="relative">
                    <Button
                        w="100%"
                        fontWeight={"normal"}
                        size={"sm"}
                        justifyContent="space-between"
                        rightIcon={<ChevronDownIcon transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'} transition="transform 0.2s" boxSize={"21px"} />}
                        onClick={isOpen ? onClose : onOpen}
                        variant="outline"
                        bg={bgColor}
                        borderColor={borderColor}
                        borderRightRadius={selectedRegion && showClearButton ? 0 : "md"}
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    >
                        <Text noOfLines={1} textAlign="left">
                            {selectedRegion ? selectedRegion.name : placeholder}
                        </Text>
                    </Button>

                    {selectedRegion && showClearButton && (
                        <IconButton
                            size="sm"
                            variant="outline"
                            icon={<CloseIcon boxSize={2.5} />}
                            onClick={handleClear}
                            borderLeftRadius={0}
                            borderLeft="none"
                            bg={bgColor}
                            borderColor={borderColor}
                            _hover={{ borderColor: 'blue.300', bg: 'red.50' }}
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                            aria-label="清空选择"
                        />
                    )}
                </HStack>
            )}

            {isOpen && (
                <Box
                    ref={dropdownRef}
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    mt={1}
                    bg={bgColor}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="md"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    zIndex={1000}
                >
                    {data.length === 0 ? <Text textAlign={"center"} my={"10px"}>暂无数据</Text> : <TreeContent />}
                </Box>
            )}
        </Box>
    );
};

export default AreaSelector;