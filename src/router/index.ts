import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "home", component: () => import("../views/HomeView.vue") },
  {
    path: "/tra-cuu",
    name: "advancedsearch",
    component: () => import("../views/AdvancedSearchView.vue"),
  },
  {
    path: "/quan-ly",
    name: "quanly",
    component: () => import("../views/QuanLyView.vue"),
  },
  {
    path: "/ocr-vanban",
    name: "ocrvanban",
    component: () => import("../views/OCRScanView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
