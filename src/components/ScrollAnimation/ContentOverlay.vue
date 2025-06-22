<template>
  <div class="content-overlay">
    <!-- 全螢幕背景遮罩 -->
    <div class="background-mask" :style="{ opacity: backgroundOpacity }"></div>

    <!-- 主要內容區域 -->
    <div class="main-content" :style="{ opacity: contentOpacity }">
      <!-- 主標題區域 -->
      <div class="hero-content">
        <div class="intro-sequence">
          <!-- 問候語 -->
          <div class="greeting" :class="{ visible: showGreeting }">
            <h2 class="greeting-text">嗨，我是</h2>
          </div>

          <!-- 主要標題 -->
          <h1 class="hero-title" :class="{ visible: showTitle }">{{ name }}</h1>

          <!-- 職業描述 -->
          <p class="hero-subtitle" :class="{ visible: showRole }">{{ role }}</p>

          <!-- 詳細描述 -->
          <p class="hero-description" :class="{ visible: showDescription }">{{ description }}</p>

          <!-- 技能標籤 -->
          <div class="skill-tags" :class="{ visible: showSkills }">
            <span v-for="(skill, index) in quickSkills" :key="skill" class="skill-tag" :style="{ animationDelay: `${index * 0.1}s` }">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- 滾動提示 -->
        <div class="scroll-hint" :class="{ visible: showScrollHint }">
          <span class="scroll-text">滾動滑鼠探索我的城堡</span>
          <div class="scroll-indicator">
            <div class="scroll-arrow"></div>
          </div>
          <span class="scroll-subtext">發現隱藏的作品與技能</span>
        </div>
      </div>
    </div>

    <!-- 區段內容卡片 -->
    <div class="section-cards-container">
      <!-- 關於我卡片 -->
      <div class="section-cards about-cards" v-show="showAboutCards">
        <div class="section-title">
          <h2>關於我</h2>
          <div class="title-line"></div>
        </div>

        <!-- 根據項目數量決定是否使用輪播 -->
        <div v-if="!shouldUseAboutSwiper" class="cards-grid">
          <div class="info-card about-card" v-for="(card, index) in aboutCards" :key="card.title" :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="card-icon">{{ card.icon }}</div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.content }}</p>
          </div>
        </div>

        <!-- 超過3個時使用輪播 -->
        <div v-else class="swiper-container">
          <Swiper v-bind="swiperConfig" class="about-swiper">
            <SwiperSlide v-for="(card, index) in aboutCards" :key="card.title">
              <div class="info-card about-card swiper-card">
                <div class="card-icon">{{ card.icon }}</div>
                <h3>{{ card.title }}</h3>
                <p>{{ card.content }}</p>
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- 輪播控制按鈕 -->
          <div class="swiper-button-prev about-prev"></div>
          <div class="swiper-button-next about-next"></div>
          <div class="swiper-pagination about-pagination"></div>
        </div>
      </div>

      <!-- 技能卡片 -->
      <div class="section-cards skills-cards" v-show="showSkillsCards">
        <div class="section-title">
          <h2>技能專長</h2>
          <div class="title-line"></div>
        </div>

        <!-- 根據項目數量決定是否使用輪播 -->
        <div v-if="!shouldUseSkillsSwiper" class="cards-grid skills-grid">
          <div class="info-card skill-card" v-for="(skill, index) in skillCategories" :key="skill.category" :style="{ animationDelay: `${index * 0.15}s` }">
            <!-- 保持原有的技能卡內容 -->
            <div class="skill-category">
              <div class="category-icon">{{ skill.icon }}</div>
              <h3>{{ skill.category }}</h3>
              <div class="skill-list">
                <span v-for="tech in skill.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 超過3個時使用輪播 -->
        <div v-else class="swiper-container">
          <Swiper v-bind="swiperConfig" class="skills-swiper">
            <SwiperSlide v-for="(skill, index) in skillCategories" :key="skill.category">
              <div class="info-card skill-card swiper-card">
                <div class="skill-category">
                  <div class="category-icon">{{ skill.icon }}</div>
                  <h3>{{ skill.category }}</h3>
                  <div class="skill-list">
                    <span v-for="tech in skill.technologies" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <div class="swiper-button-prev skills-prev"></div>
          <div class="swiper-button-next skills-next"></div>
          <div class="swiper-pagination skills-pagination"></div>
        </div>
      </div>

      <!-- 作品卡片 -->
      <div class="section-cards projects-cards" v-show="showProjectsCards">
        <div class="section-title">
          <h2>精選作品</h2>
          <div class="title-line"></div>
        </div>

        <!-- 根據項目數量決定是否使用輪播 -->
        <div v-if="!shouldUseProjectsSwiper" class="cards-grid projects-grid">
          <div class="info-card project-card" v-for="(project, index) in projects" :key="project.title" :style="{ animationDelay: `${index * 0.2}s` }">
            <!-- 保持原有的專案卡內容 -->
            <div class="project-image">
              <div class="project-placeholder">{{ project.emoji }}</div>
            </div>
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                  {{ tech }}
                </span>
              </div>
              <div class="project-links">
                <a :href="project.link" target="_blank" class="project-link">查看詳情</a>
              </div>
            </div>
          </div>
        </div>

        <!-- 超過3個時使用輪播 -->
        <div v-else class="swiper-container">
          <Swiper v-bind="swiperConfig" class="projects-swiper">
            <SwiperSlide v-for="(project, index) in projects" :key="project.title">
              <div class="info-card project-card swiper-card">
                <div class="project-image">
                  <div class="project-placeholder">{{ project.emoji }}</div>
                </div>
                <div class="project-info">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.description }}</p>
                  <div class="project-tech">
                    <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                      {{ tech }}
                    </span>
                  </div>
                  <div class="project-links">
                    <a :href="project.link" target="_blank" class="project-link">查看詳情</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <div class="swiper-button-prev projects-prev"></div>
          <div class="swiper-button-next projects-next"></div>
          <div class="swiper-pagination projects-pagination"></div>
        </div>
      </div>
    </div>

    <!-- 全螢幕聯絡頁面 -->
    <div class="contact-page" v-show="showContactPage">
      <!-- 聯絡頁面背景遮罩 -->
      <div class="contact-background"></div>

      <!-- 聯絡頁面內容 -->
      <div class="contact-content">
        <div class="contact-intro">
          <h1 class="contact-title">讓我們開始合作</h1>
          <p class="contact-subtitle">一同創造令人驚豔的數位體驗！</p>
          <div class="contact-divider"></div>
        </div>

        <div class="contact-methods">
          <!-- 聯絡方式也遵循同樣規則 -->
          <div v-if="!shouldUseContactSwiper" class="contact-grid">
            <div class="contact-method" v-for="(contact, index) in contactMethods" :key="contact.type" :style="{ animationDelay: `${index * 0.2}s` }">
              <div class="method-icon">{{ contact.icon }}</div>
              <div class="method-info">
                <h3>{{ contact.type }}</h3>
                <p>{{ contact.description }}</p>
                <a :href="contact.link" class="method-link" target="_blank">
                  {{ contact.value }}
                </a>
              </div>
            </div>
          </div>

          <!-- 超過3個時使用輪播 -->
          <div v-else class="swiper-container contact-swiper-container">
            <Swiper v-bind="contactSwiperConfig" class="contact-swiper">
              <SwiperSlide v-for="(contact, index) in contactMethods" :key="contact.type">
                <div class="contact-method swiper-card">
                  <div class="method-icon">{{ contact.icon }}</div>
                  <div class="method-info">
                    <h3>{{ contact.type }}</h3>
                    <p>{{ contact.description }}</p>
                    <a :href="contact.link" class="method-link" target="_blank">
                      {{ contact.value }}
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <!-- 聯絡方式輪播控制按鈕 -->
            <div class="swiper-button-prev contact-prev"></div>
            <div class="swiper-button-next contact-next"></div>
            <div class="swiper-pagination contact-pagination"></div>
          </div>
        </div>

        <div class="contact-footer">
          <p class="footer-text">期待與您的合作機會</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { useResponsive } from '@/composables/useResponsive'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// 添加響應式檢測
