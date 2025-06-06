// 游戏模块JavaScript
// 全局变量
let matchCount = 0; // 用于跟踪麻将游戏的匹配数量
let moveCount = 0; // 用于跟踪华容道的移动次数
let puzzleSize = 4; // 默认4x4华容道
let puzzleHistory = []; // 记录移动历史
let timerInterval = null; // 计时器
let gameSeconds = 0; // 游戏时间
let gameStarted = false; // 游戏是否已开始

// 页面加载完成后调用
document.addEventListener('DOMContentLoaded', function() {
    // 找到"益智游戏"菜单项
    const gameMenuItems = document.querySelectorAll('.nav-item');
    gameMenuItems.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === '益智游戏') {
            // 为"益智游戏"菜单项添加特殊的点击事件处理
            item.addEventListener('click', function(e) {
                // 不再跳转到games.html，而是在主内容区域显示游戏内容
                showGamesInMainContent(document.getElementById('games-content-placeholder'));
                
                // 移除所有菜单项的active类
                gameMenuItems.forEach(nav => nav.classList.remove('active'));
                
                // 给当前点击的菜单项添加active类
                this.classList.add('active');
            });
        }
    });
});

// 在主内容区域显示游戏
function showGamesInMainContent(container) {
    // container 必须是 #games-content-placeholder
    if (!container) return;
    container.innerHTML = '';
    // 创建游戏容器
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games-container';
    // 游戏数据
    const games = [
        {
            id: 'number-puzzle',
            title: '数字华容道',
            description: '通过滑动数字方块将它们排列成正确顺序，培养逻辑思维和空间想象能力',
            image: './images/数字华容道.png',
            badge: 'hot'
        },
        {
            id: 'poem-game',
            title: '飞花令',
            description: '在这个游戏中，你需要回答含有指定字的古诗词，考验你的古诗文学知识。',
            image: './images/生成游戏封面.png',
            badge: 'new'
        },
        {
            id: 'english-mahjong',
            title: '英语版麻将',
            description: '将传统麻将与英语学习结合，使用英文字母牌拼词胡牌，提升英语词汇量和记忆力！',
            image: './images/english-mahjong.png',
            badge: 'reward'
        }
    ];
    // 为每个游戏创建卡片
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${game.image}" alt="${game.title}">
                ${game.badge ? `<div class="game-badge ${game.badge}">${game.badge === 'hot' ? '热门' : game.badge === 'new' ? '新游戏' : '有奖励'}</div>` : ''}
            </div>
            <div class="game-content">
                <div class="game-title">${game.title}</div>
                <div class="game-desc">${game.description}</div>
                <div class="game-meta">
                    <span><i class="fas fa-users"></i> 5000+ 玩家</span>
                    <span><i class="fas fa-star"></i> 4.8</span>
                </div>
                <button class="game-btn" data-game-id="${game.id}">开始游戏</button>
            </div>
        `;
        gamesContainer.appendChild(gameCard);
    });
    container.appendChild(gamesContainer);
    // 给所有游戏按钮添加事件监听器
    const gameButtons = container.querySelectorAll('.game-btn');
    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            showSpecificGameContent(gameId, container);
        });
    });
    // 在window对象上定义showGameContent方法，使其可以在游戏按钮的onclick中调用
    window.showGameContent = function(gameId) {
        showSpecificGameContent(gameId, container);
    };
}

// 确保在全局范围也有这个函数，以便HTML内联调用
if (typeof window !== 'undefined') {
    window.showGamesInMainContent = showGamesInMainContent;
    window.showGameContent = function(gameId) {
        showSpecificGameContent(gameId, document.getElementById('games-content-placeholder'));
    };
}

// 显示特定游戏的内容
function showSpecificGameContent(gameId, container) {
    // container 必须是 games-content-placeholder
    if (!container) return;
    container.innerHTML = '';
    // 游戏内容数据
    const gameContent = {
        'poem-game': {
            title: '古诗飞花令',
            description: '在这个游戏中，你需要回答含有指定字的古诗词，考验你的古诗文学知识。',
            content: `
                <div class="game-play-area">
                    <div class="poetry-challenge">
                        <h3>当前飞花令：含"<span class="highlight-char poetry-target">花</span>"字的诗句</h3>
                        <div class="poetry-question">请说出一句含有"<span class="poetry-target">花</span>"字的诗句：</div>
                        <div class="poetry-input-area">
                            <input type="text" class="poetry-answer" placeholder="请输入诗句...">
                            <button class="submit-answer">提交</button>
                        </div>
                        <div class="poetry-hint">
                            想不出来？<button class="hint-btn">获取提示</button>
                        </div>
                        <div class="poetry-examples">
                            <h4>示例诗句：</h4>
                            <p>- 花间一壶酒，独酌无相亲。</p>
                            <p>- 停车坐爱枫林晚，霜叶红于二月花。</p>
                        </div>
                        <div class="poetry-history">
                            <h4>已回答诗句：</h4>
                            <div class="history-list"></div>
                        </div>
                        <div class="game-progress">
                            回合 <span class="current-round">1</span>/5 | 得分: <span class="poetry-score">0</span>
                        </div>
                        <div class="poetry-win">
                            <h3>恭喜完成！</h3>
                            <p>你在飞花令中获得了 <span class="final-score">0</span> 分</p>
                            <button class="new-poetry-game">再来一局</button>
                        </div>
                    </div>
                    
                    <div class="game-intro">
                        <h4>游戏规则简介：</h4>
                        <ul>
                            <li>飞花令是一种中国传统文化游戏，源于明朝，流行于文人雅士间</li>
                            <li>玩家需要说出含有指定字的诗句，不能重复，限时作答</li>
                            <li>游戏共5回合，每回合系统会给出一个汉字</li>
                            <li>每答对一题得10分，连续答对有额外分数奖励</li>
                            <li>答题时间越短，获得的分数越高</li>
                            <li>可以使用提示功能，但使用后得分会减半</li>
                            <li>注意：诗句必须是真实存在的古诗词，不能是现代诗或自创诗</li>
                        </ul>
                        <p><strong>趣味知识:</strong> 飞花令名字的由来是源于"飞花令"最早指定的字是"花"字。因为"花"字常见且意境优美，所以这个游戏也被称为"飞花令"。</p>
                    </div>
                </div>
            `
        },
        'number-puzzle': {
            title: '数字华容道',
            description: '通过滑动数字方块，将数字排列成正确的顺序，锻炼你的思维能力！4x4经典模式。',
            content: `
                <div class="game-play-area">
                    <div class="number-puzzle-board">
                        <div class="puzzle-header">
                            <div class="puzzle-stats">
                                <div class="moves">移动次数: <span id="move-count">0</span></div>
                                <div class="timer">用时: <span id="time-counter">00:00</span></div>
                        </div>
                        <div class="puzzle-controls">
                                <button id="undo-button" title="撤销上一步"><i class="fas fa-undo"></i></button>
                                <button id="reset-button" title="重置"><i class="fas fa-sync-alt"></i></button>
                                <button id="shuffle-button" title="打乱"><i class="fas fa-random"></i></button>
                        </div>
                        </div>
                        <div class="puzzle-grid" id="puzzle-grid"></div>
                        <div class="puzzle-message" id="puzzle-message"></div>
                    </div>
                    
                    <div class="game-intro">
                                <h4>游戏规则简介：</h4>
                                <ul>
                            <li>华容道是古老的中国益智游戏，数字华容道是其变种</li>
                            <li>通过滑动与空白格子相邻的数字方块，将数字排列成正确顺序</li>
                            <li>只有与空白格子相邻的方块才能移动</li>
                            <li>正确顺序是从左到右、从上到下的递增顺序，空格在最右下角</li>
                            <li>完成排列后，游戏胜利！</li>
                                        </ul>
                        <p><strong>趣味知识:</strong> 数字华容道的可解性取决于数字序列的逆序数，数学上可以证明，不是所有的起始状态都有解。本游戏保证生成的起始状态都是可解的。</p>
                    </div>
                </div>
            `
        },
        'english-mahjong': {
            title: '英语版麻将',
            description: '将传统麻将与英语学习结合，使用英文字母牌拼词胡牌，提升英语词汇量和记忆力！',
            content: `
                <div class="game-play-area">
                    <div class="english-mahjong-game">
                        <div class="game-info-panel">
                            <h3>英语麻将</h3>
                            <div class="game-rules-toggle">规则说明</div>
                            <div class="game-rules-panel">
                                <h4>游戏规则简介：</h4>
                                <ul>
                                    <li>牌组：104张字母牌(A-Z各4张)，万能牌为G</li>
                                    <li>目标：组合有效英文单词，并保留一对相同字母("眼")</li>
                                    <li>胡牌条件：至少2个有效单词 + 1对"眼"，或14张牌组成一个完整单词</li>
                                    <li>计分规则：基础胡牌(+20分)、单词长度加分、句子组合(+50)</li>
                                </ul>
                                <button class="close-rules">关闭</button>
                            </div>
                        </div>
                        
                        <!-- 圆形麻将牌桌 -->
                        <div class="mahjong-table">
                            <!-- 中央装饰和弃牌区 -->
                            <div class="game-center">
                                <!-- 游戏状态信息 -->
                                <div class="game-status">
                                    <div class="round-info">第 <span class="round-number">1</span>/3 局</div>
                                    <div class="timer-circle">
                                        <span class="timer-number">30</span>
                                    </div>
                                    <div class="pool-count">牌池: <span id="pool-remaining">104</span></div>
                                </div>
                                
                                <!-- 中央mahjong标志 -->
                                <div class="table-center-decoration">
                                    <div class="chinese-character">mahjong</div>
                                </div>
                                
                                <!-- 弃牌区 -->
                                <div class="discard-area">
                                    <div class="discard-tiles"></div>
                                </div>
                            </div>
                            
                            <!-- 玩家区域 -->
                            <div class="player-area">
                                <div class="player-tiles"></div>
                                <div class="player-actions">
                                    <button class="action-draw">摸牌</button>
                                    <button class="action-discard">出牌</button>
                                    <button class="action-claim">吃牌</button>
                                    <button class="action-triple">碰牌</button>
                                    <button class="action-win">胡牌</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="word-forming-area">
                            <h4>单词组合区</h4>
                            <div class="formed-words"></div>
                            <div class="dictionary-tools">
                                <button class="toggle-dictionary">查单词</button>
                                <div class="dictionary-panel">
                                    <input type="text" class="word-check" placeholder="输入单词检查...">
                                    <button class="check-word">查询</button>
                                    <div class="word-result"></div>
                                </div>
                            </div>
                        </div>
                        
                        <button class="new-mahjong-game">新游戏</button>
                    </div>
                </div>
            `
        }
    };
    
    // 获取特定游戏的数据
    const game = gameContent[gameId];
    if (!game) {
        container.innerHTML = '<div class="error-message">游戏不存在</div>';
        return;
    }
    
    // 创建游戏内容
    const gameContentElement = document.createElement('div');
    gameContentElement.className = 'game-detail';
    gameContentElement.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">${game.title}</h1>
            <div class="dashboard-actions">
                <button class="dashboard-btn" id="back-to-games-list">
                    <i class="fas fa-arrow-left"></i>
                    返回游戏列表
                </button>
                <button class="dashboard-btn primary" id="start-game-button">
                    <i class="fas fa-play"></i>
                    重新开始
                </button>
            </div>
        </div>
        <div class="game-description">
            <p>${game.description}</p>
        </div>
        <div class="game-content-area">
            ${game.content}
        </div>
    `;
    
    container.appendChild(gameContentElement);
    
    // 添加游戏样式
    addGameStyles();
    
    // 添加CSS变量，确保游戏能访问系统主题变量
    addThemeVariables();
    
    // 绑定重新开始按钮事件
    const startButton = document.getElementById('start-game-button');
    if (startButton) {
        if (gameId === 'number-puzzle') {
            startButton.addEventListener('click', () => {
                // 重新打乱拼图
                const shuffleButton = document.getElementById('shuffle-button');
                if (shuffleButton) {
                    shuffleButton.click();
                }
            });
        } else if (gameId === 'poem-game') {
            startButton.addEventListener('click', () => {
                // 重新开始诗词游戏
                initPoetryGame();
            });
        } else if (gameId === 'english-mahjong') {
            startButton.addEventListener('click', () => {
                // 重新开始英语麻将游戏
                initEnglishMahjong();
            });
        }
    }
    
    // 初始化对应的游戏
    if (gameId === 'number-puzzle') {
        initNumberPuzzle();
    } else if (gameId === 'poem-game') {
        initPoetryGame();
    } else if (gameId === 'english-mahjong') {
        initEnglishMahjong();
    }
    
    // 返回游戏列表按钮
    const backBtn = document.getElementById('back-to-games-list');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            showGamesInMainContent(container);
        });
    }
}

