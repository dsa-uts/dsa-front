import React, { useState } from 'react';

interface CodeBlockProps {
  line: string;
  editMode?: boolean; // editModeプロパティを追加
  onChange?: (line: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ line, editMode = false, onChange }) => {
  const lines = line.split('\n');
  const [editableLines, setEditableLines] = useState(lines);

  const handleLineChange = (index: number, newValue: string) => {
    const newLines = [...editableLines];
    newLines[index] = newValue;
    setEditableLines(newLines);
    if (onChange) {
      onChange(newLines.join('\n'));
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
      {editableLines.map((line, index) => (
        editMode ? (
          <input
            type="text"
            value={line}
            onChange={(e) => handleLineChange(index, e.target.value)}
            key={index}
            style={{ width: '100%', margin: 0, border: 'none' }}
          />
        ) : (
          <pre key={index} style={{ margin: 0 }}>
            {line}
          </pre>
        )
      ))}
    </div>
  );
};

export default CodeBlock;