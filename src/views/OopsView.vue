<script setup lang="ts">
import LazyImage from '@/components/shared/LazyImage.vue'
import { useLayout } from '@/layout/composables/layout'

const { isDarkTheme } = useLayout()
</script>

<template>
  <section
    class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center"
  >
    <LazyImage
      class="w-64 lg:w-96"
      :src="'/layout/images/' + (isDarkTheme ? 'oops-dark.png' : 'oops.png')"
      alt="404 Image"
    />
    <h1 class="title-h5 lg:title-h1 mt-8">Oops!</h1>
    <p class="body-small lg:body-large mt-2 lg:mt-4">There is nothing here</p>
    <RouterLink to="/" class="body-button bg-orange-600 w-fit mt-8 hover:bg-orange-500 px-4">
      Go to Dashboard
    </RouterLink>
  </section>
</template>
