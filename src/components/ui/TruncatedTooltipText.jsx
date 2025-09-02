import { useRef, useState, useEffect } from 'react';
import { Text, Tooltip } from '@chakra-ui/react';

function TruncatedTooltipText({ children, maxWidth = '200px', ...props }) {
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowing(el.scrollWidth > el.clientWidth);
        }
    }, [children]);

    return (
        <Tooltip
            label={children}
            isDisabled={!isOverflowing}
            hasArrow
            placement="top"
        >
            <Text
                ref={textRef}
                isTruncated
                maxW={maxWidth}
                {...props}
            >
                {children}
            </Text>
        </Tooltip>
    );
}
export default TruncatedTooltipText;