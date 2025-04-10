<template>
    <div id="goal-dir" class="goal-dir">
        <header class="header icon-span justify-between">
            <h1>目标节点</h1>
            <div class="dropdown">
                <button class="dropdown-trigger">
                    <Icon icon="material-symbols:add" width="24" height="24" />
                </button>
                <div class="dropdown-menu">
                    <div class="dropdown-item" @click="addGoal">
                        <Icon icon="mdi:target" width="20" height="20" />
                        <span>创建目标</span>
                    </div>
                    <div class="dropdown-item" @click="showGoalDirDialog = true">
                        <Icon icon="material-symbols:create-new-folder" width="20" height="20" />
                        <span>创建目标节点</span>
                    </div>
                </div>
            </div>
        </header>
        <main>
            <div v-for="item in goalDirs" :name="item.name" :key="item.id" :icon="item.icon" class="button">
                <RouterLink :to="`/goal-management/${item.id}`" class="button-list">
                    <Icon :icon="item.icon" width="24" height="24" />
                    <span class="ml-1rem">{{ item.name }}</span>
                </RouterLink>
            </div>
        </main>
        <GoalDialog
        :visible="showGoalDialog"
        :goal-id="editGoal"
        :mode="editMode"
        @close="showGoalDialog = false"
        @save="saveGoal"
        @update="updateGoal"
        />
    </div>
    
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useGoalDirStore } from '../stores/goalDirStore';
import { useGoalStore } from '../stores/goalStore';
import GoalDialog from './GoalDialog.vue';
import type { IGoal } from '../types/goal';

const goalDirStore = useGoalDirStore();
const goalStore = useGoalStore();

const showGoalDialog = ref(false);
const showGoalDirDialog = ref(false);
const editGoal = ref('temp');
const editMode = ref<'create' | 'edit'>('create');
// 得到所有的目标节点
const goalDirs = computed(() => {
    return goalDirStore.getAllDirs;
});

const addGoal = () => {
    editMode.value = 'create';
    editGoal.value = 'temp';
    showGoalDialog.value = true;
}
const saveGoal = () => {
    const savedGoal = goalStore.addGoal();
    if (savedGoal) {
        showGoalDialog.value = false;
    }
}
const updateGoal = (goal:IGoal) => {
    goalStore.updateGoal(goal);
    showGoalDialog.value = false;
}

</script>

<style scoped>
.goal-dir {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
    width: 100%;
}
/* 下拉列表 */
.dropdown {
    position: relative;
}

.dropdown-trigger {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.dropdown-trigger:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #2d2d2d;
    border-radius: 4px;
    padding: 0.5rem 0;
    min-width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s;
}

.dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #fff;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Ensure dropdown menu stays on top */
.dropdown-menu {
    z-index: 100;
}
</style>