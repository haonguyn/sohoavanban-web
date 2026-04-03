<template>
    <RouterView></RouterView>
    <FloatingChat/>
    <BaseConfirm />
    <ToastNotification />
</template>

<style scoped></style>

<script setup>
import BaseConfirm from './components/BaseConfirm.vue';
import FloatingChat from './components/FloatingChat.vue';
import ToastNotification from './components/ToastNotification.vue';
</script>
