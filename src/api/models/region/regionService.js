import { request } from '../../request';
import { API_ENDPOINTS } from '../../config';

export const regionService = {
    /**
     * 获取所有地区列表
     * @returns {Promise} 地区数据
     */
    getRegions: async () => {
        try {
            const data = await request.get(API_ENDPOINTS.REGIONS);
            return data.data;
        } catch (error) {
            console.error('获取地区列表失败:', error);
            throw error;
        }
    },

    /**
     * 根据 ID 获取地区详情
     * @param {number} id - 地区 ID
     * @returns {Promise} 地区详情
     */
    getRegionById: async (id) => {
        try {
            const data = await request.get(`${API_ENDPOINTS.REGION_BY_ID}/${id}`);
            return data;
        } catch (error) {
            console.error(`获取地区详情失败 (ID: ${id}):`, error);
            throw error;
        }
    },

    /**
     * 获取全部食物和对应地区信息
     */
    getFoodsAndRegions: async () => {
        try {
            const data = await request.get(API_ENDPOINTS.REGIONS_FOODS);
            return data.data;
        } catch (error) {
            console.error(`获取全部食物和对应地区信息失败:`, error);
            throw error;
        }
    },
};