// 添加系统主题变量
function addThemeVariables() {
    // 检查是否已添加主题变量
    if (document.getElementById('theme-variables')) return;
    
    // 创建一个脚本以获取系统变量
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-variables';
    styleElement.textContent = `
        /* 游戏模块使用系统变量 */
        :root {
            --game-primary-color: var(--primary-color, #FF6B35);
            --game-accent-color: var(--accent-color, #FFC107);
            --game-anime-accent: var(--anime-accent, #FD5E53);
            --game-anime-accent-2: var(--anime-accent-2, #FFBD69);
            --game-anime-gradient: linear-gradient(135deg, var(--primary-color, #FF6B35) 0%, var(--accent-color, #FFC107) 100%);
            --game-anime-gradient-alt: linear-gradient(135deg, var(--anime-accent, #FD5E53) 0%, var(--anime-accent-2, #FFBD69) 100%);
        }
    `;
    
    document.head.appendChild(styleElement);
}

// 添加游戏所需的样式
function addGameStyles() {
    // 检查是否已添加样式
    if (document.getElementById('games-module-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'games-module-styles';
    styleElement.textContent = `
        /* 通用游戏样式 */
        .game-play-area {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            position: relative;
        }
        
        /* 按钮样式 */
        .dashboard-btn {
            padding: 8px 15px;
            border-radius: 8px;
            background: white;
            color: var(--game-primary-color, #FF6B35);
            border: 1px solid rgba(255, 107, 53, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .dashboard-btn:hover {
            box-shadow: 0 3px 8px rgba(255, 107, 53, 0.2);
            transform: translateY(-2px);
            border-color: var(--game-primary-color, #FF6B35);
        }
        
        .dashboard-btn.primary {
            background: var(--game-anime-gradient, linear-gradient(135deg, #FF6B35 0%, #FFC107 100%));
            color: white;
            border: none;
        }
        
        .dashboard-btn.primary:hover {
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }
        
        .game-info {
            margin-bottom: 20px;
        }
        
        .game-intro {
            margin-top: 30px;
            background: rgba(var(--game-primary-color, #FF6B35), 0.05);
            border-radius: 10px;
            padding: 20px;
        }
        
        .game-intro h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #444;
        }
        
        .game-intro ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        
        .game-intro li {
            margin-bottom: 8px;
            color: #555;
        }
        
        /* 数字华容道样式 */
        .number-puzzle-board {
            max-width: 600px;
            margin: 0 auto 30px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(var(--game-primary-color, #FF6B35), 0.05) 0%, rgba(var(--game-accent-color, #FFC107), 0.05) 100%);
            border-radius: 12px;
            position: relative;
            border: 1px solid rgba(var(--game-primary-color, #FF6B35), 0.1);
        }
        
        .puzzle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .puzzle-stats {
            display: flex;
            gap: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #444;
        }
        
        .puzzle-controls {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 15px;
        }
        
        .puzzle-controls button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background-color: white;
            color: #555;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .puzzle-controls button:hover {
            background-color: var(--game-primary-color, #FF6B35);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(var(--game-primary-color, #FF6B35), 0.3);
        }
        
        #undo-button {
            color: #FF9800;
        }
        
        #undo-button:hover {
            background-color: #FF9800;
            color: white;
        }
        
        #reset-button {
            color: #F44336;
        }
        
        #reset-button:hover {
            background-color: #F44336;
            color: white;
        }
        
        #shuffle-button {
            color: var(--game-primary-color, #FF6B35);
        }
        
        #shuffle-button:hover {
            background-color: var(--game-primary-color, #FF6B35);
            color: white;
        }
        
        .puzzle-grid {
            display: grid;
            grid-gap: 10px;
            margin: 0 auto;
            width: 100%;
            max-width: 400px;
            aspect-ratio: 1/1;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
        }
        
        .puzzle-tile {
            background: white;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 600;
            color: #444;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            position: relative;
            border: 2px solid transparent;
        }
        
        .puzzle-tile:hover:not(.empty) {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(var(--game-primary-color, #FF6B35), 0.2);
            border-color: var(--game-primary-color, #FF6B35);
            z-index: 10;
        }
        
        .puzzle-tile.empty {
            background: rgba(230, 230, 230, 0.3);
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
        
        .puzzle-message {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            background-color: rgba(76, 175, 80, 0.1);
            color: #388E3C;
            font-weight: 600;
            display: none;
            border-left: 4px solid #4CAF50;
        }
        
        /* 胜利动画 */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes victoryPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--game-primary-color, #FF6B35), 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(var(--game-primary-color, #FF6B35), 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--game-primary-color, #FF6B35), 0); }
        }
        
        /* 标题和介绍的样式 */
        .game-description {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 4px solid var(--game-primary-color, #FF6B35);
        }
        
        .dashboard-title {
            color: var(--game-primary-color, #FF6B35);
            margin-bottom: 5px;
            position: relative;
            display: inline-block;
        }
        
        .dashboard-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 40px;
            height: 3px;
            background: var(--game-anime-gradient, linear-gradient(135deg, #FF6B35 0%, #FFC107 100%));
            border-radius: 2px;
        }
        
        @media (max-width: 768px) {
            .puzzle-header {
                flex-direction: column;
                gap: 15px;
            }
            
            .puzzle-grid {
                max-width: 300px;
            }
            
            .puzzle-tile {
                font-size: 20px;
            }
        }
        
        /* 诗词游戏样式 */
        .poetry-challenge {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%);
            border-radius: 12px;
            position: relative;
        }
        
        .poetry-challenge h3 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
            color: #444;
        }
        
        .highlight-char {
            color: #FF6B35;
            font-weight: bold;
            font-size: 28px;
            text-shadow: 0 0 2px rgba(255, 107, 53, 0.3);
        }
        
        .poetry-question {
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
            color: #555;
        }
        
        .poetry-input-area {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .poetry-answer {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid rgba(255, 107, 53, 0.3);
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        
        .poetry-answer:focus {
            border-color: #FF6B35;
            outline: none;
            box-shadow: 0 0 5px rgba(255, 107, 53, 0.3);
        }
        
        .submit-answer {
            padding: 12px 25px;
            background: linear-gradient(135deg, #FF6B35 0%, #FFC107 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-answer:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }
        
        .poetry-examples {
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .poetry-examples h4 {
            margin-bottom: 10px;
            font-weight: 600;
            color: #444;
        }
        
        .poetry-examples p {
            margin: 5px 0;
            color: #555;
            font-style: italic;
        }
        
        .game-progress {
            text-align: center;
            font-size: 16px;
            font-weight: 500;
            color: #666;
            padding: 10px;
            border-top: 1px dashed rgba(0, 0, 0, 0.1);
        }
        
        /* 答题历史 */
        .poetry-history {
            margin-top: 20px;
        }
        
        .poetry-history h4 {
            margin-bottom: 10px;
            font-weight: 600;
            color: #444;
        }
        
        .history-list {
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background: white;
        }
        
        .history-item {
            padding: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .history-item:last-child {
            border-bottom: none;
        }
        
        .history-item .char {
            color: #FF6B35;
            font-weight: bold;
        }
        
        .history-round {
            color: #999;
            font-size: 0.9em;
            margin-right: 10px;
        }
        
        /* 结果弹窗 */
        .poetry-win {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            z-index: 100;
            width: 80%;
            max-width: 400px;
        }
        
        .poetry-win h3 {
            color: #FF6B35;
            margin-bottom: 15px;
        }
        
        .poetry-win p {
            margin-bottom: 20px;
            color: #555;
        }
        
        .poetry-win button {
            padding: 10px 25px;
            background: linear-gradient(135deg, #FF6B35 0%, #FFC107 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .poetry-win button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }
        
        .poetry-hint {
            text-align: center;
            margin-bottom: 20px;
            font-size: 14px;
            color: #777;
        }
        
        .hint-btn {
            background: none;
            border: none;
            color: #FF6B35;
            text-decoration: underline;
            cursor: pointer;
            font-size: inherit;
            font-family: inherit;
        }
        
        @media (max-width: 768px) {
            .poetry-input-area {
                flex-direction: column;
            }
            .submit-answer {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// 初始化古诗飞花令游戏
function initPoetryGame() {
    // 可用的汉字字根列表
    const chars = ["春", "月", "花", "山", "水", "风", "夜", "人", "心", "云", "酒", "雨", "江", "归", "愁"];
    
    // 已使用过的字根记录
    const usedChars = [];
    
    // 初始化游戏状态
    let gameState = {
        currentChar: "",  // 当前字根，稍后设置
        round: 1,
        score: 0,
        history: []
    };
    
    // 获取元素
    const submitBtn = document.querySelector('.submit-answer');
    const answerInput = document.querySelector('.poetry-answer');
    const hintBtn = document.querySelector('.hint-btn');
    const historyList = document.querySelector('.history-list');
    const roundDisplay = document.querySelector('.current-round');
    const scoreDisplay = document.querySelector('.poetry-score');
    const winPanel = document.querySelector('.poetry-win');
    const finalScore = document.querySelector('.final-score');
    const newGameBtn = document.querySelector('.new-poetry-game');
    
    // 先移除所有旧的事件监听器，避免重复绑定
    if (submitBtn) {
        // 使用克隆节点替换原节点的方式移除所有事件监听器
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    }
    
    if (hintBtn) {
        const newHintBtn = hintBtn.cloneNode(true);
        hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
    }
    
    if (newGameBtn) {
        const newGameBtnClone = newGameBtn.cloneNode(true);
        newGameBtn.parentNode.replaceChild(newGameBtnClone, newGameBtn);
    }
    
    // 重新获取元素，因为上面已经替换了原来的元素
    const newSubmitBtn = document.querySelector('.submit-answer');
    const newHintBtn = document.querySelector('.hint-btn');
    const newGameBtnClone = document.querySelector('.new-poetry-game');
    
    // 诗句示例 - 根据不同字根提供不同的示例
    const examples = {
        "春": ["春眠不觉晓，处处闻啼鸟。", "春风又绿江南岸，明月何时照我还。"],
        "月": ["明月几时有，把酒问青天。", "床前明月光，疑是地上霜。"],
        "花": ["花间一壶酒，独酌无相亲。", "停车坐爱枫林晚，霜叶红于二月花。"],
        "山": ["会当凌绝顶，一览众山小。", "白日依山尽，黄河入海流。"],
        "水": ["君问归期未有期，巴山夜雨涨秋池。何当共剪西窗烛，却话巴山夜雨时。", "湖光秋月两相和，潭面无风镜未磨。"],
        "风": ["解落三秋叶，能开二月花。过江千尺浪，入竹万竿斜。", "好雨知时节，当春乃发生。随风潜入夜，润物细无声。"],
        "夜": ["夜来风雨声，花落知多少。", "夜阑卧听风吹雨，铁马冰河入梦来。"],
        "人": ["人闲桂花落，夜静春山空。", "人生自古谁无死，留取丹心照汗青。"],
        "心": ["采菊东篱下，悠然见南山。", "千里莺啼绿映红，水村山郭酒旗风。南朝四百八十寺，多少楼台烟雨中。"],
        "云": ["欲把西湖比西子，淡妆浓抹总相宜。", "白日放歌须纵酒，青春作伴好还乡。"],
        "酒": ["对酒当歌，人生几何。", "花间一壶酒，独酌无相亲。"],
        "雨": ["空山新雨后，天气晚来秋。", "好雨知时节，当春乃发生。随风潜入夜，润物细无声。"],
        "江": ["春风又绿江南岸，明月何时照我还。", "孤帆远影碧空尽，唯见长江天际流。"],
        "归": ["少壮不努力，老大徒伤悲。", "归去来兮，田园将芜胡不归？"],
        "愁": ["抽刀断水水更流，举杯消愁愁更愁。", "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。"]
    };
    
    // 获取新的随机字根
    function getNextChar() {
        // 如果所有字都已经用过了，则重置已使用字根记录
        if (usedChars.length >= chars.length) {
            usedChars.length = 0;
        }
        
        // 过滤出未使用过的字根
        const availableChars = chars.filter(char => !usedChars.includes(char));
        
        // 随机选择一个新字根
        const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
        
        // 添加到已使用字根记录
        usedChars.push(randomChar);
        
        return randomChar;
    }
    
    // 更新UI显示的字根和示例
    function updateCharDisplay() {
        // 更新界面上显示的字根
        const targetChars = document.querySelectorAll('.poetry-target');
        targetChars.forEach(el => {
            el.textContent = gameState.currentChar;
        });
        
        // 更新示例诗句
        const examplesContainer = document.querySelector('.poetry-examples');
        if (examplesContainer) {
            examplesContainer.innerHTML = `
                <h4>示例诗句：</h4>
                <p>- ${examples[gameState.currentChar][0]}</p>
                <p>- ${examples[gameState.currentChar][1]}</p>
            `;
        }
    }
    
    // 清空历史列表
    if (historyList) {
        historyList.innerHTML = '';
    }
    
    // 更新回合和分数显示
    if (roundDisplay) roundDisplay.textContent = gameState.round;
    if (scoreDisplay) scoreDisplay.textContent = gameState.score;
    
    // 隐藏胜利面板
    if (winPanel) {
        winPanel.style.display = 'none';
    }
    
    // 设置初始字根并更新显示
    gameState.currentChar = getNextChar();
    updateCharDisplay();
    
    // 提交答案
    if (newSubmitBtn) {
        newSubmitBtn.addEventListener('click', function() {
            const answer = answerInput.value.trim();
            
            // 检查答案是否为空
            if (!answer) {
                alert('请输入诗句！');
                return;
            }
            
            // 检查答案是否包含目标字
            if (answer.includes(gameState.currentChar)) {
                // 检查是否已提交过相同答案
                if (gameState.history.includes(answer)) {
                    alert('这个诗句已经提交过了，请换一个！');
                    return;
                }
                
                // 答案正确，更新游戏状态
                gameState.score += 10;
                gameState.history.push(answer);
                
                // 更新历史记录显示
                if (historyList) {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <span class="history-round">第${gameState.round}轮:</span>
                        ${answer.replace(new RegExp(gameState.currentChar, 'g'), `<span class="char">${gameState.currentChar}</span>`)}
                    `;
                    historyList.appendChild(historyItem);
                }
                
                // 进入下一轮或结束游戏
                gameState.round++;
                if (gameState.round > 5) {
                    // 游戏结束
                    if (finalScore) finalScore.textContent = gameState.score;
                    if (winPanel) winPanel.style.display = 'block';
                } else {
                    // 清空输入框，准备下一轮
                    // 不再每轮更换字根，保持同一个字根进行5轮游戏
                    answerInput.value = '';
                    if (roundDisplay) roundDisplay.textContent = gameState.round;
                }
                
                // 更新分数
                if (scoreDisplay) scoreDisplay.textContent = gameState.score;
            } else {
                alert(`请输入包含"${gameState.currentChar}"字的诗句！`);
            }
        });
    }
    
    // 提示按钮
    if (newHintBtn) {
        newHintBtn.addEventListener('click', function() {
            alert(`提示：以下是含有"${gameState.currentChar}"字的名句：\n${examples[gameState.currentChar][0]}\n${examples[gameState.currentChar][1]}`);
        });
    }
    
    // 新游戏按钮
    if (newGameBtnClone) {
        newGameBtnClone.addEventListener('click', function() {
            // 重新初始化游戏
            initPoetryGame();
        });
    }
    
    // 清空输入框
    if (answerInput) {
        answerInput.value = '';
    }
    
    // 打印当前游戏状态到控制台，便于调试
    console.log("游戏已初始化，当前字根:", gameState.currentChar);
}

