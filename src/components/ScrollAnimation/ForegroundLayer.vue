<template>
  <div class="foreground-layer depth-layer">
    <!-- CSS 漸層背景作為基底 -->
    <div class="gradient-base"></div>

    <!-- 大氣效果 -->
    <div class="atmospheric-layer"></div>
  </div>
</template>

<script setup>
// script setup 語法，專注於圖片和 CSS 的混合效果
</script>

<style scoped>
.foreground-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%) translateZ(var(--foreground-z)) scale(var(--foreground-scale));
  z-index: var(--z-foreground);
}

/* 漸層基底 - 保持簡單 */
.gradient-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 70%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 1;
}

/* 左側樹木圖片容器 */
.tree-image-left {
  position: absolute;
  bottom: 0;
  left: 0px;
  width: 200px;
  height: 100vh;
  /* background-image: url('/forest.png');  */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom left;
  z-index: 3;
  opacity: 0.9;
  bottom: -8%;
  left: -7%;
  width: 41%;
  height: 63%;
}

/* 右側樹木圖片容器 */
.tree-image-right {
  position: absolute;
  bottom: 0;
  right: -80px;
  width: 250px;
  height: 100vh;
  /* background-image: url('/assets/images/tree-right.png');  */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom right;
  z-index: 3;
  opacity: 0.85;
}

/* 大氣層效果 */
.atmospheric-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.06) 100%);
  z-index: 4;
  animation: atmosphere-flow 15s ease-in-out infinite alternate;
}

/* 當圖片載入失敗時的備用樣式 */
/* .tree-image-left:empty,
.tree-image-left[style*='url()'] {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
  border-radius: 0 50px 50px 0;
}

.tree-image-right:empty,
.tree-image-right[style*='url()'] {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
  border-radius: 50px 0 0 50px;
}

.foliage-image-top:empty,
.foliage-image-top[style*='url()'] {
  background: radial-gradient(ellipse at center bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
} */

/* 動畫效果 */
@media (prefers-reduced-motion: no-preference) {
  .tree-image-left {
    animation: tree-sway-left 8s ease-in-out infinite alternate;
  }

  .tree-image-right {
    animation: tree-sway-right 10s ease-in-out infinite alternate;
  }

  .foliage-image-top {
    animation: foliage-drift 12s ease-in-out infinite alternate;
  }
}

@keyframes tree-sway-left {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(2px) rotate(0.2deg);
  }
}

@keyframes tree-sway-right {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(-2px) rotate(-0.3deg);
  }
}

@keyframes foliage-drift {
  0% {
    transform: translateX(0);
    opacity: 0.7;
  }
  100% {
    transform: translateX(3px);
    opacity: 0.9;
  }
}

@keyframes atmosphere-flow {
  0% {
    transform: translateX(-3px);
    opacity: 0.6;
  }
  100% {
    transform: translateX(3px);
    opacity: 0.9;
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .tree-image-left {
    width: 150px;
    left: -30px;
  }

  .tree-image-right {
    width: 180px;
    right: -50px;
  }

  .foliage-image-top {
    left: 15%;
    width: 70%;
    height: 30%;
  }
}
</style>
