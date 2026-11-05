<script setup>
import { computed } from 'vue'

const props = defineProps({
  para: { type: Object, required: true },
  translation: { type: String, default: '' },
  showGloss: { type: Boolean, default: true },
  showTrans: { type: Boolean, default: false },
})

const segments = computed(() => {
  const text = props.para.text || ''
  const glosses = (props.para.glosses || [])
    .filter((g) => g.word && text.includes(g.word))
    .map((g) => ({ ...g, pos: text.indexOf(g.word) }))
    .sort((a, b) => a.pos - b.pos)
  const parts = []
  let cursor = 0
  for (const g of glosses) {
    if (g.pos < cursor) continue
    if (g.pos > cursor) parts.push({ text: text.slice(cursor, g.pos) })
    parts.push({ word: g.word, note: g.note })
    cursor = g.pos + g.word.length
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
})
</script>

<template>
  <div class="para">
    <p class="para__text">
      <template v-for="(s, i) in segments" :key="i">
        <span v-if="s.word" class="para__word"
          >{{ s.word }}<span v-if="showGloss && s.note" class="para__gloss">（{{ s.note }}）</span></span
        >
        <template v-else>{{ s.text }}</template>
      </template>
    </p>
    <p v-if="showTrans && translation" class="para__tr">{{ translation }}</p>
  </div>
</template>
