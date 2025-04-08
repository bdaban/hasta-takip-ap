<script setup lang="ts">
interface AccordionItem {
  label: string
  content: string
  icon?: string
  disabled?: boolean
}

const props = defineProps<{
  items: AccordionItem[]
  type?: 'single' | 'multiple'
}>()

const openItems = ref<number[]>([])

const toggleItem = (index: number) => {
  if (props.type === 'single') {
    openItems.value = openItems.value.includes(index) ? [] : [index]
  } else {
    if (openItems.value.includes(index)) {
      openItems.value = openItems.value.filter(i => i !== index)
    } else {
      openItems.value.push(index)
    }
  }
}

const isOpen = (index: number) => openItems.value.includes(index)
</script>

<template>
  <div class="w-full space-y-2">
    <div v-for="(item, index) in items" :key="index" class="border rounded-lg overflow-hidden">
      <button
        @click="toggleItem(index)"
        :disabled="item.disabled"
        class="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div class="flex items-center space-x-3">
          <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 text-gray-500" />
          <span class="font-medium text-gray-900">{{ item.label }}</span>
        </div>
        <UIcon
          :name="isOpen(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-5 h-5 text-gray-500 transition-transform duration-200"
          :class="{ 'transform rotate-180': isOpen(index) }"
        />
      </button>
      
      <div
        v-show="isOpen(index)"
        class="px-4 py-3 bg-gray-50 border-t"
      >
        <div class="text-gray-700">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template> 