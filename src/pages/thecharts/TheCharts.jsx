import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    VStack,
    Text,
    Badge,
    Container,
    Flex,
    useColorModeValue,
    Button,
} from '@chakra-ui/react';
import {
    Filter,
} from 'lucide-react';
import TheChartsFoodCard from '../../components/thecharts/TheChartsFoodCard';
import FilterControls from '../../components/thecharts/FilterControls';
import { foodService } from '../../api/models/food/foodService';
import { userService } from '../../api/models/user/userService';
import useAuthStore from '../../store/user/userStore';
import { useToast } from '@chakra-ui/react';
import { TheChartsNum } from '../../constants/serviceConfig';



// 主要美食排行榜组件
const TheCharts = () => {
    const [foodData, setFoodData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [userLikedFoods, setUserLikedFoods] = useState([]);
    const { user } = useAuthStore();
    const toast = useToast();
    const num = TheChartsNum;

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                if (user !== null) {
                    //获取用户喜欢美食列表
                    const response = await userService.getUserLikedFoodsIDS(user.user_id);
                    setUserLikedFoods(response.data)
                }
            } catch (error) {
                console.error("Error fetching UserLikedFoodsIds:", error);
                return;
            }
        }
        fetchInitData();
    }, [user])

    useEffect(() => {
        async function fetchTheChartsFood() {
            try {
                const response = await foodService.getTheChartsFoods(num);
                setFoodData(response)
            } catch (error) {
                console.log(`获取排行榜美食数据出错,${error}`);
                throw error;
            }
        }
        fetchTheChartsFood();
    }, [userLikedFoods])

    const handleLike = async (foodId, isLiked) => {
        if (user === null) {
            toast({
                title: '收藏失败',
                description: '请先进行登录',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return
        }
        try {
            if (isLiked) {
                const response = await userService.addFoodToUserLiked(user.user_id, foodId)
                if (response.success) {
                    toast({
                        title: '收藏成功',
                        description: '美食已经添加到收藏列表',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: "top-right",
                    });
                } else {
                    toast({
                        title: '收藏失败',
                        description: response.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: "top-right",
                    });
                }
            } else {
                const response = await userService.deleteFoodFromUserLiked(user.user_id, foodId)
                if (response.success) {
                    toast({
                        title: '移除收藏成功',
                        description: '美食已经从收藏列表移除',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: "top-right",
                    });
                } else {
                    toast({
                        title: '移除收藏失败',
                        description: response.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: "top-right",
                    });
                }
            }
        } catch (error) {
            console.error("进行更新或删除喜欢美食出现错误", error);
            return;
        } finally {
            //更新后刷新喜欢美食列表
            const response = await userService.getUserLikedFoodsIDS(user.user_id);
            setUserLikedFoods(response.data)
        }
    };


    // 提取唯一的分类和地区
    const categories = useMemo(() => {
        return [...new Set(foodData.filter(food => food.category).map(food => food.category))];
    }, [foodData]);

    const regions = useMemo(() => {
        return [...new Set(foodData.filter(food => food.region_name).map(food => food.region_name))];
    }, [foodData]);

    // 筛选和搜索逻辑
    const filteredFood = useMemo(() => {
        return foodData.filter(food => {
            const matchesSearch = !searchTerm ||
                food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = !selectedCategory || food.category === selectedCategory;
            const matchesRegion = !selectedRegion || food.region_name === selectedRegion;

            return matchesSearch && matchesCategory && matchesRegion;
        });
    }, [foodData, searchTerm, selectedCategory, selectedRegion]);

    const bgGradient = useColorModeValue(
        'linear(to-br, blue.50, purple.50)',
        'linear(to-br, gray.900, purple.900)'
    );


    return (
        <Box minH="100vh" bgGradient={bgGradient}>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* 标题区域 */}
                    {/* <Box textAlign="center">
                        <Heading size="2xl" mb={4} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                            🏆 中华美食排行榜
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            探索最受欢迎的中华传统美食，感受舌尖上的中国
                        </Text>
                    </Box> */}

                    {/* 筛选控制区域 */}
                    <FilterControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                        categories={categories}
                        regions={regions}
                    />

                    {/* 结果统计 */}
                    <Flex justify="space-between" align="center">
                        <Text color="gray.600">
                            共找到 <strong>{filteredFood.length}</strong> 道美食
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" px={3} py={1} display="flex"
                            alignItems="center">
                            <Filter size={14} style={{ marginRight: '4px' }} />
                            {searchTerm || selectedCategory || selectedRegion ? '已筛选' : '全部'}
                        </Badge>
                    </Flex>

                    <VStack spacing={4} align="stretch">
                        {filteredFood.map((food, index) => (
                            <TheChartsFoodCard key={food.id} food={food} rank={index + 1} isLiked={userLikedFoods.includes(food.id)}
                                onLike={handleLike} />
                        ))}
                    </VStack>

                    {/* 空状态 */}
                    {filteredFood.length === 0 && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="xl" color="gray.500" mb={4}>
                                😔 没有找到符合条件的美食
                            </Text>
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setSelectedRegion('');
                                }}
                            >
                                清除筛选条件
                            </Button>
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default TheCharts;