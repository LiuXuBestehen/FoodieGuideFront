import React from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    Image,
    useColorModeValue,
    Container,
    Icon,
    HStack,
    keyframes,
    useBreakpointValue
} from '@chakra-ui/react';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// 浮动动画
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// 淡入动画
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function NotFoundPage() {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const cardBg = useColorModeValue('white', 'gray.800');
    const shadowColor = useColorModeValue('lg', 'dark-lg');

    // 响应式字体大小
    const headingSize = useBreakpointValue({ base: '6xl', md: '8xl', lg: '9xl' });
    const subHeadingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
    const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

    let navigate = useNavigate();

    const handleGoHome = () => {
        // 这里可以使用 React Router 的 navigate
        navigate('/')
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleSearch = () => {
        navigate('/map')
    };

    return (
        <Box
            minH="100vh"
            bg={bgColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="2xl" textAlign="center">
                <VStack spacing={8}>
                    {/* 404 数字 */}
                    <Box
                        animation={`${float} 6s ease-in-out infinite`}
                        position="relative"
                    >
                        <Heading
                            fontSize={headingSize}
                            fontWeight="black"
                            color={headingColor}
                            textShadow="2px 2px 4px rgba(0,0,0,0.1)"
                            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
                            bgClip="text"
                            lineHeight="1"
                        >
                            404
                        </Heading>

                        {/* 装饰性元素 */}
                        <Box
                            position="absolute"
                            top="-10px"
                            right="-10px"
                            w="20px"
                            h="20px"
                            bg="yellow.400"
                            borderRadius="full"
                            animation={`${float} 4s ease-in-out infinite`}
                        />
                        <Box
                            position="absolute"
                            bottom="-5px"
                            left="-15px"
                            w="15px"
                            h="15px"
                            bg="pink.400"
                            borderRadius="full"
                            animation={`${float} 5s ease-in-out infinite reverse`}
                        />
                    </Box>

                    {/* 主要内容卡片 */}
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="2xl"
                        shadow={shadowColor}
                        maxW="md"
                        w="full"
                        animation={`${fadeIn} 0.8s ease-out`}
                    >
                        <VStack spacing={6}>
                            <VStack spacing={3}>
                                <Heading
                                    size={subHeadingSize}
                                    color={headingColor}
                                    fontWeight="bold"
                                >
                                    页面未找到
                                </Heading>
                                <Text
                                    color={textColor}
                                    fontSize="lg"
                                    lineHeight="1.6"
                                >
                                    抱歉，您访问的页面不存在或已被移除。
                                    <br />
                                    请检查URL是否正确，或返回首页继续浏览。
                                </Text>
                            </VStack>

                            {/* 按钮组 */}
                            <VStack spacing={4} w="full">
                                <Button
                                    size={buttonSize}
                                    colorScheme="blue"
                                    leftIcon={<Icon as={FiHome} />}
                                    onClick={handleGoHome}
                                    w="full"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg'
                                    }}
                                    transition="all 0.2s"
                                >
                                    返回首页
                                </Button>

                                <HStack spacing={3} w="full">
                                    <Button
                                        size={buttonSize}
                                        variant="outline"
                                        leftIcon={<Icon as={FiArrowLeft} />}
                                        onClick={handleGoBack}
                                        flex={1}
                                        _hover={{
                                            transform: 'translateY(-1px)'
                                        }}
                                        transition="all 0.2s"
                                    >
                                        返回上页
                                    </Button>

                                    <Button
                                        size={buttonSize}
                                        variant="ghost"
                                        leftIcon={<Icon as={FiSearch} />}
                                        onClick={handleSearch}
                                        flex={1}
                                        _hover={{
                                            transform: 'translateY(-1px)',
                                            bg: useColorModeValue('gray.100', 'gray.700')
                                        }}
                                        transition="all 0.2s"
                                    >
                                        打开美食地图
                                    </Button>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* 底部提示 */}
                    <Text
                        color={textColor}
                        fontSize="sm"
                        opacity={0.8}
                        animation={`${fadeIn} 1.2s ease-out`}
                    >
                        如需帮助，请联系我们的客服团队
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
}