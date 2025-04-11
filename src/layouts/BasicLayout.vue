<script setup lang="ts">
import Siderbar from './Sidebar.vue';

</script>

<template>
    <div id="basic-layout">
        <div class="siderbar">
            <Siderbar/>
        </div>
        <main class="main">
            <router-view></router-view>
        </main>
    </div>
</template>

<style scoped>
#basic-layout {
    display: flex;
    height: 100vh;
    width: 100vw;

    flex-direction: row;
}

.sidebar {


    box-sizing: border-box;
    /* padding and border included in specified height */

    overflow-y: auto;
}
.main {
    flex: 1;
    padding: 1em;
    overflow-y: auto;
}
</style>