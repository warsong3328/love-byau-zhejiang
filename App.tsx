
import React, { useState, useMemo } from 'react';
import { RAW_DATA, MAJOR_LIST } from './data';
import { SubjectType, MatchLevel, AdmissionData } from './types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';

// --- Helper Functions ---
const getMatchLevel = (userRank: number, minRank: number): MatchLevel => {
  if (userRank <= minRank - 8000) return MatchLevel.SAFE;
  if (userRank <= minRank + 3000) return MatchLevel.STABLE;
  return MatchLevel.RUSH;
};

// --- Sub-components ---

const Header: React.FC = () => (
  <header className="relative w-full h-72 overflow-hidden bg-hbau-green">
    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-white p-2 rounded-full">
           <img src="https://img.icons8.com/color/48/university.png" alt="HBAU Logo" className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">稳上八一农大</h1>
      </div>
      <p className="text-base md:text-lg font-medium opacity-90">浙江考生专属报考辅助 · 10223 院校代码</p>
      
      <div className="mt-4 flex gap-3">
        <a href="tel:4006819043" className="bg-white text-hbau-green px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
          <i className="fa-solid fa-phone"></i> 招办直通
        </a>
        <a href="https://zhaosheng.byau.edu.cn/" target="_blank" className="bg-hbau-accent text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          进入官网
        </a>
      </div>
    </div>
  </header>
);

