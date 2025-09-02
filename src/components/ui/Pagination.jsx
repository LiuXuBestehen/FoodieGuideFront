import {
    Box,
    Text,
    Button,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

// Reusable Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange, colorScheme }) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    return (
        <HStack spacing="2" justify="center">
            <IconButton
                icon={<ChevronLeft size={16} />}
                size="sm"
                variant="outline"
                colorScheme={colorScheme}
                isDisabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
            />

            {generatePageNumbers().map((page, index) => (
                <Box key={index}>
                    {page === '...' ? (
                        <Text px="2" py="1" fontSize="sm" color="gray.500">
                            ...
                        </Text>
                    ) : (
                        <Button
                            size="sm"
                            variant={currentPage === page ? "solid" : "outline"}
                            colorScheme={colorScheme}
                            onClick={() => onPageChange(page)}
                            minW="8"
                        >
                            {page}
                        </Button>
                    )}
                </Box>
            ))}

            <IconButton
                icon={<ChevronRight size={16} />}
                size="sm"
                variant="outline"
                colorScheme={colorScheme}
                isDisabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
            />
        </HStack>
    );
};

export default Pagination;