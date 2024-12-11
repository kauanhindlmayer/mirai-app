<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
})

const isIntersecting = ref(false)
const isLoaded = ref(false)
const image = ref<any>(null)

function handleLoad() {
  isLoaded.value = true
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        isIntersecting.value = true
        observer.unobserve(image.value)
      }
    },
    { threshold: 0.1 },
  )

  observer.observe(image.value)
})
</script>

<template>
  <img
    :src="isIntersecting ? src : ''"
    :alt="alt"
    :class="[
      className,
      {
        'opacity-0': !isLoaded,
        'transition-opacity duration-700 ease-out delay-75': true,
      },
    ]"
    @load="handleLoad"
    ref="image"
  />
</template>
