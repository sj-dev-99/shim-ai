# SHIM.AI

AI와 함께 나를 이해하고 기록하는 자기이해 플랫폼

SHIM.AI는 감정 기록, AI 심리테스트, 맥락 기반 해석을 연결해 사용자가 자신의 감정과 사고 패턴을 더 차분하게 이해하도록 돕는 AI 자기이해 플랫폼입니다. 한 번의 테스트 결과로 끝나는 서비스가 아니라, 검사와 기록, 변화 확인, 회복 루틴, 대화형 자기성찰로 이어지는 경험을 목표로 합니다.

## 1. 프로젝트 개요

SHIM.AI는 단순 심리테스트 사이트가 아니라 지속적인 자기이해 경험을 제공하는 베타 서비스입니다.

서비스 흐름은 아래 구조를 기준으로 설계되어 있습니다.

```text
SHIM Test -> SHIM Diary -> SHIM Report -> SHIM Care -> SHIM Talk
```

- `SHIM Test`: 현재의 감정, 관계, 사고 패턴을 돌아보는 시작점
- `SHIM Diary`: 일상의 감정과 경험을 기록하는 공간
- `SHIM Report`: 기록이 쌓인 뒤 변화 흐름과 반복 패턴을 확인하는 기능
- `SHIM Care`: 사용자의 상태에 맞는 작은 회복 루틴을 제안하는 기능
- `SHIM Talk`: 대화를 통해 감정을 정리하고 자기이해를 돕는 기능

현재 저장소에서는 `SHIM Test`, `SHIM Diary`, 계정 기반 Diary 저장 구조, 메인페이지 서비스 캐러셀이 주요 구현 완료 영역입니다. `SHIM Report`, `SHIM Care`, `SHIM Talk`은 준비 중 페이지와 서비스 구조가 마련되어 있으며, 실제 분석과 개인화 기능은 향후 확장 예정입니다.

## 2. SHIM.AI가 해결하려는 문제

많은 심리테스트 서비스는 한 번의 결과 확인으로 경험이 끝납니다. 점수나 유형은 흥미롭지만, 시간이 지나며 감정이 어떻게 달라지는지, 반복되는 사고 패턴이 무엇인지, 자기이해를 일상 행동으로 어떻게 연결할지 확인하기 어렵습니다.

SHIM.AI는 이를 다음 방식으로 보완하려 합니다.

- 검사: 구조화된 질문으로 현재 감정과 사고 패턴을 돌아봅니다.
- 기록: 일상의 감정과 경험을 짧게 남깁니다.
- 해석: 단일 점수보다 맥락과 반복되는 표현을 중심으로 자기이해 단서를 제공합니다.
- 변화 확인: 기록이 쌓이면 감정 흐름과 반복 주제를 확인하는 방향으로 확장합니다.
- 실천 제안: 작은 회복 루틴과 자기돌봄 행동으로 이어지는 경험을 준비합니다.
- 대화형 성찰: 판단보다 공감, 질문, 요약을 중심으로 감정을 정리하는 서비스를 목표로 합니다.

## 3. 핵심 서비스 구조

| 서비스 | 역할 | 현재 상태 |
| --- | --- | --- |
| SHIM Test | 감정, 관계, 사고 패턴을 돌아보는 AI 자기이해 테스트 | 운영 중 |
| SHIM Diary | 감정과 일상을 기록하고 AI 한 줄 피드백 제공 | 운영 중 |
| SHIM Report | 감정 타임라인과 반복 패턴 분석 | 준비 중 |
| SHIM Care | 개인화된 회복 루틴과 실천 제안 | 준비 중 |
| SHIM Talk | 대화형 감정 정리와 자기성찰 | 준비 중 |

## 4. 사용자 경험 흐름

1. 메인페이지에서 SHIM.AI의 서비스 구조를 확인합니다.
2. `SHIM Test`에서 현재 감정과 사고 패턴을 돌아봅니다.
3. 테스트 시작 전 보고서에 표시할 이름 또는 닉네임을 입력합니다.
4. 테스트 결과 화면에서 유형 설명, 강점, 주의점, 루틴, 성향 시각화, 의견 제출 기능을 확인합니다.
5. `SHIM Diary`에서 오늘의 감정과 경험을 기록합니다.
6. 로그인한 사용자의 Diary 기록은 Supabase에 계정별로 저장됩니다.
7. 기록이 쌓이면 향후 `SHIM Report`에서 감정 변화와 반복 주제를 확인하는 구조로 확장할 예정입니다.
8. 이후 `SHIM Care`, `SHIM Talk`을 통해 회복 루틴과 대화형 자기성찰 경험으로 연결하는 것을 목표로 합니다.

