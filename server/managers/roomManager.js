const { SAMPLE_TOPICS, getTopicListInfo } = require('../config/topics');

class RoomManager {
  constructor() {
    this.rooms = {};
  }

  createRoom() {
    let roomId;
    do {
      roomId = Math.floor(1000 + Math.random() * 9000).toString();
    } while (this.rooms[roomId]);

    this.rooms[roomId] = {
      status: 'TOPIC_SELECT',
      currentTopicId: null,
      currentQIndexInTopic: 0,
      completedTopics: new Set(),
      buzzerLocked: true,
      buzzerWinner: null,
      buzzerHitTime: 0,
      questionStartTime: 0,
      playerAnswers: {},
      players: {},
      bannedPlayerIdsForCurrentQ: new Set()
    };

    return roomId;
  }

  getRoom(roomId) {
    return this.rooms[String(roomId)];
  }

  joinPlayer(roomId, playerId, playerName, socketId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    if (!room.players[playerId]) {
      room.players[playerId] = { 
        name: playerName || `참여자_${playerId.substring(0, 4)}`, 
        score: 0,
        stats: {
          buzzerClicks: 0,
          buzzerWins: 0,
          correctCount: 0,
          wrongCount: 0,
          closeCalls: 0,
          reactionTimes: []
        }
      };
    }
    room.players[playerId].socketId = socketId;
    return room.players;
  }

  getSyncData(roomId, role) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const syncData = {
      status: room.status,
      topics: getTopicListInfo(),
      completedTopics: Array.from(room.completedTopics),
      currentTopicId: room.currentTopicId,
      players: room.players,
      buzzerWinner: room.buzzerWinner,
      submittedCount: Object.keys(room.playerAnswers).length,
      totalPlayers: Object.keys(room.players).length
    };

    if (room.currentTopicId) {
      const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
      if (topic && topic.questions[room.currentQIndexInTopic]) {
        const q = topic.questions[room.currentQIndexInTopic];
        syncData.currentQuestion = {
          topicTitle: topic.title,
          qIndex: room.currentQIndexInTopic,
          totalQ: topic.questions.length,
          title: q.title,
          quizType: q.quizType,
          mediaType: q.mediaType,
          mediaUrl: q.mediaUrl,
          options: q.options || [],
          score: q.score || 10 // 💡 동기화 시 배점 전달
        };
        if (role === 'HOST') {
          syncData.currentAnswer = q.answer;
          syncData.currentHint = q.hint;
        }
      }
    }

