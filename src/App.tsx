"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type Level = "初級" | "中級";
type QuizType = "まるばつ" | "4択" | "2択" | "穴埋め" | "用語";
interface Riddle {
  level: Level;
  type: QuizType;
  q: string;
  a: string;
  hint: string;
  choices?: string[];
}
interface AnswerLog {
  riddle: Riddle;
  userAnswer: string;
  correct: boolean;
}

const RIDDLES: Riddle[] = [
  // ===== 初級 TypeScript基礎 まるばつ =====
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptはJavaScriptに型システムを追加した言語である",
    a: "〇",
    hint: "MicrosoftがJavaScriptのスーパーセットとして開発。静的型付けでコンパイル時にエラーを検出",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptのコードはブラウザで直接実行できる",
    a: "✗",
    hint: "TypeScriptはトランスパイルしてJavaScriptに変換する必要がある",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "constで宣言した変数は再代入できる",
    a: "✗",
    hint: "constは定数宣言。ただしオブジェクトや配列のプロパティ・要素は変更可能",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "letで宣言した変数は再代入できる",
    a: "〇",
    hint: "letはブロックスコープの変数宣言で、再代入が可能",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptではvarよりもletやconstの使用が推奨される",
    a: "〇",
    hint: "varは関数スコープで巻き上げが起きるため、バグの原因になりやすい",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "テンプレートリテラルはシングルクォートで囲む",
    a: "✗",
    hint: "バッククォート（`）で囲む。${変数名}で変数を埋め込める",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptのany型を使うと型チェックが無効になる",
    a: "〇",
    hint: "any型はどんな値でも受け入れ型チェックをバイパスする。使用は最小限に",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "interfaceはオブジェクトの形状を定義するために使う",
    a: "〇",
    hint: "プロパティと型の設計図。型の安全性を保証する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "nullとundefinedはTypeScriptでは同じ意味である",
    a: "✗",
    hint: "nullは「値がないことを明示」、undefinedは「値がまだ割り当てられていない」",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptのunion型は複数の型のうちいずれか1つを取れる",
    a: "〇",
    hint: "string | number のように | で繋ぐ",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptの型推論により明示的に型注釈を書かなくても型が決まることがある",
    a: "〇",
    hint: "let x = 10 と書くとTypeScriptは自動的にxをnumber型と推論する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptのenumは定数の集合を定義する機能である",
    a: "〇",
    hint: "enum Color { Red, Green, Blue } のように関連する定数をグループ化",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "===は値と型の両方を比較する厳密等価演算子である",
    a: "〇",
    hint: "==は型変換を行うが、===は型変換なしで比較する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "分割代入を使うとオブジェクトのプロパティを変数に取り出せる",
    a: "〇",
    hint: "const { name, age } = person; のように書く",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "TypeScriptのstrictモードを有効にするとより厳密な型チェックが行われる",
    a: "〇",
    hint: "tsconfig.jsonでstrict: true。Team KPTでも使用している",
  },
  // ===== 初級 TypeScript基礎 4択 =====
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptで文字列型を表すキーワードはどれか？",
    a: "B",
    choices: ["A: String", "B: string", "C: str", "D: text"],
    hint: "プリミティブ型は小文字で書く。Stringは非推奨のラッパーオブジェクト型",
  },
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptで数値型を表すキーワードはどれか？",
    a: "C",
    choices: ["A: int", "B: float", "C: number", "D: num"],
    hint: "intやfloatの区別がなく、すべての数値はnumber型",
  },
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptの論理値型はどれか？",
    a: "A",
    choices: ["A: boolean", "B: bool", "C: Boolean", "D: logical"],
    hint: "trueまたはfalseの値を取る。Booleanはラッパーオブジェクト型",
  },
  {
    level: "初級",
    type: "4択",
    q: "アロー関数の正しい書き方はどれか？",
    a: "D",
    choices: [
      "A: function => (x) { return x }",
      "B: (x) -> x * 2",
      "C: (x) >> x * 2",
      "D: (x) => x * 2",
    ],
    hint: "(引数) => 式 の形。=> はアロー演算子",
  },
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptで型注釈を付ける記号はどれか？",
    a: "B",
    choices: ["A: =", "B: :", "C: ::", "D: ->"],
    hint: "コロン(:)を使う。例: let name: string = 'Tom'",
  },
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptで配列の型を表す書き方はどれか？",
    a: "A",
    choices: ["A: string[]", "B: string{}", "C: string()", "D: string<>"],
    hint: "型名[]と書く。Array<string>という書き方もある",
  },
  {
    level: "初級",
    type: "4択",
    q: "typeof 42 の結果は？",
    a: "C",
    choices: ["A: 'int'", "B: 'integer'", "C: 'number'", "D: 'Number'"],
    hint: "typeof演算子は値の型を文字列で返す",
  },
  {
    level: "初級",
    type: "4択",
    q: "オプショナルなプロパティを表す記号はどれか？",
    a: "B",
    choices: ["A: !", "B: ?", "C: *", "D: &"],
    hint: "プロパティ名の後に?を付けると省略可能になる",
  },
  {
    level: "初級",
    type: "4択",
    q: "正しいunion型の書き方はどれか？",
    a: "A",
    choices: [
      "A: string | number",
      "B: string & number",
      "C: string + number",
      "D: string , number",
    ],
    hint: "|（パイプ）で結合。&はintersection型で別の概念",
  },
  {
    level: "初級",
    type: "4択",
    q: "TypeScriptでvoid型が使われる場面はどれか？",
    a: "C",
    choices: [
      "A: null値を表す",
      "B: 空の配列を表す",
      "C: 戻り値がない関数を表す",
      "D: 未定義の変数を表す",
    ],
    hint: "function log(msg: string): void のように使う",
  },
  {
    level: "初級",
    type: "4択",
    q: "スプレッド構文の正しい使い方はどれか？",
    a: "D",
    choices: ["A: *array", "B: &array", "C: @array", "D: ...array"],
    hint: "...（ドット3つ）で配列やオブジェクトを展開する",
  },
  {
    level: "初級",
    type: "4択",
    q: "async関数の戻り値の型は何か？",
    a: "A",
    choices: ["A: Promise", "B: Future", "C: Observable", "D: Callback"],
    hint: "async関数は必ずPromiseを返す",
  },
  {
    level: "初級",
    type: "4択",
    q: "console.log()の用途は？",
    a: "B",
    choices: [
      "A: 画面に文字を表示する",
      "B: コンソールにログを出力する",
      "C: ファイルに書き込む",
      "D: アラートを表示する",
    ],
    hint: "ブラウザの開発者ツールやターミナルにメッセージを出力する",
  },
  // ===== 初級 WebSocket基礎 まるばつ =====
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketはHTTPと同じく一方向通信である",
    a: "✗",
    hint: "WebSocketは双方向通信。サーバーからもクライアントからも自由にデータを送受信できる",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketはリアルタイムチャットやオンラインゲームに適している",
    a: "〇",
    hint: "低遅延の双方向通信が必要なアプリケーションに最適",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocket接続は毎回新しく確立する必要がある",
    a: "✗",
    hint: "持続的な接続。一度接続すると明示的に閉じるまで維持される",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketではサーバーからクライアントにプッシュ通知を送れる",
    a: "〇",
    hint: "サーバーがクライアントのリクエストを待たずにデータをプッシュできる",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketのメッセージはテキストデータのみ送信できる",
    a: "✗",
    hint: "テキストとバイナリの両方を送信できる。Team KPTではJSON文字列を使用",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTではWebSocketで付箋をリアルタイムに同期している",
    a: "〇",
    hint: "付箋の作成・移動・更新・削除をWebSocketで全参加者へ配信",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocket通信は暗号化されているのでセキュリティ対策は不要",
    a: "✗",
    hint: "ws://は暗号化なし。暗号化にはwss://（TLS/SSL）を使う必要がある",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketはファイアウォールやプロキシに遮断されることがある",
    a: "〇",
    hint: "一部のファイアウォールはWebSocketをブロックする。wss://で通過しやすくなる",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "HTTPのポーリングはWebSocketより効率的である",
    a: "✗",
    hint: "ポーリングは無駄な通信が発生する。WebSocketは必要な時だけデータを送る",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTではルームごとにWebSocket通信を分けている",
    a: "〇",
    hint: "Map<roomId, Set<WsClient>>でルームごとにクライアントを管理",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "ブロードキャストとは接続中の全クライアントにメッセージを送ること",
    a: "〇",
    hint: "Team KPTでは同じルーム内の全参加者に付箋の変更を配信",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocketはステートレスなプロトコルである",
    a: "✗",
    hint: "ステートフル。接続が維持され状態を保持する。HTTPがステートレス",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "WebSocket接続中にネットワークが切断されると自動的に再接続される",
    a: "✗",
    hint: "自動再接続機能はない。手動で再接続ロジックを実装する必要がある",
  },
  // ===== 初級 WebSocket基礎 4択 =====
  {
    level: "初級",
    type: "4択",
    q: "WebSocketのURLスキームはどれか？",
    a: "C",
    choices: ["A: http://", "B: tcp://", "C: ws://", "D: socket://"],
    hint: "ws://（暗号化なし）またはwss://（暗号化あり）を使う",
  },
  {
    level: "初級",
    type: "4択",
    q: "WebSocket接続はまず何のプロトコルでハンドシェイクするか？",
    a: "A",
    choices: ["A: HTTP", "B: TCP", "C: FTP", "D: SMTP"],
    hint: "HTTPリクエストから始まりUpgradeヘッダーで切り替える",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTで使用しているWebSocketライブラリはどれか？",
    a: "B",
    choices: ["A: Socket.IO", "B: ws", "C: WebSocket API", "D: Primus"],
    hint: "Node.js用の軽量WebSocketライブラリ「ws」を使用",
  },
  {
    level: "初級",
    type: "4択",
    q: "WebSocket接続が閉じられるイベント名は？",
    a: "D",
    choices: ["A: disconnect", "B: end", "C: terminate", "D: close"],
    hint: "closeイベントで接続終了を検知する",
  },
  {
    level: "初級",
    type: "4択",
    q: "ブラウザでWebSocket接続を作成するコードはどれか？",
    a: "A",
    choices: [
      "A: new WebSocket('ws://...')",
      "B: WebSocket.connect('ws://...')",
      "C: fetch('ws://...')",
      "D: http.upgrade('ws://...')",
    ],
    hint: "new WebSocket(url)で接続を作成する",
  },
  {
    level: "初級",
    type: "4択",
    q: "WebSocketでメッセージを送信するメソッド名は？",
    a: "C",
    choices: ["A: emit()", "B: post()", "C: send()", "D: write()"],
    hint: "send()メソッドで送信。emit()はSocket.IO独自",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTのWebSocketメッセージの送信形式はどれか？",
    a: "B",
    choices: ["A: XML", "B: JSON", "C: CSV", "D: Protocol Buffers"],
    hint: "JSON.stringify()で文字列化し、JSON.parse()で復元",
  },
  {
    level: "初級",
    type: "4択",
    q: "WebSocketでメッセージ受信するイベント名は？",
    a: "A",
    choices: ["A: message", "B: data", "C: receive", "D: incoming"],
    hint: "ws.on('message', callback)でメッセージを受信",
  },
  {
    level: "初級",
    type: "4択",
    q: "サーバー側でWebSocket接続時に発生するイベントは？",
    a: "D",
    choices: ["A: request", "B: join", "C: handshake", "D: connection"],
    hint: "wss.on('connection', (ws) => {...})で検知",
  },
  {
    level: "初級",
    type: "4択",
    q: "WebSocket接続状態「接続済み」を表す定数は？",
    a: "B",
    choices: [
      "A: WebSocket.CONNECTING",
      "B: WebSocket.OPEN",
      "C: WebSocket.CLOSING",
      "D: WebSocket.CLOSED",
    ],
    hint: "OPEN(1)が接続済み。CONNECTING(0)/CLOSING(2)/CLOSED(3)",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTでWebSocketサーバーはどこで起動しているか？",
    a: "A",
    choices: [
      "A: server.ts（カスタムサーバー）",
      "B: pages/api/socket.ts",
      "C: next.config.js",
      "D: package.json",
    ],
    hint: "server.tsでHTTPサーバーを作成しWebSocketServerをアタッチ",
  },
  {
    level: "初級",
    type: "4択",
    q: "wss://が使用する暗号化技術はどれか？",
    a: "C",
    choices: ["A: SSH", "B: VPN", "C: TLS/SSL", "D: IPsec"],
    hint: "HTTPSと同じTLS/SSLで暗号化",
  },
  // ===== 初級 プロジェクト技術スタック まるばつ =====
  {
    level: "初級",
    type: "まるばつ",
    q: "Next.jsはReactベースのフルスタックフレームワークである",
    a: "〇",
    hint: "SSR、ルーティング、API機能などを提供する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "better-sqlite3は非同期（async/await）で動作する",
    a: "✗",
    hint: "同期的に動作する。awaitは不要でシンプルに使える",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "bcryptjsはパスワードを平文のまま保存する",
    a: "✗",
    hint: "ハッシュ化して保存する。一方向の変換で元に戻せない",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Next.jsのApp Routerではファイルの配置がURLルーティングになる",
    a: "〇",
    hint: "src/app/内のフォルダ構造がURLパスに対応する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Reactコンポーネントは関数として定義できる",
    a: "〇",
    hint: "現代のReactでは関数コンポーネントが主流",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "useEffectは副作用を処理するフックである",
    a: "〇",
    hint: "データ取得、DOM操作、タイマー設定などに使う",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTのNode.jsバージョンは20である",
    a: "〇",
    hint: "DockerfileやCI/CDワークフローでNode.js 20が指定されている",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "ESLintはコードのフォーマット（見た目）だけをチェックする",
    a: "✗",
    hint: "品質や潜在的なバグもチェックする。未使用変数なども検出",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "「use client」ディレクティブはクライアント側レンダリングを示す",
    a: "〇",
    hint: "App Routerではデフォルトがサーバーコンポーネント",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTではAI（Claude API）で振り返りの要約を生成できる",
    a: "〇",
    hint: "@anthropic-ai/sdkでClaude APIと連携している",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Tailwind CSSではクラス名を使ってスタイルを適用する",
    a: "〇",
    hint: "bg-blue-500、text-white、p-4などのユーティリティクラス",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTでは画像エクスポートでボードをPNG保存できる",
    a: "〇",
    hint: "html-to-imageライブラリでPNG画像としてエクスポート",
  },
  // ===== 初級 プロジェクト技術スタック 4択 =====
  {
    level: "初級",
    type: "4択",
    q: "Team KPTで使用しているデータベースはどれか？",
    a: "D",
    choices: [
      "A: MySQL",
      "B: PostgreSQL",
      "C: MongoDB",
      "D: SQLite（better-sqlite3）",
    ],
    hint: "軽量で設定不要なファイルベースRDBMS",
  },
  {
    level: "初級",
    type: "4択",
    q: "パスワードのハッシュ化に使うライブラリはどれか？",
    a: "A",
    choices: ["A: bcryptjs", "B: crypto", "C: argon2", "D: sha256"],
    hint: "ルームパスワードをbcryptjsでハッシュ化",
  },
  {
    level: "初級",
    type: "4択",
    q: "ユニークID生成に使うライブラリはどれか？",
    a: "C",
    choices: ["A: uuid", "B: crypto", "C: nanoid", "D: shortid"],
    hint: "短くURLセーフなユニークIDを生成する",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTのCSSフレームワークはどれか？",
    a: "B",
    choices: [
      "A: Bootstrap",
      "B: Tailwind CSS",
      "C: Material UI",
      "D: Chakra UI",
    ],
    hint: "Tailwind CSS v4を使用",
  },
  {
    level: "初級",
    type: "4択",
    q: "Reactで状態管理に使うフックはどれか？",
    a: "A",
    choices: ["A: useState", "B: useEffect", "C: useRef", "D: useMemo"],
    hint: "const [count, setCount] = useState(0) の形で使う",
  },
  {
    level: "初級",
    type: "4択",
    q: "コンポーネント間でデータを渡す仕組みはどれか？",
    a: "C",
    choices: ["A: state", "B: context", "C: props", "D: ref"],
    hint: "親から子コンポーネントに属性として渡す",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTでテストに使うフレームワークはどれか？",
    a: "D",
    choices: ["A: Jest", "B: Mocha", "C: Jasmine", "D: Vitest"],
    hint: "Viteベースの高速なテストフレームワーク",
  },
  {
    level: "初級",
    type: "4択",
    q: "SQLiteの特徴として正しいものは？",
    a: "C",
    choices: [
      "A: サーバーが必要",
      "B: ネットワーク経由アクセス",
      "C: ファイルベースの軽量DB",
      "D: NoSQLデータベース",
    ],
    hint: "サーバー不要、1ファイルにDB全体が格納される",
  },
  {
    level: "初級",
    type: "4択",
    q: "JSXとは何か？",
    a: "B",
    choices: [
      "A: JavaScriptの新バージョン",
      "B: JavaScript内でHTMLライクな構文を書ける拡張",
      "C: JSONの拡張形式",
      "D: Javaのフレームワーク",
    ],
    hint: "ReactでHTMLのようなコードを書ける構文拡張",
  },
  {
    level: "初級",
    type: "4択",
    q: "Markdownの表示に使うライブラリはどれか？",
    a: "A",
    choices: [
      "A: react-markdown",
      "B: marked",
      "C: markdown-it",
      "D: showdown",
    ],
    hint: "AI要約のMarkdownをReactコンポーネントでレンダリング",
  },
  // ===== 初級 CI/CD まるばつ =====
  {
    level: "初級",
    type: "まるばつ",
    q: "CI/CDのCIは「Continuous Integration」の略である",
    a: "〇",
    hint: "コード変更を頻繁にメインブランチに統合し自動テストを実行する",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Dockerはアプリケーションをコンテナとしてパッケージ化する技術",
    a: "〇",
    hint: "どの環境でも同じように動作させる",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "GitHub Actionsのワークフローは.github/workflows/にYAMLで定義",
    a: "〇",
    hint: "ci.ymlやdeploy-staging.ymlなどがある",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "PRはコード変更をレビューしてもらうための仕組みである",
    a: "〇",
    hint: "マージ前にチームメンバーにレビューしてもらう",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTではPR作成時にAIによる自動コードレビューが行われる",
    a: "〇",
    hint: "claude-code-review.ymlでClaude AIが自動レビュー",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "git pushはローカルの変更をリモートリポジトリに送信する",
    a: "〇",
    hint: "GitHubなどのリモートにコミットを送信",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "YAMLはインデントで階層構造を表現する形式である",
    a: "〇",
    hint: "通常スペース2個で階層を表現",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "healthcheckエンドポイントはアプリの正常動作確認用である",
    a: "〇",
    hint: "/healthzで{ status: 'ok' }を返す",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "環境変数はアプリの設定値を外部から注入する仕組みである",
    a: "〇",
    hint: "APIキーやDB設定をコードに直接書かずに管理",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: ".gitignoreに記載されたファイルはgitの管理対象外になる",
    a: "〇",
    hint: "data/やnode_modules/などが除外される",
  },
  // ===== 初級 CI/CD 4択 =====
  {
    level: "初級",
    type: "4択",
    q: "Team KPTで使用しているCI/CDサービスは？",
    a: "B",
    choices: ["A: Jenkins", "B: GitHub Actions", "C: CircleCI", "D: Travis CI"],
    hint: "GitHub ActionsでCI/CDパイプラインを構築",
  },
  {
    level: "初級",
    type: "4択",
    q: "Dockerfileとは何か？",
    a: "A",
    choices: [
      "A: Dockerイメージのビルド手順を記述するファイル",
      "B: Dockerコンテナのログファイル",
      "C: Dockerの設定ファイル",
      "D: Dockerのネットワーク設定",
    ],
    hint: "ベースイメージ、ファイルコピー、コマンド実行などを記述",
  },
  {
    level: "初級",
    type: "4択",
    q: "gitでブランチを作成するコマンドは？",
    a: "C",
    choices: [
      "A: git new branch",
      "B: git create branch",
      "C: git branch",
      "D: git make branch",
    ],
    hint: "git branch <名前>で作成",
  },
  {
    level: "初級",
    type: "4択",
    q: "CI/CDのCDは何の略か？",
    a: "D",
    choices: [
      "A: Code Delivery",
      "B: Code Deployment",
      "C: Continuous Development",
      "D: Continuous Delivery/Deployment",
    ],
    hint: "コード変更を自動的にリリースするプラクティス",
  },
  {
    level: "初級",
    type: "4択",
    q: "git commitの役割は？",
    a: "B",
    choices: [
      "A: ファイルをサーバーにアップロード",
      "B: 変更をローカルリポジトリに記録",
      "C: ファイルを削除",
      "D: ブランチをマージ",
    ],
    hint: "変更をローカルに記録するコマンド",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTのDockerベースイメージは？",
    a: "C",
    choices: ["A: ubuntu", "B: debian", "C: node:20-alpine", "D: node:20"],
    hint: "Alpineは軽量なLinuxディストリビューション",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTの開発サーバー起動コマンドは？",
    a: "A",
    choices: [
      "A: npm run dev",
      "B: npm start",
      "C: npm run serve",
      "D: node server.js",
    ],
    hint: "内部的にtsx server.tsを実行",
  },
  {
    level: "初級",
    type: "4択",
    q: "npm run buildは何をする？",
    a: "C",
    choices: [
      "A: 開発サーバー起動",
      "B: テスト実行",
      "C: プロダクション用ビルド",
      "D: 依存パッケージインストール",
    ],
    hint: "Next.jsの最適化・バンドル・コンパイルを行う",
  },
  {
    level: "初級",
    type: "4択",
    q: "git logの役割は？",
    a: "D",
    choices: [
      "A: 差分を表示",
      "B: 現在の変更状態を表示",
      "C: 特定コミットの詳細表示",
      "D: コミット履歴を表示",
    ],
    hint: "コミット履歴を一覧表示する",
  },
  {
    level: "初級",
    type: "4択",
    q: "Team KPTのデプロイ先クラウドは？",
    a: "B",
    choices: ["A: Google Cloud", "B: AWS", "C: Azure", "D: Vercel"],
    hint: "EC2+SSMでデプロイ",
  },
  // ===== 中級 TypeScript応用 穴埋め =====
  {
    level: "中級",
    type: "穴埋め",
    q: "型を定義するキーワードは type と ___ の2つがある",
    a: "interface",
    hint: "interfaceはextendsで継承できる点が特徴",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "値がnullでないことを表明する演算子は ___ である",
    a: "!",
    hint: "非nullアサーション演算子。実行時チェックはないので注意",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "TypeScriptの設定ファイル名は ___ である",
    a: "tsconfig.json",
    hint: "コンパイルオプション、パスエイリアスなどを設定",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "tsconfig.jsonでパスエイリアスを設定するオプションは ___",
    a: "paths",
    hint: "@/*をsrc/*に対応させるなど",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "文字列配列のジェネリクス表記は Array<___> である",
    a: "string",
    hint: "Array<string>はstring[]と同じ",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "デフォルトエクスポートの受け取り構文は import ___ from 'module'",
    a: "名前",
    hint: "任意の名前で受け取れる。名前付きは import { name } from",
  },
  // ===== 中級 TypeScript応用 用語 =====
  {
    level: "中級",
    type: "用語",
    q: "オブジェクト型のキーの型を取得するキーワードは？",
    a: "keyof",
    hint: "keyof演算子はキーをunion型として取得する",
  },
  {
    level: "中級",
    type: "用語",
    q: "...を付けて可変長引数を受け取る機能を何というか？",
    a: "レストパラメータ",
    hint: "...argsのように書き、引数を配列として受け取れる",
  },
  {
    level: "中級",
    type: "用語",
    q: "Type['key']で型のプロパティ型を取り出す構文は？",
    a: "インデックスアクセス型",
    hint: "User['name']でnameプロパティの型を取得",
  },
  {
    level: "中級",
    type: "用語",
    q: "T extends U ? X : Y の構文を何というか？",
    a: "条件型",
    hint: "Conditional Type。条件に応じて異なる型を返す",
  },
  // ===== 中級 TypeScript応用 まるばつ =====
  {
    level: "中級",
    type: "まるばつ",
    q: "TypeScriptのジェネリクスは型をパラメータとして受け取る仕組みである",
    a: "〇",
    hint: "<T>のように型パラメータを使い、使う側で具体的な型を指定",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "as構文はランタイムで型変換を行う",
    a: "✗",
    hint: "コンパイル時のみの型情報上書き。実行時には何も変換しない",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "unknown型はany型と同様にどんな操作も型チェックなしで実行できる",
    a: "✗",
    hint: "unknown型は型を絞り込まないと操作できない。より安全なany",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "Nullish Coalescing(??)は左辺がnullまたはundefinedの場合に右辺を返す",
    a: "〇",
    hint: "||と違い、0や空文字は左辺値として返される",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "as constを使うとリテラル型として推論される",
    a: "〇",
    hint: "const assertionで最も狭い型（リテラル型）として推論",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "readonly T[] と ReadonlyArray<T> は同じ意味である",
    a: "〇",
    hint: "書き方が異なるだけで同じ読み取り専用配列型",
  },
  // ===== 中級 TypeScript応用 4択 =====
  {
    level: "中級",
    type: "4択",
    q: "すべてのプロパティをオプショナルにするユーティリティ型は？",
    a: "A",
    choices: [
      "A: Partial<T>",
      "B: Required<T>",
      "C: Readonly<T>",
      "D: Pick<T, K>",
    ],
    hint: "Required<T>は逆にすべてを必須にする",
  },
  {
    level: "中級",
    type: "4択",
    q: "const arr = [1, 'hello', true] の型は？",
    a: "C",
    choices: [
      "A: number[]",
      "B: string[]",
      "C: (number | string | boolean)[]",
      "D: any[]",
    ],
    hint: "異なる型の要素があるとunion型の配列",
  },
  {
    level: "中級",
    type: "4択",
    q: "型ガードの正しい例はどれか？",
    a: "B",
    choices: [
      "A: if (x is string)",
      "B: if (typeof x === 'string')",
      "C: if (x.type === string)",
      "D: if (x instanceof 'string')",
    ],
    hint: "typeof演算子で条件分岐すると型が自動的に絞り込まれる",
  },
  {
    level: "中級",
    type: "4択",
    q: "never型はどんな場面で使われるか？",
    a: "D",
    choices: [
      "A: null値を表す",
      "B: undefined値を表す",
      "C: 空の配列を表す",
      "D: 到達不能なコードや網羅性チェック",
    ],
    hint: "switch文のexhaustive checkに使う",
  },
  {
    level: "中級",
    type: "4択",
    q: "type A = { x: number } & { y: string } の結果は？",
    a: "C",
    choices: [
      "A: { x: number }",
      "B: { y: string }",
      "C: { x: number; y: string }",
      "D: エラー",
    ],
    hint: "&（intersection型）は両方の型を結合する",
  },
  {
    level: "中級",
    type: "4択",
    q: "Optional Chaining演算子はどれか？",
    a: "B",
    choices: ["A: !!", "B: ?.", "C: ??", "D: &&"],
    hint: "null/undefinedの場合にエラーにならずundefinedを返す",
  },
  {
    level: "中級",
    type: "4択",
    q: "Enumのデフォルト値はどうなるか？",
    a: "A",
    choices: [
      "A: 0から始まる連番",
      "B: 1から始まる連番",
      "C: 文字列",
      "D: undefined",
    ],
    hint: "Red=0, Green=1, Blue=2のように連番が割り当てられる",
  },
  {
    level: "中級",
    type: "4択",
    q: "Omit<T, K>は何をするか？",
    a: "B",
    choices: [
      "A: プロパティを追加",
      "B: キーKを除外",
      "C: 全てオプショナル化",
      "D: 共通プロパティ取得",
    ],
    hint: "Omit<User, 'password'>でpasswordを除いた型を作れる",
  },
  {
    level: "中級",
    type: "4択",
    q: "satisfies演算子の役割は？",
    a: "D",
    choices: [
      "A: 型を変換",
      "B: 型をキャスト",
      "C: 型を拡張",
      "D: 型の互換性検証しつつ推論を保持",
    ],
    hint: "TS 4.9で追加。asと違い推論を保持する",
  },
  // ===== 中級 TypeScript応用 2択 =====
  {
    level: "中級",
    type: "2択",
    q: "Record<string, number>の意味はどちらか？",
    a: "A",
    choices: [
      "A: キーがstring、値がnumberのオブジェクト型",
      "B: stringとnumberのunion型",
    ],
    hint: "Record<K, V>はキーK、値Vのオブジェクト型",
  },
  {
    level: "中級",
    type: "2択",
    q: "型定義ファイルの拡張子はどちらか？",
    a: "A",
    choices: ["A: .d.ts", "B: .types.ts"],
    hint: ".d.tsはTypeScriptの型定義ファイル",
  },
  {
    level: "中級",
    type: "2択",
    q: "readonlyはランタイムでも保護されるか？",
    a: "A",
    choices: ["A: コンパイル時のみ", "B: ランタイムでも保護"],
    hint: "ランタイムで不変にするにはObject.freezeが必要",
  },
  {
    level: "中級",
    type: "2択",
    q: "関数オーバーロードで実装シグネチャは外部から呼び出せるか？",
    a: "B",
    choices: ["A: 呼び出せる", "B: 呼び出せない"],
    hint: "外部からはオーバーロードシグネチャの型だけ使える",
  },
  // ===== 中級 WebSocket応用 穴埋め =====
  {
    level: "中級",
    type: "穴埋め",
    q: "クライアントがルームに参加するメッセージタイプは ___",
    a: "join",
    hint: "サーバーはjoinedメッセージで応答する",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "空のルームが自動クリーンアップされるまでの待機時間は___秒",
    a: "30",
    hint: "一時的な切断からの復帰に対応するグレース期間",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "他の参加者の入室を通知するメッセージタイプは ___",
    a: "participant:joined",
    hint: "退室時はparticipant:left",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "リアクション送信のメッセージタイプは ___",
    a: "reaction:send",
    hint: "サーバーはreaction:firedで全員にブロードキャスト",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "付箋のサイズ変更メッセージタイプは ___",
    a: "note:resize",
    hint: "widthとheightを更新する",
  },
  // ===== 中級 WebSocket応用 用語 =====
  {
    level: "中級",
    type: "用語",
    q: "WebSocketで接続維持のために定期送受信するデータを何と呼ぶ？",
    a: "ping",
    hint: "ping/pongで接続が生きていることを確認",
  },
  {
    level: "中級",
    type: "用語",
    q: "全クライアントにメッセージを送信する処理パターンは？",
    a: "ブロードキャスト",
    hint: "Team KPTでは同一ルーム内でブロードキャスト",
  },
  {
    level: "中級",
    type: "用語",
    q: "データなしで接続確認するWebSocketフレームタイプは？",
    a: "制御フレーム",
    hint: "ping、pong、closeが制御フレーム",
  },
  // ===== 中級 WebSocket応用 まるばつ =====
  {
    level: "中級",
    type: "まるばつ",
    q: "Team KPTではJSON.stringify()でメッセージを文字列化して送信している",
    a: "〇",
    hint: "受信側でJSON.parse()で復元する",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "WebSocketサーバーはNext.jsとは別のプロセスで動作している",
    a: "✗",
    hint: "server.tsで同一プロセス内で両方動かしている",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "WebSocketメッセージ型はTypeScriptの判別共用体で定義されている",
    a: "〇",
    hint: "typeプロパティで判別する共用体型",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "clamp()関数で座標やサイズの範囲を制限している",
    a: "〇",
    hint: "不正な値の注入を防ぐセキュリティ対策",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "WebSocketは同一オリジンポリシーの制約を受ける",
    a: "✗",
    hint: "WebSocket自体はSame-Origin Policyの制約を受けない",
  },
  // ===== 中級 WebSocket応用 4択 =====
  {
    level: "中級",
    type: "4択",
    q: "ルーム内のクライアント管理に使うデータ構造は？",
    a: "C",
    choices: [
      "A: Array<WsClient>",
      "B: Object<WsClient>",
      "C: Map<string, Set<WsClient>>",
      "D: Record<string, WsClient[]>",
    ],
    hint: "ルームIDをキーにSet<WsClient>で管理",
  },
  {
    level: "中級",
    type: "4択",
    q: "WebSocket接続時のHTTPステータスコードは？",
    a: "B",
    choices: [
      "A: 200 OK",
      "B: 101 Switching Protocols",
      "C: 301 Redirect",
      "D: 204 No Content",
    ],
    hint: "プロトコルがHTTPからWebSocketに切り替わる",
  },
  {
    level: "中級",
    type: "4択",
    q: "付箋の位置を更新するメッセージタイプは？",
    a: "C",
    choices: [
      "A: note:update",
      "B: note:change",
      "C: note:move",
      "D: note:position",
    ],
    hint: "note:moveは位置専用。note:updateはテキスト内容の更新",
  },
  {
    level: "中級",
    type: "4択",
    q: "重なり順序を変更するメッセージタイプは？",
    a: "A",
    choices: [
      "A: note:bringToFront",
      "B: note:zIndex",
      "C: note:layer",
      "D: note:top",
    ],
    hint: "z_index値を更新して最前面に移動",
  },
  {
    level: "中級",
    type: "4択",
    q: "タイマー機能のメッセージタイプの組み合わせは？",
    a: "D",
    choices: [
      "A: timer:set / timer:stop",
      "B: timer:begin / timer:end",
      "C: timer:on / timer:off",
      "D: timer:start / timer:pause / timer:resume / timer:reset",
    ],
    hint: "4つの操作でタイマーを制御",
  },
  {
    level: "中級",
    type: "4択",
    q: "BGMトラック数はいくつか？",
    a: "C",
    choices: ["A: 3曲", "B: 5曲", "C: 9曲", "D: 12曲"],
    hint: "calm, focus, upbeat, samba, nature, jazz, chill, piano, bossa",
  },
  {
    level: "中級",
    type: "4択",
    q: "WebSocketの正常終了ステータスコードは？",
    a: "A",
    choices: ["A: 1000", "B: 1001", "C: 1006", "D: 1011"],
    hint: "1000は正常終了。1006は異常切断",
  },
  {
    level: "中級",
    type: "4択",
    q: "useWebSocketフックが提供する主な機能は？",
    a: "A",
    choices: [
      "A: 接続管理・メッセージ送受信・再接続",
      "B: HTTPリクエスト管理",
      "C: ローカルストレージ管理",
      "D: ルーティング管理",
    ],
    hint: "WebSocket接続のライフサイクル全体を管理",
  },
  // ===== 中級 WebSocket応用 2択 =====
  {
    level: "中級",
    type: "2択",
    q: "WebSocketハンドシェイクに使うHTTPヘッダーは？",
    a: "A",
    choices: ["A: Upgrade: websocket", "B: Content-Type: websocket"],
    hint: "Connection: Upgradeも一緒に送信される",
  },
  {
    level: "中級",
    type: "2択",
    q: "カーソル位置共有機能はあるか？",
    a: "A",
    choices: ["A: ある（cursor:move）", "B: ない"],
    hint: "CursorOverlayコンポーネントで表示",
  },
  {
    level: "中級",
    type: "2択",
    q: "付箋の削除と復元の両方に対応しているか？",
    a: "A",
    choices: ["A: 対応（note:delete / note:restore）", "B: 削除のみ"],
    hint: "useUndoRedoフックでUndo/Redo機能を実現",
  },
  // ===== 中級 アーキテクチャ 穴埋め =====
  {
    level: "中級",
    type: "穴埋め",
    q: "クライアントコンポーネントを宣言するディレクティブは '___'",
    a: "use client",
    hint: "ファイルの先頭に書く",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "参加者IDはnanoidで___文字で生成される",
    a: "8",
    hint: "ノートIDは12文字",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "パスワードハッシュを保存するカラム名は ___",
    a: "password_hash",
    hint: "bcryptjsでハッシュ化して保存",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "ヘルスチェックのパスは /___",
    a: "healthz",
    hint: "{ status: 'ok' }を返す",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "パスエイリアス @/ は ___ ディレクトリに対応",
    a: "src/",
    hint: "tsconfig.jsonのpathsで設定",
  },
  // ===== 中級 アーキテクチャ 用語 =====
  {
    level: "中級",
    type: "用語",
    q: "Undo・Redo機能の操作履歴管理パターンは？",
    a: "Undo/Redo",
    hint: "useUndoRedoカスタムフックでreducerパターンを使用",
  },
  {
    level: "中級",
    type: "用語",
    q: "URLパスの動的な部分を角括弧で定義するNext.jsの仕組みは？",
    a: "動的ルーティング",
    hint: "[roomId]のようにフォルダ名を囲む",
  },
  {
    level: "中級",
    type: "用語",
    q: "再描画をまたいで値を保持するが再描画トリガーにならないフックは？",
    a: "useRef",
    hint: "DOM参照やタイマーIDの保持に使われる",
  },
  {
    level: "中級",
    type: "用語",
    q: "SQLを事前コンパイルして高速化する仕組みは？",
    a: "プリペアドステートメント",
    hint: "db.prepare(sql)で使用",
  },
  // ===== 中級 アーキテクチャ まるばつ =====
  {
    level: "中級",
    type: "まるばつ",
    q: "API Routesでルーム作成やAI要約機能を提供している",
    a: "〇",
    hint: "POST /api/roomsやPOST /api/rooms/[roomId]/summarize",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "react-markdownとrehype-sanitizeでXSS攻撃を防止している",
    a: "〇",
    hint: "HTMLサニタイズで悪意あるコードを除去",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "ローカルストレージに最近参加したルーム履歴を保存している",
    a: "〇",
    hint: "useRecentRoomsカスタムフックで管理",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "付箋にはz_index（重なり順序）のプロパティがある",
    a: "〇",
    hint: "note:bringToFrontで最前面に移動できる",
  },
  // ===== 中級 アーキテクチャ 4択 =====
  {
    level: "中級",
    type: "4択",
    q: "WALモードが有効な理由は？",
    a: "B",
    choices: [
      "A: データ暗号化",
      "B: 読み書きの並行処理性能向上",
      "C: データ圧縮",
      "D: バックアップ",
    ],
    hint: "Write-Ahead Loggingで並行読み書きが可能",
  },
  {
    level: "中級",
    type: "4択",
    q: "notesテーブルに含まれないカラムは？",
    a: "D",
    choices: ["A: pos_x", "B: z_index", "C: author_name", "D: priority"],
    hint: "priorityカラムは存在しない",
  },
  {
    level: "中級",
    type: "4択",
    q: "AI要約（単一セッション）で使用するClaudeモデルは？",
    a: "B",
    choices: [
      "A: claude-opus-4-6",
      "B: claude-haiku-4-5-20251001",
      "C: claude-sonnet-4-6",
      "D: claude-3-opus",
    ],
    hint: "haiku（高速・低コスト）を使用。定期レビューはsonnet",
  },
  {
    level: "中級",
    type: "4択",
    q: "画像エクスポートに使うライブラリは？",
    a: "C",
    choices: [
      "A: canvas",
      "B: puppeteer",
      "C: html-to-image",
      "D: dom-to-image",
    ],
    hint: "toPng関数でDOM要素をPNG変換",
  },
  {
    level: "中級",
    type: "4択",
    q: "コンポーネント数（src/components/）は約何個か？",
    a: "C",
    choices: ["A: 5個", "B: 10個", "C: 16個", "D: 25個"],
    hint: "BoardHeader, StickyNote, Timer, CursorOverlay等",
  },
  {
    level: "中級",
    type: "4択",
    q: "カスタムフックの数はいくつか？",
    a: "B",
    choices: ["A: 3個", "B: 5個", "C: 8個", "D: 10個"],
    hint: "useWebSocket, useUndoRedo, useRecentRooms等",
  },
  {
    level: "中級",
    type: "4択",
    q: "サーバーのデフォルトポート番号は？",
    a: "A",
    choices: ["A: 3000", "B: 8080", "C: 5000", "D: 4000"],
    hint: "環境変数PORTで変更可能",
  },
  // ===== 中級 アーキテクチャ 2択 =====
  {
    level: "中級",
    type: "2択",
    q: "KPTボードの3つのカラムはどちらか？",
    a: "A",
    choices: ["A: Keep / Problem / Try", "B: Good / Bad / Next"],
    hint: "Keep（続ける）Problem（課題）Try（試す）",
  },
  {
    level: "中級",
    type: "2択",
    q: "DBで外部キー制約は有効か？",
    a: "A",
    choices: ["A: 有効（PRAGMA foreign_keys = ON）", "B: 無効"],
    hint: "notesテーブルのroom_idがroomsを参照",
  },
  {
    level: "中級",
    type: "2択",
    q: "AI要約に入力制限はあるか？",
    a: "A",
    choices: ["A: ある（ノート数200、文字数20,000等）", "B: ない"],
    hint: "APIコストとレスポンス速度のバランス",
  },
  {
    level: "中級",
    type: "2択",
    q: "DBテスト時はどちらの方式か？",
    a: "A",
    choices: ["A: インメモリDB", "B: テスト用ファイルDB"],
    hint: "Vitestでインメモリ(:memory:)を使用",
  },
  // ===== 中級 CI/CD応用 穴埋め =====
  {
    level: "中級",
    type: "穴埋め",
    q: "AWS認証で使用するOIDCの正式名称は ___",
    a: "OpenID Connect",
    hint: "シークレットキーなしで安全に認証できる",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "Dockerイメージのアーキテクチャは ___",
    a: "ARM64",
    hint: "Docker buildxでlinux/arm64向けにビルド",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "claude.ymlは ___ メンション時にトリガーされる",
    a: "@claude",
    hint: "IssueやPRのコメントで記述",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "better-sqlite3のビルドに必要なC++コンパイラは ___",
    a: "g++",
    hint: "python3, make, g++の3つが必要",
  },
  // ===== 中級 CI/CD応用 用語 =====
  {
    level: "中級",
    type: "用語",
    q: "GitHub Actionsで自動実行される処理の定義を何というか？",
    a: "ワークフロー",
    hint: ".github/workflows/にYAMLで定義",
  },
  {
    level: "中級",
    type: "用語",
    q: "Dockerでビルドを複数段階に分ける手法は？",
    a: "マルチステージビルド",
    hint: "deps→builder→runnerの3段階で最終イメージを小さく",
  },
  // ===== 中級 CI/CD応用 まるばつ =====
  {
    level: "中級",
    type: "まるばつ",
    q: "CIワークフローではlint、テスト、ビルドの3ステップが実行される",
    a: "〇",
    hint: "npm ci → lint → test → build の順",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "デプロイワークフローにconcurrencyグループが設定されている",
    a: "〇",
    hint: "同じブランチへの同時デプロイを防止する",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "npm ciはpackage-lock.jsonに基づいて正確な依存をインストールする",
    a: "〇",
    hint: "lock fileを厳密に再現。CI環境に適している",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "DockerイメージをS3にアップロードしてデプロイしている",
    a: "〇",
    hint: ".tar形式でS3アップ、EC2がダウンロードしてロード",
  },
  // ===== 中級 CI/CD応用 4択 =====
  {
    level: "中級",
    type: "4択",
    q: "Dockerビルドで使用しているビルド戦略は？",
    a: "A",
    choices: [
      "A: マルチステージビルド",
      "B: シングルステージビルド",
      "C: キャッシュレスビルド",
      "D: インクリメンタルビルド",
    ],
    hint: "deps→builder→runnerの3段階",
  },
  {
    level: "中級",
    type: "4択",
    q: "EC2へのコマンド実行に使うAWSサービスは？",
    a: "A",
    choices: [
      "A: AWS SSM",
      "B: AWS SSH Direct",
      "C: AWS Lambda",
      "D: AWS CodeDeploy",
    ],
    hint: "SSMでSSH鍵管理不要にコマンド実行",
  },
  {
    level: "中級",
    type: "4択",
    q: "自動コードレビューで無視されるファイルは？",
    a: "D",
    choices: [
      "A: src/",
      "B: .github/",
      "C: tsconfig.json",
      "D: package-lock.json",
    ],
    hint: "package-lock.json, data/, docs/, imagesが除外",
  },
  {
    level: "中級",
    type: "4択",
    q: "issue-to-pr.ymlのトリガーは？",
    a: "C",
    choices: [
      "A: issue作成時",
      "B: issueコメント時",
      "C: 'ready'ラベル付与時",
      "D: issueクローズ時",
    ],
    hint: "自動的にブランチとドラフトPRを作成",
  },
  {
    level: "中級",
    type: "4択",
    q: "AIコードレビューで最も深刻な重要度の絵文字は？",
    a: "A",
    choices: ["A: 🔴", "B: 🟡", "C: 🟢", "D: ✅"],
    hint: "🔴（重大）🟡（警告）✅（問題なし）の3段階",
  },
  {
    level: "中級",
    type: "4択",
    q: "Dockerランタイムに必要な共有ライブラリは？",
    a: "C",
    choices: ["A: libc", "B: libpython3", "C: libstdc++", "D: libssl"],
    hint: "better-sqlite3がC++標準ライブラリを必要とする",
  },
  {
    level: "中級",
    type: "4択",
    q: "GitHub Actionsで実行環境を指定するキーは？",
    a: "B",
    choices: ["A: os:", "B: runs-on:", "C: platform:", "D: env:"],
    hint: "runs-on: ubuntu-latest のように指定",
  },
  // ===== 中級 CI/CD応用 2択 =====
  {
    level: "中級",
    type: "2択",
    q: "issue-to-prのブランチ名形式はどちらか？",
    a: "A",
    choices: ["A: feature/{issue-number}-{slug}", "B: issue-{issue-number}"],
    hint: "タイトルからスラッグを生成",
  },
  {
    level: "中級",
    type: "2択",
    q: "デプロイ後のヘルスチェック方法は？",
    a: "A",
    choices: ["A: /healthzへのHTTPリクエスト", "B: SSHでプロセス確認"],
    hint: "自動化されたHTTPヘルスチェック",
  },
  // ===== 追加問題（200問到達用）=====
  {
    level: "初級",
    type: "まるばつ",
    q: "package.jsonはプロジェクトの依存関係やスクリプトを管理するファイルである",
    a: "〇",
    hint: "Node.jsプロジェクトの設定ファイル",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "npm run lintはコードの品質チェックを実行するコマンドである",
    a: "〇",
    hint: "ESLintを実行して構文エラーやベストプラクティス違反を検出",
  },
  {
    level: "初級",
    type: "4択",
    q: "依存パッケージをインストールするnpmコマンドは？",
    a: "B",
    choices: ["A: npm get", "B: npm install", "C: npm add", "D: npm download"],
    hint: "package.jsonに記載されたパッケージをインストール",
  },
  {
    level: "初級",
    type: "4択",
    q: "Reactでコンポーネントを定義するのに使うのは？",
    a: "A",
    choices: ["A: function", "B: class のみ", "C: module", "D: template"],
    hint: "現代のReactでは関数コンポーネントが主流",
  },
  {
    level: "初級",
    type: "まるばつ",
    q: "Team KPTのKPTとはKeep・Problem・Tryの略である",
    a: "〇",
    hint: "振り返りで使われるフレームワーク。続けること・課題・試すことの3カテゴリ",
  },
  {
    level: "中級",
    type: "穴埋め",
    q: "GitHub Actionsで環境変数を共有する機能は GitHub ___",
    a: "Variables",
    hint: "ワークフロー間の設定値を共有",
  },
  {
    level: "中級",
    type: "4択",
    q: "参加者に自動的に割り当てられるものは？",
    a: "A",
    choices: [
      "A: カラー（色）",
      "B: アバター画像",
      "C: ニックネーム",
      "D: ロール",
    ],
    hint: "join counterのmoduloで色パレットから割り当て",
  },
  {
    level: "中級",
    type: "まるばつ",
    q: "Team KPTのタイマーにはBGM機能が搭載されている",
    a: "〇",
    hint: "timer:changeBgmメッセージでBGMトラックを切り替え可能",
  },
  {
    level: "中級",
    type: "2択",
    q: "定期レビュー（複数セッション分析）に使うClaudeモデルは？",
    a: "B",
    choices: ["A: claude-haiku-4-5-20251001", "B: claude-sonnet-4-6"],
    hint: "単一セッション要約にはhaiku、定期レビューにはsonnetを使用",
  },
];