## 5. 현재 구현 상태

### 구현 완료

- 모바일 퍼스트 메인페이지
- SHIM Services 카드 캐러셀
- 서비스별 상세 설명 및 CTA 연동
- SHIM Methodology 섹션
- 라이트/다크 모드
- SHIM Test 카탈로그 페이지
- 공개 테스트 4종
  - AI 감정·회복 유형 테스트
  - 연애유형·이상형 분석
  - 대인관계 분석
  - 고지능 우울증 검사
- 테스트 시작 전 이름/닉네임 입력 흐름
- 일부 테스트의 성별 선택 흐름
- 테스트 문항 페이지와 결과 페이지
- 결과 만족도, 의견 작성, 공유 관련 UI
- SHIM Diary 감정 기록 페이지
- Diary 감정 선택, 일상 기록, AI 한 줄 피드백
- Diary 감정만 저장, 작성 draft 보존, 수정, 삭제 확인 흐름
- Supabase Auth 기반 회원가입, 로그인, 비밀번호 재설정, 계정 설정
- 로그인 사용자 기준 Diary Supabase 저장, 수정, 삭제, 기존 localStorage 기록 가져오기
- 계정 삭제 API와 삭제 전 비밀번호 재확인
- 피드백 및 오류 신고 플로팅 버튼
- 베타 이벤트 수집 API
- 공개 참여 수 통계 API
- 관리자 페이지와 관리자 로그인
- Supabase 설정 시 베타 이벤트 저장 및 관리자 데이터 조회
- Supabase 미설정 시 관리자 페이지 mock data 표시
- Vercel 배포 설정과 보안 헤더

### 준비 중 또는 부분 구현

- SHIM Report 실제 리포트 분석 화면
- SHIM Care 개인화 회복 루틴 기능
- SHIM Talk 대화형 자기성찰 기능
- 실제 외부 AI 모델/API 기반 고급 분석
- 이메일 변경 기능
- 월간 리포트 자동 생성
- 알림 또는 리마인더 기능

## 6. 주요 기능과 라우팅

- `/`: SHIM.AI 메인페이지
- `/shim-test`: SHIM Test 카탈로그
- `/mind`: AI 감정·회복 유형 테스트 소개
- `/test-start`: 감정·회복 테스트 시작 전 프로필 입력
- `/test`: 감정·회복 테스트 문항
- `/result`: 감정·회복 테스트 결과
- `/love-type`, `/love-test`, `/love-result`: 연애유형·이상형 분석
- `/relationship-test`, `/relationship-questions`, `/relationship-result`: 대인관계 분석
- `/high-functioning-depression`, `/high-functioning-depression-questions`, `/high-functioning-depression-result`: 고지능 우울증 검사
- `/diary`: SHIM Diary
- `/signup`: 회원가입
- `/login`: 로그인
- `/forgot-password`: 비밀번호 재설정 메일 요청
- `/reset-password`: 비밀번호 재설정
- `/auth/callback`: Supabase Auth callback
- `/account`: 계정 설정
- `/terms`: 이용약관
- `/privacy`: 개인정보 처리방침
- `/report`, `/care`, `/talk`: 준비 중 서비스 페이지
- `/admin`: 베타 운영 관리자 페이지
- `/api/beta-events`: 페이지뷰, 피드백, 오류 신고, 만족도 이벤트 수집
- `/api/public-stats`: 공개 참여 수 통계 조회
- `/api/account/delete`: 계정 삭제
- `/api/admin/*`: 관리자 로그인, 데이터 조회, 상태 업데이트

## 7. 서비스별 상세 설명

### SHIM Test

SHIM Test는 사용자가 자신의 감정 조절 방식, 관계 경향, 사고 습관을 돌아볼 수 있도록 구성된 자기보고형 테스트 영역입니다.

현재 공개된 테스트는 4종입니다.

