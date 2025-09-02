import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack,
    Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/user/userStore';
import { userService } from '../../api/models/user/userService';
import FormContainer from '../../components/login/FormContainer';
import PasswordInput from '../../components/login/PasswordInput';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validaUtils';


// 注册页面组件
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const { isLoading, setLoading } = useAuthStore();
    const toast = useToast();
    const navigate = useNavigate();

    // 处理输入变化
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // 实时验证
        if (touched[field]) {
            validateField(field, value);
        }
    };

    // 处理失焦事件
    const handleBlur = (field) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field]);
    };

    // 验证单个字段
    const validateField = (field, value) => {
        let fieldErrors = [];

        switch (field) {
            case 'name':
                fieldErrors = validateUsername(value);
                break;
            case 'email':
                fieldErrors = validateEmail(value);
                break;
            case 'password':
                fieldErrors = validatePassword(value);
                break;
            case 'confirmPassword':
                if (!value) {
                    fieldErrors = ['请确认密码'];
                } else if (value !== formData.password) {
                    fieldErrors = ['两次输入的密码不一致'];
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: fieldErrors.length > 0 ? fieldErrors[0] : ''
        }));

        return fieldErrors.length === 0;
    };

    // 验证所有字段
    const validateAllFields = () => {
        const fields = ['name', 'email', 'password', 'confirmPassword'];
        let isValid = true;

        fields.forEach(field => {
            const fieldValid = validateField(field, formData[field]);
            if (!fieldValid) isValid = false;
            setTouched(prev => ({ ...prev, [field]: true }));
        });

        return isValid;
    };

    // 提交表单
    const handleSubmit = async () => {
        if (!validateAllFields()) {
            toast({
                title: '表单验证失败',
                description: '请检查并修正输入错误',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setLoading(true);

        try {
            // 这里替换为你的实际 API 调用
            const result = await userService.register({
                username: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            if (result.success) {
                toast({
                    title: '注册成功',
                    description: '欢迎加入我们！',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                navigate("/login");
            } else {
                toast({
                    title: '注册失败',
                    description: result.message || '请检查您的输入',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            toast({
                title: '注册失败',
                description: '网络错误，请稍后重试',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setLoading(false);
        }
    };

    // 检查表单是否可以提交
    const canSubmit = () => {
        const hasData = formData.name && formData.email &&
            formData.password && formData.confirmPassword;
        const noErrors = !errors.name && !errors.email &&
            !errors.password && !errors.confirmPassword;
        return hasData && noErrors;
    };

    return (
        <FormContainer
            title="注册"
            subtitle="创建您的新账户"
        >
            <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={touched.name && !!errors.name}>
                    <FormLabel>用户名</FormLabel>
                    <Input
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        onBlur={handleBlur('name')}
                        placeholder="4-20个字符，支持字母数字下划线"
                    />
                    {touched.name && errors.name && (
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isRequired isInvalid={touched.email && !!errors.email}>
                    <FormLabel>邮箱</FormLabel>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        onBlur={handleBlur('email')}
                        placeholder="请输入有效的邮箱地址"
                    />
                    {touched.email && errors.email && (
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                </FormControl>

                <PasswordInput
                    label="密码"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="至少8位，包含大小写字母、数字、特殊字符"
                    error={touched.password ? errors.password : ''}
                />

                <PasswordInput
                    label="确认密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="请再次输入密码"
                    error={touched.confirmPassword ? errors.confirmPassword : ''}
                />

                <Button
                    colorScheme="blue"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="注册中..."
                    onClick={handleSubmit}
                    isDisabled={!canSubmit()}
                >
                    注册
                </Button>

                <Box textAlign="center">
                    <Text fontSize="sm" color="gray.600">
                        已有账户？{' '}
                        <Link style={{ color: '#3182ce' }} to='/login'>
                            立即登录
                        </Link>
                    </Text>
                </Box>
            </VStack>
        </FormContainer>
    );
};

export default RegisterPage;