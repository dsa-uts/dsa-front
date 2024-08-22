import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DEFAULT_OPTION = '選択してください';
interface DropdownProps {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    defaultOptionLabel?: string;
    defaultValue?: string;
    className?: string;
    style?: React.CSSProperties; 
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, defaultOptionLabel = DEFAULT_OPTION, defaultValue = '', className, style }) => {
    const [selected, setSelected] = useState(defaultValue);

    useEffect(() => {
        setSelected(defaultValue);
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelected(value);
        onSelect(value);
    };

    return (
        <StyledSelect className={className} style={style} value={selected} onChange={handleChange}>
            <option value="">{defaultOptionLabel}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </StyledSelect>
    );
};

export default Dropdown;

const StyledSelect = styled.select`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 20%;
`;