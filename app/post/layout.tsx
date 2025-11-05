import React from 'react';

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 어떤 추가적인 디자인 요소 없이, 글 내용만 그대로 보여줍니다.
    <>{children}</> 
  );
}
