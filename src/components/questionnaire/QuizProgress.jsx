import {
    VStack,
    HStack,
    Progress,
    Badge,
} from '@chakra-ui/react';
// 公共组件：进度指示器
const QuizProgress = ({ current, total }) => (
    <VStack spacing={3} w="100%">
        <HStack justify="space-between" w="100%">
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {current}/{total}
            </Badge>
        </HStack>
        <Progress
            value={(current / total) * 100}
            size="lg"
            colorScheme="blue"
            w="100%"
            borderRadius="full"
            bg="gray.100"
        />
    </VStack>
);
export default QuizProgress;