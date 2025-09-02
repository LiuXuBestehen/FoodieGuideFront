import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Badge,
    useDisclosure,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Flex,
    Card,
    CardBody,
    Stack,
    Heading,
    Divider,
    Tag,
    TagLabel,
    SimpleGrid,
    useColorModeValue,
    Tooltip,
    Switch,
    FormControl,
    FormLabel,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb
} from '@chakra-ui/react';
import { MapPin, Utensils, Star, Clock, Users, Info, Eye, MapIcon, Settings, Zap } from 'lucide-react';
import { regionService } from '../../api/models/region/regionService';
import { icons } from '../../constants/categoryIcons';
import { MapKEY } from '../../constants/serviceConfig';
import TruncatedTooltipText from '../../components/ui/TruncatedTooltipText'

const FoodMapPage = () => {
    const [map, setMap] = useState(null);
    const [allRegionData, setAllRegionData] = useState([]);
    const [allFoodData, setAllFoodData] = useState({});
    const [selectedFood, setSelectedFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentZoom, setCurrentZoom] = useState(5);
    const [visibleRegions, setVisibleRegions] = useState([]);

    // 性能控制参数
    const [maxMarkers, setMaxMarkers] = useState(200); // 最大同时显示的标记数
    const [minZoomForMarkers, setMinZoomForMarkers] = useState(4); // 显示标记的最小缩放级别
    const [renderStats, setRenderStats] = useState({
        totalRegions: 0,
        totalFoods: 0,
        visibleRegions: 0,
        renderedMarkers: 0
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const mapContainer = useRef(null);
    const markersRef = useRef([]);
    const labelsRef = useRef([]);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');

    // 首次加载所有数据
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const constructFoods = {};
                const { regions, foods } = await regionService.getFoodsAndRegions();

                for (let index = 0; index < foods.length; index++) {
                    const food = foods[index];
                    constructFoods[food.id] = food
                }

                setAllRegionData(regions);
                setAllFoodData(constructFoods);

                setRenderStats({
                    totalRegions: regions.length,
                    totalFoods: Object.keys(constructFoods).length,
                    visibleRegions: 0,
                    renderedMarkers: 0
                });

                setLoading(false);
            } catch (err) {
                setError('加载数据失败，请稍后重试');
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // 计算当前视野内的区域 - 使用防抖优化
    const checkVisibleRegions = useCallback((mapInstance) => {
        if (!mapInstance || allRegionData.length === 0) return;

        const bounds = mapInstance.getBounds();
        const zoom = mapInstance.getZoom();

        // 只在足够的缩放级别时显示标记
        if (zoom < minZoomForMarkers) {
            setVisibleRegions([]);
            setRenderStats(prev => ({ ...prev, visibleRegions: 0, renderedMarkers: 0 }));
            return;
        }

        const visible = allRegionData.filter(region => {
            const point = [region.region_lng, region.region_lat];
            return bounds.contains(point);
        });

        // 限制可见区域数量以优化性能
        const limitedVisible = visible.slice(0, Math.floor(maxMarkers / 3));
        setVisibleRegions(limitedVisible);

        setRenderStats(prev => ({
            ...prev,
            visibleRegions: visible.length,
            renderedMarkers: 0 // 将在渲染标记时更新
        }));
    }, [allRegionData, maxMarkers, minZoomForMarkers]);

    // 防抖处理地图事件
    const debouncedCheckVisibleRegions = useCallback(
        debounce((mapInstance) => checkVisibleRegions(mapInstance), 300),
        [checkVisibleRegions]
    );

    // 渲染地图标记 - 按需渲染
    const renderMarkers = useCallback((mapInstance) => {
        if (!mapInstance || visibleRegions.length === 0) return;

        // 清除现有标记
        markersRef.current.forEach(marker => {
            mapInstance.remove(marker);
        });
        markersRef.current = [];

        let renderedCount = 0;
        const markers = [];

        // 按优先级渲染标记
        visibleRegions.forEach((region, regionIndex) => {
            if (renderedCount >= maxMarkers) return;

            const foodIds = region.food_ids.split(',').map(id => parseInt(id.trim()));

            foodIds.forEach((foodId, foodIndex) => {
                if (renderedCount >= maxMarkers) return;

                const food = allFoodData[foodId];
                if (!food) return;

                // 添加位置偏移避免重叠
                const offsetX = (Math.random() - 0.5) * 0.02;
                const offsetY = (Math.random() - 0.5) * 0.02;

                const marker = new window.AMap.Marker({
                    position: [region.region_lng + offsetX, region.region_lat + offsetY],
                    title: food.name,
                    extData: { food, region }
                });

                // 简化的标记样式以提升性能
                const getCategoryIcon = (category) => {
                    return icons[category] || '🍽️';
                };

                const content = `
          <div style="
            background: white;
            border-radius: 8px;
            padding: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid #FF6B6B;
            cursor: pointer;
            font-size: 18px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">${getCategoryIcon(food.category)}</div>
        `;

                marker.setContent(content);

                // 点击事件
                marker.on('click', () => {
                    setSelectedFood(food);
                    onOpen();
                });

                mapInstance.add(marker);
                markers.push(marker);
                renderedCount++;
            });
        });

        markersRef.current = markers;
        setRenderStats(prev => ({ ...prev, renderedMarkers: renderedCount }));
    }, [visibleRegions, allFoodData, maxMarkers, onOpen]);

    // 更新地区标签显示
    const updateRegionLabels = useCallback((mapInstance, zoom) => {
        if (!mapInstance) return;

        // 清除旧标签
        labelsRef.current.forEach(label => {
            mapInstance.remove(label);
        });
        labelsRef.current = [];

        // 只在高缩放级别显示标签，且限制数量
        if (zoom >= 8 && visibleRegions.length > 0) {
            const limitedRegions = visibleRegions.slice(0, 20); // 最多显示20个标签

            limitedRegions.forEach(region => {
                const text = new window.AMap.Text({
                    text: region.region_name,
                    position: [region.region_lng, region.region_lat - 0.01],
                    style: {
                        'background-color': 'rgba(255,255,255,0.9)',
                        'border': '1px solid #ccc',
                        'border-radius': '4px',
                        'padding': '2px 4px',
                        'font-size': '10px',
                        'color': '#333',
                        'text-align': 'center'
                    }
                });

                mapInstance.add(text);
                labelsRef.current.push(text);
            });
        }
    }, [visibleRegions]);

    // 初始化地图
    useEffect(() => {
        const initMap = () => {
            if (window.AMap && mapContainer.current) {
                const mapInstance = new window.AMap.Map(mapContainer.current, {
                    zoom: currentZoom,
                    center: [108.940, 32.125],
                    mapStyle: 'amap://styles/macaron',
                    features: ['bg', 'road', 'building'],
                    viewMode: '2D'
                });

                // 添加控件
                window.AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
                    const scale = new window.AMap.Scale();
                    const toolBar = new window.AMap.ToolBar();
                    mapInstance.addControl(scale);
                    mapInstance.addControl(toolBar);
                });

                // 地图事件监听
                mapInstance.on('zoomend', () => {
                    const zoom = mapInstance.getZoom();
                    setCurrentZoom(zoom);
                    debouncedCheckVisibleRegions(mapInstance);
                });

                mapInstance.on('moveend', () => {
                    debouncedCheckVisibleRegions(mapInstance);
                });

                setMap(mapInstance);
                checkVisibleRegions(mapInstance);
            }
        };

        if (!window.AMap) {
            const script = document.createElement('script');
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${MapKEY}&plugin=AMap.Scale,AMap.ToolBar`;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        return () => {
            if (map) {
                map.destroy();
            }
        };
    }, [checkVisibleRegions, debouncedCheckVisibleRegions]);

    // 当可见区域变化时重新渲染标记
    useEffect(() => {
        if (map && !loading) {
            renderMarkers(map);
        }
    }, [map, renderMarkers, loading]);

    // 更新标签
    useEffect(() => {
        if (map) {
            updateRegionLabels(map, currentZoom);
        }
    }, [map, currentZoom, updateRegionLabels]);

    // 性能统计
    const performanceStats = useMemo(() => {
        return {
            loadedDataRatio: `${((renderStats.renderedMarkers / renderStats.totalFoods) * 100).toFixed(1)}%`,
            visibilityRatio: `${((renderStats.visibleRegions / renderStats.totalRegions) * 100).toFixed(1)}%`
        };
    }, [renderStats]);

    return (
        <Box minH="80vh" bg={bgColor}>

            {/* 主要内容区域 */}
            <Flex h="calc(100vh - 64px)">
                {/* 地图容器 */}
                <Box flex="1" position="relative">
                    <Box ref={mapContainer} w="100%" h="100%" />

                    {/* 加载状态 */}
                    {loading && (
                        <Flex
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            bg="rgba(255,255,255,0.8)"
                            align="center"
                            justify="center"
                            zIndex="1000"
                        >
                            <VStack spacing="4">
                                <Spinner size="xl" color="orange.500" thickness="4px" />
                                <Text fontSize="lg" fontWeight="medium">
                                    正在加载 {renderStats.totalRegions} 个区域的美食数据...
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    共 {renderStats.totalFoods} 道美食
                                </Text>
                            </VStack>
                        </Flex>
                    )}

                    {/* 性能控制面板 */}
                    {/* <Card
                        position="absolute"
                        top="4"
                        left="4"
                        w="280px"
                        bg={cardBg}
                        boxShadow="lg"
                        zIndex="999"
                    >
                        <CardBody>
                            <VStack align="stretch" spacing="3">
                                <HStack>
                                    <Settings size={20} color="#FF6B6B" />
                                    <Text fontWeight="semibold" color={textColor}>性能控制</Text>
                                </HStack>

                                <FormControl>
                                    <FormLabel fontSize="sm">最大标记数: {maxMarkers}</FormLabel>
                                    <Slider
                                        value={maxMarkers}
                                        onChange={setMaxMarkers}
                                        min={50}
                                        max={500}
                                        step={50}
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="sm">最小显示缩放: {minZoomForMarkers}</FormLabel>
                                    <Slider
                                        value={minZoomForMarkers}
                                        onChange={setMinZoomForMarkers}
                                        min={3}
                                        max={10}
                                        step={1}
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </FormControl>

                                <Divider />


                            </VStack>
                        </CardBody>
                    </Card> */}

                    {/* 数据统计面板 */}
                    <Card
                        position="absolute"
                        top="4"
                        right="4"
                        w="280px"
                        bg={cardBg}
                        boxShadow="lg"
                        zIndex="999"
                    >
                        <CardBody>
                            <VStack align="stretch" spacing="3">
                                <HStack>
                                    <Eye size={20} color="#FF6B6B" />
                                    <Text fontWeight="semibold" color={textColor}>数据概览</Text>
                                </HStack>

                                <SimpleGrid columns={2} spacing="2">
                                    <VStack>
                                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                                            {renderStats.totalRegions}
                                        </Text>
                                        <Text fontSize="xs" textAlign="center">总区域数</Text>
                                    </VStack>
                                    <VStack>
                                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                            {renderStats.totalFoods}
                                        </Text>
                                        <Text fontSize="xs" textAlign="center">总美食数</Text>
                                    </VStack>
                                    <VStack>
                                        <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                                            {renderStats.visibleRegions}
                                        </Text>
                                        <Text fontSize="xs" textAlign="center">可见区域</Text>
                                    </VStack>
                                    <VStack>
                                        <Text fontSize="2xl" fontWeight="bold" color="red.500">
                                            {renderStats.renderedMarkers}
                                        </Text>
                                        <Text fontSize="xs" textAlign="center">已渲染标记</Text>
                                    </VStack>
                                </SimpleGrid>

                                <Divider />
                                <VStack align="stretch" spacing="1">
                                    <HStack justify="space-between">
                                        <Text fontSize="xs">数据加载率</Text>
                                        <Text fontSize="xs" fontWeight="bold">{performanceStats.loadedDataRatio}</Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontSize="xs">区域可见率</Text>
                                        <Text fontSize="xs" fontWeight="bold">{performanceStats.visibilityRatio}</Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </Box>
            </Flex>

            {/* 美食详情模态框 */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <Utensils size={24} color="#FF6B6B" />
                            <Text>{selectedFood?.name}</Text>
                            {selectedFood?.category && (
                                <Badge colorScheme="purple">{selectedFood.category}</Badge>
                            )}
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb="6">
                        {selectedFood && (
                            <VStack align="stretch" spacing="4">
                                {selectedFood.image_url && (
                                    <Image
                                        src={selectedFood.image_url}
                                        alt={selectedFood.name}
                                        borderRadius="lg"
                                        w="100%"
                                        h="200px"
                                        objectFit="cover"
                                        fallbackSrc="https://via.placeholder.com/400x300?text=美食图片"
                                    />
                                )}

                                <SimpleGrid columns={2} spacing="4">
                                    {selectedFood.taste && (
                                        <HStack>
                                            <Text fontSize="sm" color="gray.600">口味:</Text>
                                            <Tag size="sm" colorScheme="red">
                                                <TruncatedTooltipText maxWidth='200px'>
                                                    {selectedFood.taste}
                                                </TruncatedTooltipText>
                                            </Tag>
                                        </HStack>
                                    )}
                                    {selectedFood.region_name && (
                                        <HStack>
                                            <MapIcon size={16} color="#666" />
                                            <Text fontSize="sm" color="gray.600">{selectedFood.region_name}</Text>
                                        </HStack>
                                    )}
                                </SimpleGrid>

                                {selectedFood.description && (
                                    <Box>
                                        <Text fontWeight="semibold" mb="2">美食介绍</Text>
                                        <Text color="gray.700">{selectedFood.description}</Text>
                                    </Box>
                                )}

                                {selectedFood.ingredients && (
                                    <Box>
                                        <Text fontWeight="semibold" mb="2">主要食材</Text>
                                        <HStack wrap="wrap" spacing="2">
                                            {selectedFood.ingredients.split(',').map((ingredient, index) => (
                                                <Tag key={index} size="sm" colorScheme="green">
                                                    <TruncatedTooltipText maxWidth="528px">
                                                        {ingredient.trim()}
                                                    </TruncatedTooltipText>
                                                </Tag>
                                            ))}
                                        </HStack>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

// 防抖工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default FoodMapPage;