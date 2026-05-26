# spring-security-keycloak

Spring Security と Keycloak を組み合わせた認証・認可のサンプルです。  
JWT ベースのトークン検証、ロールによる制御、React フロントエンドからの OIDC フローが簡易的に実装されています。

## 構成

```
.
├── backend/      # Spring Boot 4 (OAuth2 Resource Server)
├── frontend/     # React 19 + Vite + keycloak-js
├── realm-export.json  # Keycloak レルム定義（起動時に自動インポート）
└── docker-compose.yml
```

| コンポーネント | 技術 | ポート |
|---|---|---|
| IdP | Keycloak + PostgreSQL | 8080 |
| Backend | Spring Boot 4 / Java 25 | 8081 |
| Frontend | React 19 / Vite 8 | 5173 |

## 起動方法

```bash
docker compose up -d --build 
```

起動後、以下の URL にアクセスできます。

| URL | 内容 |
|---|---|
| http://localhost:5173 | フロントエンド |
| http://localhost:8081 | バックエンド API |
| http://localhost:8080 | Keycloak 管理コンソール |

## ローカル環境で利用できるアカウントの情報

### Keycloak 管理コンソール
URL: http://localhost:8080/admin  
ユーザー名: `admin` / パスワード: `admin`

### テストユーザー

| ユーザーID | パスワード | ロール | バックエンドの対応レコード | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| User | pass | USER | testuser (user@example.com) | 一般ユーザー。自身の情報を参照できます。 |
| Admin | pass | USER + ADMIN | adminuser (admin@example.com) | 管理者ユーザー。全会員情報を閲覧できます。 |

## 検証パターン

フロントエンドの **「自分の情報を照会」** ・ **「全ユーザーを表示」** ボタンで、以下の挙動を確認できます。

### 未ログイン状態

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `401` - 認証が必要です |
| 全ユーザーを表示 | `401` - 認証が必要です |

<img width="628" height="240" alt="image" src="https://github.com/user-attachments/assets/436eb584-6e84-4f06-b09b-0782c91a54e2" />

---

### `user` でログイン（USER ロールのみ）

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `200` - testuser のプロフィール |
| 全ユーザーを表示 | `403` - 権限がありません（ADMIN ロール不足） |

<img width="572" height="318" alt="image" src="https://github.com/user-attachments/assets/ae33d697-1e0b-4d6e-a785-ea3d77b33f1b" />

<img width="567" height="250" alt="image" src="https://github.com/user-attachments/assets/d1998af2-7ce2-41b4-886f-ec3c4debe4b8" />

---

### `admin` でログイン（USER + ADMIN ロール）

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `200` - adminuser のプロフィール |
| 全ユーザーを表示 | `200` - 全ユーザー一覧 |

<img width="563" height="693" alt="image" src="https://github.com/user-attachments/assets/ab2b6859-2b5b-43ac-9a55-507d16892368" />

## セキュリティの仕組み

### 認証フロー

1. フロントエンドが Keycloak の **Authorization Code Flow** でログイン
2. 取得した **JWT（アクセストークン）** を `Authorization: Bearer` ヘッダーに付与してバックエンドを呼び出す
3. バックエンドは JWK エンドポイントで署名を検証し、`realm_access.roles` クレームからロールを抽出する

### ロール設計

| ロール | 付与されているユーザー |
|---|---|
| `USER` | user, admin |
| `ADMIN` | admin のみ |

### エンドポイントとアクセス制御

| メソッド | パス | 必要ロール | 説明 |
|---|---|---|---|
| GET | `/users/me` | `USER` | JWTの `sub` に一致するユーザーを返す |
| GET | `/users` | `ADMIN` | 全ユーザー一覧を返す |

アクセス制御は `@PreAuthorize("hasRole('...')")` で実装されています（`UserApplicationService.java`）。

## ポイント

### JWT の検証（`SecurityConfig.java`）

Keycloak はコンテナ内部ネットワーク経由でトークンを発行しますが、フロントエンドは `localhost` 経由でアクセスします。  
`iss`（issuer）クレームの検証に使う URI を `APP_SECURITY_JWT_ISSUER_VALIDATE_URI` で `localhost` に向けることで、コンテナ内外の差異を吸収しています。

```yaml
# docker-compose.yml
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/my-app  # JWK 取得（コンテナ内）
APP_SECURITY_JWT_ISSUER_VALIDATE_URI: http://localhost:8080/realms/my-app               # iss 検証（ホスト側）
```

### Keycloak ロールのマッピング（`SecurityConfig.java`）

Keycloak の JWT には Spring Security が標準で読まない `realm_access.roles` にロールが入っています。  
`JwtAuthenticationConverter` をカスタマイズして `ROLE_USER` / `ROLE_ADMIN` として登録することで、`@PreAuthorize` がそのまま使えるようにしています。

### メソッドセキュリティ（`UserApplicationService.java`）

`@EnableMethodSecurity` を有効にし、ユースケースを表現する `ApplicationService` の各メソッドに `@PreAuthorize` を付与しています。  
「このユースケースを実行できるのは誰か」という認可ルールをユースケース境界に閉じ込めることで、コントローラーや他のレイヤーに制御が漏れ出さない設計になっています。