// 数字华容道的实现
function initNumberPuzzle() {
    // 获取元素
    const puzzleGrid = document.getElementById('puzzle-grid');
    const moveCountElement = document.getElementById('move-count');
    const timeCounter = document.getElementById('time-counter');
    const resetButton = document.getElementById('reset-button');
    const shuffleButton = document.getElementById('shuffle-button');
    const undoButton = document.getElementById('undo-button');
    const messageElement = document.getElementById('puzzle-message');
    
    // 初始化变量 - 固定为4x4
    puzzleSize = 4;
    moveCount = 0;
    gameSeconds = 0;
    puzzleHistory = [];
    gameStarted = false;
    
    // 清除之前的定时器
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // 更新界面
    updateMoveCount();
    updateTimer();
    
    // 创建拼图
    createPuzzleGrid();
    
    // 事件监听器
    resetButton.addEventListener('click', resetPuzzle);
    shuffleButton.addEventListener('click', shufflePuzzle);
    undoButton.addEventListener('click', undoMove);
    
    // 初始化拼图
            resetPuzzle();
    
    // 为了演示，调用打乱函数
    setTimeout(shufflePuzzle, 500);
    
    // 创建拼图网格
    function createPuzzleGrid() {
        puzzleGrid.innerHTML = '';
        puzzleGrid.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
        puzzleGrid.style.gridTemplateRows = `repeat(${puzzleSize}, 1fr)`;
        
        const totalTiles = puzzleSize * puzzleSize;
        
        for (let i = 1; i <= totalTiles; i++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.dataset.value = i;
            
            if (i === totalTiles) {
                tile.classList.add('empty');
                tile.textContent = '';
            } else {
                tile.textContent = i;
            }
            
            // 所有方块都添加点击事件，包括空白方块
        tile.addEventListener('click', function() {
                handleTileClick(this);
            });
            
            puzzleGrid.appendChild(tile);
        }
    }
    
    // 处理方块点击
    function handleTileClick(tile) {
        const emptyTile = document.querySelector('.puzzle-tile.empty');
        
        // 如果是空白方块被点击，寻找可移动的相邻方块
        if (tile.classList.contains('empty')) {
            const tileIndex = Array.from(puzzleGrid.children).indexOf(tile);
            const tileRow = Math.floor(tileIndex / puzzleSize);
            const tileCol = tileIndex % puzzleSize;
            
            // 检查四个方向的相邻方块
            const directions = [
                {r: -1, c: 0}, // 上
                {r: 1, c: 0},  // 下
                {r: 0, c: -1}, // 左
                {r: 0, c: 1}   // 右
            ];
            
            for (const dir of directions) {
                const newRow = tileRow + dir.r;
                const newCol = tileCol + dir.c;
                
                // 检查是否在边界内
                if (newRow >= 0 && newRow < puzzleSize && newCol >= 0 && newCol < puzzleSize) {
                    const neighborIndex = newRow * puzzleSize + newCol;
                    const neighborTile = puzzleGrid.children[neighborIndex];
                    
                    // 移动这个相邻方块
                    if (neighborTile) {
                        moveTile(neighborTile);
                        break;
                    }
                }
            }
            return;
        }
        
        // 如果是普通方块被点击，检查是否可以移动
        if (canMove(tile, emptyTile)) {
            moveTile(tile);
        }
    }
}

