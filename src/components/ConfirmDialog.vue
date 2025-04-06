<template>
    <div v-if="visible" class="confirm-overlay" @click="handleOverlayClick">
        <div class="confirm-container" @click.stop>
            <div class="confirm-header">
                <Icon :icon="icon" :width="24" :height="24" :style="{ color: iconColor }" />
                <h3>{{ title }}</h3>
            </div>
            <div class="confirm-content">
                <p>{{ message }}</p>
            </div>
            <div class="confirm-actions">
                <button class="btn btn-secondary" @click="handleCancel">
                    {{ cancelText }}
                </button>
                <button 
                    class="btn btn-danger" 
                    @click="handleConfirm"
                    :class="{ 'loading': loading }"
                    :disabled="loading"
                >
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Props {
    visible: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
    iconColor?: string;
    loading?: boolean;
    closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '确认操作',
    message: '确定要执行此操作吗？',
    confirmText: '确认',
    cancelText: '取消',
    icon: 'material-symbols:warning',
    iconColor: '#ff4444',
    loading: false,
    closeOnClickOutside: true,
});

const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();

const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');
const handleOverlayClick = () => {
    if (props.closeOnClickOutside) {
        emit('cancel');
    }
};
</script>

<style scoped>
.confirm-overlay {
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

.confirm-container {
    background-color: rgb(41, 41, 41);
    border-radius: 8px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.confirm-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.confirm-header h3 {
    margin: 0;
    font-size: 1.2rem;
}

.confirm-content {
    margin-bottom: 24px;
    color: #ccc;
}

.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-danger {
    background-color: #ff4444;
    color: white;
}

.btn-danger:hover {
    background-color: #ff6666;
}

.loading {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>