const VARIANTS: Record<string, string[]> = {
  interface: ["Interface", "インターフェース"],
  "!": ["!（エクスクラメーション）", "エクスクラメーション"],
  "tsconfig.json": ["tsconfig"],
  paths: ["compilerOptions.paths"],
  string: ["String"],
  名前: ["任意の名前", "変数名", "識別子"],
  keyof: ["keyof演算子"],
  レストパラメータ: [
    "rest parameter",
    "rest parameters",
    "rest",
    "レスト引数",
    "残余引数",
  ],
  インデックスアクセス型: [
    "Indexed Access Type",
    "ルックアップ型",
    "Lookup Type",
  ],
  条件型: [
    "Conditional Type",
    "conditional type",
    "条件付き型",
    "コンディショナル型",
  ],
  join: ["JOIN"],
  "30": ["30秒"],
  "participant:joined": ["participant joined"],
  "reaction:send": ["reaction send"],
  "note:resize": ["note resize"],
  ping: ["ping/pong", "ピンポン", "ハートビート", "heartbeat"],
  ブロードキャスト: ["broadcast", "ブロードキャスティング"],
  制御フレーム: ["control frame", "コントロールフレーム"],
  "use client": ['"use client"', "'use client'"],
  "8": ["8文字"],
  password_hash: ["passwordhash", "password hash"],
  healthz: ["/healthz"],
  "src/": ["src", "./src/", "./src/*"],
  "Undo/Redo": ["undo/redo", "アンドゥリドゥ", "アンドゥ・リドゥ"],
  動的ルーティング: [
    "Dynamic Routing",
    "ダイナミックルーティング",
    "動的ルート",
    "ダイナミックルート",
  ],
  useRef: ["useRef()"],
  プリペアドステートメント: ["prepared statement", "Prepared Statement"],
  "OpenID Connect": ["openid connect", "OIDC"],
  ARM64: ["arm64", "aarch64", "linux/arm64"],
  "@claude": ["claude"],
  "g++": ["gcc", "c++コンパイラ", "G++"],
  ワークフロー: ["workflow", "Workflow"],
  マルチステージビルド: ["multi-stage build", "Multi-stage build"],
  Variables: ["variables", "Environments", "environments"],
  〇: ["o", "○", "まる", "yes", "true"],
  "✗": ["x", "×", "ばつ", "no", "false"],
  A: ["a"],
  B: ["b"],
  C: ["c"],
  D: ["d"],
};

