# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에 대한 지침을 제공합니다.

## 명령어

```bash
# 개발 서버 (포트 8080)
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 단위 테스트 (Vitest + jsdom)
npm run test

# 감시 모드에서 단위 테스트
npm run test:watch

# 단일 테스트 파일 실행
npx vitest run src/path/to/file.test.tsx
```

Playwright e2e 테스트는 `playwright.config.ts`를 사용합니다 (lovable-agent-playwright-config를 통해 구성됨).

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하세요:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Supabase 클라이언트는 런타임에 `src/integrations/supabase/client.ts`에서 이를 읽습니다.

## 아키텍처

이것은 "OK금융 업무 점검"을 위한 단일 페이지 React 앱 (Vite + TypeScript)입니다 — Google OAuth 로그인이 있는 개인 컴플라이언스 체크리스트 도구.

### 제공자 트리 (`src/App.tsx`)

```
QueryClientProvider
  AuthProvider          ← Supabase 세션 상태
    TooltipProvider
      BrowserRouter
        Route /         → Index
        Route *         → NotFound
```

`@tanstack/react-query`는 연결되어 있지만 아직 사용되지 않음 — 모든 데이터 가져오기는 `Index.tsx`에서 직접 Supabase 호출을 통해 수행됩니다.

### 인증 흐름

- `AuthProvider` (`src/contexts/AuthContext.tsx`)는 전체 앱을 감싸고 `useAuth()`를 통해 `{ user, session, loading, signOut }`을 노출합니다.
- 로그인은 `src/components/LoginPage.tsx`에서 `supabase.auth.signInWithOAuth`를 통한 Google OAuth로, Google로 리디렉션하고 돌아옵니다.
- `src/pages/Index.tsx`는 `user`가 null일 때 `<LoginPage />`를 렌더링하고, 그렇지 않으면 메인 체크리스트 UI를 렌더링합니다.
- **참고**: `src/integrations/lovable/index.ts`가 존재하지만 (Lovable 클라우드 인증 프록시) 더 이상 사용되지 않습니다. 생성된 `~oauth/initiate` 경로는 Lovable 호스팅 플랫폼에서만 작동하며 로컬에서는 작동하지 않습니다.

### 데이터 레이어

- 모든 데이터는 Supabase 테이블 `checklist_items`에 있습니다 (열: `id`, `title`, `category`, `checked`, `memo`, `sort_order`, `user_id`).
- 행 수준 보안은 사용자 격리를 강제합니다 — 모든 쿼리는 암시적으로 `auth.uid() = user_id`로 범위가 지정됩니다.
- 모든 Supabase 쿼리는 `src/pages/Index.tsx`에서 직접 수행됩니다 (별도의 서비스/훅 레이어 없음). 타입이 지정된 클라이언트는 `@/integrations/supabase/client`에서 가져옵니다.
- 첫 로그인 시, 사용자가 없으면 `seedDefaultItems`가 6개의 기본 체크리스트 항목을 삽입합니다.

### 컴포넌트 구조

`src/pages/Index.tsx`는 모든 상태(`items`, `filter`, `collapsed`)를 소유하고 콜백을 리프 컴포넌트로 전달합니다:

- `ChecklistCard` — 인라인 메모가 있는 단일 항목 카드 (Supabase에 500ms 디바운스 쓰기)
- `ProgressHeader` — 전체 및 카테고리별 완료 통계
- `FilterTabs` — "전체 / 완료 / 미완료" 필터
- `AddItemForm` — 새 항목 추가 양식
- `UserHeader` — 로그인된 사용자 정보 및 로그아웃 버튼 표시
- `LoginPage` — Google OAuth 진입점

### UI

- shadcn/ui 컴포넌트는 `src/components/ui/`에 있습니다 (Radix UI 프리미티브 + Tailwind).
- 경로 별칭 `@/`는 `src/`에 매핑됩니다.
- `src/components/ui/`에는 자동 생성된 shadcn 컴포넌트가 포함되어 있습니다 — 이러한 컴포넌트보다 기능 컴포넌트를 편집하는 것을 선호하세요.

### 데이터베이스 마이그레이션

`supabase/migrations/`에는 전체 스키마 기록이 포함되어 있습니다. 최종 상태:
- RLS가 활성화된 `checklist_items` 테이블
- 정책은 `user_id`와 일치하는 인증된 사용자에게 모든 CRUD를 제한합니다
- `updated_at`은 트리거를 통해 자동 업데이트됩니다.
