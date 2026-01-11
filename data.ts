
import { AdmissionData } from './types';

const COLLEGE_CODE = '10223';

export const RAW_DATA: AdmissionData[] = [
  // 2025/2024 精确预测与历史参考数据 (结合用户提供的图片位次)
  { year: 2025, batch: '普通类一段', major: '动物医学(创新人才培养班)', majorCode: '005', collegeCode: COLLEGE_CODE, minScore: 562, minRank: 93122, requirement: '物理必选', fee: 3000, tags: ['免学费政策', '创新班'] },
  { year: 2025, batch: '普通类一段', major: '动物药学', majorCode: '004', collegeCode: COLLEGE_CODE, minScore: 555, minRank: 101529, requirement: '物理必选', fee: 4600 },
  { year: 2025, batch: '普通类一段', major: '农学(创新人才培养班)', majorCode: '001', collegeCode: COLLEGE_CODE, minScore: 555, minRank: 101529, requirement: '物理必选', fee: 3000, tags: ['重点学科'] },
  { year: 2025, batch: '普通类一段', major: '生物科学', majorCode: '014', collegeCode: COLLEGE_CODE, minScore: 553, minRank: 103818, requirement: '物理必选', fee: 4600 },
  { year: 2025, batch: '普通类一段', major: '汉语言文学', majorCode: '020', collegeCode: COLLEGE_CODE, minScore: 571, minRank: 81500, requirement: '不限', fee: 4000 },
  { year: 2025, batch: '普通类一段', major: '审计学', majorCode: '022', collegeCode: COLLEGE_CODE, minScore: 566, minRank: 88300, requirement: '不限', fee: 4000 },
  { year: 2025, batch: '普通类一段', major: '电气工程及其自动化', majorCode: '008', collegeCode: COLLEGE_CODE, minScore: 547, minRank: 110325, requirement: '物理必选', fee: 5500 },
  { year: 2025, batch: '普通类一段', major: '数据科学与大数据技术', majorCode: '010', collegeCode: COLLEGE_CODE, minScore: 539, minRank: 118796, requirement: '物理必选', fee: 5200 },
  { year: 2025, batch: '普通类一段', major: '园林', majorCode: '015', collegeCode: COLLEGE_CODE, minScore: 552, minRank: 104980, requirement: '不限', fee: 4000 },
  
  // 2023 历史关键节点
  { year: 2023, batch: '平行录取一段', major: '动物医学(创新人才培养班)', majorCode: '005', collegeCode: COLLEGE_CODE, minScore: 560, minRank: 95200, requirement: '物理必选', fee: 3000 },
  { year: 2023, batch: '平行录取一段', major: '农学(创新人才培养班)', majorCode: '001', collegeCode: COLLEGE_CODE, minScore: 550, minRank: 105000, requirement: '物理必选', fee: 3000 }
];

export const MAJOR_LIST = Array.from(new Set(RAW_DATA.map(d => d.major)));
