# Todo-List — 로그인 + 목록 조회 미니 앱

MES_FE 의 **5-Layer 아키텍처**를 축소 재현하고, **TanStack Query** 로 서버 상태를 다루며,
**MSW + faker** 로 백엔드 없이 동작하도록 구성했습니다.

---

## 실행 방법

### 요구 환경

| 항목    | 버전                              |
| ------- | --------------------------------- |
| Node.js | 20 이상 (개발 환경 기준 v24.18.1) |
| pnpm    | 10 이상 (개발 환경 기준 10.17.1)  |

### 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 파일 생성 (필수 — 아래 '환경 변수 설정' 참고)
cat > .env.development <<'EOF'
VITE_API_BASE_URL=http://localhost:5173/api
VITE_ENABLE_MSW=true
EOF

# 3. 개발 서버 실행
pnpm dev
```

실행 후 터미널에 출력되는 주소(기본 `http://localhost:5173`)로 접속하면
로그인 화면으로 이동합니다.

> **별도의 백엔드 서버를 띄울 필요가 없습니다.**
> 모든 API 요청은 MSW(Service Worker)가 브라우저에서 가로채 응답합니다.

### 환경 변수 설정 (필수)

> **`.env.development` 은 `.gitignore` 로 제외되어 저장소에 포함되지 않습니다.**
> 아래 절차대로 직접 생성해야 앱이 정상 동작합니다.

프로젝트 루트(= `package.json` 이 있는 위치)에 `.env.development` 파일을 만들고
다음 두 줄을 넣어 주세요.

```bash
VITE_API_BASE_URL=http://localhost:5173/api
VITE_ENABLE_MSW=true
```

터미널에서 한 번에 생성하려면:

```bash
cat > .env.development <<'EOF'
VITE_API_BASE_URL=http://localhost:5173/api
VITE_ENABLE_MSW=true
EOF
```

**이미 개발 서버가 켜져 있었다면 파일 생성 후 서버를 재시작해야 합니다.**
(Vite 는 `.env` 파일을 기동 시점에 한 번만 읽습니다)

| 변수                | 설명                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | API 기본 주소. MSW 핸들러가 이 주소를 기준으로 요청을 가로챕니다.                               |
| `VITE_ENABLE_MSW`   | `true` 일 때만 MSW 워커가 기동합니다. **`false` 면 목 서버가 없어 로그인이 동작하지 않습니다.** |

### 기타 스크립트

```bash
pnpm build       # 타입 체크(tsc -b) 후 프로덕션 빌드
pnpm preview     # 빌드 결과물 미리보기
pnpm lint:type   # 타입 체크만 수행
```

### 문제 해결

| 증상 | 원인과 해결 |
| --- | --- |
| 로그인 시 **404** 또는 `Request failed with status code 404` | MSW 워커가 요청을 가로채지 못한 상태입니다. ① `.env.development` 이 있는지, `VITE_ENABLE_MSW=true` 인지 확인 ② 개발 서버 재시작 ③ 브라우저 **하드 새로고침**(`Cmd/Ctrl + Shift + R`) |
| 콘솔에 `[MSW] Mocking enabled.` 가 안 뜸 | 환경 변수가 적용되지 않았습니다. 파일 위치(프로젝트 루트)와 서버 재시작 여부를 확인해 주세요. |
| 로그인은 되는데 목록이 계속 에러 | 브라우저 저장소에 만료·손상된 토큰이 남은 경우입니다. [로그아웃] 을 누르거나 DevTools → Application → Local Storage → `todo-list:auth-store` 를 삭제해 주세요. |

> **MSW 핸들러 파일(`src/mocks/`)을 수정한 경우** 일반 새로고침으로는 반영되지 않습니다.
> 워커가 이전 핸들러를 들고 있으므로 **하드 새로고침**이 필요합니다.

---

## 테스트 계정

아래 **2개 계정만** 로그인에 성공합니다. 그 외 입력은 **401** 과 함께 에러 메시지가 표시됩니다.

| 아이디  | 비밀번호    | 이름   | 권한    |
| ------- | ----------- | ------ | ------- |
| `admin` | `admin123!` | 관리자 | `ADMIN` |
| `user`  | `user123!`  | 박지승 | `USER`  |

> 계정 정보는 로그인 화면 하단에도 안내되어 있습니다.

---

## 구현 기능

### 1. 로그인 화면 (`/login`)

- 아이디 / 비밀번호 입력 폼
- **클라이언트 유효성 검사** — `react-hook-form` + `zod`
  (아이디 3자 이상, 비밀번호 6자 이상)
- **서버 유효성 검사** — MSW 로 모킹한 `POST /auth/login` 호출
  - 테스트 계정 일치 시 토큰 + 사용자 정보 반환
  - 불일치 시 `401 INVALID_CREDENTIALS` 반환
