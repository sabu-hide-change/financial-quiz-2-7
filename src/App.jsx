import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Home,
  BookOpen,
  XCircle,
  Bookmark,
  CheckSquare,
  Trophy
} from 'lucide-react';

export default function App() {
  // --- ステート管理 ---
  const [screen, setScreen] = useState('menu'); // 'menu', 'quiz', 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]); // 現在のモードでの出題リスト
  const [selectedAnswers, setSelectedAnswers] = useState({}); // 現在のセッションでの回答
  const [showExplanation, setShowExplanation] = useState(false);
  
  // 履歴データ（ローカルストレージ）
  // キー: quizHistory_smart_2_7
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('quizHistory_smart_2_7');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load history", e);
      return {};
    }
  });

  // --- クイズデータ (全13問) ---
  const originalQuizData = [
    {
      id: 1,
      category: "現在価値",
      question: "次の資料は、投資プロジェクトAに関するものである。この資料に基づいた場合、投資プロジェクトAの現在価値の値として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．現在、投資プロジェクトAを実行することによって、2年後にキャッシュ・フローが得られる。",
        "２．キャッシュ・フローが得られるのは、2年後だけである。",
        "３．2年後に得られるキャッシュ・フローは、121万円である。",
        "４．割引率は10％である。"
      ],
      options: ["80万円", "90万円", "96万円", "100万円", "110万円"],
      correctAnswer: 3, // エ -> 100万円
      explanation: {
        important: "お金の時間的価値を考慮し、将来の資金を現在の価値に割り引いて計算します。",
        content: `
          PV ＝ C × 1 / (1＋r)^n
          PV ＝ 121万円 × 1 / (1＋0.1)^2
          PV ＝ 121万円 ÷ 1.21
          PV ＝ 100万円
        `
      }
    },
    {
      id: 2,
      category: "複利現価係数と年金現価係数",
      question: "次の資料に基づいた場合、投資プロジェクトBの現在価値の値として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．現在、投資プロジェクトBを実行することによって、4年間にわたりキャッシュ・フローが得られる。",
        "２．キャッシュ・フローは、投資の1年後に始まり、以降1年ごとに得られる。",
        "３．毎年得られるキャッシュ・フローは、300万円である。",
        "４．割引率は10％である。",
        "５．現価係数は以下の通り。"
      ],
      table: {
        headers: ["年数", "複利現価係数", "年金現価係数"],
        rows: [
          ["1年", "0.91", "0.91"],
          ["2年", "0.83", "1.74"],
          ["3年", "0.75", "2.49"],
          ["4年", "0.68", "3.17"],
          ["5年", "0.62", "3.79"]
        ]
      },
      options: ["522万円", "747万円", "951万円", "1,137万円", "1,200万円"],
      correctAnswer: 2, // ウ -> 951万円
      explanation: {
        important: "毎年一定額のキャッシュ・フローがある場合、年金現価係数を使うと計算が早いです。",
        content: `
          毎年のCFが300万円で一定のため、4年の年金現価係数(3.17)を使用します。
          PV ＝ 300万円 × 3.17 ＝ 951万円
          （各年の複利現価係数を掛けて合計しても同じ結果になりますが、年金現価係数の方が効率的です）
        `
      }
    },
    {
      id: 3,
      category: "フリー・キャッシュ・フロー",
      question: "次の資料に基づいた当期のフリー・キャッシュ・フローの値として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．当期の営業利益は、2,000万円である。",
        "２．実効税率は40％である。",
        "３．当期の減価償却費は、400万円である。",
        "４．当期において、運転資本の増減はない。",
        "５．当期の投資額は、1,000万円である。"
      ],
      options: ["200万円", "300万円", "400万円", "500万円", "600万円"],
      correctAnswer: 4, // オ -> 600万円
      explanation: {
        important: "営業利益ベースの計算式：FCF ＝ 営業利益 × (1－実効税率) ＋ 減価償却費 － 運転資本増加額 － 投資額",
        content: `
          FCF ＝ 2,000 × (1 － 0.4) ＋ 400 － 0 － 1,000
          FCF ＝ 1,200 ＋ 400 － 1,000
          FCF ＝ 600万円
        `
      }
    },
    {
      id: 4,
      category: "投資の評価方法（理論）",
      question: "投資の評価方法に関する説明として、最も不適切なものはどれか。",
      options: [
        "正味現在価値法は、貨幣の時間的価値を考慮する方法であり、正味現在価値がプラスであり、かつ大きいほど、投資案の投資効率がよいと判断される。",
        "内部収益率法は、貨幣の時間的価値を考慮する方法であり、割引率が高いほど、投資案の投資効率がよいと判断される。",
        "回収期間法は、貨幣の時間的価値を考慮しない方法であり、回収期間の短い案ほど、投資案の安全性が高いと判断される。",
        "会計的投資利益率法は、貨幣の時間的価値を考慮しない方法であり、会計的投資利益率が低いほど、投資案の収益性が高いと判断される。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "各評価方法が「時間的価値を考慮するか」「何を指標とするか（高ければ良いか低ければ良いか）」を整理しましょう。",
        content: `
          不適切なのは「エ」です。
          会計的投資利益率法では、利益率が「高い」ほど収益性が高いと判断されます。「低いほど高い」というのは誤りです。
        `
      }
    },
    {
      id: 5,
      category: "正味現在価値法",
      question: "次の資料に基づいた場合、正味現在価値法により投資プロジェクトCの正味現在価値を求める場合の計算式として、最も不適切なものを下記の解答群から選べ。",
      data: [
        "１．初期投資額：5,500万円",
        "２．期間：5年間",
        "３．キャッシュインフロー：1〜4年後は各1,000万円、5年後は3,000万円",
        "４．割引率：10％"
      ],
      table: {
        headers: ["年数", "複利現価係数", "年金現価係数"],
        rows: [
          ["1年", "0.909", "0.909"],
          ["2年", "0.826", "1.735"],
          ["3年", "0.751", "2.486"],
          ["4年", "0.683", "3.169"],
          ["5年", "0.621", "3.790"]
        ]
      },
      options: [
        "1,000 × 3.169 ＋ 3,000 × 0.621 － 5,500",
        "1,000 × 3.169 ＋ 3,000 × 0.621",
        "1,000 × 3.790 ＋ (3,000 － 1,000) × 0.621 － 5,500",
        "1,000 × 0.909 ＋ 1,000 × 0.826 ＋ 1,000 × 0.751 ＋ 1,000 × 0.683 ＋ 3,000 × 0.621 － 5,500"
      ],
      correctAnswer: 1, // イ
      explanation: {
        important: "正味現在価値(NPV) ＝ 将来CFの現在価値合計 － 投資額",
        content: `
          不適切なのは「イ」です。
          この式は「将来キャッシュ・フローの現在価値」のみを計算しており、初期投資額（5,500万円）を引いていません。NPVを求めるには投資額を控除する必要があります。
        `
      }
    },
    {
      id: 6,
      category: "営業活動によるキャッシュ・フロー",
      question: "次の資料に基づき、この年度の営業活動によるキャッシュ・フローの値として、最も適切なものを下記の解答群から選べ。",
      data: [
        "・売上高(現金収入): 100万円",
        "・売上原価(現金支出): 40万円",
        "・販管費(現金支出): 20万円",
        "・実効税率: 40%",
        "・新設備: 取得50万円, 残存0, 耐用5年, 定額法"
      ],
      options: ["18万円", "22万円", "28万円", "32万円", "42万円"],
      correctAnswer: 2, // ウ -> 28万円
      explanation: {
        important: "営業CF ＝ 税引後利益 ＋ 非資金費用（減価償却費）",
        content: `
          1. 減価償却費 ＝ 50万円 ÷ 5年 ＝ 10万円
          2. 税引前利益 ＝ 100 － 40 － 20 － 10 ＝ 30万円
          3. 税引後利益 ＝ 30万円 × (1 － 0.4) ＝ 18万円
          4. 営業CF ＝ 18万円 ＋ 10万円 ＝ 28万円
        `
      }
    },
    {
      id: 7,
      category: "取替投資",
      question: "次の資料に基づき、新設備に取り替える時点における投資額（税引き後差額キャッシュフロー）の値として、最も適切なものを下記の解答群から選べ。",
      data: [
        "・新設備取得額: 120万円",
        "・旧設備取得原価: 100万円 (耐用5年, 残存0, 定額法)",
        "・旧設備経過年数: 2年",
        "・旧設備売却額: 40万円",
        "・実効税率: 40%"
      ],
      options: ["－80万円", "－72万円", "－68万円", "68万円", "72万円"],
      correctAnswer: 1, // イ -> -72万円
      explanation: {
        important: "旧設備売却損益による節税効果（タックスシールド）を考慮します。",
        content: `
          1. 旧設備簿価 ＝ 100 － (20×2) ＝ 60万円
          2. 売却損益 ＝ 売却額40 － 簿価60 ＝ －20万円（売却損）
          3. タックスシールド（税金の減少） ＝ 20万円 × 40% ＝ 8万円
          4. 投資時CF ＝ －新設備取得120 ＋ 旧設備売却40 ＋ 節税効果8 ＝ －72万円
        `
      }
    },
    {
      id: 8,
      category: "内部収益率法",
      question: "次の資料に基づいた内部収益率法に関する記述として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．初期投資額：100万円",
        "２．1年後に得られるCIF：110万円 (1回のみ)",
        "３．資本コスト：8％",
        "４．税金はないものとする"
      ],
      options: [
        "内部収益率は10％であるので、実行すべきと判断される。",
        "内部収益率は10％であるので、実行すべきでないと判断される。",
        "内部収益率は11％であるので、実行すべきと判断される。",
        "内部収益率は11％であるので、実行すべきでないと判断される。"
      ],
      correctAnswer: 0, // ア
      explanation: {
        important: "内部収益率(IRR)が資本コストを上回れば投資を実行します。",
        content: `
          1. IRRの計算: 100 × (1＋r) ＝ 110  →  100r ＝ 10  →  r ＝ 10%
          2. 判断: IRR(10%) ＞ 資本コスト(8%) なので、投資を実行すべきです。
        `
      }
    },
    {
      id: 9,
      category: "内部収益率法の特徴",
      question: "内部収益率法の特徴に関する説明として、最も適切なものはどれか。",
      options: [
        "計算が簡単であるという長所を持っている。",
        "将来予測されるキャッシュ・フローの符号が2回以上変わったとしても、内部収益率は一つだけに定まる。",
        "投資の規模を考慮するという長所を持っている。",
        "相互排他的投資案を評価する際には、収益率は高いが正味現在価値の低い投資案を採択する可能性がある。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "IRR法は「率」を重視するため、投資規模（金額の大きさ）を無視してしまう欠点があります。",
        content: `
          正解は「エ」です。
          IRR法は投資効率（率）を見るため、小規模で高効率な案件を選びがちですが、NPV（額）で見ると大規模案件の方が企業価値を高める場合があります。
          ア：計算は複雑です（高次方程式が必要になる場合がある）。
          イ：符号が反転すると複数の解が出ることがあります。
          ウ：投資規模は考慮されません。
        `
      }
    },
    {
      id: 10,
      category: "回収期間法",
      question: "次の資料に基づき、回収期間法についての記述として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．初期投資額：2,000万円",
        "２．各年のCIF：1年後400, 2年後600, 3年後800, 4年後1,000 (単位:万円)",
        "３．目標回収期間：3年間"
      ],
      options: [
        "回収期間は3.2年であるので、実行すべきである。",
        "回収期間は3.2年であるので、実行すべきでない。",
        "回収期間は4.0年であるので、実行すべきである。",
        "回収期間は4.0年であるので、実行すべきでない。"
      ],
      correctAnswer: 1, // イ
      explanation: {
        important: "回収期間 ≦ 目標期間 なら投資を実行します。",
        content: `
          1. 累計CF: 1年目400, 2年目1,000, 3年目1,800。
          2. 3年末時点で未回収額は 2,000 - 1,800 = 200万円。
          3. 4年目のCFは1,000万円なので、200/1,000 = 0.2年。
          4. 回収期間 ＝ 3.2年。
          5. 判断: 3.2年 ＞ 目標3年 なので、実行すべきではありません。
        `
      }
    },
    {
      id: 11,
      category: "回収期間法の特徴",
      question: "回収期間法の特徴に関する説明として、最も適切なものはどれか。",
      options: [
        "投資によって将来得られるキャッシュ・フローを現在価値に割引いて評価しており、貨幣の時間的価値を考慮している。",
        "目標となる回収期間が計算されるため、客観的な投資案の評価方法といえる。",
        "投資を回収した後のキャッシュ・フローを考慮している。",
        "計算が簡単なので、実務的には多くの中小企業が採用している。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "理論的な欠点（時間価値無視、回収後無視）はありますが、分かりやすさと安全性重視の観点から実務では人気があります。",
        content: `
          正解は「エ」です。
          ア：時間的価値は考慮しません。
          イ：目標期間は企業が任意に決めるため、客観性に欠けます。
          ウ：回収後の利益は無視されます。
        `
      }
    },
    {
      id: 12,
      category: "会計的投資利益率法",
      question: "次の資料に基づき、会計的投資利益率法についての説明として、最も適切なものを下記の解答群から選べ。",
      data: [
        "１．初期投資額：1,200万円 (残存0)",
        "２．各年の利益：1年後20, 2年後30, 3年後40 (単位:万円)",
        "３．平均投資額 ＝ (購入時簿価＋残存価値) ÷ 2 で計算",
        "４．目標投資利益率：4％"
      ],
      options: [
        "会計的投資利益率は2.5％であるので、実行すべきである。",
        "会計的投資利益率は2.5％であるので、実行すべきでない。",
        "会計的投資利益率は5％であるので、実行すべきである。",
        "会計的投資利益率は5％であるので、実行すべきでない。"
      ],
      correctAnswer: 2, // ウ -> 5%, 実行すべき
      explanation: {
        important: "会計的投資利益率 ＝ 会計上の平均利益 ÷ 平均投資額",
        content: `
          1. 平均利益 ＝ (20+30+40) ÷ 3 ＝ 30万円
          2. 平均投資額 ＝ (1,200 ＋ 0) ÷ 2 ＝ 600万円
          3. 利益率 ＝ 30 ÷ 600 ＝ 0.05 (5%)
          4. 判断: 5% ＞ 目標4% なので、実行すべきです。
        `
      }
    },
    {
      id: 13,
      category: "会計的投資利益率法の特徴",
      question: "会計的投資利益率法の特徴に関する説明として、最も適切なものはどれか。",
      options: [
        "投資によって将来得られる利益を現在価値に割引いて評価しており、貨幣の時間的価値を考慮している。",
        "目標となる会計的利益率が計算されるため、客観的な投資案の評価方法といえる。",
        "投資によって将来得られるキャッシュインフローを考慮していない。",
        "計算が非常に複雑である。"
      ],
      correctAnswer: 2, // ウ
      explanation: {
        important: "最大の特徴かつ欠点は、キャッシュ・フローではなく「会計上の利益」に基づく点です。",
        content: `
          正解は「ウ」です。
          会計的利益率法は、キャッシュインフローではなく帳簿上の利益を用います。
          ア：時間的価値は考慮しません。
          イ：目標率は恣意的に設定されるため客観性に欠けます。
          エ：利益データを使うため計算は比較的容易です。
        `
      }
    }
  ];

  // --- 履歴保存Effects ---
  useEffect(() => {
    localStorage.setItem('quizHistory_smart_2_7', JSON.stringify(history));
  }, [history]);

  // --- ロジック ---
  
  // クイズ開始処理
  const startQuiz = (mode) => {
    let questions = [];
    if (mode === 'all') {
      questions = originalQuizData;
    } else if (mode === 'wrong') {
      questions = originalQuizData.filter(q => history[q.id]?.lastResult === 'incorrect');
    } else if (mode === 'review') {
      questions = originalQuizData.filter(q => history[q.id]?.reviewNeeded);
    }

    if (questions.length === 0) {
      alert("該当する問題がありません！");
      return;
    }

    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setScreen('quiz');
  };

  // 回答選択処理
  const handleAnswerSelect = (optionIndex) => {
    const currentQ = activeQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex
    });

    // 履歴更新（回答時即時保存）
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        lastResult: isCorrect ? 'correct' : 'incorrect',
        lastAnsweredAt: new Date().toISOString(),
        // reviewNeededは維持する
        reviewNeeded: prev[currentQ.id]?.reviewNeeded || false
      }
    }));
    
    setShowExplanation(true);
  };

  // 要復習トグル処理
  const toggleReview = (questionId) => {
    setHistory(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        reviewNeeded: !prev[questionId]?.reviewNeeded
      }
    }));
  };

  // ナビゲーション
  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setScreen('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQId = activeQuestions[currentQuestionIndex - 1].id;
      // 前の問題に戻った時、すでに回答済みなら解説を表示
      setShowExplanation(selectedAnswers[prevQId] !== undefined);
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  // テーブル描画ヘルパー
  const renderTable = (tableData) => {
    if (!tableData) return null;
    return (
      <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-50">
            <tr>
              {tableData.headers.map((header, idx) => (
                <th key={idx} className="border-b border-gray-200 p-3 text-center font-semibold text-blue-800">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="border-b border-gray-200 p-3 text-center">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- 画面レンダリング ---

  // 1. メニュー画面
  if (screen === 'menu') {
    const wrongCount = originalQuizData.filter(q => history[q.id]?.lastResult === 'incorrect').length;
    const reviewCount = originalQuizData.filter(q => history[q.id]?.reviewNeeded).length;

    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">スマート問題集 2-7</h1>
            <p className="text-blue-100 font-medium">投資評価（全13問）</p>
          </div>
          
          <div className="p-6 md:p-8">
            {/* モード選択カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <button 
                onClick={() => startQuiz('all')}
                className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg text-slate-700">全問チャレンジ</span>
                <span className="text-sm text-slate-500 mt-1">全{originalQuizData.length}問</span>
              </button>

              <button 
                onClick={() => startQuiz('wrong')}
                disabled={wrongCount === 0}
                className={`group flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 shadow-sm
                  ${wrongCount === 0 
                    ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                    : 'bg-white border-red-100 hover:border-red-500 hover:bg-red-50 hover:shadow-md'}`}
              >
                <div className={`p-3 rounded-full mb-4 transition-colors ${wrongCount === 0 ? 'bg-slate-200 text-slate-400' : 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                  <XCircle className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg text-slate-700">前回不正解のみ</span>
                <span className="text-sm text-slate-500 mt-1">対象: {wrongCount}問</span>
              </button>

              <button 
                onClick={() => startQuiz('review')}
                disabled={reviewCount === 0}
                className={`group flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 shadow-sm
                  ${reviewCount === 0 
                    ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                    : 'bg-white border-amber-100 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md'}`}
              >
                <div className={`p-3 rounded-full mb-4 transition-colors ${reviewCount === 0 ? 'bg-slate-200 text-slate-400' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
                  <Bookmark className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg text-slate-700">要復習のみ</span>
                <span className="text-sm text-slate-500 mt-1">対象: {reviewCount}問</span>
              </button>
            </div>

            {/* 履歴一覧 */}
            <div className="mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-slate-700">問題一覧・学習状況</h3>
            </div>
            <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4 w-16 text-center">No</th>
                      <th className="p-4">カテゴリ</th>
                      <th className="p-4 w-28 text-center">前回結果</th>
                      <th className="p-4 w-24 text-center">要復習</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {originalQuizData.map((q, idx) => {
                      const h = history[q.id] || {};
                      return (
                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-700 text-base mb-1">{q.category}</div>
                          </td>
                          <td className="p-4 text-center">
                            {h.lastResult === 'correct' && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <CheckCircle className="w-3 h-3" /> 正解
                              </span>
                            )}
                            {h.lastResult === 'incorrect' && (
                              <span className="inline-flex items-center gap-1 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                <XCircle className="w-3 h-3" /> 不正解
                              </span>
                            )}
                            {!h.lastResult && <span className="text-slate-300 font-medium">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => toggleReview(q.id)}
                              className="focus:outline-none transition-transform active:scale-95 hover:bg-slate-100 p-2 rounded-full"
                            >
                              {h.reviewNeeded ? (
                                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-slate-300" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. クイズ画面
  if (screen === 'quiz') {
    const currentQ = activeQuestions[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQ.id] !== undefined;
    const isCorrect = selectedAnswers[currentQ.id] === currentQ.correctAnswer;
    const reviewNeeded = history[currentQ.id]?.reviewNeeded || false;

    return (
      <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-4 font-sans text-slate-800">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[80vh]">
          {/* ヘッダー */}
          <div className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 py-3 flex justify-between items-center bg-opacity-95 backdrop-blur-sm">
            <button 
              onClick={() => setScreen('menu')} 
              className="p-2 -ml-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="メニューに戻る"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-400">
                {currentQuestionIndex + 1} / {activeQuestions.length}
              </div>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {/* 問題文エリア */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  {currentQ.category}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed mb-4">
                {currentQ.question}
              </h2>
              
              {currentQ.data && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm text-slate-700 shadow-sm mb-4">
                  <h3 className="font-bold mb-3 text-slate-900 border-b border-slate-200 pb-2">【資 料】</h3>
                  <ul className="space-y-2">
                    {currentQ.data.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 text-blue-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {renderTable(currentQ.table)}
            </div>

            {/* 選択肢エリア */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQ.id] === index;
                let optionStyle = "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50";
                let icon = <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3" />;

                if (isAnswered) {
                  if (index === currentQ.correctAnswer) {
                    optionStyle = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500";
                    icon = <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 fill-emerald-100" />;
                  } else if (isSelected) {
                    optionStyle = "bg-red-50 border-red-500 ring-1 ring-red-500";
                    icon = <AlertCircle className="w-5 h-5 text-red-500 mr-3 fill-red-100" />;
                  } else {
                    optionStyle = "border-slate-100 opacity-50 bg-slate-50";
                  }
                } else if (isSelected) {
                   optionStyle = "border-blue-500 ring-1 ring-blue-500 bg-blue-50";
                   icon = <div className="w-5 h-5 rounded-full border-[5px] border-blue-500 mr-3" />;
                }

                return (
                  <button
                    key={index}
                    onClick={() => !isAnswered && handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${optionStyle}`}
                  >
                    <div className="shrink-0">{icon}</div>
                    <span className={`text-base font-medium ${isAnswered && index === currentQ.correctAnswer ? 'text-emerald-800' : 'text-slate-700'}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 解説エリア */}
            {showExplanation && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 結果バナー */}
                <div className={`mb-6 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border
                  ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertCircle className="w-6 h-6 text-red-500" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                        {isCorrect ? '正解！' : '不正解...'}
                      </h4>
                      {!isCorrect && (
                        <p className="text-sm text-red-600 mt-1">
                          正解は <strong>「{currentQ.options[currentQ.correctAnswer]}」</strong> です。
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* 要復習ボタン */}
                  <button 
                    onClick={() => toggleReview(currentQ.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all font-bold text-sm shadow-sm active:scale-95
                      ${reviewNeeded 
                        ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' 
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${reviewNeeded ? 'fill-current' : ''}`} />
                    {reviewNeeded ? '要復習リスト入り' : '要復習に追加'}
                  </button>
                </div>

                {/* 解説本文 */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100/50 px-5 py-3 border-b border-slate-200 flex items-center gap-2 text-slate-700 font-bold">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    解説とポイント
                  </div>
                  <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        ここが重要
                      </span>
                      <p className="text-slate-800 font-bold leading-relaxed">{currentQ.explanation.important}</p>
                    </div>
                    <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed font-mono bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      {currentQ.explanation.content}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="bg-white border-t border-slate-100 p-4 flex justify-between items-center sticky bottom-0 z-20">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> 前へ
            </button>
            <button 
              onClick={handleNext} 
              disabled={!isAnswered}
              className={`flex items-center px-8 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-md active:translate-y-0.5
                ${isAnswered 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg' 
                  : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
            >
              {currentQuestionIndex === activeQuestions.length - 1 ? '結果を見る' : '次へ'} <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. 結果画面
  if (screen === 'result') {
    const score = calculateScore();
    const percentage = Math.round((score / activeQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-10 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 opacity-90">結果発表</h2>
              <div className="flex items-baseline justify-center gap-2 my-6">
                <span className="text-7xl font-extrabold tracking-tighter">{score}</span>
                <span className="text-2xl font-medium opacity-70">/ {activeQuestions.length}</span>
              </div>
              <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold shadow-lg
                ${percentage >= 80 ? 'bg-white text-blue-600' : 'bg-blue-800 text-blue-100'}`}>
                正解率: {percentage}%
              </div>
            </div>
            {/* 装飾用背景円 */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-600">回答の振り返り</h3>
            </div>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeQuestions.map((q, index) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400">問{index + 1}</span>
                        <span className="bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{q.category}</span>
                      </div>
                      <span className="font-bold text-sm text-slate-700 line-clamp-1">{q.question}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          <span className="text-xs font-bold">正解</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                          <AlertCircle className="w-4 h-4 mr-1.5" />
                          <span className="text-xs font-bold">不正解</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => toggleReview(q.id)} 
                        className={`p-2 rounded-full transition-colors ${history[q.id]?.reviewNeeded ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:bg-slate-200'}`}
                        title="要復習リストに追加/解除"
                      >
                         <Bookmark className={`w-5 h-5 ${history[q.id]?.reviewNeeded ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-200">
            <button 
              onClick={() => setScreen('menu')} 
              className="group flex items-center justify-center bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 font-bold py-3 px-8 rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-5 w-5 group-hover:-rotate-180 transition-transform duration-500" /> 
              メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }
}