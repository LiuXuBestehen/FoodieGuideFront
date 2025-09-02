import { request } from "../../request"
import { API_ENDPOINTS } from "../../config"

export const foodService = {

    // 分页查询美食
    getFoodByPage: async (page, page_size, filters) => {
        try {
            const response = await request.post(API_ENDPOINTS.FOOD_GET_BY_PAGE, filters, { page: page, page_size: page_size });
            return response.data;
        } catch (error) {
            console.error("Error fetching food list:", error);
            throw error;
        }
    },
    // 添加美食
    addFood: async (foodData) => {
        try {
            const response = await request.post(API_ENDPOINTS.FOOD_CREATE, foodData);
            return response.data;
        } catch (error) {
            console.error("Error adding food:", error);
            throw error;
        }
    },
    // 更新美食
    updateFood: async (foodData) => {
        try {
            const response = await request.post(API_ENDPOINTS.FOOD_UPDATE, foodData);
            return response.data;
        } catch (error) {
            console.error("Error updating food:", error);
            throw error;
        }
    },
    // 删除美食
    deleteFood: async (foodId) => {
        try {
            const response = await request.delete(`${API_ENDPOINTS.FOOD_DELETE}?food_id=${foodId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting food:", error);
            throw error;
        }
    },
    // 获取全部美食分类信息
    getFoodCategories: async () => {
        try {
            const response = await request.get(API_ENDPOINTS.FOOD_CATEGORIES);
            return response.data;
        } catch (error) {
            console.error("Error get food categories:", error);
            throw error;
        }
    },
    //获取前num个排行榜的信息
    getTheChartsFoods: async (num) => {
        try {
            const response = await request.get(API_ENDPOINTS.THE_CHARTS_FOODS, { num });
            return response.data;
        } catch (error) {
            console.error("Error get food the charts:", error);
            throw error;
        }
    },
    // 分页查询食材
    getIngredientByPage: async (page, page_size, filters) => {
        try {
            const response = await request.post(API_ENDPOINTS.INGREDIENT_GET_BY_PAGE, filters, { page: page, page_size: page_size });
            return response.data;
        } catch (error) {
            console.error("Error fetching food list:", error);
            throw error;
        }
    },
    // 添加食材
    addIngredient: async (ingredientData) => {
        try {
            const response = await request.post(API_ENDPOINTS.INGREDIENT_CREATE, ingredientData);
            return response.data;
        } catch (error) {
            console.error("Error adding food:", error);
            throw error;
        }
    },
    // 更新食材
    updateIngredient: async (ingredientData) => {
        try {
            const response = await request.post(API_ENDPOINTS.INGREDIENT_UPDATE, ingredientData);
            return response.data;
        } catch (error) {
            console.error("Error updating food:", error);
            throw error;
        }
    },
    // 删除食材
    deleteIngredient: async (ingredientId) => {
        try {
            const response = await request.delete(`${API_ENDPOINTS.INGREDIENT_DELETE}?ingredient_id=${ingredientId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting food:", error);
            throw error;
        }
    },
    // 分页查询问卷
    getQuestionnaireByPage: async (page, page_size, filters) => {
        try {
            const response = await request.post(API_ENDPOINTS.QUESTIONNAIRE_GET_BY_PAGE, filters, { page: page, page_size: page_size });
            return response.data;
        } catch (error) {
            console.error("Error fetching food list:", error);
            throw error;
        }
    },
    // 添加问卷
    addQuestionnaire: async (questionnaireData) => {
        try {
            const response = await request.post(API_ENDPOINTS.QUESTIONNAIRE_CREATE, questionnaireData);
            return response.data;
        } catch (error) {
            console.error("Error adding food:", error);
            throw error;
        }
    },
    // 更新问卷
    updateQuestionnaire: async (questionnaireData) => {
        try {
            const response = await request.post(API_ENDPOINTS.QUESTIONNAIRE_UPDATE, questionnaireData);
            return response.data;
        } catch (error) {
            console.error("Error updating food:", error);
            throw error;
        }
    },
    // 删除问卷
    deleteQuestionnaire: async (questionnaireId) => {
        try {
            const response = await request.delete(`${API_ENDPOINTS.QUESTIONNAIRE_DELETE}?questionnaire_id=${questionnaireId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting food:", error);
            throw error;
        }
    }
}