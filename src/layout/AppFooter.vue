<script setup>
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-footer">
        <div class="footer-logo-container">
            <img
                :src="`/layout/images/logo-${isDarkTheme ? 'white' : 'dark'}.svg`"
                alt="mirai-layout"
            />
            <span class="footer-app-name">MIRAI</span>
        </div>
        <span class="footer-copyright">
            &#169; Mirai Technologies {{ new Date().getFullYear() }}
        </span>
    </div>
</template>
