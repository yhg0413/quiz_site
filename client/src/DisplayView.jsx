import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, Radio, BellRing, Sparkles, Award, Crown, CheckCircle2 } from 'lucide-react';
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
  const [awards, setAwards] = useState([]);
  const [statusText, setStatusText] = useState('주제를 선택해 주세요...');
  const [submitStatus, setSubmitStatus] = useState({ submittedCount: 0, totalPlayers: 0 });
  const [choiceResult, setChoiceResult] = useState(null);

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
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
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
      if (data.submittedCount !== undefined) {
        setSubmitStatus({ submittedCount: data.submittedCount, totalPlayers: data.totalPlayers });
      }
      if (data.currentQuestion) {
        setQuestion(data.currentQuestion);
        setStatusText(data.buzzerWinner ? `버저 히트! [${data.buzzerWinner.name}]` : '문제 진행 중!');
      }
    });

    socket.on('QUESTION_STARTED', (qData) => {
      setStatus('QUESTION_ACTIVE');
      setQuestion(qData);
      setHint('');
      setBuzzerWinner(null);
      setChoiceResult(null);
      setSubmitStatus({ submittedCount: 0, totalPlayers: Object.keys(players).length });
      setStatusText('문제 시작!');
    });

    socket.on('ANSWER_SUBMITTED_UPDATE', (info) => setSubmitStatus(info));
    socket.on('HINT_REVEALED', ({ hint: revealedHint }) => setHint(revealedHint));

    socket.on('BUZZER_WINNER_ANNOUNCED', ({ winnerName }) => {
      setStatus('BUZZER_HIT');
      setBuzzerWinner(winnerName);
      setStatusText(`버저 히트! [${winnerName}]`);
      controlYoutubeIframe('PAUSE');
    });

    socket.on('JUDGMENT_RESULT', ({ isCorrect, isSkip, correctAnswer, winnerName, failedPlayerName, players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
      if (isSkip) {
        setStatusText(`패스! 정답: [ ${correctAnswer} ]`);
        setBuzzerWinner(null);
      } else if (isCorrect) {
        setStatusText(`정답입니다! (${winnerName} +10pt)`);
        setBuzzerWinner(null);
        triggerConfetti();
      } else {
        setStatusText(`오답입니다! [${failedPlayerName || '플레이어'}]`);
        setBuzzerWinner(null);
      }
    });

    socket.on('CHOICE_JUDGMENT_RESULT', ({ correctAnswer, results, players: updatedPlayers }) => {
      setStatus('QUESTION_DONE');
      setPlayers(updatedPlayers);
      setChoiceResult({ correctAnswer, results });
      setStatusText('정답 공개 및 채점 완료!');
      triggerConfetti();
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
      setChoiceResult(null);
      setStatusText('주제를 선택해 주세요...');
    });

    // 💡 게임 완주 시 버저 팝업 및 이전 문제 정보 초기화
    socket.on('GAME_FINISHED', ({ players: finalPlayers, awards: finalAwards }) => {
      setStatus('GAME_FINISHED');
      if (finalPlayers) setPlayers(finalPlayers);
      if (finalAwards) setAwards(finalAwards);
      setBuzzerWinner(null);
      setQuestion(null);
      setHint('');
      setChoiceResult(null);
      setStatusText('🎉 모든 문제 완료! 시상식 진행 중!');
      triggerConfetti();
    });

    socket.on('PLAYERS_UPDATED', setPlayers);

    return () => {
      socket.off('ROOM_STATE_SYNC');
      socket.off('QUESTION_STARTED');
      socket.off('ANSWER_SUBMITTED_UPDATE');
      socket.off('HINT_REVEALED');
      socket.off('BUZZER_WINNER_ANNOUNCED');
      socket.off('JUDGMENT_RESULT');
      socket.off('CHOICE_JUDGMENT_RESULT');
      socket.off('YOUTUBE_CONTROL');
      socket.off('YOUTUBE_VOLUME');
      socket.off('RETURN_TO_TOPIC_SELECT');
      socket.off('GAME_FINISHED');
      socket.off('PLAYERS_UPDATED');
    };
  }, [roomId, volume, players]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const hasParam = url.includes('?');
    return `${url}${hasParam ? '&' : '?'}enablejsapi=1&autoplay=0`;
  };

  const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden select-none">
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
            <h1 className="text-4xl font-black text-yellow-400 tracking-wider">화면을 터치하여 사운드를 켜주세요!</h1>
            <p className="text-slate-400 mt-3 text-lg">클릭 시 퀴즈쇼 효과음 및 영상 사운드가 활성화됩니다.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-[3] p-8 border-r border-slate-800 flex flex-col items-center justify-between relative overflow-y-auto">
        <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-black tracking-widest text-slate-300">QUIZ SHOW LIVE</h2>
          </div>
          <div className="bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700 text-sm font-semibold text-slate-400">
            ROOM CODE : <span className="text-yellow-400 font-mono text-base">{roomId}</span>
          </div>
        </div>

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
                    {isDone && <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">완료됨</span>}
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-8 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md">
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG value={playUrl} size={100} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <BellRing className="w-4 h-4" />
                  <span>스마트폰으로 스캔</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">모바일 버저로 게임 참여</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{playUrl}</p>
              </div>
            </div>
          </div>
        )}

        {(status === 'QUESTION_ACTIVE' || status === 'BUZZER_HIT' || status === 'QUESTION_DONE') && question && (
          <div className="flex flex-col items-center justify-center w-full my-auto text-center space-y-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-500/30 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide">
              {question.topicTitle} (Q{question.qIndex + 1}/{question.totalQ}) - [{question.quizType}]
            </span>
            <h2 className="text-4xl font-black text-white max-w-3xl leading-snug tracking-tight">
              Q. {question.title}
            </h2>

            {question.quizType !== 'BUZZER' && status === 'QUESTION_ACTIVE' && (
              <div className="bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 px-6 py-2 rounded-full font-bold text-lg animate-pulse">
                제출 현황: {submitStatus.submittedCount} / {submitStatus.totalPlayers} 명 제출 완료
              </div>
            )}

            <AnimatePresence>
              {hint && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-6 py-2 rounded-full font-black text-2xl tracking-widest shadow-lg">
                  힌트 : {hint}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              {question.mediaType === 'IMAGE' && (
                <img src={question.mediaUrl} alt="quiz" className="max-h-72 rounded-2xl border-2 border-slate-800 shadow-2xl object-cover" />
              )}
              {question.mediaType === 'YOUTUBE_VIDEO' && (
                <iframe ref={iframeRef} width="550" height="300" src={getYoutubeEmbedUrl(question.mediaUrl)} title="youtube-video" frameBorder="0" allow="autoplay; encrypted-media" className="rounded-2xl border-2 border-slate-800 shadow-2xl" />
              )}
              {question.mediaType === 'YOUTUBE_AUDIO' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center w-80 shadow-2xl">
                  <Radio className="w-12 h-12 text-cyan-400 animate-pulse mb-2" />
                  <h3 className="text-cyan-300 font-extrabold text-lg">음악 감상 중 (볼륨: {volume}%)</h3>
                  <iframe ref={iframeRef} width="400" height="300" src={getYoutubeEmbedUrl(question.mediaUrl)} title="youtube-audio" frameBorder="0" allow="autoplay; encrypted-media" className="absolute -top-[9999px] -left-[9999px]" />
                </div>
              )}
            </div>

            {question.quizType !== 'BUZZER' && question.options && (
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mt-4">
                {question.options.map((opt, idx) => {
                  const isCorrectOpt = choiceResult && choiceResult.correctAnswer === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border font-black text-xl text-left flex justify-between items-center ${
                        isCorrectOpt 
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/50 scale-102 ring-4 ring-emerald-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrectOpt && <CheckCircle2 className="w-7 h-7 text-yellow-300" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {status === 'GAME_FINISHED' && (
          <div className="flex flex-col items-center justify-center w-full my-auto py-4 space-y-8">
            <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
                <h2 className="text-3xl font-black text-white tracking-widest">FINAL LEADERBOARD</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => {
                  const player = sortedPlayers[idx];
                  const rankStyles = [
                    { bg: 'bg-gradient-to-b from-yellow-500/20 to-amber-600/30 border-yellow-500/50', badge: '🥇 1st', text: 'text-yellow-400' },
                    { bg: 'bg-gradient-to-b from-slate-400/20 to-slate-600/30 border-slate-400/50', badge: '🥈 2nd', text: 'text-slate-300' },
                    { bg: 'bg-gradient-to-b from-amber-700/20 to-amber-900/30 border-amber-600/50', badge: '🥉 3rd', text: 'text-amber-500' },
                    { bg: 'bg-slate-800/40 border-slate-700/50', badge: '🎖️ 4th', text: 'text-slate-400' }
                  ];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`p-5 rounded-2xl border text-center flex flex-col justify-between items-center shadow-lg ${rankStyles[idx].bg}`}
                    >
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-950/60 text-slate-200 border border-slate-700">
                        {rankStyles[idx].badge}
                      </span>
                      <div className="my-3">
                        <h4 className="text-xl font-black text-white truncate max-w-[150px]">
                          {player ? player.name : '참여자 없음'}
                        </h4>
                        <p className={`text-2xl font-black font-mono mt-1 ${rankStyles[idx].text}`}>
                          {player ? player.score : 0} <span className="text-xs text-slate-500">pt</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="w-full max-w-4xl space-y-4">
              <div className="flex items-center justify-center gap-2 text-indigo-400 font-extrabold text-xl">
                <Award className="w-6 h-6" />
                <span>SPECIAL UNOFFICIAL AWARDS</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {awards.map((award, index) => (
                  <motion.div
                    key={award.id || index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.15 }}
                    className="bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-500/30 p-5 rounded-2xl flex items-center gap-4 shadow-xl relative overflow-hidden"
                  >
                    <div className="text-4xl p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                      {award.icon}
                    </div>
                    <div className="text-left flex-1">
                      <span className="text-xs font-extrabold text-indigo-400 tracking-wider">SPECIAL AWARD</span>
                      <h4 className="text-lg font-black text-yellow-300">{award.title}</h4>
                      <p className="text-white font-black text-base mt-0.5">수상자: <span className="underline decoration-indigo-400">{award.winnerName}</span></p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{award.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 💡 게임 진행 중에만 버저 팝업 노출 */}
        <AnimatePresence>
          {status !== 'GAME_FINISHED' && buzzerWinner && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-rose-600 border-2 border-rose-400 text-white px-10 py-5 rounded-2xl font-black text-3xl shadow-[0_0_50px_rgba(225,29,72,0.6)] flex items-center gap-4 mb-4">
              <BellRing className="w-10 h-10 animate-bounce" />
              <span>{buzzerWinner} 버저 획득!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-slate-600 font-mono">PARK QUIZ SYSTEM v2.0</div>
      </div>

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