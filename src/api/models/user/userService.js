import { request } from '../../request';
import { API_ENDPOINTS } from '../../config';

export const userService = {  /**
     * 登录
     * @returns {Promise} token会注册到local storage
     */
    login: async (email, password) => {

        try {
            const response = await request.post(API_ENDPOINTS.USER_LOGIN, {
                email,
                password
            });
            if (response.success) {
                return { success: true, token: response.data.access_token };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, message: '登录失败，请重试' };
        }
    },

    /**
     * 注册
     * @param {Object} userData - 用户信息
     * @returns {Promise} 注册返回用户信息
     */
    register: async (userData) => {

        try {
            const response = await request.post(API_ENDPOINTS.USER_REGISTER, userData);

            if (response.success) {
                return { success: true, user: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('注册失败:', error);
            return { success: false, message: '注册失败，请重试' };
        }
    },

    /**
     * 通过ID获取用户信息
     * @param {int} userId - 用户id
     */

    getUserByID: async (userId) => {
        try {
            const response = await request.get(API_ENDPOINTS.USER_PROFILE, { user_id: userId });

            if (response.success) {
                return { success: true, user: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('获取用户信息失败:', error);
            return { success: false, message: '获取用户信息失败，请重试' };
        }
    },

    /**
     * 
     * 更新用户信息，通过id
     * 
     */
    updateUserByID: async (userId, updateUserData) => {
        try {
            const response = await request.post(API_ENDPOINTS.USER_UPDATE, updateUserData, { user_id: userId });

            if (response.success) {
                return { success: true, user: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('更新用户信息失败:', error);
            return { success: false, message: '更新用户信息失败，请重试' };
        }
    },
    //根据userID获取其喜欢的美食列表
    getUserLikedFoods: async (userId) => {
        try {
            const response = await request.get(API_ENDPOINTS.USER_LIKED_FOODS, { user_id: userId })

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('获取用户喜欢美食列表失败:', error);
            return { success: false, message: '获取用户喜欢美食列表失败' };
        }
    },
    //根据userID获取其喜欢的美食列表IDS
    getUserLikedFoodsIDS: async (userId) => {
        try {
            const response = await request.get(API_ENDPOINTS.USER_LIKED_FOODS_IDS, { user_id: userId })

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('获取用户喜欢美食列表IDS失败:', error);
            return { success: false, message: '获取用户喜欢美食列表IDS失败' };
        }
    },
    /**
     * 添加美食到用户喜欢
     */
    addFoodToUserLiked: async (userId, foodId) => {
        try {
            const response = await request.post(API_ENDPOINTS.USER_LIKED_FOODS_CREATE, { user_id: userId, food_id: foodId })

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('添加美食到用户喜欢失败:', error);
            return { success: false, message: '添加美食到用户喜欢失败' };
        }
    },
    /**
     * 删除美食从用户喜欢
     */
    deleteFoodFromUserLiked: async (userId, foodId) => {
        try {
            const response = await request.post(API_ENDPOINTS.USER_LIKED_FOODS_DELETE, { user_id: userId, food_id: foodId })

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.log('从用户喜欢移除美食失败:', error);
            return { success: false, message: '从用户喜欢移除美食失败' };
        }
    }
};