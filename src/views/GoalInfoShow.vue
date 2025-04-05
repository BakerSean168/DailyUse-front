<template>
    <div id="goal-info-show" class="goal-info-show">
        <header class="goal-info-show-header">
            <div class="">
                <button class="btn btn-secondary" @click="$router.back()">
                    <Icon icon="ion:chevron-back" width="24" height="24" />
                </button>
            </div>
            <span>{{ goal?.title || '为检测到' }}</span>
            <div class="button-list">
                <button class="btn btn-secondary" @click="">
                    <Icon icon="bxs:edit" width="24" height="24" />
                </button>
                <button class="btn btn-secondary" @click="">
                    <Icon icon="uiw:more" width="24" height="24" />
                </button>
            </div>
        </header>
        <main>
            <div class="goal-info-show-basic">
                <div class="goal-info-show-basic-progress"></div>
                <div class="goal-info-show-basic-time">
                    <!-- 几天后结束 -->
                    <span>天后结束</span>
                    <!-- 起止时间 -->
                    <div class="goal-content icon-span">
                        <Icon icon="octicon:calendar" width="16" height="16" />
                        <span>{{ formatDate(goal?.startTime) }} - {{ formatDate(goal?.endTime) }}</span>
                    </div>
                    <!-- 进度条 -->
                    <div class="goal-info-show-basic-progress-bar"></div>
                </div>
            </div>
            <!-- 关键结果 -->
            <div class="goal-info-show-keyresult">
                <div class="goal-infomation-show-keyresult-header">
                    <Icon icon="octicon:graph-16" width="16" height="16" />
                    <span>关键结果</span>
                </div>
                <div class="goal-info-show-keyresult-content">
                    <div class="keyresult-item">
                        <Icon icon="octicon:check-circle-fill" width="16" height="16" />
                        <span>完成leetcode题目数量</span>
                    </div>
                    <div class="keyresult-item">
                        <Icon icon="octicon:check-circle-fill" width="16" height="16" />
                        <span>完成leetcode题目数量</span>
                    </div>
                </div>

            </div>
            <!-- 备忘录 -->
            <div class="goal-infomation-show-memo"></div>
        </main>

    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { useGoalStore } from '../stores/goalStore';

const route = useRoute();

const goalStore = useGoalStore();

const goal = computed(() => {
    const goalId = route.params.goalId as string;
    return goalStore.getGoalById(goalId);
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
</script>
<style scoped lang="css">
.goal-info-show-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>