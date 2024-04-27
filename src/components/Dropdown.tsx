import React, { useEffect, useState } from 'react';

const DEFAULT_OPTION = '選択してください';
interface DropdownProps {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, defaultValue = '' }) => {
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
        <select value={selected} onChange={handleChange}>
            <option value="">{DEFAULT_OPTION}</option>
            {options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;