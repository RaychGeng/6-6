// 修复游戏图片容器的高度
document.addEventListener('DOMContentLoaded', function() {
    // 添加样式覆盖
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .game-image {
            height: 240px !important;
        }
        
        .game-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    `;
    document.head.appendChild(styleElement);
    
    // 如果页面已经加载完毕，监听DOM变化，确保新添加的游戏卡片也能应用样式
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const gameImages = document.querySelectorAll('.game-image');
                if (gameImages.length) {
                    gameImages.forEach(image => {
                        image.style.height = '240px';
                    });
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 处理点击"益智游戏"菜单项后的样式应用
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === '益智游戏') {
            item.addEventListener('click', function() {
                // 等待游戏卡片加载完成后应用样式
                setTimeout(function() {
                    const gameImages = document.querySelectorAll('.game-image');
                    gameImages.forEach(image => {
                        image.style.height = '240px';
                    });
                }, 500);
            });
        }
    });
}); 