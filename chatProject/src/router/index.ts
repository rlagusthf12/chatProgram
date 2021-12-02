import {createRouter, createWebHistory} from "vue-router";
import Room from "../components/room.vue"
import Rooms from "../components/rooms.vue"
import LoginForm from "../components/loginForm.vue"


const routes = [
    {
        path:"/",
        name:"loginForm",
        component: LoginForm
    },
    {
        path: "/room",
        name:"room",
        component: Room,
        props: true
    },
    {
        path:"/rooms",
        name:"rooms",
        component: Rooms,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router