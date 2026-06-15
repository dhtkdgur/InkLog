/* =====================================================
   Inklog — app.js  (page-level logic)
   ===================================================== */

// ── Helpers ──────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_COVERS = {
  movie:   'images/default/movie.svg',
  book:    'images/default/book.svg',
  webtoon: 'images/default/webtoon.svg',
  etc:     'images/default/etc.svg'
};

const CATEGORY_LABELS = {
  movie:   '영화',
  book:    '책',
  webtoon: '웹툰',
  etc:     '기타'
};

function formatDate(str) {
  if (!str) return '';
  // YYYY-MM-DD or ISO
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.getFullYear() + '. ' +
    String(d.getMonth() + 1).padStart(2, '0') + '. ' +
    String(d.getDate()).padStart(2, '0');
}

function starsHtml(rating, size) {
  let html = '<span class="star-display' + (size ? ' ' + size : '') + '">';
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-regular fa-star empty"></i>';
  }
  html += '</span>';
  return html;
}

function coverSrc(entry) {
  return (entry.coverUrl && entry.coverUrl.trim()) ? entry.coverUrl : DEFAULT_COVERS[entry.category] || DEFAULT_COVERS.etc;
}

function buildCard(entry) {
  const cat = CATEGORY_LABELS[entry.category] || entry.category;
  const safeCat = esc(entry.category);
  const fallback = DEFAULT_COVERS[entry.category] || DEFAULT_COVERS.etc;
  const dateStr = entry.watchedAt ? formatDate(entry.watchedAt) : formatDate(entry.createdAt);

  // Tags: max 3 + overflow
  const tags = entry.tags || [];
  let tagsHtml = '';
  if (tags.length > 0) {
    const shown = tags.slice(0, 3);
    tagsHtml = shown.map(t => `<span class="tag-badge">${esc(t)}</span>`).join('');
    if (tags.length > 3) {
      tagsHtml += `<span class="tag-badge">+${tags.length - 3}</span>`;
    }
  }

  return `
    <div class="entry-card">
      <img class="card-cover" src="${esc(coverSrc(entry))}" alt="${esc(entry.title)}" onerror="this.src='${esc(fallback)}'" loading="lazy">
      <div class="card-body">
        <div class="card-meta">
          <span class="category-tag ${safeCat}">${esc(cat)}</span>
          <span class="card-date">${esc(dateStr)}</span>
        </div>
        <h3>${esc(entry.title)}</h3>
        <p class="card-creator">${esc(entry.creator || '')}</p>
        ${starsHtml(entry.rating)}
        <p class="card-summary">${esc(entry.summary)}</p>
        ${tagsHtml ? `<div class="tags-area" style="margin-bottom:0;">${tagsHtml}</div>` : ''}
      </div>
      <div class="card-footer">
        <a href="detail.html?id=${esc(entry.id)}" class="btn-detail">자세히 보기 <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>`;
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'inklog-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, 2500);
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hrefPage = href.split('?')[0];
    if (hrefPage === path) {
      a.classList.add('active');
      // expand parent opener if in submenu
      const parentLi = a.closest('li');
      if (parentLi) {
        const ul = parentLi.closest('ul');
        if (ul) {
          const openerLi = ul.closest('li');
          if (openerLi) {
            openerLi.classList.add('active');
            const opener = openerLi.querySelector('span.opener');
            if (opener) opener.classList.add('active');
          }
        }
      }
    }
  });
}

