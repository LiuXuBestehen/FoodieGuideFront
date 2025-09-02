// API 基础配置文件

// 环境配置


// 获取当前环境的 API 基础地址
export const API_BASE_URL = import.meta.env.VITE_API_URL;



// 接口地址常量
export const API_ENDPOINTS = {
    // 地区相关
    REGIONS: '/region/getRegions',
    REGIONS_FOODS: '/region/getRegionsAndFoods',

    // 用户相关
    USER_LOGIN: '/user/login',
    USER_REGISTER: '/user/register',
    USER_PROFILE: '/user/getUserById',
    USER_UPDATE: '/user/updateUserById',
    USER_LIKED_FOODS: '/user/getUserLikedFoods',
    USER_LIKED_FOODS_IDS: '/user/getUserLikedFoodsIds',
    USER_LIKED_FOODS_CREATE: '/user/createUserLikedFood',
    USER_LIKED_FOODS_DELETE: '/user/deleteUserLikedFood',

    // 美食相关
    FOOD_GET_BY_PAGE: '/food/getFoodByPage',
    FOOD_CREATE: '/food/createFood',
    FOOD_UPDATE: '/food/updateFood',
    FOOD_DELETE: '/food/deleteFood',
    FOOD_CATEGORIES: '/food/getFoodCategories',
    THE_CHARTS_FOODS: 'food/getFoodTheChartsInNum',

    // 食材相关
    INGREDIENT_GET_BY_PAGE: '/food/getIngredientByPage',
    INGREDIENT_CREATE: '/food/createIngredient',
    INGREDIENT_UPDATE: '/food/updateIngredient',
    INGREDIENT_DELETE: '/food/deleteIngredient',

    // 问卷相关
    QUESTIONNAIRE_GET_BY_PAGE: '/food/getQuestionnaireByPage',
    QUESTIONNAIRE_CREATE: '/food/createQuestionnaire',
    QUESTIONNAIRE_UPDATE: '/food/updateQuestionnaire',
    QUESTIONNAIRE_DELETE: '/food/deleteQuestionnaire',

    //其他
    INDEX_STATS: '/stats',
};

// 请求超时配置
export const REQUEST_TIMEOUT = 10000;

// 状态码映射
export const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

// 错误消息映射
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    TIMEOUT_ERROR: '请求超时，请稍后重试',
    SERVER_ERROR: '服务器错误，请稍后重试',
    UNAUTHORIZED: '未授权访问，请重新登录',
    FORBIDDEN: '权限不足，无法访问',
    NOT_FOUND: '请求的资源不存在',
    VALIDATION_ERROR: '数据验证失败',
};

