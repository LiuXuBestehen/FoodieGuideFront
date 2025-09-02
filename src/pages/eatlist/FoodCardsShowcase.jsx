import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Text,
    HStack,
    VStack,
    Container,
    Flex,
    Select,
    InputGroup,
    Input,
    InputLeftElement,
    useColorModeValue,
    Center,
} from '@chakra-ui/react';
import {
    Search,
    Filter
} from 'lucide-react';
import { useToast } from '@chakra-ui/react';
import Pagination from '../../components/ui/Pagination';
import FoodCard from '../../components/eatlist/FoodCard';
import { foodService } from '../../api/models/food/foodService';
import { userService } from '../../api/models/user/userService';
import AreaSelector from '../../components/ui/AreaSelector';
import regionStore from '../../store/region/regionStore';
import useAuthStore from '../../store/user/userStore';
import { useDebounce } from '../../hooks/useDebounce';



// Main FoodCardsShowcase component
const FoodCardsShowcase = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const { regions } = regionStore();
    const [userLikedFoods, setUserLikedFoods] = useState([]);
    const { user } = useAuthStore();
    const debouncedSearchQuery = useDebounce(searchQuery, 500);


    const toast = useToast();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headerBg = useColorModeValue('white', 'gray.800');


    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const response = await foodService.getFoodCategories();
                setCategories(response);
                if (user !== null) {
                    //获取用户喜欢美食列表
                    const response = await userService.getUserLikedFoodsIDS(user.user_id);
                    setUserLikedFoods(response.data)
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                return;
            }
        }
        fetchInitData();
    }, [])

    //用于筛选时重置到第一页
    useEffect(() => {
        // 只有当筛选条件变化时才重置页码，不包括 currentPage 和 pageSize
        // 这里的 currentPage 不应该作为依赖项，因为它会在这里被改变
        setCurrentPage(1);
    }, [selectedCategory, selectedCountry, debouncedSearchQuery, pageSize]);

    // Reset page when filters change
    useEffect(() => {
        // 模拟数据加载
        const fetchData = async () => {
            try {
                const response = !searchQuery.trim() && selectedCategory === null && selectedCountry === null ?
                    await foodService.getFoodByPage(currentPage, pageSize) :
                    await foodService.getFoodByPage(currentPage, pageSize, {
                        "name__contains": debouncedSearchQuery,
                        "category__contains": selectedCategory || "",
                        "region_name__contains": selectedCountry?.name || ""
                    });
                setData(response.foods);
                setTotalPages(Math.ceil(response.total / pageSize))
            } catch (error) {
                console.error("Error fetching data:", error);
                return;
            }
        };
        fetchData();
    }, [selectedCategory, selectedCountry, currentPage, pageSize, debouncedSearchQuery]);

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
        }
        finally {
            //更新后刷新喜欢美食列表
            const response = await userService.getUserLikedFoodsIDS(user.user_id);
            setUserLikedFoods(response.data)
        }
    };



    return (
        <Box bg={bgColor} minH="100vh" pt={"6"}>

            <Container maxW="7xl">
                {/* Filters and Search */}
                <Box mb="6">
                    <HStack spacing="4" flexWrap="wrap" justify="center">
                        {/* Search Bar */}
                        <InputGroup maxW="500px">
                            <InputLeftElement>
                                <Search size={20} color="gray" />
                            </InputLeftElement>
                            <Input
                                placeholder="请输入美食名称..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                borderRadius="full"
                                bg="white"
                                _focus={{ borderColor: 'orange.400', shadow: 'md' }}
                            />
                        </InputGroup>

                        <HStack>
                            <Filter size={16} />
                            <Text fontSize="sm" fontWeight="medium">筛选:</Text>
                        </HStack>

                        <Select
                            defaultValue={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            maxW="180px"
                            size="sm"
                            bg="white"
                            placeholder='全部'
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Select>

                        <AreaSelector data={regions} onSelect={setSelectedCountry} placeholder='全部' />



                        <Select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            maxW="120px"
                            size="sm"
                            bg="white"
                        >
                            <option value={6}>6个/页</option>
                            <option value={9}>9个/页</option>
                            <option value={12}>12个/页</option>
                        </Select>
                    </HStack>
                </Box>

                {/* Food Cards Grid */}
                {data.length > 0 ? (
                    <Grid
                        templateColumns={{
                            base: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(3, 1fr)",
                            xl: "repeat(3, 1fr)"
                        }}
                        gap="6"
                        mb="8"
                    >
                        {data.map(food => (
                            <FoodCard
                                key={food.id}
                                food={food}
                                isLiked={userLikedFoods.includes(food.id)}
                                onLike={handleLike}
                            />
                        ))}
                    </Grid>
                ) : (
                    <Center py="12">
                        <VStack spacing="4">
                            <Text fontSize="xl" color="gray.500">暂无数据</Text>
                            <Text color="gray.400">可以尝试更换筛选条件</Text>
                        </VStack>
                    </Center>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box py="8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            colorScheme={"orange"}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default FoodCardsShowcase;