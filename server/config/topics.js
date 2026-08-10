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
    title: "🎵 음원 & 영상 버저 퀴즈",
    questions: [
      {
        id: 101,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "이 노래의 제목은 무엇일까요?",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "Never Gonna Give You Up",
        hint: "ㄴㅂㄱㄴ"
      },
      {
        id: 102,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_VIDEO,
        title: "다음 영상 속 가수의 이름은 무엇일까요?",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "릭 애스트리",
        hint: "ㄹㅇㅅㅌㄹ"
      }
    ]
  },
  {
    id: "topic_2",
    title: "📜 상식 & 역사 (객관식 & OX)",
    questions: [
      {
        id: 201,
        quizType: QUIZ_TYPE.CHOICE,
        mediaType: MEDIA_TYPE.NONE,
        title: "다음 중 조선시대 4대문이 아닌 것은?",
        mediaUrl: "",
        options: ["1. 흥인지문", "2. 숭례문", "3. 광화문", "4. 숙정문"],
        answer: 2, // 0-based index (3. 광화문)
        hint: "궁궐의 정문입니다."
      },
      {
        id: 202,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "토마토는 식물학적으로 과일이 아닌 채소(채소류)이다?",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 0, // 0 = O
        hint: "과채류 구분을 떠올려보세요."
      }
    ]
  },
  {
    id: "topic_3",
    title: "🖼️ 이미지 관찰 퀴즈",
    questions: [
      {
        id: 301,
        quizType: QUIZ_TYPE.CHOICE,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 그림 속 인물은 어느 시대의 장군일까요?",
        mediaUrl: "https://via.placeholder.com/600x350?text=History+Image",
        options: ["1. 고구려", "2. 백제", "3. 신라", "4. 조선"],
        answer: 3, // 4. 조선
        hint: "임진왜란과 관련이 깊습니다."
      },
      {
        id: 302,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "사진 속 인물의 이름을 버저를 누르고 맞혀주세요!",
        mediaUrl: "https://via.placeholder.com/600x350?text=Person",
        answer: "홍길동",
        hint: "ㅎㄱㄷ"
      }
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