// 重置拼图到初始状态
function resetPuzzle() {
    const tiles = document.querySelectorAll('.puzzle-tile');
    const totalTiles = puzzleSize * puzzleSize;
    
    // 恢复所有方块的原始样式
    tiles.forEach(tile => {
        // 清除胜利时添加的样式
        tile.style.transition = '';
        tile.style.transform = '';
        tile.style.backgroundColor = '';
        tile.style.boxShadow = '';
        tile.style.borderColor = '';
        
        const value = parseInt(tile.dataset.value);
        tile.textContent = value === totalTiles ? '' : value;
        tile.classList.toggle('empty', value === totalTiles);
    });
    
    moveCount = 0;
    gameSeconds = 0;
    puzzleHistory = [];
    gameStarted = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateMoveCount();
    updateTimer();
    hideMessage();
}

// 打乱拼图（保证可解）
function shufflePuzzle() {
    // 停止前一次游戏的计时器
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // 重置游戏状态
    moveCount = 0;
    gameSeconds = 0;
    puzzleHistory = [];
    gameStarted = true;
    
    // 获取所有方块
    const tiles = Array.from(document.querySelectorAll('.puzzle-tile'));
    const totalTiles = puzzleSize * puzzleSize;
    
    // 恢复所有方块的原始样式
    tiles.forEach(tile => {
        // 清除胜利时添加的样式
        tile.style.transition = '';
        tile.style.transform = '';
        tile.style.backgroundColor = '';
        tile.style.boxShadow = '';
        tile.style.borderColor = '';
    });
    
    // 创建有序数组
    let values = Array.from({length: totalTiles}, (_, i) => i + 1);
    
    // 使用Fisher-Yates洗牌算法打乱数组
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    
    // 检查可解性并调整
    if (!isSolvable(values)) {
        // 如果不可解，交换两个非空格相邻数字
        // 找出两个相邻的非空格数字进行交换
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] !== totalTiles && values[i+1] !== totalTiles) {
                // 找到两个相邻的非空格数字，交换它们
                [values[i], values[i+1]] = [values[i+1], values[i]];
                break;
            }
        }
        
        // 如果上面的循环没有找到可交换的相邻数字（极少数情况），则使用备选方案
        if (!isSolvable(values)) {
            // 从最后往前找两个非空格数字交换
            for (let i = values.length - 1; i > 0; i--) {
                if (values[i] !== totalTiles && values[i-1] !== totalTiles) {
                    [values[i], values[i-1]] = [values[i-1], values[i]];
                    break;
                }
            }
        }
    }
    
    // 最终验证可解性
    if (!isSolvable(values)) {
        console.error("无法生成可解的拼图状态！");
    }
    
    // 更新拼图方块
    tiles.forEach((tile, index) => {
        const value = values[index];
        tile.dataset.value = value;
        tile.textContent = value === totalTiles ? '' : value;
        tile.classList.toggle('empty', value === totalTiles);
    });
    
    // 开始计时
    updateMoveCount();
    updateTimer();
    startTimer();
    hideMessage();
}

