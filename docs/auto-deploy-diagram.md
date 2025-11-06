# 🧠 DORI AI 자동 배포 아키텍처 (Day 5)

## 1. 개요
이 문서는 GPT의 명령이 웹사이트 코드 수정까지 자동으로 이어지는 '자동화 루프'의 구조를 설명합니다. 이 구조를 통해 AI가 웹사이트를 실시간으로 관리할 수 있습니다.

## 2. 자동화 루프 (4단계 순환 구조)

1.  **GPT 명령 (Command)**:
    * **주체**: 사용자 (Siri, 메모, Slack 등) 또는 GPT 자체.
    * **내용**: "새 글을 써줘", "메인 색을 하늘색으로 바꿔줘" 등.
    * **경로**: Next.js의 API 라우트로 명령 전송 (e.g., `/api/publish` 또는 `/api/theme` 호출).

2.  **API Bridge (브리지)**:
    * **파일**: `app/api/[기능]/route.ts`
    * **역할**: GPT 명령을 해석하고, GitHub API를 호출하여 **프로젝트 코드 파일(.md, .css 등)을 직접 수정**합니다.
    * **결과**: 수정된 파일을 GitHub 리포지토리에 **강제로 커밋(Commit & Push)**합니다.

3.  **GitHub Commit & Push**:
    * **역할**: 수정된 코드(새 글 파일 또는 CSS 파일)를 리포지토리의 `main` 브랜치에 저장합니다.
    * **트리거**: Vercel의 자동 배포 시스템을 즉시 트리거합니다.

4.  **Vercel Auto Deploy**:
    * **역할**: GitHub의 새로운 커밋을 감지하여 웹사이트를 자동으로 재빌드하고 배포합니다.
    * **결과**: 웹사이트 주소(`dori-auto-deploy.vercel.app`)에 **수정 사항이 실시간으로 반영**됩니다.

## 3. 핵심 파일 (Day 6, Day 7 목표)

| 파일 이름 | 역할 | Day |
| :--- | :--- | :--- |
| `app/api/publish/route.ts` | **새 글 자동 등록** API 브리지 (GPT 명령 → `.md` 파일 생성) | Day 7 |
| `app/api/theme/route.ts` | **CSS 자동 수정** API 브리지 (GPT 명령 → `.css` 파일 수정) | Day 6 |
