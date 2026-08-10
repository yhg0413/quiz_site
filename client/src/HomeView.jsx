import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';

export default function HomeView() {
  const [inputRoomId, setInputRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    socket.emit('CREATE_ROOM', (response) => {
      if (response && response.success) {
        navigate(`/host/${response.roomId}`);
      } else {
        alert('방 생성 실패');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!inputRoomId.trim()) return alert('방 코드를 입력하세요!');
    navigate(`/play/${inputRoomId.trim()}`);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>파티 퀴즈 쇼</h1>
      
      <div style={{ margin: '40px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>진행자(Host)이신가요?</h3>
        <button 
          onClick={handleCreateRoom}
          style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          새로운 퀴즈 방 만들기
        </button>
      </div>

      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>참여자(Player)이신가요?</h3>
        <input 
          type="text" 
          placeholder="방 코드 (예: 1234)" 
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value)}
          style={{ padding: '12px', fontSize: '1.1rem', width: '200px', marginRight: '10px' }}
        />
        <button 
          onClick={handleJoinRoom}
          style={{ padding: '12px 25px', fontSize: '1.1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          입장하기
        </button>
      </div>
    </div>
  );
}