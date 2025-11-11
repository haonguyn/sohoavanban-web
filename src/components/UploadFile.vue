<template>
  <div class="upload">
    <input type="file" @change="onFileChange" />
  </div>
</template>

<script setup lang="ts">
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) console.log('File uploaded:', file.name)
}
</script>

<style scoped>
.upload {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
}
</style>
