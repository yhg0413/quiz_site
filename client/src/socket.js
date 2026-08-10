// client/src/socket.js
import { io } from 'socket.io-client';

// 1. 소켓 단일 인스턴스 생성
export const socket = io('http://localhost:4000');

// 2. 브라우저 콘솔(F12)에서도 테스트할 수 있도록 window 객체에 등록
if (typeof window !== 'undefined') {
  window.socket = socket;
}