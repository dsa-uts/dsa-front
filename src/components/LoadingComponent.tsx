import React from 'react';
import styled from 'styled-components';

interface LoadingProps {
    message: string;
}

const LoadingComponent: React.FC<LoadingProps> = ({ message }) => {
    return <LoadingContainer>
            <Spinner />
            <LoadingText>{message}</LoadingText>
        </LoadingContainer>
}

export default LoadingComponent;

const LoadingContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100vh;
`;

const LoadingText = styled.p`
margin-top: 16px;
font-size: 16px;
color: #666;
`;

const Spinner = styled.div`
border: 4px solid #f3f3f3;
border-top: 4px solid #3498db;
border-radius: 50%;
width: 40px;
height: 40px;
animation: spin 1s linear infinite;

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
