document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const saveBtn = document.getElementById('save-btn');
    const postsContainer = document.getElementById('posts-container');

    // 1. LocalStorage에서 기존 글 불러오기 (없으면 빈 배열)
    let posts = JSON.parse(localStorage.getItem('vibe_posts')) || [];

    // 2. 화면에 글 목록을 렌더링하는 함수
    function displayPosts() {
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align:center; color:#666;">아직 작성된 글이 없습니다. 첫 마디를 남겨보세요!</p>';
            return;
        }

        // 최신글이 위로 오도록 역순 배치
        posts.slice().reverse().forEach((post) => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            
            postCard.innerHTML = `
                <h3>${escapeHtml(post.title || '제목 없음')}</h3>
                <p>${escapeHtml(post.content)}</p>
                <div class="post-date">${post.date}</div>
                <button class="delete-btn" data-id="${post.id}">삭제</button>
            `;
            
            postsContainer.appendChild(postCard);
        });

        // 삭제 버튼 이벤트 바인딩
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                deletePost(id);
            });
        });
    }

    // 3. 새 글 저장 기능
    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!content) {
            alert('내용은 필수로 입력하셔야 바이브가 살죠! 😎');
            return;
        }

        const newPost = {
            id: Date.now(), // 고유 ID로 타임스탬프 사용
            title: title,
            content: content,
            date: new Date().toLocaleString('ko-KR')
        };

        posts.push(newPost);
        localStorage.setItem('vibe_posts', JSON.stringify(posts)); // LocalStorage에 저장

        // 입력창 비우기 및 새로고침
        titleInput.value = '';
        contentInput.value = '';
        displayPosts();
    });

    // 4. 글 삭제 기능
    function deletePost(id) {
        if (confirm('이 기록을 지우시겠습니까?')) {
            posts = posts.filter(post => post.id !== id);
            localStorage.setItem('vibe_posts', JSON.stringify(posts));
            displayPosts();
        }
    }

    // 보안을 위한 XSS 방지 단순 치환 함수
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 앱 시작 시 최초 실행
    displayPosts();
});
