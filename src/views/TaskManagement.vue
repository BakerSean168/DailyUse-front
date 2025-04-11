<template>
    <div id="task-management">
        <header class="task-header">
            <div class="task-header-title">
                <h1>任务</h1>
            </div>
        </header>

        <main>
            <div class="task-tabs">
                <button v-for="tab in tabs" :key="tab.value" class="tab-btn"
                    :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
                    <Icon :icon="tab.icon" width="20" height="20" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- 每日任务页面 -->
            <div v-if="activeTab === 'daily'" class="task-content">
                <TaskInstanceManagement />
                
            </div>
            <!-- 任务管理页面 -->
            <div v-else>
                <TaskTemplateManagement />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import TaskTemplateManagement from '../components/TaskTemplateManagement.vue';
import TaskInstanceManagement from '../components/TaskInstanceManagement.vue';
const activeTab = ref('daily');
const tabs = [
    {
        label: '每日任务',
        value: 'daily',
        icon: 'mdi:calendar-today'
    },
    {
        label: '任务管理',
        value: 'management',
        icon: 'mdi:format-list-checks'
    }
];
</script>

<style scoped>
#task-management {
    padding: 1rem;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.task-header-title {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.task-stats {
    display: flex;
    gap: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ccc;
}

.task-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.filter-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: #ccc;
    cursor: pointer;
}

.filter-btn.active {
    background: var(--primary-color);
    color: white;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.task-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.task-content {
    flex: 1;
}

.task-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.task-title.completed {
    text-decoration: line-through;
    color: #666;
}

.task-meta {
    display: flex;
    gap: 1rem;
    color: #999;
    font-size: 0.9rem;
}

.due-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.due-date.overdue {
    color: #ff4444;
}

.repeat-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-icon {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #ccc;
    cursor: pointer;
}

.btn-icon:hover {
    background: rgba(255, 255, 255, 0.1);
}

.count {
    background: rgba(0, 0, 0, 0.2);
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
    margin-left: 0.5rem;
}
</style>