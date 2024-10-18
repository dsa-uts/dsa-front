import React, { useState, useEffect } from 'react';
import { fetchLectures, fetchProblemDetail } from '../api/GetAPI';
import { Lecture } from '../types/Assignments';
import FileUploadBox from '../components/FileUploadBox';
import { useParams } from 'react-router-dom';
import useApiClient from '../hooks/useApiClient';
import { useAuth } from '../context/AuthContext';
import { submitStudentZip } from '../api/PostAPI';
import { useNavigate } from 'react-router-dom';

const FormatCheckSubmission: React.FC = () => {
  const { token } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const lecture_id_from_query = searchParams.get('lecture_id');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(
    lecture_id_from_query ? parseInt(lecture_id_from_query) : null
  );
  const [lectureId2RequiredFiles, setLectureId2RequiredFiles] = useState<Map<number, string[]>>(new Map());
  const { apiClient } = useApiClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lectureList = await apiClient({ apiFunc: fetchLectures, args: [true] });

        for (const lecture of lectureList) {
          for (const problem of lecture.problems) {
            // problem.detailを取得
            const problemWithDetail = await apiClient({ apiFunc: fetchProblemDetail, args: [lecture.id, problem.assignment_id, false] });
            problem.detail = problemWithDetail.detail;
          }
        }

        setLectures(lectureList);

        const lectureId2RequiredFiles = new Map<number, string[]>();
        for (const lecture of lectureList) {
          const requiredFiles: string[] = [];
          for (const problem of lecture.problems) {
            for (const requiredFile of problem.detail?.required_files ?? []) {
              requiredFiles.push(requiredFile.name);
            }
          }
          // レポートのファイル名を追加
          requiredFiles.push('report' + lecture.id + '.pdf');
          lectureId2RequiredFiles.set(lecture.id, requiredFiles);
        }
        setLectureId2RequiredFiles(lectureId2RequiredFiles);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleLectureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLectureId(event.target.value === "" ? null : parseInt(event.target.value));
  };

  const handleSubmit = async (files: File[]) => {
    // ファイルがclass{selectedLectureId}.zip一つのみであることをチェック
    if (files.length === 1 && files[0].name === 'class' + selectedLectureId + '.zip') {
      try {
        const response = await apiClient({ apiFunc: submitStudentZip, args: [selectedLectureId, false, files[0]] });
        console.log('Files uploaded successfully:', response);
        navigate('/status/me');
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    } else {
      alert('class{selectedLectureId}.zipのみアップロードできます');
    }
  }

  return (
    <div>
      <h1>フォーマットチェック</h1>
      <select onChange={handleLectureChange} value={selectedLectureId || ""}>
        <option value="">課題を選択してください</option>
        {lectures.map((lecture) => (
          <option key={lecture.id} value={lecture.id}>
            {lecture.title}
          </option>
        ))}
      </select>

      {selectedLectureId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2>class{selectedLectureId}.zipの構造</h2>
          <pre style={{ textAlign: 'left' }}>
            {`class${selectedLectureId}/\n`}
            {`  +-${lectureId2RequiredFiles.get(selectedLectureId)?.join('\n  +-')}`}
          </pre>
        </div>
      )}

      {selectedLectureId &&
        <FileUploadBox 
          onSubmit={handleSubmit}
          descriptionOnBox={`class${selectedLectureId}.zipをアップロードしてください`}
        />
      }
    </div>
  )
};

export default FormatCheckSubmission;