// ── COUNT-UP ANIMATION ────────────────────────────────
function animateCount(el, target, duration) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── INDEX PAGE ────────────────────────────────────────
function initIndex() {
  InklogData.initData();
  const entries = InklogData.getAll();

  // Stats counters
  const counts = { all: entries.length, movie: 0, book: 0, webtoon: 0, etc: 0 };
  entries.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });

  document.querySelectorAll('[data-count-target]').forEach(el => {
    const key = el.dataset.countTarget;
    animateCount(el, counts[key] || 0, 900);
  });

  // Category cards count
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const cat = el.dataset.catCount;
    el.textContent = counts[cat] || 0;
  });

  // Recent 3
  const recent = entries.slice(0, 3);
  const grid = document.getElementById('recent-grid');
  if (grid) {
    if (recent.length === 0) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-regular fa-face-smile-wink"></i><h3>아직 감상문이 없어요</h3><p>첫 번째 감상문을 작성해보세요!</p><a href="write.html" class="btn-primary" style="margin-top:1rem;display:inline-flex;">감상문 쓰기</a></div>';
    } else {
      grid.innerHTML = recent.map(buildCard).join('');
    }
  }

  // Rating distribution bar chart
  const ratingFreq = [0, 0, 0, 0, 0];
  entries.forEach(e => {
    if (e.rating >= 1 && e.rating <= 5) ratingFreq[e.rating - 1]++;
  });
  const maxCount = Math.max(...ratingFreq, 1);

  document.querySelectorAll('[data-rating-bar]').forEach(el => {
    const star = parseInt(el.dataset.ratingBar, 10);
    const cnt = ratingFreq[star - 1];
    const pct = Math.round((cnt / maxCount) * 100);
    setTimeout(() => { el.style.width = pct + '%'; }, 200);
    const row = el.closest('.rating-row');
    if (row) {
      const countEl = row.querySelector('.count-label');
      if (countEl) countEl.textContent = cnt + '개';
    }
  });

  // Tag cloud preview (top 15)
  const allTags = InklogData.getAllTags().slice(0, 15);
  const cloudEl = document.getElementById('tag-cloud-preview');
  if (cloudEl && allTags.length > 0) {
    const maxCnt = allTags[0].count;
    const minCnt = allTags[allTags.length - 1].count;
    const minSize = 13, maxSize = 24;
    cloudEl.innerHTML = allTags.map(({ tag, count }) => {
      const size = minSize + ((count - minCnt) / (maxCnt - minCnt || 1)) * (maxSize - minSize);
      return `<a href="tag.html?tag=${encodeURIComponent(tag)}" class="tag-cloud-item" style="font-size:${size.toFixed(1)}px">#${esc(tag)}</a>`;
    }).join('');
  } else if (cloudEl) {
    cloudEl.innerHTML = '<p class="muted-note">아직 태그가 없습니다.</p>';
  }

  // Home search bar → list.html?q=
  const searchForm = document.getElementById('home-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('home-search-input');
      const q = input ? input.value.trim() : '';
      window.location.href = q ? 'list.html?q=' + encodeURIComponent(q) : 'list.html';
    });
  }

  // Monthly record chart (last 6 months, by createdAt)
  const monthlyEl = document.getElementById('monthly-chart');
  if (monthlyEl) {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
        label: (d.getMonth() + 1) + '월',
        count: 0
      });
    }
    entries.forEach(e => {
      const d = new Date(e.createdAt);
      if (isNaN(d.getTime())) return;
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      const m = months.find(m => m.key === key);
      if (m) m.count++;
    });
    const maxMonth = Math.max(...months.map(m => m.count), 1);
    monthlyEl.innerHTML = months.map(m => `
      <div class="rating-row">
        <span class="stars-label">${esc(m.label)}</span>
        <div class="rating-bar-track"><div class="rating-bar-fill" data-width="${Math.round((m.count / maxMonth) * 100)}"></div></div>
        <span class="count-label">${m.count}개</span>
      </div>`).join('');
    monthlyEl.querySelectorAll('.rating-bar-fill').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 200);
    });
  }

  // Best picks (highest rating, newest first, max 2)
  const bestGrid = document.getElementById('best-grid');
  const bestSection = document.getElementById('best-section');
  if (bestGrid) {
    const maxRating = Math.max(...entries.map(e => e.rating || 0), 0);
    const best = entries
      .filter(e => e.rating === maxRating)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    if (best.length > 0) {
      bestGrid.innerHTML = best.map(buildCard).join('');
    } else if (bestSection) {
      bestSection.style.display = 'none';
    }
  }

  // Daily quote (random entry that has a quote)
  const quoteSection = document.getElementById('daily-quote-section');
  if (quoteSection) {
    const withQuote = entries.filter(e => e.quote && e.quote.trim());
    const quoteEl = document.getElementById('daily-quote-text');
    const srcEl = document.getElementById('daily-quote-source');
    if (withQuote.length === 0) {
      if (quoteEl) quoteEl.textContent = "아직 기록된 인용구가 없습니다. 책을 읽고 마음을 울린 한 줄을 남겨보세요.";
      if (srcEl) srcEl.innerHTML = "— Inklog 가이드";
    } else {
      const pick = withQuote[Math.floor(Math.random() * withQuote.length)];
      if (quoteEl) quoteEl.textContent = pick.quote;
      if (srcEl) {
        srcEl.innerHTML = `— <a href="detail.html?id=${esc(pick.id)}">${esc(pick.title)}</a>${pick.creator ? ', ' + esc(pick.creator) : ''}`;
      }
    }
  }
}