- AI 감정·회복 유형 테스트
- 연애유형·이상형 분석
- 대인관계 분석
- 고지능 우울증 검사

각 테스트는 문항 응답을 바탕으로 유형별 결과, 강점, 주의점, 추천 루틴, 자기이해 질문을 제공합니다. 결과는 진단이나 판정이 아니라 자기이해를 위한 참고용 콘텐츠입니다.

### SHIM Diary

SHIM Diary는 사용자가 오늘의 감정과 경험을 기록하는 공간입니다. 감정 상태를 선택하고 일기 형태로 내용을 남기면, 현재 구현에서는 내부 로직을 통해 AI 한 줄 코멘트 형태의 피드백을 제공합니다. 본문 없이 감정만 남기는 기록도 허용해 매일 부담 없이 사용할 수 있도록 설계했습니다.

로그인한 사용자의 Diary 기록은 Supabase에 계정별로 저장됩니다. 비로그인 상태에서는 저장 대신 로그인 안내와 임시 draft 보존 흐름을 사용합니다. draft는 로그인 사용자별 또는 guest 기준으로 분리해 계정 전환 시 이전 사용자의 작성 중 내용이 노출되지 않도록 처리합니다. 기존 브라우저 `localStorage` 기록은 로그인 후 가져오기 기능으로 Supabase 기록에 옮길 수 있습니다.

Diary 목록은 `entry_date`와 `created_at` 기준으로 최신 기록을 보여주며, 수정 시 감정과 본문을 함께 변경할 수 있습니다. 삭제는 확인 모달을 거친 뒤 처리하고, 실패 시 화면 상태를 복구하도록 구성되어 있습니다.

### SHIM Report

SHIM Report는 Diary와 Test 기록을 바탕으로 감정 타임라인, 반복 주제, 월간 변화 요약을 제공하기 위한 서비스입니다. 현재는 준비 중 페이지가 구현되어 있으며, 실제 분석 리포트 기능은 아직 제공하지 않습니다.

### SHIM Care

SHIM Care는 사용자의 감정 상태와 기록 흐름을 바탕으로 자기돌봄, 감정 조절, 저강도 실천 제안을 제공하기 위한 서비스입니다. 현재는 준비 중 페이지가 구현되어 있으며, 개인화 루틴 추천 로직은 아직 제공하지 않습니다.

### SHIM Talk

SHIM Talk은 일반 챗봇처럼 빠른 답을 제공하기보다 공감, 질문, 요약을 중심으로 사용자가 스스로 감정을 정리하도록 돕는 대화형 자기성찰 서비스를 목표로 합니다. 현재는 준비 중 페이지가 구현되어 있으며, 실제 대화 기능이나 외부 AI 모델 연동은 아직 제공하지 않습니다.

## 8. SHIM Methodology

### 1. 자기성찰 기반 설계

SHIM.AI는 사용자가 자신의 감정과 경험을 언어화할 수 있도록 구조화된 질문과 기록 방식을 제공합니다. 정서 인식, 자기관찰, 메타인지적 성찰을 중심에 두고, 현재 구현에서는 테스트와 Diary를 통해 초기 자기성찰 흐름을 제공합니다.

### 2. 맥락 중심 AI 해석

SHIM.AI는 단일 점수나 한 번의 답변만으로 사용자를 판단하지 않는 방향을 지향합니다. 감정 맥락, 반복 주제, 언어적 패턴을 함께 살피는 해석 구조를 목표로 합니다. 다만 현재 저장소는 외부 AI 모델을 통한 고급 분석 API에 연결되어 있지 않습니다.

### 3. 연속 기록 기반 패턴 분석

Test와 Diary 기록이 시간의 흐름에 따라 쌓이면 감정 빈도, 변화 추세, 반복되는 주제를 확인할 수 있는 구조로 확장할 예정입니다. 현재는 Diary 기록 저장 기반과 Report 준비 중 페이지가 마련되어 있습니다.

### 4. 실천 중심 피드백

SHIM.AI는 해석에서 끝나지 않고 일상에서 시도할 수 있는 작은 행동으로 이어지는 경험을 목표로 합니다. 테스트 결과에는 추천 루틴과 성찰 질문이 포함되어 있으며, Care 서비스에서는 더 개인화된 회복 루틴을 제공하는 방향으로 준비하고 있습니다.

