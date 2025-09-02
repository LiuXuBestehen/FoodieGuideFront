import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    Badge,
    Avatar,
    Card,
    CardBody,
    Divider,
    Icon,
    useColorModeValue,
    Flex,
    Heading,
    Stack,
    Input,
    Textarea,
    Select,
    IconButton,
    ButtonGroup,
    useToast,
    Tooltip,
} from '@chakra-ui/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { User, Mail, Phone, FileText, Shield, UserCheck, Edit2, Check, X } from 'lucide-react';
import { userConstitutionsEnums } from '../../constants/userEnums';
import { userService } from '../../api/models/user/userService';
import useAuthStore from '../../store/user/userStore'


const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'gray.50',
            },
        },
    },
});



const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const { user } = useAuthStore()
    // 编辑状态管理
    const [editingField, setEditingField] = useState(null);
    const toast = useToast();
    const refPhoneNumber = useRef(null)
    const refDescription = useRef(null)
    const refConstitution = useRef(null)
    const [isUserUpdate, toggleIsUserUpdate] = useState(false)

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        async function fetchUserInformation(id) {
            try {
                const result = await userService.getUserByID(id);
                if (!result.success) {
                    throw new Error(`请求查询用户接口失败，信息为${result.message}`);
                }
                setUserData(result.user)
            } catch (error) {
                console.error("请求获取用户信息报错", error);
            }
        }
        if (user !== null) {
            fetchUserInformation(user.user_id);
        }
    }, [user, isUserUpdate])

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'red';
            case 'user':
                return 'blue';
            case 'moderator':
                return 'purple';
            default:
                return 'gray';
        }
    };

    // 开始编辑
    const startEdit = (field) => {
        setEditingField(field);
    };

    // 保存编辑
    const saveEdit = async () => {
        try {

            const updateUserForm = {
                "phone_number": refPhoneNumber.current?.value ? refPhoneNumber.current.value : userData.phone_number,
                "description": refDescription.current?.value ? refDescription.current.value : userData.description,
                "constitution": refConstitution.current?.value ? refConstitution.current.value : userData.constitution
            }

            const result = await userService.updateUserByID(user.user_id, updateUserForm)

            if (!result.success) {
                toast({
                    title: "更新失败",
                    description: result.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                throw new Error(`更新用户信息失败:${result.message}`)
            }

            toggleIsUserUpdate(!isUserUpdate)
            setEditingField(null);
            toast({
                title: "更新成功",
                description: "用户信息已更新",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

        } catch (error) {
            console.error("更新用户信息失败", error);

        }
    };

    // 取消编辑
    const cancelEdit = () => {
        setEditingField(null);
    };

    // 可编辑信息项组件
    const EditableInfoItem = ({ icon, label, value, field, isTextarea = false, options = null }) => {
        const isEditing = editingField === field;

        return (
            <HStack spacing={4} py={3}>
                <Box
                    p={2}
                    borderRadius="lg"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    color={useColorModeValue('gray.600', 'gray.300')}
                >
                    <Icon as={icon} boxSize={5} />
                </Box>
                <Box flex={1}>
                    <Text fontSize="sm" color={textColor} fontWeight="medium">
                        {label}
                    </Text>
                    {isEditing ? (
                        <VStack align="stretch" spacing={2}>
                            {options ? (
                                <Select
                                    defaultValue={value || ""}
                                    ref={refConstitution}
                                    size="sm"
                                >
                                    <option value="" disabled hidden>请选择您的体质</option>
                                    {Object.values(options).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </Select>
                            ) : isTextarea ? (
                                <Textarea
                                    defaultValue={value}
                                    ref={refDescription}
                                    size="sm"
                                    placeholder={`请输入${label}`}
                                    rows={3}
                                />
                            ) : (
                                <Input
                                    defaultValue={value}
                                    ref={refPhoneNumber}
                                    size="sm"
                                    placeholder={`请输入${label}`}
                                />
                            )}
                            <ButtonGroup size="sm">
                                <IconButton
                                    icon={<Check size={16} />}
                                    colorScheme="green"
                                    onClick={saveEdit}
                                    aria-label="保存"
                                />
                                <IconButton
                                    icon={<X size={16} />}
                                    colorScheme="gray"
                                    onClick={cancelEdit}
                                    aria-label="取消"
                                />
                            </ButtonGroup>
                        </VStack>
                    ) : (
                        <HStack justify="space-between">
                            <Text fontSize="md" color={headingColor} fontWeight="semibold">
                                {value || '未设置'}
                            </Text>
                            <Tooltip label={`编辑${label}`}>
                                <IconButton
                                    icon={<Edit2 size={16} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => startEdit(field)}
                                    aria-label={`编辑${label}`}
                                />
                            </Tooltip>
                        </HStack>
                    )}
                </Box>
            </HStack>
        );
    };

    const InfoItem = ({ icon, label, value, isPrivate = false }) => (
        <HStack spacing={4} py={3}>
            <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('gray.100', 'gray.700')}
                color={useColorModeValue('gray.600', 'gray.300')}
            >
                <Icon as={icon} boxSize={5} />
            </Box>
            <Box flex={1}>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                    {label}
                </Text>
                <Text fontSize="md" color={headingColor} fontWeight="semibold">
                    {value || (isPrivate ? '未设置' : '暂无')}
                </Text>
            </Box>
        </HStack>
    );

    return (
        <ChakraProvider theme={theme}>
            <Container maxW="4xl" py={2}>
                <VStack spacing={6} align="stretch">

                    {/* 主要用户卡片 */}
                    <Card
                        bg={bgColor}
                        borderColor={borderColor}
                        borderWidth="1px"
                        shadow="lg"
                        borderRadius="xl"
                        overflow="hidden"
                    >
                        <CardBody p={0}>
                            {/* 用户头像和基本信息区域 */}
                            <Box
                                bgGradient="linear(135deg, purple.400, blue.400)"
                                color="white"
                                p={8}
                                textAlign="center"
                                position="relative"
                            >
                                <Avatar
                                    size="2xl"
                                    name={userData.username}
                                    bg="whiteAlpha.300"
                                    color="white"
                                    mb={4}
                                    border="4px solid"
                                    borderColor="whiteAlpha.300"
                                />
                                <VStack spacing={2}>
                                    <Heading size="lg" fontWeight="bold">
                                        {userData.username}
                                    </Heading>
                                    <HStack>
                                        <Badge
                                            colorScheme={getRoleBadgeColor(userData.role)}
                                            variant="solid"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            textTransform="uppercase"
                                            fontSize="xs"
                                            fontWeight="bold"
                                        >
                                            {userData.role}
                                        </Badge>
                                        <Badge
                                            variant="solid"
                                            colorScheme="green"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            fontSize="xs"
                                            borderColor="whiteAlpha.400"
                                            color="white"
                                        >
                                            {userData.constitution}
                                        </Badge>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* 详细信息区域 */}
                            <Box p={8}>
                                <VStack spacing={1} align="stretch">
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color={headingColor}
                                        mb={4}
                                    >
                                        详细信息
                                    </Text>

                                    <Stack spacing={0} divider={<Divider />}>
                                        <InfoItem
                                            icon={User}
                                            label="用户名"
                                            value={userData.username}
                                        />
                                        <InfoItem
                                            icon={Mail}
                                            label="邮箱地址"
                                            value={userData.email}
                                        />
                                        <EditableInfoItem
                                            icon={Phone}
                                            label="手机号码"
                                            value={userData.phone_number}
                                            field="phone_number"
                                        />
                                        <EditableInfoItem
                                            icon={FileText}
                                            label="个人描述"
                                            value={userData.description}
                                            field="description"
                                            isTextarea={true}
                                        />
                                        <EditableInfoItem
                                            icon={UserCheck}
                                            label="用户类型（设置体质，可以在食材图鉴看到体质推荐食物）"
                                            value={userData.constitution}
                                            field="constitution"
                                            options={userConstitutionsEnums}
                                        />
                                        <InfoItem
                                            icon={Shield}
                                            label="用户角色"
                                            value={userData.role === "admin" ? "管理员" : "普通用户"}
                                        />
                                    </Stack>
                                </VStack>
                            </Box>
                        </CardBody>
                    </Card>


                </VStack>
            </Container>
        </ChakraProvider>
    );
};

export default UserProfile;