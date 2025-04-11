<template>
    <div class="modal-overlay" v-if="visible">
        <div class="modal-container">
            <div class="modal-header">
                <button class="btn btn-secondary" @click="handleCancel">取消</button>
                <h2>{{ tempTask.id === 'temp' ? '新建任务模板' : '编辑任务模板'}}</h2>
                <button class="btn btn-primary" @click="handleSave" :disabled="!isValid">保存</button>
            </div>

            <div class="modal-content">
                <!-- 任务标题 -->
                <div class="form-group">
                    <input type="text" v-model="tempTask.title" placeholder="任务标题"
                        :class="{ 'invalid': errors.title }">
                    <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
                </div>

                <!-- 任务描述 -->
                <div class="form-group">
                    <textarea v-model="tempTask.description" placeholder="任务描述（可选）" rows="3"></textarea>
                </div>

                

                <!-- 重复设置 -->
                <div class="form-group">
                    <label>重复</label>
                    <select v-model="tempTask.repeatPattern.type">
                        <option value="none">不重复</option>
                        <option value="daily">每天</option>
                        <option value="weekly">每周</option>
                        <!-- <option value="monthly">每月</option> -->
                    </select>

                    <!-- 周重复选择 -->
                    <div v-if="tempTask.repeatPattern.type === 'weekly'" class="weekday-selector">
                        <button v-for="(day, index) in weekDays" :key="index"
                            :class="{ active: tempTask.repeatPattern.days?.includes(index) }"
                            @click="toggleWeekday(index)">
                            {{ day }}
                        </button>
                    </div>

                    <!-- 月重复选择 -->
                    <!-- <div v-if="tempTask.repeatPattern.type === 'monthly'" class="date-selector">
                        <input type="number" v-model.number="monthDate" min="1" max="31"
                            placeholder="每月几号">
                    </div> -->
                </div>
                <!-- 开始日期 -->
                <div class="form-group">
                    <label>开始日期</label>
                    <input type="date" v-model="tempTask.startDate" :min="today">
                </div>
                <!-- 结束日期 -->
                <div class="form-group">
                    <label>截止日期</label>
                    <input type="date" v-model="tempTask.endDate" :min="today">
                </div>
                <!-- 关联关键结果 -->
                <div class="form-group">
                    <label>关联关键结果</label>
                    <div v-for="(link, index) in tempTask.keyResultLinks" :key="index" class="key-result-link">
                        <select v-model="link.goalId" @change="handleGoalChange(index)">
                            <option value="">选择目标</option>
                            <option v-for="goal in goals" :key="goal.id" :value="goal.id">
                                {{ goal.title }}
                            </option>
                        </select>
                        <select v-model="link.keyResultId" :disabled="!link.goalId">
                            <option value="">选择关键结果</option>
                            <option v-for="kr in getKeyResults(link.goalId)" :key="kr.id" :value="kr.id">
                                {{ kr.name }}
                            </option>
                        </select>
                        <input type="number" v-model.number="link.incrementValue" placeholder="增加值"
                            min="0">
                        <button class="btn-icon" @click="removeKeyResultLink(index)">
                            <Icon icon="mdi:close" />
                        </button>
                    </div>
                    <button class="btn btn-secondary" @click="addKeyResultLink">
                        <Icon icon="mdi:plus" />
                        添加关联
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {  computed, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import { useGoalStore } from '../stores/goalStore';
import { useTaskStore } from '../stores/taskStore';

defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'save'): void;
    (e: 'cancel'): void;
}>();

const goalStore = useGoalStore();
const taskStore = useTaskStore();
const tempTask = computed({
    get: () => taskStore.tempTaskTemplate,
    set: (value) => {
        taskStore.tempTaskTemplate = value;
        console.log('tempTask', taskStore.tempTaskTemplate);
    }
});
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
const today = new Date().toISOString().split('T')[0];

const errors = reactive({
    title: '',
});

const goals = computed(() => goalStore.getAllGoals);

const isValid = computed(() => {
    return tempTask.value.title.trim() !== '' && !errors.title;
});

// 验证表单
const validateForm = () => {
    errors.title = tempTask.value.title.trim() === '' ? '请输入任务标题' : '';
    return !errors.title;
};

// 处理周重复日期选择
const toggleWeekday = (day: number) => {
    const days = tempTask.value.repeatPattern.days || [];
    const index = days.indexOf(day);
    if (index === -1) {
        days.push(day);
    } else {
        days.splice(index, 1);
    }
    days.sort();
    tempTask.value.repeatPattern.days = days;
};

// 处理关键结果关联
const addKeyResultLink = () => {
    tempTask.value.keyResultLinks?.push({
        goalId: '',
        keyResultId: '',
        incrementValue: 1,
    });
};

const removeKeyResultLink = (index: number) => {
    tempTask.value.keyResultLinks?.splice(index, 1);
};

const getKeyResults = (goalId: string) => {
    const goal = goals.value.find(g => g.id === goalId);
    return goal?.keyResults || [];
};

const handleGoalChange = (index: number) => {
    const link = tempTask.value.keyResultLinks?.[index];
    if (link) {
        link.keyResultId = '';
    }
};

// 保存任务
const handleSave = () => {
    if (!validateForm()) {
        console.error('表单验证失败');
        return;
    }
    emit('save');
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-container {
    background-color: rgb(41, 41, 41);
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content {
    padding: 1rem;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 1rem;
}

.weekday-selector {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.weekday-selector button {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid #ccc;
    background: transparent;
    color: #ccc;
    cursor: pointer;
}

.weekday-selector button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.key-result-link {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.invalid {
    border-color: #ff4444;
}

.error-message {
    color: #ff4444;
    font-size: 0.8rem;
    margin-top: 0.25rem;
}
</style>