## 9. 기술 스택

현재 `package.json`과 코드 구조 기준 실제 사용 기술은 다음과 같습니다.

- Next.js 12
- React 18
- TypeScript
- CSS: `styles/globals.css` 기반 전역 스타일
- lucide-react 아이콘
- Supabase JavaScript Client
- Supabase Auth
- Supabase Database 및 RLS SQL
- Next.js API Routes
- Vercel 배포 설정

현재 저장소에는 Tailwind CSS 설정이나 별도 캐러셀 라이브러리가 포함되어 있지 않습니다. SHIM Services 캐러셀은 React state, pointer event, `requestAnimationFrame`, `translate3d`, 카드 중심 거리 기반 보간 로직으로 직접 구현되어 있습니다.

OpenAI SDK, LangChain 등 외부 AI SDK는 현재 의존성에 포함되어 있지 않습니다.

## 10. 프로젝트 구조

```text
components/
  AuthLayout.tsx        인증 관련 공통 레이아웃
  BetaDock.tsx          피드백 및 오류 신고 플로팅 UI
  ComingSoonPage.tsx    준비 중 서비스 공통 페이지
  HomeSections.tsx      메인페이지 Hero, 서비스 캐러셀, Methodology, Footer

docs/
  phase-5-validation-checklist.md
  supabase-auth-diary-foundation.md

lib/
  auth/                 AuthProvider, 약관 동의, 인증 메시지
  supabase/             Supabase client/server/admin helper와 타입
  beta.ts               베타 이벤트 제출 및 버전 정보
  data.ts               AI 감정·회복 테스트 데이터와 결과 로직
  homeContent.ts        메인 서비스 카드와 Methodology 데이터
  loveTest.ts           연애유형·이상형 분석 데이터
  relationshipTest.ts   대인관계 분석 데이터
  highFunctioningDepressionTest.ts
                        고지능 우울증 검사 데이터
  testProfile.ts        테스트 시작 전 프로필 localStorage 처리
  admin/                관리자 데이터 저장, 인증, Supabase/mock 저장소 로직

pages/
  index.tsx             메인페이지
  shim-test.tsx         테스트 카탈로그
  diary.tsx             SHIM Diary
  account.tsx           계정 설정
  signup.tsx            회원가입
  login.tsx             로그인
  forgot-password.tsx   비밀번호 재설정 요청
  reset-password.tsx    비밀번호 재설정
  auth/callback.tsx     Supabase Auth callback
  report.tsx            SHIM Report 준비 중 페이지
  care.tsx              SHIM Care 준비 중 페이지
  talk.tsx              SHIM Talk 준비 중 페이지
  admin.tsx             관리자 페이지
  api/                  Next.js API Routes

styles/
  globals.css           전역 스타일과 반응형 UI

supabase/
  migrations/           Auth, profiles, Diary, user consent SQL migration
```

## 11. 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

## 12. 환경변수

실제 환경변수 파일은 GitHub에 올리지 않습니다. 로컬에서는 `.env.example`을 참고해 `.env.local`을 만들고, Vercel에서는 Project Settings > Environment Variables에 등록합니다.

```bash
NEXT_PUBLIC_BETA_VERSION="Beta v0.2.0"

BETA_EVENT_WEBHOOK_URL=""
BETA_EVENT_WEBHOOK_TOKEN=""

ADMIN_PASSWORD=""
ADMIN_SESSION_SECRET=""

SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_BETA_EVENTS_TABLE="beta_events"

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

주의사항:

- 브라우저에 노출되어야 하는 값만 `NEXT_PUBLIC_` 접두사를 사용합니다.
- API key, token, password, Supabase Service Role Key에는 `NEXT_PUBLIC_`을 붙이지 않습니다.
- `.env`, `.env.local`, `.env.production.local`, `.next`, `node_modules`는 GitHub에 올리지 않습니다.
- `/admin`은 `ADMIN_PASSWORD`로 보호합니다.
- `ADMIN_SESSION_SECRET`은 충분히 긴 무작위 문자열로 설정하는 것을 권장합니다.

## 13. 빌드 및 배포

프로덕션 빌드는 아래 명령으로 확인합니다.

```bash
npm run build
```

`package.json`에는 아래 스크립트가 정의되어 있습니다.

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "check": "next build",
  "lint": "next lint"
}
```

