import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Frame {
  id: string
  src: string
  category: string
  selected: boolean
}

interface Category {
  id: string
  name: string
  icon: string
}

// 使用组合式API写法
export const useFrameStore = defineStore('frame', () => {
  // 分类数据
  const categories = ref<Category[]>([
    { id: 'all', name: 'ALL', icon: 'https://via.placeholder.com/30' },
    { id: 'idol', name: 'IDOL', icon: 'https://via.placeholder.com/30' },
    { id: 'cute', name: 'CUTE', icon: 'https://via.placeholder.com/30' },
    { id: 'y2k', name: 'Y2K', icon: 'https://via.placeholder.com/30' },
    { id: 'vibe', name: 'VIBE', icon: 'https://via.placeholder.com/30' }
  ])

  // 创建18个框架，每行6个，共3行 - 使用不同方式创建数组
  const tempFrames: Frame[] = [];
  for (let i = 0; i < 18; i++) {
    const categoryIndex = (i % 4) + 1; // 1-4对应idol, cute, y2k, vibe
    tempFrames.push({
      id: `frame-${i}`,
      src: `https://via.placeholder.com/300x200?text=Frame${i}`,
      category: categories.value[categoryIndex].id,
      selected: false
    });
  }
  const frames = ref<Frame[]>(tempFrames);

  // 当前激活的分类
  const activeCategory = ref('all')
  
  // 已选择的框架
  const selectedFrames = ref<Frame[]>([])

  // 根据当前分类过滤的框架
  const filteredFrames = computed(() => {
    if (activeCategory.value === 'all') {
      return frames.value
    }
    return frames.value.filter(frame => frame.category === activeCategory.value)
  })

  // 设置当前分类
  function setCategory(category: string) {
    activeCategory.value = category
  }

  // 切换框架的选择状态
  function toggleFrame(frame: Frame) {
    const index = selectedFrames.value.findIndex(f => f.id === frame.id)
    
    // 如果已经选择了，就移除
    if (index > -1) {
      selectedFrames.value.splice(index, 1)
      // 更新框架的选择状态
      const frameInStore = frames.value.find(f => f.id === frame.id)
      if (frameInStore) frameInStore.selected = false
    } 
    // 如果未选择且未达到4张限制，则添加
    else if (selectedFrames.value.length < 4) {
      selectedFrames.value.push(frame)
      // 更新框架的选择状态
      const frameInStore = frames.value.find(f => f.id === frame.id)
      if (frameInStore) frameInStore.selected = true
    }
  }

  return {
    categories,
    frames,
    filteredFrames,
    selectedFrames,
    activeCategory,
    setCategory,
    toggleFrame
  }
}) 