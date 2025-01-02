<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

type Props = {
  src: string
  alt?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  alt: '',
  className: '',
})

const isIntersecting = ref(false)
const isLoaded = ref(false)
const imageRef = useTemplateRef<HTMLImageElement>('image')

function handleLoad() {
  isLoaded.value = true
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        isIntersecting.value = true
        observer.unobserve(imageRef.value!)
      }
    },
    { threshold: 0.1 },
  )

  observer.observe(imageRef.value!)
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