- 성공 시 토큰을 저장하고 목록 화면으로 이동
- 실패 시 서버가 내려준 에러 메시지를 폼 하단에 표시
- 요청 중에는 버튼 비활성화 + 스피너 노출

### 2. 목록 조회 화면 (`/todos`)

- **로그인 없이 접근 불가** — 미인증 시 `/login` 으로 리다이렉트
- faker 로 생성한 **TODO 목데이터 47건**
- **검색** — 제목 / 담당자 / ID 부분 일치 (대소문자 무시)
- **필터** — 상태(대기 / 진행중 / 완료 / 보류) 선택
- **페이지네이션** — 10건 단위, 현재 페이지 기준 5개 번호 노출
- **로딩 상태** — 스피너 + "불러오는 중…"
- **빈 데이터 상태** — "조건에 맞는 항목이 없습니다" 안내
- **에러 상태** — 실패 사유 표시
- **항목 클릭 시 상세 화면으로 이동**
- 로그아웃 시 클라이언트 상태와 서버 캐시를 함께 초기화

### 3. 상세 화면 (`/todos/:id`)

- **로그인 없이 접근 불가** — 목록과 동일하게 `AuthGuard` 보호 구간
- 목록에서 항목을 클릭하면 진입하며, **URL 로 직접 접근 · 공유 · 새로고침** 가능
- 목록에서 공간상 생략했던 필드까지 전부 표시
- **로딩 / 에러 / 없음** 세 가지 상태 처리
  - 존재하지 않는 ID 로 접근 시 서버가 `404` 를 반환하고 화면에 사유 표시
- 마감일 초과 강조 규칙은 목록과 동일 (`마감일 < 오늘 && 상태 ≠ 완료`)

> Service · Repository · HttpClient · MSW 핸들러는 목록 화면과 **그대로 공유**합니다.
> `useGetTodo` 와 `GET /todos/:id` 가 이미 있었기 때문에, 상세 화면을 붙이면서
> **페이지 컴포넌트 추가와 라우트 한 줄 등록 외에는 기존 레이어를 수정하지 않았습니다.**

#### 목데이터 필드 구성 (8개)

| 필드        | 타입     | 설명                                     |
| ----------- | -------- | ---------------------------------------- |
| `id`        | 문자열   | `TODO-001` 형식                          |
| `title`     | 문자열   | 업무 제목                                |
| `assignee`  | 문자열   | 담당자명                                 |
| `status`    | **enum** | `TODO` / `IN_PROGRESS` / `DONE` / `HOLD` |
| `priority`  | **enum** | `LOW` / `MEDIUM` / `HIGH` / `URGENT`     |
| `progress`  | **숫자** | 진행률 0~100                             |
| `dueDate`   | **날짜** | 마감일 (ISO 8601)                        |
| `createdAt` | **날짜** | 등록일 (ISO 8601)                        |

> `faker.seed()` 로 시드를 고정해, 새로고침해도 **항상 같은 데이터**가 생성됩니다.
> 검색 · 페이징 동작을 반복 검증할 수 있도록 한 조치입니다.

---

## 기술 스택

| 분류            | 사용 기술                           |
| --------------- | ----------------------------------- |
| 언어            | TypeScript 6 (**strict 모드**)      |
| 프레임워크      | React 19                            |
| 빌드            | Vite 8 + `@vitejs/plugin-react-swc` |
| 서버 상태       | **TanStack Query 5** (+ Devtools)   |
| 클라이언트 상태 | Zustand 5 (`devtools`, `persist`)   |
| HTTP            | axios                               |
| 라우팅          | React Router 8                      |
| 폼 / 검증       | react-hook-form + zod               |
| 스타일          | Tailwind CSS 4, clsx                |
| API 모킹        | **MSW 2 + @faker-js/faker**         |

**실제 네트워크 요청은 발생하지 않습니다.** `axios` 를 import 하는 파일은
`src/networks/httpClient.ts` 한 곳뿐이며, 모든 요청은 MSW 가 가로챕니다.

---

## API 명세

모두 RESTful 방식이며, MSW 핸들러가 응답합니다.

| 메서드 | 경로          | 설명                                            | 응답                                      |
| ------ | ------------- | ----------------------------------------------- | ----------------------------------------- |
| `POST` | `/auth/login` | 로그인                                          | `200` `{ accessToken, user }` / `401`     |
| `GET`  | `/todos`      | 목록 조회 (`page`, `size`, `keyword`, `status`) | `200` `IPaginatedResponse<ITodo>` / `401` |
| `GET`  | `/todos/:id`  | 단건 조회                                       | `200` `ITodo` / `401` / `404`             |

