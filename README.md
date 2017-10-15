# Node.js TCP Proxy and Logger
## 機能
* TCPセグメントを特定の `<hostname>:<port>` へ転送する
    * レスポンスは対応するリクエスト元に返却する
* 転送時にログを出力する（オプション）
    * 通信の方向（リクエスト or レスポンス）
    * リクエスト元 `IP`
    * 転送先 `IP:Port`
    * 時刻
    * 通信内容

## 起動方法
```
npm start 転送先アドレス [ローカル待ち受けポート番号/アドレス] [ログ出力の有無]
```

### 引数
* 転送先アドレス（必須）
    * `<hostname>:<port>`
* ローカル待ち受けポート番号/アドレス（任意）
    * `<port>`
        * `hostname` 未指定時は任意のIPアドレス（ `0.0.0.0` ）宛を受け付ける
    * `<hostname>:<port>`
    * `<hostname>`
        * ポート番号は空きポートがランダムに割り当てられる
    * 指定しない場合は空きポートがランダムに割り当てられる
* ログ出力の有無（任意）
    * 文字列 `log` を渡した場合のみ各種ログを出力

### 例（IPv4）
* `npm start 10.12.34.56:8080 1234 log`
    * `0.0.0.0` の `1234` 番ポート → `10.12.34.56:8080`
    * ログ出力：あり
* `npm start 10.12.34.56:8080 1234`
    * `0.0.0.0` の `1234` 番ポート → `10.12.34.56:8080`
    * ログ出力：なし
* `npm start 10.12.34.56:8080 log`
    * `0.0.0.0` の `xxxx` 番ポート（起動時にランダムに決定） → `10.12.34.56:8080`
    * ログ出力：あり
* `npm start 10.12.34.56:8080`
    * `0.0.0.0` の `xxxx` 番ポート（起動時にランダムに決定） → `10.12.34.56:8080`
    * ログ出力：なし
* `npm start 10.12.34.56:8080 127.0.0.1:1234 log`
    * `127.0.0.1` の `1234` 番ポート → `10.12.34.56:8080`
    * ログ出力：あり
* `npm start 10.12.34.56:8080 127.0.0.1 log`
    * `127.0.0.1` の `xxxx` 番ポート（起動時にランダムに決定） → `10.12.34.56:8080`
    * ログ出力：あり