// 检查拼图状态是否可解
function isSolvable(values) {
    const totalTiles = puzzleSize * puzzleSize;
    
    // 找出空格所在位置
    const emptyPos = values.indexOf(totalTiles);
    
    // 计算空格所在行号（从1开始计数）
    const emptyRow = Math.floor(emptyPos / puzzleSize) + 1;
    
    // 创建不包含空格的数组用于计算逆序数
    const valuesWithoutEmpty = values.filter(val => val !== totalTiles);
    
    // 计算逆序数
    let inversions = 0;
    for (let i = 0; i < valuesWithoutEmpty.length; i++) {
        for (let j = i + 1; j < valuesWithoutEmpty.length; j++) {
            if (valuesWithoutEmpty[i] > valuesWithoutEmpty[j]) {
                inversions++;
            }
        }
    }
    
    // 根据华容道可解条件进行判断
    // 对于4x4华容道，当逆序数的奇偶性加上空格行数的奇偶性为偶数时有解
    return (inversions + emptyRow) % 2 === 0;
}

// 移动方块
function moveTile(tile) {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    const emptyTile = document.querySelector('.puzzle-tile.empty');
    
    if (canMove(tile, emptyTile)) {
        // 保存移动前的状态到历史记录
        saveHistory();
        
        // 交换方块位置
        const tileValue = tile.dataset.value;
        const emptyValue = emptyTile.dataset.value;
        
        tile.dataset.value = emptyValue;
        emptyTile.dataset.value = tileValue;
        
        // 更新显示
        emptyTile.textContent = tileValue;
        emptyTile.classList.remove('empty');
        
        tile.textContent = '';
        tile.classList.add('empty');
        
        // 更新移动次数
        moveCount++;
        updateMoveCount();
        
        // 检查是否胜利
        checkWin();
    }
}

