import {
    ClipboardCheck,
    Handshake,
    MapPinHouse,
    MapPinned,
    Wheat,
    Award,
    BookOpen
} from 'lucide-react';

export const NAV_ITEMS = {
    THECHARTS: {
        title: "排行榜",
        icon: Award,
        to: "/thecharts",
        badge: "2025"
    },
    FOOD: {
        title: "美食图鉴",
        icon: BookOpen,
        to: "/eatlist"
    },
    INGREDIENT: {
        title: "食材图鉴",
        icon: Wheat,
        to: "/recipelist"
    },
    MAP: {
        title: "美食地图",
        icon: MapPinned,
        to: "/map"
    },
    ABOUT: {
        title: "关于我们",
        icon: Handshake,
        to: "/about"
    },
}

export const EXPLORE_ITEMS = {
    QUIZ: {
        title: "美食知识测验",
        icon: ClipboardCheck,
        to: "/quiz"
    },
    // NEARME: {
    //     title: "我附近的美食",
    //     icon: MapPinHouse,
    //     to: "/map"
    // },
}