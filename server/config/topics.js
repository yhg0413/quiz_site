// server/config/topics.js

// Quiz Type Enum
const QUIZ_TYPE = Object.freeze({
  BUZZER: 'BUZZER', // 버저 선점형
  CHOICE: 'CHOICE', // 4지선다 객관식
  OX: 'OX',         // OX 퀴즈
});

// Media Type Enum
const MEDIA_TYPE = Object.freeze({
  NONE: 'NONE',                   // 텍스트 전용
  IMAGE: 'IMAGE',                 // 이미지 첨부
  YOUTUBE_VIDEO: 'YOUTUBE_VIDEO', // 유튜브 영상 (화면 노출)
  YOUTUBE_AUDIO: 'YOUTUBE_AUDIO', // 유튜브 음원 (화면 비노출)
});

const SAMPLE_TOPICS = [
  {
    id: "topic_1",
    title: "🔰 튜토리얼 (연습 문제)",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "[OX 연습] 모바일 화면에서 O 또는 X를 눌러 참여하는 퀴즈입니다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },
      {
        id: 102,
        quizType: QUIZ_TYPE.CHOICE,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "[객관식 연습] 사진을 확인하고 4개 보기 중 정답을 선택하는 퀴즈입니다.",
        mediaUrl: "https://via.placeholder.com/600x350?text=Tutorial+Quiz",
        options: ["1. 1번 보기", "2. 2번 보기", "3. 정답 (3번)", "4. 4번 보기"],
        answer: 2, // 3번 보기
        hint: "3번 보기를 눌러보세요!",
        score: 0
      },
      {
        id: 103,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "[음원 버저 연습] 소리를 듣고 모바일 버저를 가장 빠르게 누른 사람에게 발언권이 부여됩니다.",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "연습용 정답",
        hint: "버저를 눌러보세요!",
        score: 0
      },
      {
        id: 104,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_VIDEO,
        title: "[영상 버저 연습] 영상을 감상하다가 정답을 알겠다면 버저를 터치해주세요!",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "릭 애스트리",
        hint: "ㄹㅇㅅㅌㄹ",
        score: 0
      }
    ]
  },
  {
    id: "topic_2",
    title: "상식",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "[OX 연습] 모바일 화면에서 O 또는 X를 눌러 참여하는 퀴즈입니다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },
    ]
  },
  {
    id: "topic_3",
    title: "게임",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "[OX 연습] 모바일 화면에서 O 또는 X를 눌러 참여하는 퀴즈입니다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },
    ]
  },
  {
    id: "topic_4",
    title: "영화",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "[OX 연습] 모바일 화면에서 O 또는 X를 눌러 참여하는 퀴즈입니다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },
    ]
  },
  {
    id: "topic_5",
    title: "인물 또는 캐릭터",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "[OX 연습] 모바일 화면에서 O 또는 X를 눌러 참여하는 퀴즈입니다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },
    ]
  }
];

const getTopicListInfo = () => {
  return SAMPLE_TOPICS.map(t => ({
    id: t.id,
    title: t.title,
    totalQuestions: t.questions.length
  }));
};

module.exports = {
  QUIZ_TYPE,
  MEDIA_TYPE,
  SAMPLE_TOPICS,
  getTopicListInfo
};