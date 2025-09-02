import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Flex,
    Heading,
    useDisclosure,
    useToast,
    useBreakpointValue,
} from '@chakra-ui/react';
import Sidebar from '../../components/table_management/Sidebar';
import SearchBar from '../../components/table_management/SearchBar';
import DataTable from '../../components/table_management/DataTable';
import DataForm from '../../components/table_management/DataForm';
import MobileNavDrawer from '../../components/table_management/MobileNavDrawer';
import MobileCardList from '../../components/table_management/MobileCardList';
import { tableConfigs } from '../../constants/tableConfig';
import { foodService } from '../../api/models/food/foodService';
import { TableManagementPageSize } from '../../constants/serviceConfig';

// 主页面组件
const TableManagementPage = () => {
    const [activeTable, setActiveTable] = useState('Foods');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingData, setEditingData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formMode, setFormMode] = useState('add');
    const [resetTable, toggleResetTable] = useState(true);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();
    const toast = useToast();

    const isMobile = useBreakpointValue({ base: true, md: false });
    const pageSize = TableManagementPageSize;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTable]);

    const handleTableSelect = (tableKey) => {
        setActiveTable(tableKey);
        setSearchTerm("");
    };

    const handleSearch = (searchInputValue) => {
        setSearchTerm(searchInputValue);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        setFormMode('add');
        setEditingData(null);
        onOpen();
    };

    const handleEdit = (row) => {
        setFormMode('edit');
        setEditingData(row);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这条记录吗？')) {
            try {
                switch (activeTable) {
                    case 'Foods': {
                        const response = await foodService.deleteFood(id);
                        if (response.data === false) {
                            throw new Error("删除数据失败" + response);
                        }
                        break;
                    }

                    case 'Ingredients':
                        {
                            const ingredientResponse = await foodService.deleteIngredient(id);
                            if (ingredientResponse.data === false) {
                                throw new Error("删除数据失败" + ingredientResponse);
                            }
                            break;
                        }
                    case 'Questionnaire':
                        {
                            const questionnaireResponse = await foodService.deleteQuestionnaire(id);
                            if (questionnaireResponse.data === false) {
                                throw new Error("删除数据失败" + questionnaireResponse);
                            }
                            break;
                        }
                    default:
                        throw new Error("Unknown table type: " + activeTable);
                }
                toast({
                    title: '删除成功',
                    status: 'success',
                    description: "数据已删除",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                //重置数据
                toggleResetTable(!resetTable);
            } catch (error) {
                console.error("Error fetching data:", error);
                return;
            }

        }
    };

    const handleSave = async (formData) => {
        if (formMode === 'add') {
            try {
                switch (activeTable) {
                    case 'Foods': {
                        const response = await foodService.addFood(formData);
                        if (response.data === null) {
                            throw new Error("创建数据失败" + response);
                        }
                        break;
                    }

                    case 'Ingredients':
                        {
                            const ingredientResponse = await foodService.addIngredient(formData);
                            if (ingredientResponse.data === null) {
                                throw new Error("创建数据失败" + ingredientResponse);
                            }
                            break;
                        }
                    case 'Questionnaire':
                        {
                            const questionnaireResponse = await foodService.addQuestionnaire(formData);
                            if (questionnaireResponse.data === null) {
                                throw new Error("创建数据失败" + questionnaireResponse);
                            }
                            break;
                        }
                    default:
                        throw new Error("Unknown table type: " + activeTable);
                }
                toast({
                    title: '操作成功',
                    description: '数据已新增',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                //重置数据
                toggleResetTable(!resetTable);
            } catch (error) {
                console.error("Error fetching data:", error);
                return;
            }
        } else {
            try {
                switch (activeTable) {
                    case 'Foods': {
                        const response = await foodService.updateFood(formData);
                        if (response.data === null) {
                            throw new Error("修改数据失败" + response);
                        }
                        break;
                    }

                    case 'Ingredients':
                        {
                            const ingredientResponse = await foodService.updateIngredient(formData);
                            if (ingredientResponse.data === null) {
                                throw new Error("修改数据失败" + ingredientResponse);
                            }
                            break;
                        }
                    case 'Questionnaire':
                        {
                            const questionnaireResponse = await foodService.updateQuestionnaire(formData);
                            if (questionnaireResponse.data === null) {
                                throw new Error("修改数据失败" + questionnaireResponse);
                            }
                            break;
                        }
                    default:
                        throw new Error("Unknown table type: " + activeTable);
                }
                toast({
                    title: '操作成功',
                    description: '数据已修改',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                //重置数据
                toggleResetTable(!resetTable);
            } catch (error) {
                console.error("Error fetching data:", error);
                return;
            }
        }
    };

    return (
        <Flex
            direction={isMobile ? "column" : "row"}
            h="100vh"
            bg="gray.100"
        >
            {/* 桌面端侧边栏 */}
            {!isMobile && (
                <Sidebar
                    tables={tableConfigs}
                    activeTable={activeTable}
                    onTableSelect={handleTableSelect}
                />
            )}

            {/* 移动端导航抽屉 */}
            {isMobile && (
                <MobileNavDrawer
                    isOpen={isNavOpen}
                    onClose={onNavClose}
                    tables={tableConfigs}
                    activeTable={activeTable}
                    onTableSelect={handleTableSelect}
                />
            )}

            {/* 主内容区域 */}
            <Box
                flex={1}
                overflow="auto"
                p={isMobile ? 3 : 6}
            >
                <Container maxW="container.xl">
                    {/* 桌面端标题 */}
                    {!isMobile && (
                        <Heading size="lg" mb={4} color="gray.700">
                            {tableConfigs[activeTable]?.name || '数据管理'}
                        </Heading>
                    )}

                    {/* 搜索栏 */}
                    <SearchBar
                        onSearch={handleSearch}
                        onAdd={handleAdd}
                        onMenuOpen={onNavOpen}
                        activeTable={activeTable}
                    />

                    {/* 数据展示区域 */}
                    {isMobile ? (
                        <MobileCardList
                            activeTable={activeTable}
                            config={tableConfigs[activeTable]}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            resetTable={resetTable}
                            searchTerm={searchTerm}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    ) : (
                        <DataTable
                            activeTable={activeTable}
                            config={tableConfigs[activeTable]}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            resetTable={resetTable}
                            searchTerm={searchTerm}
                        />
                    )}
                </Container>
            </Box>

            {/* 数据表单 */}
            <DataForm
                isOpen={isOpen}
                onClose={onClose}
                config={tableConfigs[activeTable]}
                data={editingData}
                onSave={handleSave}
                mode={formMode}
            />
        </Flex>
    );
};

export default TableManagementPage;