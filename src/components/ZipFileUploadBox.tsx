import React, { useState, useRef } from 'react';
import { uploadZipFile } from '../api/services/PostAPI';
import { startProcessingWithProgress } from '../api/services/WebSocketAPI';
import { ProgressMessage } from '../types/Assignments';
import { useAuth } from '../context/AuthContext';
interface FileUploadProps {
    id: number;
    token: string
    onClickUpload: () => void
    isUploading?: boolean;
}


// ゆくゆくはCアップロード用のと同じコンポーネントになるように作り替えたい．
const ZipFileUploadBox: React.FC<FileUploadProps> = ({ id, token, onClickUpload, isUploading }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        checkFileName(files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        checkFileName(files);
        setError(null);
    };

    const checkFileName = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile); // Always set the file
        }
    };

    const handleCancel = () => {
        setFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();
    //     if (file) {
    //         try {
    //             const upload_result = await uploadZipFile(file, id, token);
    //             // WebSocket 通信を開始し、進行状況を受信
    //         } catch (error) {
    //             console.error('Error uploading file', error);
    //             setError('Failed to upload the file.');
    //         }
    //     }
    // };

    return (
        <>
            <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', border: '1px solid #ddd', textAlign: 'center', minHeight: '150px' }}
                onDragOver={handleDragOver} onDrop={handleDrop}>
                <p>{file ? file.name : 'ファイルを選択してください'}</p>
                <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                <button disabled={isUploading} type="button" onClick={onClickUpload} style={{ width: 'auto', padding: '10px', margin: '10px 0' }}>ファイルを選択</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={handleCancel} disabled={!file || isUploading} style={{ width: 'auto', padding: '10px' }}>選択取り消し</button>
                <button type="button" onClick={onClickUpload} disabled={!file || isUploading} style={{ width: 'auto', padding: '10px' }}>アップロード</button>
            </div>
        </>
    );
};

export default ZipFileUploadBox;

