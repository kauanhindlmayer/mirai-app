<script setup lang="ts">
import LazyImage from '~/components/common/LazyImage.vue'
import { useLayout } from '~/layout/composables/layout'

const { isDarkTheme } = useLayout()
</script>

<template>
  <section
    class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center"
  >
    <LazyImage
      class="w-64 lg:w-96"
      :src="'/layout/images/' + (isDarkTheme ? '404-dark.png' : '404.png')"
      alt="404 Image"
    />
    <h1 class="title-h5 lg:title-h1 mt-8">Error</h1>
    <p class="body-small lg:body-large mt-2 lg:mt-4">Something gone wrong!</p>
    <RouterLink to="/projects" class="body-button bg-red-600 w-fit mt-8 hover:bg-red-500 px-4">
      Go to Home
    </RouterLink>
  </section>
</template>