const { isMobile, isTablet } = useResponsive()

// 滾動位置保持邏輯
const scrollPositionManager = {
  savedPosition: 0,
  isHandlingResize: false,

  savePosition() {
    this.savedPosition = window.pageYOffset
  },

  async restorePosition() {
    if (this.isHandlingResize) return

    this.isHandlingResize = true
    await nextTick()

    // 使用 requestAnimationFrame 確保在重繪後執行
    requestAnimationFrame(() => {
      window.scrollTo({
        top: this.savedPosition,
        behavior: 'instant',
      })

      setTimeout(() => {
        this.isHandlingResize = false
      }, 150)
    })
  },
}

// Swiper 模組配置
const modules = [Navigation, Pagination, Autoplay]

// 通用 Swiper 配置
const swiperConfig = {
  modules,
  spaceBetween: 20,
  slidesPerView: 2,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    // 手機
    320: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    // 大手機
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // 平板
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    // 大平板和桌面
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
}

// 聯絡方式專用 Swiper 配置
const contactSwiperConfig = {
  modules,
  spaceBetween: 20,
  navigation: {
    nextEl: '.contact-next',
    prevEl: '.contact-prev',
  },
  pagination: {
    el: '.contact-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  loop: true, // 聯絡方式開啟循環
  centeredSlides: true, // 居中顯示
  breakpoints: {
    // 手機
    320: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    // 大手機
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // 平板
    768: {
      slidesPerView: 1,
      spaceBetween: 24,
    },
    // 大平板
    1440: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
  },
}

// 個人資訊配置
const name = ref('葉柏宏')
const role = ref('前端開發工程師')
const description = ref('熱愛創造優美的數位體驗，專注於現代網頁技術與使用者介面設計')
const quickSkills = ref(['Vue.js', 'JavaScript', 'CSS', 'React'])

// 關於我卡片
const aboutCards = ref([
  {
    icon: '🎯',
    title: '專業目標',
    content: '致力於創造直觀、高效且美觀的用戶介面，提升產品的使用體驗',
  },
  {
    icon: '💡',
    title: '設計理念',
    content: '相信好的設計不僅要美觀，更要解決實際問題，讓技術服務於人',
  },
  {
    icon: '🚀',
    title: '技術熱忱',
    content: '持續學習新技術，關注前端生態發展，樂於分享與團隊協作',
  },
  {
    icon: '🎨',
    title: '創意思維',
    content: '結合技術與創意，打造令人印象深刻的互動體驗和視覺效果',
  },
  {
    icon: '🤝',
    title: '團隊合作',
    content: '重視溝通與信任，樂於傾聽與協調，與團隊共同達成目標並持續優化流程',
  },
  {
    icon: '🧠',
    title: '問題解決',
    content: '善於分析問題根源，靈活運用技術與邏輯思維，提出高效可行的解決方案',
  },
])

// 技能分類
const skillCategories = ref([
  {
    icon: '⚛️',
    category: 'Programming',
    technologies: ['Vue.js', 'Javascript', 'React'],
  },
  {
    icon: '💻',
    category: 'Web layout',
    technologies: ['HTML', 'Css/Scss', 'Tailwind'],
  },
  {
    icon: '🎨',
    category: 'Dev helper',
    technologies: ['Git/Github', 'Figma', 'Vite', 'Photoshop'],
  },
])

// 作品集
const projects = ref([
  {
    emoji: '🌲',
    title: '問券調查',
    description: '科幻風格問券調查專案',
    technologies: ['Vue3', 'Vite', 'TailwindCSS'],
    link: 'https://questionnaire-website-nine.vercel.app/',
  },
  {
    emoji: '📱',
    title: '轉盤投票',
    description: '投票系統專案，主要用於飯店評選活動，有轉盤遊戲。',
    technologies: ['Vue 3', 'SCSS', 'Pinia'],
    link: 'https://spin-the-wheel-pi.vercel.app/',
  },
  {
    emoji: '📊',
    title: '刮刮樂',
    description: '玩家可以體驗互動式的刮刮卡遊戲，享受刮開卡片時的樂趣。',
    technologies: ['Vue 3', 'PixiJS', 'SCSS'],
    link: 'https://scratch-card-game.vercel.app/',
  },
])

// 聯絡方式 - 重新設計為更詳細的格式
const contactMethods = ref([
  {
    icon: '📧',
    type: 'Email',
    description: '專案合作、工作機會歡迎來信討論',
    value: '開啟連結',
    link: 'mailto:royz.reus@gmail.com',
  },
  {
    icon: '💼',
    type: 'Resume',
    description: '專業履歷與工作經歷',
    value: '開啟連結',
    link: 'https://drive.google.com/drive/folders/1fgT7el0PifvVf5-OXUKVYV1i8-qBa2aZ?usp=sharing',
  },
  {
    icon: '🐙',
    type: 'GitHub',
    description: '開源專案與程式碼作品',
    value: '開啟連結',
    link: 'https://github.com/RoyceYeh?tab=repositories',
  },
])

// 基於項目數量的輪播判斷邏輯
const shouldUseAboutSwiper = computed(() => {
  return isMobile.value || aboutCards.value.length > 3
})

const shouldUseSkillsSwiper = computed(() => {
  return isMobile.value || skillCategories.value.length > 3
})

const shouldUseProjectsSwiper = computed(() => {
  return isMobile.value || projects.value.length > 3
})

const shouldUseContactSwiper = computed(() => {
  return isMobile.value || contactMethods.value.length > 3
})

// 監聽響應式變化並保持滾動位置
let resizeHandler = null

// 🎯 監聽輪播狀態變化
watch([shouldUseAboutSwiper, shouldUseSkillsSwiper, shouldUseProjectsSwiper, shouldUseContactSwiper], async (newValues, oldValues) => {
  if (oldValues.some((oldValue, index) => oldValue !== undefined && newValues[index] !== oldValue)) {
    scrollPositionManager.savePosition()
    await scrollPositionManager.restorePosition()
  }
})

// 直接監聽 window resize 事件來保持更精確的控制
const handleWindowResize = () => {
  if (!scrollPositionManager.isHandlingResize) {
    scrollPositionManager.savePosition()

    // 短暫延遲後恢復位置
    setTimeout(() => {
      scrollPositionManager.restorePosition()
    }, 50)
  }
}

// 動畫顯示控制
const showGreeting = ref(false)
const showTitle = ref(false)
const showRole = ref(false)
const showDescription = ref(false)
const showSkills = ref(false)
const showScrollHint = ref(false)

// 使用滾動動畫狀態
const { scrollProgress } = useScrollAnimation()

// 立即執行的調試
// console.log('=== ContentOverlay 開始初始化 ===')
// console.log('scrollProgress 對象:', scrollProgress)

// 計算透明度
const backgroundOpacity = computed(() => {
  return Math.max(0, 1 - scrollProgress.value / 0.3)
})

const contentOpacity = computed(() => {
  return Math.max(0, 1 - scrollProgress.value / 0.2)
})

// 根據滾動進度控制各區段卡片顯示
const showAboutCards = computed(() => {
  return scrollProgress.value >= 0.25 && scrollProgress.value < 0.45
})

const showSkillsCards = computed(() => {
  return scrollProgress.value >= 0.45 && scrollProgress.value < 0.65
})

const showProjectsCards = computed(() => {
  return scrollProgress.value >= 0.65 && scrollProgress.value < 0.85
})

// 聯絡頁面顯示控制
const showContactPage = computed(() => {
  return scrollProgress.value >= 0.9
})

// 依序顯示介紹元素
const startIntroSequence = () => {
  setTimeout(() => {
    showGreeting.value = true
  }, 500)
  setTimeout(() => {
    showTitle.value = true
  }, 1000)
  setTimeout(() => {
    showRole.value = true
  }, 1500)
  setTimeout(() => {
    showDescription.value = true
  }, 2000)
  setTimeout(() => {
    showSkills.value = true
  }, 2500)
  setTimeout(() => {
    showScrollHint.value = true
  }, 3500)
}

onMounted(() => {
  startIntroSequence()

  // 綁定 resize 事件監聽器
  resizeHandler = handleWindowResize
  window.addEventListener('resize', resizeHandler, { passive: true })

  // 🎯 測試用：在控制台暴露新增函數（生產環境可移除）
  if (typeof window !== 'undefined') {
    window.addAboutCard = addAboutCard
    window.addSkillCategory = addSkillCategory
    window.addProject = addProject
    window.addContactMethod = addContactMethod
  }
})

onBeforeUnmount(() => {
  // 清理事件監聽器
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  // 清理測試函數
  if (typeof window !== 'undefined') {
    delete window.addAboutCard
    delete window.addSkillCategory
    delete window.addProject
    delete window.addContactMethod
  }
})
</script>

<style scoped>
/* === 保持原有的所有樣式 === */
.content-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: var(--z-content);
  pointer-events: none;
}

