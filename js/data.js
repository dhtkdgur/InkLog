/**
 * Inklog — localStorage CRUD layer
 * key: "inklog_entries"
 */

const STORAGE_KEY = 'inklog_entries';

const SAMPLE_DATA = [
  {
    id: 'sample-001',
    category: 'movie',
    title: '기생충',
    creator: '봉준호',
    rating: 5,
    summary: '계급 사회의 민낯을 블랙코미디로 완벽하게 포착한 걸작',
    content: '봉준호 감독이 세계의 스크린을 점령한 작품. 반지하 가족과 부유한 박 사장 가족의 이야기를 통해 현대 한국 사회의 계층 갈등을 섬세하면서도 날카롭게 풀어낸다. 계단을 오르내리는 구도 하나하나에 계급의 상승과 하강이 담겨 있고, 냄새라는 보이지 않는 언어로 계층의 경계를 그린다. 예측할 수 없는 플롯 전환과 완벽한 앙상블이 두 시간 내내 긴장의 끈을 놓지 못하게 한다. 아카데미 작품상은 결코 과한 평가가 아니었다. 영화가 끝난 후에도 한참 동안 여운이 남았다.',
    quote: '',
    coverUrl: '',
    tags: ['봉준호', '계층갈등', '아카데미', '블랙코미디'],
    watchedAt: '2024-11-10',
    place: 'CGV 강남',
    isRewatch: false,
    createdAt: '2024-11-10T14:30:00.000Z'
  },
  {
    id: 'sample-002',
    category: 'movie',
    title: '범죄도시4',
    creator: '허명행',
    rating: 4,
    summary: '마동석 특유의 통쾌함은 여전하다, 시리즈의 안정적인 흥행작',
    content: '마동석 형사 마석도가 이번에는 온라인 도박과 결탁한 조직 범죄와 맞서 싸운다. 시리즈가 거듭될수록 스케일이 커지고 있고 이번에도 액션의 쾌감은 기대를 저버리지 않는다. 마동석의 주먹 한 방에 악당이 날아가는 장면은 언제 봐도 통쾌하다. 관객이 원하는 것을 정확히 알고 그것을 충실히 제공하는 영화다. 시리즈 팬이라면 충분히 즐길 수 있는 작품이지만, 전작들과 비교하면 플롯의 참신함은 다소 아쉽다. 그럼에도 극장에서 함께 웃고 환호하는 재미는 뚜렷하다.',
    quote: '',
    coverUrl: '',
    tags: ['마동석', '액션', '시리즈', '통쾌함'],
    watchedAt: '2024-05-01',
    place: '메가박스 코엑스',
    isRewatch: false,
    createdAt: '2024-05-01T18:00:00.000Z'
  },
  {
    id: 'sample-003',
    category: 'movie',
    title: '콘크리트 유토피아',
    creator: '엄태화',
    rating: 4,
    summary: '재난 이후 인간 본성을 섬뜩하게 들여다보는 한국 디스토피아',
    content: '대규모 지진으로 서울이 폐허가 된 세계. 유일하게 살아남은 황궁 아파트를 중심으로 생존자들이 모여드는 이야기다. 아파트 주민들은 생존을 위해 외부인을 배척하고, 점점 극단적인 선택을 내린다. 이병헌의 카리스마 넘치는 연기가 영화를 이끌고, 박보영과 박서준도 인물의 변화를 설득력 있게 표현한다. 재난 영화라는 외피 아래 한국 사회의 공동체 의식과 이기심을 날카롭게 비판한다. 불편하지만 눈을 뗄 수 없는 영화. 끝나고 나서 한동안 아파트를 바라보는 시선이 달라졌다.',
    quote: '',
    coverUrl: '',
    tags: ['재난', '생존', '아파트', '디스토피아'],
    watchedAt: '2023-08-10',
    place: '집(VOD)',
    isRewatch: false,
    createdAt: '2023-08-10T21:00:00.000Z'
  },
  {
    id: 'sample-004',
    category: 'book',
    title: '채식주의자',
    creator: '한강',
    rating: 5,
    summary: '폭력과 순수에 대한 세 편의 잔혹하고 아름다운 이야기',
    content: '한강 작가가 노벨문학상을 받기 훨씬 전부터 세계 문학계가 주목한 작품. 세 편의 연작으로 구성된 이 소설은 채식주의자 선언을 한 여자 영혜의 이야기를 각기 다른 시점으로 풀어낸다. 인간의 폭력성과 그에 저항하는 방식, 몸과 정신의 경계, 사회적 규범에 대한 거부를 섬세하고 시적인 문장으로 담아냈다. 읽는 내내 불편하지만 눈을 뗄 수 없다. 맨부커 인터내셔널상 수상작이자 현대 한국 문학의 정수. 다 읽고 나서 한참 멍하니 앉아있었다.',
    quote: '나는 꿈을 꾸었다. 내 몸속 어딘가에서 무언가가 자라고 있었다. 천천히, 그러나 확실하게.',
    coverUrl: '',
    tags: ['한강', '노벨문학상', '맨부커', '문학'],
    watchedAt: '2024-12-01',
    place: '서울 북카페',
    isRewatch: false,
    createdAt: '2024-12-01T20:00:00.000Z'
  },
  {
    id: 'sample-005',
    category: 'book',
    title: '아몬드',
    creator: '손원평',
    rating: 4,
    summary: '감정을 느끼지 못하는 소년이 세상과 연결되는 성장 이야기',
    content: '편도체가 작아 감정을 느끼지 못하는 소년 윤재의 성장 소설. 공감 능력이 없는 주인공이 오히려 타인의 감정을 가장 순수하게 바라보는 역설이 이 소설의 핵심이다. 폭력적인 소년 곤이와의 우정을 통해 윤재는 조금씩 세상과 연결되기 시작한다. 손원평 작가의 문장은 군더더기 없이 깔끔하면서도 감동적이다. 청소년 문학이라는 꼬리표가 붙어 있지만, 어른이 읽어도 충분히 울림이 있다.',
    quote: '괜찮아, 넌 잘못이 없어. 그냥 다를 뿐이야.',
    coverUrl: '',
    tags: ['손원평', '성장소설', '청소년', '우정'],
    watchedAt: '2024-09-18',
    place: '도서관',
    isRewatch: false,
    createdAt: '2024-09-18T16:45:00.000Z'
  },
  {
    id: 'sample-006',
    category: 'book',
    title: '82년생 김지영',
    creator: '조남주',
    rating: 5,
    summary: '평범한 한국 여성의 일상이 이렇게 고통스러웠다는 것을',
    content: '1982년생 김지영 씨의 삶을 통해 한국 여성이 경험하는 사회적 차별과 불평등을 담담하게 기록한 소설. 소설이라기보다는 르포에 가까울 만큼 현실적이다. 김지영의 이야기가 특별하지 않다는 점, 이것이 수많은 여성들의 평범한 일상이었다는 점이 이 책의 가장 강렬한 메시지다. 읽는 내내 분노와 슬픔이 교차했다. 사회적으로 많은 논쟁을 불러일으킨 책이지만, 그 논쟁 자체가 이 책의 필요성을 증명한다. 많은 사람들이 읽어야 할 책이다.',
    quote: '당신은 어떻게 살고 싶었나요? 당신이 원하는 삶은 무엇이었나요?',
    coverUrl: '',
    tags: ['조남주', '사회소설', '공감', '한국사회'],
    watchedAt: '2024-07-04',
    place: '집',
    isRewatch: false,
    createdAt: '2024-07-04T13:00:00.000Z'
  },
  {
    id: 'sample-007',
    category: 'webtoon',
    title: '나 혼자만 레벨업',
    creator: '추공 (글) / 장성락 (그림)',
    rating: 4,
    summary: '약체 헌터에서 최강자로, 압도적인 성장 쾌감',
    content: '전 세계에서 가장 약한 E급 헌터 성진우가 특별한 능력을 얻어 최강의 헌터로 성장하는 판타지 웹툰. 소위 먼치킨 장르의 교과서 같은 작품이다. 단순히 강해지는 것이 목적이 아니라, 주인공의 성장 과정과 그를 둘러싼 세계관이 촘촘하게 구성되어 있다. 장성락 작가의 그림체는 액션 씬에서 특히 폭발적이다. 가볍게 읽기 시작했다가 새벽 4시가 될 때까지 정주행했다. 웹툰을 잘 안 보는 사람들에게도 추천하는 입문작.',
    quote: '',
    coverUrl: '',
    tags: ['추공', '판타지', '먼치킨', '성장'],
    watchedAt: '2024-07-22',
    place: '카카오페이지',
    isRewatch: true,
    createdAt: '2024-07-22T23:10:00.000Z'
  },
  {
    id: 'sample-008',
    category: 'webtoon',
    title: '외모지상주의',
    creator: '박태준',
    rating: 4,
    summary: '외모로 모든 것이 결정되는 세상, 그 안에서의 성장과 자아 탐색',
    content: '외모 때문에 학교 생활이 힘들었던 주인공이 어느 날 몸이 바뀌면서 겪는 이야기. 단순한 판타지처럼 보이지만 외모지상주의 사회를 날카롭게 비판한다. 박태준 작가의 탄탄한 스토리와 감정선이 돋보이는 작품이다. 주인공이 다양한 경험을 통해 진짜 자신을 찾아가는 과정이 설득력 있게 그려진다. 학원물 특유의 공감 포인트가 많고, 성장 이야기로서도 충분히 완성도 있다.',
    quote: '',
    coverUrl: '',
    tags: ['박태준', '학원물', '성장', '웹툰'],
    watchedAt: '2024-06-10',
    place: '네이버웹툰',
    isRewatch: false,
    createdAt: '2024-06-10T20:30:00.000Z'
  },
  {
    id: 'sample-009',
    category: 'etc',
    title: '씨네마운틴 팟캐스트 #82 — 올해의 한국 영화',
    creator: '씨네마운틴',
    rating: 4,
    summary: '출퇴근길에 듣기 딱 좋은 영화 비평, 깊이 있는 시각을 배운다',
    content: '씨네마운틴 팟캐스트 82화. 올해 한국 영화 결산을 주제로 세 명의 패널이 각자의 베스트 5를 선정하고 토론한다. 단순한 추천을 넘어 영화의 사회적 맥락과 산업적 의미까지 논의하는 깊이가 인상적이다. 평소에 흘려듣던 영화들을 새로운 시각으로 볼 수 있게 해준다. 약 1시간 30분 분량인데 지루하지 않고 오히려 시간이 부족하게 느껴졌다. 영화를 좋아한다면 구독 추천.',
    quote: '',
    coverUrl: '',
    tags: ['팟캐스트', '영화비평', '추천', '한국영화'],
    watchedAt: '2024-10-15',
    place: '출퇴근길',
    isRewatch: false,
    createdAt: '2024-10-15T08:00:00.000Z'
  },
  {
    id: 'sample-010',
    category: 'etc',
    title: '올해의 작가상 2024 — 국립현대미술관',
    creator: '국립현대미술관',
    rating: 5,
    summary: '현대미술이 이렇게 가깝게 느껴진 적이 없었다',
    content: '국립현대미술관 서울관에서 열린 올해의 작가상 2024 전시. 올해의 작가 4인이 한국 동시대 미술의 다양한 면을 보여주는 전시다. 각 작가의 작업실을 재현한 공간이 특히 인상적이었다. 작가가 어떤 생각으로 작품을 만드는지, 그 과정이 투명하게 공유되어 관람객이 단순 감상자에서 협업자처럼 느끼게 된다. 입장료도 합리적이고 공간도 쾌적하다. 현대미술에 거리감을 느끼는 분들에게도 강력 추천하는 전시.',
    quote: '',
    coverUrl: '',
    tags: ['전시', '현대미술', '서울', '추천'],
    watchedAt: '2024-11-24',
    place: '국립현대미술관 서울관',
    isRewatch: false,
    createdAt: '2024-11-24T15:00:00.000Z'
  },
  {
    id: 'sample-011',
    category: 'movie',
    title: '서울의 봄',
    creator: '김성수',
    rating: 5,
    summary: '결말을 알고도 140분간 숨을 쉴 수 없게 만드는 연출력의 극치',
    content: '역사의 비극적인 한 페이지를 대담하고 날카롭게 복원해낸 웰메이드 영화. 황정민의 압도적인 악인 연기와 정우성의 고독한 투쟁이 대비되며 스크린 밖으로 팽팽한 긴장감이 터져 나온다. 관객이 이미 결과를 다 알고 있음에도 불구하고, \'설마 여기서 막아낼 수 있지 않을까\' 하는 일말의 희망을 쥐고 영화의 호흡을 따라가게 만드는 연출의 힘이 엄청나다. 영화관을 나서면서 가슴이 쿵쾅거리고 답답한 분노가 밀려왔다. 한국 현대사를 다룬 영화들 중 단연 최고의 몰입감을 선사한다.',
    quote: '',
    coverUrl: '',
    tags: ['한국영화', '현대사', '황정민', '정우성', '몰입감'],
    watchedAt: '2023-12-05',
    place: 'CGV 용산아이파크몰',
    isRewatch: false,
    createdAt: '2023-12-05T22:30:00.000Z'
  },
  {
    id: 'sample-012',
    category: 'movie',
    title: '파묘',
    creator: '장재현',
    rating: 4,
    summary: '오컬트 장르의 외피를 두르고 한국인의 뼈 아픈 역사적 상흔을 파헤치다',
    content: '장재현 감독의 오컬트 3부작 중 가장 대중적이면서도 묵직한 메시지를 담은 작품이다. 최민식, 김고은, 유해진, 이도현으로 이어지는 묘벤져스 캐릭터들의 케미스트리가 훌륭하며, 특히 대살굿 장면에서 김고은의 신들린 듯한 연기는 온몸에 소름이 돋을 정도로 압도적이었다. 전반부의 묘를 파헤치는 스릴과 후반부의 역사적 상징물이 결합되는 과정에서 장르적 이질감이 느껴진다는 호불호가 있지만, 개인적으로는 민속학적 고증과 항일의 역사를 기발하게 엮어낸 연출 방식이 꽤나 마음에 들었다. 한 번 더 보며 세부적인 이스터에그를 찾아보고 싶은 영화.',
    quote: '',
    coverUrl: '',
    tags: ['오컬트', '김고은', '최민식', '항일', '미스터리'],
    watchedAt: '2024-03-02',
    place: '메가박스 신촌',
    isRewatch: false,
    createdAt: '2024-03-02T19:15:00.000Z'
  },
  {
    id: 'sample-013',
    category: 'movie',
    title: '인사이드 아웃 2',
    creator: '켈시 맨',
    rating: 5,
    summary: '불안하고 미성숙했던 사춘기 시절의 나를 따뜻하게 안아주는 위로',
    content: '전작의 명성을 훌륭하게 이어받은, 아니 어쩌면 더 큰 울림을 주는 속편. 사춘기에서 어른으로 접어드는 라일리의 머릿속에 \'불안\', \'당황\', \'따분\', \'부럽\'이라는 새로운 감정들이 등장하며 벌어지는 뇌 속 모험담이다. 특히 \'불안이\'가 폭주하며 스스로 통제하지 못해 제자리에서 떨고 있는 장면은, 현대인들이 겪는 불안장애나 과도한 스트레스의 순간을 너무나도 시각적으로 잘 구현해 내어 보는 내내 울컥했다. 기쁨만이 나를 정의할 수 없듯이, 모나고 부끄러운 감정들마저도 나를 구성하는 소중한 일부라는 것을 보여준다. 어른들을 위한 완벽한 위로의 애니메이션.',
    quote: '',
    coverUrl: '',
    tags: ['디즈니픽사', '성장', '사춘기', '위로', '불안이'],
    watchedAt: '2024-06-20',
    place: '롯데시네마 건대입구',
    isRewatch: false,
    createdAt: '2024-06-20T15:45:00.000Z'
  },
  {
    id: 'sample-014',
    category: 'movie',
    title: '스파이더맨: 어크로스 더 유니버스',
    creator: '조아킴 도스 샌토스',
    rating: 5,
    summary: '영상 혁명이라는 단어는 오직 이 영화를 위해 존재한다',
    content: '단 1초도 지루할 틈이 없는 경이로운 애니메이션 작화의 극치. 힙합 스타일 of 드로잉, 수채화 톤의 세계관, 코믹북 도트 인쇄 기법 등이 매 프레임마다 다채롭게 융합되며 시각적 황홀경을 선사한다. 마일스 모랄레스가 짊어진 운명과 멀티버스 스파이더맨 군단과의 갈등이 매우 짜임새 있게 전개된다. 단순히 화려한 비주얼을 넘어 정체성에 대해 고뇌하는 청소년 스파이더맨들의 감정선도 놓치지 않았다. 마지막 결정적인 순간에 파트 1이 끝나며 스크린이 내려갈 때는 탄식이 터져 나올 만큼 아쉬웠다. 얼른 후속작이 나오기만을 기다릴 뿐이다.',
    quote: '',
    coverUrl: '',
    tags: ['스파이더맨', '멀티버스', '애니메이션', '영상미', '마블'],
    watchedAt: '2023-06-25',
    place: 'CGV 왕십리 IMAX',
    isRewatch: false,
    createdAt: '2023-06-25T13:00:00.000Z'
  },
  {
    id: 'sample-015',
    category: 'movie',
    title: '엘리멘탈',
    creator: '피터 손',
    rating: 4,
    summary: '서로 섞일 수 없는 불과 물이 만나 이루어낸 따뜻한 화학반응',
    content: '이민자 가정의 갈등과 화합, 그리고 서로 다른 원소들이 사랑을 통해 경계를 극복하는 이야기를 한국인 감독 특유의 정서로 아름답게 녹여냈다. 불의 성질을 가진 앰버와 물의 성질을 가진 웨이드가 만나며 서로를 변화시키는 연출이 위트 있고 감동적이다. 부모님의 기대와 자신의 진짜 꿈 사이에서 갈등하는 앰버의 모습은 많은 청년들에게 깊은 공감을 안겨준다. 픽사 특유의 반짝이는 상상력이 빛나고, Lauv가 부른 OST \'Steal The Show\'가 영화 내내 은은하게 귓가 맴돈다. 가족들과 다 함께 보기 더없이 좋은 영화.',
    quote: '',
    coverUrl: '',
    tags: ['디즈니픽사', '이민자', '가족애', '사랑', 'OST'],
    watchedAt: '2023-07-15',
    place: '집(디즈니+)',
    isRewatch: false,
    createdAt: '2023-07-15T20:30:00.000Z'
  },
  {
    id: 'sample-016',
    category: 'book',
    title: '불편한 편의점',
    creator: '김호연',
    rating: 5,
    summary: '차가운 도시의 구석, 작은 편의점이 건네는 따스한 위로와 온기',
    content: '서울역 노숙자였던 \'독고\'가 한 할머니의 파우치를 찾아준 인연으로 청파동의 한 골목 편의점 야간 알바를 시작하며 이야기가 풀려나간다. 독고의 시선에서 편의점을 거쳐 가는 손님들과 동료 알바생들의 아픔을 어루만져 주는 에피소드들이 옴니버스 형태로 이어지는데, 한 챕터 한 챕터 읽을 때마다 가슴 한구석이 찌릿하게 따뜻해진다. 자극적인 서사 없이도 이렇게 사람을 감동시킬 수 있다는 소설의 힘을 증명한다. 세상이 조금은 삭막하게 느껴질 때 꺼내 읽으면 위로를 건네주는 힐링 소설이다.',
    quote: '결국 삶은 관계였고 관계는 소통이었다. 행복은 내 옆의 사람과 마음을 나누는 데 있었다.',
    coverUrl: '',
    tags: ['김호연', '힐링소설', '따뜻함', '위로', '베스트셀러'],
    watchedAt: '2024-02-14',
    place: '도서관',
    isRewatch: false,
    createdAt: '2024-02-14T17:00:00.000Z'
  },
  {
    id: 'sample-017',
    category: 'book',
    title: '메리골드 마음 세탁소',
    creator: '윤정은',
    rating: 4,
    summary: '지우고 싶은 상처와 기억을 깨끗하게 빨아주는 마법 같은 세탁소',
    content: '마음을 치유해 주는 세탁소라는 신비로운 판타지적 설정을 기반으로 한 소설. 세탁소 주인 지은이 상처받은 이들의 기억을 깨끗이 세탁해 주는 에피소드들을 다룬다. 지우고 싶은 기억을 지운다고 해서 정말 행복해질까? 소설은 지우는 것보다 그 상처를 보듬고 앞으로 나아가는 것이 더 중요하다는 잔잔한 지혜를 준다. 문체 가볍고 따뜻해서 책장이 슥슥 넘어간다. 평소 생각이 많거나 이별, 실패로 마음의 생채기가 난 사람들에게 추천하고 싶은 작품.',
    quote: '마음의 얼룩을 완전히 지우는 마법은 없어요. 하지만 그 얼룩 위에 새로운 기억의 무늬를 그려 넣을 수는 있지요.',
    coverUrl: '',
    tags: ['윤정은', '판타지소설', '치유', '마음세탁', '한국문학'],
    watchedAt: '2024-04-05',
    place: '동네 북카페',
    isRewatch: false,
    createdAt: '2024-04-05T14:00:00.000Z'
  },
  {
    id: 'sample-018',
    category: 'book',
    title: '물고기는 존재하지 않는다',
    creator: '룰루 밀러',
    rating: 5,
    summary: '혼돈 가득한 삶 속에서 인간이 만든 질서의 허상을 완전히 뒤흔드는 경이로운 책',
    content: '단순한 과학 에세이인 줄 알고 폈다가, 저자의 지독한 개인사와 어류 분류학자 데이비드 스타 조던의 전기가 얽혀들며 후반부에 이르러 생각지도 못한 거대한 반전을 마주하게 되는 충격적이고 아름다운 논픽션이다. 자연계의 질서를 부여하려 평생을 바친 과학자의 열정과 그 이면에 도사린 인간의 오만함, 우생학이라는 비극을 조명한다. 저자는 우리가 상식이라 믿었던 \'어류(Fish)\'라는 분류 체계가 사실 과학적으로 존재하지 않는 허상임을 밝히며, 삶이 주는 혼돈에 굴복하지 않고 살아가야 하는 이유를 시적이고 통찰력 넘치는 문체로 풀어낸다. 올해 읽은 책 중 단연 독보적인 걸작.',
    quote: '우리는 우리를 둘러싼 혼돈을 지배하려고 규칙을 만들지만, 때로는 그 규칙이 우리를 눈멀게 만든다.',
    coverUrl: '',
    tags: ['룰루밀러', '논픽션', '어류', '과학에세이', '인생책'],
    watchedAt: '2024-10-30',
    place: '집 서재',
    isRewatch: false,
    createdAt: '2024-10-30T23:10:00.000Z'
  },
  {
    id: 'sample-019',
    category: 'book',
    title: '역행자',
    creator: '자청',
    rating: 3,
    summary: '자기 뇌의 오작동과 유전자의 지배를 거스르고 획득하는 자유의 비밀',
    content: '무자본 창업가로 유명한 자청이 쓴 자기계발서. 뇌의 오작동을 인지하고 유전자의 오작동을 극복하여 경제적 자유와 인생의 자유를 얻는 7단계 공식만을 설득력 있게 제시한다. 책의 전반적인 정서가 다소 도발적이고 상업적인 뉘앙스가 짙어 거부감이 드는 지점도 있으나, \'22전략(하루 2시간 독서와 글쓰기)\'이나 \'자의식 해체\'와 같은 구체적인 실천 전략은 확실히 삶을 변화시키는 실용적인 자극을 준다. 안일하게 굴던 일상에 뼈아픈 자극을 주기에 좋은 도파민 가득한 자기계발 도서.',
    quote: '대부분의 사람들은 유전자의 오작동에 갇혀 순리자로 살아간다. 그러나 상위 몇 퍼센트의 역행자는 의식적으로 뇌를 개조하여 나아간다.',
    coverUrl: '',
    tags: ['자청', '자기계발', '동기부여', '경제적자유', '독서법'],
    watchedAt: '2024-08-01',
    place: '스타벅스 강남',
    isRewatch: false,
    createdAt: '2024-08-01T10:00:00.000Z'
  },
  {
    id: 'sample-020',
    category: 'webtoon',
    title: '화산귀환',
    creator: '비가 (원작) / LICO (웹툰)',
    rating: 5,
    summary: '망해버린 화산파를 다시 일으키는 매화검존 청명의 짜릿한 천하제일 행보',
    content: '동명의 메가 히트 무협 웹소설을 LICO 작가가 웹툰화한 작품. 매화검존 청명이 100년 후 어린아이의 몸으로 환생하여 멸문해 가는 화산파를 부활시키는 과정을 담았다. 주인공 청명의 유쾌하고 도발적이면서도 가슴 뜨거운 동료애가 빛을 발한다. 연출이 매우 시원시원하며, 매화검법이 시각화되는 전투 씬의 화려한 작화력은 웹툰 플랫폼 통틀어 최고 수준이다. 가볍게 볼 수 있는 개그 코드와 묵직한 무협적 쾌감이 공존하는, 정주행을 멈출 수 없는 역대급 무협 웹툰.',
    quote: '',
    coverUrl: '',
    tags: ['무협', '환생', '청명', '화산파', 'LICO'],
    watchedAt: '2024-05-15',
    place: '네이버웹툰',
    isRewatch: false,
    createdAt: '2024-05-15T22:00:00.000Z'
  },
  {
    id: 'sample-021',
    category: 'webtoon',
    title: '가비지타임',
    creator: '2사장',
    rating: 5,
    summary: '최약체 고교 농구팀이 흘리는 땀방울과 꺾이지 않는 성장 드라마',
    content: '부산중앙고등학교 농구부의 실화를 모티브로 한 청춘 농구 웹툰. 부원 부족으로 해체 직전인 지상고등학교 농구부가 새로운 감독을 만나 전국대회에 도전하며 펼치는 성장 서사다. 슬램덩크의 오마주가 느껴지면서도, 현대 한국 고교 체육계의 어두운 현실이나 10대들의 날 것 그대로의 심리 묘사가 매우 정밀하다. 경기 중 벌어지는 전술적 움직임에 대한 해설이 훌륭하여 농구를 잘 모르는 사람도 몰입해서 볼 수 있으며, 각 인물들이 패배의 한계를 깨고 조각을 맞춰나가는 카타르시스가 엄청나다. 단언컨대 최고의 인생 스포츠 웹툰 중 하나.',
    quote: '',
    coverUrl: '',
    tags: ['농구', '스포츠', '성장', '지상고', '청춘'],
    watchedAt: '2024-09-10',
    place: '네이버웹툰',
    isRewatch: false,
    createdAt: '2024-09-10T19:30:00.000Z'
  },
  {
    id: 'sample-022',
    category: 'webtoon',
    title: '유미의 세포들',
    creator: '이동건',
    rating: 5,
    summary: '내 머릿속 세포들이 일구어내는 작고도 거대한 나의 인생 서사시',
    content: '30대 직장인 여성 유미의 머릿속 세포들을 의인화하여 그녀의 사랑과 일, 그리고 자아 성장을 그린 대작이다. 사랑세포, 이성세포, 감성세포, 출출세포 등 유미의 온갖 복잡한 감정을 위트 있게 시각화하여 매 에피소드마다 무릎을 치며 공감하게 만든다. 연애 서사에만 치중하지 않고, 유미가 작가라는 꿈을 위해 도전하고 주체적인 삶을 살아가게 되는 과정을 입체적으로 다루어 수많은 독자들에게 인생 웹툰으로 꼽힌다. 완결을 보았을 때 유미의 행복을 진심으로 응원하게 되는, 여운이 깊게 남는 따뜻한 작품.',
    quote: '',
    coverUrl: '',
    tags: ['일상', '연애', '세포들', '자아성장', '명작'],
    watchedAt: '2023-10-05',
    place: '네이버웹툰',
    isRewatch: false,
    createdAt: '2023-10-05T12:00:00.000Z'
  },
  {
    id: 'sample-023',
    category: 'etc',
    title: '요시고 사진전 — 따뜻한 휴일의 기록',
    creator: '요시고',
    rating: 4,
    summary: '지중해의 에메랄드빛 바다와 따뜻한 햇살을 담아낸 시각적 휴식',
    content: '그라운드시소 서촌에서 열렸던 요시고 작가의 사진전. 여행에 대한 갈증이 절정에 달했을 때 방문하여 지중해 바다와 이국적인 풍경을 담은 청량한 색감의 사진들을 보고 큰 위안을 얻었다. 빛과 그림자, 대칭과 정렬을 기막히게 잡아낸 구도가 편안함을 선사한다. 특히 수영장에서 헤엄치는 사람들을 물 밖에서 촬영한 시원한 스페인 해변 사진이 가장 기억에 남는다. 전시 관람 동선도 짜임새 있고, 코로나 시국에 억눌려 있던 여행의 욕구를 대리 만족시켜 주었던 기분 좋은 전시회.',
    quote: '',
    coverUrl: '',
    tags: ['전시', '요시고', '사진전', '서촌', '지중해'],
    watchedAt: '2023-09-15',
    place: '그라운드시소 서촌',
    isRewatch: false,
    createdAt: '2023-09-15T16:00:00.000Z'
  },
  {
    id: 'sample-024',
    category: 'etc',
    title: '혜화림 조용한 독서클럽 4기',
    creator: '혜화림 북살롱',
    rating: 5,
    summary: '온전히 나만의 생각과 활자에 침잠하는 고요한 주말 오후의 정취',
    content: '주말 오후 대학로의 조용한 한옥 북살롱에서 열리는 \'조용한 독서클럽\'에 참여했다. 스마트폰을 수거함에 반납하고, 다른 사람들과의 대화 없이 2시간 동안 오롯이 각자가 가져온 책을 집중해 읽은 뒤 차를 마시며 10분간 짤막하게 읽은 문장 한 줄을 나누는 방식으로 운영된다. 일상의 소음과 끝없는 디지털 피로도에서 벗어나 고요한 한옥 서까래 밑에서 책장 넘기는 소리만 들으며 책에 빠져드는 경험 자체가 엄청난 리프레시였다. 도파민 중독에 걸린 현대인들에게 가끔씩 꼭 권해주고 싶은 보석 같은 오프라인 쉼터.',
    quote: '',
    coverUrl: '',
    tags: ['독서모임', '한옥', '혜화', '디지털디톡스', '힐링'],
    watchedAt: '2026-05-10',
    place: '대학로 한옥 혜화림',
    isRewatch: false,
    createdAt: '2026-05-10T15:30:00.000Z'
  }
];

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function initData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let isEmpty = false;
  if (!raw) {
    isEmpty = true;
  } else {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        isEmpty = true;
      } else {
        // 기존에 sample 데이터들만 존재하고 24개 미만인 경우 (예: 기존 10개 샘플만 있던 상태)
        // 새롭게 확장된 24개 샘플 데이터 세트로 안전하게 자동 업데이트합니다.
        const isOnlySamples = parsed.every(e => String(e.id).startsWith('sample-'));
        if (isOnlySamples && parsed.length < 24) {
          isEmpty = true;
        }
      }
    } catch (e) {
      isEmpty = true;
    }
  }

  if (isEmpty) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
  } else {
    // 기존 로컬스토리지 데이터에서도 '페미니즘' 태그를 모두 제거하도록 마이그레이션 실행
    try {
      let entries = JSON.parse(raw);
      if (Array.isArray(entries)) {
        let changed = false;
        entries = entries.map(e => {
          if (e.tags && e.tags.includes('페미니즘')) {
            e.tags = e.tags.filter(t => t !== '페미니즘');
            changed = true;
          }
          return e;
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function getAll() {
  initData();
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getById(id) {
  return getAll().find(e => e.id === id) || null;
}

function save(entry) {
  const entries = getAll();
  if (!entry.id) {
    entry.id = generateId();
    entry.createdAt = new Date().toISOString();
    entries.unshift(entry);
  } else {
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx !== -1) {
      entries[idx] = entry;
    } else {
      entries.unshift(entry);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entry;
}

function update(id, data) {
  const entries = getAll();
  const idx = entries.findIndex(e => e.id === id);
  if (idx !== -1) {
    entries[idx] = Object.assign({}, entries[idx], data, { id: id });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries[idx];
  }
  return null;
}

function remove(id) {
  const entries = getAll().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getByCategory(category) {
  const all = getAll();
  if (!category || category === 'all') return all;
  return all.filter(e => e.category === category);
}

function getAllTags() {
  const freq = {};
  getAll().forEach(e => {
    (e.tags || []).forEach(t => {
      const tag = t.trim();
      if (tag) freq[tag] = (freq[tag] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

function getTagStats() {
  const stats = {};
  getAllTags().forEach(({ tag, count }) => {
    stats[tag] = count;
  });
  return stats;
}

function getByTag(tag) {
  return getAll().filter(e => (e.tags || []).includes(tag));
}

function search(keyword) {
  const q = String(keyword || '').trim().toLowerCase();
  if (!q) return getAll();
  return getAll().filter(e => {
    const text = [e.title, e.creator, e.summary, e.content]
      .filter(Boolean).join(' ').toLowerCase();
    const tagHit = (e.tags || []).some(t => t.toLowerCase().includes(q));
    return text.includes(q) || tagHit;
  });
}

function exportJson() {
  const data = JSON.stringify(getAll(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = 'inklog-backup-' + today + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * JSON 파일을 읽어 기존 데이터와 병합한다.
 * 같은 id는 가져온 데이터로 덮어쓰고, 새 id는 추가한다.
 * callback(err, importedCount)
 */
function importJson(file, callback) {
  const reader = new FileReader();
  reader.onload = function () {
    let imported;
    try {
      imported = JSON.parse(reader.result);
    } catch (e) {
      callback(new Error('JSON 형식이 올바르지 않습니다.'));
      return;
    }
    if (!Array.isArray(imported)) {
      callback(new Error('감상문 목록 형식이 아닙니다.'));
      return;
    }
    const valid = imported.filter(e =>
      e && typeof e === 'object' && e.id && e.title && e.category
    );
    if (valid.length === 0) {
      callback(new Error('가져올 수 있는 감상문이 없습니다.'));
      return;
    }
    const entries = getAll();
    valid.forEach(item => {
      const idx = entries.findIndex(e => e.id === item.id);
      if (idx !== -1) entries[idx] = item;
      else entries.unshift(item);
    });
    entries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    callback(null, valid.length);
  };
  reader.onerror = function () {
    callback(new Error('파일을 읽지 못했습니다.'));
  };
  reader.readAsText(file);
}

const InklogData = {
  getAll,
  getById,
  save,
  update,
  remove,
  getByCategory,
  getAllTags,
  getTagStats,
  getByTag,
  search,
  exportJson,
  importJson,
  initData
};
