<script setup lang="ts">
import { useFrameStore } from '../stores/frameStore';
import { ref, onMounted, computed, watch } from 'vue';

const store = useFrameStore();
const loadingProgress = ref(0);
const totalImages = ref(0);
const loadedImages = ref(0);

// 检查图片是否存在或加载完成
function onImageLoad() {
  loadedImages.value++;
  loadingProgress.value = Math.min(100, Math.round((loadedImages.value / totalImages.value) * 100));
}

// 图片加载失败时的处理
function onImageError(event: Event, frame: any) {
  const imgElement = event.target as HTMLImageElement;
  const frameElement = imgElement.closest('.frame') as HTMLElement;
  
  if (frameElement) {
    // 设置一个柔和的背景色作为替代
    if (frameElement.classList.contains('selected')) {
      frameElement.style.backgroundColor = '#FFFAC8'; // 选中状态的黄色
    } else {
      const colors = ['#FFD1DC', '#FFE5EC', '#FFC5CD', '#FFC0CB']; // 粉色系列
      const randomColor = colors[frame.imageIndex % 4];
      frameElement.style.backgroundColor = randomColor;
    }
    
    // 显示图片编号和分类
    const numberElement = document.createElement('div');
    numberElement.className = 'frame-info';
    numberElement.innerHTML = `<span class="frame-category">${frame.category}</span><span class="frame-number">${frame.imageIndex}</span>`;
    frameElement.appendChild(numberElement);
    
    // 隐藏失败的图片
    imgElement.style.display = 'none';
    
    // 确保计数更新
    onImageLoad();
  }
}

// 页面加载完成后重置计数
onMounted(() => {
  resetLoadingState();
});

// 当分类改变时重置加载状态
watch(() => store.activeCategory, () => {
  resetLoadingState();
});

// 重置加载状态
function resetLoadingState() {
  loadedImages.value = 0;
  loadingProgress.value = 0;
  totalImages.value = store.filteredFrames.length;
}

// 计算是否显示加载进度条
const showLoadingBar = computed(() => {
  return loadingProgress.value < 100;
});
</script>

<template>
  <div class="main-container">
    <!-- 顶部区域 -->
    <div class="header">
      <!-- 左侧LOGO -->
      <div class="logo">
        <div class="logo-text">FOFOBOOTH</div>
      </div>
      
      <!-- 中央标题 -->
      <div class="title">
        <img src="/images/bow.png" alt="bow" class="bow" onerror="this.style.display='none';" />
        <span>TAKE PHOTO WITH ME</span>
        <img src="/images/bow.png" alt="bow" class="bow" onerror="this.style.display='none';" />
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="categories">
      <div class="category" @click="store.setCategory('all')" :class="{ active: store.activeCategory === 'all' }">
        <img src="/images/hello_kitty_yeah.png" alt="All" onerror="this.style.display='none';" />
        <span>ALL</span>
      </div>
      <div class="category" @click="store.setCategory('idol')" :class="{ active: store.activeCategory === 'idol' }">
        <img src="/images/hello_kitty_yeah.png" alt="Idol" onerror="this.style.display='none';" />
        <span>IDOL</span>
      </div>
      <div class="category" @click="store.setCategory('cute')" :class="{ active: store.activeCategory === 'cute' }">
        <img src="/images/hello_kitty_yeah.png" alt="Cute" onerror="this.style.display='none';" />
        <span>CUTE</span>
      </div>
      <div class="category" @click="store.setCategory('y2k')" :class="{ active: store.activeCategory === 'y2k' }">
        <img src="/images/hello_kitty_yeah.png" alt="Y2K" onerror="this.style.display='none';" />
        <span>Y2K</span>
      </div>
      <div class="category" @click="store.setCategory('vibe')" :class="{ active: store.activeCategory === 'vibe' }">
        <img src="/images/hello_kitty_yeah.png" alt="Vibe" onerror="this.style.display='none';" />
        <span>VIBE</span>
      </div>
    </div>

    <!-- 加载进度条 -->
    <div v-if="showLoadingBar" class="loading-bar-container">
      <div class="loading-progress" :style="{ width: `${loadingProgress}%` }"></div>
      <div class="loading-text">Loading images... {{ loadingProgress }}%</div>
    </div>

    <!-- 框架网格 - 可滚动区域，高度增加以显示更多内容 -->
    <div class="frames-grid-container">
      <div class="frames-grid">
        <!-- 显示实际图片，有备用处理 -->
        <div
          v-for="frame in store.filteredFrames"
          :key="frame.id"
          @click="store.toggleFrame(frame)"
          class="frame"
          :class="{ selected: frame.selected }">
          <img 
            :src="frame.imagePath" 
            :alt="`${frame.category} ${frame.imageIndex}`"
            @load="onImageLoad"
            @error="(e) => onImageError(e, frame)" />
        </div>
      </div>
    </div>

    <!-- 选择区域 -->
    <div class="selection-area">
      <div class="selection-container">
        <div class="selection-text">CHOOSE {{ store.selectedFrames.length }}/4:</div>
        <div class="selected-frames">
          <div 
            v-for="(frame, index) in store.selectedFrames" 
            :key="frame ? frame.id : `empty-${index}`"
            class="selected-frame-container">
            <div v-if="frame" class="selected-frame">
              <!-- 使用实际图片，有备用处理 -->
              <img 
                :src="frame.imagePath" 
                :alt="`Selected ${index+1}`"
                @error="(e) => onImageError(e, frame)" />
              <!-- 悬停时显示的移除按钮 -->
              <div class="remove-overlay" @click.stop="store.toggleFrame(frame)">
                <div class="remove-icon">×</div>
              </div>
            </div>
            <div v-else class="selected-frame empty"></div>
          </div>
          <!-- 填充空位，确保总是显示4个框 -->
          <div 
            v-for="i in 4 - store.selectedFrames.length" 
            :key="`empty-add-${i}`"
            class="selected-frame-container">
            <div class="selected-frame empty"></div>
          </div>
        </div>
        <button 
          class="capture-button"
          :disabled="store.selectedFrames.length < 4"
          :class="{ disabled: store.selectedFrames.length < 4 }"
          @click="store.selectedFrames.length === 4 && $router.push('/capture')">
          CAPTURE
        </button>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-text">2025 MADE BY JELLY FOFO</div>
      <div class="footer-links">
        <span>PRIVACY POLICY</span>
        <span>|</span>
        <span>HOW WE USE YOUR DATA</span>
        <span>|</span>
        <span>MY INSTAGRAM</span>
        <span>|</span>
        <span>SEND FEEDBACK</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式 */
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFC5CD, #FFB6C1, #FFC0CB);
  padding: 0;
  margin: 0;
  font-family: Arial, sans-serif;
  width: 100%;
}

