import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Zap, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
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

  const [quizType, setQuizType] = useState('BUZZER');
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [btnState, setBtnState] = useState('LOCKED');
  const [statusMessage, setStatusMessage] = useState('기다리는 중...');

  useEffect(() => {
    if (!joined || !roomId) return;
    socket.emit('JOIN_ROOM', { roomId, role: 'PLAYER', playerId, playerName: name });

    socket.on('ROOM_STATE_SYNC', (data) => {
      if (data.currentQuestion) {
        setQuizType(data.currentQuestion.quizType || 'BUZZER');
        setOptions(data.currentQuestion.options || []);
      }
      if (data.status === 'QUESTION_ACTIVE') {
        setBtnState('ACTIVE');
        setStatusMessage('문제 진행 중!');
      } else {
        setBtnState('LOCKED');
        setStatusMessage('기다리는 중...');
      }
    });

    socket.on('QUESTION_STARTED', (qData) => {
      setQuizType(qData.quizType || 'BUZZER');
      setOptions(qData.options || []);
      setSelectedAnswer(null);
      setBtnState('ACTIVE');
      setStatusMessage('문제 시작!');
    });

    socket.on('BUZZER_WINNER_ANNOUNCED', ({ winnerPlayerId }) => {
      if (winnerPlayerId === playerId) {
        setBtnState('WINNER');
        setStatusMessage('버저 성공! TV 화면을 보고 답해주세요!');
      } else {
        setBtnState('LOCKED');
        setStatusMessage('다른 플레이어가 버저를 눌렀습니다.');
      }
    });

    socket.on('MY_ANSWER_SUBMITTED', ({ selected }) => {
      setSelectedAnswer(selected);
      setStatusMessage('답안 제출 완료! TV 화면 결과를 기다리세요.');
    });

    socket.on('JUDGMENT_RESULT', ({ isCorrect, isSkip, failedPlayerId }) => {
      if (isSkip) {
        setBtnState('LOCKED');
        setStatusMessage('문제 패스됨.');
      } else if (!isCorrect) {
        if (failedPlayerId === playerId) {
          setBtnState('BANNED');
          setStatusMessage('오답입니다! 3초간 버저가 잠깁니다.');
        } else {
          setBtnState((prev) => (prev === 'BANNED' ? 'BANNED' : 'ACTIVE'));
        }
      } else {
        setBtnState('LOCKED');
        setStatusMessage('정답이 나왔습니다!');
      }
    });

    socket.on('CHOICE_JUDGMENT_RESULT', ({ results }) => {
      setBtnState('LOCKED');
      const myRes = results[playerId];
      if (myRes) {
        setStatusMessage(myRes.isCorrect ? '🎉 정답입니다! (+10pt)' : '❌ 오답입니다!');
      } else {
        setStatusMessage('채점이 완료되었습니다.');
      }
    });

    socket.on('PLAYER_PENALTY_EXPIRED', ({ playerId: expiredPlayerId }) => {
      if (expiredPlayerId === playerId) {
        setBtnState((prev) => (prev === 'BANNED' ? 'ACTIVE' : prev));
        setStatusMessage('버저 해제!');
      }
    });

    socket.on('RETURN_TO_TOPIC_SELECT', () => {
      setBtnState('LOCKED');
      setSelectedAnswer(null);
      setStatusMessage('주제 선택 중...');
    });

    socket.on('GAME_FINISHED', () => {
      setBtnState('LOCKED');
      setSelectedAnswer(null);
      setStatusMessage('🎉 모든 퀴즈가 종료되었습니다!');
    });

    return () => {
      socket.off('ROOM_STATE_SYNC');
      socket.off('QUESTION_STARTED');
      socket.off('BUZZER_WINNER_ANNOUNCED');
      socket.off('MY_ANSWER_SUBMITTED');
      socket.off('JUDGMENT_RESULT');
      socket.off('CHOICE_JUDGMENT_RESULT');
      socket.off('PLAYER_PENALTY_EXPIRED');
      socket.off('RETURN_TO_TOPIC_SELECT');
      socket.off('GAME_FINISHED');
    };
  }, [joined, roomId, playerId, name]);

  const handleJoin = () => {
    if (name.trim()) {
      sessionStorage.setItem('quiz_playerName', name.trim());
      setJoined(true);
    }
  };

  const handleBuzzerClick = () => {
    if (quizType === 'BUZZER') {
      socket.emit('PRESS_BUZZER', { roomId: String(roomId), playerId });
    }
  };

  const handleChoiceClick = (idx) => {
    if (btnState === 'ACTIVE' && quizType !== 'BUZZER') {
      socket.emit('SUBMIT_ANSWER', { roomId: String(roomId), playerId, answerIndex: idx });
    }
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 font-sans">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="bg-rose-600/20 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-1">플레이어 입장</h2>
          <p className="text-slate-400 text-xs mb-6">ROOM CODE : <span className="text-yellow-400 font-mono font-bold">{roomId}</span></p>
          <input 
            type="text" 
            placeholder="닉네임 입력 (예: 홍길동)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3.5 rounded-xl font-bold text-center focus:outline-none focus:border-rose-500 mb-4"
          />
          <button 
            onClick={handleJoin} 
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl shadow-lg transition active:scale-95"
          >
            퀴즈 참가하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 transition-colors duration-300 flex flex-col justify-between items-center p-6 select-none font-sans overflow-hidden">
      <div className="w-full flex items-center justify-between bg-slate-900/60 backdrop-blur-md border border-slate-800 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300">
        <span>플레이어 : <strong className="text-yellow-400">{name}</strong></span>
        <span className="font-mono text-slate-500">ROOM: {roomId}</span>
      </div>

      {quizType === 'BUZZER' && (
        <div onClick={handleBuzzerClick} className="flex flex-col items-center justify-center my-auto cursor-pointer">
          <motion.button
            whileTap={btnState === 'ACTIVE' ? { scale: 0.92, y: 10 } : {}}
            className={`
              w-64 h-64 rounded-full font-black text-4xl text-white flex flex-col items-center justify-center gap-2
              shadow-2xl transition-all duration-100 border-b-8 active:border-b-0
              ${btnState === 'ACTIVE' ? 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-900 shadow-rose-600/50 animate-pulse' : ''}
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
      )}

      {quizType === 'CHOICE' && (
        <div className="w-full max-w-sm my-auto space-y-3">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button
                key={idx}
                disabled={btnState !== 'ACTIVE'}
                onClick={() => handleChoiceClick(idx)}
                className={`w-full p-5 rounded-2xl font-black text-lg flex items-center justify-between border-2 transition ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-102' 
                    : 'bg-slate-900 border-slate-800 text-slate-200 active:scale-98'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-6 h-6 text-yellow-400" />}
              </button>
            );
          })}
        </div>
      )}

      {quizType === 'OX' && (
        <div className="w-full max-w-sm my-auto grid grid-cols-2 gap-4">
          {['O', 'X'].map((label, idx) => {
            const isSelected = selectedAnswer === idx;
            const colorClass = idx === 0 ? 'from-blue-600 to-blue-800' : 'from-rose-600 to-rose-800';
            return (
              <button
                key={idx}
                disabled={btnState !== 'ACTIVE'}
                onClick={() => handleChoiceClick(idx)}
                className={`h-48 rounded-3xl font-black text-6xl text-white border-4 flex flex-col items-center justify-center gap-2 shadow-2xl transition ${
                  isSelected ? 'border-yellow-400 scale-105' : 'border-slate-800'
                } bg-gradient-to-b ${colorClass}`}
              >
                <span>{label}</span>
                {isSelected && <span className="text-xs text-yellow-300 font-sans">선택됨</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full text-center bg-slate-900/80 border border-slate-800 py-4 px-6 rounded-2xl">
        <p className="text-sm font-bold text-slate-200">{statusMessage}</p>
      </div>
    </div>
  );
}