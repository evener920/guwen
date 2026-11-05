<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../data/articles.js'

const router = useRouter()
const toast = inject('toast', () => {})
const query = ref('')
const activeCat = ref('全部')
const cats = ['全部', ...new Set(articles.map((a) => a.genre))]
const filtered = computed(() => {
  const q = query.value.trim()
  return articles.filter((a) => {
    if (activeCat.value !== '全部' && a.genre !== activeCat.value) return false
    if (!q) return true
    return (a.title + a.author + a.dynasty + a.quote).includes(q)
  })
})
function open(slug) {
  router.push('/wen/' + slug)
}
function copyLink(slug) {
  const url = location.origin + location.pathname + '#/wen/' + slug
  navigator.clipboard?.writeText(url)
  toast('链接已复制')
}
</script>

<template>
  <div class="home">
    <div class="wrap">
      <section class="hero">
        <div class="hero__main">
          <p class="hero__eyebrow">中國歷代散文 · 辭賦 · 序跋</p>
          <h1 class="hero__title kai">古文</h1>
          <div class="hero__rule"></div>
          <p class="hero__sub kai">一页一篇，与古人相对</p>
          <p class="hero__desc">
            收录 {{ articles.length }} 篇，各附题解、夹注、白话与赏析。<br />
            可竖排展卷，可调字号，可听其声。
          </p>
          <router-link class="hero__start" :to="'/wen/' + articles[0].slug">开卷 →</router-link>
        </div>
        <aside class="hero__aside">每有会意，便欣然忘食 · <b>读</b></aside>
      </section>

      <div class="tools">
        <div class="search">
          <span class="search__icon">寻</span>
          <input v-model="query" type="text" placeholder="篇名、作者或名句" />
        </div>
        <div class="tabs">
          <button
            v-for="c in cats"
            :key="c"
            class="tab"
            :class="{ 'is-active': activeCat === c }"
            @click="activeCat = c"
          >
            {{ c }}
          </button>
        </div>
        <p class="count">共 {{ filtered.length }} 篇</p>
      </div>

      <div class="list">
        <div class="card" v-for="(a, i) in filtered" :key="a.slug" @click="open(a.slug)">
          <div class="card__no kai">{{ i + 1 }}</div>
          <div class="card__body">
            <h3 class="card__title kai">{{ a.title }}</h3>
            <p class="card__meta">
              {{ a.dynasty }} · {{ a.author }}
              <span class="dot">·</span>
              <span class="card__genre">{{ a.genre }}</span>
            </p>
            <p class="card__quote">「{{ a.quote }}」</p>
          </div>
          <button class="card__share" @click.stop="copyLink(a.slug)">享</button>
          <button class="card__go" @click.stop="open(a.slug)">→</button>
        </div>
      </div>
    </div>
  </div>
</template>
