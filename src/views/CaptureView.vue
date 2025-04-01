<script setup lang="ts">
import { useFrameStore } from '../stores/frameStore'
import { useRouter } from 'vue-router'

const store = useFrameStore()
const router = useRouter()

// 图片加载失败时的处理
function onImageError(event: Event, frame: any) {
  const imgElement = event.target as HTMLImageElement;
  const container = imgElement.parentElement;
  
  if (container) {
    // 设置黄色背景
    container.style.backgroundColor = '#FFFAC8';
    
    // 显示图片编号和分类
    const infoElement = document.createElement('div');
    infoElement.className = 'frame-info';
    infoElement.innerHTML = `<span class="frame-category">${frame.category}</span><span class="frame-number">${frame.imageIndex}</span>`;
    container.appendChild(infoElement);
    
    // 隐藏失败的图片
    imgElement.style.display = 'none';
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FFC0CB] p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">Your Selected Photos</h1>
      
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div 
          v-for="frame in store.selectedFrames" 
          :key="frame.id" 
          class="bg-white rounded-xl overflow-hidden shadow-lg relative">
          <!-- 使用实际图片，有备用显示 -->
          <img 
            :src="frame.imagePath" 
            :alt="`${frame.category} ${frame.imageIndex}`"
            class="w-full h-full object-cover"
            @error="(e) => onImageError(e, frame)" />
        </div>
      </div>
      
      <div class="flex justify-center gap-4">
        <button 
          @click="router.push('/')"
          class="px-6 py-2 bg-black text-white rounded-full font-bold">
          Back
        </button>
        <button class="px-6 py-2 bg-white border-2 border-black rounded-full font-bold">
          Print Photos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
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
</style> 