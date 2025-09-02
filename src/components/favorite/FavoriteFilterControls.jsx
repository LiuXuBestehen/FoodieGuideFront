import {
    VStack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Flex,
} from '@chakra-ui/react';
import {
    Search,
} from 'lucide-react';
// 筛选控制组件
const FavoriteFilterControls = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    sortBy,
    setSortBy,
    categories,
    regions,
}) => {
    return (
        <VStack spacing={4} align="stretch">
            <Flex gap={4} wrap="wrap" align="center">
                <InputGroup maxW="300px">
                    <InputLeftElement>
                        <Search size={16} />
                    </InputLeftElement>
                    <Input
                        placeholder="请输入美食名称..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

                <Select
                    placeholder="全部"
                    maxW="150px"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Select>

                <Select
                    placeholder="全部"
                    maxW="150px"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                >
                    {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </Select>

                <Select
                    placeholder="默认排序"
                    maxW="150px"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="name_asc">名称升序</option>
                    <option value="name_desc">名称降序</option>
                    <option value="category_asc">分类排序</option>
                    <option value="region_asc">地区排序</option>
                </Select>
            </Flex>
        </VStack>
    );
};

export default FavoriteFilterControls;