import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import { FlexRow } from '../styles/FlexRow';

interface CodeBlockEditorProps {
    title: string;
    initialLine: string;
    canEdit: boolean; // 編集可能かどうか
    onSave: (newCodeBlock: string) => void; // 保存ボタンが押されたときに呼ばれる
    onCancel: () => void; // キャンセルボタンが押されたときに呼ばれる
    children?: React.ReactNode;
}

const CodeBlockManager: React.FC<CodeBlockEditorProps> = ({ title, initialLine, canEdit, onSave, onCancel, children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [line, setLine] = useState(initialLine);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setLine(initialLine);
        onCancel();
    };
    const handleSave = () => {
        setIsEditing(false);
        setLine(line);
        onSave(line);
    };

    return (
        <>
            <FlexRow>
                <h3>{title}</h3>
                {canEdit && (
                    <>
                        {isEditing ? (
                            <>
                                <button onClick={handleCancel}>キャンセル</button>
                                <button onClick={handleSave}>更新</button>
                            </>
                        ) : (
                            <button onClick={handleEdit}>編集</button>
                        )}
                    </>
                )}
            </FlexRow>
            {children}
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            {initialLine ? <CodeBlock line={line} editMode={isEditing} onChange={setLine} /> : <div style={{ color : 'red' }}>データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．</div>}
        </>
    );
};

export default CodeBlockManager;

