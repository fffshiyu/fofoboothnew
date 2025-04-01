import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Frame {
  id: string
  category: string
  selected: boolean
  imageIndex: number // 图片序号
  imagePath: string // 图片路径
}

interface Category {
  id: string
  name: string
  icon: string
  imageCount: number // 每个分类的图片数量
  imagePrefix: string // 图片名称前缀
}

// 使用组合式API写法
export const useFrameStore = defineStore('frame', () => {
  // 分类数据 - 添加每个分类的图片数量和图片前缀
  const categories = ref<Category[]>([
    { id: 'all', name: 'ALL', icon: '/images/hello_kitty_yeah.png', imageCount: 0, imagePrefix: '' },
    { id: 'idol', name: 'IDOL', icon: '/images/hello_kitty_yeah.png', imageCount: 28, imagePrefix: 'Overlay' },
    { id: 'cute', name: 'CUTE', icon: '/images/hello_kitty_yeah.png', imageCount: 28, imagePrefix: 'cute' },
    { id: 'y2k', name: 'Y2K', icon: '/images/hello_kitty_yeah.png', imageCount: 28, imagePrefix: 'y2k' },
    { id: 'vibe', name: 'VIBE', icon: '/images/hello_kitty_yeah.png', imageCount: 28, imagePrefix: 'vibe' }
  ])

  // 创建所有分类的框架
  const tempFrames: Frame[] = [];
  let frameIndex = 0;

  // 为每个分类创建框架
  categories.value.forEach(category => {
    if (category.id !== 'all') { // 跳过'all'分类
      for (let i = 0; i < category.imageCount; i++) {
        const imageIndex = i + 1; // 图片索引从1开始
        
        // 根据分类确定图片路径，使用相对路径
        let imagePath = '';
        if (category.id === 'idol') {
          // 对idol类别使用不同路径模式
          imagePath = `/images/idol/Overlay${imageIndex}.png`;
        } else if (category.id === 'cute') {
          // 对cute类别使用不同路径模式
          imagePath = `/images/cute/cute${imageIndex}.png`;
        } else {
          // 其他类别使用通用模式
          imagePath = `/images/${category.id}/${category.imagePrefix}${imageIndex}.png`;
        }

        tempFrames.push({
          id: `frame-${frameIndex++}`,
          category: category.id,
          selected: false,
          imageIndex: imageIndex,
          imagePath: imagePath
        });
      }
    }
  });

  const frames = ref<Frame[]>(tempFrames);

  // 当前激活的分类 - 默认设为idol
  const activeCategory = ref('idol')
  
  // 已选择的框架
  const selectedFrames = ref<Frame[]>([])

  // 根据当前分类过滤的框架
  const filteredFrames = computed(() => {
    if (activeCategory.value === 'all') {
      return frames.value;
    }
    return frames.value.filter(frame => frame.category === activeCategory.value);
  })

  // 设置当前分类
  function setCategory(category: string) {
    activeCategory.value = category;
  }

  // 切换框架的选择状态
  function toggleFrame(frame: Frame) {
    // 查找精确匹配的框架
    const frameInStore = frames.value.find(f => f.id === frame.id);
    if (!frameInStore) return; // 如果找不到框架，直接返回
    
    const index = selectedFrames.value.findIndex(f => f.id === frame.id);
    
    // 如果已经选择了，就移除
    if (index > -1) {
      selectedFrames.value.splice(index, 1);
      // 更新框架的选择状态
      frameInStore.selected = false;
    } 
    // 如果未选择且未达到4张限制，则添加
    else if (selectedFrames.value.length < 4) {
      selectedFrames.value.push(frameInStore); // 使用store中的框架引用
      // 更新框架的选择状态
      frameInStore.selected = true;
    }
  }

  // 获取分类的图片数量
  function getCategoryImageCount(categoryId: string): number {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.imageCount : 0;
  }

  return {
    categories,
    frames,
    filteredFrames,
    selectedFrames,
    activeCategory,
    setCategory,
    toggleFrame,
    getCategoryImageCount
  }
}) 