const MatchTool: React.FC = () => {
  const [userRank, setUserRank] = useState<string>('');
  const [subject, setSubject] = useState<SubjectType>('物理必选');
  const [results, setResults] = useState<(AdmissionData & { level: MatchLevel })[]>([]);

  const handleMatch = () => {
    const rank = parseInt(userRank);
    if (isNaN(rank)) {
      alert("请输入有效的位次数字");
      return;
    }

    const currentYearData = RAW_DATA.filter(d => d.year === 2025 && d.requirement === subject);
    const matched = currentYearData.map(d => ({
      ...d,
      level: getMatchLevel(rank, d.minRank)
    })).sort((a, b) => a.minRank - b.minRank);

    setResults(matched);
  };

  const exportVolunteerTable = () => {
    if (results.length === 0) return;
    
    // 浙江 2023 志愿表格式 CSV Header
    const headers = ["志愿序号", "院校代码", "院校名称", "专业代码", "专业名称", "选科要求", "服从专业调剂", "建议", "参考学费/年"];
    const rows = results.slice(0, 15).map((res, index) => [
      index + 1,
      res.collegeCode,
      "黑龙江八一农垦大学",
      res.majorCode,
      res.major,
      res.requirement,
      "是",
      res.level,
      res.fee
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `八一农大_浙江志愿表参考_${userRank}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="match-tool" className="max-w-6xl mx-auto -mt-8 px-4 mb-12 relative z-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-hbau-green">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-hbau-green text-white w-8 h-8 rounded-lg flex items-center justify-center">1</span>
          输入位次，精准匹配
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">My Rank / 我的位次</label>
            <input 
              type="number" 
              placeholder="如：105000" 
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-hbau-green outline-none text-lg font-bold"
              value={userRank}
              onChange={(e) => setUserRank(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Subjects / 选科要求</label>
            <select 
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-hbau-green outline-none appearance-none bg-white font-bold"
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectType)}
            >
              <option value="物理必选">物理必选 (理科优选)</option>
              <option value="不限">综合/不限 (文理兼招)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleMatch}
              className="w-full bg-hbau-green hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95"
            >
              立即分析概率
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-800">匹配结果 (建议位次排序):</h3>
              <button 
                onClick={exportVolunteerTable}
                className="bg-hbau-accent hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce"
              >
                <i className="fa-solid fa-file-excel"></i> 导出浙江志愿表 (.csv)
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((res, i) => (
                <div key={i} className="p-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 hover:bg-white hover:border-hbau-green hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">专业代码: {res.majorCode}</span>
                      <span className="font-bold text-gray-800 leading-tight group-hover:text-hbau-green transition-colors">{res.major}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-black shadow-sm ${
                      res.level === MatchLevel.SAFE ? 'bg-green-500 text-white' :
                      res.level === MatchLevel.STABLE ? 'bg-yellow-400 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {res.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500 font-medium">参考位次: <span className="text-gray-900 font-bold">{res.minRank.toLocaleString()}</span></div>
                    <div className="text-hbau-green font-bold">¥{res.fee}/年</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ExperienceSection: React.FC = () => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2">
      <i className="fa-solid fa-comments text-hbau-accent"></i> 浙江学长说：八一农大这 4 点必看！
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Real Scene 1 */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
        <div className="relative h-64 overflow-hidden">
          {/* 这里是【图片替换处】：实验室实景图 */}
          <img src="https://images.unsplash.com/photo-1579154235602-3c37ef7f3b33?auto=format&fit=crop&w=800&q=80" alt="Laboratory" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs">
            本科生重点实验室 · 浙江学长实拍
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-3">① 科研不设门槛</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            在大一只要你想，就能申请进课题组。实验室设备很新，跟着教授做大豆、动医项目，这种经历对考研或者就业都是降维打击。
          </p>
        </div>
      </div>

      {/* Real Scene 2 */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
        <div className="relative h-64 overflow-hidden">
          {/* 这里是【图片替换处】：体育场内景图 */}
          <img src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80" alt="Gym" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs">
            学校室内体育馆 · 下雪也能打球
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-3">② 运动超自由</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            作为一个浙江人，北方的运动氛围真的强。学校体育场设施特别全，傍晚和老乡约场球，或者去跑步，生活节奏非常舒服。
          </p>
        </div>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-hbau-green text-white p-8 rounded-[2rem]">
           <h4 className="text-xl font-black mb-4 flex items-center gap-2">
             <i className="fa-solid fa-repeat"></i> 转专业零门槛
           </h4>
           <p className="text-sm opacity-90 leading-relaxed">
             如果你被调剂到了不喜欢的专业，别慌！大一绩点只要在班级前列（其实不难），就能申请转专业。没有乱七八糟的潜规则，浙江老乡亲测透明高效。
           </p>
        </div>
        <div className="bg-gray-900 text-white p-8 rounded-[2rem]">
           <h4 className="text-xl font-black mb-4 flex items-center gap-2">
             <i className="fa-solid fa-wallet"></i> 钱包友好型
           </h4>
           <p className="text-sm opacity-90 leading-relaxed">
             公办本科，学费基本都在 4000-5000 块左右，甚至还有 3000 块的创新班。比起浙江省内的民办本科动辄两三万，这里四年的学费够在浙江读一年！
           </p>
        </div>
      </div>
    </div>
  </section>
);

const ChartAnalyst: React.FC = () => {
  const scatterData = useMemo(() => {
    return RAW_DATA.filter(d => d.year === 2025).map(d => ({
      name: d.major,
      score: d.minScore,
      rank: d.minRank,
      type: d.requirement
    }));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-black text-lg text-gray-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-hbau-green"></i> 数据解读：位次与选科矩阵
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis type="number" dataKey="score" name="分数" domain={['auto', 'auto']} unit="分" axisLine={false} />
              <YAxis type="number" dataKey="rank" name="位次" reversed domain={['auto', 'auto']} axisLine={false} />
              <ZAxis type="category" dataKey="name" name="专业" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              <Scatter name="2025录取预测" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === '物理必选' ? '#009A44' : '#F97316'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 gap-6 text-[10px] font-black tracking-widest uppercase text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-hbau-green rounded-full"></span> 物理必选</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-hbau-accent rounded-full"></span> 选科不限</span>
        </div>
      </div>
    </section>
  );
};

const TipsSection: React.FC = () => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <div className="bg-orange-50 rounded-3xl p-8 border-2 border-dashed border-hbau-accent/30">
      <h3 className="text-xl font-black text-hbau-accent mb-6 flex items-center gap-2">
        <i className="fa-solid fa-lightbulb"></i> 浙江 80 个平行志愿填报秘籍
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-hbau-accent font-bold mb-2">秘籍 01</p>
          <p className="text-sm font-bold text-gray-800">按“20冲+40稳+20保”比例填报。八一农大建议放在第 10-30 个“稳”区间志愿。</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-hbau-accent font-bold mb-2">秘籍 02</p>
          <p className="text-sm font-bold text-gray-800">专业调剂必选“是”。浙江一段录取极快，退档等于落榜，先进校再转专业更稳。</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-hbau-accent font-bold mb-2">秘籍 03</p>
          <p className="text-sm font-bold text-gray-800">同校专业按位次由高到低。如：动物医学 > 数据科学 > 园林，保证志愿梯度。</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-500 py-16 px-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-white font-black text-2xl mb-4">黑龙江八一农垦大学</h3>
        <p className="text-sm leading-relaxed mb-6">国家级特色专业、卓越农林人才教育培养计划高校。致力于为龙江振兴和现代农业培养高素质专门人才。</p>
        <div className="flex gap-4">
          <a href="tel:4006819043" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-hbau-green transition-colors">
            <i className="fa-solid fa-phone"></i>
          </a>
          <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-hbau-green transition-colors">
            <i className="fa-brands fa-weixin"></i>
          </a>
        </div>
      </div>
      <div className="md:text-right">
        <p className="text-white font-bold mb-2">招生咨询：400-681-9043</p>
        <p className="text-xs mb-8">地址：黑龙江省大庆市高新开发区新风路5号</p>
        <p className="text-[10px] opacity-50 uppercase tracking-tighter">
          © 2025 稳上八一农大 - 浙江考生专用版
        </p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-hbau-green/30">
      <Header />
      <MatchTool />
      <ChartAnalyst />
      <ExperienceSection />
      <TipsSection />
      <Footer />
    </div>
  );
};

export default App;
