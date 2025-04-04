<template>
    <div id="summary">
        <header>
            <Icon icon="octicon:graph-16" width="16" height="16" />
            <h1>Summary</h1>
        </header>
        <div class="box1">
            x: {{ x }},y: {{ y }}
            <div class="box2">box2</div>
        </div>
        <div v-if="isMobile" class="box2">isMobile</div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const nav = ref("summary");

const x = ref(0);
const y = ref(0);

const updateMouse = (e) => {
    x.value = e.clientX;
    y.value = e.clientY;
}

onMounted(() => {
    window.addEventListener('mousemove', updateMouse);
})

onUnmounted(() => {
    window.removeEventListener('mousemove', updateMouse);
})

// const flat = function (arr, dep) {
//     console.log(...arr);
//     arr = [].concat(...arr);
//     console.log(arr);
// }
// console.log(Date.now());
// flat([1, 2, 3, [4,5,[6,7,8]]], 2);

// const num1 = [1, 2, 3, [4,5,[6,7,8]] ];


</script>
<style scoped>
#summary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 100%;
    width: 100%;
}

header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
}

.box1 {
    display: flex;
    background-color: #000;
    width: 300px;
    height: 300px;
    wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 1rem;
    border-radius: 0.5rem;

    justify-content: center;
    align-items: center;
}

.box2 {
    position: absolute;
    background-color: #f00;
    width: 100px;
    height: 100px;
    padding: 1rem;
    border-radius: 0.5rem;
    animation: moveL 2s linear infinite;

}

/* 定义旋转动画 */
@keyframes moveL {
  0% {
    transform: translateX(0);  /* 初始位置 */
  }
  50% {
    transform: translateX(100px);  /* 向右移动100px */
  }
  100% {
    transform: translateX(0);  /* 返回原点（可改为-100px实现完整左右循环） */
  }
}

.btn {
  /* 初始状态应用动画：1秒一圈，无限循环 */
  animation: moveL 2s linear infinite;
  /* 其他样式（如尺寸、定位等） */
  width: 50px;
  height: 50px;
  background: #2196F3;
}

/* 鼠标悬停时暂停动画 */
.box2:hover {
  animation-play-state: paused;
}
</style>