/* 顶部区域 */
.header {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
  height: 70px;
}

.logo {
  position: absolute;
  left: 30px;
}

.logo-text {
  background-color: white;
  border: 2px solid black;
  border-radius: 30px;
  padding: 8px 20px;
  font-weight: bold;
  font-size: 20px;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  white-space: nowrap;
}

.title span {
  font-size: 36px;
  font-weight: bold;
}

.bow {
  width: 40px;
  height: 40px;
}

/* 分类导航 */
.categories {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
  margin-top: 60px;
  width: 100%;
}

.category {
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.5;
}

.category.active {
  opacity: 1;
}

.category img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.category span {
  font-size: 20px;
  font-weight: bold;
}

/* 加载进度条样式 */
.loading-bar-container {
  width: 80%;
  max-width: 1000px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background-color: #FFB6C1;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.loading-text {
  position: absolute;
  left: 0;
  top: 15px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #333;
}

/* 框架网格容器 - 添加滚动功能 */
.frames-grid-container {
  width: 100%;
  max-width: 1100px;
  max-height: 600px; /* 增加高度以显示更多内容 */
  overflow-y: auto;
  margin-bottom: 60px; /* 调整与下方黄色区域的间距 */
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 框架网格 - 改为自动排列 */
.frames-grid {
  display: grid;
  grid-template-columns: repeat(7, 140px); /* 7列，稍微减小宽度适应更多列 */
  grid-auto-rows: 105px; /* 自动行高，稍微减小高度 */
  gap: 15px; /* 减小间距让更多内容可见 */
  width: 100%;
  justify-content: center;
}

.frame {
  width: 140px; /* 减小尺寸 */
  height: 105px;
  background-color: #FFE5EC;
  border: 2px solid black;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.frame.selected {
  background-color: #FFFAC8;
  transform: scale(0.95);
  border-color: white;
  box-shadow: 0 0 0 4px white;
}

.frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 框架信息样式 */
.frame-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.frame-number {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
}

.frame-category {
  display: block;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 5px;
}

/* 自定义滚动条样式 */
.frames-grid-container::-webkit-scrollbar {
  width: 10px;
}

.frames-grid-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.frames-grid-container::-webkit-scrollbar-thumb {
  background: #FFB6C1;
  border-radius: 5px;
}

.frames-grid-container::-webkit-scrollbar-thumb:hover {
  background: #FF9AAA;
}

/* 选择区域 - 确保背景占满宽度 */
.selection-area {
  width: 100vw; /* 占满整个视口宽度 */
  background-color: #FFFDF5;
  padding: 25px 0;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  box-sizing: border-box;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.selection-container {
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.selection-text {
  font-size: 22px;
  font-weight: bold;
}

.selected-frames {
  display: flex;
  gap: 20px;
}

.selected-frame-container {
  position: relative;
}

.selected-frame {
  width: 120px;
  height: 90px;
  background-color: white;
  border: 2px solid black;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.selected-frame.empty {
  background-color: #f5f5f5;
}

.selected-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 悬停时显示的移除选项 */
.remove-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.selected-frame:hover .remove-overlay {
  opacity: 1;
}

.remove-icon {
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.capture-button {
  background-color: white;
  border: 2px solid black;
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.capture-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 页脚 - 确保背景占满宽度 */
.footer {
  width: 100vw; /* 占满整个视口宽度 */
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFB6C1;
  margin-top: auto;
  left: 0;
  right: 0;
  box-sizing: border-box;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.footer-text {
  font-weight: bold;
  margin-bottom: 10px;
}

.footer-links {
  display: flex;
  gap: 15px;
  font-size: 14px;
}

/* 确保所有内容居中 */
:global(body) {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  background: linear-gradient(to bottom, #FFC5CD, #FFB6C1, #FFC0CB);
}
</style> 