/* 全螢幕背景遮罩 */
.background-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background: linear-gradient(135deg, var(--forest-dark) 0%, var(--forest-mid) 30%, var(--forest-light) 60%, var(--forest-top) 100%);
  transition: opacity 0.8s ease-out;
  z-index: 1;
}

/* 主要內容區域 */
.main-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: opacity 0.6s ease-out;
}

/* 主標題區域 */
.hero-content {
  text-align: center;
  max-width: 900px;
  padding: 2rem;
  pointer-events: auto;
}

/* 介紹序列樣式 */
.intro-sequence {
  margin-bottom: 3vw;
}

.greeting {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
  margin-bottom: 1rem;
}

.greeting.visible {
  opacity: 1;
  transform: translateY(0);
}

.greeting-text {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--forest-accent);
  font-weight: 300;
  letter-spacing: 2px;
}

.hero-title {
  font-size: clamp(3.5rem, 10vw, 5rem);
  font-weight: bold;
  margin-bottom: 1vw;
  color: var(--text-primary);
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  line-height: 1.1;
  opacity: 0;
  transform: translateY(50px) scale(0.9);
  transition: all 1s ease-out;
}

.hero-title.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-subtitle {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--forest-accent);
  margin-bottom: 1vw;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.hero-subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-description {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: var(--text-secondary);
  margin-bottom: 1.5vw;
  line-height: 1.7;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;
}

