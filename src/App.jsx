import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Calculator, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizData = [
    {
      id: 1,
      category: "意思決定会計",
      question: "Ａ社は20年間の火災保険契約を結ぶ。「一括払」と「分割払」の2種類から選ぶことができる。Ａ社が選ぶべき支払額のタイプおよびその現在価値の組み合わせとして、最も適切なものはどれか。",
      data: [
        "・契約時点：年初",
        "・割引率：5％",
        "・年金現価係数：19年の場合12、20年の場合12.5",
        "・一括払：契約時に300万円",
        "・分割払：契約時に20万円、以降年末に20万円ずつ（計20回）"
      ],
      options: [
        "「一括払」：300万円",
        "「分割払」：250万円",
        "「分割払」：260万円",
        "「分割払」：400万円"
      ],
      correctAnswer: 2, // ウ -> 分割払260万円
      explanation: {
        important: "「分割払」は、初回の支払いが「現在（0年）」、残りの19回が「1年後〜19年後」となる点に注意が必要です。",
        content: `
          1. 一括払の現在価値：
             契約時（現在）に払うため、そのまま **300万円**。

          2. 分割払の現在価値：
             - 初回（0年目年初）：20万円（割引なし）
             - 残り19回（1年後〜19年後）：20万円 × 19年の年金現価係数(12)
             
             計算式：
             20万円 ＋ (20万円 × 12) 
             ＝ 20 ＋ 240 
             ＝ **260万円**

          3. 比較：
             300万円(一括) ＞ 260万円(分割)
             支出が少ない（現在価値が低い）「分割払：260万円」を選すべきです。
        `
      }
    },
    {
      id: 2,
      category: "内部収益率と正味現在価値法",
      question: "投資案Aと投資案Bのどちらを採択するかについて、内部収益率法(IRR)と正味現在価値法(NPV)では結論が異なっている。その理由として、最も適切なものはどれか。",
      data: [
        "・経済命数：2年",
        "・初期投資額：同一",
        "・資本コスト：5%",
        "・A案：IRR 14.7%, NPV 18.4万円 (後半にCF大)",
        "・B案：IRR 17.1%, NPV 13.4万円 (前半にCF大)"
      ],
      options: [
        "会計的投資利益率の相違",
        "回収期間法における回収期間の相違",
        "再投資における収益率の相違",
        "割引キャッシュフロー法であるかないかの相違"
      ],
      correctAnswer: 2, // ウ
      explanation: {
        important: "NPV法とIRR法で結論が異なる主な原因は「再投資収益率」の仮定の違いです。",
        content: `
          NPV法は、生み出されたキャッシュフローを「資本コスト（本問では5%）」で再投資すると仮定します。
          一方、IRR法は、キャッシュフローを「その投資案の内部収益率（A案14.7%、B案17.1%）」で再投資すると仮定します。
          
          この再投資レートの仮定の違いにより、特にキャッシュフローの発生時期パターンが異なる投資案（A案とB案のようなケース）を比較する場合、結論が食い違うことがあります。
        `
      }
    },
    {
      id: 3,
      category: "投資の経済性評価",
      question: "正味現在価値法を用いた場合と、収益性指数法を用いた場合で、それぞれどの設備への投資案が採択されるか。最も適切な組み合わせを選べ。",
      data: ["※投資案は相互排他的である"],
      table: {
        headers: ["設備", "初期投資額", "現金収支のPV合計"],
        rows: [
          ["設備A", "4,400万円", "5,500万円"],
          ["設備B", "5,000万円", "6,500万円"],
          ["設備C", "4,000万円", "5,400万円"]
        ]
      },
      options: [
        "正味現在価値法:設備A / 収益性指数法:設備B",
        "正味現在価値法:設備A / 収益性指数法:設備C",
        "正味現在価値法:設備B / 収益性指数法:設備B",
        "正味現在価値法:設備B / 収益性指数法:設備C",
        "正味現在価値法:設備C / 収益性指数法:設備B"
      ],
      correctAnswer: 3, // エ -> NPV:B, PI:C
      explanation: {
        important: "正味現在価値(NPV) ＝ PV合計 － 投資額\n収益性指数 ＝ PV合計 ÷ 投資額",
        content: `
          各設備の計算結果は以下の通りです。

          1. 正味現在価値 (NPV) ※大きい方が良い
             A: 5,500 - 4,400 = 1,100
             B: 6,500 - 5,000 = **1,500** (最大)
             C: 5,400 - 4,000 = 1,400

          2. 収益性指数 (PI) ※大きい方が良い
             A: 5,500 ÷ 4,400 = 1.25
             B: 6,500 ÷ 5,000 = 1.30
             C: 5,400 ÷ 4,000 = **1.35** (最大)

          したがって、NPV法ではB、収益性指数法ではCが採択されます。
        `
      }
    },
    {
      id: 4,
      category: "新設備購入のCF計算",
      question: "来年度の期首に新設備を購入しようと検討中である。この投資案の各期の税引後キャッシュフローとして、最も適切なものはどれか。",
      data: [
        "・購入価額：100百万円",
        "・現金の費用節約額：毎年30百万円",
        "・減価償却：耐用5年、残存ゼロ、定額法",
        "・税率：40％"
      ],
      options: [
        "12百万円",
        "18百万円",
        "26百万円",
        "34百万円"
      ],
      correctAnswer: 2, // ウ -> 26百万円
      explanation: {
        important: "税引後CF ＝ (現金収入－現金支出)×(1－税率) ＋ 減価償却費×税率\nまたは、税引後利益 ＋ 減価償却費",
        content: `
          1. 減価償却費の計算
             100 ÷ 5 ＝ 20百万円

          2. 税引後利益の計算
             費用節約益 30 － 減価償却費 20 ＝ 税引前利益 10
             税引前利益 10 － 税金(10×40%) 4 ＝ 税引後利益 6

          3. 税引後キャッシュフローの計算
             税引後利益 6 ＋ 減価償却費 20 ＝ **26百万円**
        `
      }
    },
    {
      id: 5,
      category: "貸付金の現在価値",
      question: "B社は以下のような条件で、取引先に貸し付けを行った。割引率を4％としたとき、貸付日における現在価値として、最も適切なものを選べ。",
      data: [
        "・貸付日：2020年7月1日 (期間5年)",
        "・元本返済：2025年6月30日に200万円一括",
        "・利息受取：毎年6月30日に10万円 (元本の5%)",
        "・割引率4%の係数：複利現価係数(5年) 0.822、年金現価係数(5年) 4.452"
      ],
      options: [
        "200.1万円",
        "201.3万円",
        "207.7万円",
        "208.9万円"
      ],
      correctAnswer: 3, // エ -> 208.9万円
      explanation: {
        important: "元本（一括受取）には複利現価係数、利息（毎年受取）には年金現価係数を使用します。",
        content: `
          1. 元本の現在価値
             200万円 × 0.822 (5年の複利現価係数) 
             ＝ 164.4万円

          2. 利息の現在価値
             10万円 × 4.452 (5年の年金現価係数)
             ＝ 44.52万円

          3. 合計
             164.4 ＋ 44.52 ＝ 208.92 ≒ **208.9万円**
        `
      }
    },
    {
      id: 6,
      category: "複利計算（割引債）",
      question: "額面が121万円、償還までの期間が2年の割引債の市場価格が100万円であった。このとき、この割引債の複利最終利回り(年)として、最も適切なものはどれか。",
      options: [
        "10.0％",
        "11.0％",
        "17.4％",
        "21.0％"
      ],
      correctAnswer: 0, // ア -> 10%
      explanation: {
        important: "現在の価格 × (1＋利回り)^年数 ＝ 将来の価値",
        content: `
          利回りを r とすると、
          100万円 × (1 ＋ r)^2 ＝ 121万円
          (1 ＋ r)^2 ＝ 1.21
          1 ＋ r ＝ 1.1 （√1.21 ＝ 1.1）
          r ＝ 0.1 ＝ **10%**
        `
      }
    },
    {
      id: 7,
      category: "現価係数の関係",
      question: "割引率が8％の場合の年金現価係数は以下のとおりである。2期末のキャッシュ･フローを現在価値にする「複利現価係数」として、最も適切なものを選べ。",
      table: {
        headers: ["期間", "年金現価係数"],
        rows: [
          ["1", "0.9259"],
          ["2", "1.7833"],
          ["3", "2.5771"]
        ]
      },
      options: [
        "0.7938",
        "0.8574",
        "0.9259",
        "1.7833"
      ],
      correctAnswer: 1, // イ -> 0.8574
      explanation: {
        important: "n年の年金現価係数 ＝ 1年〜n年の複利現価係数の合計 です。",
        content: `
          したがって、
          2年の複利現価係数 ＝ 2年の年金現価係数 － 1年の年金現価係数
          
          計算：
          1.7833 － 0.9259 ＝ **0.8574**
        `
      }
    },
    {
      id: 8,
      category: "税引後キャッシュ・フロー",
      question: "ある機械の導入により、年間の税引前キャッシュフローが2,000万円増加する。また、この機械の年間減価償却費は900万円である。実効税率を30%とするとき、年間の税引後キャッシュフローはいくらになるか。",
      options: [
        "870万円",
        "1,100万円",
        "1,670万円",
        "2,030万円"
      ],
      correctAnswer: 2, // ウ -> 1,670万円
      explanation: {
        important: "税引前キャッシュフローには減価償却費が含まれていません（利益＋減価償却費の状態）。ここから税金を引く必要があります。",
        content: `
          1. 税引前利益の計算
             税引前CF 2,000 － 減価償却費 900 ＝ 1,100万円

          2. 税引後利益の計算
             1,100 × (1 － 0.3) ＝ 770万円

          3. 税引後キャッシュフロー
             税引後利益 770 ＋ 減価償却費 900 ＝ **1,670万円**
             
          （別解：タックスシールド利用）
          2,000×(1-0.3) ＋ 900×0.3 ＝ 1,400 ＋ 270 ＝ 1,670
        `
      }
    },
    {
      id: 9,
      category: "税引後キャッシュ・フロー",
      question: "当期首に1,500万円をある設備(耐用3年、残存0、定額法)に投資すると、各期末に900万円の「税引前キャッシュフロー」が得られる。税率を30％とすると、各期末の税引後キャッシュフローはいくらになるか。",
      options: [
        "180万円",
        "280万円",
        "630万円",
        "780万円"
      ],
      correctAnswer: 3, // エ -> 780万円
      explanation: {
        important: "まず減価償却費を計算し、利益を求めてからキャッシュフローを算出します。",
        content: `
          1. 減価償却費
             1,500 ÷ 3 ＝ 500万円

          2. 税引前利益
             税引前CF 900 － 減価償却費 500 ＝ 400万円
             （※問題文の「税引前CF」は、営業利益＋減価償却費に相当）

          3. 税引後利益
             400 × (1 － 0.3) ＝ 280万円

          4. 税引後キャッシュフロー
             税引後利益 280 ＋ 減価償却費 500 ＝ **780万円**
        `
      }
    },
    {
      id: 10,
      category: "内部収益率法",
      question: "内部収益率法を用いた場合のプロジェクトの順位づけとして、最も適切なものを選べ。なお、IRRが高いほど優先順位が高いとする。",
      data: [
        "・初期投資：各-500",
        "・P①：IRR 8.5%",
        "・P②：毎年200のCF (3年間)",
        "・P③：IRR 7.6%",
        "・年金現価係数(3年)：2.487(10%), 2.531(9%)"
      ],
      options: [
        "①＞②＞③",
        "①＞③＞②",
        "②＞①＞③",
        "②＞③＞①",
        "③＞①＞②"
      ],
      correctAnswer: 2, // ウ -> 2>1>3
      explanation: {
        important: "プロジェクト②のIRRを概算する必要があります。",
        content: `
          1. プロジェクト②のIRR計算
             投資額 500 ＝ 毎年CF 200 × 年金現価係数
             年金現価係数 ＝ 500 ÷ 200 ＝ 2.5

          2. 係数表との比較
             年金現価係数 2.5 は、9% (2.531) と 10% (2.487) の間です。
             つまり、P②のIRRは「9%〜10%」の間となります。

          3. 比較
             P② (9%超) ＞ P① (8.5%) ＞ P③ (7.6%)
             
          よって、②＞①＞③ となります。
        `
      }
    },
    {
      id: 11,
      category: "事業部別IRR評価",
      question: "H事業部(H案)とL事業部(L案)の投資評価を行ったとき、最も適切な判断はどれか。",
      table: {
        headers: ["項目", "値"],
        rows: [
          ["H案のIRR", "10%"],
          ["L案のIRR", "7%"],
          ["全社的WACC", "8%"],
          ["H事業部資本コスト", "11%"],
          ["L事業部資本コスト", "5%"]
        ]
      },
      options: [
        "H案、L案ともに棄却される。",
        "H案、L案ともに採択される。",
        "H案は棄却され、L案は採択される。",
        "H案は採択され、L案は棄却される。"
      ],
      correctAnswer: 2, // ウ
      explanation: {
        important: "リスクの異なる事業部では、全社的WACCではなく「各事業部の資本コスト」とIRRを比較します。",
        content: `
          1. H案の評価
             IRR(10%) ＜ H事業部資本コスト(11%)
             → 投資効率がコストを下回るため「棄却」

          2. L案の評価
             IRR(7%) ＞ L事業部資本コスト(5%)
             → 投資効率がコストを上回るため「採択」

          もし全社WACC(8%)で判断すると誤った意思決定（H採択、L棄却）をしてしまうため注意が必要です。
        `
      }
    },
    {
      id: 12,
      category: "回収期間法",
      question: "回収期間法(目標3年)で採択されるために最低限必要とされる「年間の生産コスト低減額」として最も適切なものはどれか。",
      data: [
        "・設備取得：4,500万円 (耐用5年, 残存0, 定額法)",
        "・法人税率：40％",
        "・減価償却費以外の追加費用なし"
      ],
      options: [
        "600万円",
        "900万円",
        "1,500万円",
        "1,900万円"
      ],
      correctAnswer: 3, // エ -> 1,900万円
      explanation: {
        important: "逆算の思考が必要です。「目標回収期間3年」→「必要なCF」→「必要な利益」→「必要なコスト削減額」の順で求めます。",
        content: `
          1. 必要な年間キャッシュフロー(CF)
             投資額 4,500 ÷ CF ＝ 3年
             必要なCF ＝ 1,500万円

          2. 減価償却費
             4,500 ÷ 5 ＝ 900万円

          3. 必要な税引後利益
             CF 1,500 － 減価償却費 900 ＝ 600万円

          4. 必要な税引前利益
             税引後利益 600 ÷ (1 － 0.4) ＝ 1,000万円

          5. 必要なコスト低減額（＝減価償却前の利益効果）
             税引前利益 1,000 ＋ 減価償却費 900 ＝ **1,900万円**
        `
      }
    },
    {
      id: 13,
      category: "投資評価基準の理論",
      question: "投資評価基準に関する記述として、最も適切なものはどれか。",
      options: [
        "会計的投資利益率法に使われる会計利益には減価償却費を計算に入れない。",
        "回収期間法における回収期間とは、プロジェクトの経済命数のことである。",
        "正味現在価値はパーセントで表示される。",
        "正味現在価値法と内部収益率法は共にDCF法であるが、同一の結論を導くとは限らない。"
      ],
      correctAnswer: 3, // エ
      explanation: {
        important: "NPV法とIRR法は、再投資率の仮定の違いや投資規模の違いにより、結論が異なる場合があります。",
        content: `
          ア：誤り。会計的利益は減価償却費を控除して計算します。
          イ：誤り。回収期間は投資額を回収するまでの期間であり、経済命数（寿命）とは異なります。
          ウ：誤り。正味現在価値(NPV)は「金額」で表示されます。％で表示されるのはIRRです。
          エ：正しい。相互排他的な投資案などの場合、結論が異なることがあります。
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
      <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            結果発表
          </h2>
        </div>
        <div className="p-6">
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
        </div>
        <div className="flex justify-center p-6 bg-gray-50">
          <button 
            onClick={restartQuiz} 
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> もう一度挑戦する
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-white border-b sticky top-0 z-10 p-6">
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
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded mr-2 mt-1 shrink-0">問</span>
              {currentQ.question}
            </h2>
            
            {currentQ.data && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 text-sm text-gray-700">
                <h3 className="font-bold mb-2">【資 料】</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {currentQ.data.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {renderTable(currentQ.table)}
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label 
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
              >
                <input 
                  type="radio" 
                  name={`question-${currentQuestion}`} 
                  value={index} 
                  checked={selectedAnswers[currentQuestion] === index}
                  onChange={() => !isAnswered && handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className="sr-only" 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium w-full">{option}</span>
                    {isAnswered && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && selectedAnswers[currentQuestion] === index && index !== currentQ.correctAnswer && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`mb-4 p-4 rounded-lg border flex items-start gap-3 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                <div>
                  <h4 className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '正解！' : '不正解...'}
                  </h4>
                  <p className="text-gray-700 text-sm mt-1">
                    正解は <strong>{currentQ.options[currentQ.correctAnswer]}</strong> です。
                  </p>
                </div>
              </div>

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
        </div>

        <div className="flex justify-between p-6 bg-gray-50 border-t">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
          </button>
          <button 
            onClick={handleNext} 
            disabled={!isAnswered}
            className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === quizData.length - 1 ? '結果へ' : '次へ'} <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;