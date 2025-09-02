import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Text,
    Badge,
    Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { foodService } from '../../api/models/food/foodService';
import Pagination from '../ui/Pagination';
// 桌面端数据表格组件
const DataTable = ({ searchTerm, activeTable, config, onEdit, onDelete, currentPage, pageSize, onPageChange, resetTable }) => {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const getColumnWidth = (field) => {
        switch (field.type) {
            case 'select':
                return '120px';
            case 'number':
                return '80px';
            case 'textarea':
                return '200px';
            case 'areaSelector':
                return '120px';
            default:
                if (field.key === 'image_url') return '150px';
                if (field.key === 'ingredients') return '200px';
                if (field.key === 'description') return '200px';
                if (field.key === 'effect') return '180px';
                if (field.key === 'answer') return '300px';
                return '120px';
        }
    };

    const renderCellContent = (value, field) => {
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

        // 处理图片链接显示
        if (field.key === 'image_url') {
            const displayValue = String(value);
            const maxLength = 20;
            if (displayValue.length > maxLength) {
                return (
                    <Tooltip label={displayValue} placement="top" hasArrow>
                        <Text
                            cursor="pointer"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxWidth="100%"
                            color="blue.500"
                        >
                            {displayValue.substring(0, maxLength)}...
                        </Text>
                    </Tooltip>
                );
            }
            return <Text color="blue.500">{displayValue}</Text>;
        }

        const displayValue = String(value);
        const maxLength = field.key === 'answer' ? 30 : 15;

        if (displayValue.length > maxLength) {
            return (
                <Tooltip label={displayValue} placement="top" hasArrow>
                    <Text
                        cursor="pointer"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        maxWidth="100%"
                    >
                        {displayValue.substring(0, maxLength)}...
                    </Text>
                </Tooltip>
            );
        }

        return displayValue;
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
            <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden">
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            {config.fields.map((field) => (
                                <Th key={field.key} width={getColumnWidth(field)}>
                                    {field.label}
                                </Th>
                            ))}
                            <Th width="120px">操作</Th>
                        </Tr>
                    </Thead>
                </Table>
                <Flex justify="center" align="center" p={8}>
                    <Text color="gray.500" fontSize="md">
                        暂无数据
                    </Text>
                </Flex>
            </Box>
        );
    }

    return (
        <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden">
            <Box overflowX="auto">
                <Table variant="simple" minWidth="max-content">
                    <Thead bg="gray.50">
                        <Tr>
                            {config.fields.map((field) => (
                                <Th
                                    key={field.key}
                                    width={getColumnWidth(field)}
                                    minWidth={getColumnWidth(field)}
                                    maxWidth={getColumnWidth(field)}
                                >
                                    {field.label}
                                </Th>
                            ))}
                            <Th width="120px" minWidth="120px" maxWidth="120px">
                                操作
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((row) => (
                            <Tr key={row.id} _hover={{ bg: 'gray.50' }}>
                                {config.fields.map((field) => (
                                    <Td
                                        key={field.key}
                                        width={getColumnWidth(field)}
                                        minWidth={getColumnWidth(field)}
                                        maxWidth={getColumnWidth(field)}
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        p={2}
                                    >
                                        {renderCellContent(row[field.key], field)}
                                    </Td>
                                ))}
                                <Td width="120px" minWidth="120px" maxWidth="120px" p={2}>
                                    <HStack spacing={2}>
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
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
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
        </Box>
    );
};

export default DataTable;