.hero-description.visible {
  opacity: 1;
  transform: translateY(0);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5vw;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;
}

.skill-tags.visible {
  opacity: 1;
  transform: translateY(0);
}

.skill-tag {
  background: rgba(78, 205, 196, 0.2);
  border: 2px solid var(--forest-accent);
  color: var(--forest-accent);
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transform: scale(0);
  animation: skillTagAppear 0.6s ease-out forwards;
}

/* 滾動提示樣式 */
.scroll-hint {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out;
  text-align: center;
}

.scroll-hint.visible {
  opacity: 1;
  transform: translateY(0);
  animation: gentle-pulse 3s ease-in-out infinite;
}

.scroll-text {
  display: block;
  font-size: 1.1rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
  margin-bottom: 1vw;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.scroll-subtext {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 1rem;
  font-style: italic;
}

.scroll-indicator {
  margin: 1rem auto;
  width: 40px;
  height: 60px;
  border: 2px solid var(--forest-accent);
  border-radius: 20px;
  position: relative;
  background: rgba(78, 205, 196, 0.1);
  backdrop-filter: blur(5px);
}

.scroll-arrow {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: var(--forest-accent);
  border-radius: 50%;
  animation: scroll-bounce 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
}

/* === 區段卡片樣式 === */
.section-cards-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 3;
}

