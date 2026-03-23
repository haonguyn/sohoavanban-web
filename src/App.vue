<template>
    <RouterView></RouterView>
    <FloatingChat/>
    <BaseConfirm />
</template>

<style scoped></style>

<script setup>
import BaseConfirm from './components/BaseConfirm.vue';
import FloatingChat from './components/FloatingChat.vue';
</script>
