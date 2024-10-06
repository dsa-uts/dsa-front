import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBatchEvaluationUserDetail, fetchSubmissionResultDetail, fetchProblems, fetchBatchSubmission, fetchUserInfo } from '../api/GetAPI';
import { useAuth } from '../context/AuthContext';
import useApiClient from '../hooks/useApiClient';
import { EvaluationDetail, Problem, SubmissionSummary, BatchSubmissionRecord, SubmissionSummaryStatus } from '../types/Assignments';
import styled from 'styled-components';
import JudgeResultsViewer from '../components/JudgeResultsViewer';
import { User } from '../types/user';


const BatchUserDetail: React.FC = () => {
  const { batchId, userId } = useParams<{ batchId: string; userId: string }>();
  console.log("batchId: ", batchId);
  console.log("userId: ", userId);
  const { token } = useAuth();
  const { apiClient } = useApiClient();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [lectureId, setLectureId] = useState<number | null>(null);
  const [batchDetail, setBatchDetail] = useState<EvaluationDetail>();
  const [assignmentId2SubmissionSummary, setAssignmentId2SubmissionSummary] = useState<{ [key: number]: SubmissionSummary | null }>({});
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [currentSubmissionSummary, setCurrentSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);  

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (!batchId || !userId) return;
      try {
        // バッチ採点のエントリを取得
        const batchSubmission = await apiClient({ apiFunc: fetchBatchSubmission, args: [parseInt(batchId)] });
        if (batchSubmission) {
          setLectureId(batchSubmission.lecture_id);
        }

        let problemsData: Problem[] = [];
        // 課題情報を取得
        problemsData = await apiClient({ apiFunc: fetchProblems, args: [batchSubmission.lecture_id, true] });
        setProblems(problemsData);
        

        // 特定のバッチ採点の特定の学生の詳細を取得
        const userBatchDetail = await apiClient({ apiFunc: fetchBatchEvaluationUserDetail, args: [parseInt(batchId), parseInt(userId)] });
        setBatchDetail(userBatchDetail);
        const submissionPromises = userBatchDetail.submission_summary_list.map(summary =>
          apiClient({ apiFunc: fetchSubmissionResultDetail, args: [summary.submission_id] })
        );
        const submissionResults = await Promise.all(submissionPromises);

        const newAssignmentId2SubmissionSummary: { [key: number]: SubmissionSummary } = {};

        submissionResults.forEach((result, index) => {
          newAssignmentId2SubmissionSummary[result.assignment_id] = result;
        });
        setAssignmentId2SubmissionSummary(newAssignmentId2SubmissionSummary);

        //console.log("newAssignmentId2SubmissionSummary: ", newAssignmentId2SubmissionSummary);

        const newUserInfo = await apiClient({ apiFunc: fetchUserInfo, args: [parseInt(userId)] });
        setUserInfo(newUserInfo);
        //console.log("assignmentId2SubmissionSummary: ", assignmentId2SubmissionSummary);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    //console.log("assignmentId2SubmissionSummary: ", assignmentId2SubmissionSummary);
  }, [batchId, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCheckListRowClick = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentSubmissionSummary(assignmentId2SubmissionSummary[assignmentId]);
  }

  const toggleRow = (id: number) => {
    setExpandedRows(prevExpandedRows =>
      prevExpandedRows.includes(id)
          ? prevExpandedRows.filter(rowId => rowId !== id)
          : [...prevExpandedRows, id]
    );
  }

  console.log("lectureId: ", lectureId);
  console.log("assignmentId2SubmissionSummary: ", assignmentId2SubmissionSummary);
  console.log("problems: ", problems);

  return (
    <div>
      <h1>バッチ採点結果: ユーザー {userId} ({userInfo?.username})</h1>
      <p>バッチID: {batchId}</p>
      <p>提出日時: {batchDetail?.submit_date instanceof Date ? batchDetail?.submit_date.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-') : new Date(batchDetail?.submit_date!).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\//g, '-')} </p>
      <h2>課題別結果</h2>
      { problems.length > 0 && (
      <table>
        <thead>
          <tr>
            {problems.map((problem, index) => (
              <th>{problem.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {problems.map((problem, index) => (
              <th key={index} onClick={() => handleCheckListRowClick(problem.assignment_id)}>
                {// problem.assignment_idから該当するSubmissionSummaryのresultを取得
                  assignmentId2SubmissionSummary[problem.assignment_id]?.result
                }
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      )}

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
          {currentSubmissionSummary?.evaluation_summary_list.map((evaluation, index) => (
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

export default BatchUserDetail;

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
