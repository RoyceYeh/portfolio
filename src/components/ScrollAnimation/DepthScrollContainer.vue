<template>
  <div class="depth-scroll-container" :style="containerStyle">
    <!-- 固定視窗框架 -->
    <div class="viewport-frame">
      <div class="depth-layers">
        <!-- 背景層 -->
        <BackgroundLayer />

        <!-- 中景層 -->
        <MidgroundLayer />

        <!-- 前景層 -->
        <ForegroundLayer />
      </div>

      <!-- 內容覆蓋層 -->
      <ContentOverlay />
    </div>

    <!-- 滾動進度指示器 -->
    <ScrollProgress />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import BackgroundLayer from './BackgroundLayer.vue'
import MidgroundLayer from './MidgroundLayer.vue'
import ForegroundLayer from './ForegroundLayer.vue'
import ContentOverlay from './ContentOverlay.vue'
import ScrollProgress from './ScrollProgress.vue'
import { useResponsive } from '@/composables/useResponsive'

const { isMobile, isTablet, getCurrentBreakpoint, getAnimationConfig } = useResponsive()

// 定義 props
const props = defineProps({
  scrollHeight: {
    type: Number,
    default: 5, // 5倍視窗高度的滾動距離
  },
})

// 計算容器樣式
// const containerStyle = computed(() => ({
//   height: `${props.scrollHeight * 100}vh`,
// }))

// 根據裝置調整容器高度
const containerStyle = computed(() => {
  const animationConfig = getAnimationConfig()
  const baseHeight = props.scrollHeight * 100

  // 在低效能裝置上減少滾動距離
  const adjustedHeight = animationConfig.reducedMotion ? baseHeight * 0.8 : baseHeight

  return {
    height: `${adjustedHeight}vh`,
  }
})
</script>

<style scoped>
.depth-scroll-container {
  position: relative;
  overflow: hidden;
}

.viewport-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: var(--z-background);
}

.depth-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 1000px;
}
</style>
