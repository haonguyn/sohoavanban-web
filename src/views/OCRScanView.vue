<template>
    <Header />
    <OCRComponent />
    <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import OCRComponent from "../components/OCRComponent.vue";

export default defineComponent({
    name: "OcrView",
    components: {
        Header,
        OCRComponent,
        Footer,
    },
});
</script>