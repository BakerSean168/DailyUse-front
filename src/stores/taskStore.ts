import { defineStore } from "pinia";
import { v4 as uuidv4 } from 'uuid';
import type { ITaskInstance, ITaskStats, ITaskTemplate, RepeatPattern } from "../types/task";
import { generateTaskInstances } from '../utils/taskUtils';
import { useGoalStore } from "./goalStore";

export const useTaskStore = defineStore('task', {
    state: () => ({
        taskInstances: [] as ITaskInstance[],
        taskTemplates: [] as ITaskTemplate[],
        tempTaskTemplate: {
            id: '',
            title: '',
            repeatPattern: {
                type: 'none',
                days: [],
            },
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            priority: 2,
            description: '',
            keyResultLinks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as ITaskTemplate,
    }),

    getters: {
        // 任务模板相关
        getAllTaskTemplates(): ITaskTemplate[] {
            return this.taskTemplates;
        },

        // 任务实例相关
        // 获取所有任务实例
        getAllTaskInstances(): ITaskInstance[] {
            return this.taskInstances;
        },
        
    },

    actions: {
        // 任务模板 CRUD 操作
        // 初始化任务模板
        initTempTaskTemplate(taskTempalteId: string) {
            if (taskTempalteId === 'temp') {
                this.tempTaskTemplate = {
                    id: 'temp',
                    title: '',
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                    repeatPattern: {
                        type: 'none',
                        days: [],
                    },
                    priority: 2,
                    description: '',
                    keyResultLinks: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
            } else {
                const taskTemplate = this.taskTemplates.find(t => t.id === taskTempalteId);
                if (taskTemplate) {
                    this.tempTaskTemplate = {
                        id: taskTemplate.id,
                        title: taskTemplate.title,
                        description: taskTemplate.description || '',
                        startDate: taskTemplate.startDate,
                        endDate: taskTemplate.endDate,
                        repeatPattern: {
                            type: taskTemplate.repeatPattern.type,
                            days: [...(taskTemplate.repeatPattern.days || [])],
                        },
                        priority: taskTemplate.priority,
                        keyResultLinks: taskTemplate.keyResultLinks ? 
                            taskTemplate.keyResultLinks.map(link => ({...link})) : [],
                        createdAt: taskTemplate.createdAt,
                        updatedAt: taskTemplate.updatedAt,
                    };
                } else {
                    console.error('Task template not found');
                }
            }
            
        },
        // 重置任务模板
        resetTempTaskTemplate() {
            this.tempTaskTemplate = {
                id: '',
                title: '',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                repeatPattern: {
                    type: 'none',
                    days: [],
                },
                priority: 2,
                description: '',
                keyResultLinks: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        },
        // 保存任务模板
        saveTempTaskTemplate() {
            if (this.tempTaskTemplate.id === 'temp') {
                this.tempTaskTemplate.id = uuidv4();
                this.taskTemplates.push(this.tempTaskTemplate);
                // 生成任务实例
                const instances = generateTaskInstances(this.tempTaskTemplate);
                this.taskInstances.push(...instances);
            } else {
                const index = this.taskTemplates.findIndex(t => t.id === this.tempTaskTemplate.id);
                if (index !== -1) {
                    this.taskTemplates[index] = {
                        id: this.tempTaskTemplate.id,
                        title: this.tempTaskTemplate.title,
                        description: this.tempTaskTemplate.description || '',
                        startDate: this.tempTaskTemplate.startDate,
                        endDate: this.tempTaskTemplate.endDate,
                        repeatPattern: {
                            type: this.tempTaskTemplate.repeatPattern.type,
                            days: [...(this.tempTaskTemplate.repeatPattern.days || [])],
                        },
                        priority: this.tempTaskTemplate.priority,
                        keyResultLinks: this.tempTaskTemplate.keyResultLinks ? 
                            this.tempTaskTemplate.keyResultLinks.map(link => ({
                                goalId: link.goalId,
                                keyResultId: link.keyResultId,
                                incrementValue: link.incrementValue
                            })) : [],
                        createdAt: this.tempTaskTemplate.createdAt,
                        updatedAt: new Date().toISOString(), // Update the timestamp
                    };
                    // 更新任务实例(先移除旧的，再增加新的)
                    this.taskInstances = this.taskInstances.filter(t => t.templateId !== this.tempTaskTemplate.id);
                    const instances = generateTaskInstances(this.tempTaskTemplate);
                    this.taskInstances.push(...instances);

                } else {
                    console.error('Task template not found');
                }
            }
            this.resetTempTaskTemplate();
        },
        // 删除任务模板
        deleteTaskTemplate(taskId: string) {
            const index = this.taskTemplates.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.taskTemplates.splice(index, 1);
            }
        },

        // 任务实例相关
        // Task completion handling
        async completeTask(taskId: string) {
            const goalStore = useGoalStore();
            const taskIndex = this.taskInstances.findIndex(t => t.id === taskId);
            
            if (taskIndex !== -1) {
                const task = this.taskInstances[taskIndex];
                
                // Update task completion status
                this.taskInstances[taskIndex] = {
                    ...task,
                    completed: true,
                    completedAt: new Date().toISOString()
                };
        
                // Update linked key results if any
                if (task.keyResultLinks?.length) {
                    for (const link of task.keyResultLinks) {
                        goalStore.updateKeyResultStartValue(
                            link.goalId,
                            link.keyResultId,
                            link.incrementValue
                        );
                    }
                }
        
                return true;
            }
        
            console.error('Task not found:', taskId);
            return false;
        }
    },

    persist: true,
});