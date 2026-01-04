import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Calculator, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizData = [
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

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(selectedAnswers[currentQuestion - 1] !== undefined);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    let score = 0;
    Object.keys(selectedAnswers).forEach((key) => {
      if (selectedAnswers[key] === quizData[key].correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Render Table helper
  const renderTable = (tableData) => {
    if (!tableData) return null;
    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {tableData.headers.map((header, idx) => (
                <th key={idx} className="border border-gray-300 p-2 text-center">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="border border-gray-300 p-2 text-center">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            結果発表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{score} / {quizData.length}</h2>
            <p className="text-gray-600">正解率: {Math.round((score / quizData.length) * 100)}%</p>
          </div>
          <div className="space-y-4">
            {quizData.map((q, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <span className="font-medium text-sm text-gray-700">問{index + 1}: {q.category}</span>
                {selectedAnswers[index] === q.correctAnswer ? (
                  <span className="text-green-600 font-bold flex items-center"><CheckCircle className="h-4 w-4 mr-1" />正解</span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center"><AlertCircle className="h-4 w-4 mr-1" />不正解</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" /> もう一度挑戦する
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQ = quizData[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="bg-white border-b sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              問題 {currentQuestion + 1} / {quizData.length}
            </span>
            <span className="text-sm text-gray-500">{currentQ.category}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded mr-2 mt-1 shrink-0">問</span>
              {currentQ.question}
            </h2>
            
            {currentQ.data && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 text-sm text-gray-700">
                <h3 className="font-bold mb-2">【資 料】</h3>
                <ul className="list-none space-y-1">
                  {currentQ.data.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {renderTable(currentQ.table)}
          </div>

          <RadioGroup 
            value={selectedAnswers[currentQuestion]?.toString()} 
            onValueChange={(val) => !isAnswered && handleAnswerSelect(parseInt(val))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${!isAnswered ? 'hover:bg-blue-50 hover:border-blue-200' : ''}
                  ${selectedAnswers[currentQuestion] === index 
                    ? (index === currentQ.correctAnswer 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500')
                    : (isAnswered && index === currentQ.correctAnswer 
                      ? 'bg-green-50 border-green-500' 
                      : 'border-gray-200 bg-white')
                  }
                `}
                onClick={() => !isAnswered && handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="cursor-pointer text-base font-medium w-full"
                    >
                      {option}
                    </Label>
                    {isAnswered && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && selectedAnswers[currentQuestion] === index && index !== currentQ.correctAnswer && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Alert className={`mb-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                <AlertTitle className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                  {isCorrect ? '正解！' : '不正解...'}
                </AlertTitle>
                <AlertDescription className="text-gray-700">
                  正解は <strong>{currentQ.options[currentQ.correctAnswer]}</strong> です。
                </AlertDescription>
              </Alert>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-200 pb-2">
                  <Calculator className="h-5 w-5" />
                  解説
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mb-2">
                    ここが重要
                  </span>
                  <p className="text-sm text-gray-700 font-medium">{currentQ.explanation.important}</p>
                </div>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded border border-gray-100">
                  {currentQ.explanation.content}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between p-6 bg-gray-50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="w-24"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!isAnswered}
            className="w-24 bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === quizData.length - 1 ? '結果へ' : '次へ'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizApp;