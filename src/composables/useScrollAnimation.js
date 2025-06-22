import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

export function useScrollAnimation() {
  // 響應式狀態 - 確保初始值為 0
  const scrollProgress = ref(0)
  const isScrolling = ref(false)
  const windowHeight = ref(0)
  const documentHeight = ref(0)

  // 添加初始化完成標記
  const isInitialized = ref(false)

  // 滾動處理函數
  let scrollTimeout = null

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    console.log('updateScrollProgress - scrollTop:', scrollTop, 'maxScroll:', maxScroll)

    // 確保 maxScroll 是有效的正數
    if (maxScroll <= 0) {
      scrollProgress.value = 0
      return
    }

    // 🔄 修正滾動邏輯：
    // 在頂部 (scrollTop = 0) → progress = 0 (起始狀態)
    // 往下滾 (scrollTop 增加) → progress 增加 (推進動畫)
    const rawProgress = scrollTop / maxScroll

    // 🎯 關鍵修正：不要反轉！直接使用 rawProgress
    // 因為您的動畫邏輯是：滾動越多 = 動畫推進越多
    const progress = rawProgress

    console.log('計算結果 - rawProgress:', rawProgress, 'final progress:', progress)

    // 確保進度值在 0-1 之間
    scrollProgress.value = Math.max(0, Math.min(1, progress))

    isScrolling.value = true

    // 清除之前的超時
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // 設定滾動結束檢測
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)

    // 更新 CSS 變數
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress.value)
  }

  // 節流函數 - 針對觸控裝置優化
  const throttle = (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // 在 calculateDepthTransform 函數中添加響應式邏輯
  const calculateDepthTransform = (layerType, progress) => {
    // 檢測螢幕尺寸
    const screenWidth = window.innerWidth
    const isMobile = screenWidth <= 768
    const isTablet = screenWidth > 768 && screenWidth <= 1024
    const isSmallMobile = screenWidth <= 480

    // 根據螢幕尺寸調整動畫參數
    const getConfigForScreen = () => {
      if (isSmallMobile) {
        // 小手機：更保守的縮放，避免效能問題
        return {
          background: {
            scaleRange: [1, 1.8],
            zRange: [0, 40],
            speed: 0.8,
          },
          midground: {
            scaleRange: [1, 2.5],
            zRange: [0, 80],
            speed: 1.2,
          },
          foreground: {
            scaleRange: [1, 3.5],
            zRange: [0, 150],
            speed: 2.0,
          },
        }
      } else if (isMobile) {
        // 一般手機：適中的縮放效果
        return {
          background: {
            scaleRange: [1, 2.0],
            zRange: [0, 50],
            speed: 0.9,
          },
          midground: {
            scaleRange: [1, 3.0],
            zRange: [0, 100],
            speed: 1.3,
          },
          foreground: {
            scaleRange: [1, 4.5],
            zRange: [0, 200],
            speed: 2.2,
          },
        }
      } else if (isTablet) {
        // 平板：接近桌面的效果但稍微保守
        return {
          background: {
            scaleRange: [1, 2.2],
            zRange: [0, 60],
            speed: 0.95,
          },
          midground: {
            scaleRange: [1, 3.5],
            zRange: [0, 120],
            speed: 1.4,
          },
          foreground: {
            scaleRange: [1, 5.0],
            zRange: [0, 250],
            speed: 2.3,
          },
        }
      } else {
        // 桌面：原有的完整效果
        return {
          background: {
            scaleRange: [1, 2.5],
            zRange: [0, 80],
            speed: 1,
          },
          midground: {
            scaleRange: [1, 4.0],
            zRange: [0, 150],
            speed: 1.5,
          },
          foreground: {
            scaleRange: [1, 6.0],
            zRange: [0, 300],
            speed: 2.5,
          },
        }
      }
    }

    const configs = getConfigForScreen()
    const config = configs[layerType]
    if (!config) return { scale: 1, z: 0 }

    // 根據螢幕調整敏感度
    const getSensitivityForScreen = () => {
      if (isSmallMobile) return 0.8 // 小手機較不敏感
      if (isMobile) return 0.75 // 手機稍微不敏感
      if (isTablet) return 0.72 // 平板接近桌面
      return 0.7 // 桌面原有敏感度
    }

    const enhancedProgress = Math.pow(Math.min(progress * config.speed, 1), getSensitivityForScreen())

    const scale = config.scaleRange[0] + (config.scaleRange[1] - config.scaleRange[0]) * enhancedProgress
    const z = config.zRange[0] + (config.zRange[1] - config.zRange[0]) * enhancedProgress

    return { scale, z }
  }

  // 更新景深層級
  const updateDepthLayers = () => {
    const progress = scrollProgress.value

    // 計算各層變換
    const background = calculateDepthTransform('background', progress)
    const midground = calculateDepthTransform('midground', progress)
    const foreground = calculateDepthTransform('foreground', progress)

    // 更新 CSS 變數
    document.documentElement.style.setProperty('--background-scale', background.scale)
    document.documentElement.style.setProperty('--background-z', `${background.z}px`)

    document.documentElement.style.setProperty('--midground-scale', midground.scale)
    document.documentElement.style.setProperty('--midground-z', `${midground.z}px`)

    document.documentElement.style.setProperty('--foreground-scale', foreground.scale)
    document.documentElement.style.setProperty('--foreground-z', `${foreground.z}px`)

    // 計算內容透明度（隨著推進逐漸淡出）
    const contentOpacity = Math.max(1 - progress * 2, 0)
    document.documentElement.style.setProperty('--content-opacity', contentOpacity)

    // 計算光線效果（在中段開始顯現）
    const lightOpacity = progress > 0.3 ? Math.min((progress - 0.3) * 2, 0.8) : 0
    document.documentElement.style.setProperty('--light-opacity', lightOpacity)

    // 計算粒子效果
    const particleOpacity = progress > 0.5 ? Math.min((progress - 0.5) * 1.5, 0.6) : 0
    document.documentElement.style.setProperty('--particle-opacity', particleOpacity)
  }

  // 在現有的節流函數後面添加這個動態節流函數
  const getDynamicThrottleLimit = () => {
    const screenWidth = window.innerWidth
    const isMobile = screenWidth <= 768
    const isSmallMobile = screenWidth <= 480

    if (isSmallMobile) return 20 // 小手機：降低更新頻率保護效能
    if (isMobile) return 18 // 手機：稍微降低更新頻率
    return 16 // 平板/桌面：60fps
  }

  // 修改主滾動處理函數
  const handleScroll = throttle(() => {
    updateScrollProgress()
    updateDepthLayers()
  }, getDynamicThrottleLimit())

  // 觸控滾動也做相應調整
  const handleTouchScroll = throttle(() => {
    updateScrollProgress()
    updateDepthLayers()
  }, Math.max(8, getDynamicThrottleLimit() / 2)) // 觸控保持更高頻率但也要響應式

  // 檢測是否為觸控裝置
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  // 視窗大小改變處理
  const handleResize = () => {
    windowHeight.value = window.innerHeight
    documentHeight.value = document.documentElement.scrollHeight

    // 螢幕尺寸改變時重新計算動畫
    setTimeout(() => {
      updateScrollProgress()
      updateDepthLayers()
    }, 100)
  }

  // 🔧 修正：強制重置滾動位置和進度
  const resetScrollProgress = () => {
    console.log('開始重置滾動進度...')

    // 🎯 關鍵修正：先強制滾動到頂部，再設定進度
    window.scrollTo(0, 0) // 立即滾動到頂部，不要動畫

    // 等待一幀確保滾動完成
    requestAnimationFrame(() => {
      // 立即設定進度為 0
      scrollProgress.value = 0

      // 重置 CSS 變數
      document.documentElement.style.setProperty('--scroll-progress', '0')
      document.documentElement.style.setProperty('--background-scale', '1')
      document.documentElement.style.setProperty('--background-z', '0px')
      document.documentElement.style.setProperty('--midground-scale', '1')
      document.documentElement.style.setProperty('--midground-z', '0px')
      document.documentElement.style.setProperty('--foreground-scale', '1')
      document.documentElement.style.setProperty('--foreground-z', '0px')
      document.documentElement.style.setProperty('--content-opacity', '1')
      document.documentElement.style.setProperty('--light-opacity', '0')
      document.documentElement.style.setProperty('--particle-opacity', '0')

      console.log('滾動進度已重置為 0，當前 window.scrollY:', window.scrollY)
    })
  }

  // 平滑滾動到指定位置
  const scrollToProgress = (targetProgress, duration = 1.5) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    // 🎯 修正：如果進度邏輯改了，這裡也要對應調整
    // 現在 progress 0 = 頂部，progress 1 = 底部
    const targetScrollTop = targetProgress * maxScroll

    console.log('scrollToProgress - targetProgress:', targetProgress, 'targetScrollTop:', targetScrollTop)

    gsap.to(window, {
      duration,
      scrollTo: { y: targetScrollTop, autoKill: false },
      ease: 'power2.inOut',
    })
  }

  // 滾動到特定區域
  const scrollToSection = (sectionId, duration = 1.5) => {
    const section = document.getElementById(sectionId)
    if (section) {
      gsap.to(window, {
        duration,
        scrollTo: { y: section, offsetY: 0, autoKill: false },
        ease: 'power2.inOut',
      })
    }
  }

  // 防止過度滾動和彈跳效果
  const preventOverscroll = (e) => {
    const scrollTop = window.pageYOffset
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    // 在頂部或底部時防止進一步滾動
    if ((scrollTop <= 0 && e.deltaY < 0) || (scrollTop >= maxScroll && e.deltaY > 0)) {
      e.preventDefault()
    }
  }

  // 🔧 修正：改進的初始化函數
  const initialize = async () => {
    console.log('開始初始化滾動動畫...')

    // 🎯 關鍵修正：立即強制滾動到頂部
    window.scrollTo(0, 0)

    // 等待 DOM 完全準備好
    await nextTick()

    // 再次確保滾動位置
    window.scrollTo(0, 0)

    // 先重置一切
    resetScrollProgress()

    // 更新視窗尺寸
    windowHeight.value = window.innerHeight
    documentHeight.value = document.documentElement.scrollHeight

    // 🎯 關鍵修正：多次確認初始狀態
    setTimeout(() => {
      window.scrollTo(0, 0) // 再次確保
      scrollProgress.value = 0 // 強制設為 0
      updateScrollProgress()
      updateDepthLayers()
      isInitialized.value = true
      console.log('滾動動畫初始化完成，最終 scrollProgress:', scrollProgress.value)
    }, 100)
  }

  // 🔧 修正：頁面載入時的處理
  const handlePageLoad = () => {
    // 檢查頁面載入類型
    const navigation = performance.getEntriesByType('navigation')[0]
    const isReload = navigation && navigation.type === 'reload'
    const isInitialLoad = !document.referrer || document.referrer === window.location.href

    console.log('頁面載入類型檢測:')
    console.log('- navigation.type:', navigation?.type)
    console.log('- isReload:', isReload)
    console.log('- isInitialLoad:', isInitialLoad)
    console.log('- document.referrer:', document.referrer)

    // 🎯 關鍵修正：只有在重新整理或初次載入時才重置
    const shouldReset = isReload || isInitialLoad

    if (shouldReset) {
      console.log('🔄 執行重置：這是重新整理或初次載入')
      // 確保頁面完全載入後才初始化
      if (document.readyState === 'complete') {
        initialize()
      } else {
        window.addEventListener('load', initialize, { once: true })
      }
    } else {
      console.log('✅ 保持現狀：這是頁面間的導航，保持滾動位置')
      // 頁面間導航，保持現有滾動位置，但確保系統正常運作
      initializeWithoutReset()
    }
  }

  // 🎯 新增：不重置的初始化函數
  const initializeWithoutReset = async () => {
    console.log('開始不重置的初始化...')

    // 等待 DOM 完全準備好
    await nextTick()

    // 更新視窗尺寸
    windowHeight.value = window.innerHeight
    documentHeight.value = document.documentElement.scrollHeight

    // 🎯 關鍵：不重置滾動位置，只更新進度計算
    requestAnimationFrame(() => {
      updateScrollProgress() // 基於當前滾動位置計算進度
      updateDepthLayers()
      isInitialized.value = true
      console.log('不重置的初始化完成，當前 scrollProgress:', scrollProgress.value)
    })
  }

  // 生命週期
  onMounted(async () => {
    console.log('組件掛載，開始初始化滾動動畫')

    // 🎯 修正：不要立即重置，讓 handlePageLoad 決定
    // 防止瀏覽器自動恢復滾動位置的設定保留，但不立即執行
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // 🔧 修正：交給 handlePageLoad 決定是否重置
    handlePageLoad()

    // 選擇合適的滾動處理器
    const scrollHandler = isTouchDevice() ? handleTouchScroll : handleScroll

    // 綁定事件
    window.addEventListener('scroll', scrollHandler, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // 防止過度滾動（僅在非觸控裝置）
    if (!isTouchDevice()) {
      window.addEventListener('wheel', preventOverscroll, { passive: false })
    }

    // 觸控裝置特殊處理
    if (isTouchDevice()) {
      // 防止彈跳滾動
      document.body.style.overflow = 'auto'
      document.body.style.position = 'relative'
      document.body.style.height = '100%'
    }

    // 🔧 修正：只在真正的頁面隱藏/顯示時重置（比如切換標籤頁回來）
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // 頁面重新顯示時，檢查是否需要重新計算
        setTimeout(() => {
          console.log('頁面重新顯示，重新計算滾動狀態')
          updateScrollProgress()
          updateDepthLayers()
        }, 100)
      }
    })

    // 🎯 關鍵修正：區分不同的 pageshow 情況
    window.addEventListener('pageshow', (event) => {
      console.log('pageshow 事件觸發:', {
        persisted: event.persisted,
        type: 'pageshow',
      })

      if (event.persisted) {
        // 從瀏覽器快取載入（前進/後退）
        console.log('📥 從快取載入，保持滾動位置')
        setTimeout(() => {
          // 重新計算但不重置位置
          updateScrollProgress()
          updateDepthLayers()
        }, 50)
      }
      // 如果不是 persisted，表示是正常載入，已經由 handlePageLoad 處理
    })
  })

  onUnmounted(() => {
    // 清理事件
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('scroll', handleTouchScroll)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('wheel', preventOverscroll)
    window.removeEventListener('load', initialize)

    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
  })

  return {
    // 狀態
    scrollProgress,
    isScrolling,
    windowHeight,
    documentHeight,
    isInitialized,

    // 方法
    calculateDepthTransform,
    scrollToProgress,
    scrollToSection,
    updateDepthLayers,
    resetScrollProgress, // 🔧 新增：暴露重置方法
  }
}
