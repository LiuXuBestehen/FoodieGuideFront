import React, { useState, useEffect } from 'react';
import {
    Box,
    HStack,
    VStack,
    IconButton,
    Text,
    Badge,
    Card,
    CardBody,
    Divider,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { foodService } from '../../api/models/food/foodService';
import Pagination from '../ui/Pagination';
// 移动端卡片列表组件
const MobileCardList = ({ searchTerm, activeTable, config, onEdit, onDelete, resetTable, currentPage,
    pageSize, onPageChange }) => {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const renderFieldValue = (value, field) => {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        if (field.type === 'select' && field.key === 'attribute') {
            return (
                <Badge colorScheme={
                    value === '寒' || value === '凉' ? 'blue' :
                        value === '平' ? 'green' :
                            value === '温' ? 'orange' : 'red'
                }>
                    {value}
                </Badge>
            );
        }

        // 处理图片链接在移动端的显示
        if (field.key === 'image_url') {
            const displayValue = String(value);
            const maxLength = 30;
            if (displayValue.length > maxLength) {
                return (
                    <Text
                        fontSize="sm"
                        color="blue.500"
                        wordBreak="break-all"
                        noOfLines={2}
                    >
                        {displayValue.substring(0, maxLength)}...
                    </Text>
                );
            }
            return <Text fontSize="sm" color="blue.500">{displayValue}</Text>;
        }

        const displayValue = String(value);

        // 长文本字段在移动端显示更多内容
        if (field.key === 'answer' || field.key === 'description' || field.key === 'effect') {
            return (
                <Text
                    fontSize="sm"
                    noOfLines={3}
                    wordBreak="break-word"
                >
                    {displayValue}
                </Text>
            );
        }

        return <Text fontSize="sm">{displayValue}</Text>;
    };

    useEffect(() => {
        // 模拟数据加载
        const fetchData = async () => {
            try {
                switch (activeTable) {
                    case 'Foods': {
                        const response = !searchTerm.trim() ?
                            await foodService.getFoodByPage(currentPage, pageSize) :
                            await foodService.getFoodByPage(currentPage, pageSize, {
                                "name__contains": searchTerm
                            });
                        setData(response.foods);
                        setTotalPages(Math.ceil(response.total / pageSize))
                        break;
                    }

                    case 'Ingredients':
                        {
                            const ingredientResponse = !searchTerm.trim() ?
                                await foodService.getIngredientByPage(currentPage, pageSize) :
                                await foodService.getIngredientByPage(currentPage, pageSize, {
                                    "name__contains": searchTerm
                                });
                            setData(ingredientResponse.ingredient);
                            setTotalPages(Math.ceil(ingredientResponse.total / pageSize));
                            break;
                        }
                    case 'Questionnaire':
                        {
                            const questionnaireResponse = !searchTerm.trim() ?
                                await foodService.getQuestionnaireByPage(currentPage, pageSize) :
                                await foodService.getQuestionnaireByPage(currentPage, pageSize, {
                                    "title__contains": searchTerm
                                });
                            setData(questionnaireResponse.questionnaire);
                            setTotalPages(Math.ceil(questionnaireResponse.total / pageSize));
                            break;
                        }
                    default:
                        throw new Error("Unknown table type: " + activeTable);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                return;
            }
        };

        fetchData();
    }, [currentPage, pageSize, activeTable, resetTable, searchTerm]);

    if (data.length === 0) {
        return (
            <Box bg="white" borderRadius="md" shadow="sm" p={8}>
                <Text color="gray.500" fontSize="md" textAlign="center">
                    暂无数据
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            {data.map((row) => (
                <Card key={row.id} variant="outline" shadow="sm">
                    <CardBody p={4}>
                        <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="flex-start">
                                <VStack align="stretch" spacing={2} flex={1}>
                                    {/* 显示关键信息：前3个非ID字段 */}
                                    {config.fields.filter(f => f.key !== 'id').slice(0, 3).map((field) => (
                                        <HStack key={field.key} justify="space-between" align="flex-start">
                                            <Text fontSize="sm" color="gray.600" minWidth="60px" fontWeight="medium">
                                                {field.label}:
                                            </Text>
                                            <Box textAlign="right" flex={1}>
                                                {renderFieldValue(row[field.key], field)}
                                            </Box>
                                        </HStack>
                                    ))}
                                </VStack>
                                <VStack spacing={1}>
                                    <IconButton
                                        icon={<EditIcon />}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={() => onEdit(row)}
                                    />
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => onDelete(row.id)}
                                    />
                                </VStack>
                            </HStack>

                            {config.fields.filter(f => f.key !== 'id').length > 3 && (
                                <>
                                    <Divider />
                                    <VStack align="stretch" spacing={2}>
                                        {config.fields.filter(f => f.key !== 'id').slice(3).map((field) => (
                                            <Box key={field.key}>
                                                <Text fontSize="xs" color="gray.600" mb={1} fontWeight="medium">
                                                    {field.label}:
                                                </Text>
                                                {renderFieldValue(row[field.key], field)}
                                            </Box>
                                        ))}
                                    </VStack>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            ))}
            {totalPages > 1 && (
                <Box py="8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        colorScheme={"blue"}
                    />
                </Box>
            )}
        </VStack>
    );
};

export default MobileCardList;