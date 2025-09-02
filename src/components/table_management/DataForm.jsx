import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    VStack,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    useToast,
} from '@chakra-ui/react';
import AreaSelector from '../ui/AreaSelector';
import regionStore from '../../store/region/regionStore';

// 数据表单组件
const DataForm = ({ isOpen, onClose, config, data, onSave, mode }) => {
    const [formData, setFormData] = useState({});
    const [formKey, setFormKey] = useState(0);
    const toast = useToast();
    const refs = useRef({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const { regions } = regionStore()

    useEffect(() => {
        if (isOpen) {
            refs.current = Object.fromEntries(
                config.fields
                    .filter(f => f.key !== 'id')
                    .map(f => [f.key, React.createRef()])
            );

            if (mode === 'edit' && data) {
                setFormData(data);
                setSelectedRegion({ id: data.region_id, name: data.region_name });
            } else {
                const initialData = {};
                config.fields.forEach(field => {
                    if (field.key !== 'id') {
                        initialData[field.key] = '';
                    }
                });
                setFormData(initialData);
                setSelectedRegion(null); // 清空地区选择
            }
            setFormKey(prev => prev + 1);
        }
    }, [isOpen, mode, data, config]);

    const handleSubmit = () => {
        const formValues = {};
        for (const key in refs.current) {
            formValues[key] = refs.current[key].current?.value || '';
        }

        // 增加region信息
        if (selectedRegion?.id) {
            formValues.region_name = selectedRegion.name;
            formValues.region_id = selectedRegion.id;
        }

        //edit增加id
        if (mode === 'edit') {
            formValues.id = formData.id;
        }

        // 验证必填字段
        const requiredFields = config.fields.filter(field => field.required);
        for (let field of requiredFields) {
            if (!formValues[field.key]) {
                toast({
                    title: '验证错误',
                    description: `${field.label}为必填项`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                return;
            }
        }

        onSave(formValues);
        onClose();
    };

    const renderField = (field) => {
        if (field.readonly) {
            return (
                <Input
                    value={formData[field.key] || ''}
                    isReadOnly
                    bg="gray.100"
                />
            );
        }

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        key={`${field.key}-${formKey}`}
                        defaultValue={formData[field.key] || ''}
                        ref={refs.current[field.key]}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '8px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '6px',
                            resize: 'vertical'
                        }}
                    />
                );
            case 'select':
                return (
                    <Select
                        key={`${field.key}-${formKey}`}
                        defaultValue={formData[field.key] || ''}
                        ref={refs.current[field.key]}
                        placeholder="请选择"
                    >
                        {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </Select>
                );
            case 'areaSelector':
                return (
                    <AreaSelector data={regions} onSelect={setSelectedRegion} intiSelectedRegion={selectedRegion} />
                );
            default:
                return (
                    <Input
                        key={`${field.key}-${formKey}`}
                        type={field.type}
                        defaultValue={formData[field.key] || ''}
                        ref={refs.current[field.key]}
                        maxLength={field.maxLength || null}
                    />
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader>{mode === 'edit' ? '编辑' : '新增'}{config.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        {config.fields.map((field) => (
                            <FormControl key={field.key} isRequired={field.required}>
                                {field.key && field.key !== 'id' && (
                                    <>
                                        <FormLabel>{field.label}</FormLabel>
                                        {renderField(field)}
                                    </>
                                )}
                            </FormControl>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        取消
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        {mode === 'edit' ? '保存' : '创建'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DataForm;