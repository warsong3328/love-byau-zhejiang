
export interface AdmissionData {
  year: number;
  batch: string;
  major: string;
  majorCode: string; // 专业代码
  collegeCode: string; // 院校代码 10223
  minScore: number;
  minRank: number;
  requirement: string;
  fee: number; // 学费
  tags?: string[];
}

export type SubjectType = '物理必选' | '不限';

export enum MatchLevel {
  RUSH = '冲',
  STABLE = '稳',
  SAFE = '保'
}
