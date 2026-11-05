<script setup>
import { ref, provide, onMounted } from 'vue'

const theme = ref(localStorage.getItem('guwen-theme') || 'paper')
function applyTheme() {
  document.body.classList.toggle('theme-ink', theme.value === 'ink')
}
applyTheme()
function toggleTheme() {
  theme.value = theme.value === 'paper' ? 'ink' : 'paper'
  localStorage.setItem('guwen-theme', theme.value)
  applyTheme()
}

const toastMsg = ref('')
let toastTimer
function toast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastMsg.value = ''), 1600)
}
provide('toast', toast)

onMounted(applyTheme)
</script>

<template>
  <header class="hdr">
    <div class="wrap hdr__inner">
      <router-link to="/" class="brand">
        <span class="brand__seal">古文</span>
        <span class="brand__text">
          <span class="brand__name kai">古文</span>
          <span class="brand__slogan">一页一篇 · 与古人相对</span>
        </span>
      </router-link>
      <nav class="nav">
        <router-link to="/">目录</router-link>
        <button class="theme-toggle" @click="toggleTheme">{{ theme === 'paper' ? '墨' : '宣纸' }}</button>
      </nav>
    </div>
  </header>

  <main class="site__main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