const TYPE_CONFIG: Record<string, { emoji: string; color: string[] }> = {
  まるばつ: { emoji: "⭕", color: ["#1FA2FF", "#12D8FA"] },
  "4択": { emoji: "🎯", color: ["#0f3443", "#34e89e"] },
  "2択": { emoji: "🔀", color: ["#4776E6", "#8E54E9"] },
  穴埋め: { emoji: "🔲", color: ["#00d2ff", "#3a7bd5"] },
  用語: { emoji: "💡", color: ["#f953c6", "#b91d73"] },
};

const LEVEL_COLOR: Record<string, string> = {
  初級: "#34e89e",
  中級: "#f7971e",
};
const TOTAL_SEC = 3 * 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
    s % 60
  ).padStart(2, "0")}`;
}
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0)
    )
    .replace(/[\u30A1-\u30F6]/g, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) - 0x60)
    )
    .replace(/\s+/g, " ")
    .trim();
}
function judge(input: string, correct: string): boolean {
  const i = normalize(input),
    c = normalize(correct);
  if (i === c) return true;
  const variants = VARIANTS[correct] || [];
  return variants.some((v: string) => normalize(v) === i);
}

export default function App(): React.ReactElement | null {
  const [filterLevel, setFilterLevel] = useState<string>("全部");
  const [deck, setDeck] = useState<Riddle[]>(() => shuffle(RIDDLES));
  const [idx, setIdx] = useState<number>(0);
  const [phase, setPhase] = useState<string>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SEC);
  const [correct, setCorrect] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [logs, setLogs] = useState<AnswerLog[]>([]);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong">("wrong");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cur = deck[idx % deck.length];
  const cfg = TYPE_CONFIG[cur.type];
  const [c1, c2] = cfg.color;
  const pct = timeLeft / TOTAL_SEC;
  const timerColor =
    timeLeft > 90 ? "#34e89e" : timeLeft > 30 ? "#f7971e" : "#FF6B9D";
  const R = 28,
    CIRC = 2 * Math.PI * R;

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t: number) => {
        if (t <= 1) {
          clearInterval(timerRef.current ?? undefined);
          setPhase("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current ?? undefined);
  }, [phase]);

  const start = () => {
    const filtered =
      filterLevel === "全部"
        ? RIDDLES
        : RIDDLES.filter((r: Riddle) => r.level === filterLevel);
    setDeck(shuffle(filtered));
    setPhase("running");
    setTimeLeft(TOTAL_SEC);
    setIdx(0);
    setInput("");
    setResult(null);
    setCorrect(0);
    setTotal(0);
    setLogs([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submitAnswer = useCallback(
    (ans: string) => {
      if (!ans.trim()) return;
      const ok = judge(ans, cur.a);
      setInput(ans);
      setResult(ok ? "correct" : "wrong");
      setTotal((t: number) => t + 1);
      if (ok) setCorrect((c: number) => c + 1);
      setLogs((l: AnswerLog[]) => [
        ...l,
        { riddle: cur, userAnswer: ans, correct: ok },
      ]);
    },
    [cur]
  );

  const submit = useCallback(() => {
    submitAnswer(input);
  }, [input, submitAnswer]);

  const next = useCallback(() => {
    setIdx((i: number) => i + 1);
    setInput("");
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const resultRef = useRef<"correct" | "wrong" | null>(null);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (resultRef.current === null) submit();
      else next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, next]);

  const getAnswerLabel = (a: string, riddle?: Riddle): string => {
    if (a === "〇") return "〇（正しい）";
    if (a === "✗") return "✗（誤り）";
    if (riddle?.choices) {
      const keys = ["A", "B", "C", "D"];
      const i = keys.indexOf(a.toUpperCase());
      if (i >= 0 && riddle.choices[i]) {
        return `${a}: ${riddle.choices[i].replace(/^[A-D]: /, "")}`;
      }
    }
    return a;
  };

  const getPlaceholder = (): string => {
    if (cur.type === "まるばつ") return "〇 または ✗";
    if (cur.type === "4択") return "A / B / C / D";
    if (cur.type === "2択") return "A / B";
    return "答えを入力…";
  };

  const scoreMsg =
    correct >= 15
      ? "Team KPT マスター🔥"
      : correct >= 8
      ? "なかなかやりますね💪"
      : "もっと練習だ😊";
  const displayLogs =
    reviewFilter === "wrong" ? logs.filter((l: AnswerLog) => !l.correct) : logs;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#020818,#0a1628,#0f2033)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI',sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 34 }}>🤖</div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 900,
            margin: "4px 0 2px",
            background:
              "linear-gradient(90deg,#00d2ff,#3a7bd5,#34e89e,#f7971e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Team KPT Tech Quiz
        </h1>
        <p style={{ fontSize: 11, color: "#4a6a7a", margin: 0 }}>
          TypeScript / WebSocket / CI/CD — 3分タイマー制
        </p>
        <p style={{ fontSize: 10, color: "#00d2ff", margin: "2px 0 0" }}>
          全{RIDDLES.length}問（初級
          {RIDDLES.filter((r: Riddle) => r.level === "初級").length}・中級
          {RIDDLES.filter((r: Riddle) => r.level === "中級").length}）
        </p>
      </div>

      {phase !== "idle" && (
        <div
          style={{
            position: "relative",
            width: 68,
            height: 68,
            marginBottom: 10,
          }}
        >
          <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="34"
              cy="34"
              r={R}
              fill="none"
              stroke="#0a1628"
              strokeWidth="6"
            />
            <circle
              cx="34"
              cy="34"
              r={R}
              fill="none"
              stroke={timerColor}
              strokeWidth="6"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear,stroke 0.5s" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: timerColor,
                lineHeight: 1,
              }}
            >
              {fmt(timeLeft)}
            </span>
            <span style={{ fontSize: 9, color: "#4a6a7a" }}>残り</span>
          </div>
        </div>
      )}

      {phase === "running" && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 10,
            background: "#0a1628",
            borderRadius: 50,
            padding: "6px 20px",
            fontSize: 13,
            border: "1px solid #1a3a5a",
          }}
        >
          <span style={{ color: "#ccc" }}>
            ✅ <strong style={{ color: "#34e89e" }}>{correct}</strong>
          </span>
          <span style={{ color: "#1a3a5a" }}>|</span>
          <span style={{ color: "#ccc" }}>
            ❌ <strong style={{ color: "#FF6B9D" }}>{total - correct}</strong>
          </span>
          <span style={{ color: "#1a3a5a" }}>|</span>
          <span style={{ color: "#ccc" }}>
            📝 <strong style={{ color: "#fff" }}>{total}</strong>
          </span>
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#0a1628",
          borderRadius: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
          border: "1px solid #1a3a5a33",
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg,${c1},${c2})`,
            height: 5,
          }}
        />
        <div style={{ padding: "20px 22px 18px" }}>
          {/* IDLE */}
          {phase === "idle" && (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{ fontSize: 46, marginBottom: 8 }}>⏱️</div>
              <p style={{ color: "#E0EAF0", fontSize: 15, fontWeight: 700 }}>
                3分間チャレンジ！
              </p>
              <p
                style={{
                  color: "#4a6a7a",
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 14,
                }}
              >
                レベルを選んでスタート
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {["全部", "初級", "中級"].map((lv: string) => (
                  <button
                    key={lv}
                    onClick={() => setFilterLevel(lv)}
                    style={{
                      padding: "6px 18px",
                      borderRadius: 20,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      background:
                        filterLevel === lv
                          ? lv === "初級"
                            ? "#34e89e"
                            : lv === "中級"
                            ? "#f7971e"
                            : "#00d2ff"
                          : "#0f2033",
                      color: filterLevel === lv ? "#020818" : "#4a6a7a",
                    }}
                  >
                    {lv}
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: "#020818",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 11,
                  color: "#4a6a7a",
                  textAlign: "left",
                  lineHeight: 1.8,
                }}
              >
                <div>
                  🟢 <strong style={{ color: "#34e89e" }}>初級</strong>
                  ：まるばつ・4択のみ
                </div>
                <div>
                  🟡 <strong style={{ color: "#f7971e" }}>中級</strong>
                  ：穴埋め・用語・まるばつ・2択・4択
                </div>
              </div>
            </div>
          )}

          {/* RUNNING */}
          {phase === "running" && (
            <>
              <div
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: LEVEL_COLOR[cur.level] + "33",
                    color: LEVEL_COLOR[cur.level],
                    border: `1px solid ${LEVEL_COLOR[cur.level]}55`,
                  }}
                >
                  {cur.level}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 20,
                    color: "#fff",
                    background: `linear-gradient(90deg,${c1},${c2})`,
                  }}
                >
                  {cfg.emoji} {cur.type}
                </span>
              </div>
              <div
                style={{
                  background: "#020818",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#E0EAF0",
                  lineHeight: 1.8,
                  borderLeft: `4px solid ${c1}`,
                  whiteSpace: "pre-wrap",
                }}
              >
                {cur.q}
              </div>

              {/* 4択・2択ボタン */}
              {result === null &&
                (cur.type === "4択" || cur.type === "2択") &&
                cur.choices && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {cur.choices.map((choice: string, i: number) => {
                      const key = ["A", "B", "C", "D"][i];
                      return (
                        <button
                          key={key}
                          onClick={() => submitAnswer(key)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: 12,
                            border: `2px solid ${c1}44`,
                            background: "#020818",
                            color: "#E0EAF0",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          onMouseEnter={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => (e.currentTarget.style.background = "#0f2033")}
                          onMouseLeave={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => (e.currentTarget.style.background = "#020818")}
                        >
                          <span
                            style={{
                              color: c1,
                              fontFamily: "monospace",
                              marginRight: 8,
                            }}
                          >
                            {key}.
                          </span>
                          {choice.replace(/^[A-D]: /, "")}
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* まるばつボタン */}
              {result === null && cur.type === "まるばつ" && (
                <div
                  style={{ display: "flex", gap: 10, justifyContent: "center" }}
                >
                  {["〇", "✗"].map((ch: string) => (
                    <button
                      key={ch}
                      onClick={() => submitAnswer(ch)}
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: 12,
                        border: `2px solid ${
                          ch === "〇" ? "#34e89e44" : "#FF6B9D44"
                        }`,
                        background: "#020818",
                        color: ch === "〇" ? "#34e89e" : "#FF6B9D",
                        fontWeight: 900,
                        fontSize: 26,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                        (e.currentTarget.style.background = "#0f2033")
                      }
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                        (e.currentTarget.style.background = "#020818")
                      }
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}

              {/* 穴埋め・用語入力 */}
              {result === null &&
                cur.type !== "4択" &&
                cur.type !== "2択" &&
                cur.type !== "まるばつ" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInput(e.target.value)
                      }
                      placeholder={getPlaceholder()}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: `2px solid ${c1}55`,
                        outline: "none",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#E0EAF0",
                        background: "#020818",
                        fontFamily: "monospace",
                      }}
                    />
                    <button
                      onClick={submit}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 12,
                        border: "none",
                        background: `linear-gradient(90deg,${c1},${c2})`,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      送信
                    </button>
                  </div>
                )}

              {/* 正解フィードバック */}
              {result === "correct" && (
                <div
                  style={{
                    background: "rgba(52,232,158,0.08)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "2px solid #34e89e",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 900, color: "#34e89e" }}
                  >
                    ⭕ 正解！
                  </div>
                  <div style={{ fontSize: 13, color: "#8ab0b5", marginTop: 4 }}>
                    答え：
                    <strong style={{ color: "#fff", fontFamily: "monospace" }}>
                      {getAnswerLabel(cur.a, cur)}
                    </strong>
                  </div>
                  {cur.hint && (
                    <div
                      style={{ fontSize: 12, color: "#4a6a7a", marginTop: 6 }}
                    >
                      💡 {cur.hint}
                    </div>
                  )}
                </div>
              )}
              {/* 不正解フィードバック */}
              {result === "wrong" && (
                <div
                  style={{
                    background: "rgba(255,107,157,0.08)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "2px solid #FF6B9D",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 900, color: "#FF6B9D" }}
                  >
                    ❌ 不正解…
                  </div>
                  <div style={{ fontSize: 13, color: "#8ab0b5", marginTop: 4 }}>
                    あなたの答え：
                    <strong
                      style={{ color: "#FF6B9D", fontFamily: "monospace" }}
                    >
                      {getAnswerLabel(input, cur)}
                    </strong>
                  </div>
                  <div style={{ fontSize: 13, color: "#8ab0b5", marginTop: 2 }}>
                    正解は：
                    <strong
                      style={{ color: "#f7971e", fontFamily: "monospace" }}
                    >
                      {getAnswerLabel(cur.a, cur)}
                    </strong>
                  </div>
                  {cur.hint && (
                    <div
                      style={{ fontSize: 12, color: "#4a6a7a", marginTop: 6 }}
                    >
                      💡 {cur.hint}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* FINISHED */}
          {phase === "finished" && (
            <div style={{ padding: "14px 0" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 48 }}>🎉</div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: "#00d2ff",
                    margin: "6px 0 10px",
                  }}
                >
                  タイムアップ！
                </p>
                <div
                  style={{
                    background: "rgba(0,210,255,0.05)",
                    borderRadius: 16,
                    padding: "14px",
                    marginBottom: 8,
                    border: "1px solid #1a3a5a",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: "#4a6a7a" }}>正解</div>
                      <div
                        style={{
                          fontSize: 34,
                          fontWeight: 900,
                          color: "#34e89e",
                        }}
                      >
                        {correct}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        color: "#1a3a5a",
                        alignSelf: "center",
                      }}
                    >
                      /
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#4a6a7a" }}>挑戦</div>
                      <div
                        style={{
                          fontSize: 34,
                          fontWeight: 900,
                          color: "#E0EAF0",
                        }}
                      >
                        {total}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        color: "#1a3a5a",
                        alignSelf: "center",
                      }}
                    >
                      =
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#4a6a7a" }}>
                        正答率
                      </div>
                      <div
                        style={{
                          fontSize: 34,
                          fontWeight: 900,
                          color: "#00d2ff",
                        }}
                      >
                        {total > 0 ? Math.round((correct / total) * 100) : 0}
                        <span style={{ fontSize: 13 }}>%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ color: "#4a6a7a", fontSize: 12, marginBottom: 0 }}>
                  {scoreMsg}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {(["wrong", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setReviewFilter(f)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      background:
                        reviewFilter === f
                          ? f === "wrong"
                            ? "#FF6B9D"
                            : "#00d2ff"
                          : "#0f2033",
                      color: reviewFilter === f ? "#fff" : "#4a6a7a",
                    }}
                  >
                    {f === "wrong"
                      ? `❌ 間違い（${
                          logs.filter((l: AnswerLog) => !l.correct).length
                        }問）`
                      : `📋 全問（${logs.length}問）`}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxHeight: 340,
                  overflowY: "auto",
                }}
              >
                {displayLogs.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#34e89e",
                      fontSize: 13,
                      padding: "20px 0",
                    }}
                  >
                    {reviewFilter === "wrong"
                      ? "✨ 全問正解！間違いなし"
                      : "まだ挑戦した問題がありません"}
                  </div>
                )}
                {displayLogs.map((log: AnswerLog, i: number) => {
                  const lcfg = TYPE_CONFIG[log.riddle.type];
                  return (
                    <div
                      key={i}
                      style={{
                        background: log.correct
                          ? "rgba(52,232,158,0.05)"
                          : "rgba(255,107,157,0.05)",
                        borderRadius: 12,
                        padding: "10px 12px",
                        border: `1px solid ${
                          log.correct ? "#34e89e33" : "#FF6B9D33"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            padding: "1px 7px",
                            borderRadius: 20,
                            color: "#fff",
                            background: `linear-gradient(90deg,${lcfg.color[0]},${lcfg.color[1]})`,
                          }}
                        >
                          {lcfg.emoji} {log.riddle.type}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            color: LEVEL_COLOR[log.riddle.level],
                          }}
                        >
                          {log.riddle.level}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: 14 }}>
                          {log.correct ? "⭕" : "❌"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#E0EAF0",
                          fontWeight: 700,
                          whiteSpace: "pre-wrap",
                          marginBottom: 4,
                        }}
                      >
                        {log.riddle.q}
                      </div>
                      {!log.correct && (
                        <div style={{ fontSize: 11, color: "#8ab0b5" }}>
                          あなた：
                          <span
                            style={{
                              color: "#FF6B9D",
                              fontFamily: "monospace",
                            }}
                          >
                            {getAnswerLabel(log.userAnswer, log.riddle)}
                          </span>
                          正解：
                          <span
                            style={{
                              color: "#f7971e",
                              fontFamily: "monospace",
                            }}
                          >
                            {getAnswerLabel(log.riddle.a, log.riddle)}
                          </span>
                        </div>
                      )}
                      {log.riddle.hint && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#4a6a7a",
                            marginTop: 3,
                          }}
                        >
                          💡 {log.riddle.hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {phase === "idle" && (
          <button
            onClick={start}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg,#00d2ff,#3a7bd5)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(0,210,255,0.3)",
            }}
          >
            ▶ スタート！
          </button>
        )}
        {phase === "running" && result !== null && (
          <button
            onClick={next}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: `linear-gradient(135deg,${c1},${c2})`,
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            次の問題 → (Enter)
          </button>
        )}
        {phase === "finished" && (
          <button
            onClick={start}
            style={{
              padding: "12px 44px",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg,#FF6B9D,#f7971e)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            🔁 もう一度！
          </button>
        )}
      </div>
      {phase === "running" &&
        result === null &&
        cur.type !== "まるばつ" &&
        cur.type !== "4択" &&
        cur.type !== "2択" && (
          <p style={{ color: "#1a3a5a", fontSize: 10, marginTop: 10 }}>
            Enterキーでも送信できます
          </p>
        )}
    </div>
  );
}