.section-cards {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 1200px;
  pointer-events: auto;
  max-height: 95vh;
  overflow-y: auto;
  padding: 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 1.5vw;
}

.section-title h2 {
  line-height: 1.1;
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.title-line {
  width: 100px;
  height: 4px;
  background: var(--forest-accent);
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
}

.cards-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.skills-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.projects-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.contact-grid {
  display: grid;
  row-gap: 30px;
  column-gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* 通用卡片樣式 */
.info-card {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-heavy);
  transition: all var(--transition-normal) ease-out;
  opacity: 0;
  transform: translateY(30px);
  animation: cardSlideUp 0.8s ease-out forwards;
}

.info-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--forest-accent);
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
}

/* 關於我卡片特殊樣式 */
.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.about-card h3 {
  font-size: 1.4rem;
  color: var(--forest-accent);
  margin-bottom: 1rem;
  font-weight: 600;
}

.about-card p {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 技能卡片特殊樣式 */
.skill-category {
  text-align: left;
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.skill-card h3 {
  font-size: 1.3rem;
  color: var(--forest-accent);
  margin-bottom: 1rem;
  text-align: center;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.tech-tag {
  background: rgba(78, 205, 196, 0.2);
  color: var(--forest-accent);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forest-accent), #67e6dc);
  border-radius: 4px;
  transition: width 1s ease-out;
}

.level-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* 專案卡片特殊樣式 */
.project-card {
  text-align: left;
}

.project-image {
  margin-bottom: 1.5vw;
  text-align: center;
}

.project-placeholder {
  font-size: 4rem;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 15px;
  padding: 2rem;
  display: inline-block;
}

.project-info h3 {
  font-size: 1.4rem;
  color: var(--forest-accent);
  margin-bottom: 1.5vw;
}

.project-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2vw;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-badge {
  background: rgba(78, 205, 196, 0.2);
  color: var(--forest-accent);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  text-align: center;
}

.project-link {
  color: var(--forest-accent);
  text-decoration: none;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border: 2px solid var(--forest-accent);
  border-radius: 25px;
  transition: all var(--transition-normal) ease-out;
}

.project-link:hover {
  background: var(--forest-accent);
  color: var(--forest-dark);
}

/* === 全螢幕聯絡頁面樣式 === */
.contact-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  animation: contactPageFadeIn 1s ease-out;
}

.contact-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background: linear-gradient(45deg, var(--forest-dark) 0%, var(--forest-mid) 25%, var(--forest-light) 50%, var(--forest-top) 75%, var(--forest-accent) 100%);
  opacity: 0.95;
}

