<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import NavMain from './NavMain.vue'
// import NavProjects from './NavProjects.vue'
import NavUser from './NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'

import {
  Signal,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const data = {
  user: {
    name: 'Unesc',
    email: 'unesc@unesc.net',
    avatar: 'https://github.com/shadcn.png',
  },
  navMain: [
    {
      title: 'Bubble Sort',
      url: '/bubble-sort',
      icon: Signal,
      isActive: false,
    },
    {
      title: 'Selection Sort',
      url: '/selection-sort',
      icon: Signal,
      isActive: false,
    },
    {
      title: 'Insertion Sort',
      url: '/insertion-sort',
      icon: Signal,
      isActive: false,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
