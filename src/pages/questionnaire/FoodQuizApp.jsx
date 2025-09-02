import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    ChakraProvider,
    Box,
    Container,
    Text,
    Button,
    VStack,
    HStack,
    Card,
    CardBody,
    SimpleGrid,
    Heading,
    Divider,
    useToast,
    Flex,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import AnswerOption from '../../components/questionnaire/AnswerOption';
import QuizProgress from '../../components/questionnaire/QuizProgress';
import ResultCard from '../../components/questionnaire/ResultCard';
import { getRandomPage, getTodaySeed } from '../../utils/randomPageUtils';
import { foodService } from '../../api/models/food/foodService';
import { FoodQuizNum, FoodQuizPageSize } from '../../constants/serviceConfig';

// 主组件
const FoodQuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const toast = useToast();
    const pageSize = FoodQuizPageSize;
    const num = FoodQuizNum;

    const setRandomQuestion = (quizData) => {
        // 随机选择题目
        const shuffled = [...quizData].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, num);
        setQuestions(selectedQuestions);
    }

    // 使用useEffect进行数据初始化
    useEffect(() => {
        const initializeQuiz = async () => {
            const cached = localStorage.getItem("dailyQuestion");
            const cachedDate = localStorage.getItem("dailyQuestionDate");

            const today = getTodaySeed();
            if (cached && cachedDate === today) {
                setRandomQuestion(JSON.parse(cached));
                return;
            }

            // 获取试题总数
            const dataTotal = await foodService.getQuestionnaireByPage(1, 1);
            const total = dataTotal.total;

            const randomPage = getRandomPage(today, total, pageSize);

            const data = await foodService.getQuestionnaireByPage(randomPage ? randomPage : 1, pageSize);

            setRandomQuestion(data.questionnaire);

            // 缓存
            localStorage.setItem("dailyQuestion", JSON.stringify(data.questionnaire));
            localStorage.setItem("dailyQuestionDate", today);

        };

        initializeQuiz();
    }, []);

    useEffect(() => {
        setSelectedAnswer(answers[currentIndex] || '');
    }, [currentIndex, answers]);

    // 计算分数和统计
    const { score, correctCount, results } = useMemo(() => {
        const results = questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.right_answer;
            return { question: q, userAnswer, isCorrect, index };
        });

        const correctCount = results.filter(r => r.isCorrect).length;
        const score = Math.round((correctCount / questions.length) * 100);

        return { score, correctCount, results };
    }, [questions, answers]);

    // 当前题目的答案选项
    const currentOptions = useMemo(() => {
        if (!questions[currentIndex]) return [];
        return questions[currentIndex].answer.split(' ').filter(opt => opt.length > 0);
    }, [questions, currentIndex]);

    // 选择答案
    const handleAnswerSelect = useCallback((answer) => {
        setSelectedAnswer(answer);
    }, []);

    // 确认答案
    const handleAnswerConfirm = useCallback(() => {
        if (!selectedAnswer) {
            toast({
                title: "有试题没有答案，请选择答案",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setAnswers(prev => ({ ...prev, [currentIndex]: selectedAnswer }));
        setSelectedAnswer('');

        // 自动跳转到下一题或显示结果
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setShowResults(true);
            }
        }, 500);
    }, [selectedAnswer, currentIndex, questions.length, toast]);

    // 导航函数
    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setSelectedAnswer(answers[prevIndex] || '');
        }
    }, [currentIndex, answers]);

    const goToNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSelectedAnswer(answers[nextIndex] || '');
        }

    }, [currentIndex, questions.length, answers]);

    // 重新开始测验
    const resetQuiz = useCallback(() => {
        setCurrentIndex(0);
        setAnswers({});
        setShowResults(false);
        setQuizStarted(false);
        setSelectedAnswer('');
    }, []);

    // 开始测验页面
    if (!quizStarted) {
        return (
            <ChakraProvider>
                <Box minH="100vh" bg="gradient-to-br from-orange-50 to-red-50" py={8}>
                    <Container maxW="lg">
                        <VStack spacing={8} textAlign="center">
                            {/* <Icon as={Trophy} size={64} color="orange.500" /> */}
                            <Heading size="2xl" color="gray.700">美食知识测验</Heading>
                            <Text fontSize="lg" color="gray.600">
                                测试你的美食知识，共{num}道题，总分100分
                            </Text>
                            <Button
                                colorScheme="orange"
                                size="lg"
                                onClick={() => setQuizStarted(true)}
                                leftIcon={<Icon as={Trophy} />}
                                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                                transition="all 0.2s"
                            >
                                开始测验
                            </Button>
                        </VStack>
                    </Container>
                </Box>
            </ChakraProvider>
        );
    }

    // 结果展示页面
    if (showResults) {
        return (
            <ChakraProvider>
                <Box minH="100vh" bg="gradient-to-br from-green-50 to-blue-50" py={8}>
                    <Container maxW="4xl">
                        <VStack spacing={6}>
                            <Alert
                                status={score >= 60 ? "success" : "warning"}
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                                borderRadius="xl"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="2xl">
                                    测验完成！
                                </AlertTitle>
                                <AlertDescription maxW="sm" fontSize="lg">
                                    你的得分是 {score} 分，答对了 {correctCount}/{questions.length} 题
                                    {score >= 80 ? " 🎉 优秀！" : score >= 60 ? " 👍 不错！" : " 💪 继续努力！"}
                                </AlertDescription>
                            </Alert>

                            <HStack>
                                <Button
                                    leftIcon={<Icon as={RotateCcw} />}
                                    colorScheme="blue"
                                    onClick={resetQuiz}
                                    size="lg"
                                >
                                    重新测验
                                </Button>
                            </HStack>

                            <Divider />

                            <Heading size="lg" color="gray.700">详细结果</Heading>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                                {results.map((result, index) => (
                                    <ResultCard
                                        key={index}
                                        question={result.question}
                                        index={result.index}
                                        userAnswer={result.userAnswer}
                                        isCorrect={result.isCorrect}
                                    />
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </Container>
                </Box>
            </ChakraProvider>
        );
    }

    // 测验进行中页面
    return (
        <ChakraProvider>
            <Box minH="100vh" bg="gradient-to-br from-blue-50 to-purple-50" py={8}>
                <Container maxW="2xl">
                    <VStack spacing={6}>
                        <QuizProgress
                            current={currentIndex + 1}
                            total={questions.length}
                        />

                        <Card w="100%" variant="elevated" shadow="lg">
                            <CardBody p={8}>
                                <VStack spacing={6} align="stretch">
                                    <Text fontSize="xl" fontWeight="bold" color="gray.700" lineHeight="tall">
                                        {questions[currentIndex]?.title}
                                    </Text>

                                    <VStack spacing={3} align="stretch">
                                        {currentOptions.map((option, index) => (
                                            < AnswerOption
                                                key={index}
                                                option={option}
                                                isSelected={selectedAnswer === option[0]}
                                                onClick={handleAnswerSelect}
                                                disabled={false}
                                            />
                                        ))}
                                    </VStack>

                                    <Divider />

                                    <Flex justify="space-between" align="center">
                                        <Button
                                            leftIcon={<Icon as={ChevronLeft} />}
                                            variant="ghost"
                                            onClick={goToPrevious}
                                            disabled={currentIndex === 0}
                                        >
                                            上一题
                                        </Button>

                                        {/* <Text fontSize="sm" color="gray.500">
                                            每题 {Math.round(100 / questions.length)} 分
                                        </Text> */}

                                        {currentIndex === questions.length - 1 ? (
                                            <Button
                                                colorScheme="green"
                                                onClick={handleAnswerConfirm}
                                                disabled={!selectedAnswer}
                                                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                                            >
                                                完成测验
                                            </Button>
                                        ) : (
                                            <HStack>
                                                <Button
                                                    colorScheme="blue"
                                                    onClick={handleAnswerConfirm}
                                                    disabled={!selectedAnswer}
                                                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                                                >
                                                    确认答案
                                                </Button>
                                                <Button
                                                    rightIcon={<Icon as={ChevronRight} />}
                                                    variant="ghost"
                                                    onClick={goToNext}
                                                    disabled={currentIndex === questions.length - 1}
                                                >
                                                    下一题
                                                </Button>
                                            </HStack>
                                        )}
                                    </Flex>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </Container>
            </Box>
        </ChakraProvider>
    );
};

export default FoodQuizApp;