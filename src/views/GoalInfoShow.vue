<template>
    <div id="goal-info-show" class="goal-info-show" :style="{ '--goal-color': goalColor }">
        <header class="goal-info-show-header">
            <div class="">
                <button class="btn btn-secondary" @click="$router.back()">
                    <Icon icon="ion:chevron-back" width="24" height="24" />
                </button>
            </div>
            <span>{{ goal?.title || '为检测到' }}</span>
            <div class="button-list">
                <button class="btn btn-secondary" @click="editGoal(goal?.id as string)">
                    <Icon icon="bxs:edit" width="24" height="24" />
                </button>
                <button class="btn btn-secondary" @click="showConfirmDialog = true">
                    <Icon icon="material-symbols:delete-outline" width="24" height="24" />
                </button>
                <button class="btn btn-secondary" >
                    <Icon icon="uiw:more" width="24" height="24" />
                </button>
                
            </div>
        </header>
        <main>
            <div class="goal-info-show-basic">
                <div class="goal-info-show-basic-progress">
                    <svg class="progress-ring" width="130" height="130">
                        <circle class="progress-ring__circle--bg" cx="65" cy="65" r="50" stroke-width="15" />
                        <circle class="progress-ring__circle" cx="65" cy="65" r="50" stroke-width="15"
                            :style="{ strokeDashoffset: getCircleOffset(goalProgress) }" />
                    </svg>
                    <div class="progress-text-container">
                        <div class="progress-value">
                            <span class="number">{{ goalProgress }}</span>
                            <span class="percent">%</span>
                        </div>
                        <span class="progress-label">目标进度</span>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="goal-info-show-basic-time">
                    <!-- 几天后结束 -->
                    <div class="time-remaining">
                        <span class="number">{{ remainingDays }}</span>
                        <span>天后结束</span>
                    </div>

                    <!-- 起止时间 -->
                    <div class="goal-info-show-basic-time-text">
                        <Icon icon="octicon:calendar" width="16" height="16" />
                        <span>{{ formatDate(goal?.startTime) }} - {{ formatDate(goal?.endTime) }}</span>
                    </div>
                    <!-- 时间进度条 -->
                    <div class="goal-info-show-basic-time-progress-bar">
                        <div class="progress-track">
                            <div class="progress-fill" :style="{ width: `${timeProgress}%` }"></div>
                        </div>
                        <span class="progress-text">{{ timeProgress }}%</span>
                    </div>
                </div>
            </div>
            <!-- 关键结果 -->
            <div class="goal-info-show-keyresult">
                <div class="goal-infomation-show-keyresult-header">
                    <Icon icon="octicon:graph-16" width="16" height="16" />
                    <span>关键结果</span>
                </div>
                <div class="kr-grid">
                    <div v-for="keyResult in keyResults" :key="keyResult.id" class="kr-card"
                        :style="{ '--progress': `${getKrProgress(keyResult.id)}%` }">
                        <span class="kr-title">{{ keyResult.name }}</span>
                        <div class="kr-values">

                            {{ keyResult.startValue }} → {{ keyResult.targetValue }}
                            <button class="increment-btn" @click.stop="goalStore.updateKeyResultStartValue(goal?.id as string, keyResult.id, 1)">
                                <Icon icon="material-symbols:add" width="20" height="20" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 备忘录 -->
            <div class="goal-infomation-show-memo"></div>
        </main>
        <GoalDialog
            :visible="showGoalDialog"
            :goal-id="editGoalId"
            :mode="editMode"
            @close="showGoalDialog = false"
            @save="saveGoal"
            @update="saveGoal"
        />
        <ConfirmDialog
            :visible="showConfirmDialog"
            title="删除目标"
            message="确定要删除该目标吗？此操作不可撤销。"
            confirm-text="确认"
            cancel-text="取消"
            @confirm="handleDeleteGoal"
            @cancel="showConfirmDialog = false"
        />
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { useGoalStore } from '../stores/goalStore';
import GoalDialog from '../components/GoalDialog.vue';
import { useGoalDialog } from '../composables/useGoalDialog';
import ConfirmDialog from '../components/ConfirmDialog.vue';


const route = useRoute();
const router = useRouter();
const goalStore = useGoalStore();
const { showGoalDialog, editGoal, editMode, editGoalId, saveGoal } = useGoalDialog();

