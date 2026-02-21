import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if the element under the cursor is clickable
            const target = e.target;
            const isClickable = window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON';
            setIsPointer(isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <style>{`
                body {
                    cursor: none !important;
                }
                a, button, [role="button"] {
                    cursor: none !important;
                }
                .cursor-glow {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    z-index: 9998;
                    transition: width 0.3s ease, height 0.3s ease;
                }
                .cursor-dot {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 8px;
                    height: 8px;
                    background-color: var(--color-primary);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                    box-shadow: 0 0 15px var(--color-primary), 0 0 30px var(--color-primary);
                    transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
                }
                .cursor-dot.active {
                    transform: translate(-50%, -50%) scale(2.5);
                    background-color: rgba(34, 197, 94, 0.3);
                    border: 1px solid var(--color-primary);
                }
            `}</style>
            <div
                className="cursor-glow"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            />
            <div
                className={`cursor-dot ${isPointer ? 'active' : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            />
        </>
    );
};

export default CustomCursor;
