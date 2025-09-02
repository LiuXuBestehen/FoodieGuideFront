import { useEffect, useState } from 'react';

// 方案1: 自定义防抖 Hook
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// 方案2: 基于长度的防抖 Hook
export const useLengthDebounce = (value, targetLength, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    const [shouldTrigger, setShouldTrigger] = useState(false);

    useEffect(() => {
        if (value.length === targetLength) {
            // 达到目标长度，立即触发
            setDebouncedValue(value);
            setShouldTrigger(true);
        } else if (value.length > targetLength) {
            // 超过目标长度，防抖处理
            const handler = setTimeout(() => {
                setDebouncedValue(value);
                setShouldTrigger(true);
            }, delay);

            return () => {
                clearTimeout(handler);
                setShouldTrigger(false);
            };
        } else {
            // 未达到目标长度，清空
            setDebouncedValue('');
            setShouldTrigger(false);
        }
    }, [value, targetLength, delay]);

    return { debouncedValue, shouldTrigger };
};

