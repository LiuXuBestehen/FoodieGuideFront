import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Grid,
    GridItem,
    VStack,
    HStack,
    Container,
    Image,
    Badge,
    Card,
    CardBody,
    Heading,
    useColorModeValue,
    Tooltip
} from '@chakra-ui/react';
import {
    ChefHat,
    MapPin,
    Tag,
    Users,
    Heart,
    TrendingUp,
    Award,
    Utensils,
    Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { foodService } from '../api/models/food/foodService';
import { getTodaySeed, getRandomPage } from '../utils/randomPageUtils';
import { HomePageShowSize } from '../constants/serviceConfig';
import TruncatedTooltipText from '../components/ui/TruncatedTooltipText';
import { otherService } from '../api/models/otherService';


export default function Homepage() {
    const [foods, setFoods] = useState([]);
    const [stats, setStats] = useState([]);
    const pageSize = HomePageShowSize;
    const bgGradient = useColorModeValue(
        'linear(to-br, orange.50, red.50, yellow.50)',
        'linear(to-br, gray.900, gray.800, orange.900)'
    );

    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');

    useEffect(() => {
        const fetchRecommendations = async () => {
            const cached = localStorage.getItem("dailyDishes");
            const cachedDate = localStorage.getItem("dailyDishesDate");

            const today = getTodaySeed();
            if (cached && cachedDate === today) {
                setFoods(JSON.parse(cached));
                return;
            }

            // 获取菜品总数
            const dataTotal = await foodService.getFoodByPage(1, 1);
            const total = dataTotal.total;

            const randomPage = getRandomPage(today, total, pageSize);

            let data = await foodService.getFoodByPage(randomPage ? randomPage : 1, pageSize);
            //处理随机到最后一页，但是数据不足3条的情况
            if (data.foods.length < 3 && total > 3) {
                data = await foodService.getFoodByPage(randomPage ? randomPage - 1 : 1, pageSize);
            }

            setFoods(data.foods);

            // 缓存
            localStorage.setItem("dailyDishes", JSON.stringify(data.foods));
            localStorage.setItem("dailyDishesDate", today);
        };

        const fetchStats = async () => {
            try {
                // 获取首页统计数据
                const statsData = await otherService.getHomePageData();
                setStats(statsData);
            } catch (error) {
                console.error("获取首页统计数据失败", error);
            }
        };

        fetchRecommendations();
        fetchStats();
    }, []);



    return (
        <Box bgGradient={bgGradient} minH="100vh" py={8}>
            <Container maxW="7xl">
                {/* Hero Section */}
                <Flex
                    direction={{ base: 'column', lg: 'row' }}
                    align="center"
                    justify="space-between"
                    mb={16}
                    gap={8}
                >
                    <VStack align="start" spacing={6} flex={1} >
                        <Heading
                            size="2xl"
                            bgGradient="linear(to-r, orange.400, red.500)"
                            bgClip="text"
                            lineHeight="1.2"
                        >
                            发现美食的无限可能
                        </Heading>
                        <Text fontSize="xl" color={textColor} maxW="500px">
                            汇聚中国美食精华，从家常小菜到国宴料理，
                            让每一道菜都成为生活中的美好回忆
                        </Text>
                        <HStack spacing={4}>
                            <Link to="/map">
                                <Button
                                    size="lg"
                                    colorScheme="orange"
                                    leftIcon={<Utensils size={20} />}
                                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                                    transition="all 0.3s"
                                >
                                    开始美食之旅
                                </Button>
                            </Link>
                            <Link to="/thecharts">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    colorScheme="orange"
                                    leftIcon={<TrendingUp size={20} />}
                                    _hover={{ transform: 'translateY(-2px)' }}
                                    transition="all 0.3s"
                                >
                                    热门推荐
                                </Button>
                            </Link>
                        </HStack>
                    </VStack>

                    <Box flex={1} position="relative">
                        <Box
                            w="400px"
                            h="267px"
                            bg="orange.100"
                            borderRadius="2xl"
                            position="relative"
                            overflow="hidden"
                            mx="auto"
                            _hover={{ transform: 'scale(1.05)' }}
                            transition="all 0.3s"
                            cursor="pointer"
                        >
                            {/* <Flex
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                direction="column"
                                align="center"
                                color="orange.600"
                            >
                                <ChefHat size={80} />
                                <Text mt={2} fontSize="lg" fontWeight="bold">
                                    美食天地
                                </Text>
                            </Flex> */}
                            <Image src='homepage_background.png' />
                        </Box>
                    </Box>
                </Flex>

                {/* Stats Section */}
                <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={16}>
                    {stats.map((stat, index) => (
                        <Card key={index} bg={cardBg} shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }} transition="all 0.3s">
                            <CardBody textAlign="center" py={8}>
                                <VStack spacing={3}>
                                    <Box color="orange.500">
                                        <stat.icon size={32} />
                                    </Box>
                                    <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                                        {stat.value}
                                    </Text>
                                    <Text color={textColor} fontSize="sm">
                                        {stat.label}
                                    </Text>
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </Grid>

                {/* Featured Dishes Section */}
                <VStack spacing={8} mb={16}>
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color="orange.600">
                            今日推荐美食
                        </Heading>
                        <Text color={textColor} fontSize="lg" maxW="600px">
                            精心挑选的人气料理，简单易学，美味无穷
                        </Text>
                    </VStack>

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full">
                        {foods.map((dish) => (
                            <Card
                                key={dish.id}
                                bg={cardBg}
                                overflow="hidden"
                                _hover={{
                                    shadow: 'xl',
                                    transform: 'translateY(-8px)',
                                    '& .dish-image': { transform: 'scale(1.1)' }
                                }}
                                transition="all 0.3s"
                                cursor="pointer"
                            >
                                <Box overflow="hidden" h={{ base: "180px", md: "200px", lg: "240px" }} w={"full"}>
                                    <Image
                                        className="dish-image"
                                        src={dish.image_url}
                                        alt={dish.name || '美食图片'}
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                        objectPosition="center"
                                        transition="transform 0.3s"
                                        fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f7fafc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23a0aec0' text-anchor='middle' dy='0.3em'%3E暂无图片%3C/text%3E%3C/svg%3E"
                                        fallback={
                                            <Flex
                                                align="center"
                                                justify="center"
                                                h="full"
                                                bg="gray.200"
                                                color="gray.500"
                                            >
                                                <Coffee size={48} />
                                            </Flex>
                                        }
                                    />
                                </Box>
                                <CardBody>
                                    <VStack align="start" spacing={3}>
                                        <Heading size="md" color="gray.800">
                                            {dish.name}
                                        </Heading>

                                        {dish.description && (
                                            <TruncatedTooltipText maxWidth='354px'>
                                                {dish.description}
                                            </TruncatedTooltipText>
                                        )}

                                        <HStack justify="space-between" w="full" flexWrap="wrap">
                                            {dish.category && (
                                                <Badge colorScheme="orange" variant="subtle">
                                                    <HStack spacing={1}>
                                                        <Tag size={12} />
                                                        <Text>{dish.category}</Text>
                                                    </HStack>
                                                </Badge>
                                            )}
                                            {dish.region_name && (
                                                <Badge colorScheme="blue" variant="subtle">
                                                    <HStack spacing={1}>
                                                        <MapPin size={12} />
                                                        <Text>{dish.region_name}</Text>
                                                    </HStack>
                                                </Badge>
                                            )}
                                        </HStack>

                                        {dish.taste && (
                                            <HStack>
                                                <Text fontSize="sm" color="gray.500" minW={"42px"}>口味：</Text>
                                                <TruncatedTooltipText maxWidth='300px'>
                                                    {dish.taste}
                                                </TruncatedTooltipText>
                                            </HStack>
                                        )}

                                        {dish.ingredients && (
                                            <VStack align="start" w="full" spacing={1}>
                                                <Text fontSize="sm" color="gray.500" minW={"62px"}>主要食材：</Text>
                                                <TruncatedTooltipText maxWidth='354px'>
                                                    {dish.ingredients.split(',').slice(0, 4).join('、')}
                                                    {dish.ingredients.split(',').length > 4 && '...'}
                                                </TruncatedTooltipText>
                                            </VStack>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </Grid>
                </VStack>

                {/* CTA Section */}
                {/* <Card bg={cardBg} shadow="lg">
                    <CardBody py={12}>
                        <VStack spacing={6} textAlign="center">
                            <Heading size="lg" color="orange.600">
                                开启你的美食创作之旅
                            </Heading>
                            <Text color={textColor} fontSize="lg" maxW="600px">
                                加入我们的美食社区，分享你的独家食谱，
                                与全球美食爱好者一起探索烹饪的乐趣
                            </Text>
                            <HStack spacing={4}>
                                <Button
                                    size="lg"
                                    colorScheme="orange"
                                    leftIcon={<ChefHat size={20} />}
                                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                                    transition="all 0.3s"
                                >
                                    分享食谱
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    colorScheme="orange"
                                    leftIcon={<Users size={20} />}
                                    _hover={{ transform: 'translateY(-2px)' }}
                                    transition="all 0.3s"
                                >
                                    加入社区
                                </Button>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card> */}
            </Container>
        </Box>
    );
}