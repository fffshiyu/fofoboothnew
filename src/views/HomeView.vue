<script setup lang="ts">
import { useFrameStore } from '../stores/frameStore';

const store = useFrameStore();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 粉色主区域 -->
    <div class="flex-1 bg-[#FFC0CB] px-4 py-6">
      <!-- 顶部标题区 -->
      <div class="flex justify-between items-center mb-8">
        <div class="px-5 py-2 bg-white border-2 border-black rounded-full">
          <span class="text-xl font-bold">FOFOBOOTH</span>
        </div>
        <div class="flex items-center gap-3">
          <img src="https://via.placeholder.com/40" class="w-10 h-10" alt="bow" />
          <h1 class="text-3xl font-bold">TAKE PHOTO WITH ME</h1>
          <img src="https://via.placeholder.com/40" class="w-10 h-10" alt="bow" />
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="flex justify-center gap-16 mb-8">
        <div 
          v-for="category in store.categories" 
          :key="category.id"
          @click="store.setCategory(category.id)"
          class="flex items-center gap-2 cursor-pointer"
          :class="{ 'opacity-100': store.activeCategory === category.id, 'opacity-50': store.activeCategory !== category.id }">
          <img :src="category.icon" class="w-6 h-6" :alt="category.name" />
          <span class="font-bold">{{ category.name }}</span>
        </div>
      </div>

      <!-- 框架网格 -->
      <div class="grid grid-cols-6 gap-4 mb-8">
        <div 
          v-for="frame in store.filteredFrames" 
          :key="frame.id"
          @click="store.toggleFrame(frame)"
          class="aspect-[4/3] bg-[#FFE0E5] rounded-xl overflow-hidden cursor-pointer"
          :class="{ 'ring-2 ring-white': frame.selected }">
          <img :src="frame.src" :alt="frame.id" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- 米色选择区域 -->
    <div class="bg-[#FFFDF5] py-4 px-8">
      <div class="flex items-center">
        <div class="font-bold">CHOOSE {{ store.selectedFrames.length }}/4:</div>
        <div class="flex gap-4 ml-4">
          <div
            v-for="(_, i) in 4"
            :key="i"
            class="w-24 h-20 bg-white border border-gray-300 rounded-xl overflow-hidden">
            <img
              v-if="store.selectedFrames[i]"
              :src="store.selectedFrames[i].src"
              :alt="`选择的图片 ${i+1}`"
              class="w-full h-full object-cover" />
          </div>
        </div>
        <button 
          class="ml-auto px-6 py-2 bg-white border-2 border-black rounded-full font-bold"
          :disabled="store.selectedFrames.length < 4"
          :class="{ 'opacity-50': store.selectedFrames.length < 4 }"
          @click="store.selectedFrames.length === 4 && $router.push('/capture')">
          CAPTURE
        </button>
      </div>
    </div>

    <!-- 粉色页脚 -->
    <div class="bg-[#FFC0CB] py-2 text-center text-sm">
      <p class="font-bold">2025 MADE BY JELLY FOFO</p>
      <p class="flex justify-center gap-2">
        <a href="#" class="hover:underline">PRIVACY POLICY</a>
        <span>|</span>
        <a href="#" class="hover:underline">HOW WE USE YOUR DATA</a>
        <span>|</span>
        <a href="#" class="hover:underline">MY INSTAGRAM</a>
        <span>|</span>
        <a href="#" class="hover:underline">SEND FEEDBACK</a>
      </p>
    </div>
  </div>
</template> 