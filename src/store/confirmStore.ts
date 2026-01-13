import { defineStore } from "pinia";

export const useConfirmStore = defineStore("confirm", {
    state: () => ({
        visible: false,
        message: "",
        resolve: null as null | (() => void),
    }),

    actions: {
        open(message: string) {
            return new Promise<void>((resolve) => {
                this.message = message;
                this.visible = true;
                this.resolve = resolve;
            });
        },

        confirm() {
            this.visible = false;
            if (this.resolve) {
                this.resolve();
                this.resolve = null;
            }
        },
    },
});
