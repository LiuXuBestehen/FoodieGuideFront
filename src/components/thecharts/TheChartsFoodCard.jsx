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
    Tooltip,
    Skeleton,
} from '@chakra-ui/react';
import {
    MapPin,
    ChefHat,
    Heart,
    Share2
} from 'lucide-react';
import RankBadge from './RankBadge';
import TruncatedTooltipText from '../ui/TruncatedTooltipText';
// 美食卡片组件
const TheChartsFoodCard = ({ food, rank, onLike, isLiked }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleLike = () => {
        onLike?.(food.id, !isLiked);
    };

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
                borderColor: 'blue.300'
            }}
        >
            <CardBody p={4}>
                <Flex align="center" gap={4}>
                    <Box flexShrink={0}>
                        <RankBadge rank={rank} />
                    </Box>

                    <Image
                        src={food.image_url}
                        alt={food.name}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                        fallback={<Skeleton boxSize="80px" borderRadius="md" />}
                    />

                    <Box flex="1" minW="0">
                        <Heading size="md" mb={2} noOfLines={1}>
                            {food.name}
                        </Heading>
                        <TruncatedTooltipText maxWidth='1000px'>
                            {food.description}
                        </TruncatedTooltipText>
                        <HStack spacing={2} wrap="wrap">
                            {food.region_name && (
                                <Badge colorScheme="green" variant="subtle" size="sm" display="flex"
                                    alignItems="center">
                                    <MapPin size={12} style={{ marginRight: '4px' }} />
                                    {food.region_name}
                                </Badge>
                            )}
                            {food.category && (
                                <Badge colorScheme="purple" variant="subtle" size="sm" display="flex"
                                    alignItems="center">
                                    <ChefHat size={12} style={{ marginRight: '4px' }} />
                                    {food.category}
                                </Badge>
                            )}
                            {food.taste && (
                                <Badge colorScheme="orange" variant="subtle" size="sm" display="flex"
                                    alignItems="center" >
                                    {food.taste}
                                </Badge>
                            )}
                        </HStack>
                    </Box>

                    <VStack spacing={2}>
                        <Tooltip label="收藏">
                            <IconButton
                                icon={<Heart size={16} />}
                                size="sm"
                                colorScheme={isLiked ? "red" : "gray"}
                                variant={isLiked ? "solid" : "outline"}
                                bg={isLiked ? "red.500" : "whiteAlpha.800"}
                                _hover={{ bg: isLiked ? "red.600" : "whiteAlpha.900" }}
                                onClick={handleLike}
                                aria-label="收藏"
                            />
                        </Tooltip>
                        {/* <Tooltip label="分享">
                            <IconButton
                                icon={<Share2 size={16} />}
                                size="sm"
                                variant="ghost"
                                aria-label="分享"
                            />
                        </Tooltip> */}
                    </VStack>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default TheChartsFoodCard;