const goal = computed(() => {
    const goalId = route.params.goalId as string;
    return goalStore.getGoalById(goalId);
});
// 得到 goal 中的 颜色
const goalColor = computed(() => goal.value?.color || '#FF5733');
// 得到 goal 中的 关键结果  
const keyResults = computed(() => {
    const goalId = route.params.goalId as string;
    return goalStore.getAllKeyResultsByGoalId(goalId);
});
// 计算时间的进度
const timeProgress = computed(() => {
    if (!goal.value) return 0;

    const startDate = new Date(goal.value.startTime);
    const endDate = new Date(goal.value.endTime);
    const today = new Date();

    const totalTime = endDate.getTime() - startDate.getTime();
    const elapsedTime = today.getTime() - startDate.getTime();

    const progress = (elapsedTime / totalTime) * 100;
    return Math.min(Math.max(progress, 0), 100).toFixed(1);
});
// 计算目标的进度
const goalProgress = computed(() => {
    const goalId = route.params.goalId as string;
    return goalStore.getGoalProgress(goalId) || 0;
});
// 计算圆环的偏移量
const getCircleOffset = (progress: number) => {
    const radius = 50; // 半径
    const circumference = 2 * Math.PI * radius; // 2πr
    return circumference - (progress / 100) * circumference;
};

// 计算关键结果的进度
const getKrProgress = (keyResultId: string) => {
    const goalId = route.params.goalId as string;
    return goalStore.getKeyResultProgress(goalId, keyResultId) || 0;
};

// 计算目标的剩余天数
const remainingDays = computed(() => {
    const goalId = route.params.goalId as string;
    const goal = goalStore.getGoalById(goalId);
    if (!goal) return 0;

    const endDate = new Date(goal.endTime);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
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
// 删除目标  
const showConfirmDialog = ref(false);
const handleDeleteGoal = async () => {
    try {
        await goalStore.deleteGoal(goal.value?.id as string);
        showConfirmDialog.value = false;
        // Navigate back after successful deletion
        router.back();
    } catch (error) {
        console.error('Failed to delete goal:', error);
    }
};

</script>
<style scoped lang="css">
.goal-info-show-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

/* 基本信息 */
.goal-info-show-basic {

    width: 100%;
    height: 150px;
    background-color: rgb(76, 78, 80);
    border-radius: 10px;
    padding: 20px;


    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
}

.goal-info-show-basic-progress {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
}

.goal-info-show-basic-time {
    width: 100%;
    height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    justify-content: flex-end;
    margin-left: 20px;
    margin-right: 250px;
}


.divider {
    width: 6px;
    height: 60px;
    background-color: #ccc;
    margin: 0 30px;
}


/* 基本信息：目标圆环进度条 */
.progress-ring {
    transform: rotate(-90deg);
    /* Start from top */
    position: absolute;
    
    
}

.progress-ring__circle--bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 15px;
}

.progress-ring__circle {
    fill: none;
    stroke: var(--goal-color);
    stroke-linecap: round;
    stroke-width: 15px;
    stroke-dasharray: 314.159;
    /* 2 * PI * 50 (radius) */
    transform-origin: center;
    transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
    position: relative;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
}

/* 基本信息：目标圆环进度条内的文字样式 */
.progress-text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.progress-value {
    display: flex;
    align-items: flex-start;
    line-height: 1;
}

.progress-value .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
}

.progress-value .percent {
    font-size: 1rem;
    color: #ccc;
    margin-left: 2px;
    margin-top: 4px;
}

.progress-label {
    font-size: 0.875rem;
    color: #ccc;
}

/* 基本信息：剩余时间 */
.time-remaining {
    margin-bottom: 0.5rem;
}

.time-remaining .number {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 8px;
    margin-right: 4px;
}

/* 基本信息：时间进度条 */
.goal-info-show-basic-time-progress-bar {
    width: 100%;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-track {
    flex-grow: 1;
    height: 10px;
    /* 进度条高度 */
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: var(--goal-color);
    border-radius: 3px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 12px;
    color: #ccc;
    min-width: 45px;
}

/* 关键结果相关 */
.goal-infomation-show-keyresult-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
}

/* kr样式 */
.kr-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 0;
}

.kr-card {
    position: relative;
    border-radius: 12px;
    padding: 1rem;
    min-height: 100px;
    background: linear-gradient(to right,
            var(--goal-color) var(--progress),
            transparent var(--progress));
    border: 1px solid var(--goal-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.kr-title {
    font-weight: 500;
    font-size: 1rem;
    color: #fff;
}

.kr-values {
    text-align: center;
    font-size: 0.9rem;
    color: #ccc;

}
.increment-btn {
    position: absolute;

    right: 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #ccc;
}
</style>