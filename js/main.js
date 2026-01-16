// --- 1. 要素の取得 ---
const inputTitle = document.getElementById('inputTitle');
const inputDate = document.getElementById('inputDate');
const inputDetail = document.getElementById('inputDetail');
const addBtn = document.getElementById('addBtn');
const postsContainer = document.getElementById('postsContainer');
const emptyMsg = document.getElementById('emptyMsg');

// データの入れ物
let posts = [];

// --- 2. ページ読み込み時の処理 ---
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('school_calendar_data');
    if (savedData) {
        posts = JSON.parse(savedData);
    }
    renderPosts();
});

// --- 3. 追加ボタンの処理 ---
addBtn.addEventListener('click', () => {
    const title = inputTitle.value;
    const date = inputDate.value;
    const detail = inputDetail.value;

    if (title === '' || date === '') {
        alert('タイトルと日付は必須です！');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        date: date,
        detail: detail
    };

    posts.push(newPost);
    
    // 日付順にソート
    posts.sort((a, b) => new Date(a.date) - new Date(b.date));

    saveToLocalStorage();
    renderPosts();
    clearInputs();
});

// --- 4. 描画関数 ---
function renderPosts() {
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    } else {
        emptyMsg.style.display = 'none';
    }

    posts.forEach((post) => {
        const dateObj = new Date(post.date);
        const dateStr = dateObj.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' });

        const cardHTML = `
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 relative animate-fade-in">
                <div class="flex justify-between items-start mb-2">
                    <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                        ${dateStr}
                    </span>
                    <button onclick="deletePost(${post.id})" class="text-gray-400 hover:text-red-500 text-sm">
                        削除
                    </button>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-1">${post.title}</h3>
                <p class="text-sm text-gray-600 whitespace-pre-wrap">${post.detail}</p>
            </div>
        `;
        postsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// --- 5. 保存関数 ---
function saveToLocalStorage() {
    localStorage.setItem('school_calendar_data', JSON.stringify(posts));
}

// --- 6. 削除機能 ---
window.deletePost = function(id) {
    if(confirm('本当に削除しますか？')) {
        posts = posts.filter(post => post.id !== id);
        saveToLocalStorage();
        renderPosts();
    }
}

// --- 7. クリア関数 ---
function clearInputs() {
    inputTitle.value = '';
    inputDate.value = '';
    inputDetail.value = '';
}