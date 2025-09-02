
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
const FilterControls = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
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
            </Flex>
        </VStack>
    );
};
export default FilterControls;