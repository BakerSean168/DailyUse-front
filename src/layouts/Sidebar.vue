<template>
    <div id="sidebar" :class="{ 'collapsed': isCollapsed }">
        <!-- 按钮 -->
        <div class="toggle-btn button" @click="toggleCollapse">
            <Icon v-if="isCollapsed" icon="ri:sidebar-unfold-line" width="24" height="24" />
            <Icon v-else icon="ri:sidebar-fold-line" width="24" height="24" />
        </div>
        <!-- Logo -->
        <div class="logo">
            <span v-if="isCollapsed">DU</span>
            <span v-else>DailyUse</span>
        </div>
        <!-- 导航 -->
        <nav class="sidebar-nav">
            <ul>
                <li v-for="(item, index) in items" :key="index" :to="item.path" class="button">
                    <router-link :to="item.path" class="nav-link">
                        <Icon :icon="item.icon" width="24" height="24" />
                        <span v-show="!isCollapsed" class="ml-1rem"> {{ item.name }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>
        <!-- 目标节点 -->
        <GoalDir v-show="!isCollapsed" class="goal-dir"/>
    </div>



</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { Icon } from '@iconify/vue';
import GoalDir from '../components/GoalDir.vue';
const isCollapsed = ref(false);
const toggleCollapse = () => isCollapsed.value = !isCollapsed.value;
const items = [
    { name: '摘要', path: '/summary', icon: 'material-symbols:article-outline-rounded' },
    { name: '目标', path: '/goals', icon: 'carbon:goal' },
    { name: '日历', path: '/calendar', icon: 'carbon:calendar' },
    { name: '设置', path: '/settings', icon: 'uil:setting' },
];

</script>

<style scoped>
#sidebar {
    background-color: #333;
    color: white;
    padding: 1em;
    height: 100%;
    width: 300px;
    box-sizing: border-box;
    /* padding and border included in specified height */

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    transition: width 0.3s ease;
}

#sidebar.collapsed {
    width: 80px;
}

.toggle-btn {
    cursor: pointer;
    text-align: left;
    padding: 0.5em;
    margin-bottom: 1em;
}

.logo {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 1em;
}

.sidebar-nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

}

.sidebar-nav ul {
    list-style: none;
    width: 100%;
    padding: 0;
}

.sidebar-nav li {
    width: 100%;
    padding: 0.5em;

    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.nav-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5em;
    width: 100%;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.nav-link:hover {
    background-color: #555;
}

.goal-dir {
    
    width: 100%;
}
</style>