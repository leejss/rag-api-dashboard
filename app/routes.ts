import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("documents", "routes/documents.tsx"),
  route("query", "routes/query.tsx"),
] satisfies RouteConfig;
