<template>
  <div class="midground-layer depth-layer">
    <!-- 中景霧氣效果 -->
    <div class="midground-mist"></div>
  </div>
</template>

<style scoped>
.midground-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%) translateZ(var(--midground-z)) scale(var(--midground-scale));
  z-index: var(--z-midground);
}

/* 中景霧氣效果 */
.midground-mist {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.05) 30%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0.15) 100%);
  opacity: 0.6;
  animation: mist-flow 15s ease-in-out infinite alternate;
}

@keyframes mist-flow {
  0% {
    transform: translateX(-10px);
    opacity: 0.4;
  }
  100% {
    transform: translateX(10px);
    opacity: 0.8;
  }
}

/* 為樹群添加細微的搖擺效果 */
@media (prefers-reduced-motion: no-preference) {
  .tree-group-1 {
    animation: tree-sway-1 8s ease-in-out infinite alternate;
  }

  .tree-group-2 {
    animation: tree-sway-2 10s ease-in-out infinite alternate;
  }

  .tree-group-3 {
    animation: tree-sway-3 7s ease-in-out infinite alternate;
  }

  .tree-group-4 {
    animation: tree-sway-4 9s ease-in-out infinite alternate;
  }
}

@keyframes tree-sway-1 {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(2px) rotate(0.5deg);
  }
}

@keyframes tree-sway-2 {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(-1px) rotate(-0.3deg);
  }
}

@keyframes tree-sway-3 {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(1px) rotate(0.2deg);
  }
}

@keyframes tree-sway-4 {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(-2px) rotate(-0.4deg);
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .tree-group-1 {
    width: 100px;
    height: 200px;
  }

  .tree-group-2 {
    width: 120px;
    height: 180px;
  }

  .tree-group-3 {
    width: 80px;
    height: 160px;
  }

  .tree-group-4 {
    width: 110px;
    height: 200px;
  }
}
</style>
