// 授業エントリの型定義
export type Lecture = {
  id: number;
  title: string;
  start_date: Date;
  end_date: Date;
};

// テストケースの型を定義
export type TestCase = {
  id: number;
  eval_id: string;
  description: string | null;
  command: string;
  argument_path: string | null;
  stdin_path: string | null;
  expected_stdout: string | null;
  expected_stderr: string | null;
  exit_code: number;
};

export enum EvaluationType {
  Built = "Built",
  Judge = "Judge"
}

// 評価項目の型を定義
export type EvaluationItem = {
  str_id: string;
  lecture_id: number;
  assignment_id: number;
  for_evaluation: boolean;
  title: string;
  description: string | null;
  score: number;
  type: EvaluationType;
  arranged_file_id: string | null;
  message_on_fail: string | null;
  testcase_list: TestCase[];
};

// 課題の型を定義
export type Problem = {
  lecture_id: number;
  assignment_id: number;
  for_evaluation: boolean;
  title: string;
  description_path: string;
  timeMS: number;
  memoryMB: number;
  evaluation_item_list: EvaluationItem[];
}

export enum SingleJudgeStatus {
  AC = "AC", // Accepted
  WA = "WA", // Wrong Answer
  TLE = "TLE", // Time Limit Exceed
  MLE = "MLE", // Memory Limit Exceed
  RE = "RE", // Runtime Error
  CE = "CE", // Compile Error
  OLE = "OLE", // Output Limit Exceed (8000 bytes)
  IE = "IE" // Internal Error (e.g., docker sandbox management)
}

export type JudgeResult = {
  parent_id: number,
  submission_id: number,
  testcase_id: number,
  result: SingleJudgeStatus,
  timeMS: number,
  memoryKB: number,
  exit_code: number,
  stdout: string,
  stderr: string,
  description: string | null,
  command: string,
  stdin: string | null,
  expected_stdout: string | null,
  expected_stderr: string | null,
  expected_exit_code: number,
  id: number,
  ts: Date,
}

export enum EvaluationSummaryStatus {
  AC = "AC", // Accepted
  WA = "WA", // Wrong Answer
  TLE = "TLE", // Time Limit Exceed
  MLE = "MLE", // Memory Limit Exceed
  RE = "RE", // Runtime Error
  CE = "CE", // Compile Error
  OLE = "OLE", // Output Limit Exceed (8000 bytes)
  IE = "IE" // Internal Error (e.g., docker sandbox management)
}

export type EvaluationSummary = {
  parent_id: number,
  batch_id: number | null,
  user_id: string,
  lecture_id: number,
  assignment_id: number,
  for_evaluation: boolean,
  eval_id: string,
  arranged_file_id: string | null,
  result: EvaluationSummaryStatus,
  message: string | null,
  detail: string | null,
  score: number,
  eval_title: string,
  eval_description: string | null,
  eval_type: EvaluationType,
  arranged_file_path: string | null,
  id: number,
  judge_result_list: JudgeResult[],
}

export enum SubmissionSummaryStatus {
  AC = "AC", // Accepted
  WA = "WA", // Wrong Answer
  TLE = "TLE", // Time Limit Exceed
  MLE = "MLE", // Memory Limit Exceed
  RE = "RE", // Runtime Error
  CE = "CE", // Compile Error
  OLE = "OLE", // Output Limit Exceed (8000 bytes)
  IE = "IE", // Internal Error (e.g., docker sandbox management)
  FN = "FN" // File Not found
}

export type SubmissionSummary = {
  submission_id: number,
  batch_id: number | null,
  user_id: string,
  lecture_id: number,
  assignment_id: number,
  for_evaluation: boolean,
  result: SubmissionSummaryStatus,
  message: string | null,
  detail: string | null,
  score: number,
  evaluation_summary_list: EvaluationSummary[],
}

// プルダウンで使用する型定義（問題名のみ）
export type SubAssignmentDropdown = Pick<Problem, 'lecture_id' | 'assignment_id' | 'title'>;

// 選択された後に表示する情報用の型定義
export type SubAssignmentDetail = Pick<Problem, 'lecture_id' | 'assignment_id' | 'title' | 'description_path' | 'timeMS' | 'memoryMB'>;

export type ProgressMessage = {
    status: string;
    message: string;
    progress_percentage: number;
    result?: { [key: string]: any }; 
};

