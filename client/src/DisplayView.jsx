import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, Radio, BellRing, Sparkles } from 'lucide-react';
import { socket } from './socket';

export default function DisplayView() {
  const { roomId } = useParams();
  const iframeRef = useRef(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [volume, setVolume] = useState(30);

  const [status, setStatus] = useState('TOPIC_SELECT');
  const [topics, setTopics] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [question, setQuestion] = useState(null);
  const [hint, setHint] = useState('');
  const [buzzerWinner, setBuzzerWinner] = useState(null);
  const [players, setPlayers] = useState({});
  const [statusText, setStatusText] = useState('방장의 주제 선택을 기다리는 중...');

  const playUrl = `${window.location.origin}/play/${roomId}`;

  const handleUnlockAudio = () => {
    setAudioUnlocked(true);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  const controlYoutubeIframe = (action, value) => {
    if (!iframeRef.current) return;
    const win = iframeRef.current.contentWindow;

    if (action === 'PLAY') {
      win.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      win.postMessage(`{"event":"command","func":"setVolume","args":[${value || volume}]}`, '*');
    } else if (action === 'PAUSE') {
      win.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    } else if (action === 'REPLAY') {
      win.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
      win.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    } else if (action === 'SET_VOLUME') {
      win.postMessage(`{"event":"command","func":"setVolume","args":[${value}]}`, '*');
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (!roomId) return;

    socket.emit('JOIN_ROOM', { roomId, role: 'DISPLAY' });

    socket.on('ROOM_STATE_SYNC', (data) => {
      setStatus(data.status);
      if (data.topics) setTopics(data.topics);
      if (data.completedTopics) setCompletedTopics(data.completedTopics);
      if (data.players) setPlayers(data.players);
      if (data.buzzerWinner) setBuzzerWinner(data.buzzerWinner.name);

      if (data.currentQuestion) {
        setQuestion(data.currentQuestion);
        setStatusText(data.buzzerWinner ? `🔥 [${data.buzzerWinner.name}] 님 정답 기회!` : '🚨 버저 활성화!');
      }
    });

    socket.on('QUESTION_STARTED', (qData) => {
      setStatus('QUESTION_ACTIVE');
      setQuestion(qData);
      setHint('');
      setBuzzerWinner(null);
      setStatusText('🚨 버저 활성화! 먼저 누르세요!');
    });

    socket.on('HINT_REVEALED', ({ hint: revealedHint }) => {
      setHint(revealedHint);
    });

    socket.on('BUZZER_WINNER_ANNOUNCED', ({ winnerName }) => {
      setStatus('BUZZER_HIT');
      setBuzzerWinner(winnerName);
      setStatusText(`🔥 [${winnerName}] 님 정답 기회!`);
      controlYoutubeIframe('PAUSE');
    });

    socket.on('JUDGMENT_RESULT', ({ isCorrect, isSkip, correctAnswer, winnerName, failedPlayerName, players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
      if (isSkip) {
        setStatusText(`⏭️ 문제 스킵! 정답: [ ${correctAnswer} ]`);
        setBuzzerWinner(null);
      } else if (isCorrect) {
        setStatusText(`🎉 정답입니다! (${winnerName} +10점)`);
        setBuzzerWinner(null);
        triggerConfetti(); // 🎆 폭죽 애니메이션 실행
      } else {
        setStatusText(`❌ [${failedPlayerName || '참여자'}] 님 오답! (다른 참여자 재버저 가능)`);
        setBuzzerWinner(null);
      }
    });

    socket.on('YOUTUBE_CONTROL', ({ action }) => controlYoutubeIframe(action, volume));
    socket.on('YOUTUBE_VOLUME', ({ volume: newVolume }) => {
      setVolume(newVolume);
      controlYoutubeIframe('SET_VOLUME', newVolume);
    });

    socket.on('RETURN_TO_TOPIC_SELECT', ({ topics: updatedTopics, completedTopics: updatedCompleted }) => {
      setStatus('TOPIC_SELECT');
      setTopics(updatedTopics);
      setCompletedTopics(updatedCompleted);
      setQuestion(null);
      setHint('');
      setBuzzerWinner(null);
      setStatusText('방장의 다음 주제 선택을 기다리는 중...');
    });

    socket.on('PLAYERS_UPDATED', setPlayers);

    return () => {
      socket.off('ROOM_STATE_SYNC');
      socket.off('QUESTION_STARTED');
      socket.off('HINT_REVEALED');
      socket.off('BUZZER_WINNER_ANNOUNCED');
      socket.off('JUDGMENT_RESULT');
      socket.off('YOUTUBE_CONTROL');
      socket.off('YOUTUBE_VOLUME');
      socket.off('RETURN_TO_TOPIC_SELECT');
      socket.off('PLAYERS_UPDATED');
    };
  }, [roomId, volume]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const hasParam = url.includes('?');
    return `${url}${hasParam ? '&' : '?'}enablejsapi=1&autoplay=0`;
  };

  const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* 🔊 오디오 언락 오버레이 */}
      <AnimatePresence>
        {!audioUnlocked && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={handleUnlockAudio}
            className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-center items-center cursor-pointer border-4 border-yellow-500/50"
          >
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="bg-yellow-500/20 p-8 rounded-full mb-6">
              <Volume2 className="w-24 h-24 text-yellow-400" />
            </motion.div>
            <h1 className="text-4xl font-black text-yellow-400 tracking-wider">화면을 터치하여 사운드를 활성화하세요!</h1>
            <p className="text-slate-400 mt-3 text-lg">브라우저 자동재생 방지 정책을 해제합니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 왼쪽 메인 화면 영역 */}
      <div className="flex-[3] p-8 border-r border-slate-800 flex flex-col items-center justify-between relative">
        <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-black tracking-widest text-slate-300">QUIZ SHOW LIVE</h2>
          </div>
          <div className="bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700 text-sm font-semibold text-slate-400">
            ROOM CODE : <span className="text-yellow-400 font-mono text-base">{roomId}</span>
          </div>
        </div>

        {/* 상태 메시지 헤더 */}
        <div className="my-4 text-center">
          <motion.h1 
            key={statusText}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-extrabold text-yellow-400 tracking-tight drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"
          >
            {statusText}
          </motion.h1>
        </div>

        {/* 콘텐츠 1: 주제 선택 화면 */}
        {status === 'TOPIC_SELECT' && (
          <div className="flex flex-col items-center justify-center w-full my-auto">
            <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
              {topics.map((t) => {
                const isDone = completedTopics.includes(t.id);
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: isDone ? 1 : 1.02 }}
                    className={`p-8 rounded-2xl text-center border font-extrabold text-2xl relative shadow-xl ${
                      isDone 
                        ? 'bg-slate-900/50 border-slate-800 text-slate-600' 
                        : 'bg-gradient-to-br from-indigo-600 to-blue-700 border-indigo-400/30 text-white shadow-indigo-500/20'
                    }`}
                  >
                    {t.title}
                    {isDone && (
                      <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                        완료됨
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* QR 코드 카드 */}
            <div className="mt-8 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md">
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG value={playUrl} size={100} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <BellRing className="w-4 h-4" />
                  <span>스마트폰 카메라로 스캔</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">모바일 버저 라운지 입장</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{playUrl}</p>
              </div>
            </div>
          </div>
        )}

        {/* 콘텐츠 2: 문제 카드 */}
        {(status === 'QUESTION_ACTIVE' || status === 'BUZZER_HIT' || status === 'QUESTION_DONE') && question && (
          <div className="flex flex-col items-center justify-center w-full my-auto text-center">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-500/30 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide mb-3">
              {question.topicTitle} (Q{question.qIndex + 1}/{question.totalQ})
            </span>
            <h2 className="text-4xl font-black text-white max-w-3xl leading-snug tracking-tight mb-4">
              Q. {question.title}
            </h2>

            {/* 초성 힌트 바 */}
            <AnimatePresence>
              {hint && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-6 py-2 rounded-full font-black text-2xl mb-4 tracking-widest shadow-lg"
                >
                  💡 힌트 : {hint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 미디어 렌더링 */}
            <div className="relative mt-2">
              {question.mediaType === 'IMAGE' && (
                <img src={question.mediaUrl} alt="quiz" className="max-h-80 rounded-2xl border-2 border-slate-800 shadow-2xl object-cover" />
              )}
              {question.mediaType === 'YOUTUBE_VIDEO' && (
                <iframe ref={iframeRef} width="600" height="330" src={getYoutubeEmbedUrl(question.mediaUrl)} title="youtube-video" frameBorder="0" allow="autoplay; encrypted-media" className="rounded-2xl border-2 border-slate-800 shadow-2xl" />
              )}
              {question.mediaType === 'YOUTUBE_AUDIO' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center w-96 shadow-2xl">
                  <Radio className="w-16 h-16 text-cyan-400 animate-pulse mb-3" />
                  <h3 className="text-cyan-300 font-extrabold text-xl">음악 재생 중 (볼륨: {volume}%)</h3>
                  <p className="text-xs text-slate-500 mt-2">방장의 재생 리모컨 신호를 대기하고 있습니다.</p>
                  <iframe ref={iframeRef} width="400" height="300" src={getYoutubeEmbedUrl(question.mediaUrl)} title="youtube-audio" frameBorder="0" allow="autoplay; encrypted-media" className="absolute -top-[9999px] -left-[9999px]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 버저 성공 팝업 */}
        <AnimatePresence>
          {buzzerWinner && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-rose-600 border-2 border-rose-400 text-white px-10 py-5 rounded-2xl font-black text-3xl shadow-[0_0_50px_rgba(225,29,72,0.6)] flex items-center gap-4 mb-4"
            >
              <BellRing className="w-10 h-10 animate-bounce" />
              <span>{buzzerWinner} 님이 버저를 눌렀습니다!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-slate-600 font-mono">PARK QUIZ SYSTEM v2.0</div>
      </div>

      {/* 오른쪽 스코어보드 영역 */}
      <div className="flex-1 bg-slate-900/60 p-6 flex flex-col border-l border-slate-800/80">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="font-black text-lg text-slate-200 tracking-wider">SCOREBOARD</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {sortedPlayers.map((p, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  idx === 0 ? 'bg-yellow-500 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-200">{p.name}</span>
              </div>
              <strong className="text-emerald-400 font-mono text-lg">{p.score} <span className="text-xs text-slate-500">pt</span></strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}