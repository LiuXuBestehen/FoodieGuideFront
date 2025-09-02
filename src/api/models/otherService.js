import {
    ChefHat,
    Users,
    Heart,
    Award,
} from 'lucide-react';
import apiClient from "../request";
import { API_ENDPOINTS } from "../config";

export const otherService = {
    /**
     * 
     * 获取首页展示数据
     */
    getHomePageData: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.INDEX_STATS);
            if (!response.success) {
                throw new Error("获取首页数据失败");
            }
            return [
                { icon: ChefHat, value: String(response.data.food), label: '精选美食', name: "food" },
                { icon: Users, value: String(response.data.user), label: '美食爱好者', name: "user" },
                { icon: Award, value: String(response.data.ingredient), label: '绿色食材', name: "ingredient" },
                { icon: Heart, value: String(response.data.collect), label: '点赞收藏', name: "collect" }
            ]
        } catch (error) {
            console.error("Error fetching home page data:", error);
            throw error;
        }
    }
}