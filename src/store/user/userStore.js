import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getUserFromToken } from '../../utils/userUtils';
import { userConstitutionsEnums } from '../../constants/userEnums';

// Zustand Store for Authentication
const useAuthStore = create(devtools((set, get) => ({
    token: null,
    user: null,
    recommendIngredient: null,
    isLoading: false,

    setLoading: (isLoading) => set({ isLoading }),// 设置加载状态

    //登录：
    login: (token) => {
        const user = getUserFromToken(token);
        const rec = Object.values(userConstitutionsEnums).find(
            (option) => option.value === user.constitution
        )?.recommendIngredient;
        set({
            token,
            user,
            error: null,
            recommendIngredient: rec || null,
        });
        localStorage.setItem('auth_token', token); // 保存 token 到本地存储
    },

    // 登出：
    logout: () => {
        set({ token: null, user: null, error: null, recommendIngredient: null });
        localStorage.removeItem('auth_token'); // 清除本地存储的 token
    },
})), { name: 'authStore' });

export default useAuthStore;
