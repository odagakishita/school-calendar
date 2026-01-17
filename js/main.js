// --- 1. DOM要素の取得 ---
const calendarGrid = document.getElementById('calendarGrid');
const monthYearLabel = document.getElementById('monthYearLabel');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

// 投稿用モーダル
const postModal = document.getElementById('postModal');
const modalDateLabel = document.getElementById('modalDateLabel');
const inputTitle = document.getElementById('inputTitle');
const inputDetail = document.getElementById('inputDetail');
const savePostBtn = document.getElementById('savePostBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// 閲覧用モーダル
const viewModal = document.getElementById('viewModal');
const viewDate = document.getElementById('viewDate');
const viewTitle = document.getElementById('viewTitle');
const viewDetail = document.getElementById('viewDetail');
const closeViewBtn = document.getElementById('closeViewBtn');
const deleteBtn = document.getElementById('deleteBtn');

// --- 2. 状態管理変数 ---
let currentDate = new Date(); // 現在表示している月
let posts = []; // 投稿データ
let selectedDateStr = ''; // 投稿しようとしている日付
let selectedPostId = null; // 詳細表示している投稿ID

// --- 3. 初期化処理 ---
window.addEventListener('DOMContentLoaded', () => {
    // データの読み込み
    const savedData = localStorage.getItem('school_calendar_data');
    if (savedData) {
        posts = JSON.parse(savedData);
    }
    renderCalendar();
});

// --- 4. カレンダー描画ロジック ---
function renderCalendar() {
    // グリッドをクリア
    calendarGrid.innerHTML = '';

    // 年と月を取得
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0:1月, 1:2月...

    // ヘッダーの表示更新 (例: January 2026)
    // 英語表記にするためのオプション
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    monthYearLabel.textContent = `${monthName} ${year}`;

    // 月の最初の日が何曜日か (0:日曜, 1:月曜...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // 月の最後の日付 (28~31)
    const lastDayDate = new Date(year, month + 1, 0).getDate();

    // ▼ 空白セル（前月分）を作る
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    // ▼ 日付セルを作る
    for (let day = 1; day <= lastDayDate; day++) {
        // 日付文字列を作成 (YYYY-MM-DD形式)
        // ※月と日は2桁埋めする (例: 2026-01-05)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // 今日の日付かどうか
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = dateStr === todayStr;

        // セル要素作成
        const cell = document.createElement('div');
        cell.className = `calendar-cell bg-white border border-gray-100 p-1 rounded hover:bg-gray-50 transition cursor-pointer flex flex-col gap-1 ${isToday ? 'border-sky-300 ring-1 ring-sky-300' : ''}`;
        
        // 日付数字
        cell.innerHTML = `<span class="text-xs font-bold text-gray-500 ml-1">${day}</span>`;

        // 空白部分をクリックしたら投稿モーダルを開く
        cell.addEventListener('click', (e) => {
            // もしクリックした要素が「投稿ボタン」自体なら反応させない（バブリング防止）
            if(e.target.closest('.post-chip')) return;
            openPostModal(dateStr);
        });

        // この日の投稿を探して表示
        const dayPosts = posts.filter(p => p.date === dateStr);
        dayPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-chip bg-sky-100 text-sky-700 px-1 rounded border-l-2 border-sky-500 shadow-sm';
            postDiv.textContent = post.title;
            
            // 投稿をクリックしたら詳細モーダルを開く
            postDiv.addEventListener('click', (e) => {
                e.stopPropagation(); // 親セルのクリックイベントを止める
                openViewModal(post);
            });

            cell.appendChild(postDiv);
        });

        calendarGrid.appendChild(cell);
    }
}

// --- 5. イベントリスナー (ボタン操作) ---

// 前月へ
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// 次月へ
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// --- 6. 投稿機能 (モーダル) ---
function openPostModal(dateStr) {
    selectedDateStr = dateStr;
    modalDateLabel.textContent = `日付: ${dateStr}`;
    inputTitle.value = '';
    inputDetail.value = '';
    postModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    postModal.classList.add('hidden');
});

savePostBtn.addEventListener('click', () => {
    const title = inputTitle.value;
    const detail = inputDetail.value;
    
    if(!title) {
        alert('タイトルを入力してください');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        detail: detail,
        date: selectedDateStr
    };

    posts.push(newPost);
    saveToLocalStorage();
    renderCalendar();
    postModal.classList.add('hidden');
});

// --- 7. 詳細閲覧・削除機能 ---
function openViewModal(post) {
    selectedPostId = post.id;
    viewDate.textContent = post.date;
    viewTitle.textContent = post.title;
    viewDetail.textContent = post.detail;
    viewModal.classList.remove('hidden');
}

closeViewBtn.addEventListener('click', () => {
    viewModal.classList.add('hidden');
});

deleteBtn.addEventListener('click', () => {
    if(confirm('この予定を削除しますか？')) {
        posts = posts.filter(p => p.id !== selectedPostId);
        saveToLocalStorage();
        renderCalendar();
        viewModal.classList.add('hidden');
    }
});

// --- 8. データ保存 ---
function saveToLocalStorage() {
    localStorage.setItem('school_calendar_data', JSON.stringify(posts));
}