// import { defineStore } from "pinia";
// import { loginApi } from "@/api/userApi";

// export const useUserStore = defineStore("user", {
//   state: () => ({
//     access: "",
//     refresh: "",
//     username: ""
//   }),

//   actions: {
//     async login(username: string, password: string) {
//       const res = await loginApi(username, password);

//       this.access = res.data.access;
//       this.refresh = res.data.refresh;
//       this.username = username;
//     },

//     logout() {
//       this.access = "";
//       this.refresh = "";
//       this.username = "";
//     }
//   }
// });
