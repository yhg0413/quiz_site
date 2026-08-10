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
        score: 0 
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
      buzzerWinner: room.buzzerWinner
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
          mediaType: q.mediaType,
          mediaUrl: q.mediaUrl
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
    if (!room || room.buzzerLocked || room.status !== 'QUESTION_ACTIVE') return null;
    if (room.bannedPlayerIdsForCurrentQ.has(playerId)) return null;

    room.buzzerLocked = true;
    room.status = 'BUZZER_HIT';
    const winner = room.players[playerId];
    room.buzzerWinner = { playerId, name: winner ? winner.name : 'Unknown' };

    return room.buzzerWinner;
  }

  judgeAnswer(roomId, isCorrect) {
    const room = this.getRoom(roomId);
    if (!room || room.status !== 'BUZZER_HIT' || !room.buzzerWinner) return null;

    const winnerPlayerId = room.buzzerWinner.playerId;

    if (isCorrect) {
      if (room.players[winnerPlayerId]) room.players[winnerPlayerId].score += 10;
      room.currentQIndexInTopic += 1;
      room.status = 'QUESTION_DONE';

      return {
        isCorrect: true,
        winnerName: room.buzzerWinner.name,
        players: room.players
      };
    } else {
      room.status = 'QUESTION_ACTIVE';
      room.buzzerLocked = false;
      room.buzzerWinner = null;
      room.bannedPlayerIdsForCurrentQ.add(winnerPlayerId);

      return {
        isCorrect: false,
        failedPlayerId: winnerPlayerId,
        failedPlayerName: room.players[winnerPlayerId]?.name || 'Unknown',
        players: room.players
      };
    }
  }

  clearPenalty(roomId, playerId) {
    const room = this.getRoom(roomId);
    if (room) {
      room.bannedPlayerIdsForCurrentQ.delete(playerId);
    }
  }

  removeSocket(socketId) {
    // 소켓 접속 해제 시 플레이어 상태 정리 (필요에 따라 오프라인 전환)
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