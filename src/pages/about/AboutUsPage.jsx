import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Avatar,
    Badge,
    Divider,
    SimpleGrid,
    Icon,
    Link,
    useColorModeValue,
    Flex,
    Center
} from '@chakra-ui/react';
import { Heart, Users, Target, Mail, MessageCircle, Smartphone } from 'lucide-react';

const AboutUsPage = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const accentColor = useColorModeValue('orange.500', 'orange.300');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Hero Section */}
            {/* <Box
                bgGradient="linear(to-r, orange.400, red.400)"
                color="white"
                py={16}
                textAlign="center"
            >
                <Container maxW="4xl">
                    <Heading size="2xl" mb={4}>
                        关于我们
                    </Heading>
                    <Text fontSize="xl" opacity={0.9}>
                        用美食连接世界，让分享成为习惯
                    </Text>
                </Container>
            </Box> */}

            <Container maxW="6xl" py={12}>
                <VStack spacing={16}>

                    {/* Our Story Section */}
                    <Box w="full">
                        <Center mb={8}>
                            <HStack>
                                <Icon as={Heart} color={accentColor} boxSize={8} />
                                <Heading size="xl" color={accentColor}>我们的故事</Heading>
                            </HStack>
                        </Center>

                        <Card bg={cardBg} shadow="lg" borderRadius="xl">
                            <CardBody p={8}>
                                <VStack spacing={6} align="stretch">
                                    <Box textAlign="center">
                                        <Text fontSize="lg" color={textColor} lineHeight="tall">
                                            <Text as="span" fontWeight="bold" color={accentColor}>起源</Text>
                                            ：源于对美食的热爱，行于对伙伴的分享，终于美食入腹的满足
                                        </Text>
                                    </Box>

                                    <Divider />

                                    <Box textAlign="center">
                                        <Text fontSize="lg" fontWeight="semibold" mb={2}>核心理念 / 愿景</Text>
                                        <Text color={textColor} lineHeight="tall">
                                            希望通过这个网站分享和记录美食信息，以美食连接伙伴
                                        </Text>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>

                    {/* Mission and Values Section */}
                    <Box w="full">
                        <Center mb={8}>
                            <HStack>
                                <Icon as={Target} color={accentColor} boxSize={8} />
                                <Heading size="xl" color={accentColor}>我们的使命和价值观</Heading>
                            </HStack>
                        </Center>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Card bg={cardBg} shadow="lg" borderRadius="xl">
                                <CardBody p={6}>
                                    <VStack align="stretch" spacing={4}>
                                        <Heading size="md" color={accentColor}>使命</Heading>
                                        <Text color={textColor} lineHeight="tall">
                                            致力于为中国美食爱好者提供最全面、最地道的美食和食材信息。
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>

                            <Card bg={cardBg} shadow="lg" borderRadius="xl">
                                <CardBody p={6}>
                                    <VStack align="stretch" spacing={4}>
                                        <Heading size="md" color={accentColor}>价值观</Heading>
                                        <Text color={textColor} mb={4}>网站运营的原则：</Text>
                                        <HStack spacing={3} flexWrap="wrap">
                                            <Badge colorScheme="orange" px={3} py={1} borderRadius="full">真实</Badge>
                                            <Badge colorScheme="red" px={3} py={1} borderRadius="full">分享</Badge>
                                            <Badge colorScheme="green" px={3} py={1} borderRadius="full">健康</Badge>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </SimpleGrid>
                    </Box>

                    {/* Team Section */}
                    <Box w="full">
                        <Center mb={8}>
                            <HStack>
                                <Icon as={Users} color={accentColor} boxSize={8} />
                                <Heading size="xl" color={accentColor}>我们的团队</Heading>
                            </HStack>
                        </Center>

                        <Card bg={cardBg} shadow="lg" borderRadius="xl" maxW="2xl" mx="auto">
                            <CardBody p={8}>
                                <VStack spacing={6}>
                                    <Avatar
                                        size="2xl"
                                        name="刘旭"
                                        bg="orange.500"
                                        color="white"
                                    />

                                    <VStack spacing={2}>
                                        <Heading size="lg">刘旭</Heading>
                                        <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                                            独立开发者
                                        </Badge>
                                    </VStack>

                                    <Text color={textColor} textAlign="center" lineHeight="tall">
                                        不断学习可以更好的适应，而思考引领改变
                                    </Text>

                                    <Box
                                        bg={useColorModeValue('orange.50', 'orange.900')}
                                        p={4}
                                        borderRadius="lg"
                                        borderLeft="4px solid"
                                        borderColor={accentColor}
                                    >
                                        <Text
                                            fontStyle="italic"
                                            color={textColor}
                                            textAlign="center"
                                            lineHeight="tall"
                                        >
                                            "我于世界之小，仿若一只在知识瀚海中遨游的鲸鱼：求知若渴、虚心若愚！"
                                        </Text>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>

                    {/* Contact Section */}
                    <Box w="full">
                        <Center mb={8}>
                            <HStack>
                                <Icon as={Mail} color={accentColor} boxSize={8} />
                                <Heading size="xl" color={accentColor}>联系方式</Heading>
                            </HStack>
                        </Center>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Card bg={cardBg} shadow="lg" borderRadius="xl">
                                <CardBody p={6}>
                                    <VStack align="stretch" spacing={4}>
                                        <Heading size="md" mb={4}>基本联系</Heading>

                                        <HStack>
                                            <Icon as={Mail} color={accentColor} />
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="semibold">邮箱</Text>
                                                <Link
                                                    href="mailto:981098693@qq.com"
                                                    color={accentColor}
                                                    _hover={{ textDecoration: 'underline' }}
                                                >
                                                    981098693@qq.com
                                                </Link>
                                            </VStack>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>

                            <Card bg={cardBg} shadow="lg" borderRadius="xl">
                                <CardBody p={6}>
                                    <VStack align="stretch" spacing={4}>
                                        <Heading size="md" mb={4}>社交媒体</Heading>

                                        <VStack align="stretch" spacing={3}>
                                            <HStack>
                                                <Icon as={MessageCircle} color="red.500" />
                                                <VStack align="start" spacing={1}>
                                                    <Text fontWeight="semibold">小红书</Text>
                                                    <Text color={textColor}>515049435</Text>
                                                </VStack>
                                            </HStack>

                                            <HStack>
                                                <Icon as={Smartphone} color="blue.500" />
                                                <VStack align="start" spacing={1}>
                                                    <Text fontWeight="semibold">抖音</Text>
                                                    <Text color={textColor}>623783445</Text>
                                                </VStack>
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </SimpleGrid>

                        <Card bg={cardBg} shadow="lg" borderRadius="xl" mt={8}>
                            <CardBody p={6}>
                                <VStack spacing={4}>
                                    <Heading size="md" color={accentColor}>商务合作</Heading>
                                    <Text color={textColor} textAlign="center">
                                        如果有合作咨询、媒体联系等特定需求，可以联系
                                    </Text>
                                    <Badge colorScheme="green" px={4} py={2} borderRadius="full" fontSize="md">
                                        微信：LiuXuBestehen
                                    </Badge>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                </VStack>
            </Container>

            {/* Footer */}
            <Box bg={useColorModeValue('gray.100', 'gray.800')} py={8} mt={16}>
                <Container maxW="4xl">
                    <Text textAlign="center" color={textColor}>
                        © 2025 吃货指南. 用美食连接世界，让分享成为习惯
                    </Text>
                </Container>
            </Box>
        </Box>
    );
};

export default AboutUsPage;