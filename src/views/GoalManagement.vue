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
            <div v-for="goal in goals" :key="goal.id" class="goal-card" @click="navigateToGoalInfo(goal.id)">
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
                        <div class="progress" :style="{ width: `36.4%` }"></div>
                    </div>
                    <span>36.4%</span>
                </div>

            </div>
        </main>
    </div>

</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useGoalDirStore } from '../stores/goalDirStore';
import { useGoalStore } from '../stores/goalStore';
import GoalDialog from '../components/GoalDialog.vue';



const route = useRoute();
const router = useRouter();
const goalDirStore = useGoalDirStore();
const goalStore = useGoalStore();

const navigateToGoalInfo = (goalId: string) => {
    router.push({
        name: 'GoalInformation',
        params: { 
            id: route.params.id, // Keep current directory id
            goalId: goalId      // Pass goal id
        }
    });
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

// 编辑目标相关

</script>

<style scoped>
#goal-management {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
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
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
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