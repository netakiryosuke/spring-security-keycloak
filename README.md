# spring-security-keycloak

Keycloak と Spring Security を組み合わせた **認証・認可の学習用サンプル**です。  
JWT ベースのトークン検証、ロールによるエンドポイント制御、React フロントエンドからの OIDC フローが簡易的に実装されています。

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
| IdP | Keycloak (latest) + PostgreSQL | 8080 |
| Backend | Spring Boot 4 / Java 25 | 8081 |
| Frontend | React 19 / Vite 8 | 5173 |

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

## 起動方法

```bash
docker compose up --build
```

起動後、以下の URL にアクセスできます。

| URL | 内容 |
|---|---|
| http://localhost:5173 | フロントエンド |
| http://localhost:8081 | バックエンド API |
| http://localhost:8080 | Keycloak 管理コンソール |

## テストユーザー

レルム `my-app` に以下のユーザーが定義されています。  
パスワードは Keycloak 管理コンソールから確認・変更できます。

**Keycloak 管理コンソール**  
URL: http://localhost:8080/admin  
ユーザー名: `admin` / パスワード: `admin`

ログイン後、左メニューの **Users** からユーザーを選択し、**Credentials** タブでパスワードを確認・リセットできます。

| ユーザー名 | ロール | バックエンドの対応レコード |
|---|---|---|
| `user` | USER | testuser (user@example.com) |
| `admin` | USER + ADMIN | adminuser (admin@example.com) |

> バックエンドのユーザーストアはダミー実装（`DummyUserRepository`）です。  
> Keycloak の `sub`（ユーザーID）をキーに固定データを返します。


## 検証パターン

フロントエンドの **「自分の情報を照会」** ・ **「全ユーザーを表示」** ボタンで、以下の挙動を確認できます。

### 未ログイン状態

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `401` - 認証が必要です |
| 全ユーザーを表示 | `401` - 認証が必要です |

### `user` でログイン（USER ロールのみ）

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `200` - testuser のプロフィール JSON |
| 全ユーザーを表示 | `403` - 権限がありません（ADMIN ロール不足） |

### `admin` でログイン（USER + ADMIN ロール）

| 操作 | 結果 |
|---|---|
| 自分の情報を照会 | `200` - adminuser のプロフィール JSON |
| 全ユーザーを表示 | `200` - 全ユーザー一覧 JSON |


## 学習のポイント

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
