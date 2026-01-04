/**
 * Public Routes
 * Routes accessible without authentication
 */
import { Suspense } from "react";
import { Route, Navigate } from "react-router";
import { publicRoutes } from "./index";

export default function PublicRoutesWrapper() {
    return (
        <>
            {publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    {...route}
                    element={
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg
                                            className="w-8 h-8 animate-spin text-brand-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            }
                        >
                            {route.element}
                        </Suspense>
                    }
                />
            ))}
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/error-404" replace />} />
        </>
    );
}