// 检查方块是否可以移动
function canMove(tile, emptyTile) {
    // 如果点击的就是空白方块，不需要移动
    if (tile.classList.contains('empty')) {
        return false;
    }
    
    const tileIndex = Array.from(tile.parentNode.children).indexOf(tile);
    const emptyIndex = Array.from(emptyTile.parentNode.children).indexOf(emptyTile);
    
    const tileRow = Math.floor(tileIndex / puzzleSize);
    const tileCol = tileIndex % puzzleSize;
    
    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    
    // 检查是否相邻（上、下、左、右）
    return (
        (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
        (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
    );
}

// 保存历史记录
function saveHistory() {
    const currentState = Array.from(document.querySelectorAll('.puzzle-tile')).map(tile => ({
        value: tile.dataset.value,
        empty: tile.classList.contains('empty')
    }));
    
    puzzleHistory.push(currentState);
    
    // 限制历史记录长度
    if (puzzleHistory.length > 100) {
        puzzleHistory.shift();
    }
}

// 撤销移动
function undoMove() {
    if (puzzleHistory.length === 0 || !gameStarted) return;
    
    const previousState = puzzleHistory.pop();
    const tiles = document.querySelectorAll('.puzzle-tile');
    
    tiles.forEach((tile, index) => {
        const prevTile = previousState[index];
        tile.dataset.value = prevTile.value;
        tile.textContent = prevTile.empty ? '' : prevTile.value;
        tile.classList.toggle('empty', prevTile.empty);
    });
    
    moveCount--;
    updateMoveCount();
}

// 检查是否胜利
function checkWin() {
    const tiles = document.querySelectorAll('.puzzle-tile');
    const totalTiles = puzzleSize * puzzleSize;
    
    let win = true;
    for (let i = 0; i < totalTiles; i++) {
        const expectedValue = i + 1;
        const actualValue = parseInt(tiles[i].dataset.value);
        
        if (expectedValue !== actualValue) {
            win = false;
            break;
        }
    }
    
    if (win) {
        // 停止计时器
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // 显示胜利消息
        showMessage(`恭喜！你用了 ${moveCount} 步和 ${formatTime(gameSeconds)} 完成了 ${puzzleSize}x${puzzleSize} 的华容道！`);
        
        // 添加胜利效果 - 为所有方块添加动画效果
        const allTiles = document.querySelectorAll('.puzzle-tile');
        allTiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.style.transition = 'all 0.3s ease';
                tile.style.transform = 'scale(1.1)';
                // 使用系统主题颜色
                tile.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                tile.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.5)';
                tile.style.borderColor = '#FF6B35';
                
                setTimeout(() => {
                    tile.style.transform = 'scale(1)';
                }, 300);
            }, index * 50); // 依次为每个方块添加动画
        });
        
        gameStarted = false;
    }
}

