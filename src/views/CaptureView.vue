<script setup lang="ts">
import { useFrameStore } from '../stores/frameStore'
import { useRouter } from 'vue-router'

const store = useFrameStore()
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-[#FFC0CB] p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">Your Selected Photos</h1>
      
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div 
          v-for="frame in store.selectedFrames" 
          :key="frame.id" 
          class="bg-white rounded-xl overflow-hidden shadow-lg">
          <img :src="frame.src" :alt="frame.id" class="w-full h-full object-cover" />
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