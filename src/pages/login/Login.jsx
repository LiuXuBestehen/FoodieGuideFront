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
import useAuthStore from '../../store/user/userStore';
import { userService } from '../../api/models/user/userService';
import FormContainer from '../../components/login/FormContainer';
import PasswordInput from '../../components/login/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validaUtils';


// 登录页面组件
const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const { isLoading, setLoading, login } = useAuthStore();
    const navigate = useNavigate();
    const toast = useToast();

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
            case 'email':
                fieldErrors = validateEmail(value);
                break;
            case 'password':
                fieldErrors = validatePassword(value);
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
        const fields = ['email', 'password'];
        let isValid = true;

        fields.forEach(field => {
            const fieldValid = validateField(field, formData[field]);
            if (!fieldValid) isValid = false;
            setTouched(prev => ({ ...prev, [field]: true }));
        });

        return isValid;
    };

    // 处理回车键登录
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && canSubmit()) {
            handleSubmit();
        }
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
            const result = await userService.login(
                formData.email.trim(),
                formData.password
            );

            if (result.success) {
                toast({
                    title: '登录成功',
                    description: '欢迎回来！',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });

                // 这里需要根据你的状态管理调用登录方法
                login(result.token);
                navigate("/")
            } else {
                toast({
                    title: '登录失败',
                    description: result.message || '请检查您的邮箱和密码',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            toast({
                title: '登录失败',
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
        const hasData = formData.email && formData.password;
        const noErrors = !errors.email && !errors.password;
        return hasData && noErrors;
    };

    return (
        <FormContainer
            title="登录"
            subtitle="请输入您的账户信息"
        >
            <VStack spacing={4} align="stretch">

                <FormControl isRequired isInvalid={touched.email && !!errors.email}>
                    <FormLabel>邮箱</FormLabel>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        onBlur={handleBlur('email')}
                        onKeyPress={handleKeyPress}
                        placeholder="请输入邮箱"
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
                    onKeyPress={handleKeyPress}
                    placeholder="请输入密码"
                    error={touched.password ? errors.password : ''}
                />

                <Button
                    colorScheme="blue"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="登录中..."
                    onClick={handleSubmit}
                    isDisabled={!canSubmit()}
                >
                    登录
                </Button>

                <Box textAlign="center">
                    <Text fontSize="sm" color="gray.600">
                        还没有账户？{' '}
                        <Link to='/register' style={{ color: '#3182ce' }}>
                            立即注册
                        </Link>
                    </Text>
                </Box>
            </VStack>
        </FormContainer>
    );
};

export default LoginPage;