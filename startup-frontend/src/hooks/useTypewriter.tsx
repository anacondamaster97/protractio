import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                setIsComplete(true);
                clearInterval(typing);
            }
        }, speed);

        return () => clearInterval(typing);
    }, [text, speed]);

    return { displayText, isComplete };
}; 