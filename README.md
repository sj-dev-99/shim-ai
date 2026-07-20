# SHIM AI Beta

SHIM AI는 감정 인식, 자기이해, 회복 습관을 돕는 AI 기반 베타 웹서비스입니다. 현재는 `SHIM Test(심리테스트)` 영역의 `AI 감정·회복 유형 테스트`를 먼저 제공합니다.

> 본 서비스는 의료 상담이나 진단이 아닌 자기이해를 돕기 위한 참고용 콘텐츠입니다.

## 주요 기능

- 서비스 허브 메인 페이지: `/`
- SHIM Test 목록 페이지: `/shim-test`
- 준비중 서비스 페이지: `/talk`, `/diary`, `/report`, `/care`
- AI 감정·회복 유형 테스트 소개: `/mind`
- 12문항 테스트: `/test`
- 점수 기반 4가지 결과 유형: `/result`
- 라이트/다크 모드
- 피드백 보내기, 오류 신고, 만족도, 테스트 종료 의견 수집
- 비밀번호 기반 관리자 페이지: `/admin`
- 현재 버전: `Beta v0.1.4`

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Production 빌드 확인

```bash
npm run build
```

빌드가 성공하면 Vercel에 배포 가능한 상태입니다.

## 환경변수

실제 환경변수 파일은 GitHub에 올리지 않습니다. 로컬에서는 `.env.example`을 참고해 `.env.local`을 만들고, Vercel에서는 Project Settings > Environment Variables에 등록합니다.

```bash
NEXT_PUBLIC_BETA_VERSION="Beta v0.1.4"
BETA_EVENT_WEBHOOK_URL=""
BETA_EVENT_WEBHOOK_TOKEN=""
ADMIN_PASSWORD=""
ADMIN_SESSION_SECRET=""
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_BETA_EVENTS_TABLE="beta_events"
```

주의 사항:

- 브라우저에 노출되어도 되는 값만 `NEXT_PUBLIC_` 접두사를 사용합니다.
- API Key, 토큰, 비밀번호 같은 민감정보에는 `NEXT_PUBLIC_`을 붙이지 않습니다.
- `.env`, `.env.local`, `.env.production.local`, `.next`, `node_modules`는 GitHub에 올리지 않습니다.
- `/admin`은 `ADMIN_PASSWORD`로 보호합니다.
- `ADMIN_SESSION_SECRET`은 긴 랜덤 문자열로 설정하는 것을 권장합니다.

## 베타 데이터 저장

`/api/beta-events`는 페이지뷰, 피드백, 오류 신고, 만족도, 테스트 종료 의견 이벤트를 받습니다.

Supabase 환경변수가 설정되어 있으면 `beta_events` 테이블에 실제 사용자 이벤트를 저장하고, `/admin`은 5초마다 최신 데이터를 다시 읽어 관리자 화면에 반영합니다.

Supabase가 연결되지 않은 상태에서는 관리자 페이지에 샘플 데이터가 표시되며 각 행에 `샘플` 배지가 붙습니다. 실제 DB 연결 후 수집되는 데이터에는 `실제` 배지가 붙습니다.

### Supabase 테이블 예시

Supabase SQL Editor에서 아래 SQL을 실행합니다.

```sql
create table if not exists public.beta_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  visitor_id text,
  version text,
  message text,
  rating text check (rating in ('up', 'down') or rating is null),
  score integer,
  result_type text,
  user_agent text,
  metadata jsonb,
  status text,
  admin_memo text default '',
  created_at timestamptz not null default now()
);

create index if not exists beta_events_created_at_idx
  on public.beta_events (created_at desc);

create index if not exists beta_events_event_type_idx
  on public.beta_events (event_type);
```

Vercel 환경변수에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BETA_EVENTS_TABLE`을 등록한 뒤 재배포하면 실제 저장이 시작됩니다.

## Vercel 배포

1. GitHub repository에 프로젝트를 push합니다.
2. Vercel에서 `New Project`를 선택합니다.
3. `sj-dev-99/shim-ai` repository를 import합니다.
4. Framework Preset은 `Next.js`를 사용합니다.
5. Build Command는 기본값인 `npm run build`를 사용합니다.
6. 필요한 Environment Variables를 등록합니다.
7. Deploy를 실행합니다.

## beta.shim.ai 도메인 연결

Vercel 배포 후:

1. Vercel Project > Settings > Domains로 이동합니다.
2. `beta.shim.ai`를 추가합니다.
3. DNS 제공자에 Vercel이 안내하는 CNAME 레코드를 등록합니다.
4. SSL 발급이 완료되면 `https://beta.shim.ai`로 접속합니다.

권장 DNS 형태:

```text
Type: CNAME
Name: beta
Value: cname.vercel-dns.com
```

## 보안 메모

- API Key와 토큰은 클라이언트 코드에 넣지 않습니다.
- Supabase Service Role Key는 서버 API Route에서만 사용합니다.
- 관리자 페이지는 noindex 처리되어 검색엔진에 노출되지 않도록 설정되어 있습니다.
- 피드백과 오류 신고 입력값은 길이를 제한하고 서버에서 정리해 저장합니다.
