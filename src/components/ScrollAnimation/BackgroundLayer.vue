<template>
  <div class="background-layer depth-layer">
    <!-- 天空漸層 -->
    <div class="sky-gradient"></div>

    <!-- 雲層圖片 -->
    <div class="foliage-image-top"></div>

    <div class="castle-layer"></div>

    <!-- <div class="road-layer"></div> -->
  </div>
</template>

<style scoped>
.background-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%) translateZ(var(--background-z)) scale(var(--background-scale));
  z-index: var(--z-background);
}
.foliage-image-top {
  position: absolute;
  top: -10%;
  left: 0%;
  width: 100%;
  height: 54%;
  background-image: url('/cloud.png');
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 2;
  opacity: 0.7;
}
.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, #1a2b3d 0%, /* 深藍夜空 */ #2c4a3a 30%, /* 藍綠過渡 */ #3d5a4a 60%, /* 綠色天空 */ var(--forest-top) 100%);
}

.mountain-layer {
  position: absolute;
  bottom: 30%;
  left: 0;
  width: 100%;
  height: 40%;
  background: 
      /* 遠山剪影 */ polygon(0% 100%, 0% 80%, 15% 85%, 25% 75%, 35% 80%, 50% 70%, 65% 75%, 80% 65%, 90% 70%, 100% 60%, 100% 100%);
  background-color: var(--forest-mid);
  opacity: 0.8;
  clip-path: polygon(0% 100%, 0% 80%, 15% 85%, 25% 75%, 35% 80%, 50% 70%, 65% 75%, 80% 65%, 90% 70%, 100% 60%, 100% 100%);
}
.castle-layer {
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  height: 63%;
  opacity: 1;
  background-image: url(/castle1.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.distant-forest {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, transparent 0%, var(--forest-light) 20%, var(--forest-mid) 60%, var(--forest-dark) 100%);

  background-image: url('/forest.png'); /* 你要加入的圖片 */
  background-size: contain;
  background-repeat: no-repeat;
  bottom: -8%;
  left: -7%;
  width: 41%;
  height: 63%;
}

.road-layer {
  position: absolute;
  bottom: -4%;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 4;
  background-image: url('/road.png');
  background-size: cover;
  background-repeat: no-repeat;
}

/* 添加細微的移動效果 */
@media (prefers-reduced-motion: no-preference) {
  .sky-gradient {
    animation: sky-shift 30s ease-in-out infinite alternate;
  }

  .mountain-layer {
    animation: mountain-sway 25s ease-in-out infinite alternate;
  }
}

@keyframes sky-shift {
  0% {
    filter: hue-rotate(0deg) brightness(1);
  }
  100% {
    filter: hue-rotate(10deg) brightness(1.1);
  }
}

@keyframes mountain-sway {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(2px);
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .background-layer {
    width: 130%;
    height: 130%;
  }

  .distant-forest {
    background-image: radial-gradient(ellipse 60px 120px at 15% 100%, rgba(0, 0, 0, 0.3) 0%, transparent 70%), radial-gradient(ellipse 50px 100px at 45% 100%, rgba(0, 0, 0, 0.2) 0%, transparent 70%), radial-gradient(ellipse 70px 110px at 75% 100%, rgba(0, 0, 0, 0.25) 0%, transparent 70%);
  }
}

/* 平板設備 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .background-layer {
    width: 160%;
    height: 160%;
  }

  .foliage-image-top {
    height: 45%; /* 平板上雲朵稍微調小 */
  }

  /* .castle-layer {
    height: 30%;
    bottom: 37%;
  } */

  .road-layer {
    background-position: center bottom;
    bottom: -2.9%;
    height: 44%;
  }
}

/* 手機設備 (768px 以下) */
@media (max-width: 768px) {
  .background-layer {
    width: 180%; /* 手機上需要更大的覆蓋範圍 */
    height: 180%;
  }

  /* 手機版移除雲層 */
  .foliage-image-top {
    display: none;
  }

  .sky-gradient {
    height: 70%; /* 沒有雲朵時天空佔比增加 */
  }

  .castle-layer {
    background-image: url('/castle_m.png');
    bottom: -15%;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .road-layer {
    bottom: -2.9%;
    height: 44%;
    background-position: center bottom;
  }
}

/* 更小的手機 (480px 以下) */
@media (max-width: 480px) {
  .background-layer {
    width: 200%; /* 更小螢幕需要更大覆蓋 */
    height: 200%;
  }

  .sky-gradient {
    height: 75%; /* 小螢幕上天空佔更多比例 */
  }

  /* .castle-layer {
    bottom: 42%;
    height: 20%;
  } */

  .road-layer {
    bottom: 3.2%;
    height: 42%;
  }
}

/* 橫向手機 (landscape) */
@media (max-width: 768px) and (orientation: landscape) {
  .background-layer {
    width: 220%;
    height: 220%;
  }

  .sky-gradient {
    height: 60%;
  }

  /* .castle-layer {
    bottom: 35%;
    height: 30%;
  } */

  .road-layer {
    bottom: -5%;
    height: 40%;
  }
}
</style>