- 인증이 필요한 요청은 `Authorization: Bearer <token>` 헤더를 검사합니다.
- 로딩 UI 를 육안으로 확인할 수 있도록 핸들러에 의도적인 지연을 넣었습니다.
  (로그인 1000ms / 목록 400ms / 상세 200ms)

---

## 아키텍처 — 5-Layer

```
Pages → Components → Services → Repositories → HttpClient
                         ↕
                      Stores (로그인 등 클라이언트 상태)

                         ↓ (실제 네트워크 대신)
              MSW handlers → mock repositories (가짜 DB)
```

| 레이어           | 책임                                 | 위치                |
| ---------------- | ------------------------------------ | ------------------- |
| **Pages**        | 화면 조립 + 라우팅                   | `src/pages/`        |
| **Components**   | UI, 폼, 목록 렌더링                  | `src/components/`   |
| **Services**     | `useQuery` / `useMutation` 훅 반환   | `src/services/`     |
| **Repositories** | HTTP 요청 캡슐화만 (클래스, RESTful) | `src/repositories/` |
| **HttpClient**   | axios 래퍼, 인터셉터, 에러 정규화    | `src/networks/`     |
| **Stores**       | 로그인 여부 등 클라이언트 상태       | `src/stores/`       |

**핵심 규칙: 아래 레이어는 위 레이어를 import 하지 않습니다.**
컴포넌트는 직접 fetch 하지 않고 반드시 Service 훅을 경유합니다.

### 설계 상 주요 결정

#### 1. Composition Root — `contexts/ServiceProvider.tsx`

`HttpClient → Repository → Service` 의존성 조립을 **이 파일 한 곳에서만** 수행합니다.
각 클래스는 생성자로 의존성을 주입받을 뿐 스스로 생성하지 않으므로, 테스트 시
가짜 repository 를 끼워 넣어 Service 만 단독 검증할 수 있습니다.

#### 2. 토큰 주입은 게터 함수로 — `httpClient.setTokenGetter()`

토큰은 `authStore` 가 소유합니다. `HttpClient` 가 store 를 직접 import 하면
`networks → stores` 역방향 의존이 생기므로, **토큰을 읽는 함수만** 외부에서 주입받습니다.
함수로 받기 때문에 매 요청마다 최신 토큰을 읽습니다.

#### 3. queryKey 생성 규칙 통일 — `BaseService.keyOf()`

`['todos', 'list', { page, keyword, status }]` 형태를 강제해 오타로 인한 캐시 파편화를 막습니다.
검색 조건이 바뀌면 키가 바뀌어 자동으로 재조회됩니다.

#### 4. 서버 상태와 클라이언트 상태의 분리

- **TanStack Query** — 서버에서 받아오는 TODO 목록
- **Zustand** — 로그인 토큰 / 사용자 정보 (`persist` 로 새로고침 후에도 유지)

#### 5. 401 응답 시 자동 로그아웃

`AuthGuard` 는 토큰의 **존재 여부**만 확인하므로, 토큰이 만료·무효화되면
화면은 통과하지만 API 는 `401` 을 반환해 **에러 화면에서 빠져나올 수 없는 상태**가 됩니다.

이를 막기 위해 `HttpClient` 의 응답 인터셉터에서 `401` 을 감지하면
주입받은 핸들러(`clearAuth`)를 호출합니다. Store 가 비워지면
`AuthGuard` 가 이를 구독하고 있으므로 **자동으로 `/login` 으로 이동**합니다.

토큰 게터와 동일하게 **핸들러를 주입받는 방식**이라 `networks → stores`
역방향 의존이 생기지 않으며, `AuthGuard` 는 수정하지 않았습니다.

단, **로그인 요청(`/auth/login`)의 401 은 제외**합니다.
비밀번호 오류도 401 이므로, 이를 걸러내지 않으면 로그인 실패 시
기존 세션까지 초기화됩니다.

#### 6. 검색어 입력 상태와 조회 상태 분리

`keywordInput`(입력 중)과 `keyword`(실제 조회용)를 나눠, 타이핑 한 글자마다
요청이 나가지 않도록 했습니다. "검색" 버튼 제출 시에만 조회 조건이 갱신됩니다.

---

## MSW 목 서버 구성

과제 가이드의 4개 항목을 그대로 따랐습니다.

| 가이드                                                           | 구현                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| 목 데이터는 컴포넌트가 아닌 **별도 mock repository 가 소유**     | `src/mocks/repositories/` 가 데이터를 보유                 |
| 핸들러가 mock repository 를 **필터링 / 페이징해서 응답**         | 핸들러는 파싱 · 상태코드만, 가공은 mock repository 가 수행 |
| 로그인 API 도 핸들러로, **계정에 따라 성공 / 실패 분기**         | `authHandlers` 가 계정 검증 결과에 따라 200 / 401 분기     |
| **한 곳에서 전체 핸들러를 모아** `setupWorker(...handlers)` 등록 | `mocks/handlers/index.ts` → `mocks/browser.ts`             |

