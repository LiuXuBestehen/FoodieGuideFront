import { Box, Container, Divider, Heading, Text, VStack } from '@chakra-ui/react';

const FormContainer = ({ children, title, subtitle }) => (
    <Container maxW="md" py={12}>
        <Box
            rounded="lg"
            bg="white"
            boxShadow="lg"
            p={8}
            border="1px"
            borderColor="gray.200"
        >
            <VStack spacing={4} align="stretch">
                <Box textAlign="center">
                    <Heading fontSize="2xl" color="gray.800">
                        {title}
                    </Heading>
                    {subtitle && (
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            {subtitle}
                        </Text>
                    )}
                </Box>
                <Divider />
                {children}
            </VStack>
        </Box>
    </Container>
);

export default FormContainer;