// 开始计时器
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    gameSeconds = 0;
    updateTimer();
    
    timerInterval = setInterval(function() {
        gameSeconds++;
        updateTimer();
    }, 1000);
}

// 更新计时器显示
function updateTimer() {
    const timeCounter = document.getElementById('time-counter');
    if (timeCounter) {
        timeCounter.textContent = formatTime(gameSeconds);
    }
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新移动次数显示
function updateMoveCount() {
    const moveCountElement = document.getElementById('move-count');
    if (moveCountElement) {
        moveCountElement.textContent = moveCount;
    }
}

// 显示消息
function showMessage(message) {
    const messageElement = document.getElementById('puzzle-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
        messageElement.style.color = '#FF6B35';
        messageElement.style.animation = 'fadeIn 0.5s ease';
        messageElement.style.borderLeft = '4px solid #FF6B35';
    }
}

// 隐藏消息
function hideMessage() {
    const messageElement = document.getElementById('puzzle-message');
    if (messageElement) {
        messageElement.style.display = 'none';
        messageElement.style.animation = '';
    }
}

// 初始化英语版麻将游戏
function initEnglishMahjong() {
    // 游戏状态变量
    let gameState = {
        tilePool: [], // 牌池
        players: [
            { name: "玩家1", tiles: [], words: [], eyes: null, score: 0 },
            { name: "玩家2", tiles: [], words: [], eyes: null, score: 0 },
            { name: "玩家3", tiles: [], words: [], eyes: null, score: 0 },
            { name: "玩家4", tiles: [], words: [], eyes: null, score: 0 }
        ],
        currentPlayer: 0,
        discardPile: [],
        selectedTiles: [],
        gameStarted: false,
        lastDiscarded: null
    };
    
    // 设置牌桌样式为渐变橙色
    const mahjongTable = document.querySelector('.mahjong-table');
    if (mahjongTable) {
        mahjongTable.style.background = 'linear-gradient(135deg, #ffa500, #ff8c00)';
    }
    
    // 绑定游戏控制按钮
    const newGameBtn = document.querySelector('.new-mahjong-game');
    const rulesToggle = document.querySelector('.game-rules-toggle');
    const closeRules = document.querySelector('.close-rules');
    const drawBtn = document.querySelector('.action-draw');
    const discardBtn = document.querySelector('.action-discard');
    const claimBtn = document.querySelector('.action-claim');
    const tripleBtn = document.querySelector('.action-triple');
    const winBtn = document.querySelector('.action-win');
    const dictionaryToggle = document.querySelector('.toggle-dictionary');
    const checkWordBtn = document.querySelector('.check-word');
    
    // 事件监听
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewMahjongGame);
    }
    
    if (rulesToggle) {
        rulesToggle.addEventListener('click', toggleRulesPanel);
    }
    
    if (closeRules) {
        closeRules.addEventListener('click', toggleRulesPanel);
    }
    
    if (dictionaryToggle) {
        dictionaryToggle.addEventListener('click', toggleDictionaryPanel);
    }
    
    if (drawBtn) {
        drawBtn.addEventListener('click', drawTile);
    }
    
    if (discardBtn) {
        discardBtn.addEventListener('click', discardTile);
    }
    
    if (claimBtn) {
        claimBtn.addEventListener('click', claimTile);
    }
    
    if (tripleBtn) {
        tripleBtn.addEventListener('click', claimTriple);
    }
    
    if (winBtn) {
        winBtn.addEventListener('click', declareWin);
    }
    
    if (checkWordBtn) {
        checkWordBtn.addEventListener('click', checkWord);
    }
    
    // 初始化游戏
    initializeGame();
    
    // 游戏初始化函数
    function initializeGame() {
        const rulesPanel = document.querySelector('.game-rules-panel');
        
        // 设置规则面板样式
        if (rulesPanel) {
            rulesPanel.style.display = 'none';
        }
        
        // 自动开始新游戏
        startNewMahjongGame();
    }
    
    // 开始新游戏
    function startNewMahjongGame() {
        console.log("开始新的英语麻将游戏");
        
        // 显示基础UI
        const playerTiles = document.querySelector('.player-tiles');
        if (playerTiles) {
            playerTiles.innerHTML = "<div class='info-message'>正在准备牌组...</div>";
        }
        
        // 简单的游戏启动提示
        const mahjongGame = document.querySelector('.english-mahjong-game');
        const infoPanel = document.createElement('div');
        infoPanel.className = 'info-panel';
        infoPanel.innerHTML = `
            <h3>游戏已准备就绪!</h3>
            <p>英语麻将游戏模块已加载完成。</p>
            <p>您可以点击"新游戏"按钮开始游戏。</p>
        `;
        
        if (mahjongGame) {
            mahjongGame.appendChild(infoPanel);
        }
    }
    
    // 规则面板切换
    function toggleRulesPanel() {
        const rulesPanel = document.querySelector('.game-rules-panel');
        if (rulesPanel) {
            rulesPanel.style.display = rulesPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    // 词典面板切换
    function toggleDictionaryPanel() {
        const dictionaryPanel = document.querySelector('.dictionary-panel');
        if (dictionaryPanel) {
            dictionaryPanel.style.display = dictionaryPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    // 检查单词
    function checkWord() {
        const wordInput = document.querySelector('.word-check');
        const wordResult = document.querySelector('.word-result');
        
        if (wordInput && wordResult) {
            const word = wordInput.value.trim().toLowerCase();
            if (word.length >= 2) {
                // 模拟单词检查结果
                wordResult.innerHTML = `
                    <div class="word-info">
                        <h4>${word}</h4>
                        <div>✅ 有效单词</div>
                        <div class="word-meaning">这是一个模拟的单词释义。在实际游戏中，这里会显示真实的单词意思和例句。</div>
                    </div>
                `;
            } else {
                wordResult.innerHTML = '<div class="error">请输入至少2个字母的单词</div>';
            }
        }
    }
    
    // 其他游戏功能占位
    function drawTile() { console.log("摸牌功能待实现"); }
    function discardTile() { console.log("出牌功能待实现"); }
    function claimTile() { console.log("吃牌功能待实现"); }
    function claimTriple() { console.log("碰牌功能待实现"); }
    function declareWin() { console.log("胡牌功能待实现"); }
}

