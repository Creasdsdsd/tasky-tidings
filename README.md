# OK금융 업무 점검

Google 로그인 기반의 개인 컴플라이언스 체크리스트 관리 앱입니다.

## 기능

- Google OAuth 로그인
- 월간 / 분기 점검 항목 관리
- 항목별 완료 체크 및 메모 작성
- 전체 / 완료 / 미완료 필터
- 카테고리별 완료율 통계

## 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Auth**: Google OAuth (Supabase)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:8080)
npm run dev
```

`.env` 파일에 아래 환경 변수가 필요합니다:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```
