document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const modelSelect = document.getElementById('self-learning-model-select');
    const chatMessages = document.getElementById('self-learning-messages');
    const chatInput = document.getElementById('self-learning-input');
    const sendBtn = document.getElementById('self-learning-send-btn');
    const uploadBtn = document.getElementById('self-learning-upload-btn');
    const fileInput = document.getElementById('self-learning-file-input');
    const voiceBtn = document.getElementById('self-learning-voice-btn');
    const imagePreview = document.getElementById('self-learning-image-preview');

    // 存储上传的图片
    let uploadedImages = [];

    // 语音识别相关变量
    let isListening = false;
    let speechRecognition = null;

    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'zh-CN';
        speechRecognition.maxAlternatives = 3;

        // 创建语音输入反馈元素
        const voiceFeedback = document.createElement('div');
        voiceFeedback.className = 'voice-feedback';
        voiceFeedback.innerHTML = `
            <div class="voice-indicator">
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
            </div>
            <div class="voice-text">正在聆听...</div>
        `;
        document.body.appendChild(voiceFeedback);

        // 语音识别事件处理
        speechRecognition.onstart = function() {
            isListening = true;
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash" style="color: #FD5E53;"></i>';
            voiceBtn.title = "点击停止";
            voiceFeedback.style.display = 'flex';
            addMessage('正在聆听...', 'system');
        };

        speechRecognition.onend = function() {
            isListening = false;
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.title = "语音输入";
            voiceFeedback.style.display = 'none';
        };

        speechRecognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                    const voiceText = document.querySelector('.voice-text');
                    if (voiceText) {
                        voiceText.textContent = interimTranscript || '正在聆听...';
                    }
                }
            }

            if (finalTranscript) {
                voiceFeedback.style.display = 'none';
                chatInput.value = finalTranscript;
                chatInput.dispatchEvent(new Event('input'));
            }
        };

        speechRecognition.onerror = function(event) {
            isListening = false;
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.title = "语音输入";
            console.error('语音识别错误:', event.error);
            
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
                default:
                    errorMessage = `语音识别失败: ${event.error}`;
            }
            
            addMessage(errorMessage, 'system');
        };
    } else {
        voiceBtn.style.opacity = '0.5';
        voiceBtn.style.cursor = 'not-allowed';
        voiceBtn.title = "您的浏览器不支持语音识别";
    }

    // 语音按钮点击事件
    voiceBtn.addEventListener('click', function() {
        if (!speechRecognition) return;
        
        if (isListening) {
            speechRecognition.stop();
        } else {
            speechRecognition.start();
        }
    });

    // 发送消息函数
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message && uploadedImages.length === 0) return;

        // 添加用户消息
        addMessage(message, 'user');

        // 如果有图片，显示图片预览
        if (uploadedImages.length > 0) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'message user';
            uploadedImages.forEach(image => {
                const img = document.createElement('img');
                img.src = image.data;
                img.alt = image.filename;
                imageContainer.appendChild(img);
            });
            chatMessages.appendChild(imageContainer);
        }

        // 清空输入框和图片预览
        chatInput.value = '';
        clearImagePreviews();

        // 获取选中的模型
        const selectedModel = modelSelect.value;

        // 模拟AI响应
        setTimeout(() => {
            const response = getAssistantResponse(message, selectedModel);
            addMessage(response, 'bot');
        }, 1000);
    }

    // 添加消息到聊天界面
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 获取AI助手响应
    function getAssistantResponse(message, model) {
        // 这里可以根据不同的模型返回不同的响应
        const responses = {
            'deepseek/deepseek-r1:free': '我是DeepSeek R1模型，很高兴为您服务！',
            'qwen/qwen3-32b:free': '我是通义千问3.0模型，有什么可以帮您？',
            'nvidia/llama-3.1-nemotron-ultra-253b-v1:free': '我是Llama 3.1 Nemotron Ultra模型，让我来帮助您！',
            'google/gemini-2.5-pro-exp-03-25': '我是Gemini 2.5 Pro模型，很高兴为您服务！'
        };

        return responses[model] || '我理解您的问题了，让我来帮助您解答。';
    }

    // 处理图片上传
    fileInput.addEventListener('change', function(e) {
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

    // 添加图片预览
    function addImagePreview(imageData, filename) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = filename;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = function() {
            imageItem.remove();
            const index = uploadedImages.findIndex(img => img.data === imageData);
            if (index !== -1) {
                uploadedImages.splice(index, 1);
            }
            if (imagePreview.children.length === 0) {
                imagePreview.style.display = 'none';
            }
        };
        
        imageItem.appendChild(img);
        imageItem.appendChild(removeBtn);
        imagePreview.appendChild(imageItem);
        imagePreview.style.display = 'flex';
        
        uploadedImages.push({
            data: imageData,
            filename: filename
        });
    }

    // 清空图片预览
    function clearImagePreviews() {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
        uploadedImages = [];
    }

    // 发送按钮点击事件
    sendBtn.addEventListener('click', sendMessage);

    // 输入框回车发送
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 输入框内容变化时更新发送按钮状态
    chatInput.addEventListener('input', function() {
        sendBtn.disabled = !this.value.trim() && uploadedImages.length === 0;
    });
});