// ── LIST PAGE ─────────────────────────────────────────
function initList() {
  InklogData.initData();
  let currentCategory = 'all';
  let currentSort = 'newest';
  let currentQuery = (getParam('q') || '').trim();

  // Support both ?category= (spec) and ?cat= (legacy)
  const catParam = getParam('category') || getParam('cat');
  if (catParam && ['movie', 'book', 'webtoon', 'etc'].includes(catParam)) {
    currentCategory = catParam;
  }

  function render() {
    let entries = currentQuery
      ? InklogData.search(currentQuery).filter(e => currentCategory === 'all' || e.category === currentCategory)
      : InklogData.getByCategory(currentCategory);

    if (currentSort === 'rating-desc') {
      entries = [...entries].sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentSort === 'rating-asc') {
      entries = [...entries].sort((a, b) => a.rating - b.rating || new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      entries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const grid = document.getElementById('list-grid');
    if (!grid) return;

    if (entries.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <i class="fa-regular fa-folder-open"></i>
        <h3>감상문이 없어요</h3>
        <p>첫 번째 감상문을 작성해보세요!</p>
        <a href="write.html" class="btn-primary" style="margin-top:1rem;display:inline-flex;">
          <i class="fa-solid fa-pen-nib"></i>&nbsp;감상문 쓰기
        </a>
      </div>`;
    } else {
      grid.innerHTML = entries.map(buildCard).join('');
    }

    const countEl = document.getElementById('entry-count');
    if (countEl) countEl.textContent = entries.length;

    // 검색어 표시
    const queryLabel = document.getElementById('search-query-label');
    if (queryLabel) {
      if (currentQuery) {
        queryLabel.textContent = '"' + currentQuery + '" 검색 결과 — ';
        queryLabel.style.display = '';
      } else {
        queryLabel.textContent = '';
        queryLabel.style.display = 'none';
      }
    }
  }

  // 검색 입력
  const searchInput = document.getElementById('list-search-input');
  const searchForm = document.getElementById('list-search-form');
  if (searchInput) {
    searchInput.value = currentQuery;
    searchInput.addEventListener('input', function () {
      currentQuery = this.value.trim();
      history.replaceState(null, '', currentQuery ? '?q=' + encodeURIComponent(currentQuery) : window.location.pathname);
      render();
    });
  }
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  // Filter tabs — set active based on URL param
  document.querySelectorAll('.filter-tab').forEach(tab => {
    if (tab.dataset.cat === currentCategory) {
      tab.classList.add('active');
    }
    tab.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.cat;
      render();
    });
  });

  // Sort
  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      currentSort = this.value;
      render();
    });
  }

  render();
}

// ── WRITE / EDIT PAGE ─────────────────────────────────
function initWrite() {
  InklogData.initData();

  // selectedRating must be declared before prefillForm() is called
  // (prefillForm is hoisted, but let-variables are not — TDZ would crash otherwise)
  let selectedRating = 0;

  const editId = getParam('edit') || getParam('id');
  let editEntry = null;
  if (editId) {
    editEntry = InklogData.getById(editId);
    if (!editEntry && window.location.pathname.split('/').pop() === 'edit.html') {
      window.location.href = 'list.html';
      return;
    }
    if (editEntry) {
      prefillForm(editEntry);          // sets selectedRating = entry.rating
      const pageTitle = document.getElementById('page-title');
      if (pageTitle) pageTitle.textContent = '감상문 수정';
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) submitBtn.textContent = '수정 저장';
    }
  }

  // UX 1: 새 글 작성 시 감상 날짜에 오늘 날짜 자동 기입
  if (!editEntry) {
    const dateInput = document.getElementById('f-watchedat');
    if (dateInput) {
      const today = new Date();
      const offset = today.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(today - offset)).toISOString().slice(0, 10);
      dateInput.value = localISOTime;
    }
  }

  // UX 2: 커버 이미지 실시간 미리보기 기능
  const coverInput = document.getElementById('f-cover');
  const coverPreviewWrapper = document.getElementById('cover-preview-wrapper');
  const coverPreview = document.getElementById('cover-preview');

  function updateCoverPreview() {
    const url = coverInput ? coverInput.value.trim() : '';
    if (url) {
      if (coverPreview) {
        coverPreview.src = url;
        if (coverPreviewWrapper) coverPreviewWrapper.style.display = 'block';
      }
    } else {
      if (coverPreviewWrapper) coverPreviewWrapper.style.display = 'none';
    }
  }

  if (coverInput) {
    coverInput.addEventListener('input', updateCoverPreview);
    if (coverPreview) {
      coverPreview.addEventListener('error', function () {
        if (coverPreviewWrapper) coverPreviewWrapper.style.display = 'none';
      });
    }
    // 수정 모드일 때 기존 URL 미리보기 출력
    if (editEntry && editEntry.coverUrl) {
      updateCoverPreview();
    }
  }

  // UX 3: 카테고리 선택에 따라 라벨 및 플레이스홀더 동적 변경
  const categoryEl = document.getElementById('f-category');
  const titleInput = document.getElementById('f-title');
  const creatorLabel = document.querySelector('label[for="f-creator"]');
  const creatorInput = document.getElementById('f-creator');

  const PLACEHOLDERS = {
    movie: '예: 기생충, 라라랜드, 다크 나이트',
    book: '예: 채식주의자, 아몬드, 사피엔스',
    webtoon: '예: 나 혼자만 레벨업, 미생, 화산귀환',
    etc: '예: 콘서트, 팟캐스트, 전시회, 공연'
  };

  const CREATOR_LABELS = {
    movie: '감독 / 주연 배우 <span class="label-optional">(선택)</span>',
    book: '저자 / 작가 / 번역가 <span class="label-optional">(선택)</span>',
    webtoon: '글 / 그림 작가 <span class="label-optional">(선택)</span>',
    etc: '창작자 / 아티스트 <span class="label-optional">(선택)</span>'
  };

  function updateCategoryUI() {
    const cat = categoryEl ? categoryEl.value : '';
    if (titleInput) {
      titleInput.placeholder = PLACEHOLDERS[cat] || '예: 작품 제목을 입력하세요.';
    }
    if (creatorLabel) {
      creatorLabel.innerHTML = CREATOR_LABELS[cat] || '감독 / 저자 / 작가 <span class="label-optional">(선택)</span>';
    }
    if (creatorInput) {
      creatorInput.placeholder = cat === 'movie' ? '예: 봉준호, 크리스토퍼 놀란' :
                                 cat === 'book' ? '예: 한강, 유발 하라리' :
                                 cat === 'webtoon' ? '예: 추공, 장성락' : '예: 창작자 혹은 아티스트명';
    }
  }

  if (categoryEl) {
    categoryEl.addEventListener('change', updateCategoryUI);
    // 수정 모드이거나 카테고리가 이미 정해진 경우 UI 즉시 초기화
    updateCategoryUI();
  }

  // Star rating
  const stars = document.querySelectorAll('.star-input i');

  function updateStars(n) {
    stars.forEach((s, i) => {
      if (i < n) {
        s.classList.remove('fa-regular');
        s.classList.add('fa-solid', 'active');
      } else {
        s.classList.remove('fa-solid', 'active');
        s.classList.add('fa-regular');
      }
    });
  }

  stars.forEach((star, idx) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => s.classList.toggle('hover', i <= idx));
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });
    star.addEventListener('click', () => {
      selectedRating = idx + 1;
      updateStars(selectedRating);
    });
  });

  if (editEntry) updateStars(editEntry.rating);

  // Quote field toggle (book only)
  const categoryEl = document.getElementById('f-category');
  function toggleQuoteField() {
    const quoteGroup = document.getElementById('quote-group');
    if (quoteGroup) {
      quoteGroup.style.display = (categoryEl && categoryEl.value === 'book') ? 'block' : 'none';
    }
  }
  if (categoryEl) {
    categoryEl.addEventListener('change', toggleQuoteField);
    toggleQuoteField();
  }

  // Live tag preview
  const tagsInput = document.getElementById('f-tags');
  const tagPreview = document.getElementById('tag-preview');
  if (tagsInput && tagPreview) {
    function updateTagPreview() {
      const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
      tagPreview.innerHTML = tags.map(t => `<span class="tag-badge">${esc(t)}</span>`).join('');
    }
    tagsInput.addEventListener('input', updateTagPreview);
    if (editEntry) updateTagPreview();
  }

  // Datalist for tag autocomplete
  const allTags = InklogData.getAllTags();
  const datalist = document.getElementById('tags-datalist');
  if (datalist) {
    datalist.innerHTML = allTags.map(({ tag }) => `<option value="${esc(tag)}">`).join('');
  }

  // Form submit
  const form = document.getElementById('write-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const tagsRaw = document.getElementById('f-tags') ? document.getElementById('f-tags').value.trim() : '';
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    const entry = {
      id: editEntry ? editEntry.id : '',
      category: document.getElementById('f-category').value,
      title: document.getElementById('f-title').value.trim(),
      creator: (document.getElementById('f-creator') ? document.getElementById('f-creator').value.trim() : ''),
      rating: selectedRating || 3,
      summary: document.getElementById('f-summary').value.trim(),
      content: document.getElementById('f-content').value.trim(),
      quote: (document.getElementById('f-quote') ? document.getElementById('f-quote').value.trim() : ''),
      coverUrl: (document.getElementById('f-cover') ? document.getElementById('f-cover').value.trim() : ''),
      tags: tags,
      watchedAt: (document.getElementById('f-watchedat') ? document.getElementById('f-watchedat').value : ''),
      place: (document.getElementById('f-place') ? document.getElementById('f-place').value.trim() : ''),
      isRewatch: !!(document.getElementById('f-isrewatch') && document.getElementById('f-isrewatch').checked),
      createdAt: editEntry ? editEntry.createdAt : new Date().toISOString()
    };

    const saved = InklogData.save(entry);
    showToast(editEntry ? '수정되었습니다!' : '감상문이 저장되었습니다!');
    setTimeout(() => {
      window.location.href = 'detail.html?id=' + encodeURIComponent(saved.id);
    }, 800);
  });

  function validateForm() {
    let valid = true;
    const required = [
      { id: 'f-category', err: 'err-category', msg: '카테고리를 선택해주세요.' },
      { id: 'f-title',    err: 'err-title',    msg: '제목을 입력해주세요.' },
      { id: 'f-summary',  err: 'err-summary',  msg: '한줄평을 입력해주세요.' },
      { id: 'f-content',  err: 'err-content',  msg: '본문을 입력해주세요.' }
    ];
    required.forEach(({ id, err, msg }) => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(err);
      if (!el || !errEl) return;
      if (!el.value.trim()) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
        valid = false;
      } else {
        errEl.classList.remove('visible');
      }
    });

    const ratingErr = document.getElementById('err-rating');
    if (ratingErr) {
      if (selectedRating === 0) {
        ratingErr.textContent = '별점을 선택해주세요.';
        ratingErr.classList.add('visible');
        valid = false;
      } else {
        ratingErr.classList.remove('visible');
      }
    }
    return valid;
  }

  function prefillForm(entry) {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    setVal('f-category', entry.category);
    setVal('f-title',    entry.title);
    setVal('f-creator',  entry.creator || '');
    setVal('f-summary',  entry.summary);
    setVal('f-content',  entry.content);
    setVal('f-quote',    entry.quote || '');
    setVal('f-cover',    entry.coverUrl || '');
    setVal('f-tags',     entry.tags ? entry.tags.join(', ') : '');
    setVal('f-watchedat', entry.watchedAt || '');
    setVal('f-place',    entry.place || '');
    if (entry.isRewatch) {
      const cb = document.getElementById('f-isrewatch');
      if (cb) cb.checked = true;
    }
    selectedRating = entry.rating;
  }
}

// ── DETAIL PAGE ───────────────────────────────────────
function initDetail() {
  InklogData.initData();
  const id = getParam('id');
  if (!id) { window.location.href = 'list.html'; return; }

  const entry = InklogData.getById(id);
  if (!entry) { window.location.href = 'list.html'; return; }

  // Cover
  const coverImg = document.getElementById('detail-cover-img');
  if (coverImg) {
    coverImg.src = coverSrc(entry);
    coverImg.alt = entry.title;
    coverImg.onerror = function () { this.src = DEFAULT_COVERS[entry.category] || DEFAULT_COVERS.etc; };
  }

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
  const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  setText('detail-title',   entry.title);
  setText('detail-creator', entry.creator || '');
  setHtml('detail-stars',   starsHtml(entry.rating));
  setText('detail-summary', entry.summary);
  setText('detail-content', entry.content);

  // watchedAt & place
  if (entry.watchedAt) {
    setText('detail-watchedat', formatDate(entry.watchedAt));
    const watchedGroup = document.getElementById('detail-watchedat-group');
    if (watchedGroup) watchedGroup.style.display = '';
  }
  if (entry.place) {
    setText('detail-place', entry.place);
    const placeGroup = document.getElementById('detail-place-group');
    if (placeGroup) placeGroup.style.display = '';
  }
  if (entry.isRewatch) {
    const rewatchEl = document.getElementById('detail-rewatch');
    if (rewatchEl) rewatchEl.style.display = '';
  }

  // createdAt & content length
  if (entry.createdAt) {
    setText('detail-createdat', formatDate(entry.createdAt) + ' 작성');
    const group = document.getElementById('detail-createdat-group');
    if (group) group.style.display = '';
  }
  const contentLen = (entry.content || '').replace(/\s/g, '').length;
  if (contentLen > 0) {
    setText('detail-length', contentLen.toLocaleString() + '자');
    const group = document.getElementById('detail-length-group');
    if (group) group.style.display = '';
  }

  // Category badge
  const catEl = document.getElementById('detail-category');
  if (catEl) {
    const safeCat = /^(movie|book|webtoon|etc)$/.test(entry.category) ? entry.category : 'etc';
    catEl.className = 'category-tag detail-category-tag ' + safeCat;
    catEl.textContent = CATEGORY_LABELS[entry.category] || entry.category;
  }

  // Quote (book only)
  const quoteBlock = document.getElementById('quote-block');
  const quoteEl = document.getElementById('detail-quote');
  if (quoteBlock && quoteEl && entry.category === 'book' && entry.quote) {
    quoteEl.textContent = entry.quote;
    quoteBlock.style.display = 'block';
  }

  // Tags (as links)
  const tagsEl = document.getElementById('detail-tags');
  if (tagsEl && entry.tags && entry.tags.length) {
    tagsEl.innerHTML = entry.tags.map(t =>
      `<a href="tag.html?tag=${encodeURIComponent(t)}" class="tag-badge">${esc(t)}</a>`
    ).join('');
  } else if (tagsEl) {
    tagsEl.innerHTML = '<span style="color:#bbb;font-size:.82rem;">태그 없음</span>';
  }

  // Edit button
  const editBtn = document.getElementById('btn-edit');
  if (editBtn) editBtn.href = 'edit.html?id=' + encodeURIComponent(id);

  // Delete button
  const delBtn = document.getElementById('btn-delete');
  if (delBtn) {
    delBtn.addEventListener('click', function () {
      if (confirm('정말 삭제하시겠습니까?')) {
        InklogData.remove(id);
        showToast('삭제되었습니다.');
        setTimeout(() => { window.location.href = 'list.html'; }, 800);
      }
    });
  }

  // Share: copy URL
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => showToast('링크가 복사되었습니다!'))
          .catch(() => showToast('복사에 실패했습니다.'));
      } else {
        // 구형 브라우저 fallback
        const tmp = document.createElement('input');
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); showToast('링크가 복사되었습니다!'); }
        catch (e) { showToast('복사에 실패했습니다.'); }
        tmp.remove();
      }
    });
  }

  // Related entries: 태그가 겹치는 글 우선, 같은 카테고리는 가산점
  const myTags = entry.tags || [];
  const related = InklogData.getAll()
    .filter(e => e.id !== entry.id)
    .map(e => {
      const tagScore = (e.tags || []).filter(t => myTags.includes(t)).length;
      const catScore = e.category === entry.category ? 0.5 : 0;
      return { e, score: tagScore + catScore };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.e.createdAt) - new Date(a.e.createdAt))
    .slice(0, 3)
    .map(x => x.e);
  const relGrid = document.getElementById('related-grid');
  if (relGrid) {
    if (related.length > 0) {
      relGrid.innerHTML = related.map(buildCard).join('');
      const relSection = document.getElementById('related-section');
      if (relSection) relSection.style.display = '';
    } else {
      const relSection = document.getElementById('related-section');
      if (relSection) relSection.style.display = 'none';
    }
  }

  // Prev / Next navigation (작성순 기준: 저장 배열 = 최신순)
  const all = InklogData.getAll();
  const idx = all.findIndex(e => e.id === entry.id);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;
  const navEl = document.getElementById('detail-nav');
  if (navEl && (newer || older)) {
    navEl.innerHTML = `
      ${older ? `<a class="detail-nav-link prev" href="detail.html?id=${esc(older.id)}">
          <span class="nav-label"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> 이전 기록</span>
          <span class="nav-title">${esc(older.title)}</span>
        </a>` : '<span class="detail-nav-spacer"></span>'}
      ${newer ? `<a class="detail-nav-link next" href="detail.html?id=${esc(newer.id)}">
          <span class="nav-label">다음 기록 <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
          <span class="nav-title">${esc(newer.title)}</span>
        </a>` : '<span class="detail-nav-spacer"></span>'}`;
    navEl.style.display = '';
  }
}

// ── GALLERY PAGE ──────────────────────────────────────
function initGallery() {
  InklogData.initData();
  let currentCat = getParam('category') || getParam('cat') || 'all';

  function render() {
    const entries = InklogData.getByCategory(currentCat);
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    if (entries.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <i class="fa-regular fa-image"></i>
        <h3>커버 이미지가 없어요</h3>
        <p>감상문을 추가하면 갤러리가 채워집니다.</p>
        <a href="write.html" class="btn-primary" style="margin-top:1rem;display:inline-flex;">감상문 쓰기</a>
      </div>`;
      return;
    }

    grid.innerHTML = entries.map(e => {
      const src = coverSrc(e);
      const fallback = DEFAULT_COVERS[e.category] || DEFAULT_COVERS.etc;
      const stars = '★'.repeat(e.rating) + '☆'.repeat(5 - e.rating);
      return `<a href="detail.html?id=${esc(e.id)}" class="gallery-item">
        <img src="${esc(src)}" alt="${esc(e.title)}" loading="lazy"
             onerror="this.src='${esc(fallback)}'">
        <div class="gallery-overlay">
          <span class="go-title">${esc(e.title)}</span>
          <span class="go-rating">${stars}</span>
        </div>
      </a>`;
    }).join('');
  }

  document.querySelectorAll('.filter-tab').forEach(tab => {
    if (tab.dataset.cat === currentCat) tab.classList.add('active');
    tab.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentCat = this.dataset.cat;
      render();
    });
  });

  render();
}

