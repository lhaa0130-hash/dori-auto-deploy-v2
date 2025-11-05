// (1) lib/getPosts.ts 에서 만든 글 목록 읽어오는 함수를 가져옵니다.
import { getSortedPostsData } from '../lib/getPosts';
import Link from 'next/link';

// (2) 메인 화면을 만드는 함수입니다.
export default function Home() {
  // 함수를 사용해 정리된 글 목록을 가져옵니다.
  const allPostsData = getSortedPostsData();

  return (
    <main style={{ 
        padding: '50px', 
        textAlign: 'center', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start',
        alignItems: 'center'
    }}>
      {/* 웹사이트의 제목입니다. */}
      <h1>📚 DORI 블로그</h1>
      <p style={{ marginBottom: '40px' }}>자동 배포 시스템으로 만든 블로그 글 목록</p>

      {/* (3) 여기에 글 목록을 하나씩 보여줍니다. */}
      <section style={{ maxWidth: '600px', width: '100%', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #333', paddingBottom: '5px' }}>글 목록</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPostsData.map(({ slug, date, title }) => (
            <li key={slug} style={{ margin: '15px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              
              {/* 글 제목을 클릭하면 상세 페이지로 이동하게 하는 링크입니다. */}
              <Link href={`/post/${slug}`} style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#0070f3', textDecoration: 'none' }}>
                {title}
              </Link>
              <br />
              <small style={{ color: '#666' }}>
                {date}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
