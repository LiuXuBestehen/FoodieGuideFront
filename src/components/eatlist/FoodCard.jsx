import { useState } from 'react';
import {
    Box,
    Text,
    Image,
    HStack,
    VStack,
    Card,
    CardBody,
    Heading,
    IconButton,
    useColorModeValue,
    Tag,
    TagLabel,
    Center,
    Spinner
} from '@chakra-ui/react';
import {
    MapPin,
    Heart,
} from 'lucide-react';
import TruncatedTooltipText from '../ui/TruncatedTooltipText'
// Reusable FoodCard component
const FoodCard = ({ food, onLike, isLiked }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleLike = () => {
        onLike?.(food.id, !isLiked);
    };

    return (
        <Card
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s ease"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
                borderColor: 'orange.300'
            }}
            cursor="pointer"
        >
            <Box position="relative">
                {!imageLoaded && (
                    <Center h="200px" bg="gray.100">
                        <Spinner size="lg" color="orange.500" />
                    </Center>
                )}
                <Image
                    src={food.image_url}
                    alt={food.name}
                    h="200px"
                    w="100%"
                    objectFit="cover"
                    onLoad={() => setImageLoaded(true)}
                    display={imageLoaded ? 'block' : 'none'}
                />

                {/* Overlay with heart icon */}
                <Box
                    position="absolute"
                    top="0"
                    right="0"
                    p="3"
                >
                    <IconButton
                        icon={<Heart size={16} />}
                        size="sm"
                        colorScheme={isLiked ? "red" : "gray"}
                        variant={isLiked ? "solid" : "outline"}
                        bg={isLiked ? "red.500" : "whiteAlpha.800"}
                        _hover={{ bg: isLiked ? "red.600" : "whiteAlpha.900" }}
                        onClick={handleLike}
                        aria-label="Like food"
                    />
                </Box>
            </Box>

            <CardBody p="4">
                <VStack align="stretch" spacing="3">
                    {/* Header */}
                    <Box>
                        <Heading size="md" mb="1" noOfLines={1}>
                            {food.name}
                        </Heading>
                        <TruncatedTooltipText maxWidth='364px'>
                            {food.description}
                        </TruncatedTooltipText>
                    </Box>

                    {/* Location and category */}
                    <HStack justify="space-between" align="center">
                        <HStack spacing="1">
                            <MapPin size={14} color="gray" />
                            <Text fontSize="xs" color={textColor}>
                                {food.region_name}
                            </Text>
                        </HStack>
                        <Tag size="sm" colorScheme="blue" variant="subtle">
                            <TagLabel>{food.category}</TagLabel>
                        </Tag>
                    </HStack>

                    {/* Taste */}
                    <HStack justify="space-between" align="center">
                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                            口味：
                        </Text>
                        <TruncatedTooltipText maxWidth='300px' fontSize="xs" color={textColor}>
                            {food.taste}
                        </TruncatedTooltipText>
                    </HStack>

                    {/* Ingredients */}
                    <Box>
                        <Text fontSize="xs" color={textColor} fontWeight="medium" mb="1">
                            主要食材：
                        </Text>
                        <TruncatedTooltipText fontSize="xs" color={textColor} maxWidth='365px'>
                            {food.ingredients}
                        </TruncatedTooltipText>
                    </Box>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default FoodCard;