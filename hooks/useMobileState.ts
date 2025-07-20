import { useState, useCallback } from 'react';

export const useMobileState = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const toggleSidebar = useCallback(() => {
        console.log('toggleSidebar called, current state:', isSidebarOpen);
        setIsSidebarOpen(prev => {
            const newState = !prev;
            console.log('Setting sidebar to:', newState);
            return newState;
        });
    }, [isSidebarOpen]);

    const closeSidebar = useCallback(() => {
        console.log('closeSidebar called');
        setIsSidebarOpen(false);
    }, []);

    const toggleMobileSearch = useCallback(() => {
        setShowMobileSearch(prev => !prev);
    }, []);

    return {
        isSidebarOpen,
        showMobileSearch,
        toggleSidebar,
        closeSidebar,
        toggleMobileSearch
    };
};