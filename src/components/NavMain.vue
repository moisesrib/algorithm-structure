<script setup lang="ts">
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type LucideIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}>()

const activeItem = ref<string | null>(null)

const handleItemClick = (item: { title: string, url: string }) => {
  if (activeItem.value === item.title) {
    activeItem.value = null
  } else {
    activeItem.value = item.title
  }
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel class="text-sm font-bold">Unesc Algorithms</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <RouterLink :to="item.url">
          <SidebarMenuButton 
            :tooltip="item.title" 
            @click="handleItemClick(item)" 
            class="cursor-pointer transition-all duration-200" 
            :class="{ 
              'bg-purple-400/40 text-black font-semibold': activeItem === item.title,
              'hover:bg-purple-400/40 hover:text-purple-500': activeItem !== item.title 
            }"
          >
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </SidebarMenuButton>
        </RouterLink>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
