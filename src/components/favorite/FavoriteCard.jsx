import {
    Box,
    VStack,
    HStack,
    Text,
    Image,
    Badge,
    Card,
    CardBody,
    Heading,
    Flex,
    useColorModeValue,
    IconButton,
    Skeleton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
} from '@chakra-ui/react';
import {
    MapPin,
    ChefHat,
    Share2,
    MoreVertical,
    Trash2,
    Edit3,
    Heart,
} from 'lucide-react';
// 收藏状态显示组件
const FavoriteStatus = () => {
    return (
        <HStack spacing={1} color="red.500" fontSize="xs">
            <Heart size={12} fill="currentColor" />
            <Text>已收藏</Text>
        </HStack>
    );
};
// 收藏卡片组件
const FavoriteCard = ({ food, onRemove }) => {
    // const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // const handleShare = () => {
    //     navigator.clipboard.writeText(`我收藏了这道美食：${food.name} - ${food.description}`);
    //     toast({
    //         title: "分享链接已复制",
    //         status: "success",
    //         duration: 2000,
    //         isClosable: true,
    //     });
    // };

    return (
        <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                borderColor: 'red.300'
            }}
        >
            <CardBody p={4}>
                <Flex align="center" gap={4}>
                    <Image
                        src={food.image_url}
                        alt={food.name}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        fallback={<Skeleton boxSize="100px" borderRadius="md" />}
                    />

                    <Box flex="1" minW="0">
                        <Flex justify="space-between" align="start" mb={2}>
                            <VStack align="start" spacing={1}>
                                <Heading size="md" noOfLines={1}>
                                    {food.name}
                                </Heading>
                                <FavoriteStatus />
                            </VStack>

                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    icon={<MoreVertical size={16} />}
                                    size="sm"
                                    variant="ghost"
                                />
                                <MenuList>
                                    {/* <MenuItem icon={<Edit3 size={16} />} onClick={() => onEdit(food)}>
                                        查看详情
                                    </MenuItem> */}
                                    {/* <MenuItem icon={<Share2 size={16} />} onClick={handleShare}>
                                        分享
                                    </MenuItem> */}
                                    <MenuItem
                                        icon={<Trash2 size={16} />}
                                        onClick={() => onRemove(food.id)}
                                        color="red.500"
                                    >
                                        移除收藏
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>

                        <Text color={textColor} fontSize="sm" noOfLines={2} mb={3}>
                            {food.description}
                        </Text>

                        <HStack spacing={2} wrap="wrap" mb={2}>
                            {food.region_name && (
                                <Badge colorScheme="green" variant="subtle" size="sm" display={"flex"} alignItems={"center"}>
                                    <MapPin size={12} style={{ marginRight: '4px' }} />
                                    {food.region_name}
                                </Badge>
                            )}
                            {food.category && (
                                <Badge colorScheme="purple" variant="subtle" size="sm" display={"flex"} alignItems={"center"}>
                                    <ChefHat size={12} style={{ marginRight: '4px' }} />
                                    {food.category}
                                </Badge>
                            )}
                            {food.taste && (
                                <Badge colorScheme="orange" variant="subtle" size="sm" display={"flex"} alignItems={"center"}>
                                    {food.taste}
                                </Badge>
                            )}
                        </HStack>

                        {food.ingredients && (
                            <Text fontSize="xs" color={textColor} noOfLines={2}>
                                主要食材：{food.ingredients}
                            </Text>
                        )}
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default FavoriteCard;