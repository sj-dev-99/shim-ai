# SHIM AI Beta

SHIM AI는 감정 인식, 자기이해, 회복 습관을 돕는 AI 기반 베타 웹서비스입니다. 현재는 심리테스트 영역인 `SHIM Test(심리테스트)`를 먼저 제공하며, 이후 `SHIM Talk`, `SHIM Diary`, `SHIM Report`, `SHIM Care` 같은 기능을 순차적으로 확장할 예정입니다.

> 본 서비스는 의료 상담이나 진단이 아닌 자기이해를 돕기 위한 참고용 콘텐츠입니다.

## 주요 기능

- 서비스 허브 메인 페이지: `/`
- SHIM Test 소개 페이지: `/mind`
- AI 감정·회복 유형 테스트: `/test`
- 점수 기반 4가지 결과 유형: `/result`
- 라이트/다크 모드
- 모바일 우선 반응형 UI
- 베타 테스트 도구: 피드백 보내기, 오류 신고
- 버전 표시: `Beta v0.1.1`
- 방문자/페이지뷰 이벤트 로그 API
- AI 답변 만족도
- 테스트 종료 후 의견 작성
- 비밀번호 기반 관리자 페이지: `/admin`

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

실제 환경변수 파일은 GitHub에 올리지 않습니다. 로컬에서는 `.env.example`을 참고해 `.env.local`을 만들고, 배포 환경에서는 Vercel Project Settings의 Environment Variables에 등록합니다.

```bash
NEXT_PUBLIC_BETA_VERSION="Beta v0.1.1"
BETA_EVENT_WEBHOOK_URL=""
BETA_EVENT_WEBHOOK_TOKEN=""
ADMIN_PASSWORD=""
ADMIN_SESSION_SECRET=""
```

주의 사항:

- 브라우저에 노출되어도 되는 값만 `NEXT_PUBLIC_` 접두사를 사용합니다.
- API Key, 토큰, 비밀번호 같은 민감정보에는 `NEXT_PUBLIC_`을 붙이지 않습니다.
- `.env`, `.env.local`, `.env.production.local` 등 실제 환경변수 파일은 `.gitignore`로 제외합니다.
- `/admin` 관리자 페이지는 `ADMIN_PASSWORD`로 보호합니다.
- `ADMIN_SESSION_SECRET`은 관리자 세션 쿠키 서명에 쓰는 긴 랜덤 문자열로 설정하는 것을 권장합니다.

## 베타 이벤트 로그

`/api/beta-events`는 페이지뷰, 피드백, 오류 신고, 만족도, 테스트 종료 의견 이벤트를 받습니다.

기본 동작:

- Vercel Function Logs에 이벤트를 기록합니다.
- `BETA_EVENT_WEBHOOK_URL`이 설정되어 있으면 서버에서 해당 URL로 이벤트를 전달합니다.
- `BETA_EVENT_WEBHOOK_TOKEN`이 설정되어 있으면 `Authorization: Bearer ...` 헤더를 추가합니다.

장기 저장이 필요하면 Vercel KV, Supabase, Airtable, Google Sheets Webhook 등으로 `BETA_EVENT_WEBHOOK_URL`을 연결하면 됩니다.

## Vercel 배포

1. GitHub repository에 프로젝트를 push합니다.
2. Vercel에서 `New Project`를 선택합니다.
3. `sj-dev-99/shim-ai` repository를 import합니다.
4. Framework Preset은 `Next.js`로 설정합니다.
5. Build Command는 기본값인 `npm run build`를 사용합니다.
6. 필요한 Environment Variables를 등록합니다.
7. Deploy를 실행합니다.

## beta.shim.ai 도메인 연결

Vercel 배포 후:

1. Vercel Project > Settings > Domains로 이동합니다.
2. `beta.shim.ai`를 추가합니다.
3. DNS 제공자에서 Vercel이 안내하는 CNAME 레코드를 등록합니다.
4. SSL 발급이 완료되면 `https://beta.shim.ai`로 접속합니다.

권장 DNS 형태:

```text
Type: CNAME
Name: beta
Value: cname.vercel-dns.com
```

## 보안 메모

- API Key와 토큰은 클라이언트 코드에 넣지 않습니다.
- 서버 API 라우트에서만 비밀 환경변수를 읽습니다.
- 피드백과 오류 신고 입력값은 길이를 제한하고 서버에서 정리해 기록합니다.
- 민감정보가 포함된 `.env*` 파일, 빌드 결과물, `node_modules`는 GitHub에 올리지 않습니다.
