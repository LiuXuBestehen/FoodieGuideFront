import axios from 'axios';
import {
    API_BASE_URL,
    REQUEST_TIMEOUT,
    HTTP_STATUS,
    ERROR_MESSAGES
} from './config';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 添加认证 token
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求时间戳（防止缓存）
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }

        // 打印请求信息（开发环境）
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 API Request:', {
                url: config.url,
                method: config.method,
                data: config.data,
                params: config.params
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 打印响应信息（开发环境）
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ API Response:', {
                url: response.config.url,
                status: response.status,
                data: response.data
            });
        }

        // 直接返回数据部分
        return response.data;
    },
    (error) => {
        // 错误处理
        let errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        let errorCode = null;

        if (error.response) {
            // 服务器返回错误状态码
            const { status, data } = error.response;
            errorCode = status;

            switch (status) {
                case HTTP_STATUS.BAD_REQUEST:
                    errorMessage = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
                    break;
                case HTTP_STATUS.UNAUTHORIZED:
                    errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
                    // 清除本地 token，跳转到登录页
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                    break;
                case HTTP_STATUS.FORBIDDEN:
                    errorMessage = ERROR_MESSAGES.FORBIDDEN;
                    break;
                case HTTP_STATUS.NOT_FOUND:
                    errorMessage = ERROR_MESSAGES.NOT_FOUND;
                    break;
                case HTTP_STATUS.SERVER_ERROR:
                    errorMessage = ERROR_MESSAGES.SERVER_ERROR;
                    break;
                default:
                    errorMessage = data?.message || `请求失败 (${status})`;
            }
        } else if (error.request) {
            // 请求发出但无响应
            if (error.code === 'ECONNABORTED') {
                errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
            } else {
                errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
            }
        }

        console.error('❌ API Error:', {
            message: errorMessage,
            code: errorCode,
            error: error
        });

        // 创建统一的错误对象
        const apiError = new Error(errorMessage);
        apiError.code = errorCode;
        apiError.originalError = error;

        return Promise.reject(apiError);
    }
);

// 导出封装好的请求方法
export const request = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data = {}, params = {}) => apiClient.post(url, data, { params }),
    put: (url, data = {}) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
    patch: (url, data = {}) => apiClient.patch(url, data),
};

export default apiClient;
