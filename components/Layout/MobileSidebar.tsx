'use client';
import React from 'react';
import { Menu, Home, Route, Sun, Moon, Info } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';


interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    onClose
}) => {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Navigation items
    const navigationItems = [
        {
            href: '/',
            icon: Home,
            label: 'Home',
            isActive: pathname === '/' || pathname === '/home'
        },
        {
            href: '/routemap',
            icon: Route,
            label: 'Routemap',
            isActive: pathname === '/routemap'
        },
        {
            href: '/about',
            icon: Info,
            label: 'About',
            isActive: pathname === 'about'
        }
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                    fixed top-0 left-0 h-full bg-gradient-to-b from-orange-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-orange-950 dark:to-rose-950
                    z-40 shadow-2xl transform transition-transform duration-300 ease-in-out
                    w-[75%] max-w-sm flex flex-col backdrop-blur-lg border-r border-white/20 dark:border-gray-700/20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b bg-gradient-to-r from-orange-50/90 via-rose-50/90 to-pink-50/90 dark:from-gray-900/90 dark:via-orange-950/90 dark:to-rose-950/90 backdrop-blur-lg shadow-2xl border-white/20 dark:border-gray-700/20">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 dark:from-orange-600 dark:to-pink-600 dark:hover:from-orange-700 dark:hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex-1 ml-4">
                        <Link
                            className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
                            href={"/"}
                        >
                            DuggaKhoj
                        </Link>
                    </div>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 flex flex-col justify-between p-4">
                    {/* Navigation Links */}
                    <div className="space-y-3">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        group flex items-center gap-3 p-3 backdrop-blur-sm border rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl
                                        ${item.isActive
                                            ? 'bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/80 dark:to-pink-900/80 border-orange-300 dark:border-orange-500 shadow-orange-200/50 dark:shadow-orange-900/50'
                                            : 'bg-white/80 dark:bg-gray-800/80 border-white/20 dark:border-gray-700/20 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg shadow-md transition-all
                                        ${item.isActive
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-lg'
                                            : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                                        }
                                    `}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className={`
                                        font-medium transition-colors
                                        ${item.isActive
                                            ? 'text-orange-700 dark:text-orange-300 font-semibold'
                                            : 'text-gray-900 dark:text-white'
                                        }
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* Active indicator dot */}
                                    {item.isActive && (
                                        <div className="ml-auto">
                                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Theme Switcher Section */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={toggleTheme}
                            className="w-full cursor-pointer group flex items-center gap-3 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl hover:border-orange-300 dark:hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-950/50 dark:hover:to-pink-950/50 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md">
                                {theme === 'dark' ? (
                                    <Moon className="w-4 h-4" />
                                ) : (
                                    <Sun className="w-4 h-4" />
                                )}
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">Theme</span>
                            <div className="ml-auto">
                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{theme}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};