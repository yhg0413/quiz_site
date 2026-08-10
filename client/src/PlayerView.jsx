import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { socket } from './socket';

export default function PlayerView() {
  const { roomId } = useParams();

  const [playerId] = useState(() => {
    let savedId = sessionStorage.getItem('quiz_playerId');
    if (!savedId) {
      savedId = 'player_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('quiz_playerId', savedId);
    }
    return savedId;
  });

  const [name, setName] = useState(() => sessionStorage.getItem('quiz_playerName') || '');
  const [joined, setJoined] = useState(() => !!sessionStorage.getItem('quiz_playerName'));
  const [btnState, setBtnState] = useState('LOCKED');
  const [statusMessage, setStatusMessage] = useState('방장의 주제 선택을 기다리는 중...');

  useEffect(() => {
    if (!joined || !roomId) return;

    socket.emit('JOIN_ROOM', { roomId, role: 'PLAYER', playerId, playerName: name });

    socket.on('ROOM_STATE_SYNC', (data) => {
      if (data.status === 'QUESTION_ACTIVE') {
        if (data.buzzerWinner) {
          if (data.buzzerWinner.playerId === playerId) {
            setBtnState('WINNER');
            setStatusMessage('정답 기회! TV를 보고 말씀하세요!');
          } else {
            setBtnState('LOCKED');
            setStatusMessage('다른 플레이어가 답변 중입니다.');
          }
        } else {
          setBtnState('ACTIVE');
          setStatusMessage('화면의 대형 버저를 누르세요!');
        }
      } else {
        setBtnState('LOCKED');
        setStatusMessage('방장의 진행을 기다리는 중...');
      }
    });

    socket.on('QUESTION_STARTED', () => {
      setBtnState('ACTIVE');
      setStatusMessage('화면의 대형 버저를 누르세요!');
    });

    socket.on('BUZZER_WINNER_ANNOUNCED', ({ winnerPlayerId }) => {
      if (winnerPlayerId === playerId) {
        setBtnState('WINNER');
        setStatusMessage('정답 기회! TV를 보고 말씀하세요!');
      } else {
        setBtnState('LOCKED');
        setStatusMessage('다른 플레이어가 답변 중입니다.');
      }
    });

    socket.on('JUDGMENT_RESULT', ({ isCorrect, isSkip, failedPlayerId }) => {
      if (isSkip) {
        setBtnState('LOCKED');
        setStatusMessage('문제가 스킵되었습니다.');
      } else if (!isCorrect) {
        if (failedPlayerId === playerId) {
          setBtnState('BANNED');
          setStatusMessage('오답! 3초간 버저 잠금 페널티');
        } else {
          setBtnState((prev) => (prev === 'BANNED' ? 'BANNED' : 'ACTIVE'));
          setStatusMessage((prev) => (prev === 'BANNED' ? '오답! 3초간 버저 잠금 페널티' : '즉시 버저 누르기 가능!'));
        }
      } else {
        setBtnState('LOCKED');
        setStatusMessage('정답입니다! 다음 문제를 기다리세요.');
      }
    });

    socket.on('PLAYER_PENALTY_EXPIRED', ({ playerId: expiredPlayerId }) => {
      if (expiredPlayerId === playerId) {
        setBtnState((prev) => (prev === 'BANNED' ? 'ACTIVE' : prev));
        setStatusMessage('페널티 종료! 다시 누르세요!');
      }
    });

    socket.on('RETURN_TO_TOPIC_SELECT', () => {
      setBtnState('LOCKED');
      setStatusMessage('주제 완료! 다음 주제 선택을 기다리는 중...');
    });

    return () => {
      socket.off('ROOM_STATE_SYNC');
      socket.off('QUESTION_STARTED');
      socket.off('BUZZER_WINNER_ANNOUNCED');
      socket.off('JUDGMENT_RESULT');
      socket.off('PLAYER_PENALTY_EXPIRED');
      socket.off('RETURN_TO_TOPIC_SELECT');
    };
  }, [joined, roomId, playerId, name]);

  const handleJoin = () => {
    if (name.trim()) {
      sessionStorage.setItem('quiz_playerName', name.trim());
      setJoined(true);
    }
  };

  const handleBuzzerClick = () => {
    if (btnState === 'ACTIVE') {
      socket.emit('PRESS_BUZZER', { roomId: String(roomId), playerId });
    }
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 font-sans">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="bg-rose-600/20 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-1">버저 모바일 접속</h2>
          <p className="text-slate-400 text-xs mb-6">방 코드: <span className="text-yellow-400 font-mono font-bold">{roomId}</span></p>

          <input 
            type="text" 
            placeholder="닉네임 입력 (예: 개발자A)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3.5 rounded-xl font-bold text-center focus:outline-none focus:border-rose-500 mb-4"
          />

          <button 
            onClick={handleJoin} 
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl shadow-lg transition active:scale-95"
          >
            퀴즈 입장하기
          </button>
        </div>
      </div>
    );
  }

  // 버저 상태별 배경색
  const getContainerBg = () => {
    if (btnState === 'ACTIVE') return 'bg-rose-950';
    if (btnState === 'WINNER') return 'bg-emerald-950';
    if (btnState === 'BANNED') return 'bg-amber-950';
    return 'bg-slate-950';
  };

  return (
    <div 
      onClick={handleBuzzerClick}
      className={`h-screen ${getContainerBg()} transition-colors duration-300 flex flex-col justify-between items-center p-6 select-none font-sans overflow-hidden`}
    >
      <div className="w-full flex items-center justify-between bg-slate-900/60 backdrop-blur-md border border-slate-800 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300">
        <span>플레이어: <strong className="text-yellow-400">{name}</strong></span>
        <span className="font-mono text-slate-500">ROOM: {roomId}</span>
      </div>

      {/* 대형 입체 3D 아케이드 버튼 */}
      <div className="flex flex-col items-center justify-center my-auto">
        <motion.button
          whileTap={btnState === 'ACTIVE' ? { scale: 0.92, y: 10 } : {}}
          className={`
            w-64 h-64 rounded-full font-black text-4xl text-white flex flex-col items-center justify-center gap-2
            shadow-2xl transition-all duration-100 border-b-8 active:border-b-0
            ${btnState === 'ACTIVE' ? 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-900 shadow-rose-600/50 cursor-pointer animate-pulse' : ''}
            ${btnState === 'WINNER' ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-900 shadow-emerald-600/50' : ''}
            ${btnState === 'BANNED' ? 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-950 shadow-amber-700/50' : ''}
            ${btnState === 'LOCKED' ? 'bg-slate-800 border-slate-950 text-slate-600 shadow-none' : ''}
          `}
        >
          {btnState === 'ACTIVE' && <Zap className="w-16 h-16 fill-current" />}
          {btnState === 'WINNER' && <CheckCircle2 className="w-16 h-16" />}
          {btnState === 'BANNED' && <AlertTriangle className="w-16 h-16" />}
          {btnState === 'LOCKED' && <Lock className="w-12 h-12" />}

          <span>
            {btnState === 'ACTIVE' && 'PRESS!'}
            {btnState === 'WINNER' && 'SUCCESS'}
            {btnState === 'BANNED' && 'HOLD'}
            {btnState === 'LOCKED' && 'WAIT'}
          </span>
        </motion.button>
      </div>

      {/* 하단 안내 텍스트 */}
      <div className="w-full text-center bg-slate-900/80 border border-slate-800 py-4 px-6 rounded-2xl">
        <p className="text-sm font-bold text-slate-200">{statusMessage}</p>
      </div>
    </div>
  );
}