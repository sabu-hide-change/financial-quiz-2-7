// npm install lucide-react recharts firebase
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { 
  Check, X, Home, ChevronRight, RefreshCw, BarChart2, BookOpen, AlertTriangle, User, History, ArrowRight
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// ============================================================================
// CONFIGURATION & INITIALIZATION
// ============================================================================
const APP_ID = "QuizApp_InvestmentEvaluation_2026";

// Firebase configuration strictly using Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase safely
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// ============================================================================
// ALL DATA CONTEXT FROM DOCUMENT (13 DISTINCT ORIGINAL PROBLEMS REPRODUCED FULLY)
// ============================================================================
const QUIZ_DATA = [
  {
    id: 1,
    title: "問題 1 現在価値",
    year: "スマート問題集 2-7",
    text: "次の資料は、投資プロジェクトAに関するものである。この資料に基づいた場合、投資プロジェクトAの現在価値の値として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、投資プロジェクトAを実行することによって、2年後にキャッシュ・フローが得られる。\n２．キャッシュ・フローが得られるのは、2年後だけである。\n３．2年後に得られるキャッシュ・フローは、121万円である。\n４．割引率は10％である。",
    options: ["80万円", "90万円", "96万円", "100万円", "110万円"],
    answerIndex: 3, // エ: 100万円
    answerLetter: "エ",
    explanation: "将来の資金をC、割引率をr、年数をnとすると、現在価値PVは、次のように計算されます。\nPV ＝ C × 1 / (1 ＋ r)^n\n\nこれに、C ＝ 121万円、r ＝ 0.1を代入すると、次のようになります。\nPV ＝ 121万円 × 1 / (1 ＋ 0.1)^2\n＝ 121万円 ÷ (1.1 × 1.1)\n＝ 121万円 ÷ 1.21\n＝ 100万円\n\nしたがって、投資プロジェクトAの現在価値は、100万円となります。よって、エが適切です。",
    tableType: null
  },
  {
    id: 2,
    title: "問題 2 複利現価係数と年金現価係数",
    year: "スマート問題集 2-7",
    text: "次の資料は、投資プロジェクトBに関するものである。この資料に基づいた場合、投資プロジェクトBの現在価値の値として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、投資プロジェクトBを実行することによって、4年間にわたりキャッシュ・フローが得られる。\n２．キャッシュ・フローは、投資の1年後に始まり、以降1年ごとに得られる。\n３．毎年得られるキャッシュ・フローは、300万円である。\n４．割引率は10％である。\n５．現価係数は、次のとおりである。",
    tableType: "presentValueFactors_1",
    options: ["522万円", "747万円", "951万円", "1,137万円", "1,200万円"],
    answerIndex: 2, // ウ: 951万円
    answerLetter: "ウ",
    explanation: "1年度から4年度の各年のキャッシュ・フローは同額の300万円ですから、割引率10％・4年の年金現価係数である3.17を掛ければ現在価値に換算することができます。\n\nPV ＝ 300 × 3.17 ＝ 951万円\nしたがって、投資プロジェクトBの現在価値は、951万円となります。よって、ウが適切です。\n\n複利現価係数を用いて各年の300万円を現在価値に換算し、それを合計するという手順（300×0.91 + 300×0.83 + 300×0.75 + 300×0.68 = 300×3.17）を踏んでも同様に951万円と求めることができます。",
  },
  {
    id: 3,
    title: "問題 3 フリー・キャッシュ・フロー",
    year: "スマート問題集 2-7",
    text: "次の資料は、当期の営業利益等に関するものである。この資料に基づいた当期のフリー・キャッシュ・フローの値として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．当期の営業利益は、2,000万円である。\n２．実効税率は40％である。\n３．当期の減価償却費は、400万円である。\n４．当期において、運転資本の増減はない。\n５．当期の投資額は、1,000万円である。",
    options: ["200万円", "300万円", "400万円", "500万円", "600万円"],
    answerIndex: 4, // オ: 600万円
    answerLetter: "オ",
    explanation: "営業利益が与えられているので、営業利益を基にした計算を行うと、フリー・キャッシュ・フローは、次のようになります。\nFCF ＝ 営業利益 × （1 － 実効税率) ＋ 減価償却費 － 運転資本増加額 － 投資額\n＝ 2,000 × (1 － 0.4) ＋ 400 － 0 － 1,000\n＝ 2,000 × 0.6 ＋ 400 － 1,000\n＝ 1,200 ＋ 400 － 1,000\n＝ 600万円\n\nしたがって、当期のフリー・キャッシュ・フローは、600万円となります。よって、オが適切です。",
    tableType: null
  },
  {
    id: 4,
    title: "問題 4 投資の評価方法",
    year: "スマート問題集 2-7",
    text: "投資の評価方法に関する説明として、最も不適切なものはどれか。",
    options: [
      "正味現在価値法は、貨幣の時間的価値を考慮する方法であり、正味現在価値がプラスであり、かつ大きいほど、投資案の投資効率がよいと判断される。",
      "内部収益率法は、貨幣の時間的価値を考慮する方法であり、割引率が高いほど、投資案の投資効率がよいと判断される。",
      "回収期間法は、貨幣の時間的価値を考慮しない方法であり、回収期間の短い案ほど、投資案の安全性が高いと判断される。",
      "会計的投資利益率法は、貨幣の時間的価値を考慮しない方法であり、会計的投資利益率が低いほど、投資案の収益性が高いと判断される。"
    ],
    answerIndex: 3, // エが×
    answerLetter: "エ",
    explanation: "会計的投資利益率法とは、投資額に対する会計的な利益の割合を求めて投資案を評価する方法であり、貨幣の時間的価値を考慮しない方法です。しかし、会計的投資利益率法では、会計的投資利益率が「高いほど」、投資案の収益性が高いと判断されます。低いほど収益性が高いとする本肢の記述は不適切です。他肢のア、イ、ウはいずれも正しい説明です。",
    tableType: null
  },
  {
    id: 5,
    title: "問題 5 正味現在価値法",
    year: "スマート問題集 2-7",
    text: "次の資料は投資プロジェクトCに関するものである。この資料に基づいた場合、正味現在価値法により投資プロジェクトCの正味現在価値を求める場合の計算式として、最も不適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、投資プロジェクトCを実行することによって、初期投資額が5,500万円かかる。\n２．現在、投資プロジェクトCを実行することによって、5年間にわたりキャッシュインフローが得られることが予測されている。\n３．5年間に得られるキャッシュ・フローは、次のとおりである。(1年後: 1,000万円, 2年後: 1,000万円, 3年後: 1,000万円, 4年後: 1,000万円, 5年後: 3,000万円)\n４．割引率は10％である。\n５．現価係数は、次のとおりである。",
    tableType: "presentValueFactors_2",
    options: [
      "1,000 × 3.169 ＋ 3,000 × 0.621 － 5,500",
      "1,000 × 3.169 ＋ 3,000 × 0.621",
      "1,000 × 3.790 ＋ (3,000 － 1,000) × 0.621 － 5,500",
      "1,000 × 0.909 ＋ 1,000 × 0.826 ＋ 1,000 × 0.751 ＋ 1,000 × 0.683 ＋ 3,000 × 0.621 － 5,500"
    ],
    answerIndex: 1, // イ: 投資額の控除が漏れている
    answerLetter: "イ",
    explanation: "正味現在価値（NPV）は、将来キャッシュ・フローの現在価値（PV）から初期投資額（I）を控除したものです。「1,000 × 3.169 ＋ 3,000 × 0.621」は将来キャッシュ・フローの現在価値そのものを表しており、投資額5,500万円の控除が行われていないため不適切です。ア、ウ、エはそれぞれ表現方法は異なりますが、いずれも正しいNPV算出式です。",
  },
  {
    id: 6,
    title: "問題 6 新設備購入における営業活動によるキャッシュ・フローの計算",
    year: "スマート問題集 2-7",
    text: "次の資料は、新規設備に対する投資に関して、ある企業のある年度の損益等を示したものである。この年度の営業活動によるキャッシュ・フローの値として、最も適切なものを下記の解答群から選べ。なお、期首や期末に棚卸資産はないものとする。\n\n【資　料】\n１．損益状況：売上高（すべて現金収入）100万円、売上原価（すべて現金支出）40万円、減価償却費以外の販売費及び一般管理費（すべて現金支出）20万円、減価償却費：？万円\n２．新設備を導入する時点は、年度の初めである。\n３．減価償却費は、各年度末に計上される。\n４．実効税率は、40％である。\n５．新設備の価額等：取得原価50万円、残存価額0万円、耐用年数5年、減価償却法は定額法。",
    tableType: "profitAndLossTable",
    options: ["18万円", "22万円", "28万円", "32万円", "42万円"],
    answerIndex: 2, // ウ: 28万円
    answerLetter: "ウ",
    explanation: "①減価償却費 ＝ (50万円 － 0万円) ÷ 5年 ＝ 10万円\n②税引前利益 ＝ 100万円 － 40万円 － (20万円 ＋ 10万円) ＝ 30万円\n③税金 ＝ 30万円 × 40% ＝ 12万円\n④税引後利益 ＝ 30万円 － 12万円 ＝ 18万円\n⑤営業活動によるキャッシュ・フロー ＝ 税引後利益 ＋ 減価償却費 ＝ 18万円 ＋ 10万円 ＝ 28万円。よってウが適切です。",
  },
  {
    id: 7,
    title: "問題 7 取替投資",
    year: "スマート問題集 2-7",
    text: "次の資料は、現行設備（旧設備）を新設備に取り替えるかどうかに関するものである。この資料に基づいた場合、新設備に取り替える時点における投資額（税引き後差額キャッシュフロー）の値として、最も適切なものを下記の解答群から選べ。なお、この企業は、この新設備の取り換えの有無に関わらず、当期純利益は発生しているものとする。\n\n【資　料】\n１．新設備に取り替える時点は、年度の初めである。\n２．取替時に、キャッシュとして売却収入がある。\n３．減価償却費は、各年度末に計上される。\n４．実効税率は、40％である。\n５．設備仕様情報：現行設備（取得原価100万円、残存0、耐用5年、経過2年、売却価額40万円）/ 新設備（取得原価120万円、残存0、耐用3年、定額法）",
    tableType: "replacementTable",
    options: ["－80万円", "－72万円", "－68万円", "68万円", "72万円"],
    answerIndex: 1, // イ: －72万円
    answerLetter: "イ",
    explanation: "①新設備の取得によるキャッシュアウト(COF) ＝ －120万円\n②旧設備の売却によるキャッシュイン(CIF) ＝ ＋40万円\n③旧設備の帳簿価格 ＝ 100万円 － (100万円÷5年×2年) ＝ 60万円\n④旧設備売却損益 ＝ 40万円 － 60万円 ＝ －20万円（売却損20万円）\n⑤売却損に伴う税金減少（タックスシールド） ＝ 20万円 × 40% ＝ ＋8万円\n⑥取替時点の差額キャッシュフロー ＝ －120 ＋ 40 ＋ 8 ＝ －72万円。よってイが適切です。",
  },
  {
    id: 8,
    title: "問題 8 内部収益率法",
    year: "スマート問題集 2-7",
    text: "次の資料は投資プロジェクトDに関するものである。この資料に基づいた内部収益率法に関する記述として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、投資プロジェクトDを実行することによって、初期投資額が100万円かかる。\n２．投資プロジェクトDを実行することによって、1年後にだけキャッシュインフロー（CIF）が得られることが予測されている。\n３．1年後に得られることが予測されているキャッシュインフロー（CIF）は、110万円である。\n４．資本コストは8％である。\n５．税金はないものとする。",
    options: [
      "内部収益率は10％であるので、内部収益率法によると、投資プロジェクトDは実行すべきと判断される。",
      "内部収益率は10％であるので、内部収益率法によると、投資プロジェクトDは実行すべきでないと判断される。",
      "内部収益率は11％であるので、内部収益率法によると、投資プロジェクトDは実行すべきと判断される。",
      "内部収益率は11％であるので、内部収益率法によると、投資プロジェクトDは実行すべきでないと判断される。"
    ],
    answerIndex: 0, // ア
    answerLetter: "ア",
    explanation: "内部収益率（IRR）は正味現在価値（NPV）をゼロとする割引率です。\n0 ＝ 110 × 1/(1+r) － 100  ⇒  100(1+r) ＝ 110  ⇒  100r ＝ 10  ⇒  r ＝ 10%\n内部収益率（10％）が資本コスト（8％）を上回っているため、この投資プロジェクトDは「実行すべき」と判断されます。したがって記述アが適切です。",
    tableType: null
  },
  {
    id: 9,
    title: "問題 9 内部収益率法の特徴",
    year: "スマート問題集 2-7",
    text: "内部収益率法の特徴に関する説明として、最も適切なものはどれか。",
    options: [
      "内部収益率法は、計算が簡単であるという長所を持っている。",
      "内部収益率法では、将来予測されるキャッシュ・フローの符号が2回以上変わったとしても、内部収益率は一つだけに定まるという長所を持っている。",
      "内部収益率法は、投資の規模を考慮するという長所を持っている。",
      "相互排他的投資案を評価する際には、内部収益率法では、収益率は高いが正味現在価値の低い投資案を採択する可能性がある。"
    ],
    answerIndex: 3, // エ
    answerLetter: "エ",
    explanation: "内部収益率法は率（％）を基準とするため、投資の規模（絶対額）を考慮しません。そのため、複数の相互排他的な（どちらか一方しか選べない）投資案を比較する際、率は高いが実額としての正味現在価値（NPV）が極めて低い案件を誤って優先してしまう可能性があります。ア（計算は複雑）、イ（符号変化時は複数解を持つ）、ウ（規模を考慮しない）はすべて誤りです。",
    tableType: null
  },
  {
    id: 10,
    title: "問題 10 回収期間法",
    year: "スマート問題集 2-7",
    text: "次の資料は、投資プロジェクトEに関するものである。この資料に基づき、回収期間法についての記述として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、投資プロジェクトEを実行することによって、初期投資額が2,000万円かかる。\n２．現在、投資プロジェクトEを実行することによって、4年間にわたりキャッシュインフローが得られることが予測されている。\n３．4年間に得られるキャッシュインフローは、次のとおりである。(1年後: 400万円, 2年後: 600万円, 3年後: 800万円, 4年後: 1,000万円)\n４．目標回収期間は3年間である。",
    tableType: "cashFlowPatternTable",
    options: [
      "回収期間は3.2年であるので、回収期間法によると、投資プロジェクトEは実行すべきであると判断される。",
      "回収期間は3.2年であるので、回収期間法によると、投資プロジェクトEは実行すべきでないと判断される。",
      "回収期間は4.0年であるので、回収期間法によると、投資プロジェクトEは実行すべきであると判断される。",
      "回収期間は4.0年であるので、回収期間法によると、投資プロジェクトEは実行すべきでないと判断される。"
    ],
    answerIndex: 1, // イ
    answerLetter: "イ",
    explanation: "キャッシュ・フロー累計は3年後に1,800万円となり、残り200万円を4年目の1,000万円から回収します。\n端数期間 ＝ 200万円 / 1,000万円 ＝ 0.2年  ⇒  合計回収期間 ＝ 3.2年\n実際の回収期間（3.2年）が、企業目標の回収期間（3.0年）を上回って（遅くなって）いるため、投資プロジェクトEは「実行すべきでない」と判断されます。よってイが適切です。",
  },
  {
    id: 11,
    title: "問題 11 回収期間法の特徴",
    year: "スマート問題集 2-7",
    text: "回収期間法の特徴に関する説明として、最も適切なものはどれか。",
    options: [
      "回収期間法は、投資によって将来得られるキャッシュ・フローを現在価値に割引いて評価しており、貨幣の時間的価値を考慮している。",
      "回収期間法により目標となる回収期間が計算されるため、回収期間法は客観的な投資案の評価方法といえる。",
      "回収期間法は、投資を回収した後のキャッシュ・フローを考慮している。",
      "回収期間法は、計算が簡単なので、実務的には多くの中小企業が採用している。"
    ],
    answerIndex: 3, // エ
    answerLetter: "エ",
    explanation: "回収期間法は、貨幣の時間的価値を考慮せず、回収完了後のキャッシュ・フローも一切無視するという理論的欠点があります。しかし、安全性を重視する資金繰りの観点から分かりやすく、何より「計算が非常に簡単」であるため、実務上多くの重要決断を迅速に行う中小企業で広く採用されています。よってエが正しいです。",
    tableType: null
  },
  {
    id: 12,
    title: "問題 12 会計的投資利益率法",
    year: "スマート問題集 2-7",
    text: "次の資料は、投資設備Fに関するものである。この資料に基づき、会計的投資利益率法についての説明として、最も適切なものを下記の解答群から選べ。\n\n【資　料】\n１．現在、設備Fに投資することによって、初期投資額が1,200万円かかる。\n２．設備Fに投資することによって、3年間にわたり利益が得られることが予測されている。\n３．3年間に得られる利益は、次のとおりである。(1年後: 20万円, 2年後: 30万円, 3年後: 40万円)\n４．減価償却は3年間の定額法で、残存価額は0とする。\n５．会計的投資利益率は、平均投資額に対する平均利益の占める割合で計算されるものとする。\n６．目標投資利益率は4％である。",
    tableType: "accountingProfitTable",
    options: [
      "会計的投資利益率は2.5％であるので、会計的投資利益率法によると、投資プロジェクトFは実行すべきであると判断される。",
      "会計的投資利益率は2.5％であるので、会計的投資利益率法によると、投資プロジェクトFは実行すべきでないと判断される。",
      "会計的投資利益率は5％であるので、会計的投資利益率法によると、投資プロジェクトFは実行すべきであると判断される。",
      "会計的投資利益率は5％であるので、会計的投資利益率法によると、投資プロジェクトFは実行すべきでないと判断される。"
    ],
    answerIndex: 2, // ウ
    answerLetter: "ウ",
    explanation: "①会計上の平均利益 ＝ (20万円 ＋ 30万円 ＋ 40万円) ÷ 3年 ＝ 30万円\n②平均投資額 ＝ (初期投資額1,200万円 ＋ 残存価値0万円) ÷ 2 ＝ 600万円 （※3で割るのではなく2で割る点に注意）\n③会計的投資利益率 ＝ 平均利益30万円 ÷ 平均投資額600万円 ＝ 5%\n算出された利益率5％が、目標の投資利益率4％を上回っているため、投資は「実行すべき」と判断されます。よってウが適切です。",
  },
  {
    id: 13,
    title: "問題 13 会計的投資利益率法の特徴",
    year: "スマート問題集 2-7",
    text: "会計的投資利益率法の特徴に関する説明として、最も適切なものはどれか。",
    options: [
      "会計的利益率法は、投資によって将来得られる利益を現在価値に割引いて評価しており、貨幣の時間的価値を考慮している。",
      "会計的利益率法により目標となる会計的利益率が計算されるため、会計的利益率法は客観的な投資案の評価方法といえる。",
      "会計的利益率法は、投資によって将来得られるキャッシュインフローを考慮していない。",
      "会計的利益率法は、計算が非常に複雑である。"
    ],
    answerIndex: 2, // ウ
    answerLetter: "ウ",
    explanation: "会計的投資利益率法は、将来得られる「キャッシュインフロー（現金流入）」ではなく、決算書上の「会計上の利益」を用いて計算する点が最大の特徴であり、かつ現金ベースの回収を無視しているという問題点でもあります。時間価値は考慮しておらず（アは×）、目標利益率は企業が決めるもの（イは×）、計算は極めて容易（エは×）です。",
    tableType: null
  }
];

// ============================================================================
// MAIN REACT COMPONENT
// ============================================================================
export default function App() {
  // State management
  const [passphrase, setPassphrase] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("auth"); // auth, start, quiz, history, stats
  
  // Quiz progress states
  const [selectedQuizMode, setSelectedQuizMode] = useState("all"); // all, wrong, review
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Persistent sync states (loaded and saved to Firestore)
  const [userHistory, setUserHistory] = useState({}); // { questionId: { correct: boolean, timestamp: string } }
  const [reviewFlags, setReviewFlags] = useState({}); // { questionId: boolean }
  const [resumePrompt, setResumePrompt] = useState(null); // { index: number, mode: string }

  // Authenticate and fetch telemetry on entry
  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    if (!passphrase.trim()) return;

    setLoading(true);
    console.log(`[Auth] Attempting login for user phrase: "${passphrase}" under App ID: ${APP_ID}`);
    
    try {
      if (app && db) {
        const authInstance = getAuth(app);
        await signInAnonymously(authInstance);
        console.log("[Auth] Anonymous Firebase sign-in successful.");
        
        // Fetch User Data Doc from Firestore
        const userDocRef = doc(db, APP_ID, passphrase.trim());
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log("[Data Sync] Found existing remote history:", data);
          setUserHistory(data.history || {});
          setReviewFlags(data.reviewFlags || {});
          
          if (typeof data.progressIndex === "number" && data.progressMode) {
            console.log(`[Data Sync] Active suspended session discovered. Index: ${data.progressIndex}, Mode: ${data.progressMode}`);
            setResumePrompt({
              index: data.progressIndex,
              mode: data.progressMode
            });
          }
        } else {
          console.log("[Data Sync] No profile found. Creating a fresh tracking record on first response.");
          setUserHistory({});
          setReviewFlags({});
          setResumePrompt(null);
        }
      } else {
        console.log("[Data Sync] Firebase not active. Proceeding in standalone sandbox fallback mode.");
      }
      setIsAuthorized(true);
      setViewMode("start");
    } catch (err) {
      console.error("[Auth Error] Critical failure during login or data recovery cascade:", err);
      alert("接続に失敗しました。環境変数やネットワーク環境をご確認ください。オフラインモードとして続行します。");
      setIsAuthorized(true);
      setViewMode("start");
    } finally {
      setLoading(false);
    }
  };

  // Synchronize dynamic status updates immediately to avoid lost sessions
  const syncStateToCloud = async (updatedHistory, updatedReviews, indexToSave, modeToSave) => {
    if (!app || !db || !passphrase.trim()) return;
    
    try {
      const userDocRef = doc(db, APP_ID, passphrase.trim());
      const payload = {
        history: updatedHistory || userHistory,
        reviewFlags: updatedReviews || reviewFlags,
        progressIndex: indexToSave,
        progressMode: modeToSave,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(userDocRef, payload, { merge: true });
      console.log(`[Cloud Sync] Saved status successfully. Question Progress index: ${indexToSave}, Mode: ${modeToSave}`);
    } catch (err) {
      console.error("[Cloud Sync Error] Unable to lock data block remotely:", err);
    }
  };

  // Core quiz orchestration triggers
  const startQuizFresh = (mode) => {
    console.log(`[Quiz Setup] Starting new quiz stream under mode filtering criteria: ${mode}`);
    const filtered = applyModeFiltering(mode);
    
    if (filtered.length === 0) {
      alert("選択されたモードに該当する問題が見つかりません。別のモードを選択してください。");
      return;
    }

    setFilteredQuestions(filtered);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setSelectedQuizMode(mode);
    setViewMode("quiz");

    // Persist beginning configuration state
    syncStateToCloud(userHistory, reviewFlags, 0, mode);
  };

  const resumeQuizInterrupted = () => {
    if (!resumePrompt) return;
    console.log(`[Quiz Setup] Reconstituting historical session. Restoring stream index ${resumePrompt.index} under mode context ${resumePrompt.mode}`);
    
    const filtered = applyModeFiltering(resumePrompt.mode);
    if (resumePrompt.index >= filtered.length) {
      console.log("[Quiz Setup] Corruption detected: index overflow. Resetting index pointer securely.");
      startQuizFresh(resumePrompt.mode);
      return;
    }

    setFilteredQuestions(filtered);
    setActiveQuestionIndex(resumePrompt.index);
    setSelectedOption(null);
    setHasAnswered(false);
    setSelectedQuizMode(resumePrompt.mode);
    setResumePrompt(null);
    setViewMode("quiz");
  };

  const cancelResumeAndClear = async () => {
    console.log("[Quiz Setup] Explicit wipe requested by operator. Erasing persistent progress index.");
    setResumePrompt(null);
    if (app && db && passphrase.trim()) {
      try {
        const userDocRef = doc(db, APP_ID, passphrase.trim());
        await updateDoc(userDocRef, {
          progressIndex: 0,
          progressMode: "all"
        });
      } catch (e) {
        console.error("[Data Purge Error] Failed to reset pointer:", e);
      }
    }
  };

  const applyModeFiltering = (mode) => {
    switch (mode) {
      case "wrong":
        return QUIZ_DATA.filter(q => userHistory[q.id] && userHistory[q.id].correct === false);
      case "review":
        return QUIZ_DATA.filter(q => reviewFlags[q.id] === true);
      case "all":
      default:
        return [...QUIZ_DATA];
    }
  };

  // Evaluation logic
  const submitAnswer = (chosenIndex) => {
    if (hasAnswered) return;
    
    setSelectedOption(chosenIndex);
    setHasAnswered(true);
    
    const currentQuestion = filteredQuestions[activeQuestionIndex];
    const isCorrect = chosenIndex === currentQuestion.answerIndex;
    
    console.log(`[Quiz Action] User option choice index: ${chosenIndex}. Target Index matches: ${isCorrect}`);
    
    const nextHistory = {
      ...userHistory,
      [currentQuestion.id]: {
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }
    };
    
    setUserHistory(nextHistory);

    // Save index progress state
    const nextIndex = activeQuestionIndex + 1;
    const isCompleted = nextIndex >= filteredQuestions.length;
    const persistentIndex = isCompleted ? 0 : activeQuestionIndex; // Keep current index as reference if they close before clicking 'Next'

    syncStateToCloud(nextHistory, reviewFlags, persistentIndex, selectedQuizMode);
  };

  const toggleReviewFlag = (questionId) => {
    const nextReviews = {
      ...reviewFlags,
      [questionId]: !reviewFlags[questionId]
    };
    setReviewFlags(nextReviews);
    console.log(`[Quiz Action] Review tracker for Question #${questionId} flipped to: ${nextReviews[questionId]}`);
    syncStateToCloud(userHistory, nextReviews, activeQuestionIndex, selectedQuizMode);
  };

  const proceedToNext = () => {
    const nextIndex = activeQuestionIndex + 1;
    if (nextIndex < filteredQuestions.length) {
      setActiveQuestionIndex(nextIndex);
      setSelectedOption(null);
      setHasAnswered(false);
      // Advance remote tracking
      syncStateToCloud(userHistory, reviewFlags, nextIndex, selectedQuizMode);
    } else {
      console.log("[Quiz Status] Reached the end of the current dataset stream. Terminal completion reached.");
      // Session fully resolved, wipe current progress pointer
      syncStateToCloud(userHistory, reviewFlags, 0, selectedQuizMode);
      setViewMode("stats");
    }
  };

  const exitToDashboard = () => {
    console.log(`[Navigation] Suspending quiz stream gracefully at item position index: ${activeQuestionIndex}`);
    syncStateToCloud(userHistory, reviewFlags, activeQuestionIndex, selectedQuizMode);
    setViewMode("start");
  };

  // Metrics generation engine
  const calculateAggregateStats = () => {
    const TotalQuestionsCount = QUIZ_DATA.length;
    let totalAnswered = 0;
    let correctCount = 0;
    let flaggedCount = 0;

    QUIZ_DATA.forEach(q => {
      if (userHistory[q.id]) {
        totalAnswered++;
        if (userHistory[q.id].correct) correctCount++;
      }
      if (reviewFlags[q.id]) flaggedCount++;
    });

    const accuracyRate = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    return {
      total: TotalQuestionsCount,
      answered: totalAnswered,
      correct: correctCount,
      wrong: totalAnswered - correctCount,
      accuracy: accuracyRate,
      flagged: flaggedCount
    };
  };

  const stats = calculateAggregateStats();

  // Preparation data for Recharts visual assets
  const chartData = [
    { name: "正解", 件数: stats.correct, fill: "#10B981" },
    { name: "不正解", 件数: stats.wrong, fill: "#EF4444" },
    { name: "未着手", 件数: stats.total - stats.answered, fill: "#9CA3AF" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* GLOBAL BANNER HEADER */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => isAuthorized && setViewMode("start")}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-inner">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">スマート問題集：2-7 投資評価</h1>
              <p className="text-xs text-slate-400 font-mono">財務会計・経営工学マスターシステム v1.1.0</p>
            </div>
          </div>
          
          {isAuthorized && (
            <div className="flex items-center gap-3 bg-indigo-900/40 px-4 py-2 rounded-full border border-indigo-700/50">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium tracking-wide">ID: <span className="text-amber-400 font-mono font-bold">{passphrase}</span></span>
              <button 
                onClick={() => { setIsAuthorized(false); setViewMode("auth"); setPassphrase(""); }}
                className="text-xs text-slate-300 hover:text-rose-400 underline pl-2 transition-colors border-l border-slate-700"
              >
                切替
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CORE FRAMEWORK WORKSPACE CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* VIEW 1: AUTHENTICATION AND ID SYNCHRONIZATION BARRIER */}
        {viewMode === "auth" && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-10">
            <div className="p-8 bg-gradient-to-b from-indigo-50 to-transparent">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
                <RefreshCw className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-900">学習履歴の同期・設定</h2>
              <p className="text-slate-600 text-center text-sm mt-2">
                独自の「合言葉」を入力することで、PCやスマートフォン間で学習データや要復習ステータスを安全に共有・復元できます。
              </p>
            </div>
            
            <form onSubmit={handleConnect} className="p-8 pt-0 space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">固有の合言葉 / ユーザーID</label>
                <input 
                  type="text" 
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="例: ryo-shindan-2026" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-indigo-600 transition-colors font-mono tracking-wide"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>同期処理中...</span>
                ) : (
                  <>
                    <span>学習を開始する</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: LAUNCHPAD AND SELECTION INTERFACE */}
        {viewMode === "start" && (
          <div className="space-y-8">
            
            {/* COMPONENT: SUSPENDED SESSION RECOVERY ALERTER */}
            {resumePrompt && (
              <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 p-3 rounded-xl text-white shadow-inner">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-amber-900 font-bold text-lg">前回の途中終了データが見つかりました</h3>
                    <p className="text-amber-800 text-sm mt-1">
                      モード: <span className="font-bold underline">
                        {resumePrompt.mode === "all" ? "すべての問題" : resumePrompt.mode === "wrong" ? "前回不正解の問題のみ" : "要復習の問題のみ"}
                      </span> 
                      &nbsp;|&nbsp; 進捗: <span className="font-bold font-mono">問題 {resumePrompt.index + 1}</span> から中断しています。
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={cancelResumeAndClear}
                    className="flex-1 md:flex-none px-4 py-2 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    最初から始める
                  </button>
                  <button 
                    onClick={resumeQuizInterrupted}
                    className="flex-1 md:flex-none px-5 py-2 bg-amber-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-amber-700 transition-all flex items-center justify-center gap-1"
                  >
                    <span>続きから再開</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* MAIN SYSTEM KPI METRICS DASHBOARD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">総問題数</span>
                <span className="text-3xl font-black text-slate-900 font-mono mt-2">{stats.total}<span className="text-sm font-normal text-slate-400 ml-1">問</span></span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">解答済み</span>
                <span className="text-3xl font-black text-indigo-600 font-mono mt-2">{stats.answered}<span className="text-sm font-normal text-slate-400 ml-1">問</span></span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">正解率 (解答中)</span>
                <span className="text-3xl font-black text-emerald-600 font-mono mt-2">{stats.accuracy}<span className="text-sm font-normal text-slate-400 ml-1">%</span></span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">要復習マーク</span>
                <span className="text-3xl font-black text-rose-500 font-mono mt-2">{stats.flagged}<span className="text-sm font-normal text-slate-400 ml-1 font-sans">問</span></span>
              </div>
            </div>

            {/* SELECTION MODAL CARDS */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">学習モードを選択してください</h3>
                <p className="text-slate-500 text-sm mt-1">目的に応じてクイズの出題範囲を動的に再編成します。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => startQuizFresh("all")}
                  className="group relative bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 text-left hover:border-indigo-600 hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">全</div>
                    <h4 className="font-bold text-slate-900 text-base">すべての問題</h4>
                    <p className="text-xs text-slate-500 mt-2">問題集に収録されているすべての問題（全13問）を最初から順に出題します。</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">選択する <ChevronRight className="w-3 h-3" /></span>
                </button>

                <button
                  onClick={() => startQuizFresh("wrong")}
                  className="group relative bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 text-left hover:border-rose-600 hover:bg-rose-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">誤</div>
                    <h4 className="font-bold text-slate-900 text-base">前回不正解の問題のみ</h4>
                    <p className="text-xs text-slate-500 mt-2">過去にミスした弱点問題を抽出し、効率的なリカバリー走行を行います。</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between w-full">
                    <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-mono font-bold">対象: {QUIZ_DATA.filter(q => userHistory[q.id] && userHistory[q.id].correct === false).length}問</span>
                    <span className="text-xs font-bold text-rose-600 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">選択する <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </button>

                <button
                  onClick={() => startQuizFresh("review")}
                  className="group relative bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 text-left hover:border-amber-500 hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">復</div>
                    <h4 className="font-bold text-slate-900 text-base">要復習の問題のみ</h4>
                    <p className="text-xs text-slate-500 mt-2">解説ページで「要復習」にチェックを入れた、マークアップ済みの重点問題を復習します。</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between w-full">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-mono font-bold">対象: {QUIZ_DATA.filter(q => reviewFlags[q.id] === true).length}問</span>
                    <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">選択する <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setViewMode("history")}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <History className="w-4 h-4" />
                  <span>解答履歴・網羅状況一覧ビュー</span>
                </button>
                <button 
                  onClick={() => setViewMode("stats")}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>チャート分析ダッシュボード</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ACTIVE INTERACTIVE QUESTION SHEET */}
        {viewMode === "quiz" && filteredQuestions[activeQuestionIndex] && (
          <div className="space-y-6">
            
            {/* LIVE QUIZ COMPONENT SUBHEADER CONTROL */}
            <div className="flex justify-between items-center bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-600 text-white font-mono font-black px-3 py-1 text-sm rounded-lg shadow-sm">
                  {activeQuestionIndex + 1} / {filteredQuestions.length} 問目
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide font-mono">
                  [ID: #{filteredQuestions[activeQuestionIndex].id}] {filteredQuestions[activeQuestionIndex].year}
                </span>
              </div>
              <button 
                onClick={exitToDashboard}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-bold"
              >
                <Home className="w-4 h-4" />
                <span>中断して戻る</span>
              </button>
            </div>

            {/* THE QUESTION CARD LAYER */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {filteredQuestions[activeQuestionIndex].title}
                </h2>
              </div>

              {/* CRITICAL TEXT BODY RECONSTRUCTION */}
              <div className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap font-sans">
                {filteredQuestions[activeQuestionIndex].text}
              </div>

              {/* FLOATING INLINE HTML RECONSTRUCTIONS OF SYSTEM TABLES */}
              {filteredQuestions[activeQuestionIndex].tableType === "presentValueFactors_1" && (
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-orange-100 text-orange-950 font-bold border-b border-slate-200">
                        <th className="p-3 border-r border-slate-200">年数</th>
                        <th className="p-3 border-r border-slate-200">複利現価係数 (10%)</th>
                        <th className="p-3">年金現価係数 (10%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr><td className="p-3 border-r border-slate-200 font-sans">1 年</td><td className="p-3 border-r border-slate-200">0.91</td><td className="p-3">0.91</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 border-r border-slate-200 font-sans">2 年</td><td className="p-3 border-r border-slate-200">0.83</td><td className="p-3">1.74</td></tr>
                      <tr><td className="p-3 border-r border-slate-200 font-sans">3 年</td><td className="p-3 border-r border-slate-200">0.75</td><td className="p-3">2.49</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 border-r border-slate-200 font-sans">4 年</td><td className="p-3 border-r border-slate-200">0.68</td><td className="p-3 font-bold text-indigo-600 bg-indigo-50/50">3.17</td></tr>
                      <tr><td className="p-3 border-r border-slate-200 font-sans">5 年</td><td className="p-3 border-r border-slate-200">0.62</td><td className="p-3">3.79</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {filteredQuestions[activeQuestionIndex].tableType === "presentValueFactors_2" && (
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-orange-100 text-orange-950 font-bold border-b border-slate-200">
                        <th className="p-3 border-r border-slate-200">年数</th>
                        <th className="p-3 border-r border-slate-200">複利現価係数 (10%)</th>
                        <th className="p-3">年金現価係数 (10%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr><td className="p-3 border-r border-slate-200 font-sans">1 年</td><td className="p-3 border-r border-slate-200">0.909</td><td className="p-3">0.909</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 border-r border-slate-200 font-sans">2 年</td><td className="p-3 border-r border-slate-200">0.826</td><td className="p-3">1.735</td></tr>
                      <tr><td className="p-3 border-r border-slate-200 font-sans">3 年</td><td className="p-3 border-r border-slate-200">0.751</td><td className="p-3">2.486</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 border-r border-slate-200 font-sans">4 年</td><td className="p-3 border-r border-slate-200">0.683</td><td className="p-3">3.169</td></tr>
                      <tr><td className="p-3 border-r border-slate-200 font-sans">5 年</td><td className="p-3 border-r border-slate-200">0.621</td><td className="p-3">3.790</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {filteredQuestions[activeQuestionIndex].tableType === "profitAndLossTable" && (
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <tbody className="divide-y divide-slate-200">
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200">売上高（すべて現金収入）</td><td className="p-3 font-mono text-right">100 万円</td></tr>
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200">売上原価（すべて現金支出）</td><td className="p-3 font-mono text-right">40 万円</td></tr>
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200">減価償却費以外の販売費及び一般管理費（すべて現金支出）</td><td className="p-3 font-mono text-right">20 万円</td></tr>
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200">減価償却費</td><td className="p-3 font-mono text-right text-indigo-600 font-bold">？ 万円</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {filteredQuestions[activeQuestionIndex].tableType === "replacementTable" && (
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-orange-100 text-orange-950 font-bold border-b border-slate-200">
                        <th className="p-3 border-r border-slate-200">項目</th>
                        <th className="p-3 border-r border-slate-200">現行設備 (旧型)</th>
                        <th className="p-3">新設備 (新型)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">取得原価</td><td className="p-3 border-r border-slate-200">100 万円</td><td className="p-3">120 万円</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">残存価額</td><td className="p-3 border-r border-slate-200">0 万円</td><td className="p-3">0 万円</td></tr>
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">耐用年数</td><td className="p-3 border-r border-slate-200">5 年</td><td className="p-3">3 年</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">減価償却法</td><td className="p-3 border-r border-slate-200 font-sans">定額法</td><td className="p-3 font-sans">定額法</td></tr>
                      <tr><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">新設備への取替時経過年数</td><td className="p-3 border-r border-slate-200">2 年</td><td className="p-3 text-slate-400">—</td></tr>
                      <tr className="bg-slate-50"><td className="p-3 font-semibold bg-slate-50 border-r border-slate-200 font-sans">取替時売却価額</td><td className="p-3 border-r border-slate-200">40 万円</td><td className="p-3 text-slate-400">—</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* SELECTION INTERACTIVE ROW COMPONENT */}
              <div className="space-y-3 pt-4">
                {filteredQuestions[activeQuestionIndex].options.map((option, idx) => {
                  const letterMapping = ["ア", "イ", "ウ", "エ", "オ"];
                  const currentLetter = letterMapping[idx] || "";
                  
                  let buttonStyle = "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800";
                  
                  if (hasAnswered) {
                    if (idx === filteredQuestions[activeQuestionIndex].answerIndex) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm";
                    } else if (idx === selectedOption) {
                      buttonStyle = "border-rose-500 bg-rose-50 text-rose-900";
                    } else {
                      buttonStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => submitAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${buttonStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 font-mono ${
                        hasAnswered && idx === filteredQuestions[activeQuestionIndex].answerIndex 
                          ? "bg-emerald-500 text-white" 
                          : hasAnswered && idx === selectedOption 
                            ? "bg-rose-500 text-white" 
                            : "bg-slate-100 text-slate-600"
                      }`}>
                        {currentLetter}
                      </span>
                      <span className="text-sm font-medium leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REAL-TIME COMPREHENSIVE EXPLANATION DRAWER */}
            {hasAnswered && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 space-y-6 animate-slide-up">
                
                {/* JUSTIFICATION NOTIFIER BLOCK */}
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  selectedOption === filteredQuestions[activeQuestionIndex].answerIndex
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {selectedOption === filteredQuestions[activeQuestionIndex].answerIndex ? (
                    <Check className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold">
                      {selectedOption === filteredQuestions[activeQuestionIndex].answerIndex ? "正解です！" : "不正解です"}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">
                      正解: <span className="font-mono font-bold">{filteredQuestions[activeQuestionIndex].answerLetter}</span> - {filteredQuestions[activeQuestionIndex].options[filteredQuestions[activeQuestionIndex].answerIndex]}
                    </p>
                  </div>
                </div>

                {/* CRITICAL CONTEXT SHIELD CONTROLLER BUTTON */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="review-toggle"
                      checked={!!reviewFlags[filteredQuestions[activeQuestionIndex].id]}
                      onChange={() => toggleReviewFlag(filteredQuestions[activeQuestionIndex].id)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="review-toggle" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                      この問題を「要復習」に指定して保存する
                    </label>
                  </div>
                  {reviewFlags[filteredQuestions[activeQuestionIndex].id] && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-bold">マーク中</span>
                  )}
                </div>

                {/* COMPREHENSIVE RAW TECHNICAL EXPLANATION TEXT */}
                <div className="space-y-3">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>解説（重要知識の確認）</span>
                  </h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 p-5 rounded-xl border border-slate-100">
                    {filteredQuestions[activeQuestionIndex].explanation}
                  </p>
                </div>

                {/* GRAPHICAL RECONSTRUCTION FOR QUESTION 6 SPECIALLY MAPPED FROM SOURCE DOC DIAGRAM */}
                {filteredQuestions[activeQuestionIndex].id === 6 && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase font-mono block">【参考：キャッシュフロー構造図】</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      <div className="col-span-2 border-2 border-slate-300 rounded p-2 bg-white space-y-1">
                        <div className="bg-slate-100 p-1 text-slate-700">売上原価: 40万円</div>
                        <div className="bg-slate-100 p-1 text-slate-700">現金販管費: 20万円</div>
                        <div className="bg-indigo-100 border border-indigo-300 p-1 text-indigo-800">減価償却費: 10万円 (非現金費用)</div>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          <div className="bg-red-50 text-red-700 p-1 border border-red-200">税金: 12万円 (40%)</div>
                          <div className="bg-emerald-50 text-emerald-800 p-1 border border-emerald-200">税引後利益: 18万円</div>
                        </div>
                      </div>
                      <div className="bg-indigo-600 text-white rounded p-2 flex flex-col justify-center items-center font-bold">
                        <div>現金売上高</div>
                        <div className="text-base font-mono font-black mt-2">100万円</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      ※ 営業活動によるキャッシュ・フロー ＝ 税引後利益 (18万円) ＋ 減価償却費 (10万円) ＝ 28万円
                    </p>
                  </div>
                )}

                {/* FOOTER ACTION STAGE ADVANCER */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={proceedToNext}
                    className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md group"
                  >
                    <span>
                      {activeQuestionIndex + 1 < filteredQuestions.length ? "次の問題へ進む" : "結果画面へ進む"}
                    </span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: DETAILED COVERAGE AUDIT & HISTORICAL TRACKING GRID */}
        {viewMode === "history" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">解答履歴・網羅状況一覧</h2>
                <p className="text-slate-500 text-sm mt-0.5">全13問に対する過去の正誤記録と要復習マークを同期確認できます。</p>
              </div>
              <button 
                onClick={() => setViewMode("start")}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors shrink-0"
              >
                ホームへ戻る
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3 font-mono w-16">ID</th>
                    <th className="p-3">問題タイトル</th>
                    <th className="p-3 w-28 text-center">前回の結果</th>
                    <th className="p-3 w-24 text-center">要復習</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {QUIZ_DATA.map((q) => {
                    const status = userHistory[q.id];
                    const isFlagged = !!reviewFlags[q.id];
                    
                    return (
                      <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono text-slate-400 font-bold">#{q.id}</td>
                        <td className="p-3 font-medium text-slate-900">{q.title}</td>
                        <td className="p-3 text-center">
                          {status ? (
                            status.correct ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                                <Check className="w-3 h-3" /> 正解
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-200">
                                <X className="w-3 h-3" /> 不正解
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400 text-xs italic">未着手</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => toggleReviewFlag(q.id)}
                            className={`p-1 rounded transition-colors ${isFlagged ? "text-amber-500 hover:text-amber-600" : "text-slate-300 hover:text-slate-400"}`}
                          >
                            <AlertTriangle className="w-5 h-5 mx-auto fill-current" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: STATISTICS VISUALIZATION & ANALYTICS DASHBOARD */}
        {viewMode === "stats" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">チャート分析ダッシュボード</h2>
                <p className="text-slate-500 text-sm mt-0.5">現在の学習の網羅状況をデータ可視化エンジンで分析します。</p>
              </div>
              <button 
                onClick={() => setViewMode("start")}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors shrink-0"
              >
                ホームへ戻る
              </button>
            </div>

            {/* CHARTS CONTAINER LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* RECHARTS COMPONENT INTEGRATION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-64 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-sans mb-2 block">進捗バランス比率</span>
                <div className="w-full h-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      <Bar dataKey="件数" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DETAILED SCORE CARD AND RECOMMENDATION SUMMARY */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider font-sans">総括ステータス報告</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="p-4 flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">現在の総合正解率</span>
                    <span className="font-mono font-bold text-emerald-600 text-base">{stats.accuracy}%</span>
                  </div>
                  <div className="p-4 flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">正解数 / 解答数</span>
                    <span className="font-mono font-bold text-slate-900">{stats.correct} / {stats.answered} 問</span>
                  </div>
                  <div className="p-4 flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">残りの未着手設問</span>
                    <span className="font-mono font-bold text-slate-400">{stats.total - stats.answered} 問</span>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs leading-relaxed text-indigo-950">
                  <span className="font-bold block mb-1">💡 推奨アドバイス:</span>
                  {stats.answered === 0 ? (
                    "まずは「すべての問題」モードからスタートし、投資評価に関する現在価値や複利現価、タックスシールドなどの基本知識パターンを一周網羅しましょう。"
                  ) : stats.accuracy < 70 ? (
                    "計算式の代入ミスや会計上の利益とキャッシュフローの混同が見られます。間違えた問題だけを再度絞り込んで演習し、基本知識の定着を図りましょう。"
                  ) : (
                    "優れた理解度を維持しています！要復習マークを付けた特定問題のブラッシュアップを行い、いつでも100%の解答が再現できるように最終調整を行いましょう。"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* SYSTEM BOTTOM FOOTER REGION */}
      <footer className="mt-20 border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-400 font-mono tracking-wide">
        &copy; 2026 Smart Question Bank Interactive Learning Engine. All Rights Reserved.
      </footer>
    </div>
  );
}