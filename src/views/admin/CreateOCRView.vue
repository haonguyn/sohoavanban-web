<template>
    <div class="flex h-screen">
        <Navbar />
        <main class="flex-1 overflow-auto relative bg-slate-50">
            <OCRComponent />
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";
import OCRComponent from "../../components/OCRComponent.vue";
export default defineComponent({
    name: "DashBoard",
    components: {
        Navbar,
        OCRComponent,
    },
})
</script>