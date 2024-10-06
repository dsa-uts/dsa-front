import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSubmissionFiles, fetchSubmissionStatus, fetchProblemEntry } from '../api/GetAPI';
import { FileRecord, SubmissionSummary, JudgeProgressAndStatus } from '../types/Assignments';
import useApiClient from '../hooks/useApiClient';
import CodeBlock from '../components/CodeBlock';
import { fetchSubmissionResultDetail } from '../api/GetAPI';
import { Problem } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { useAuth } from '../context/AuthContext';
import OfflineFileDownloadButton from '../components/OfflineFileDownloadButton';

const SubmissionDetail: React.FC = () => {
    const { token } = useAuth();
    const { submissionId } = useParams<{ submissionId: string }>();
    const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
    const [arrangedFiles, setArrangedFiles] = useState<FileRecord[]>([]);
    const { apiClient } = useApiClient();
    const [selectedUploadedFile, setSelectedUploadedFile] = useState<string>('');
    const [selectedArrangedFile, setSelectedArrangedFile] = useState<string>('');
    const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<JudgeProgressAndStatus>();
    const [problem, setProblem] = useState<Problem>();
    
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                const uploadedData = await apiClient({ apiFunc: fetchSubmissionFiles, args: [parseInt(submissionId!), 'uploaded']})
                const arrangedData = await apiClient({ apiFunc: fetchSubmissionFiles, args: [parseInt(submissionId!), 'arranged']})
                setUploadedFiles(uploadedData);
                setArrangedFiles(arrangedData);
            } catch (error) {
                setError('Failed to fetch files');
            }
        };

        const fetchSummary = async () => {
            try {
                const summary = await apiClient({ apiFunc: fetchSubmissionResultDetail, args: [parseInt(submissionId!)] });
                setSubmissionSummary(summary);
            } catch (error) {
                setError('Failed to fetch summary');
            }
        };

        const fetchStatusAndProblemEntry = async () => {
            try {
                const status = await apiClient({ apiFunc: fetchSubmissionStatus, args: [parseInt(submissionId!)] });
                setSubmissionStatus(status);

                if (status) {
                    const problem = await apiClient({ apiFunc: fetchProblemEntry, args: [status.lecture_id, status.assignment_id, status.for_evaluation] });
                    setProblem(problem);
                }
            } catch (error) {
                setError('Failed to fetch status');
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                fetchFiles();
                fetchSummary();
                fetchStatusAndProblemEntry();
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [submissionId, token]);

    const handleUploadedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUploadedFile(event.target.value);
    };

    const handleArrangedFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArrangedFile(event.target.value);
    };

    const getSelectedUploadedFileContent = () => {
        const file = uploadedFiles.find((file) => file.name === selectedUploadedFile);
        return file?.content as string;
    };

    const getSelectedArrangedFileContent = () => {
        const file = arrangedFiles.find((file) => file.name === selectedArrangedFile);
        return file?.content as string;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const toggleRow = (id: number) => {
        setExpandedRows(prevExpandedRows =>
            prevExpandedRows.includes(id)
                ? prevExpandedRows.filter(rowId => rowId !== id)
                : [...prevExpandedRows, id]
        );
    };

    return (
        <div>
            <h1>提出 #{submissionId}</h1>
            <h2>提出されたファイル一覧</h2>
            <select onChange={handleUploadedFileSelect} value={selectedUploadedFile}>
                <option value="">ファイルを選択してください</option>
                {uploadedFiles.filter(file => typeof file.content === 'string').map(file => (
                    <option key={file.name} value={file.name}>{file.name}</option>
                ))}
            </select>
            <CodeBlock code={getSelectedUploadedFileContent()} fileName={selectedUploadedFile} />
            <ul>
                {uploadedFiles.filter(file => file.content instanceof Blob).map(file => (
                    <li key={file.name}>
                        <OfflineFileDownloadButton file={file} />
                    </li>
                ))}
            </ul>
            <h2>用意されたファイル一覧</h2>
            <select onChange={handleArrangedFileSelect} value={selectedArrangedFile}>
                <option value="">ファイルを選択してください</option>
                {arrangedFiles.filter(file => typeof file.content === 'string').map(file => (
                    <option key={file.name} value={file.name}>{file.name}</option>
                ))}
            </select>
            <CodeBlock code={getSelectedArrangedFileContent()} fileName={selectedArrangedFile} />
            <ul>
                {arrangedFiles.filter(file => file.content instanceof Blob).map(file => (
                    <li key={file.name}>
                        <OfflineFileDownloadButton file={file} />
                    </li>
                ))}
            </ul>

            {
                submissionSummary && (
                    <div>
                        <h2>提出結果</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <th>提出日時</th>
                                    <td>{submissionStatus?.ts.toString()}</td>
                                </tr>
                                <tr>
                                    <th>問題</th>
                                    <td>{problem?.title}</td>
                                </tr>
                                <tr>
                                    <th>ユーザ</th>
                                    <td>{submissionSummary.user_id}</td>
                                </tr>
                                <tr>
                                    <th>得点</th>
                                    <td>{submissionSummary.score}</td>
                                </tr>
                                <tr>
                                    <th>結果</th>
                                    <td>{submissionSummary.result}</td>
                                </tr>
                                <tr>
                                    <th>実行時間</th>
                                    <td>{submissionSummary.timeMS}ms</td>
                                </tr>
                                <tr>
                                    <th>メモリ</th>
                                    <td>{submissionSummary.memoryKB}KB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }

            <div>
                <h2>メッセージ</h2>
                <p>{submissionSummary?.message || 'なし'}</p>
                <p>{'detail: ' +submissionSummary?.detail || ''}</p>
            </div>

            <h2>チェックリスト</h2>
            <CheckListTable>
                <thead>
                    <tr>
                        <th></th>
                        <th>チェック項目</th>
                        <th>結果</th>
                        <th>実行時間</th>
                        <th>メモリ</th>
                    </tr>
                </thead>
                <tbody>
                    {submissionSummary?.evaluation_summary_list.map((evaluation, index) => (
                        <React.Fragment key={evaluation.id}>
                            <CheckListRow>
                                <td>
                                    <ExpandButton onClick={() => toggleRow(evaluation.id)}>
                                        {expandedRows.includes(evaluation.id) ? '▼' : '▶'}
                                    </ExpandButton>
                                </td>
                                <td>{evaluation.eval_description}</td>
                                <td>{evaluation.result}</td>
                                <td>{evaluation.timeMS}ms</td>
                                <td>{evaluation.memoryKB}KB</td>
                            </CheckListRow>
                            {expandedRows.includes(evaluation.id) && (
                                <ExpandedRow>
                                    <td colSpan={5}>
                                        <JudgeResultsViewer results={evaluation.judge_result_list} />
                                    </td>
                                </ExpandedRow>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </CheckListTable>
        </div>
    );
};

export default SubmissionDetail;

const CheckListTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const CheckListRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

const ExpandedRow = styled.tr`
    background-color: #f9f9f9;
`;

const ExpandButton = styled.button`
    background-color: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
`;
