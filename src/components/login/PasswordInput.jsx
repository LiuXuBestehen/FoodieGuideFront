import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder,
    isRequired = true,
    error,
    onBlur
}) => {
    const [show, setShow] = useState(false);

    return (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                />
                <InputRightElement>
                    <IconButton
                        variant="ghost"
                        icon={show ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShow(!show)}
                        aria-label={show ? '隐藏密码' : '显示密码'}
                        size="sm"
                    />
                </InputRightElement>
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default PasswordInput;