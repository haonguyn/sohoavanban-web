import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "home", component: () => import("../views/HomeView.vue") },
  {
    path: "/tra-cuu",
    name: "advanced-search",
    component: () => import("../views/AdvancedSearchView.vue"),
  },
  {
    path: "/document-detail",
    name: "document-detail",
    component: () => import("../views/DocumentDetailView.vue"),
  },
  {
    path: "/quan-ly",
    name: "quanly",
    component: () => import("../views/DocumentListView.vue"),
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
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/admin",
    name: "dashboard",
    component: () => import("../views/admin/DashBoardView.vue"),
  },
  {
    path: "/admin/create-ocr",
    name: "createocr",
    component: () => import("../views/admin/CreateOCRView.vue"),
  },
  {
    path: "/admin/manager",
    name: "manager",
    component: () => import("../views/admin/ManageDocsView.vue"),
  },
  {
    path: "/admin/report",
    name: "report",
    component: () => import("../views/admin/ReportView.vue"),
  },
  {
    path: "/admin/system-user",
    name: "system-user",
    component: () => import("../views/admin/SystemAndUser.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
