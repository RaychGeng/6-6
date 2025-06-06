document.addEventListener('DOMContentLoaded', function() {
    // 检查小火苗助手是否已添加到页面
    if (!document.getElementById('flame-assistant')) {
        // 添加CSS样式
        const flameStyle = document.createElement('style');
        flameStyle.textContent = `
            /* 小火苗悬浮助手样式 - 纯图标版 */
            .flame-assistant {
                position: fixed;
                bottom: 100px;
                right: 40px;
                width: 100px;
                height: 100px;
                z-index: 1000;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
                filter: drop-shadow(0 5px 10px rgba(255, 107, 53, 0.4));
                opacity: 1;
                visibility: visible;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .flame-assistant:hover {
                transform: translateY(-3px);
            }
            
            .flame-character {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .flame-icon {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 3.8rem;
                color: var(--anime-accent, #FD5E53);
                animation: flame-pulse 2s ease-in-out infinite alternate;
                text-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
                z-index: 2;
            }
            
            @keyframes flame-pulse {
                0% {
                    transform: translateX(-50%) scale(1);
                    text-shadow: 0 0 15px rgba(255, 193, 7, 0.3);
                }
                100% {
                    transform: translateX(-50%) scale(1.1);
                    text-shadow: 0 0 20px rgba(255, 193, 7, 0.6);
                }
            }
            
            .flame-glow {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 80px;
                background: radial-gradient(ellipse at center, rgba(255, 193, 7, 0.3) 0%, rgba(255, 107, 53, 0.1) 60%, rgba(255, 107, 53, 0) 100%);
                border-radius: 50%;
                filter: blur(5px);
                z-index: 1;
                animation: glow-pulse 2s infinite alternate;
            }
            
            @keyframes glow-pulse {
                0% {
                    opacity: 0.5;
                    transform: translateX(-50%) scale(1);
                }
                100% {
                    opacity: 0.7;
                    transform: translateX(-50%) scale(1.2);
                }
            }
            
            .flame-message {
                position: absolute;
                top: -65px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 12px 15px;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                font-size: 14px;
                color: var(--dark-text, #333);
                white-space: normal;
                word-wrap: break-word;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: none;
                max-width: 220px;
                min-width: 120px;
                width: max-content;
                text-align: center;
                line-height: 1.5;
                z-index: 10;
                overflow: visible;
            }
            
            .flame-message::after {
                content: '';
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid white;
            }
            
            .flame-assistant:hover .flame-message {
                opacity: 1;
                transform: translateX(-50%) translateY(-5px);
            }
            
            /* 重新定位控制按钮 */
            .flame-controls {
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 11;
                background: rgba(255, 255, 255, 0.9);
                padding: 4px 10px;
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .flame-assistant:hover .flame-controls {
                opacity: 1;
            }
            
            .flame-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: white;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--gray-text, #666);
                transition: all 0.2s ease;
            }
            
            .flame-btn:hover {
                background: var(--anime-accent, #FD5E53);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 3px 8px rgba(253, 94, 83, 0.3);
            }
            
            .flame-btn i {
                font-size: 1rem;
            }
            
            /* 添加聊天界面样式 */
            .flame-chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 90%;
                max-width: 800px;
                height: 80vh;
                max-height: 700px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                z-index: 999;
                overflow: hidden;
                transition: all 0.3s ease, opacity 0.3s ease;
                border: 1px solid #e0e0e0;
            }
            
            .flame-chat-header {
                padding: 14px 16px;
                background: white;
                color: #202123;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .flame-chat-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                font-size: 16px;
            }
            
            .flame-chat-title i {
                color: var(--anime-accent, #FD5E53);
            }
            
            .flame-chat-close {
                background: transparent;
                border: none;
                color: #6e6e80;
                cursor: pointer;
                font-size: 1rem;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .flame-chat-close:hover {
                background: rgba(0,0,0,0.05);
            }
            
            .flame-chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background-color: #f7f7f8;
                min-height: 200px;
            }
            
            .flame-message-item {
                max-width: 90%;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 15px;
                line-height: 1.5;
                position: relative;
                word-break: break-word;
            }
            
            .flame-message-user {
                align-self: flex-end;
                background: #efefef;
                color: #111;
                border-radius: 8px;
            }
            
            .flame-message-bot {
                align-self: flex-start;
                background: white;
                color: #111;
                border-radius: 8px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            
            .flame-message-system {
                align-self: center;
                background: #f0f0f0;
                color: #666;
                font-style: italic;
                font-size: 13px;
                padding: 6px 12px;
                border-radius: 8px;
                margin: 4px 0;
                max-width: 90%;
            }
            
            .flame-chat-input-container {
                padding: 14px 16px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: white;
                max-height: 30vh;
                overflow: auto;
            }
            
            .flame-chat-input-wrapper {
                display: flex;
                align-items: flex-end;
                gap: 10px;
                position: relative;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 10px;
                min-height: 45px;
            }
            
            .flame-chat-input {
                flex: 1;
                padding: 0;
                border: none;
                border-radius: 0;
                font-size: 15px;
                outline: none;
                resize: none;
                max-height: 200px;
                min-height: 24px;
                font-family: inherit;
                transition: all 0.2s ease;
                background: transparent;
                line-height: 1.5;
            }
            
            .flame-chat-input:focus {
                border-color: transparent;
                box-shadow: none;
            }
            
            .flame-chat-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .flame-chat-send {
                background: var(--anime-accent, #FD5E53);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .flame-chat-send:hover {
                transform: translateY(-2px);
                background: var(--anime-accent-dark, #E84E43);
            }
            
            .flame-chat-send:disabled {
                background: #e0e0e0;
                cursor: not-allowed;
                transform: none;
            }
            
            .flame-upload-btn, .flame-settings-btn, .flame-voice-btn {
                background: transparent;
                color: #6e6e80;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: visible;
            }
            
            .flame-upload-btn input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
                z-index: 2;
            }
            
            .flame-upload-btn:hover, .flame-settings-btn:hover, .flame-voice-btn:hover {
                background: #f0f0f0;
            }
            
            /* 添加按钮悬浮提示样式 */
            .flame-upload-btn::after {
                content: "上传文件";
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            
            .flame-settings-btn::after {
                content: "设置";
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            
            .flame-voice-btn::after {
                content: "语音输入";
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            
            .flame-upload-btn:hover::after,
            .flame-settings-btn:hover::after,
            .flame-voice-btn:hover::after {
                opacity: 1;
            }
            
            .flame-model-selector {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0 6px;
            }
            
            .flame-model-selector select {
                padding: 6px 8px;
                border-radius: 6px;
                border: 1px solid #e0e0e0;
                background: white;
                font-size: 13px;
                outline: none;
                cursor: pointer;
            }
            
            .flame-model-selector label {
                font-size: 13px;
                color: #666;
            }
            
            .flame-image-preview {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 8px;
            }
            
            .flame-settings-panel {
                position: absolute;
                right: 6px;
                bottom: 60px;
                width: 270px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                padding: 16px;
                z-index: 12;
                display: none;
                border: 1px solid #e0e0e0;
            }
            
            .flame-settings-option {
                margin-bottom: 12px;
            }
            
            .flame-settings-option label {
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                color: #333;
            }
            
            .flame-settings-option input[type="range"],
            .flame-settings-option input[type="number"],
            .flame-settings-option textarea {
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
                font-size: 14px;
            }
            
            .flame-settings-option input[type="checkbox"] {
                cursor: pointer;
                accent-color: var(--anime-accent, #FD5E53);
            }
            
            .flame-settings-title {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 12px;
                color: #333;
            }
            
            .flame-settings-footer {
                margin-top: 15px;
                display: flex;
                justify-content: flex-end;
            }
            
            .flame-settings-save {
                background: var(--anime-accent, #FD5E53);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            .flame-settings-save:hover {
                background: var(--anime-accent-dark, #E84E43);
                transform: translateY(-2px);
            }
            
            .flame-chat-footer {
                padding: 6px 12px;
                background: white;
                color: #6e6e80;
                font-size: 12px;
                text-align: center;
                border-top: 1px solid #f0f0f0;
            }
        `;
        
        document.head.appendChild(flameStyle);

        // 创建小火苗助手HTML结构
        const flameAssistantHTML = `
            <div class="flame-assistant" id="flame-assistant">
                <div class="flame-controls">
                    <button class="flame-btn" id="flame-toggle-chat" title="打开聊天">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="flame-btn" id="flame-close" title="关闭助手">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="flame-message" id="flame-message">嗨！我是小火苗，需要帮助吗？</div>
                <div class="flame-character">
                    <div class="flame-glow"></div>
                    <div class="flame-icon">
                        <i class="fas fa-fire"></i>
                    </div>
                </div>
            </div>
            
            <div class="flame-chat-container" id="flame-chat-container">
                <div class="flame-chat-header">
                    <div class="flame-chat-title">
                        <i class="fas fa-fire"></i>
                        <span>小火苗AI助手</span>
                    </div>
                    <button class="flame-chat-close" id="flame-chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="flame-chat-messages" id="flame-chat-messages">
                    <div class="flame-message-item flame-message-bot">
                        您好！我是小火苗AI助手。有什么可以帮您解答的问题吗？我支持DeepSeek、Qwen3、Llama 3.1 Nemotron Ultra和Gemini等顶级模型，可以处理长达13万token的超长上下文、图像识别，现在还支持语音对话功能！
                    </div>
                </div>
                <div class="flame-chat-input-container" id="flame-chat-input-container">
                    <div class="flame-model-selector">
                        <label>模型:</label>
                        <select id="flame-model-select">
                            <option value="deepseek/deepseek-r1:free" selected>DeepSeek R1 (free)</option>
                            <option value="qwen/qwen3-32b:free">Qwen3 32B (free)</option>
                            <option value="nvidia/llama-3.1-nemotron-ultra-253b-v1:free">Llama 3.1 Nemotron Ultra 253B</option>
                            <option value="google/gemini-2.5-pro-exp-03-25">Gemini 2.5 Pro</option>
                        </select>
                    </div>
                    <div class="flame-chat-input-wrapper">
                        <textarea class="flame-chat-input" id="flame-chat-input" placeholder="发送消息给小火苗助手..." rows="1"></textarea>
                        <div class="flame-chat-actions">
                            <button class="flame-upload-btn" id="flame-upload-btn" title="上传图片">
                                <i class="fas fa-image"></i>
                                <input type="file" id="flame-file-input" accept="image/*" multiple>
                            </button>
                            <button class="flame-voice-btn" id="flame-voice-btn" title="语音输入">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button class="flame-settings-btn" id="flame-settings-btn" title="设置">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button class="flame-chat-send" id="flame-chat-send" disabled>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flame-image-preview" id="flame-image-preview" style="display: none;"></div>
                </div>
                <div class="flame-settings-panel" id="flame-settings-panel">
                    <div class="flame-settings-title">AI 设置</div>
                    <div class="flame-settings-option">
                        <label>温度 (创造性):</label>
                        <input type="range" id="flame-temperature" min="0" max="1" step="0.1" value="0.7">
                        <div class="flame-range-value" id="flame-temperature-value">0.7</div>
                    </div>
                    <div class="flame-settings-option">
                        <label>最大输出:</label>
                        <input type="number" id="flame-max-tokens" min="50" max="8192" value="1024">
                    </div>
                    <div class="flame-settings-option">
                        <label>系统提示 (指导AI行为):</label>
                        <textarea id="flame-system-prompt" rows="3">您是小火苗AI助手，一个友好、专业的助手，擅长回答问题、解释概念和提供信息。您的回答应该准确、简洁且易于理解。</textarea>
                    </div>
                    <div class="flame-settings-footer">
                        <button class="flame-settings-save" id="flame-settings-save">保存设置</button>
                    </div>
                </div>
                <div class="flame-chat-footer">
                    Powered by 小火苗 AI
                </div>
            </div>
        `;
        
        // 将小火苗助手添加到页面
        const flameContainer = document.createElement('div');
        flameContainer.innerHTML = flameAssistantHTML;
        document.body.appendChild(flameContainer.firstElementChild);
        document.body.appendChild(flameContainer.lastElementChild);
    }
    
    // API密钥配置
    const API_KEYS = {
        'deepseek/deepseek-r1:free': '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',
        'qwen/qwen3-32b:free': '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',
        'nvidia/llama-3.1-nemotron-ultra-253b-v1:free': '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',
        'google/gemini-2.5-pro-exp-03-25': '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'
    };
    // API基础地址
    const API_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
    
    // AI配置
    let aiSettings = {
        model: 'deepseek/deepseek-r1:free',
        temperature: 0.7,
        maxOutputTokens: 1024,
        systemPrompt: '您是小火苗AI助手，一个友好、专业的助手，擅长回答问题、解释概念和提供信息。您的回答应该准确、简洁且易于理解。'
    };
    
    // 聊天历史记录
    let chatHistory = [];
    
    // 小火苗助手功能
    const flameAssistant = document.getElementById('flame-assistant');
    const flameClose = document.getElementById('flame-close');
    const flameMessage = document.getElementById('flame-message');
    const flameToggleChat = document.getElementById('flame-toggle-chat');
    const flameChatContainer = document.getElementById('flame-chat-container');
    const flameChatClose = document.getElementById('flame-chat-close');
    const flameChatInput = document.getElementById('flame-chat-input');
    const flameChatSend = document.getElementById('flame-chat-send');
    const flameChatMessages = document.getElementById('flame-chat-messages');
    const flameFileInput = document.getElementById('flame-file-input');
    const flameImagePreview = document.getElementById('flame-image-preview');
    const flameModelSelect = document.getElementById('flame-model-select');
    const flameSettingsBtn = document.getElementById('flame-settings-btn');
    const flameSettingsPanel = document.getElementById('flame-settings-panel');
    const flameSettingsSave = document.getElementById('flame-settings-save');
    const flameTemperature = document.getElementById('flame-temperature');
    const flameTemperatureValue = document.getElementById('flame-temperature-value');
    const flameMaxTokens = document.getElementById('flame-max-tokens');
    const flameSystemPrompt = document.getElementById('flame-system-prompt');
    
    let uploadedImages = [];
    
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let chatPositionSet = false; // 跟踪聊天窗口是否已被拖动过
    
    // 拖动功能
    flameAssistant.addEventListener('mousedown', function(e) {
        if (e.target.closest('.flame-btn')) return; // 不要在点击按钮时触发拖动
        
        isDragging = true;
        dragOffsetX = e.clientX - flameAssistant.getBoundingClientRect().left;
        dragOffsetY = e.clientY - flameAssistant.getBoundingClientRect().top;
        
        flameAssistant.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const left = e.clientX - dragOffsetX;
        const top = e.clientY - dragOffsetY;
        
        flameAssistant.style.left = `${left}px`;
        flameAssistant.style.top = `${top}px`;
        flameAssistant.style.right = 'auto';
        flameAssistant.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        chatPositionSet = true; // 标记聊天窗口已被拖动
        flameAssistant.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    // 添加聊天窗口拖动功能
    let chatIsDragging = false;
    let chatDragOffsetX = 0;
    let chatDragOffsetY = 0;
    
    // 通过聊天头部进行拖动
    const flameChatHeader = document.querySelector('.flame-chat-header');
    flameChatHeader.style.cursor = 'move';
    
    flameChatHeader.addEventListener('mousedown', function(e) {
        if (e.target.closest('.flame-chat-close')) return; // 不要在点击关闭按钮时触发拖动
        
        chatIsDragging = true;
        chatDragOffsetX = e.clientX - flameChatContainer.getBoundingClientRect().left;
        chatDragOffsetY = e.clientY - flameChatContainer.getBoundingClientRect().top;
        
        flameChatContainer.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!chatIsDragging) return;
        
        const left = e.clientX - chatDragOffsetX;
        const top = e.clientY - chatDragOffsetY;
        
        // 确保不会拖出屏幕
        const maxX = window.innerWidth - flameChatContainer.offsetWidth;
        const maxY = window.innerHeight - flameChatContainer.offsetHeight;
        
        const constrainedLeft = Math.max(0, Math.min(left, maxX));
        const constrainedTop = Math.max(0, Math.min(top, maxY));
        
        flameChatContainer.style.left = `${constrainedLeft}px`;
        flameChatContainer.style.top = `${constrainedTop}px`;
        flameChatContainer.style.right = 'auto';
        flameChatContainer.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', function() {
        if (!chatIsDragging) return;
        
        chatIsDragging = false;
        chatPositionSet = true; // 标记聊天窗口已被拖动
        flameChatContainer.style.transition = 'opacity 0.3s ease';
    });
    
    // 关闭按钮
    flameClose.addEventListener('click', function() {
        flameAssistant.style.display = 'none';
    });
    
    // 打开聊天界面
    flameToggleChat.addEventListener('click', function() {
        // 显示聊天窗口
        flameChatContainer.style.display = 'flex';
        flameMessage.style.opacity = "0";
        
        // 重置聊天窗口位置，除非已经被拖动过
        if (!chatPositionSet) {
            flameChatContainer.style.left = '';
            flameChatContainer.style.top = '';
            flameChatContainer.style.right = '20px';
            flameChatContainer.style.bottom = '20px';
        }
        
        // 隐藏小火苗助手
        if (flameAssistant.style.display !== 'none') {
            flameAssistant.style.opacity = "0";
            setTimeout(() => {
                flameAssistant.style.visibility = "hidden";
            }, 300); // 300ms是过渡时间
        }
        
        // 加载设置
        loadSettings();
        
        // 直接更新页脚，以防loadSettings之外的情况
        setTimeout(updateFooter, 100);
    });
    
    // 关闭聊天界面
    flameChatClose.addEventListener('click', function() {
        flameChatContainer.style.display = 'none';
        
        // 仅当小火苗助手不是被用户主动关闭时才显示
        if (flameAssistant.style.display !== 'none') {
            // 重新显示小火苗助手
            flameAssistant.style.visibility = "visible";
        setTimeout(() => {
                flameAssistant.style.opacity = "1";
        }, 10);
        }
        
        // 清空上传的图片
        clearImagePreviews();
    });
    
    // 显示设置面板
    flameSettingsBtn.addEventListener('click', function() {
        flameSettingsPanel.style.display = flameSettingsPanel.style.display === 'block' ? 'none' : 'block';
    });
    
    // 保存设置
    flameSettingsSave.addEventListener('click', function() {
        aiSettings.temperature = parseFloat(flameTemperature.value);
        aiSettings.maxOutputTokens = parseInt(flameMaxTokens.value);
        aiSettings.systemPrompt = flameSystemPrompt.value;
        
        // 保存设置到本地存储
        saveSettings();
        
        // 关闭设置面板
        flameSettingsPanel.style.display = 'none';
        
        // 添加确认消息
        addMessage('设置已保存。', 'system');
    });
    
    // 温度滑块变化
    flameTemperature.addEventListener('input', function() {
        flameTemperatureValue.textContent = this.value;
    });
    
    // 模型选择变化
    flameModelSelect.addEventListener('change', function() {
        aiSettings.model = this.value;
        saveSettings();
        updateModelDescription(); // 更新模型描述
        // Gemini付费提示
        const geminiTipId = 'flame-gemini-pay-tip';
        let existTip = document.getElementById(geminiTipId);
        if (aiSettings.model === 'google/gemini-2.5-pro-exp-03-25') {
            if (!existTip) {
                const tipDiv = document.createElement('div');
                tipDiv.id = geminiTipId;
                tipDiv.className = 'flame-message-item flame-message-system';
                tipDiv.style.textAlign = 'center';
                tipDiv.innerHTML = `
                    <div style='margin-bottom:10px;color:#e55a2a;font-weight:bold;'>Gemini 2.5 Pro为付费模型，每月30元，请扫码支付后联系客服开通</div>
                    <img src='images/收款码.jpg' alt='收款码' style='max-width:180px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:8px;'>
                `;
                flameChatMessages.appendChild(tipDiv);
                flameChatMessages.scrollTop = flameChatMessages.scrollHeight;
            }
        } else {
            if (existTip) existTip.remove();
        }
    });
    
    // 显示模型描述
    function updateModelDescription() {
        // 如果模型描述元素不存在，则创建
        let modelDescElement = document.getElementById('flame-model-description');
        if (!modelDescElement) {
            modelDescElement = document.createElement('div');
            modelDescElement.id = 'flame-model-description';
            modelDescElement.className = 'flame-settings-option';
            modelDescElement.style.fontSize = '12px';
            modelDescElement.style.fontStyle = 'italic';
            modelDescElement.style.color = '#666';
            modelDescElement.style.marginTop = '5px';
            modelDescElement.style.padding = '8px';
            modelDescElement.style.backgroundColor = '#f5f5f5';
            modelDescElement.style.borderRadius = '4px';
            
            // 将元素插入到模型选择器后面
            flameModelSelect.parentNode.parentNode.insertBefore(modelDescElement, flameModelSelect.parentNode.nextSibling);
        }
        
        // 根据当前选择的模型设置描述内容
        let description = '';
        switch(aiSettings.model) {
            case 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free':
                description = '强大的253B参数模型，支持13万token上下文，由NVIDIA优化的Llama 3.1。使用详细推理模式自动启用，适合复杂推理任务。';
                break;
            case 'qwen/qwen3-32b:free':
                description = '通义千问最新开源的32B参数模型，支持4万token上下文，可扩展至13万token，具备中英双语优势。';
                break;
            case 'deepseek/deepseek-r1:free':
                description = '开源大模型，由DeepSeek开发，支持长上下文和推理，适合中英文任务。';
                break;
            case 'google/gemini-2.5-pro-exp-03-25':
                description = 'Google最新的Gemini 2.5 Pro模型，多模态能力强大，处理图像和文本的能力出色。';
                break;
            default:
                description = '请选择一个模型';
        }
        
        modelDescElement.textContent = description;
    }
    
    // 图片上传处理
    flameFileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const imageData = event.target.result;
                        addImagePreview(imageData, file.name);
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
        }
    });
    
    // 自动调整文本区域高度
    flameChatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        const newHeight = Math.min(this.scrollHeight, 200);
        this.style.height = newHeight + 'px';
        
        // 根据输入内容启用或禁用发送按钮
        flameChatSend.disabled = this.value.trim() === '' && uploadedImages.length === 0;
    });
    
    // 在添加图片时也要更新发送按钮状态
    function updateSendButtonState() {
        flameChatSend.disabled = flameChatInput.value.trim() === '' && uploadedImages.length === 0;
    }
    
    // 修改添加图片预览函数
    function addImagePreview(imageData, filename) {
        // 显示预览区域
        flameImagePreview.style.display = 'flex';
        
        const imageItem = document.createElement('div');
        imageItem.className = 'flame-image-item';
        imageItem.style.position = 'relative';
        imageItem.style.width = '80px';
        imageItem.style.height = '80px';
        imageItem.style.borderRadius = '8px';
        imageItem.style.overflow = 'hidden';
        imageItem.style.border = '1px solid #e0e0e0';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = filename;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'flame-image-remove';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '2px';
        removeBtn.style.right = '2px';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.background = 'rgba(0,0,0,0.5)';
        removeBtn.style.color = 'white';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.display = 'flex';
        removeBtn.style.alignItems = 'center';
        removeBtn.style.justifyContent = 'center';
        removeBtn.style.fontSize = '10px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.border = 'none';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = function() {
            // 移除图片预览
            imageItem.remove();
            
            // 从上传列表中移除
            const index = uploadedImages.findIndex(img => img.data === imageData);
            if (index !== -1) {
                uploadedImages.splice(index, 1);
            }
            
            // 如果没有图片了，隐藏预览区域
            if (flameImagePreview.children.length <= 0) {
                flameImagePreview.style.display = 'none';
            }
            
            // 更新发送按钮状态
            updateSendButtonState();
        };
        
        imageItem.appendChild(img);
        imageItem.appendChild(removeBtn);
        flameImagePreview.appendChild(imageItem);
        
        // 添加到上传图片列表
        uploadedImages.push({
            data: imageData,
            filename: filename
        });
        
        // 更新发送按钮状态
        updateSendButtonState();
    }
    
    // 清空图片预览
    function clearImagePreviews() {
        flameImagePreview.innerHTML = '';
        flameImagePreview.style.display = 'none';
        uploadedImages = [];
    }
    
    // 保存设置到本地存储
    function saveSettings() {
        localStorage.setItem('flame-ai-settings', JSON.stringify(aiSettings));
    }
    
    // 从本地存储加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('flame-ai-settings');
        
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            aiSettings = { ...aiSettings, ...parsedSettings };
            
            // 更新UI
            flameModelSelect.value = aiSettings.model;
            flameTemperature.value = aiSettings.temperature;
            flameTemperatureValue.textContent = aiSettings.temperature;
            flameMaxTokens.value = aiSettings.maxOutputTokens;
            flameSystemPrompt.value = aiSettings.systemPrompt;
        }
        
        // 更新模型描述
        updateModelDescription();
        
        // 确保页脚显示正确的文本
        updateFooter();
    }
    
    // 更新页脚文本
    function updateFooter() {
        const footerElement = document.querySelector('.flame-chat-footer');
        if (footerElement) {
            footerElement.textContent = `Powered by 小火苗 AI`;
        }
    }
    
    // 添加消息到聊天区域
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flame-message-item flame-message-${type}`;
        
        if (type === 'system') {
            messageDiv.style.backgroundColor = '#f0f0f0';
            messageDiv.style.color = '#666';
            messageDiv.style.alignSelf = 'center';
            messageDiv.style.fontStyle = 'italic';
            messageDiv.style.fontSize = '13px';
            messageDiv.style.maxWidth = '90%';
            messageDiv.textContent = text;
        } else if (type === 'user') {
            // 用户消息直接显示
            messageDiv.textContent = text;
        } else if (type === 'bot') {
            // AI回复消息，使用打字机效果
            const typingContainer = document.createElement('div');
            typingContainer.style.minHeight = '20px';
            messageDiv.appendChild(typingContainer);
            
            // 添加消息到聊天区域
            flameChatMessages.appendChild(messageDiv);
            
            // 滚动到底部
            flameChatMessages.scrollTop = flameChatMessages.scrollHeight;
            
            // 启用打字机效果
            return typeMessage(text, typingContainer);
        }
        
        flameChatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        flameChatMessages.scrollTop = flameChatMessages.scrollHeight;
        
        // 如果不是bot消息，返回null（不需要等待打字机效果）
        return Promise.resolve();
    }
    
    // 打字机效果
    function typeMessage(text, container) {
        return new Promise((resolve) => {
            // 处理Markdown
            if (text.includes('```') || text.includes('**') || text.includes('*') || text.includes('##')) {
                // 简单转换一些基本的Markdown语法
                const formattedText = text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/##\s(.*?)(?:\n|$)/g, '<h2>$1</h2>')
                    .replace(/###\s(.*?)(?:\n|$)/g, '<h3>$1</h3>')
                    // 处理代码块
                    .replace(/```([\s\S]*?)```/g, function(match, code) {
                        return `<pre style="background:#f5f5f5;padding:10px;border-radius:5px;overflow:auto;font-family:monospace;font-size:12px;margin:8px 0;"><code>${code}</code></pre>`;
                    })
                    // 处理行内代码
                    .replace(/`(.*?)`/g, '<code style="background:#f5f5f5;padding:2px 4px;border-radius:3px;font-family:monospace;font-size:13px;">$1</code>')
                    // 处理链接
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#0366d6;text-decoration:none;">$1</a>')
                    // 处理换行
                    .replace(/\n/g, '<br>');
                
                container.innerHTML = formattedText;
                resolve();
            } else {
                // 普通文本使用打字机效果
                let i = 0;
                const speed = 10; // 毫秒/字符
                const typeNextChar = () => {
                    if (i < text.length) {
                        container.textContent += text.charAt(i);
                        i++;
                        container.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        setTimeout(typeNextChar, speed);
                    } else {
                        resolve();
                    }
                };
                
                typeNextChar();
            }
        });
    }
    
    // 发送消息
    function sendMessage() {
        // 付费模型拦截
        if (aiSettings.model === 'google/gemini-2.5-pro-exp-03-25') {
            addMessage('该模型为付费模型，请充值后再使用。', 'system');
            return;
        }
        const userInput = flameChatInput.value.trim();
        if (!userInput && uploadedImages.length === 0) return;
        
        // 添加用户消息到聊天区域
        let userMessage = userInput;
        addMessage(userMessage, 'user');
        
        // 如果有图片，显示在用户消息下方
        if (uploadedImages.length > 0) {
            addImageMessages(uploadedImages, 'user');
        }
        
        // 清空输入框并禁用发送按钮
        flameChatInput.value = '';
        flameChatInput.style.height = 'auto';
        flameChatSend.disabled = true;
        
        // 显示加载中
        const loaderId = showLoader();
        
        // 调用Gemini API
        callGeminiAPI(userInput, uploadedImages)
            .then(response => {
                // 隐藏加载中
                hideLoader(loaderId);
                
                // 添加AI回复到聊天区域
                if (response) {
                    return addMessage(response, 'bot').then(() => {
                        // 添加到历史记录
                        chatHistory.push({
                            role: 'user',
                            content: userInput,
                            images: uploadedImages.map(img => img.data)
                        });
                        
                        chatHistory.push({
                            role: 'assistant',
                            content: response
                        });
                        
                        // 限制历史记录长度防止太长
                        if (chatHistory.length > 20) {
                            chatHistory = chatHistory.slice(chatHistory.length - 20);
                        }
                    });
                } else {
                    return addMessage('抱歉，我现在无法回答您的问题。请稍后再试。', 'bot');
                }
            })
            .catch(error => {
                console.error('OpenRouter API 调用失败:', error);
                
                // 隐藏加载中
                hideLoader(loaderId);
                
                // 添加错误消息
                addMessage(`抱歉，发生了错误: ${error.message || '无法获取回答'}。请稍后再试。`, 'bot');
            })
            .finally(() => {
                // 清空上传的图片
                clearImagePreviews();
            });
    }
    
    // Base64编码函数
    function base64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
    
    // 调用Gemini API
    async function callGeminiAPI(prompt, images = []) {
        try {
            // 构建消息数组
            const messages = [];
            
            // 如果有系统提示，添加系统提示
            if (aiSettings.systemPrompt) {
                let systemPrompt = aiSettings.systemPrompt;
                
                // 为Llama 3.1 Nemotron Ultra模型添加特殊的系统提示
                if (aiSettings.model === 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free') {
                    systemPrompt = "detailed thinking on\n" + systemPrompt;
                }
                
                messages.push({
                    role: "system",
                    content: systemPrompt
                });
            }
            
            // 添加历史消息
            for (const msg of chatHistory) {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            }
            
            // 构建用户消息内容
            let userContent = prompt;
            
            // 如果有图片，使用OpenRouter的多模态格式
            if (images && images.length > 0) {
                const contentParts = [{ type: "text", text: prompt }];
                
                // 添加所有图片
                for (const image of images) {
                    contentParts.push({
                        type: "image_url",
                        image_url: {
                            url: image.data
                        }
                    });
                }
                
                // 创建多模态消息
                messages.push({
                    role: "user",
                    content: contentParts
                });
            } else {
                // 纯文本消息
                messages.push({
                    role: "user",
                    content: userContent
                });
            }
            
            // 构建请求参数
            const requestBody = {
                model: aiSettings.model,
                messages: messages,
                temperature: aiSettings.temperature,
                max_tokens: aiSettings.maxOutputTokens,
                stream: false
            };
            
            // 对中文进行Base64编码
            const encodedTitle = base64Encode('小火苗AI助手');
            
            // 发送请求
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEYS[aiSettings.model] || API_KEYS['deepseek/deepseek-r1:free']}`,
                    'HTTP-Referer': window.location.href, 
                    'X-Title': encodedTitle // 使用Base64编码后的值
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('OpenRouter API 返回错误:', data.error);
                throw new Error(data.error.message || '未知错误');
            }
            
            console.log('API响应:', data); // 调试用
            
            // 从OpenRouter响应中提取内容
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                return data.choices[0].message.content;
            }
            
            return null;
        } catch (error) {
            console.error('调用API时出错:', error);
            throw error;
        }
    }
    
    // 添加图片消息
    function addImageMessages(images, type) {
        for (const image of images) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `flame-message-item flame-message-${type}`;
            
            const img = document.createElement('img');
            img.src = image.data;
            img.alt = image.filename;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '5px';
            
            messageDiv.appendChild(img);
            flameChatMessages.appendChild(messageDiv);
        }
        
        // 滚动到底部
        flameChatMessages.scrollTop = flameChatMessages.scrollHeight;
    }
    
    // 显示加载中动画
    function showLoader() {
        const loaderId = 'flame-chat-loader-' + Date.now();
        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'flame-message-item flame-message-system';
        loaderDiv.id = loaderId;
        loaderDiv.style.display = 'flex';
        loaderDiv.style.alignItems = 'center';
        loaderDiv.style.justifyContent = 'center';
        loaderDiv.style.gap = '4px';
        
        loaderDiv.innerHTML = `
            <div style="width: 8px; height: 8px; background: #999; border-radius: 50%; animation: bounce 1s infinite alternate;">
            </div>
            <div style="width: 8px; height: 8px; background: #999; border-radius: 50%; animation: bounce 1s infinite alternate; animation-delay: 0.2s;">
            </div>
            <div style="width: 8px; height: 8px; background: #999; border-radius: 50%; animation: bounce 1s infinite alternate; animation-delay: 0.4s;">
            </div>
            <style>
                @keyframes bounce {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-5px); }
                }
            </style>
        `;
        
        flameChatMessages.appendChild(loaderDiv);
        
        // 滚动到底部
        flameChatMessages.scrollTop = flameChatMessages.scrollHeight;
        
        return loaderId;
    }
    
    // 隐藏加载中动画
    function hideLoader(loaderId) {
        const loader = document.getElementById(loaderId);
        if (loader) {
            loader.remove();
        }
    }
    
    // 发送按钮点击事件
    flameChatSend.addEventListener('click', sendMessage);
    
    // Enter键发送消息
    flameChatInput.addEventListener('keydown', function(e) {
        // 按下Enter键且没有按下Shift键
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 语音输入功能
    const flameVoiceBtn = document.getElementById('flame-voice-btn');
    let isListening = false;
    let speechRecognition = null;
    let retryAttempted = false;
    
    // 检查浏览器是否支持语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'zh-CN'; // 设置为中文
        speechRecognition.maxAlternatives = 3; // 提供多个可能的识别结果
        
        // 创建语音输入的可视化反馈指示器
        const voiceFeedback = document.createElement('div');
        voiceFeedback.className = 'flame-voice-feedback';
        voiceFeedback.style.display = 'none';
        voiceFeedback.innerHTML = `
            <div class="flame-voice-indicator">
                <div class="flame-voice-bar"></div>
                <div class="flame-voice-bar"></div>
                <div class="flame-voice-bar"></div>
                <div class="flame-voice-bar"></div>
                <div class="flame-voice-bar"></div>
            </div>
            <div class="flame-voice-text">正在聆听...</div>
        `;
        document.body.appendChild(voiceFeedback);
        
        // 添加CSS样式
        const voiceFeedbackStyle = document.createElement('style');
        voiceFeedbackStyle.textContent = `
            .flame-voice-feedback {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 1001;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .flame-voice-indicator {
                display: flex;
                align-items: flex-end;
                height: 30px;
                margin-bottom: 10px;
            }
            .flame-voice-bar {
                width: 6px;
                height: 5px;
                margin: 0 2px;
                background: #FD5E53;
                border-radius: 3px;
                animation: voice-animation 0.8s infinite ease-in-out alternate;
            }
            .flame-voice-bar:nth-child(2) {
                animation-delay: 0.1s;
            }
            .flame-voice-bar:nth-child(3) {
                animation-delay: 0.2s;
            }
            .flame-voice-bar:nth-child(4) {
                animation-delay: 0.3s;
            }
            .flame-voice-bar:nth-child(5) {
                animation-delay: 0.4s;
            }
            @keyframes voice-animation {
                0% { height: 5px; }
                100% { height: 25px; }
            }
            .flame-voice-text {
                font-size: 14px;
            }
        `;
        document.head.appendChild(voiceFeedbackStyle);
        
        speechRecognition.onstart = function() {
            isListening = true;
            flameVoiceBtn.innerHTML = '<i class="fas fa-microphone-slash" style="color: #FD5E53;"></i>';
            flameVoiceBtn.title = "点击停止";
            
            // 显示语音输入反馈
            voiceFeedback.style.display = 'flex';
            
            // 添加系统消息
            addMessage('正在聆听...', 'system');
            
            // 使用AudioContext检测音量变化，增强视觉反馈
            try {
                if (!window.audioContext) {
                    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    window.analyser = audioContext.createAnalyser();
                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then(stream => {
                            window.microphone = audioContext.createMediaStreamSource(stream);
                            window.microphone.connect(window.analyser);
                            window.analyser.fftSize = 256;
                            const bufferLength = window.analyser.frequencyBinCount;
                            const dataArray = new Uint8Array(bufferLength);
                            
                            // 更新音量指示器
                            function updateVoiceIndicator() {
                                if (isListening) {
                                    window.analyser.getByteFrequencyData(dataArray);
                                    let sum = 0;
                                    for(let i = 0; i < bufferLength; i++) {
                                        sum += dataArray[i];
                                    }
                                    const average = sum / bufferLength;
                                    const bars = document.querySelectorAll('.flame-voice-bar');
                                    const intensity = Math.min(average / 128, 1);
                                    
                                    bars.forEach(bar => {
                                        bar.style.animationDuration = (1 - intensity * 0.7) + 's';
                                    });
                                    
                                    requestAnimationFrame(updateVoiceIndicator);
                                }
                            }
                            updateVoiceIndicator();
                        })
                        .catch(err => console.error('获取麦克风权限失败:', err));
                }
            } catch (e) {
                console.error('无法初始化音频分析:', e);
            }
        };
        
        speechRecognition.onend = function() {
            isListening = false;
            flameVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            flameVoiceBtn.title = "语音输入";
            
            // 隐藏语音输入反馈
            voiceFeedback.style.display = 'none';
         };
         
         speechRecognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';
            
            // 分析所有的识别结果，找出最准确的
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    // 获取最佳结果
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    // 显示临时结果
                    interimTranscript += event.results[i][0].transcript;
                    
                    // 更新可视化指示器中的文本
                    const voiceText = document.querySelector('.flame-voice-text');
                    if (voiceText) {
                        voiceText.textContent = interimTranscript || '正在聆听...';
                    }
                }
            }
            
            if (finalTranscript) {
                // 隐藏语音输入反馈
                voiceFeedback.style.display = 'none';
                
                // 设置输入框内容
                flameChatInput.value = finalTranscript;
                flameChatInput.dispatchEvent(new Event('input')); // 触发输入事件以更新发送按钮状态
                
                // 自动发送消息（如果需要）
                if (document.getElementById('flame-auto-send-voice')?.checked) {
                    setTimeout(() => sendMessage(), 300);
                }
            }
         };
        
        speechRecognition.onerror = function(event) {
            isListening = false;
            flameVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            flameVoiceBtn.title = "语音输入";
            console.error('语音识别错误:', event.error);
            
            // 更友好地处理错误
            let errorMessage = '';
            switch(event.error) {
                case 'no-speech':
                    errorMessage = '没有检测到语音，请确保麦克风正常并对着麦克风说话';
                    break;
                case 'audio-capture':
                    errorMessage = '无法捕获音频，请检查麦克风是否正常连接';
                    break;
                case 'not-allowed':
                    errorMessage = '麦克风权限被拒绝，请在浏览器设置中允许使用麦克风';
                    break;
                case 'network':
                    errorMessage = '网络错误导致语音识别失败';
                    break;
                case 'aborted':
                    return; // 用户手动停止，不显示错误
                default:
                    errorMessage = `语音识别失败: ${event.error}`;
            }
            
            // 添加错误消息
            addMessage(errorMessage, 'system');
            
            // 自动重试 (仅限no-speech错误)
            if (event.error === 'no-speech' && !retryAttempted) {
                retryAttempted = true;
                setTimeout(() => {
                    addMessage('正在重新尝试语音识别...', 'system');
                    setTimeout(() => {
                        retryAttempted = false;
                        speechRecognition.start();
                    }, 1000);
                }, 500);
            }
        };
        
        // 语音按钮点击事件
        flameVoiceBtn.addEventListener('click', function() {
            if (isListening) {
                speechRecognition.stop();
            } else {
                speechRecognition.start();
            }
        });
    } else {
        // 浏览器不支持语音识别
        flameVoiceBtn.style.opacity = '0.5';
        flameVoiceBtn.style.cursor = 'not-allowed';
        flameVoiceBtn.title = "您的浏览器不支持语音识别";
    }
    
    // 语音合成功能
    const speechSynthesis = window.speechSynthesis;
    let isSpeaking = false;
    
    // 添加AI消息后自动朗读
    const originalAddMessage = addMessage;
    addMessage = function(text, type) {
        const result = originalAddMessage(text, type);
        
        // 如果是AI回复，自动朗读
        if (type === 'bot' && speechSynthesis) {
            speakText(text);
        }
        
        return result;
    };
    
    // 朗读文本函数
    function speakText(text) {
        // 如果正在朗读，先停止
        if (isSpeaking) {
            speechSynthesis.cancel();
        }
        
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN'; // 设置为中文
        utterance.rate = 1.0; // 语速
        utterance.pitch = 1.0; // 音调
        
        // 获取可用的声音列表，选择中文女声(如果有)
        speechSynthesis.onvoiceschanged = () => {
            const voices = speechSynthesis.getVoices();
            const chineseVoice = voices.find(voice => 
                voice.lang.includes('zh') && voice.name.includes('Female')
            );
            
            if (chineseVoice) {
                utterance.voice = chineseVoice;
            }
        };
        
        // 语音开始和结束事件
        utterance.onstart = function() {
            isSpeaking = true;
        };
        
        utterance.onend = function() {
            isSpeaking = false;
        };
        
        utterance.onerror = function(event) {
            console.error('语音合成错误:', event);
            isSpeaking = false;
        };
        
        // 开始朗读
        speechSynthesis.speak(utterance);
    }
    
    // 在设置面板添加语音开关选项
    const settingsPanelHtml = document.getElementById('flame-settings-panel');
    
    // 创建分隔线
    const dividerElement = document.createElement('div');
    dividerElement.style.height = '1px';
    dividerElement.style.background = '#e0e0e0';
    dividerElement.style.margin = '15px 0';
    
    // 创建语音设置标题
    const voiceSettingsTitle = document.createElement('div');
    voiceSettingsTitle.className = 'flame-settings-title';
    voiceSettingsTitle.textContent = '语音设置';
    voiceSettingsTitle.style.fontSize = '14px';
    voiceSettingsTitle.style.marginBottom = '10px';
    
    // 创建语音开关选项
    const voiceToggleOption = document.createElement('div');
    voiceToggleOption.className = 'flame-settings-option';
    voiceToggleOption.innerHTML = `
        <label style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            自动朗读回复
            <input type="checkbox" id="flame-voice-toggle" checked style="width: 16px; height: 16px;">
        </label>
    `;
    
    // 创建自动发送语音识别结果的选项
    const autoSendVoiceOption = document.createElement('div');
    autoSendVoiceOption.className = 'flame-settings-option';
    autoSendVoiceOption.innerHTML = `
        <label style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            自动发送语音识别结果
            <input type="checkbox" id="flame-auto-send-voice" checked style="width: 16px; height: 16px;">
        </label>
    `;
    
    // 将选项添加到设置面板
    settingsPanelHtml.insertBefore(dividerElement, document.getElementById('flame-settings-save').parentNode);
    settingsPanelHtml.insertBefore(voiceSettingsTitle, document.getElementById('flame-settings-save').parentNode);
    settingsPanelHtml.insertBefore(voiceToggleOption, document.getElementById('flame-settings-save').parentNode);
    settingsPanelHtml.insertBefore(autoSendVoiceOption, document.getElementById('flame-settings-save').parentNode);
    
    // 语音开关事件
    const voiceToggle = document.getElementById('flame-voice-toggle');
    voiceToggle.addEventListener('change', function() {
        if (!this.checked && isSpeaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        }
    });
    
    // 修改朗读函数，检查开关状态
    const originalSpeakText = speakText;
    speakText = function(text) {
        if (voiceToggle.checked) {
            originalSpeakText(text);
        }
    };
}); 