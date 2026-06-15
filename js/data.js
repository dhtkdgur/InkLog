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
    content: '봉준호 감독이 세계의 스크린을 점령한 작품. 반지하 가족과 부유한 박 사장 가족의 이야기를 통해 현대 한국 사회의 계층 갈등을 섬세하면서도 날카롭게 풀어낸다.\n\n계단을 오르내리는 구도 하나하나에 계급의 상승과 하강이 담겨 있고, 냄새라는 보이지 않는 언어로 계층의 경계를 그린다. 예측할 수 없는 플롯 전환과 완벽한 앙상블이 두 시간 내내 긴장의 끈을 놓지 못하게 한다.\n\n아카데미 작품상은 결코 과한 평가가 아니었다. 영화가 끝난 후에도 한참 동안 여운이 남았다.',
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
    content: '마동석 형사 마석도가 이번에는 온라인 도박과 결탁한 조직 범죄와 맞서 싸운다. 시리즈가 거듭될수록 스케일이 커지고 있고 이번에도 액션의 쾌감은 기대를 저버리지 않는다.\n\n마동석의 주먹 한 방에 악당이 날아가는 장면은 언제 봐도 통쾌하다. 관객이 원하는 것을 정확히 알고 그것을 충실히 제공하는 영화다.\n\n시리즈 팬이라면 충분히 즐길 수 있는 작품이지만, 전작들과 비교하면 플롯의 참신함은 다소 아쉽다. 그럼에도 극장에서 함께 웃고 환호하는 재미는 뚜렷하다.',
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
    content: '대규모 지진으로 서울이 폐허가 된 세계. 유일하게 살아남은 황궁 아파트를 중심으로 생존자들이 모여드는 이야기다. 아파트 주민들은 생존을 위해 외부인을 배척하고, 점점 극단적인 선택을 내린다.\n\n이병헌의 카리스마 넘치는 연기가 영화를 이끌고, 박보영과 박서준도 인물의 변화를 설득력 있게 표현한다. 재난 영화라는 외피 아래 한국 사회의 공동체 의식과 이기심을 날카롭게 비판한다.\n\n불편하지만 눈을 뗄 수 없는 영화. 끝나고 나서 한동안 아파트를 바라보는 시선이 달라졌다.',
    quote: '',
    coverUrl: '',
    tags: ['재난', '생존', '아파트', '한국사회', '디스토피아'],
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
    content: '한강 작가가 노벨문학상을 받기 훨씬 전부터 세계 문학계가 주목한 작품. 세 편의 연작으로 구성된 이 소설은 채식주의자 선언을 한 여자 영혜의 이야기를 각기 다른 시점으로 풀어낸다.\n\n인간의 폭력성과 그에 저항하는 방식, 몸과 정신의 경계, 사회적 규범에 대한 거부를 섬세하고 시적인 문장으로 담아냈다. 읽는 내내 불편하지만 눈을 뗄 수 없다.\n\n맨부커 인터내셔널상 수상작이자 현대 한국 문학의 정수. 다 읽고 나서 한참 멍하니 앉아있었다.',
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
    content: '편도체가 작아 감정을 느끼지 못하는 소년 윤재의 성장 소설. 공감 능력이 없는 주인공이 오히려 타인의 감정을 가장 순수하게 바라보는 역설이 이 소설의 핵심이다.\n\n폭력적인 소년 곤이와의 우정을 통해 윤재는 조금씩 세상과 연결되기 시작한다. 손원평 작가의 문장은 군더더기 없이 깔끔하면서도 감동적이다.\n\n청소년 문학이라는 꼬리표가 붙어 있지만, 어른이 읽어도 충분히 울림이 있다.',
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
    content: '1982년생 김지영 씨의 삶을 통해 한국 여성이 경험하는 사회적 차별과 불평등을 담담하게 기록한 소설. 소설이라기보다는 르포에 가까울 만큼 현실적이다.\n\n김지영의 이야기가 특별하지 않다는 점, 이것이 수많은 여성들의 평범한 일상이었다는 점이 이 책의 가장 강렬한 메시지다. 읽는 내내 분노와 슬픔이 교차했다.\n\n사회적으로 많은 논쟁을 불러일으킨 책이지만, 그 논쟁 자체가 이 책의 필요성을 증명한다. 많은 사람들이 읽어야 할 책이다.',
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
    content: '전 세계에서 가장 약한 E급 헌터 성진우가 특별한 능력을 얻어 최강의 헌터로 성장하는 판타지 웹툰. 소위 먼치킨 장르의 교과서 같은 작품이다.\n\n단순히 강해지는 것이 목적이 아니라, 주인공의 성장 과정과 그를 둘러싼 세계관이 촘촘하게 구성되어 있다. 장성락 작가의 그림체는 액션 씬에서 특히 폭발적이다.\n\n가볍게 읽기 시작했다가 새벽 4시가 될 때까지 정주행했다. 웹툰을 잘 안 보는 사람들에게도 추천하는 입문작.',
    quote: '',
    coverUrl: '',
    tags: ['추공', '판타지', '먼치킨', '헌터', '성장'],
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
    content: '외모 때문에 학교 생활이 힘들었던 주인공이 어느 날 몸이 바뀌면서 겪는 이야기. 단순한 판타지처럼 보이지만 외모지상주의 사회를 날카롭게 비판한다.\n\n박태준 작가의 탄탄한 스토리와 감정선이 돋보이는 작품이다. 주인공이 다양한 경험을 통해 진짜 자신을 찾아가는 과정이 설득력 있게 그려진다.\n\n학원물 특유의 공감 포인트가 많고, 성장 이야기로서도 충분히 완성도 있다.',
    quote: '',
    coverUrl: '',
    tags: ['박태준', '학원물', '성장', '웹툰', '사회비판'],
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
    content: '씨네마운틴 팟캐스트 82화. 올해 한국 영화 결산을 주제로 세 명의 패널이 각자의 베스트 5를 선정하고 토론한다.\n\n단순한 추천을 넘어 영화의 사회적 맥락과 산업적 의미까지 논의하는 깊이가 인상적이다. 평소에 흘려듣던 영화들을 새로운 시각으로 볼 수 있게 해준다.\n\n약 1시간 30분 분량인데 지루하지 않고 오히려 시간이 부족하게 느껴졌다. 영화를 좋아한다면 구독 추천.',
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
    content: '국립현대미술관 서울관에서 열린 올해의 작가상 2024 전시. 올해의 작가 4인이 한국 동시대 미술의 다양한 면을 보여주는 전시다.\n\n각 작가의 작업실을 재현한 공간이 특히 인상적이었다. 작가가 어떤 생각으로 작품을 만드는지, 그 과정이 투명하게 공유되어 관람객이 단순 감상자에서 협업자처럼 느끼게 된다.\n\n입장료도 합리적이고 공간도 쾌적하다. 현대미술에 거리감을 느끼는 분들에게도 강력 추천하는 전시.',
    quote: '',
    coverUrl: '',
    tags: ['전시', '현대미술', '서울', '추천', '국립현대미술관'],
    watchedAt: '2024-11-24',
    place: '국립현대미술관 서울관',
    isRewatch: false,
    createdAt: '2024-11-24T15:00:00.000Z'
  }
];

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function initData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
  } else {
    // 기존 로컬스토리지 데이터에서도 '페미니즘' 태그를 모두 제거하도록 마이그레이션 실행
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        let entries = JSON.parse(raw);
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
