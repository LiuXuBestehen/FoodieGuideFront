import { useState } from 'react';
import {
    Box,
    Button,
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
    ThumbsUp
} from 'lucide-react';
import TruncatedTooltipText from '../ui/TruncatedTooltipText'
// Reusable IngredientCard component
const IngredientCard = ({ ingredient, isLiked = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.600');


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
                    src={ingredient.image_url}
                    alt={ingredient.name}
                    h="200px"
                    w="100%"
                    objectFit="cover"
                    onLoad={() => setImageLoaded(true)}
                    display={imageLoaded ? 'block' : 'none'}
                />
                {/* Overlay with heart icon */}
                {isLiked &&
                    (
                        <Box
                            position="absolute"
                            top="0"
                            right="0"
                            p="3"
                        >
                            <Button
                                size="sm"
                                colorScheme="red"
                                variant="solid"
                                leftIcon={<ThumbsUp size={16} />}
                            >
                                推荐
                            </Button>
                        </Box>
                    )}

            </Box>

            <CardBody p="4">
                <VStack align="stretch" spacing="3">
                    {/* Header */}
                    <Box>
                        <Heading size="md" mb="1" noOfLines={1}>
                            {ingredient.name}
                        </Heading>
                        <TruncatedTooltipText fontSize="sm" color={textColor} maxWidth='365px'>
                            {ingredient.effect}
                        </TruncatedTooltipText>
                    </Box>

                    {/* Location and category */}
                    <HStack justify="space-between" align="center">
                        <HStack spacing="1">
                            <MapPin size={14} color="gray" />
                            <Text fontSize="xs" color={textColor}>
                                {ingredient.region_name}
                            </Text>
                        </HStack>
                        <Tag size="sm" colorScheme={ingredient.attribute === '寒' || ingredient.attribute === '凉' ? 'blue' : ingredient.attribute === '平' ? 'green' : ingredient.attribute === '温' ? 'orange' : 'red'} variant="subtle">
                            <TagLabel>
                                {ingredient.attribute}
                            </TagLabel>
                        </Tag>
                    </HStack>

                    {/* Taste */}
                    <HStack justify={"flex-start"} align="center">
                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                            口味：
                        </Text>
                        <TruncatedTooltipText fontSize="xs" color={textColor} maxWidth='320px'>
                            {ingredient.taste}
                        </TruncatedTooltipText>
                    </HStack>

                </VStack>
            </CardBody>
        </Card>
    );
};

export default IngredientCard;