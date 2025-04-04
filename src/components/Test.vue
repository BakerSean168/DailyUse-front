<template>
    <div id="test">
        <h1>Test</h1>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const num1 = [1, 2, 3, [4] ];
const res = num1.flat();
console.log(res);
</script>