현재 `npm run lint`는 별도 ESLint 설정이 없으면 Next.js 설정 프롬프트가 표시될 수 있습니다.

### Vercel 배포

1. GitHub repository에 변경사항을 push합니다.
2. Vercel에서 `New Project`를 선택합니다.
3. `sj-dev-99/shim-ai` repository를 import합니다.
4. Framework Preset은 `Next.js`를 사용합니다.
5. Build Command는 기본값인 `npm run build`를 사용합니다.
6. 필요한 Environment Variables를 등록합니다.
7. Deploy를 실행합니다.

`vercel.json`에는 `icn1` 리전과 기본 보안 헤더가 설정되어 있습니다.

### beta.shim.ai 도메인 연결

Vercel 배포 후:

1. Vercel Project > Settings > Domains로 이동합니다.
2. `beta.shim.ai`를 추가합니다.
3. DNS 제공자에 Vercel 안내 CNAME 레코드를 등록합니다.
4. SSL 발급 완료 후 `https://beta.shim.ai`로 접속합니다.

권장 DNS 형태:

```text
Type: CNAME
Name: beta
Value: cname.vercel-dns.com
```

## 14. 데이터 및 보안 원칙

- `submitBetaEvent`는 페이지뷰, 피드백, 오류 신고, 결과 만족도 이벤트를 `/api/beta-events`로 전송합니다.
- `page_view` 이벤트는 가능한 경우 `navigator.sendBeacon`을 사용합니다.
- 방문자 식별자는 브라우저 localStorage의 `shim_ai_visitor_id`로 생성합니다.
- 서버 API는 이벤트 타입과 문자열 길이를 제한해 저장 전 데이터를 정리합니다.
- Supabase 환경변수가 설정된 경우 `beta_events` 테이블에 이벤트를 저장합니다.
- Supabase 미설정 시 관리자 페이지는 mock data를 표시합니다.
- `BETA_EVENT_WEBHOOK_URL`과 `BETA_EVENT_WEBHOOK_TOKEN`을 통해 선택적으로 서버 사이드 webhook forwarding을 사용할 수 있습니다.
- Supabase Service Role Key는 서버 API Route에서만 사용해야 하며 클라이언트 코드에 노출되면 안 됩니다.
- 관리자 페이지는 `ADMIN_PASSWORD`와 세션 쿠키 기반 인증으로 보호합니다.

### Supabase Auth 및 Diary 저장 기반

SHIM Report 오픈 전 사용자 계정과 Diary 데이터 저장 구조를 준비하기 위해 Supabase Auth/Database 기반이 추가되어 있습니다.

- Supabase 브라우저/서버/admin client helper
- profiles, diary_entries, user_consents SQL migration
- RLS 정책
- 회원가입, 로그인, 로그아웃, 비밀번호 재설정
- 약관 및 개인정보 처리방침 동의 기록
- 로그인 사용자 기준 Diary 저장, 수정, 삭제
- 기존 localStorage Diary 기록 가져오기
- 사용자별 Diary draft 분리
- 감정만 저장 가능한 Diary 작성 흐름
- Diary 삭제 확인 모달과 중복 저장 방지
- 계정 설정
- 계정 삭제 API
- 계정 삭제 전 현재 비밀번호 재확인

관련 문서:

- [`docs/supabase-auth-diary-foundation.md`](docs/supabase-auth-diary-foundation.md)
- [`docs/phase-5-validation-checklist.md`](docs/phase-5-validation-checklist.md)
- [`supabase/migrations/202607220001_auth_diary_foundation.sql`](supabase/migrations/202607220001_auth_diary_foundation.sql)

## 15. 의료·심리 관련 안내

본 서비스는 의료 상담이나 진단을 제공하지 않으며, 자기이해와 자기성찰을 돕기 위한 참고용 콘텐츠입니다.

테스트 결과는 사용자의 응답을 바탕으로 한 자기보고형 해석이며, 임상 진단, 질병 판정, 치료 효과 보장, 전문 상담 대체를 목적으로 하지 않습니다.

심각한 정서적 어려움이나 위기 상황이 지속되는 경우 전문 의료기관 또는 상담기관의 도움을 권장합니다.

## 16. 현재 버전

현재 기본 베타 버전은 아래 값입니다.

