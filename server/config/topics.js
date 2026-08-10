const SAMPLE_TOPICS = [
  {
    id: "topic_1",
    title: "🎵 음악 맞히기 (음원 전용)",
    questions: [
      {
        id: 101,
        title: "이 노래의 제목은 무엇일까요? (음원 듣기)",
        mediaType: "YOUTUBE_AUDIO",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "Never Gonna Give You Up",
        hint: "ㅅㅈㄷㅇ"
      }
    ]
  },
  {
    id: "topic_2",
    title: "🎬 영상/인물 맞히기 (영상 포함)",
    questions: [
      {
        id: 201,
        title: "다음 영상 속 가수의 이름은?",
        mediaType: "YOUTUBE_VIDEO",
        mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        answer: "릭 애스트리",
        hint: "ㅅㅈㄷㅇ"
      },
      {
        id: 202,
        title: "이 인물은 누구일까요?",
        mediaType: "IMAGE",
        mediaUrl: "https://via.placeholder.com/600x350?text=Quiz+Image",
        answer: "홍길동",
        hint: "ㅅㅈㄷㅇ"
      }
    ]
  },
  {
    id: "topic_3",
    title: "📜 역사 & 인물",
    questions: [
      { id: 301, title: "조선시대 백성들을 위해 한글을 창제한 왕은?", mediaType: "NONE", mediaUrl: "", answer: "세종대왕", hint: "ㅅㅈㄷㅇ" },
      { id: 302, title: "이 인물은 누구일까요?", mediaType: "IMAGE", mediaUrl: "https://via.placeholder.com/600x350?text=History+Q2", answer: "이순신", hint: "ㅅㅈㄷㅇ" }
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

module.exports = { SAMPLE_TOPICS, getTopicListInfo };