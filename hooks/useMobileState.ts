import { useState, useCallback } from 'react';

export const useMobileState = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
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