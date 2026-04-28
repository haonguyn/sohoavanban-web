import { defineStore } from "pinia";

export const useConfirmStore = defineStore("confirm", {
    state: () => ({
        visible: false,
        message: "",
        resolve: null as null | (() => void),
    }),

    actions: {
        open(message: string) {
            return new Promise<boolean>((resolve) => {
                this.message = message;
                this.visible = true;
                this.resolve = resolve as any;
            });
        },

        confirm() {
            this.visible = false;
            if (this.resolve) {
                (this.resolve as any)(true);
                this.resolve = null;
            }
        },

        cancel() {
            this.visible = false;
            if (this.resolve) {
                (this.resolve as any)(false);
                this.resolve = null;
            }
        },
    },
});
