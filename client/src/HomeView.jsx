import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeView() {
  const [inputRoomId, setInputRoomId] = useState('');
  const navigate = useNavigate();

  // 방장: 랜덤 4자리 방 코드 생성 후 Host 화면으로 이동
  const handleCreateRoom = () => {
    socket.emit('CREATE_ROOM', (response) => {
      if (response && response.success) {
        console.log(`방 생성 성공: ${response.roomId}`);
        // 서버에서 할당받은 roomId로 Host 페이지 이동
        navigate(`/host/${response.roomId}`);
      } else {
        alert('방 생성에 실패했습니다. 다시 시도해 주세요.');
      }
    });
  };

  // 참여자: 입력한 방 코드로 Mobile Player 화면 이동
  const handleJoinRoom = () => {
    if (!inputRoomId.trim()) return alert('방 코드를 입력해주세요!');
    navigate(`/play/${inputRoomId.trim()}`);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🎯 스피드 버저 퀴즈쇼</h1>
      
      <div style={{ margin: '40px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>👑 방장(진행자)이신가요?</h3>
        <button 
          onClick={handleCreateRoom}
          style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          새로운 퀴즈방 생성하기
        </button>
      </div>

      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>📱 퀴즈 참여자이신가요?</h3>
        <input 
          type="text" 
          placeholder="방 코드 4자리 (예: 1234)" 
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