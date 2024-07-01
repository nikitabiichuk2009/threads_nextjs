import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected and public routes
const publicRoutes = [
  "/",
  "/api/webhook/clerk", // Ensure webhook route is public
];

// Matchers for protected routes
const isProtectedRoute = createRouteMatcher([
  "/create-thread",
  "/collection",
  "/profile",
]);
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    auth().protect();
  }
});

// Configuring matcher to ignore static files, _next, and specific API routes
export const config = {
  matcher: ["/((?!.*\\..*|_next|api/webhook/clerk).*)", "/", "/(api|trpc)(.*)"],
};