.contact-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 90vw;
  text-align: center;
  padding: 3rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  border: 2px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transform: scale(0.8);
}

.contact-intro {
  margin-bottom: 1vw;
}

.contact-title {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 1vw;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  animation: titleSlideIn 1s ease-out 0.3s both;
}

.contact-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: var(--forest-accent);
  margin-bottom: 1vw;
  font-weight: 300;
  animation: subtitleSlideIn 1s ease-out 0.5s both;
}

.contact-divider {
  width: 100px;
  height: 4px;
  background: var(--forest-accent);
  margin: 0 auto 2rem;
  border-radius: 2px;
  animation: dividerExpand 1s ease-out 0.7s both;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
}

.contact-methods {
  margin-bottom: 1.5vw;
}

.contact-method {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-heavy);
  transition: all var(--transition-normal) ease-out;
  opacity: 0;
  transform: translateY(30px);
  animation: cardSlideUp 0.8s ease-out forwards;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.contact-method:hover {
  transform: translateY(-5px);
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--forest-accent);
  box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
}

.method-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.method-info {
  text-align: left;
  flex: 1;
}

.method-info h3 {
  font-size: 1.3rem;
  color: var(--forest-accent);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.method-info p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.method-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-family: monospace;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  transition: all var(--transition-normal) ease-out;
  display: inline-block;
}

.method-link:hover {
  background: var(--forest-accent);
  color: var(--forest-dark);
  transform: scale(1.05);
}

.contact-footer {
  border-top: 1px solid rgba(78, 205, 196, 0.2);
  padding-top: 1vw;
  animation: footerSlideIn 1s ease-out 1.2s both;
}

.footer-text {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-style: italic;
}

/* === Swiper 樣式 === */
.swiper-container {
  position: relative;
  padding: 0 3.5rem 3rem 3.5rem;
}

.swiper-card {
  height: auto;
  margin: 0;
  transform: none !important;
  opacity: 1 !important;
  animation: none !important;
}

