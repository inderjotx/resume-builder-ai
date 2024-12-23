import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointValues = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function useBreakpoint(breakpoint: Breakpoint) {
    const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

    useEffect(() => {
        const checkBreakpoint = () => {
            setIsAboveBreakpoint(window.innerWidth >= breakpointValues[breakpoint]);
        };

        // Check initially
        checkBreakpoint();

        // Add event listener
        window.addEventListener('resize', checkBreakpoint);

        // Cleanup
        return () => window.removeEventListener('resize', checkBreakpoint);
    }, [breakpoint]);

    return isAboveBreakpoint;
} 