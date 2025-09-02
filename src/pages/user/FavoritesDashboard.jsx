import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Badge,
    Container,
    Heading,
    Flex,
    useColorModeValue,
    Button,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import {
    Heart,
    Filter,
    BookmarkX,
} from 'lucide-react';
import { userService } from '../../api/models/user/userService';
import FavoriteCard from '../../components/favorite/FavoriteCard';
import FavoriteFilterControls from '../../components/favorite/FavoriteFilterControls';
import useAuthStore from '../../store/user/userStore';

// 主要收藏列表组件
const FavoritesDashboard = () => {
    const [favoritesData, setFavoritesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [itemToRemove, setItemToRemove] = useState(null);
    const [isRefresh, setIsRefresh] = useState(false);
    const { user } = useAuthStore();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const toast = useToast();

    useEffect(() => {
        async function fetchUserLikedFood() {
            try {
                const response = await userService.getUserLikedFoods(user.user_id);
                if (!response.success) {
                    throw new Error("获取用户收藏列表数据失败");
                }
                setFavoritesData(response.data)
            } catch (error) {
                console.log(`获取用户收藏列表数据出错,${error}`);
                throw error;
            }
        }
        fetchUserLikedFood();
    }, [user, isRefresh])

    // 提取唯一的分类和地区
    const categories = useMemo(() => {
        return [...new Set(favoritesData.filter(food => food.category).map(food => food.category))];
    }, [favoritesData]);

    const regions = useMemo(() => {
        return [...new Set(favoritesData.filter(food => food.region_name).map(food => food.region_name))];
    }, [favoritesData]);

    // 筛选、搜索和排序逻辑
    const filteredAndSortedFood = useMemo(() => {
        let filtered = favoritesData.filter(food => {
            const matchesSearch = !searchTerm ||
                food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = !selectedCategory || food.category === selectedCategory;
            const matchesRegion = !selectedRegion || food.region_name === selectedRegion;

            return matchesSearch && matchesCategory && matchesRegion;
        });

        // 排序
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name_asc':
                    return a.name.localeCompare(b.name, 'zh-CN');
                case 'name_desc':
                    return b.name.localeCompare(a.name, 'zh-CN');
                case 'category_asc':
                    return (a.category || '').localeCompare(b.category || '', 'zh-CN');
                case 'region_asc':
                    return (a.region_name || '').localeCompare(b.region_name || '', 'zh-CN');
                default:
                    return 0;
            }
        });

        return filtered;
    }, [favoritesData, searchTerm, selectedCategory, selectedRegion, sortBy]);

    const handleRemove = (id) => {
        setItemToRemove(id);
        onOpen();
    };

    const confirmRemove = async () => {
        try {
            const response = await userService.deleteFoodFromUserLiked(user.user_id, itemToRemove)
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
        } catch (error) {
            console.error("进行删除喜欢美食出现错误", error);
            return;
        } finally {
            onClose();
            setItemToRemove(null);
            setIsRefresh(!isRefresh);
        }
    };

    // const handleEdit = (food) => {
    //     // 这里应该打开编辑对话框或跳转到详情页面
    //     toast({
    //         title: "查看详情",
    //         description: `正在查看 ${food.name} 的详细信息...`,
    //         status: "info",
    //         duration: 2000,
    //         isClosable: true,
    //     });
    // };

    const bgGradient = useColorModeValue(
        'linear(to-br, orange.50, red.50, yellow.50)',
        'linear(to-br, gray.900, gray.800, orange.900)'
    );

    return (
        <Box minH="100vh" bgGradient={bgGradient}>
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">


                    {/* 筛选控制区域 */}
                    <FavoriteFilterControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        categories={categories}
                        regions={regions}
                    />

                    {/* 结果统计 */}
                    <Flex justify="space-between" align="center">
                        <Text color="gray.600">
                            共收藏 <strong>{filteredAndSortedFood.length}</strong> 道美食
                        </Text>
                        <HStack spacing={2}>
                            <Badge colorScheme="red" variant="subtle" px={3} py={1} display={"flex"} alignItems={"center"}>
                                <Heart size={14} fill="currentColor" style={{ marginRight: '4px' }} />
                                收藏列表
                            </Badge>
                            {(searchTerm || selectedCategory || selectedRegion) && (
                                <Badge colorScheme="blue" variant="subtle" px={3} py={1} display={"flex"} alignItems={"center"}>
                                    <Filter size={14} style={{ marginRight: '4px' }} />
                                    已筛选
                                </Badge>
                            )}
                        </HStack>
                    </Flex>

                    {/* 收藏列表 */}
                    <VStack spacing={4} align="stretch">
                        {filteredAndSortedFood.map((food) => (
                            <FavoriteCard
                                key={food.id}
                                food={food}
                                onRemove={handleRemove}
                            // onEdit={handleEdit}
                            />
                        ))}
                    </VStack>

                    {/* 空状态 */}
                    {filteredAndSortedFood.length === 0 && (
                        <Box textAlign="center" py={12}>
                            <BookmarkX size={64} color="gray" style={{ margin: '0 auto 16px' }} />
                            <Text fontSize="xl" color="gray.500" mb={4}>
                                {favoritesData.length === 0
                                    ? '还没有收藏任何美食'
                                    : '没有找到符合条件的收藏'
                                }
                            </Text>
                            {favoritesData.length === 0 ? (
                                <Text color="gray.400">
                                    快去发现更多美味，添加到收藏吧！
                                </Text>
                            ) : (
                                <Button
                                    colorScheme="red"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                        setSelectedRegion('');
                                    }}
                                >
                                    清除筛选条件
                                </Button>
                            )}
                        </Box>
                    )}
                </VStack>
            </Container>

            {/* 删除确认对话框 */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            移除收藏
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            确定要将这道美食从收藏列表中移除吗？此操作无法撤销。
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                取消
                            </Button>
                            <Button colorScheme="red" onClick={confirmRemove} ml={3}>
                                确认移除
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default FavoritesDashboard;