### 핸들러와 mock repository 의 역할 분리

| 구분                   | 책임                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| `mocks/handlers/*`     | **컨트롤러**. 토큰 헤더 검사 → 쿼리스트링 파싱 → 상태코드 결정 → JSON 포장 |
| `mocks/repositories/*` | **가짜 DB + 로직**. 데이터 소유, 검색 · 필터 · 정렬 · 페이징 수행          |

이렇게 나눈 덕분에 실제 백엔드로 교체할 때 **프론트엔드 코드는 수정할 필요가 없습니다.**
`.env` 의 `VITE_ENABLE_MSW` 를 `false` 로 바꾸고 `VITE_API_BASE_URL` 만 실제 서버 주소로
변경하면 됩니다.

---

## 디렉터리 구조

```
src/
├── main.tsx                      # Provider 중첩 = 부트스트랩 순서
│
├── contexts/                     # 부트스트랩 & 의존성 주입
│   ├── MswProvider.tsx           # 워커 준비를 Suspense 로 대기 후 렌더
│   ├── QueryProvider.tsx         # QueryClient 제공
│   ├── ServiceProvider.tsx       # Composition Root
│   └── RouterProvider.tsx        # 라우트 정의
│
├── networks/
│   └── httpClient.ts             # axios 래퍼 + 인터셉터 + HttpError
│
├── repositories/                 # HTTP 요청 캡슐화
│   ├── common/baseRepository.ts
│   ├── auth/authRepository.ts
│   └── todo/todoRepository.ts
│
├── services/                     # Query 훅 + 성공 후 정책
│   ├── common/baseService.ts
│   ├── auth/authService.ts
│   └── todo/todoService.ts
│
├── stores/                       # 클라이언트 상태
│   ├── common/createStore.ts     # devtools 일괄 적용 팩토리
│   └── common/authStore.ts       # persist(localStorage)
│
├── mocks/                        # 목 서버
│   ├── browser.ts                # setupWorker(...handlers)
│   ├── handlers/                 # 컨트롤러
│   │   ├── index.ts              # 전체 핸들러 집합
│   │   ├── authHandlers.ts
│   │   └── todoHandlers.ts
│   └── repositories/             # 가짜 DB
│       ├── common/baseMockRepository.ts
│       ├── auth/authMockRepository.ts
│       └── todo/todoMockRepository.ts
│
├── pages/
│   ├── LoginPage.tsx
│   ├── TodoListPage.tsx
│   ├── TodoDetailPage.tsx        # 상세 화면 (/todos/:id)
│   └── guards/AuthGuard.tsx      # 미인증 접근 차단
│
├── components/
│   ├── ui/                       # Button, TextField, Spinner,
│   │                             # EmptyState, Pagination
│   ├── auth/LoginForm.tsx
│   └── todo/                     # TodoList, TodoListItem, TodoFilterBar,
│                                 # TodoStatusBadge, TodoPriorityBadge
│
├── types/                        # auth / todo / common
├── consts/common/                # todo.ts(enum), envKeys.ts
└── utils/                        # date.ts, cn.ts
```

---

## 동작 확인 시나리오

아래 절차대로 진행하면 주요 기능을 한 번에 확인할 수 있습니다.

1. `pnpm dev` 실행 후 `http://localhost:5173/todos` 직접 접속 → **`/login` 으로 차단**되는지 확인
2. 아이디 `ab` 입력 후 제출 → **클라이언트 유효성 에러** 확인
3. `admin` / `wrongpw` 제출 → **401 에러 메시지** 확인
4. `admin` / `admin123!` 제출 → 스피너 노출 후 **목록으로 이동** (전체 47건)
5. 검색어 `로그인` 입력 후 [검색] → **7건**으로 필터링, 1페이지로 초기화
6. 상태 필터를 `완료` 로 변경 → **15건** 확인 (검색어 비운 상태 기준)
7. 검색어를 `zzzzz` 로 변경 → **빈 데이터 상태 UI** 확인
8. [초기화] 후 페이지 번호 이동 → **페이지네이션** 확인 (5페이지에 7건)
9. 목록에서 **항목 클릭** → 상세 화면 이동, URL 이 `/todos/TODO-001` 형태인지 확인
10. 상세에서 **새로고침** → 화면이 유지되는지 확인
11. 주소창에 `/todos/NOT-EXIST` 입력 → **404 에러 메시지** 확인
12. **새로고침** → 로그인 상태가 유지되는지 확인 (`persist`)
13. localStorage 의 `accessToken` 을 임의 값으로 수정 후 새로고침
    → **401 자동 로그아웃**으로 `/login` 이동 확인
14. [로그아웃] → `/login` 이동 및 재접근 차단 확인
