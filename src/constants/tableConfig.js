// 表结构配置
export const tableConfigs = {
    Foods: {
        name: '美食信息',
        fields: [
            { key: 'id', label: 'ID', type: 'number', readonly: true },
            { key: 'name', label: '名称', type: 'text', required: true, maxLength: 100 },
            { key: 'description', label: '描述', type: 'textarea' },
            { key: 'category', label: '标签', type: 'text', maxLength: 20 },
            { key: 'region_name', label: '所属地区', type: 'areaSelector', maxLength: 50 },
            { key: 'taste', label: '味道', type: 'textarea', maxLength: 255 },
            { key: 'ingredients', label: '所用食材', type: 'textarea' }, // 选项将动态加载
            { key: 'image_url', label: '展示图片链接', type: 'textarea' },
        ]
    },
    Ingredients: {
        name: '食材信息',
        fields: [
            { key: 'id', label: 'ID', type: 'number', readonly: true },
            { key: 'name', label: '名称', type: 'text', required: true, maxLength: 255 },
            { key: 'region_name', label: '所属地区', type: 'areaSelector', required: true, maxLength: 50 },
            { key: 'taste', label: '味道', type: 'textarea', maxLength: 255 },
            { key: 'effect', label: '食材功效', type: 'textarea' },
            { key: 'attribute', label: '食材属性', type: 'select', options: ['寒', '凉', '平', '温', '热'] },
            { key: 'image_url', label: '展示图片链接', type: 'textarea' },
        ]
    },
    Questionnaire: {
        name: '问卷试题',
        fields: [
            { key: 'id', label: 'ID', type: 'number', readonly: true },
            { key: 'title', label: '题目', type: 'textarea', required: true },
            { key: 'answer', label: '答案', type: 'textarea', required: true },
            { key: 'right_answer', label: '正确答案', type: 'text', required: true, maxLength: 2 },
        ]
    }
};