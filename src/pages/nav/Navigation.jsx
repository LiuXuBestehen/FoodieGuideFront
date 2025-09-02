import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Avatar,
    Badge,
    Divider,
    useColorModeValue,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import {
    Search,
    Globe,
    MapPin,
    Award,
    BookOpen,
    User,
    ChevronDown,
    Star,
    Heart,
    Utensils,
    Wheat,
    MapPinned,
    Menu as MenuIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS, EXPLORE_ITEMS } from '../../constants/navEnums';
import useAuthStore from '../../store/user/userStore';
import { useNavigate } from 'react-router-dom';
import regionStore from '../../store/region/regionStore';
import AreaSelector from '../../components/ui/AreaSelector';

const Navigation = () => {
    const { token, logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { setRegions } = regionStore()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'white');
    const hoverBg = useColorModeValue('orange.50', 'orange.900');
    const orangeColor = useColorModeValue('orange.500', 'orange.300');

    useEffect(() => {
        setRegions();
    }, [])

    useEffect(() => {
    }, [user])

    const NavItem = ({ children, icon: Icon, badge, ...props }) => (
        <Button
            variant="ghost"
            leftIcon={Icon && <Icon size={18} />}
            color={textColor}
            fontSize="sm"
            fontWeight="500"
            _hover={{ bg: hoverBg, color: orangeColor }}
            _active={{ bg: 'orange.100' }}
            position="relative"
            {...props}
        >
            {children}
            {badge && (
                <Badge
                    colorScheme="orange"
                    fontSize="xs"
                    position="absolute"
                    top="-1"
                    right="-1"
                    borderRadius="full"
                >
                    {badge}
                </Badge>
            )}
        </Button>
    );

    const MobileNavItem = ({ children, icon: Icon, badge, to, onClick }) => (
        <Link to={to} onClick={onClick}>
            <Flex
                align="center"
                p={3}
                borderRadius="md"
                _hover={{ bg: hoverBg }}
                cursor="pointer"
                position="relative"
            >
                {Icon && <Icon size={20} style={{ marginRight: '12px' }} />}
                <Text fontSize="md" fontWeight="500">
                    {children}
                </Text>
                {badge && (
                    <Badge
                        colorScheme="orange"
                        fontSize="xs"
                        ml="auto"
                        borderRadius="full"
                    >
                        {badge}
                    </Badge>
                )}
            </Flex>
        </Link>
    );

    const logoutNav = () => {
        logout();
        navigate('/');
        onClose(); // 关闭移动端菜单
    }

    const handleMobileNavClick = () => {
        onClose(); // 点击菜单项后关闭抽屉
    }

    return (
        <Box
            bg={bgColor}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={1000}
            boxShadow="sm"
        >
            {/* 主导航栏 */}
            <Flex
                h="70px"
                align="center"
                justify="space-between"
                maxW="1200px"
                mx="auto"
                px={4}
            >
                {/* Logo */}
                <Link to={"/"}>
                    <Flex align="center" cursor="pointer">
                        <Box
                            w="40px"
                            h="40px"
                            bg="orange.500"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mr={3}
                        >
                            <Utensils color="white" size={24} />
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="l"
                                fontWeight="bold"
                                color={orangeColor}
                                lineHeight="1.2"
                            >
                                吃货指南
                            </Text>
                            <Text fontSize="xs" color={textColor} lineHeight="1">
                                探索 中国 美食
                            </Text>
                        </VStack>
                    </Flex>
                </Link>

                {/* 桌面端导航项 */}
                <HStack spacing={2} display={{ base: 'none', lg: 'flex' }}>
                    {NAV_ITEMS && Object.values(NAV_ITEMS).map((item) => (
                        <Link to={item.to} key={item.title}>
                            <NavItem icon={item.icon} badge={item.badge}>
                                {item.title}
                            </NavItem>
                        </Link>
                    ))}

                    <Menu>
                        <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDown size={16} />} fontWeight={"normal"}>
                            <Flex align="center">
                                <Globe size={18} style={{ marginRight: '8px' }} />
                                探索
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            {EXPLORE_ITEMS && Object.values(EXPLORE_ITEMS).map((item) => (
                                <Link to={item.to} key={item.title}>
                                    <MenuItem key={item.title} icon={<item.icon size={16} />}>
                                        {item.title}
                                    </MenuItem>
                                </Link>
                            ))}
                        </MenuList>
                    </Menu>
                </HStack>

                {/* 移动端和用户操作区域 */}
                <HStack spacing={2}>
                    {/* 移动端汉堡菜单按钮 */}
                    <IconButton
                        icon={<MenuIcon size={20} />}
                        variant="ghost"
                        color={textColor}
                        _hover={{ bg: hoverBg }}
                        onClick={onOpen}
                        display={{ base: 'flex', lg: 'none' }}
                        aria-label="打开菜单"
                    />

                    {/* 用户头像菜单 */}
                    <Menu>
                        <MenuButton>
                            <Avatar size="sm" bg={orangeColor} name={user?.username ? user.username : ""} color={"white"} />
                        </MenuButton>
                        <MenuList>
                            {user && (<>
                                <Link to={"/user/userprofile"}>
                                    <MenuItem icon={<User size={16} />}>个人资料</MenuItem>
                                </Link>
                                <Link to={"/user/userfavorite"}>
                                    <MenuItem icon={<Heart size={16} />}>我的收藏</MenuItem>
                                </Link>
                                <Divider />
                            </>)}

                            {user && user.role === "admin" && (
                                <Link to="/tablemanagement">
                                    <MenuItem icon={<Star size={16} />}>信息管理</MenuItem>
                                </Link>
                            )}

                            {token ?
                                <MenuItem onClick={logoutNav}>
                                    退出登录
                                </MenuItem> :
                                <Link to="/login">
                                    <MenuItem>登录</MenuItem>
                                </Link>
                            }
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>

            {/* 移动端侧边栏抽屉 */}
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="sm"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        <Flex align="center">
                            <Box
                                w="32px"
                                h="32px"
                                bg="orange.500"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mr={3}
                            >
                                <Utensils color="white" size={20} />
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" color={orangeColor}>
                                吃货指南
                            </Text>
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody p={0}>
                        <VStack spacing={0} align="stretch">
                            {/* 主导航项 */}
                            {NAV_ITEMS && Object.values(NAV_ITEMS).map((item) => (
                                <MobileNavItem
                                    key={item.title}
                                    icon={item.icon}
                                    badge={item.badge}
                                    to={item.to}
                                    onClick={handleMobileNavClick}
                                >
                                    {item.title}
                                </MobileNavItem>
                            ))}

                            {/* 探索菜单 */}
                            <Box p={3}>
                                <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                    探索
                                </Text>
                                <VStack spacing={1} align="stretch">
                                    {EXPLORE_ITEMS && Object.values(EXPLORE_ITEMS).map((item) => (
                                        <MobileNavItem
                                            key={item.title}
                                            icon={item.icon}
                                            to={item.to}
                                            onClick={handleMobileNavClick}
                                        >
                                            {item.title}
                                        </MobileNavItem>
                                    ))}
                                </VStack>
                            </Box>

                            {/* 用户相关菜单 */}
                            {user && (
                                <Box p={3} borderTopWidth="1px">
                                    <Text fontSize="sm" fontWeight="600" color="gray.500" mb={2}>
                                        我的账户
                                    </Text>
                                    <VStack spacing={1} align="stretch">
                                        <MobileNavItem
                                            icon={User}
                                            to="/user/userprofile"
                                            onClick={handleMobileNavClick}
                                        >
                                            个人资料
                                        </MobileNavItem>
                                        <MobileNavItem
                                            icon={Heart}
                                            to="/user/userfavorite"
                                            onClick={handleMobileNavClick}
                                        >
                                            我的收藏
                                        </MobileNavItem>
                                        {user.role === "admin" && (
                                            <MobileNavItem
                                                icon={Star}
                                                to="/tablemanagement"
                                                onClick={handleMobileNavClick}
                                            >
                                                信息管理
                                            </MobileNavItem>
                                        )}
                                    </VStack>
                                </Box>
                            )}

                            {/* 登录/退出按钮 */}
                            <Box p={3} borderTopWidth="1px">
                                {token ? (
                                    <Button
                                        leftIcon={<User size={18} />}
                                        variant="ghost"
                                        w="full"
                                        justifyContent="flex-start"
                                        onClick={logoutNav}
                                    >
                                        退出登录
                                    </Button>
                                ) : (
                                    <Link to="/login">
                                        <Button
                                            leftIcon={<User size={18} />}
                                            variant="ghost"
                                            w="full"
                                            justifyContent="flex-start"
                                            onClick={handleMobileNavClick}
                                        >
                                            登录
                                        </Button>
                                    </Link>
                                )}
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navigation;