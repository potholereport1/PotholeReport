import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import DashBoard from '../components/Dashboard'
import Profile from '../components/Profile'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BABEL_ENV,
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },

        {
            path: '/login',
            name: 'login',
            component: Login
        },

        {
            path: '/register',
            name: 'register',
            component: Register
        },

        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashBoard
        },

        {
            path: '/pothole/:pothole',
            name: 'pothole',
            component: Profile
        }
    ]
})

export default router
