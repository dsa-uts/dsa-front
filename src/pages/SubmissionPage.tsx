import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SubAssignmentDropdown, SubAssignmentDetail } from '../types/Assignments';
import { fetchSubAssignmentDetail, fetchSubAssignments } from '../api/services/GetAPI';
import { updateMakefile } from '../api/services/PostAPI';
import Dropdown from '../components/Dropdown';
import CodeBlock from '../components/CodeBlock';
import Accordion from '../components/Accordion';
import {useAuth} from '../context/AuthContext';
import { ProgressMessage } from '../types/Assignments';
import ProgressBar from '../components/ProgressBar';
import CFileUploadBox from '../components/CFileUploadBox';
import Header from '../components/Header';
import CodeBlockManager from '../components/CodeBlockManager';
import { FlexRow } from '../styles/FlexRow';

const SubmissionPage: React.FC = () => {
	const { problemNum } = useParams<{ problemNum: string }>();
	const [subAssignmentsDropdown, setSubAssignmentsDropdown] = useState<SubAssignmentDropdown[]>([]);
	const [subAssignmentDetail, setSubAssignmentDetail] = useState<SubAssignmentDetail | null>(null);
	const [progressMessage, setProgressMessage] = useState<ProgressMessage | null>(null);
	const [hasError, setHasError] = useState(false);
	const navigate = useNavigate();
	const { token, is_admin } = useAuth();

	const [editMakefile, setEditMakefile] = useState(false);
	useEffect(() => {
		const getSubAssignmentsDropdown = async () => {
			if (!problemNum || problemNum.trim() === '') {
				return;
			}
			try {
				const data = await fetchSubAssignments(problemNum ?? '', token);
				setSubAssignmentsDropdown(data);
				setHasError(false); // 成功した場合はエラー状態をリセット
			} catch (error) {
				setHasError(true); // エラーが発生した場合はエラー状態をtrueに
			}
		};
		setProgressMessage(null);
		setSubAssignmentsDropdown([]);
		setSubAssignmentDetail(null);
		getSubAssignmentsDropdown();
	}, [problemNum]);

	const handleSelect = async (value: string) => {
        if (!value) {
            setSubAssignmentDetail(null);
            return;
        }
        const [id, subId] = value.split('-').map(Number);
        try {
            const detail = await fetchSubAssignmentDetail(id.toString(), subId.toString(), token);
            setSubAssignmentDetail(detail);
        } catch (error) {
            console.error('Error fetching assignment detail', error);
        }
    };

    const dropdownOptions = subAssignmentsDropdown.map(assignment => ({
        value: `${assignment.id}-${assignment.sub_id}`,
        label: assignment.title
    }));

	if (hasError) {
		// エラーがある場合はNotFoundメッセージを表示
		return <>
		<h1>Not Found</h1>
		<div>指定された課題は存在しないか，未公開です．</div>
		</>;
	}

	return (
		<div style={{ paddingBottom: '100px'}}>
			<Header problemNum={Number(problemNum)} is_admin={is_admin ? true : false} is_grading_page={false} />
			<Dropdown options={dropdownOptions} onSelect={handleSelect} />
			{subAssignmentDetail && (
				<div>
					<h2>課題詳細</h2>
					<CodeBlockManager title="使用するmakefile" initialLine={subAssignmentDetail.makefile} canEdit={is_admin} onSave={(makefile: string) => {updateMakefile(makefile, subAssignmentDetail.id, subAssignmentDetail.sub_id, token)}} onCancel={() => {}} />
					<h3>提出するファイル名</h3>
					<p>以下のファイルを提出してください．</p>
					<ul>
						<li>{subAssignmentDetail.required_file_name}</li>
					</ul>
					<h3>テストに使用するmainファイル</h3>
					{subAssignmentDetail.test_program ? (
						<Accordion title={subAssignmentDetail.test_file_name} content={subAssignmentDetail.test_program.split('\n')} />
					) : (
						<div style={{ color: 'red' }}>データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．</div>
					)}
					<FlexRow>
						<h3>期待する出力</h3>
						<button onClick={() => navigate(`/admin/edit/test_case/${subAssignmentDetail.id}/${subAssignmentDetail.sub_id}`)}>テストケース編集</button>
					</FlexRow>
					{subAssignmentDetail.test_output ? (
						<CodeBlock line={subAssignmentDetail.test_output} />
					) : (
						<div style={{ color : 'red' }}>データの取得に失敗しました．リロードしても失敗する場合はTAに連絡してください．</div>
					)}
					<h3>提出</h3>
					<p>指定されたファイルを選択し，アップロードしてください．ファイルはドラッグ&ドロップでも選択可能です．</p>
					<CFileUploadBox 
						id={subAssignmentDetail.id} 
						sub_id={subAssignmentDetail.sub_id} 
						fileName={subAssignmentDetail.required_file_name} 
						onProgressUpdate={setProgressMessage} 
						isProcessing={!!progressMessage && progressMessage.progress_percentage >= 0 && progressMessage.progress_percentage < 100}
					/>
					{progressMessage && <ProgressBar progress={progressMessage} />}
				</div>
			)}
		</div>
	);
	
};

export default SubmissionPage;