// ── TAG PAGE ──────────────────────────────────────────
function initTag() {
  InklogData.initData();
  let selectedTag = getParam('tag') || null;

  function renderCloud() {
    const tags = InklogData.getAllTags();
    const cloudEl = document.getElementById('full-tag-cloud');
    if (!cloudEl) return;

    if (tags.length === 0) {
      cloudEl.innerHTML = '<p style="color:#bbb;">아직 태그가 없습니다.</p>';
      return;
    }

    const maxCnt = tags[0].count;
    const minCnt = tags[tags.length - 1].count;
    const minSize = 14, maxSize = 32;

    cloudEl.innerHTML = tags.map(({ tag, count }) => {
      const size = minSize + ((count - minCnt) / (maxCnt - minCnt || 1)) * (maxSize - minSize);
      const opacity = 0.5 + ((count - minCnt) / (maxCnt - minCnt || 1)) * 0.5;
      const isSelected = tag === selectedTag;
      return `<a href="#" class="tag-cloud-item${isSelected ? ' selected' : ''}" data-tag="${esc(tag)}"
                 style="font-size:${size.toFixed(1)}px; opacity:${opacity.toFixed(2)}">#${esc(tag)}
               </a>`;
    }).join('');

    cloudEl.querySelectorAll('.tag-cloud-item').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        selectedTag = this.dataset.tag;
        history.replaceState(null, '', '?tag=' + encodeURIComponent(selectedTag));
        renderCloud();
        renderResults();
      });
    });
  }

  function renderResults() {
    const resultsEl = document.getElementById('tag-results');
    const titleEl = document.getElementById('tag-results-title');
    if (!resultsEl) return;

    if (!selectedTag) {
      resultsEl.innerHTML = `<div class="tag-placeholder">
        <i class="fa-solid fa-tags"></i>
        태그를 클릭하면 관련 감상문이 표시됩니다.
      </div>`;
      if (titleEl) { titleEl.innerHTML = ''; titleEl.style.display = 'none'; }
      return;
    }

    const entries = InklogData.getByTag(selectedTag)
      .sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));

    // Count by category
    const catCounts = { movie: 0, book: 0, webtoon: 0, etc: 0 };
    entries.forEach(e => { if (catCounts[e.category] !== undefined) catCounts[e.category]++; });
    const summary = [
      catCounts.movie   ? `영화 ${catCounts.movie}편`   : '',
      catCounts.book    ? `책 ${catCounts.book}권`      : '',
      catCounts.webtoon ? `웹툰 ${catCounts.webtoon}편` : '',
      catCounts.etc     ? `기타 ${catCounts.etc}개`     : ''
    ].filter(Boolean).join(' · ');

    if (titleEl) {
      titleEl.style.display = '';
      titleEl.innerHTML = `<span style="color:var(--ink-accent);font-size:1rem;">#${esc(selectedTag)}</span> — 총 ${entries.length}개
        ${summary ? `<div class="tag-stat-summary">${esc(summary)}</div>` : ''}`;
    }

    if (entries.length === 0) {
      resultsEl.innerHTML = `<div class="empty-state">
        <i class="fa-regular fa-face-frown"></i>
        <h3>결과 없음</h3>
        <p>#${esc(selectedTag)} 태그의 감상문이 없습니다.</p>
      </div>`;
    } else {
      resultsEl.innerHTML = `<div class="cards-grid">${entries.map(buildCard).join('')}</div>`;
    }
  }

  function renderTop5() {
    const top5 = InklogData.getAllTags().slice(0, 5);
    const el = document.getElementById('top5-list');
    if (!el) return;

    if (top5.length === 0) {
      el.innerHTML = '<p style="color:#bbb;font-size:.82rem;">태그가 없습니다.</p>';
      return;
    }

    el.innerHTML = top5.map(({ tag, count }, i) => `
      <div class="tag-ranking-item">
        <span class="tag-ranking-num">${i + 1}</span>
        <span class="tag-ranking-name" data-tag="${esc(tag)}">#${esc(tag)}</span>
        <span class="tag-ranking-count">${count}</span>
      </div>`).join('');

    el.querySelectorAll('[data-tag]').forEach(el => {
      el.addEventListener('click', function () {
        selectedTag = this.dataset.tag;
        history.replaceState(null, '', '?tag=' + encodeURIComponent(selectedTag));
        renderCloud();
        renderResults();
      });
    });
  }

  renderCloud();
  renderResults();
  renderTop5();
}

// ── ABOUT PAGE (데이터 관리) ──────────────────────────
function initAbout() {
  InklogData.initData();

  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      InklogData.exportJson();
      showToast('백업 파일이 다운로드되었습니다.');
    });
  }

  const importBtn = document.getElementById('btn-import');
  const importFile = document.getElementById('import-file');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      InklogData.importJson(file, function (err, count) {
        if (err) {
          showToast('가져오기 실패: ' + err.message);
        } else {
          showToast(count + '개의 감상문을 가져왔습니다!');
        }
      });
      this.value = '';
    });
  }
}

// ── Router ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  setActiveNav();
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '')  initIndex();
  else if (page === 'list.html')             initList();
  else if (page === 'write.html')            initWrite();
  else if (page === 'edit.html')             initWrite();
  else if (page === 'detail.html')           initDetail();
  else if (page === 'gallery.html')          initGallery();
  else if (page === 'tag.html')              initTag();
  else if (page === 'about.html')            initAbout();
});