    return syncData;
  }

  pressBuzzer(roomId, playerId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const player = room.players[playerId];

    if (player && player.stats) {
      player.stats.buzzerClicks += 1;
    }

    if (room.status !== 'QUESTION_ACTIVE' || room.buzzerLocked || room.bannedPlayerIdsForCurrentQ.has(playerId)) {
      if (room.buzzerHitTime > 0 && Date.now() - room.buzzerHitTime <= 300) {
        if (player && player.stats) player.stats.closeCalls += 1;
      }
      return null;
    }

    const now = Date.now();
    room.buzzerLocked = true;
    room.status = 'BUZZER_HIT';
    room.buzzerHitTime = now;

    const reactionTime = room.questionStartTime ? now - room.questionStartTime : 0;
    
    if (player) {
      if (player.stats) {
        player.stats.buzzerWins += 1;
        if (reactionTime > 0) player.stats.reactionTimes.push(reactionTime);
      }
      room.buzzerWinner = { playerId, name: player.name };
    } else {
      room.buzzerWinner = { playerId, name: 'Unknown' };
    }

    return room.buzzerWinner;
  }

  submitAnswer(roomId, playerId, answerIndex) {
    const room = this.getRoom(roomId);
    if (!room || room.status !== 'QUESTION_ACTIVE') return null;

    room.playerAnswers[playerId] = answerIndex;

    return {
      submittedCount: Object.keys(room.playerAnswers).length,
      totalPlayers: Object.keys(room.players).length
    };
  }

  // 💡 버저형 정답 시 문제 배점(qScore) 가산
  judgeAnswer(roomId, isCorrect) {
    const room = this.getRoom(roomId);
    if (!room || room.status !== 'BUZZER_HIT' || !room.buzzerWinner) return null;

    const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
    const q = topic ? topic.questions[room.currentQIndexInTopic] : null;
    const qScore = q ? (q.score || 10) : 10;

    const winnerPlayerId = room.buzzerWinner.playerId;
    const player = room.players[winnerPlayerId];

    if (isCorrect) {
      if (player) {
        player.score += qScore;
        if (player.stats) player.stats.correctCount += 1;
      }
      room.status = 'QUESTION_DONE';

      return {
        isCorrect: true,
        winnerName: room.buzzerWinner.name,
        gainedScore: qScore,
        players: room.players
      };
    } else {
      if (player && player.stats) player.stats.wrongCount += 1;
      room.status = 'QUESTION_ACTIVE';
      room.buzzerLocked = false;
      room.buzzerWinner = null;
      room.bannedPlayerIdsForCurrentQ.add(winnerPlayerId);

      return {
        isCorrect: false,
        failedPlayerId: winnerPlayerId,
        failedPlayerName: player?.name || 'Unknown',
        players: room.players
      };
    }
  }

  // 💡 객관식/OX 정답 시 문제 배점(qScore) 가산
  judgeChoiceQuestion(roomId) {
    const room = this.getRoom(roomId);
    if (!room || room.status !== 'QUESTION_ACTIVE') return null;

    const topic = SAMPLE_TOPICS.find(t => t.id === room.currentTopicId);
    const q = topic ? topic.questions[room.currentQIndexInTopic] : null;
    if (!q) return null;

    const qScore = q.score || 10;
    const correctAnswer = q.answer;
    const results = {};

    Object.keys(room.players).forEach(pId => {
      const player = room.players[pId];
      const playerAns = room.playerAnswers[pId];
      const isCorrect = playerAns === correctAnswer;

      if (isCorrect) {
        player.score += qScore;
        if (player.stats) player.stats.correctCount += 1;
      } else {
        if (player.stats) player.stats.wrongCount += 1;
      }

      results[pId] = {
        name: player.name,
        selected: playerAns,
        isCorrect
      };
    });

    room.status = 'QUESTION_DONE';

    return {
      correctAnswer,
      gainedScore: qScore,
      results,
      players: room.players
    };
  }

  clearPenalty(roomId, playerId) {
    const room = this.getRoom(roomId);
    if (room) room.bannedPlayerIdsForCurrentQ.delete(playerId);
  }

  calculateAwards(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return [];

    const playerList = Object.values(room.players);
    if (playerList.length === 0) return [];

    const getAvgReaction = (p) => {
      const times = p.stats?.reactionTimes || [];
      if (times.length === 0) return 999999;
      return times.reduce((a, b) => a + b, 0) / times.length;
    };

    const fastestPlayer = [...playerList].sort((a, b) => getAvgReaction(a) - getAvgReaction(b))[0];
    const avgSec = getAvgReaction(fastestPlayer) < 999999 ? (getAvgReaction(fastestPlayer) / 1000).toFixed(2) : '-';

    const clickerPlayer = [...playerList].sort((a, b) => (b.stats?.buzzerClicks || 0) - (a.stats?.buzzerClicks || 0))[0];
    const wrongPlayer = [...playerList].sort((a, b) => (b.stats?.wrongCount || 0) - (a.stats?.wrongCount || 0))[0];
    const closeCallPlayer = [...playerList].sort((a, b) => (b.stats?.closeCalls || 0) - (a.stats?.closeCalls || 0))[0];

    return [
      {
        id: "award_1",
        title: "⚡ 빛의 속도상",
        winnerName: fastestPlayer?.name || "참여자 없음",
        desc: `평균 반응속도 ${avgSec}초로 가장 빠르게 반응하셨습니다!`,
        icon: "⚡"
      },
      {
        id: "award_2",
        title: "🚨 버저 파괴자상",
        winnerName: clickerPlayer?.name || "참여자 없음",
        desc: `버저를 총 ${clickerPlayer?.stats?.buzzerClicks || 0}회 누르며 정열적인 참여를 보여주셨습니다!`,
        icon: "🚨"
      },
      {
        id: "award_3",
        title: "🤡 오답 연금술사상",
        winnerName: wrongPlayer?.name || "참여자 없음",
        desc: `과감한 도전으로 오답 기록 ${wrongPlayer?.stats?.wrongCount || 0}회를 달성하셨습니다!`,
        icon: "🤡"
      },
      {
        id: "award_4",
        title: "😭 0.01초 차이 억울함상",
        winnerName: closeCallPlayer?.name || "참여자 없음",
        desc: `찰나의 차이로 버저를 아깝게 놓친 순간이 ${closeCallPlayer?.stats?.closeCalls || 0}회 있었습니다!`,
        icon: "😭"
      }
    ];
  }

  removeSocket(socketId) {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      for (const pId in room.players) {
        if (room.players[pId].socketId === socketId) {
          delete room.players[pId].socketId;
          break;
        }
      }
    }
  }
}

module.exports = new RoomManager();