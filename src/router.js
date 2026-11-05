import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Article from './views/Article.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/wen/:slug', name: 'article', component: Article },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
