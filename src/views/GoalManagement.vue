<template>
    <div id="goal-management">
        <header class="goal-management-header">


            <!-- title on the left -->
            <div class="title-row">
                <div class="title icon-span">
                    <Icon :icon="currentDir?.icon || 'clarity:directory-line'" width="40" height="40" />
                    <h1>{{ currentDir?.name || '未检测到名称' }}</h1>
                </div>
            </div>
        </header>
        <main>
            <div class="status-tabs">
                <button v-for="tab in statusTabs" :key="tab.value" class="tab-btn"
                    :class="{ active: currentStatus === tab.value }" @click="currentStatus = tab.value">
                    {{ tab.label }}
                    <span class="count">{{ getGoalCountByStatus(tab.value) }}</span>
                </button>
            </div>
            <div v-for="goal in filteredGoals" :key="goal.id" class="goal-card" @click="navigateToGoalInfo(goal.id)">
                <div class="goal-header icon-span">
                    <Icon icon="tabler:point" width="16" height="16" />
                    <span class="goal-title">{{ goal.title }}</span>
                </div>
                <div class="goal-content icon-span">
                    <Icon icon="tdesign:calendar" width="16" height="16" />
                    <span>{{ formatDate(goal.startTime) }} - {{ formatDate(goal.endTime) }}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-container">
                        <div class="progress" :style="{
                            width: `${getGoalProgress(goal.id)}%`,
                            background: `linear-gradient(90deg, ${goal.color || '#4CAF50'}, ${goal.color || '#8BC34A'})`
                        }"></div>
                    </div>
                    <span>{{ getGoalProgress(goal.id) }}%</span>
                </div>

            </div>
        </main>
    </div>

</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useGoalDirStore } from '../stores/goalDirStore';
import { useGoalStore } from '../stores/goalStore';




const route = useRoute();
const router = useRouter();
const goalDirStore = useGoalDirStore();
const goalStore = useGoalStore();

// 目标分类
const statusTabs = [
    { label: '全部', value: 'all' },
    { label: '进行中', value: 'in-progress' },
    // { label: '已完成', value: 'completed' },
    { label: '已过期', value: 'expired' }
];
const currentStatus = ref('all');

const navigateToGoalInfo = (goalId: string) => {
    router.push({
        name: 'GoalInformation',
        params: {
            id: route.params.id, // Keep current directory id
            goalId: goalId      // Pass goal id
        }
    });
};

const getGoalProgress = (goalId: string): number => {
    return goalStore.getGoalProgress(goalId) || 0;
};
// 计算出但前所在的目标节点的 ID
const currentDirId = computed(() => {
    const id = route.params.id;
    console.log('currentDirId', id);
    return typeof id === 'string' ? id : '';
});
// 从 goalDirStore 中根据 ID 获取目标节点
const currentDir = computed(() => {

    return goalDirStore.getDirById(currentDirId.value);

});

// 从 goalStore 中根据文件夹的 ID 获取位于该文件夹下的目标
const goals = computed(() => {
    if (currentDirId.value === 'all') {
        return goalStore.getAllGoals;
    }
    return goalStore.getGoalsByDirId(currentDirId.value);
});


function formatDate(dateString: any) {
    if (!dateString) return '';

    const date = new Date(dateString);
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];

    // Alternative format options:
    // return date.toLocaleDateString(); // Uses browser locale format
    // return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const filteredGoals = computed(() => {
    if (currentStatus.value === 'all') {
        return goals.value;
    }
    if (currentStatus.value === 'in-progress') {
        return goals.value.filter(goal => {
            const now = new Date();
            return new Date(goal.startTime) <= now && new Date(goal.endTime) >= now;
        });
    }
    if (currentStatus.value === 'expired') {
        return goals.value.filter(goal => {
            const now = new Date();
            return new Date(goal.endTime) < now;
        });
    }
});
const getGoalCountByStatus = (status: string) => {
    if (status === 'all') {
        return goals.value.length;
    }
    if (status === 'in-progress') {
        return goals.value.filter(goal => {
            const now = new Date();
            return new Date(goal.startTime) <= now && new Date(goal.endTime) >= now;
        }).length;
    }
    if (status === 'expired') {
        return goals.value.filter(goal => {
            const now = new Date();
            return new Date(goal.endTime) < now;
        }).length;
    }
    return 0;
};

</script>

<style scoped>
#goal-management {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
}
/* 分类标签 */
.status-tabs {
    display: flex;
    gap: 2em;
    margin-bottom: 1em;
}
.status-tabs .tab-btn {
    background-color: #2d2d2d;
    color: #ccc;
    padding: 0.5em 1em;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    font-size: 1rem;
    font-weight: 700;
}
.status-tabs .tab-btn.active {

    color: rgb(89, 140, 206);
    border-bottom: #5c88da solid 2px;

}

.btn-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1em;
}

.goal-card {
    background-color: #413a3a;

    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(141, 137, 137, 0.1);
    padding: 16px;
    margin-bottom: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.goal-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(141, 137, 137, 0.2);
}

.goal-title {
    font-size: 1.2em;
    font-weight: bold;
}

/* Progress bar */
.progress-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    width: 70%;
}

.progress-container {
    flex: 1;
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.progress {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-bar span {
    font-size: 0.85rem;
    color: #ccc8c8;
    min-width: 45px;
    text-align: right;
}
</style>