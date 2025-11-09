// 서버에서만 실행되도록 설정
import 'server-only';
import { Octokit } from 'octokit';
import { GoogleGenAI } from "@google/genai"; 
import { Buffer } from 'buffer';

// ----------------------------------------------------
// 1. 초기 설정 
// ----------------------------------------------------
const githubToken = process.env.GITHUB_TOKEN;
const owner = "lhaa0130-hash"; // ⚠️ 여기에 사용자님의 GitHub ID를 입력하세요!
const repo = "dori-auto-deploy-v4"; // ⭐️ 변경된 리포지토리 이름으로 수정!
const branch = "main";

// Gemini API 키 설정
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); 

const octokit = new Octokit({ auth: githubToken });

// ----------------------------------------------------
// 2. Gemini에게 Markdown 글 생성 요청하기
// ----------------------------------------------------
async function requestGeminiPost(command: string) {
    const prompt = `
    사용자의 명령을 기반으로 새로운 블로그 포스트를 작성해야 합니다. 
    당신의 응답은 반드시 다음 Markdown 형식과 내용만 포함해야 합니다. 
    **절대 설명이나 추가 텍스트를 포함하지 말고, 오직 완성된 Markdown 파일 내용만 응답하세요.**

    ---
    title: [사용자 명령에 맞는 흥미로운 제목]
    date: '${new Date().toISOString().split('T')[0]}'
    slug: '[제목을 영어 소문자, 하이픈으로 변환]'
    ---

    # [글 제목]

    [여기에 흥미롭고 유익한 블로그 본문을 작성하세요. (최소 3문단)]
    `;

    const result = await model.generateContent(prompt);
    return result.text.trim();
}

// ----------------------------------------------------
// 3. GitHub에 새 파일 커밋하기
// ----------------------------------------------------
async function commitNewFile(markdownContent: string, command: string) {
    // 1. 제목 추출 및 파일 이름 생성
    const titleMatch = markdownContent.match(/title: '(.*)'|title: "(.*)"/);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : "새 글";

    // 파일 이름을 slug로 만듭니다 (예: new-post-title.md)
    const filename = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + '.md';

    const filePath = `content/${filename}`;
    const commitMessage = `Day 7: [AI] ${command} 명령으로 새 글 자동 등록 (${title})`;

    // 2. 내용 인코딩
    const contentEncoded = Buffer.from(markdownContent, 'utf8').toString('base64');

    // 3. GitHub API 호출 (PUT 요청으로 새 파일 생성)
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: filePath,
        message: commitMessage,
        content: contentEncoded,
        branch,
        headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });

    return response.data;
}

// ----------------------------------------------------
// 4. Next.js API의 메인 처리 함수 (POST 요청)
// ----------------------------------------------------
export async function POST(request: Request) {
    try {
        const { command } = await request.json(); 

        if (!command || typeof command !== 'string') {
            return new Response(JSON.stringify({ success: false, error: '유효한 명령(command)' }), { status: 400 });
        }

        // 1. Gemini에게 새 글 생성 요청
        const markdownContent = await requestGeminiPost(command);

        // 2. GitHub에 새 파일 커밋
        const commitResult = await commitNewFile(markdownContent, command);

        return new Response(JSON.stringify({ 
            success: true, 
            message: `새 글이 성공적으로 등록되었습니다. 파일: ${commitResult.content?.name}`,
            vercel_url: `https://dori-auto-deploy-v4.vercel.app` // ⚠️ 주소 확인 필요
        }), { status: 200 });

    } catch (error) {
        console.error("API 처리 중 오류 발생:", error);
        // 500 에러 발생 시, 디버깅을 위해 에러 메시지를 응답에 포함
        return new Response(JSON.stringify({ 
            success: false, 
            error: '서버 처리 오류가 발생했습니다. 로그를 확인하세요.', 
            details: error instanceof Error ? error.message : '알 수 없는 오류' 
        }), { status: 500 });
    }
}
