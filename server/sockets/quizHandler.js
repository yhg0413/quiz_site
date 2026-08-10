const roomManager = require('../managers/roomManager');
const { SAMPLE_TOPICS, getTopicListInfo } = require('../config/topics');

module.exports = (io) => {
  function sendNextQuestion(roomKey) {
    const room = roomManager.getRoom(roomKey);
    if (!room || !room.currentTopicId) return;

    const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
    if (!topic) return;

    // 💡 이전 문제가 완료(QUESTION_DONE) 상태였을 때만 문제 인덱스를 1 증가시킴
    if (room.status === 'QUESTION_DONE') {
      room.currentQIndexInTopic += 1;
    }

    if (room.currentQIndexInTopic >= topic.questions.length) {
      room.completedTopics.add(room.currentTopicId);
      room.currentTopicId = null;
      room.currentQIndexInTopic = 0;

      if (room.completedTopics.size >= SAMPLE_TOPICS.length) {
        room.status = 'GAME_FINISHED';
        const awards = roomManager.calculateAwards(roomKey);
        io.to(roomKey).emit('GAME_FINISHED', { players: room.players, awards });
        return;
      }

      room.status = 'TOPIC_SELECT';
      io.to(roomKey).emit('RETURN_TO_TOPIC_SELECT', {
        topics: getTopicListInfo(),
        completedTopics: Array.from(room.completedTopics)
      });
      return;
    }

    const q = topic.questions[room.currentQIndexInTopic];
    room.status = 'QUESTION_ACTIVE';
    room.buzzerLocked = false;
    room.buzzerWinner = null;
    room.playerAnswers = {};
    room.questionStartTime = Date.now();
    room.bannedPlayerIdsForCurrentQ.clear();

    const qPayload = {
      topicTitle: topic.title,
      qIndex: room.currentQIndexInTopic,
      totalQ: topic.questions.length,
      title: q.title,
      quizType: q.quizType,
      mediaType: q.mediaType,
      mediaUrl: q.mediaUrl,
      options: q.options || []
    };

    io.to(roomKey).emit('QUESTION_STARTED', qPayload);

    io.to(`${roomKey}-host`).emit('HOST_QUESTION_INFO', {
      ...qPayload,
      answer: q.answer,
      hint: q.hint
    });
  }

  io.on('connection', (socket) => {
    socket.on('CREATE_ROOM', (callback) => {
      const roomId = roomManager.createRoom();
      if (typeof callback === 'function') callback({ success: true, roomId });
    });

    socket.on('JOIN_ROOM', ({ roomId, role, playerId, playerName }) => {
      const roomKey = String(roomId);
      const room = roomManager.getRoom(roomKey);
      if (!room) {
        socket.emit('ROOM_ERROR', { message: '존재하지 않는 방입니다.' });
        return;
      }

      socket.join(roomKey);

      if (role === 'PLAYER' && playerId) {
        const players = roomManager.joinPlayer(roomKey, playerId, playerName, socket.id);
        io.to(roomKey).emit('PLAYERS_UPDATED', players);
      } else if (role === 'HOST') {
        socket.join(`${roomKey}-host`);
      }

      const syncData = roomManager.getSyncData(roomKey, role);
      socket.emit('ROOM_STATE_SYNC', syncData);
    });

    socket.on('SELECT_TOPIC', ({ roomId, topicId }) => {
      const roomKey = String(roomId);
      const room = roomManager.getRoom(roomKey);
      if (!room || room.completedTopics.has(topicId)) return;

      room.currentTopicId = topicId;
      room.currentQIndexInTopic = 0;
      sendNextQuestion(roomKey);
    });

    socket.on('NEXT_QUESTION', ({ roomId }) => {
      sendNextQuestion(String(roomId));
    });

    socket.on('SHOW_HINT', ({ roomId }) => {
      const roomKey = String(roomId);
      const room = roomManager.getRoom(roomKey);
      if (!room || !room.currentTopicId) return;

      const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
      const q = topic ? topic.questions[room.currentQIndexInTopic] : null;

      if (q && q.hint) {
        io.to(roomKey).emit('HINT_REVEALED', { hint: q.hint });
      }
    });

    socket.on('CONTROL_YOUTUBE', ({ roomId, action }) => {
      io.to(String(roomId)).emit('YOUTUBE_CONTROL', { action });
    });

    socket.on('SET_VOLUME', ({ roomId, volume }) => {
      io.to(String(roomId)).emit('YOUTUBE_VOLUME', { volume });
    });

    socket.on('PRESS_BUZZER', ({ roomId, playerId }) => {
      const roomKey = String(roomId);
      const winner = roomManager.pressBuzzer(roomKey, playerId);
      if (winner) {
        io.to(roomKey).emit('BUZZER_WINNER_ANNOUNCED', {
          winnerPlayerId: playerId,
          winnerName: winner.name
        });
      }
    });

    socket.on('SUBMIT_ANSWER', ({ roomId, playerId, answerIndex }) => {
      const roomKey = String(roomId);
      const submitInfo = roomManager.submitAnswer(roomKey, playerId, answerIndex);
      if (submitInfo) {
        io.to(roomKey).emit('ANSWER_SUBMITTED_UPDATE', submitInfo);
        socket.emit('MY_ANSWER_SUBMITTED', { selected: answerIndex });
      }
    });

    socket.on('JUDGE_ANSWER', ({ roomId, isCorrect }) => {
      const roomKey = String(roomId);
      const result = roomManager.judgeAnswer(roomKey, isCorrect);
      if (!result) return;

      io.to(roomKey).emit('JUDGMENT_RESULT', result);

      if (!result.isCorrect) {
        setTimeout(() => {
          roomManager.clearPenalty(roomKey, result.failedPlayerId);
          io.to(roomKey).emit('PLAYER_PENALTY_EXPIRED', { playerId: result.failedPlayerId });
        }, 3000);
      }
    });

    socket.on('JUDGE_CHOICE', ({ roomId }) => {
      const roomKey = String(roomId);
      const result = roomManager.judgeChoiceQuestion(roomKey);
      if (result) {
        io.to(roomKey).emit('CHOICE_JUDGMENT_RESULT', result);
      }
    });

    socket.on('SKIP_QUESTION', ({ roomId }) => {
      const roomKey = String(roomId);
      const room = roomManager.getRoom(roomKey);
      if (!room || !room.currentTopicId) return;

      const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
      const q = topic ? topic.questions[room.currentQIndexInTopic] : null;

      room.status = 'QUESTION_DONE';
      room.buzzerWinner = null;

      io.to(roomKey).emit('JUDGMENT_RESULT', {
        isSkip: true,
        correctAnswer: q ? (q.quizType === 'BUZZER' ? q.answer : q.options[q.answer]) : '',
        players: room.players
      });
    });

    socket.on('disconnect', () => {
      roomManager.removeSocket(socket.id);
    });
  });
};