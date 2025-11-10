import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface ThemeRouteWrapperProps {
    theme: string;
    children?: React.ReactNode;
}

/**
 * Wrapper component that enforces a specific theme for a route section.
 * Changes theme in localStorage and triggers page reload when theme changes.
 */
export function ThemeRouteWrapper({ theme, children }: ThemeRouteWrapperProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const currentTheme = localStorage.getItem('TYPE_OF_THEME');

        // Only reload if theme actually needs to change
        if (currentTheme !== theme) {
            localStorage.setItem('TYPE_OF_THEME', theme);
            window.location.reload();
        } else {
            setIsInitialized(true);
        }
    }, [theme, location.pathname]);

    // Don't render children until theme is set correctly
    if (!isInitialized) {
        return null;
    }

    return children ? <>{children}</> : <Outlet />;
}
