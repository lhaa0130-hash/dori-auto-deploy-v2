import { getSortedPostsData } from '../lib/getPosts';
import Link from 'next/link';

export default function Home() {
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
      <h1>📚 DORI 블로그</h1>
      <p style={{ marginBottom: '40px' }}>자동 배포 시스템으로 만든 블로그 글 목록</p>

      <section style={{ maxWidth: '600px', width: '100%', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #333', paddingBottom: '5px' }}>글 목록</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPostsData.map(({ slug, date, title }) => (
            <li key={slug} style={{ margin: '15px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              
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
