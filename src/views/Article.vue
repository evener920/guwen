<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import articles from '../data/articles.js'
import Paragraph from '../components/Paragraph.vue'

const route = useRoute()
const router = useRouter()
const toast = inject('toast', () => {})

const article = computed(() => articles.find((a) => a.slug === route.params.slug) || null)
const idx = computed(() => articles.findIndex((a) => a.slug === route.params.slug))
const next = computed(() => (idx.value >= 0 && idx.value < articles.length - 1 ? articles[idx.value + 1] : null))
const prev = computed(() => (idx.value > 0 ? articles[idx.value - 1] : null))

const fontSize = ref(Number(localStorage.getItem('guwen-fs')) || 19)
const showGloss = ref(true)
const showTrans = ref(false)
const vertical = ref(false)
const recite = ref(false)
const bookmarks = ref(JSON.parse(localStorage.getItem('guwen-bm') || '[]'))

function applyFs() {
  document.documentElement.style.setProperty('--fs-body', fontSize.value + 'px')
  localStorage.setItem('guwen-fs', String(fontSize.value))
}
watch(fontSize, applyFs)
onMounted(applyFs)

const bodyClass = computed(() => ({
  'no-gloss': !showGloss.value,
  'no-trans': !showTrans.value,
  'is-vertical': vertical.value,
  'is-recite': recite.value,
}))

function bump(d) {
  fontSize.value = Math.min(30, Math.max(15, fontSize.value + d))
}
function goRandom() {
  const a = articles[Math.floor(Math.random() * articles.length)]
  router.push('/wen/' + a.slug)
}
function share() {
  if (!article.value) return
  const url = location.origin + location.pathname + '#/wen/' + article.value.slug
  navigator.clipboard?.writeText(url)
  toast('链接已复制')
}
const isBooked = computed(() => article.value && bookmarks.value.includes(article.value.slug))
function toggleBook() {
  if (!article.value) return
  const s = article.value.slug
  if (bookmarks.value.includes(s)) bookmarks.value = bookmarks.value.filter((x) => x !== s)
  else bookmarks.value = [...bookmarks.value, s]
  localStorage.setItem('guwen-bm', JSON.stringify(bookmarks.value))
  toast(isBooked.value ? '已取消藏书' : '已藏书')
}
function speak() {
  if (!article.value) return
  const text = article.value.paragraphs.map((p) => p.text).join('。')
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.9
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}
</script>

<template>
  <div class="article" v-if="article">
    <div class="wrap">
      <header class="head">
        <div class="head__top">
          <router-link to="/" class="head__back">← 目录</router-link>
          <span class="head__genre">{{ article.genre }}</span>
        </div>
        <h1 class="head__title kai">{{ article.title }}</h1>
        <p class="head__byline">
          {{ article.dynasty }} · {{ article.author }}
          <template v-if="article.source"
            ><span class="dot">·</span><span class="head__source">{{ article.source }}</span></template
          >
        </p>
        <p class="head__era" v-if="article.era">{{ article.era }}</p>
        <div class="head__actions">
          <button class="mark" :class="{ 'is-on': isBooked }" @click="toggleBook">
            {{ isBooked ? '已藏' : '藏书' }}
          </button>
          <button class="mark" @click="goRandom">随机</button>
          <button class="mark" @click="share">分享</button>
        </div>
        <p class="head__lead" v-if="article.lead">{{ article.lead }}</p>
        <p class="head__quote kai" v-if="article.quote">「{{ article.quote }}」</p>
      </header>

      <div class="tb">
        <div class="tb__group">
          <span class="tb__label">字</span>
          <button class="tb__btn" @click="bump(-1)" title="缩小字号">A－</button>
          <span class="tb__num">{{ fontSize }}</span>
          <button class="tb__btn" @click="bump(1)" title="放大字号">A＋</button>
        </div>
        <span class="tb__sep"></span>
        <button class="tb__btn tb__btn--wide" :class="{ 'is-on': vertical }" @click="vertical = !vertical">
          竖排
        </button>
        <button class="tb__btn tb__btn--wide" :class="{ 'is-on': showGloss }" @click="showGloss = !showGloss">
          夹注
        </button>
        <button class="tb__btn tb__btn--wide" :class="{ 'is-on': showTrans }" @click="showTrans = !showTrans">
          译文
        </button>
        <button class="tb__btn tb__btn--wide" :class="{ 'is-on': recite }" @click="recite = !recite">
          背诵
        </button>
        <span class="tb__sep"></span>
        <button class="tb__btn tb__btn--wide" @click="speak">朗读</button>
      </div>

      <div class="body" :class="bodyClass">
        <Paragraph
          v-for="(p, i) in article.paragraphs"
          :key="i"
          :para="p"
          :translation="article.translation[i] || ''"
          :show-gloss="showGloss"
          :show-trans="showTrans"
        />
      </div>

      <section class="appre" v-if="article.appreciation && article.appreciation.length">
        <div class="divider"><span class="divider__label kai">赏析</span></div>
        <div class="appre__item" v-for="(a, i) in article.appreciation" :key="i">
          <span class="appre__num kai" v-if="a.num">{{ a.num }}</span>
          <span class="appre__text">{{ a.text }}</span>
        </div>
      </section>

      <nav class="pager">
        <router-link v-if="prev" to="#" @click.prevent="router.push('/wen/' + prev.slug)">
          ← 上一篇<span class="pager__name kai">{{ prev.title }}</span></router-link
        >
        <span v-else></span>
        <router-link v-if="next" class="next" to="#" @click.prevent="router.push('/wen/' + next.slug)">
          下一篇 →<span class="pager__name kai">{{ next.title }}</span></router-link
        >
        <span v-else></span>
      </nav>
    </div>

    <footer class="foot">
      <div class="kai">一页一篇，注、译、析俱备。</div>
      <div>纸短意长，聊供静夜一读。</div>
      <div>© 2026 · 本网站内容据历代通行版本整理，仅供学习欣赏</div>
    </footer>
  </div>
  <div class="article" v-else>
    <div class="wrap">
      <p>未找到该篇。</p>
      <router-link to="/">← 返回目录</router-link>
    </div>
  </div>
</template>
