import {
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Badge,
    Icon,
} from '@chakra-ui/react';
import { CheckCircle, XCircle } from 'lucide-react';
// 公共组件：结果展示卡片
const ResultCard = ({ question, index, userAnswer, isCorrect }) => (
    <Card variant="outline" borderWidth={2} borderColor={isCorrect ? 'green.200' : 'red.200'}>
        <CardBody>
            <HStack justify="space-between" align="start" mb={3}>
                <Badge colorScheme={isCorrect ? 'green' : 'red'} fontSize="sm">
                    题目 {index + 1}
                </Badge>
                <Icon as={isCorrect ? CheckCircle : XCircle} color={isCorrect ? 'green.500' : 'red.500'} />
            </HStack>

            <Text fontWeight="bold" mb={2} fontSize="md">
                {question.title}
            </Text>

            <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600">
                    你的答案: <Text as="span" color={isCorrect ? 'green.600' : 'red.600'} fontWeight="bold">
                        {userAnswer || '未作答'}
                    </Text>
                </Text>
                <Text fontSize="sm" color="green.600">
                    正确答案: <Text as="span" fontWeight="bold">{question.right_answer}</Text>
                </Text>
            </VStack>
        </CardBody>
    </Card>
);
export default ResultCard;