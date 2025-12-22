// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getToken, getRole } from "../utils/authUtils";

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
    meta: { requiresAuth: true, roles: ["employee", "admin"] },
  },
  {
    path: "/ocr-vanban",
    name: "ocrvanban",
    component: () => import("../views/OCRScanView.vue"),
    meta: { requiresAuth: true, roles: ["employee", "admin"] },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  // Khu admin
  {
    path: "/admin",
    name: "dashboard",
    component: () => import("../views/admin/DashBoardView.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/admin/create-ocr",
    name: "createocr",
    component: () => import("../views/admin/CreateOCRView.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/admin/manager",
    name: "manager",
    component: () => import("../views/admin/ManageDocsView.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/admin/report",
    name: "report",
    component: () => import("../views/admin/ReportView.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/admin/system-user",
    name: "system-user",
    component: () => import("../views/admin/SystemAndUser.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard: kiểm tra token và quyền theo meta
router.beforeEach((to, _from, next) => {
  const token = getToken();
  const role = getRole();

  // Nếu đã đăng nhập, hạn chế quay lại login
  if (to.name === "login" && token) {
    return next({ name: "home" });
  }

  // Route yêu cầu đăng nhập
  if (to.meta?.requiresAuth) {
    if (!token) {
      // Chưa login → chuyển đến login và lưu lại đường dẫn muốn tới
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
    const roles = (to.meta.roles as string[]) || [];
    if (roles.length && (!role || !roles.includes(role))) {
      // Có token nhưng không đủ quyền
      return next({ name: "home" }); // hoặc một trang 403 nếu bạn có
    }
  }

  next();
});

export default router;