```text
Beta v0.2.0
```

코드 기준 기본값은 `lib/beta.ts`에 정의되어 있으며, `NEXT_PUBLIC_BETA_VERSION` 환경변수로 화면 표시 버전을 덮어쓸 수 있습니다.

## 17. 향후 개발 계획

- SHIM Report 실제 리포트 화면 구현
- Diary와 Test 기록을 연결한 감정 타임라인
- 반복 주제와 월간 변화 요약
- SHIM Care 회복 루틴 추천
- SHIM Talk 대화형 자기성찰 기능
- 외부 AI 모델/API 연동 여부 검토
- 이메일 변경 기능
- 관리자 운영 지원 고도화
- 테스트 결과 해석 문장 개선
- 접근성 및 모바일 브라우저 호환성 개선

## 18. 개발 및 변경 기록 안내

프로젝트 변경 이력은 Git 커밋 로그를 기준으로 확인합니다.

```bash
git log --oneline --decorate --graph --all
```

최근 주요 흐름:

- SHIM AI beta 초기 구축
- 관리자 대시보드와 베타 데이터 흐름 추가
- 테스트 카탈로그와 공개 테스트 4종 추가
- SHIM Diary 오픈
- 모바일 퍼스트 메인페이지 리디자인
- SHIM Services 캐러셀 loop, drag, swipe physics 개선
- SHIM Services 캐러셀 depth-aware motion 추가
- SHIM Services 캐러셀 접근성 상태 보강
- Supabase Auth 및 Diary 계정별 저장 기반 추가
- SHIM Diary 공개 전 감정 선택, draft, 저장, 수정, 삭제 UX 안정화

### 2026-07-23 작업 반영

2026년 7월 23일 작업에서는 메인페이지 `SHIM Services` 캐러셀 완성도를 집중적으로 개선했습니다.

- 짧은 스와이프와 긴 드래그의 이동량을 안정화했습니다.
- 한 번의 제스처로 최대 2장까지만 이동하도록 제한했습니다.
- 강한 spring/bounce 느낌을 줄이고, 현재 위치에서 부드럽게 정착하는 snap motion으로 조정했습니다.
- 카드 중심 거리 기반으로 scale, opacity, translateY, shadow, z-index를 연속 보간하도록 개선했습니다.
- active 카드는 선명하게, adjacent/distant 카드는 뒤로 물러난 느낌이 들도록 공간감을 조정했습니다.
- 모바일과 데스크톱에서 active 카드가 carousel 중심에 정확히 정렬되도록 track offset 보정을 추가했습니다.
- clone 카드가 스크린리더에 중복 노출되지 않도록 접근성 상태를 보강했습니다.
- 현재 카드 위치를 안내하는 hidden live status를 추가했습니다.
- SHIM Diary에서 감정만 저장, 사용자별 draft 분리, 중복 저장 방지, 삭제 확인 모달을 보강했습니다.
- Diary 목록 정렬을 `entry_date desc, created_at desc` 기준으로 맞춰 향후 SHIM Report 연동 준비를 강화했습니다.

관련 최근 커밋:

- `9547390 fix: soften service carousel swipe physics`
- `b3bfdd9 feat: add depth-aware service carousel motion`
- `809d82c fix: improve service carousel accessibility state`

## 19. 기여 또는 운영 참고사항

- 기능 변경 전 현재 라우팅과 데이터 구조를 먼저 확인합니다.
- 구현되지 않은 기능은 README나 UI에서 완료된 기능처럼 표현하지 않습니다.
- 민감정보는 `.env.local` 또는 Vercel Environment Variables에만 보관합니다.
- 커밋 전 `git status`, `git diff`, `npm run build`를 확인합니다.
- 기능 코드와 문서 변경은 가능하면 별도 커밋으로 관리합니다.
- 현재 서비스는 베타 단계이므로 사용자 피드백과 오류 신고 흐름을 운영 지표로 활용합니다.

## 20. 라이선스 및 저작권 안내

현재 저장소에는 별도 `LICENSE` 파일이 포함되어 있지 않습니다. 라이선스가 명시되기 전까지 코드와 콘텐츠의 사용, 배포, 수정 권한은 저장소 소유자의 정책을 따릅니다.

Copyright (c) SHIM.AI. All rights reserved unless otherwise stated.
