import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeView from './HomeView';
import DisplayView from './DisplayView';
import HostView from './HostView';
import PlayerView from './PlayerView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 랜딩 페이지 (방 생성 및 코드 입력) */}
        <Route path="/" element={<HomeView />} />

        {/* 역할별 URL 고정 경로 (:roomId 포함) */}
        <Route path="/host/:roomId" element={<HostView />} />
        <Route path="/display/:roomId" element={<DisplayView />} />
        <Route path="/play/:roomId" element={<PlayerView />} />

        {/* 잘못된 경로 접속 시 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}