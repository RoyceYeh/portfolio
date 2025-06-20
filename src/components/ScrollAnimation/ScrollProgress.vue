<template>
  <div class="scroll-progress-container">
    <!-- 頂部進度條 -->
    <div class="progress-bar-top">
      <div class="progress-fill" :style="{ width: progressPercentage }"></div>
    </div>

    <!-- 右側圓形進度 -->
    <div class="progress-circle" v-show="showCircle">
      <svg class="circle-svg" viewBox="0 0 36 36">
        <circle class="circle-bg" cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <circle class="circle-progress" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--forest-accent)" stroke-width="2" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" transform="rotate(-90 18 18)" />
      </svg>
      <div class="progress-text">{{ Math.round(scrollProgress * 100) }}%</div>
    </div>

    <!-- 底部進度指示點 -->
    <div class="progress-dots" v-show="showDots">
      <div class="progress-dot" v-for="(section, index) in sections" :key="index" :class="{ active: currentSection === index }" @click="scrollToSection(index)">
        <span class="dot-label">{{ section.name }}</span>
      </div>
    </div>

    <!-- 滾動方向提示 -->
    <!-- <div class="scroll-direction" v-show="showDirection">
      <div class="direction-arrow" :class="{ 'scrolling-up': isScrollingUp }">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M7 14l5-5 5 5z" fill="var(--forest-accent)" />
        </svg>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// 使用滾動動畫狀態
const { scrollProgress, isScrolling, scrollToProgress } = useScrollAnimation()

// 頁面區段定義
const sections = ref([
  { name: '聯絡', progress: 0.9 },
  { name: '作品', progress: 0.65 },
  { name: '技能', progress: 0.45 },
  { name: '關於', progress: 0.2 },
])

// 滾動方向檢測
const isScrollingUp = ref(false)
const lastScrollProgress = ref(0)

// 計算屬性
const progressPercentage = computed(() => `${scrollProgress.value * 100}%`)

const circumference = computed(() => 2 * Math.PI * 15.915)

const dashOffset = computed(() => {
  return circumference.value * (1 - scrollProgress.value)
})

const currentSection = computed(() => {
  return sections.value.findIndex((section) => scrollProgress.value >= section.progress)
})

// 顯示控制
const showCircle = computed(() => scrollProgress.value > 0.1)
const showDots = computed(() => scrollProgress.value > 0.2)
const showDirection = computed(() => isScrolling.value)

// 監聽滾動方向
watch(scrollProgress, (newProgress) => {
  isScrollingUp.value = newProgress > lastScrollProgress.value
  lastScrollProgress.value = newProgress
})

// 滾動到指定區段
const scrollToSection = (sectionIndex) => {
  const targetProgress = sections.value[sectionIndex].progress
  scrollToProgress(targetProgress)
}
</script>

<style scoped>
.scroll-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: var(--z-progress);
}

/* 頂部進度條 */
.progress-bar-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forest-accent) 0%, #67e6dc 50%, var(--forest-accent) 100%);
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
}

/* 右側圓形進度 */
.progress-circle {
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  pointer-events: auto;
  cursor: pointer;
  transition: all var(--transition-normal) ease-out;
}

.progress-circle:hover {
  transform: translateY(-50%) scale(1.1);
}

.circle-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.circle-progress {
  transition: stroke-dashoffset 0.2s ease-out;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 底部進度指示點 */
.progress-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  pointer-events: auto;
}

.progress-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all var(--transition-normal) ease-out;
  border: 2px solid transparent;
}

.progress-dot:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.progress-dot.active {
  background: var(--forest-accent);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.6);
}

.dot-label {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--transition-normal) ease-out;
  pointer-events: none;
}

.progress-dot:hover .dot-label,
.progress-dot.active .dot-label {
  opacity: 1;
}

/* 滾動方向提示 */
.scroll-direction {
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: fade-in-out 1s ease-in-out;
}

.direction-arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast) ease-out;
}

.direction-arrow.scrolling-up {
  transform: rotate(0deg);
}

.direction-arrow:not(.scrolling-up) {
  transform: rotate(180deg);
}

/* 動畫效果 */
@keyframes fade-in-out {
  0%,
  100% {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }
  20%,
  80% {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .progress-circle {
    right: 50%;
    width: 50px;
    height: 50px;
    transform: translateX(50%);
    top: 92.5%;
  }

  .progress-text {
    font-size: 0.7rem;
  }

  .progress-dots {
    bottom: 1rem;
    gap: 0.8rem;
  }

  .progress-dot {
    width: 10px;
    height: 10px;
  }

  .scroll-direction {
    left: 1rem;
    padding: 0.4rem 0.8rem;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .scroll-direction {
    animation: none;
    opacity: 1;
  }

  .direction-arrow {
    transition: none;
  }
}
</style>
