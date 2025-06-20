import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  // 響應式狀態
  const screenWidth = ref(0)
  const screenHeight = ref(0)
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isSmallMobile = ref(false)
  const isLandscape = ref(false)
  const devicePixelRatio = ref(1)

  // 更新螢幕資訊
  const updateScreenInfo = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
    devicePixelRatio.value = window.devicePixelRatio || 1

    // 尺寸分類
    isSmallMobile.value = screenWidth.value <= 480
    isMobile.value = screenWidth.value <= 768
    isTablet.value = screenWidth.value > 768 && screenWidth.value <= 1024
    isDesktop.value = screenWidth.value > 1024

    // 方向檢測
    isLandscape.value = screenWidth.value > screenHeight.value
  }

  // 取得當前斷點名稱
  const getCurrentBreakpoint = () => {
    if (isSmallMobile.value) return 'sm-mobile'
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  }

  // 檢查是否為觸控裝置
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  // 檢查是否為高解析度螢幕
  const isHighDPI = () => {
    return devicePixelRatio.value > 1
  }

  // 檢查是否為低效能裝置（簡單判斷）
  const isLowPerformanceDevice = () => {
    // 基於一些簡單的指標判斷
    const cores = navigator.hardwareConcurrency || 1
    const memory = navigator.deviceMemory || 1
    const isOldMobile = isMobile.value && cores <= 2 && memory <= 2

    return isOldMobile || isSmallMobile.value
  }

  // 取得適合當前裝置的動畫設定
  const getAnimationConfig = () => {
    if (isLowPerformanceDevice()) {
      return {
        reducedMotion: true,
        throttleLimit: 25,
        scaleMultiplier: 0.7,
      }
    } else if (isMobile.value) {
      return {
        reducedMotion: false,
        throttleLimit: 18,
        scaleMultiplier: 0.8,
      }
    } else if (isTablet.value) {
      return {
        reducedMotion: false,
        throttleLimit: 16,
        scaleMultiplier: 0.9,
      }
    } else {
      return {
        reducedMotion: false,
        throttleLimit: 16,
        scaleMultiplier: 1.0,
      }
    }
  }

  // 節流的視窗大小變化處理
  let resizeTimeout = null
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(() => {
      updateScreenInfo()
    }, 100) // 100ms 延遲，避免過度觸發
  }

  // 生命週期
  onMounted(() => {
    updateScreenInfo()
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleResize)

    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
  })

  return {
    // 狀態
    screenWidth,
    screenHeight,
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLandscape,
    devicePixelRatio,

    // 方法
    getCurrentBreakpoint,
    isTouchDevice,
    isHighDPI,
    isLowPerformanceDevice,
    getAnimationConfig,
    updateScreenInfo,
  }
}