/* 聯絡方式輪播特殊樣式 */
.contact-swiper-container {
  padding: 0 1rem 3rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.contact-swiper .swiper-slide {
  display: flex;
  justify-content: center;
}

.contact-swiper .contact-method {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.contact-swiper .method-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.contact-swiper .method-info {
  text-align: center;
}

.contact-swiper .method-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.contact-swiper .method-info p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.contact-swiper .method-link {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 12px;
  background: rgba(78, 205, 196, 0.15);
  border: 2px solid rgba(78, 205, 196, 0.4);
}

/* 聯絡方式輪播按鈕特殊樣式 */
.contact-prev,
.contact-next {
  color: var(--forest-accent) !important;
  background: rgba(0, 0, 0, 0.6) !important;
  border: 2px solid rgba(78, 205, 196, 0.3) !important;
  border-radius: 50% !important;
  width: 45px !important;
  height: 45px !important;
  margin-top: -22px !important;
  transition: all 0.3s ease !important;
}

.contact-prev:hover,
.contact-next:hover {
  background: rgba(78, 205, 196, 0.2) !important;
  border-color: var(--forest-accent) !important;
  transform: scale(1.1) !important;
}

/* 聯絡方式分頁器樣式 */
.contact-pagination {
  bottom: 0px !important;
}

.contact-pagination .swiper-pagination-bullet {
  background: rgba(255, 255, 255, 0.4) !important;
  width: 10px !important;
  height: 10px !important;
}

.contact-pagination .swiper-pagination-bullet-active {
  background: var(--forest-accent) !important;
  width: 15px !important;
  height: 10px !important;
  border-radius: 5px !important;
}

/* 通用 Swiper 導航按鈕樣式 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: var(--forest-accent);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
}

:deep(.swiper-button-prev:after),
:deep(.swiper-button-next:after) {
  font-size: 18px;
  font-weight: 600;
}

/* 通用 Swiper 分頁器樣式 */
:deep(.swiper-pagination) {
  bottom: 10px;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.5);
  width: 8px;
  height: 8px;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--forest-accent);
  width: 12px;
  height: 8px;
  border-radius: 4px;
}

/* 動畫效果 */
@keyframes skillTagAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.1) rotate(-10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes gentle-pulse {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes scroll-bounce {
  0%,
  100% {
    top: 10px;
    opacity: 1;
  }
  50% {
    top: 30px;
    opacity: 0.3;
  }
}

@keyframes cardSlideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes contactPageFadeIn {
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    backdrop-filter: blur(20px);
  }
}

@keyframes titleSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes subtitleSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dividerExpand {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 100px;
    opacity: 1;
  }
}

@keyframes methodSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes footerSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .section-cards {
    top: 50%;
    width: 95vw;
    max-height: 90vh;
    overflow-y: hidden;
    padding: 1rem 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--forest-accent) transparent;
  }

  .section-cards::-webkit-scrollbar {
    width: 4px;
  }

  .section-cards::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  .section-cards::-webkit-scrollbar-thumb {
    background: var(--forest-accent);
    border-radius: 2px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .info-card {
    padding: 1.5rem;
    padding-bottom: 2rem;
  }

  .hero-content {
    padding: 1.5rem;
  }

  .skill-tags {
    gap: 0.8rem;
  }

  .skill-tag {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .section-title {
    margin-bottom: 1.5vw;
  }

  .section-title h2 {
    font-size: clamp(2rem, 6vw, 3rem);
  }

  /* 聯絡頁面響應式 */
  .contact-content {
    padding: 2rem 0;
    width: 95vw;
  }

  .contact-methods {
    padding: 0 1rem;
    margin-bottom: 2rem;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .about-card h3 {
    font-size: 1.2rem;
  }

  .about-card p {
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

/* 小手機特殊處理 */
@media (max-width: 480px) {
  .section-cards {
    width: 98vw;
    max-height: 90vh;
    padding: 0.8rem 0.3rem;
  }

  .cards-grid {
    gap: 1.2rem;
  }

  .info-card {
    padding: 1.2rem;
  }

  .section-title h2 {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
  }

  .title-line {
    width: 60px;
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .swiper-container {
    padding: 0 1.5rem 2.5rem 1.5rem;
  }

  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 35px;
    height: 35px;
    margin-top: -17px;
  }

  :deep(.swiper-button-prev:after),
  :deep(.swiper-button-next:after) {
    font-size: 16px;
  }

  .contact-prev,
  .contact-next {
    width: 35px !important;
    height: 35px !important;
    margin-top: -17px !important;
  }

  .contact-prev:after,
  .contact-next:after {
    font-size: 16px !important;
  }
}

/* 減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .scroll-hint,
  .scroll-arrow,
  .skill-tag {
    animation: none;
  }

  .hero-title,
  .hero-subtitle,
  .hero-description,
  .greeting,
  .skill-tags {
    transition: opacity var(--transition-normal) ease-out;
    transform: none;
  }

  .level-fill {
    transition: none;
  }
}
</style>
