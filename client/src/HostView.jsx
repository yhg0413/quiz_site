import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, RotateCcw, Volume2, CheckCircle, XCircle, FastForward, Lightbulb } from 'lucide-react';
import { socket } from './socket';

export default function HostView() {
  const { roomId } = useParams();
  const [status, setStatus] = useState('TOPIC_SELECT');
  const [topics, setTopics] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [answerInfo, setAnswerInfo] = useState(null);
  const [buzzerWinner, setBuzzerWinner] = useState(null);
  const [volume, setVolume] = useState(30);

  useEffect(() => {
    if (!roomId) return;

    socket.emit('JOIN_ROOM', { roomId, role: 'HOST' });

    socket.on('ROOM_STATE_SYNC', (data) => {
      setStatus(data.status);
      if (data.topics) setTopics(data.topics);
      if (data.completedTopics) setCompletedTopics(data.completedTopics);
      if (data.buzzerWinner) setBuzzerWinner(data.buzzerWinner.name);

      if (data.currentQuestion && data.currentAnswer) {
        setAnswerInfo({
          topicTitle: data.currentQuestion.topicTitle,
          qIndex: data.currentQuestion.qIndex,
          totalQ: data.currentQuestion.totalQ,
          mediaType: data.currentQuestion.mediaType,
          answer: data.currentAnswer,
          hint: data.currentHint
        });
      }
    });

    socket.on('HOST_QUESTION_INFO', (info) => {
      setStatus('QUESTION_ACTIVE');
      setAnswerInfo(info);
      setBuzzerWinner(null);
    });

    socket.on('BUZZER_WINNER_ANNOUNCED', ({ winnerName }) => {
      setBuzzerWinner(winnerName);
    });

    socket.on('JUDGMENT_RESULT', ({ isCorrect, isSkip }) => {
      if (isCorrect || isSkip) setStatus('QUESTION_DONE');
      setBuzzerWinner(null);
    });

    socket.on('RETURN_TO_TOPIC_SELECT', ({ topics: updatedTopics, completedTopics: updatedCompleted }) => {
      setStatus('TOPIC_SELECT');
      setTopics(updatedTopics);
      setCompletedTopics(updatedCompleted);
      setAnswerInfo(null);
      setBuzzerWinner(null);
    });

    return () => {
      socket.off('ROOM_STATE_SYNC');
      socket.off('HOST_QUESTION_INFO');
      socket.off('BUZZER_WINNER_ANNOUNCED');
      socket.off('JUDGMENT_RESULT');
      socket.off('RETURN_TO_TOPIC_SELECT');
    };
  }, [roomId]);

  const handleSelectTopic = (topicId) => socket.emit('SELECT_TOPIC', { roomId: String(roomId), topicId });
  const handleNextQuestion = () => socket.emit('NEXT_QUESTION', { roomId: String(roomId) });
  const handleJudge = (isCorrect) => socket.emit('JUDGE_ANSWER', { roomId: String(roomId), isCorrect });
  const handleShowHint = () => socket.emit('SHOW_HINT', { roomId: String(roomId) });

  const handleSkipQuestion = () => {
    if (window.confirm('이 문제를 스킵하시겠습니까?')) {
      socket.emit('SKIP_QUESTION', { roomId: String(roomId) });
    }
  };

  const handleControlYoutube = (action) => socket.emit('CONTROL_YOUTUBE', { roomId: String(roomId), action });
  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    socket.emit('SET_VOLUME', { roomId: String(roomId), volume: newVol });
  };

  const isYoutubeType = answerInfo?.mediaType?.startsWith('YOUTUBE');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🎛️ HOST CONTROL CONSOLE
          </h1>
          <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-yellow-400">
            ROOM: {roomId}
          </span>
        </header>

        {/* 1. 주제 선택 */}
        {status === 'TOPIC_SELECT' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black text-slate-200 mb-4">📢 다음 출제할 주제를 선택하세요</h2>
            <div className="grid grid-cols-2 gap-4">
              {topics.map((t) => {
                const isDone = completedTopics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    disabled={isDone}
                    onClick={() => handleSelectTopic(t.id)}
                    className={`p-5 rounded-xl font-bold text-left transition ${
                      isDone 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer'
                    }`}
                  >
                    <div className="text-lg">{t.title}</div>
                    <div className="text-xs opacity-70 mt-1">{isDone ? '완료됨' : `${t.totalQuestions} 문제`}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. 문제 진행 */}
        {(status === 'QUESTION_ACTIVE' || status === 'BUZZER_HIT' || status === 'QUESTION_DONE') && answerInfo && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
              <span className="text-xs font-bold bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full border border-pink-500/30">
                {answerInfo.topicTitle} (Q{answerInfo.qIndex + 1}/{answerInfo.totalQ})
              </span>
              <div className="text-2xl font-black text-rose-500">
                🔑 정답 : <span className="text-white underline">{answerInfo.answer}</span>
              </div>
              {answerInfo.hint && (
                <div className="text-sm font-bold text-amber-400">
                  💡 초성 힌트 : {answerInfo.hint}
                </div>
              )}
              <div className="text-sm font-bold text-slate-400">
                🔔 버저 선점 : <span className="text-cyan-400 font-extrabold">{buzzerWinner || '대기 중...'}</span>
              </div>

              {answerInfo.hint && status !== 'QUESTION_DONE' && (
                <button 
                  onClick={handleShowHint}
                  className="mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" /> TV에 초성 힌트 공개하기
                </button>
              )}
            </div>

            {/* 유튜브 리모컨 */}
            {isYoutubeType && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-slate-400">🎵 TV 미디어 리모컨</h4>
                <div className="flex gap-3">
                  <button onClick={() => handleControlYoutube('PLAY')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"><Play className="w-4 h-4" /> 재생</button>
                  <button onClick={() => handleControlYoutube('PAUSE')} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"><Pause className="w-4 h-4" /> 일시정지</button>
                  <button onClick={() => handleControlYoutube('REPLAY')} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"><RotateCcw className="w-4 h-4" /> 처음부터</button>
                </div>

                <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-xl">
                  <Volume2 className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-300 w-16">볼륨: {volume}%</span>
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} className="flex-1 accent-indigo-500" />
                </div>
              </div>
            )}

            {/* 채점 버튼 */}
            {buzzerWinner && (
              <div className="flex gap-4">
                <button onClick={() => handleJudge(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-2xl text-xl flex justify-center items-center gap-2 shadow-lg"><CheckCircle className="w-7 h-7" /> 정답 (+10pt)</button>
                <button onClick={() => handleJudge(false)} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-6 rounded-2xl text-xl flex justify-center items-center gap-2 shadow-lg"><XCircle className="w-7 h-7" /> 오답 (3초 페널티)</button>
              </div>
            )}

            {/* 스킵 버튼 */}
            {status !== 'QUESTION_DONE' && (
              <button onClick={handleSkipQuestion} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl flex justify-center items-center gap-2 border border-slate-700">
                <FastForward className="w-5 h-5" /> 문제 스킵 (아무도 못 맞힘)
              </button>
            )}

            {/* 다음 문제 넘어가는 버튼 */}
            {status === 'QUESTION_DONE' && (
              <button onClick={handleNextQuestion} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-5 rounded-2xl text-lg shadow-xl">
                ▶️ 다음 문제로 넘어가기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}