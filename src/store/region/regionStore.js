import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { regionService } from '../../api/models/region/regionService';

// Zustand Store for Authentication
const regionStore = create(devtools((set, get) => ({
    regions: [],//用于存储地区列表，保证其他组件使用时不必再次请求
    hasLoaded: false,
    setRegions: async () => {
        try {
            if (get().hasLoaded) {
                return
            }
            const data = await regionService.getRegions();
            set({ regions: data, hasLoaded: true })
        } catch (err) {
            console.error('加载地区数据失败，请检查网络连接或服务器状态', err);
        }
    },

})), { name: 'regionStore' });

export default regionStore;
