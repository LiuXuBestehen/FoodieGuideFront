
import { useRoutes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import FoodCardsShowcase from '../pages/eatlist/FoodCardsShowcase'
import IngredientCardsShowcase from '../pages/eatlist/IngredientCardsShowcase'
import LoginPage from '../pages/login/Login'
import RegisterPage from '../pages/login/Register'
import FoodMapPage from '../pages/map/FoodMapPage'
import FoodQuizApp from '../pages/questionnaire/FoodQuizApp'
import TheCharts from '../pages/thecharts/TheCharts'
import NotFoundPage from '../pages/error/NotFoundPage'
import TableManagementPage from '../pages/table_management/TableManagementPage'
import UserProfile from '../pages/user/UserProfile'
import FavoritesDashboard from '../pages/user/FavoritesDashboard'
import AboutUsPage from '../pages/about/AboutUsPage'
import Homepage from '../pages/HomePage'



const routes = [
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, Component: Homepage },
            { path: 'login', Component: LoginPage },
            { path: 'register', Component: RegisterPage },
            { path: 'tablemanagement', Component: TableManagementPage },
            {
                path: 'user', children: [
                    {
                        path: 'userprofile',
                        Component: UserProfile
                    },
                    {
                        path: 'userfavorite',
                        Component: FavoritesDashboard
                    }
                ]
            },
            { path: 'eatlist', Component: FoodCardsShowcase },
            { path: 'recipelist', Component: IngredientCardsShowcase },
            { path: 'about', Component: AboutUsPage },
            { path: 'map', Component: FoodMapPage },
            { path: 'thecharts', Component: TheCharts },
            { path: 'quiz', Component: FoodQuizApp },
        ]
    },
    { path: '*', Component: NotFoundPage } // 捕获所有未匹配的路由
]

export default function RouterView() {
    return useRoutes(routes)
}
