// // src/api/userApi.ts
// import api from "./axios";
// import { User, LoginPayload } from "../types/UserTypes";

// export const userApi = {
//   login(payload: LoginPayload) {
//     return api.post("/auth/login", payload);
//   },

//   getCurrentUser(): Promise<User> {
//     return api.get("/auth/me").then((res) => res.data);
//   },
// };
