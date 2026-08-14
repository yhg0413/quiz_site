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
        id: 201,
        quizType: QUIZ_TYPE.OX,
        mediaType: MEDIA_TYPE.NONE,
        title: "야생 상태에서 북극곰과 펭귄은 남극과 북극 전역에 걸쳐 서로 같은 서식지를 공유하며 살아간다.",
        mediaUrl: "",
        options: ["O", "X"],
        answer: 1,
        hint: "북극곰은 북반구, 펭귄은 남반구에 주로 서식합니다.",
        score: 10
      },{
    id: 202,
    quizType: QUIZ_TYPE.CHOICE,
    mediaType: MEDIA_TYPE.NONE,
    title: "'음악의 신동'으로 불리며 《피가로의 결혼》, 《마술피리》, 《교향곡 제40번》 등 수많은 걸작을 남긴 오스트리아의 고전주의 작곡가는 누구일까요?",
    mediaUrl: "",
    options: ["베토벤", "바흐", "모차르트", "쇼팽"],
    answer: 2,
    hint: "풀네임은 볼프강 아마데우스 **입니다.",
    score: 10
  },{
    id: 203,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "태양에서 날아온 전하를 띤 입자가 지구 자기장에 이끌려 대기권 기체와 충돌하며 화려한 빛을 발하는 극지방의 발광 현상은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "오로라",
    hint: "극광(極光)이라고도 불립니다.",
    score: 10
  },{
    id: 204,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "인체의 신경계 중 '뇌'와 함께 중추신경계를 구성하며, 척추 내부의 관 속에 위치하여 온몸의 신경을 이어주는 신경 다발은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "척수",
    hint: "반사 중추이자 신호 전달 통로 역할을 합니다.",
    score: 10
  },{
    id: 205,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "무굴 제국의 황제 샤 자한이 세상을 떠난 왕비를 추모하기 위해 인도 아그라에 건축한 순백색 대리석 묘당은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "타지마할",
    hint: "인도의 대표적인 유네스코 세계문화유산 건축물입니다.",
    score: 10
  },{
    id: 206,
    quizType: QUIZ_TYPE.CHOICE,
    mediaType: MEDIA_TYPE.NONE,
    title: "영국의 대문호 윌리엄 셰익스피어의 4대 비극에 포함되지 않는 작품은 무엇일까요?",
    mediaUrl: "",
    options: ["햄릿", "오셀로", "로미오와 줄리엣", "리어왕"],
    answer: 2,
    hint: "4대 비극은 햄릿, 오셀로, 리어왕, 맥베스입니다.",
    score: 10
  },{
    id: 207,
    quizType: QUIZ_TYPE.OX,
    mediaType: MEDIA_TYPE.NONE,
    title: "이물질이나 미네랄이 전혀 포함되지 않은 순수한 물(초순수)은 전기가 통하지 않는 절연체에 가깝다.",
    mediaUrl: "",
    options: ["O", "X"],
    answer: 0,
    hint: "순수 물 자체는 이온 물질이 없어 전류가 거의 흐르지 않습니다.",
    score: 10
  },{
    id: 208,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "소크라테스의 제자이자 아리스토텔레스의 스승으로, 《국가론》을 저술하고 이상적인 세계관인 '이데아론'을 정립한 철학자는?",
    mediaUrl: "",
    options: [],
    answer: "플라톤",
    hint: "아카데메이아를 세운 고대 그리스 철학자입니다.",
    score: 10
  },{
    id: 209,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "1928년 영국 미생물학자 알렉산더 플레밍이 푸른곰팡이에서 우연히 발견한 인류 최초의 항생제는 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "페니실린",
    hint: "세균 감염 치료의 새 지평을 연 항생 물질입니다.",
    score: 10
  },{
    id: 210,
    quizType: QUIZ_TYPE.CHOICE,
    mediaType: MEDIA_TYPE.NONE,
    title: "서양 클래식 오케스트라에서 찰현악기(활로 켜는 현악기) 중 몸집이 가장 크며 음역대가 가장 낮은 악기는 무엇일까요?",
    mediaUrl: "",
    options: ["바이올린", "비올라", "첼로", "콘트라베이스 (더블베이스)"],
    answer: 3,
    hint: "오케스트라 현악군의 가장 낮은 저음을 담당합니다.",
    score: 10
  },{
    id: 211,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "조선 후기 지리학자 김정호가 1861년에 편찬·간행한 대축척 목판본 전국 지도의 이름은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "대동여지도",
    hint: "22첩 절첩식 목판본 전국 지도입니다.",
    score: 10
  },{
    id: 212,
    quizType: QUIZ_TYPE.CHOICE,
    mediaType: MEDIA_TYPE.NONE,
    title: "다음 중 유럽 남서부의 이베리아반도에 위치하여 포르투갈과 국경을 맞대고 있는 국가는 어디일까요?",
    mediaUrl: "",
    options: ["독일", "스페인", "이탈리아", "그리스"],
    answer: 1,
    hint: "마드리드가 수도인 남유럽 국가입니다.",
    score: 10
  },{
    id: 213,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "생명체의 유전 정보를 저장하고 전달하는 이중 나선 구조를 가진 핵산 분자의 약칭은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "DNA",
    hint: "디옥시리보핵산의 영문 약자입니다.",
    score: 10
  },{
    id: 214,
    quizType: QUIZ_TYPE.CHOICE,
    mediaType: MEDIA_TYPE.NONE,
    title: "빅토르 위고의 소설로, 빵 한 조각을 훔친 죄로 19년간 복역한 장발장의 삶을 다룬 대하소설은 무엇일까요?",
    mediaUrl: "",
    options: ["레 미제라블", "노틀담의 꼽추", "몬테크리스토 백작", "죄와 벌"],
    answer: 0,
    hint: "'비참한 사람들'이라는 뜻을 지닌 명작입니다.",
    score: 10
  },{
    id: 215,
    quizType: QUIZ_TYPE.BUZZER,
    mediaType: MEDIA_TYPE.NONE,
    title: "외력이 작용하지 않을 때 정지 상태나 등속 운동 상태를 계속 유지하려는 물체의 물리적 성질은 무엇일까요?",
    mediaUrl: "",
    options: [],
    answer: "관성",
    hint: "뉴턴의 운동 제1법칙과 직결되는 성질입니다.",
    score: 10
  }
    ]
  },
  {
    id: "topic_3",
    title: "노래",
    questions: [
      {
        id: 301,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/WPJs0jlqdhc",
        options: [],
        answer: "Chen, Punch - Everytime (태양의 후예 OST)", // 0 = O
        hint: "(태양의 후예 OST)",
        score: 15
      },{
        id: 302,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/TfAzTYzBvTo",
        options: [],
        answer: "전소미 - DUMB DUMB", // 0 = O
        hint: "전소미",
        score: 15
      },{
        id: 303,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/RROW1FvQjqA",
        options: [],
        answer: "백아 - 첫사랑", // 0 = O
        hint: "백아",
        score: 15
      },{
        id: 304,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/D1PvIWdJ8xo",
        options: [],
        answer: "아이유 - Blueming", // 0 = O
        hint: "아이유",
        score: 15
      },{
        id: 305,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/_XyBa8QsVQU",
        options: [],
        answer: "여자친구 - Time for the moon night", // 0 = O
        hint: "여자친구",
        score: 15
      },{
        id: 306,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/yL6P7OR5WOM",
        options: [],
        answer: "지코 - 아무노래", // 0 = O
        hint: "지코",
        score: 15
      },{
        id: 307,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/mOZqd0bDDcQ",
        options: [],
        answer: "Paul Blanco - Summer", // 0 = O
        hint: "Paul Blanco",
        score: 15
      },{
        id: 308,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/hHCjLiZ5Yxc",
        options: [],
        answer: "너드커넥션 - 그대만 있다면", // 0 = O
        hint: "너드커넥션",
        score: 15
      },{
        id: 309,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/U6BDbXIah-Y",
        options: [],
        answer: "코르티스 - REDRED", // 0 = O
        hint: "코르티스",
        score: 15
      },{
        id: 310,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/MPp8hbuZwW0",
        options: [],
        answer: "최예나 - 네모네모", // 0 = O
        hint: "최예나",
        score: 15
      },{
        id: 311,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 ?",
        mediaUrl: "https://www.youtube.com/embed/0xSiBpUdW4E?t=65",
        options: [],
        answer: "아이묭 -마리골드", // 0 = O
        hint: "아이묭",
        score: 15
      },{
        id: 312,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/o6wtDPVkKqI?t=65",
        options: [],
        answer: "Takahashi Yoko - 잔혹한 천사의 테제 / 에반게리온", // 0 = O
        hint: "Takahashi Yoko",
        score: 15
      },{
        id: 313,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/M2cckDmNLMI?t=122",
        options: [],
        answer: "요네즈켄시 - 킥백 / 체인소맨", // 0 = O
        hint: "전기톱",
        score: 15
      },{
        id: 314,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/U0TXIXTzJEY?t=226",
        options: [],
        answer: "죠죠의 기묘한 모험 - il vento d'oro", // 0 = O
        hint: "노래 제목은 나도 못맞춤;",
        score: 15
      },{
        id: 315,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/p0ku3_rK6dE?t=48",
        options: [],
        answer: "요네즈 켄시 - 레몬 / 언내추럴", // 0 = O
        hint: "요네즈 켄시",
        score: 15
      },{
        id: 316,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/gt-v_YCkaMY?t=40",
        options: [],
        answer: "Ado - 역광 / 원피스", // 0 = O
        hint: "Ado",
        score: 15
      },{
        id: 317,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 삽입된 작품은?",
        mediaUrl: "https://www.youtube.com/embed/uk-eiG2E0uA?t=88",
        options: [],
        answer: "official髭男dism 오피셜히게단디즘 - Pretender(프리텐더) / 너에게 닿기를", // 0 = O
        hint: "official髭男dism 오피셜히게단디즘",
        score: 15
      },{
        id: 318,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은?",
        mediaUrl: "https://www.youtube.com/embed/NQK7EO37tbk",
        options: [],
        answer: "Dance of the Hours(라 존코다 중 시간의 춤) - Amilcare Ponchielli", // 0 = O
        hint: "Amilcare Ponchielli",
        score: 15
      },{
        id: 319,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/hs-tG_JvMgA",
        options: [],
        answer: "욕망의 무도회 (Ball of Desire) - 에키드나", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 320,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/kt8zwXzy7eU?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L&t=69",
        options: [],
        answer: "마주하라, 죽음의 질서를 (Order of Death Descending) - 카제로스", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 321,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/FlMJlqOiPHs?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L&t=36",
        options: [],
        answer: "레퀴엠: 예언된 심판의 노래 (Song of the Prophesied Judgment) - 아브렐슈드", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 322,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/hxCiQxlsuYE?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L&t=59",
        options: [],
        answer: "별을 제패한 자, 카멘 (Star Conquer, Kamen)", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 323,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/VkyszLBTAVE?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L",
        options: [],
        answer: "한밤중의 서커스(Midnight Circus) - 쿠쿠세이튼", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 324,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은 또는 누구의 테마곡 인가?",
        mediaUrl: "https://www.youtube.com/embed/oNBavk6cXVE?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L",
        options: [],
        answer: "Dear Friends - 아만", // 0 = O
        hint: "LostArk",
        score: 15
      },{
        id: 325,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 노래의 제목은?",
        mediaUrl: "https://www.youtube.com/embed/eDWFM7y2hvU?list=PLXJUV6UcSL2ypwIwW7aHw3AXyesv7kn0L",
        options: [],
        answer: "용기의 노래 (Anthem of Courage)", // 0 = O
        hint: "LostArk",
        score: 15
      },
    ]
  },
  {
    id: "topic_5",
    title: "인물 또는 캐릭터",
    questions: [
      {
        id: 401,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%EB%B9%A1%EB%B9%A1%EC%9D%B4_%EC%95%84%EC%A0%80%EC%94%A8.jpg/250px-%EB%B9%A1%EB%B9%A1%EC%9D%B4_%EC%95%84%EC%A0%80%EC%94%A8.jpg",
        options: [],
        answer: "김계란", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 402,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Anne_Hathaway-68408_%28cropped%29.jpg?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=original",
        options: [],
        answer: "앤해서웨이", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 403,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://img.imbc.com/adams/Program/20259/134019366015166630.jpg",
        options: [],
        answer: "김연경", // 0 = O
        hint: "",
        score: 0
      },{
        id: 404,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://images.machugi.io/af2933f5-1ab2-4a6a-aa76-45b211153ca9",
        options: [],
        answer: "파블로 피카소", // 0 = O
        hint: "",
        score: 0
      },{
        id: 405,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://images.machugi.io/98621e8c-1299-4cbe-8d19-2d4ea913774d",
        options: [],
        answer: "로버트 다우니 주니어", // 0 = O
        hint: "",
        score: 0
      },{
        id: 406,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/lTIXKFSDV-iYorCEmTJ1cnw-6OcyFV8e4gP5VgDb6lMpvui1rZt1U1gbMc2JYKAvy2-wwYZjW79KSLaWuHejYQ.webp",
        options: [],
        answer: "스칼렛 요한슨", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 407,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRREYBjUcyUsFdtAjiiOCAZA15cLXlM3aE5YHC-1-OHwA&s=10",
        options: [],
        answer: "톰 홀랜드", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 408,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/A0s6Iy9_Nkwzhv1-2BkjvohydWPzGwohhQNE2KJuRPSHb-HXHTiF0IfBqm1HqG9iWmgleMnA6_EgScmBHnqJiQ.webp",
        options: [],
        answer: "잭 스페로우 - 조니 뎁", // 0 = O
        hint: "!",
        score: 0
      },{
        id: 409,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터 또는 등장 작품은?: 힌트 주녹이 인생작",
        mediaUrl: "https://thumbnail.laftel.net/items/home/0fc9a870-7635-481f-af7f-fa435181dbb2.jpg",
        options: [],
        answer: "청준 돼지는 바니걸 선배의 꿈을 꾸지 않는다 - 유키노시타 유키노", // 0 = O
        hint: "힌트 주녹이 인생작",
        score: 0
      },{
        id: 410,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터 또는 등장 작품은?: 힌트 주녹이 인생작",
        mediaUrl: "https://i.namu.wiki/i/AgfAF6vFg3JgxhhByTs5g3vYhRukHyujGPp1mZcsOAm7okPwK6Kb0Z2vh0n4guniP4sHodyQXAbRi36UlMAHwA.webp",
        options: [],
        answer: "마법소녀 마도카 마기카 - 카나메 마도카", // 0 = O
        hint: "힌트 주녹이 인생작",
        score: 0
      },{
        id: 411,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM5X67qrwIjVJIwGXpXwATy94DUb8ILFzMhHB_LSPxtw&s=10",
        options: [],
        answer: "마동석 - 마석도", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 412,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/YtVCoeuJAIciwatB9riw2-bDGIYAl2Kv2_geY027qEnrYCwi_4SwgeUNpkEC8sg3mqUM3KLM4TwqQMv0bC13Uw.webp",
        options: [],
        answer: "베네딕트 컴배배치", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 413,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/BFA_2023_-2_Heung-Min_Son_%28cropped%29.jpg/250px-BFA_2023_-2_Heung-Min_Son_%28cropped%29.jpg?utm_source=ko.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        options: [],
        answer: "손흥민", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 414,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/uScZGPRCRIqIcdshZ6pXIfBww6f053Szl3t24a00kfAcjDXIa1CsFPahVr0eAq2jmO-q2l2quM4tLSHnzxSw2w.webp",
        options: [],
        answer: "리센느 - 원이", // 0 = O
        hint: "파이리",
        score: 0
      },{
        id: 415,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/oo5f1c2P-ru24-A6D9cT2SNHrdmqznQUNAbLMXeyo3P6nInNy0aROEC7rKMWkN6iHsm7v2h1owmgathMPYT7vw.webp",
        options: [],
        answer: "김연아", // 0 = O
        hint: "빙상여제",
        score: 0
      },{
        id: 416,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/fbsA4CsusKSY3NwwD5IsNhvwpC7hDIT5qD6Z-9kiXJnBh0zXeL3ZDeTP7Q-C20HluxzjHl5cL0Qi2o9Vwag21g.webp",
        options: [],
        answer: "이상형 -페이커", // 0 = O
        hint: "불사대마왕",
        score: 0
      },{
        id: 417,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dodgers_at_Nationals_%2853677192000%29_%28cropped%29.jpg/250px-Dodgers_at_Nationals_%2853677192000%29_%28cropped%29.jpg?utm_source=ko.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        options: [],
        answer: "오타니 쇼헤이", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 418,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/rcKEd_dDbIcbURoWxlPcSLsI1ozSuw0BH7G3ukNF2ExQXbS9SL8fhGztYoySoT91lS2GiZxrZNPdzkoboKrhxA.webp",
        options: [],
        answer: "성룡", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 419,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Charlie_Chaplin_portrait_Getty_1739411952.jpg?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=original",
        options: [],
        answer: "찰리 채플린", // 0 = O
        hint: "잘생겼네",
        score: 0
      },{
        id: 420,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/iSqjIy_VbkAclOWZSgExyo1-u93EPrm9LZzRDS4DRIXZkErvuvKvsRf2F9NdSQNNPpQfjVJQzeAxIgrRpuz6eQ.webp",
        options: [],
        answer: "레오나르도 디카프리오", // 0 = O
        hint: "",
        score: 0
      },{
        id: 421,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/f3WtcJd4ZnrO-k50ZMrbmULInUoMr0yXft8FD1ezN-I_31a__26k20Lxe0pu2zEZ6fiJb2-HAjB-e0HKyD0EEw.webp",
        options: [],
        answer: "히스레저 - 조커", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 422,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/gRLIm75m7Epm4Yxlf_S241SCFu9qm7F_U9_swAjOSGCf8-ZqAPAW33BGy_Kt9w_3AQduNjVkvRWTLN-zSC2gCQ.webp",
        options: [],
        answer: "핑구", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 423,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/Z1vWUVgUeurUwmrCMakGjKRpLrAnifiNPdHV-HWsmZhZ-xAQKjYIcoNj4Im_G8UXMNFf3KoBUAZ3VRW7vF0wiQ.webp",
        options: [],
        answer: "르세라핌 - 카즈하", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 424,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 인물은 또는 캐릭터는 ?",
        mediaUrl: "https://i.namu.wiki/i/lptziJR3_vm9ywPpBhuTY-EJbRG21Y9YN7PRg34umQ-JyotMNTRs9GKRReiqhbzMTBWwjngFpebhb1OwYKKskg.webp",
        options: [],
        answer: "엑스러브 - 루이", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 425,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 대사를 듣고 캐릭터를 맞추시오 ?",
        mediaUrl: "https://www.youtube.com/embed/cUEOKbh4VNw",
        options: [],
        answer: "바스티안", // 0 = O
        hint: "",
        score: 0
      },{
        id: 426,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_AUDIO,
        title: "다음 대사를 듣고 캐릭터를 맞추시오 ?",
        mediaUrl: "https://www.youtube.com/embed/MZc_0fBbEzA",
        options: [],
        answer: "시바 포", // 0 = O
        hint: "",
        score: 0
      },
    ]
  },{
    id: "topic_6",
    title: "자투리 문제",
    questions: [
      {
        id: 501,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 채팅을 친 인물은?",
        mediaUrl: "/image/시운-이선님저취했는데ㅈㄴ잘해요.png",
        options: [],
        answer: "시운", // 0 = O
        hint: "",
        score: 0
      },{
        id: 502,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.YOUTUBE_VIDEO,
        title: "다음 게임의 이름은?",
        mediaUrl: "https://www.youtube.com/embed/ju4VvCRQXFM",
        options: [],
        answer: "Zort", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 503,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 게임의 이름은?",
        mediaUrl: "/image/다음 게임의 이름은 라이어스바.png",
        options: [],
        answer: "라이어스 바", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 504,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 이미지는 노주녹이 AI를 활용해 만든 이미지이다 해당 이미지는 캐릭터 닉네임은 무엇인가?",
        mediaUrl: "/image/char_no.png",
        options: [],
        answer: "헤르에", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 505,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 게임의 이름은?",
        mediaUrl: "/image/game_val.png",
        options: [],
        answer: "발헤임", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 506,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "다음 캐릭터 커스터마이징을 하고 채팅을 친 인물은?",
        mediaUrl: "/image/사키샤키 도일 이미지.png",
        options: [],
        answer: "사키샤키", // 0 = O
        hint: "O를 눌러보세요!",
        score: 0
      },{
        id: 507,
        quizType: QUIZ_TYPE.BUZZER,
        mediaType: MEDIA_TYPE.IMAGE,
        title: "왼쪽부터 각각 어떤 인물의 윌라드인지 쓰시오?",
        mediaUrl: "/image/who_wil.png",
        options: [],
        answer: "박박샤키 딱딱샤키 각각샤키", // 0 = O
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