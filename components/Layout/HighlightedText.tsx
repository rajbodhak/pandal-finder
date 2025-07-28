import React from 'react';

interface HighlightedTextProps {
    text: string;
    highlight: string;
    className?: string;
    highlightClassName?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
    text,
    highlight,
    className = '',
    highlightClassName = 'text-orange-600 dark:text-orange-400 font-semibold'
}) => {
    if (!highlight.trim()) {
        return <span className={className}>{text}</span>;
    }

    // Create regex for case-insensitive matching
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                // Check if this part matches the highlight (case-insensitive)
                const isHighlight = part.toLowerCase() === highlight.toLowerCase();
                return isHighlight ? (
                    <span key={index} className={highlightClassName}>
                        {part}
                    </span>
                ) : (
                    <span key={index}>{part}</span>
                );
            })}
        </span>
    );
};