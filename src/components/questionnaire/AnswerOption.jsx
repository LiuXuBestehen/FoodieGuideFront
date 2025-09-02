import {
    Text,
    Button,
} from '@chakra-ui/react';
// 公共组件：答案选项
const AnswerOption = ({ option, isSelected, isCorrect, isWrong, onClick, disabled }) => {
    const getButtonProps = () => {
        if (disabled) {
            if (isCorrect) return { colorScheme: 'green', variant: 'solid' };
            if (isWrong) return { colorScheme: 'red', variant: 'solid' };
            if (isSelected) return { colorScheme: 'blue', variant: 'outline' };
        }
        return isSelected ? { colorScheme: 'blue', variant: 'solid' } : { variant: 'outline' };
    };

    return (
        <Button
            {...getButtonProps()}
            onClick={() => onClick(option[0])}
            disabled={disabled}
            size="lg"
            h="auto"
            p={4}
            whiteSpace="normal"
            textAlign="left"
            justifyContent="flex-start"
            _hover={disabled ? {} : { transform: 'translateY(-2px)', shadow: 'md' }}
            transition="all 0.2s"
        >
            <Text fontWeight="bold" mr={2}>{option[0]}.</Text>
            <Text>{option.slice(2)}</Text>
        </Button>
    );
};

export default AnswerOption;