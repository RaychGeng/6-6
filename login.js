// 等待DOM内容加载完毕
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画
    AOS.init({
        duration: 800,
        once: false,
        mirror: true,
        offset: 120,
        easing: 'ease-in-out-cubic'
    });

    // 设置当前页面的导航链接为活动状态
    setActiveNavLink();

    // 初始化动漫效果和粒子
    initAnimeEffects();
    initParticles();

    // 初始化Hero轮播
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        effect: 'fade',
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });

    // 初始化用户反馈轮播
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 50
            }
        },
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    activeSlide.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        activeSlide.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        }
    });

    // 登录和注册按钮事件监听
    const loginBtns = document.querySelectorAll('.btn-login');
    const signupBtns = document.querySelectorAll('.btn-signup');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // 密码显示/隐藏切换
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputField = this.previousElementSibling;
            
            if (inputField.type === 'password') {
                inputField.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                inputField.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
    
    // 按钮点击动画
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // 立即体验按钮点击事件
    const experienceButtons = document.querySelectorAll('.btn-primary, .anime-btn');
    experienceButtons.forEach(button => {
        button.addEventListener('click', function() {
            signupModal.style.display = 'flex';
            // 添加科幻风格动画效果
            createAnimePortalEffect();
        });
    });

    // 显示登录模态框
    if (loginBtns && loginBtns.length > 0) {
        loginBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (loginModal) {
                    console.log('登录按钮被点击');
                    loginModal.style.display = 'flex';
                    // 添加科幻风格动画效果
                    createAnimePortalEffect();
                    // 添加进入动画
                    animateModalEntry(loginModal.querySelector('.modal-content'));
                }
            });
        });
    }

    // 显示注册模态框
    if (signupBtns && signupBtns.length > 0) {
        signupBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (signupModal) {
                    console.log('注册按钮被点击');
                    signupModal.style.display = 'flex';
                    // 添加科幻风格动画效果
                    createAnimePortalEffect();
                    // 添加进入动画
                    animateModalEntry(signupModal.querySelector('.modal-content'));
                }
            });
        });
    }

    // 关闭模态框
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                // 添加退出动画
                const modalContent = modal.querySelector('.modal-content');
                animateModalExit(modalContent, function() {
                    modal.style.display = 'none';
                });
            }
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            const modalContent = loginModal.querySelector('.modal-content');
            animateModalExit(modalContent, function() {
                loginModal.style.display = 'none';
            });
        }
        if (event.target === signupModal) {
            const modalContent = signupModal.querySelector('.modal-content');
            animateModalExit(modalContent, function() {
                signupModal.style.display = 'none';
            });
        }
    });

    // 禁止模态框内部点击事件冒泡
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    // 登录表单提交事件处理
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            console.log('登录表单提交', { email, password, rememberMe });
            
            // 这里可以添加实际的登录验证逻辑
            // 模拟登录成功
            const loginSuccess = true;
            
            if (loginSuccess) {
                // 显示登录成功消息
                document.getElementById('login-success').style.display = 'block';
                document.getElementById('login-error').style.display = 'none';
                
                // 添加登录成功动画
                createLevelUpEffect('登录成功');
                
                // 2秒后跳转到dashboard.html页面
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                // 显示登录失败消息
                document.getElementById('login-error').style.display = 'block';
                document.getElementById('login-success').style.display = 'none';
            }
        });
    }

    // 注册表单提交事件处理
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nickname = document.getElementById('signup-nickname').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            console.log('注册表单提交', { nickname, email, phone, password });
            
            // 验证两次密码是否一致
            if (password !== confirmPassword) {
                document.getElementById('signup-error').textContent = '两次输入的密码不一致，请重新输入！';
                document.getElementById('signup-error').style.display = 'block';
                document.getElementById('signup-success').style.display = 'none';
                return;
            }
            
            // 这里可以添加实际的注册逻辑
            // 模拟注册成功
            const signupSuccess = true;
            
            if (signupSuccess) {
                // 显示注册成功消息
                document.getElementById('signup-success').style.display = 'block';
                document.getElementById('signup-error').style.display = 'none';
                
                // 添加注册成功动画
                createLevelUpEffect('注册成功');
                
                // 2秒后跳转到dashboard.html页面
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                // 显示注册失败消息
                document.getElementById('signup-error').style.display = 'block';
                document.getElementById('signup-success').style.display = 'none';
            }
        });
    }

    // 社交登录按钮点击事件
    const socialLoginButtons = document.querySelectorAll('.btn-social');
    socialLoginButtons.forEach(button => {
        button.addEventListener('click', function() {
            const loginType = this.classList.contains('google') ? 'Google' : '微信';
            console.log(`使用${loginType}登录`);
            
            // 这里可以添加实际的社交登录逻辑
            // 模拟社交登录成功
            createLevelUpEffect(`${loginType}登录成功`);
            
            // 2秒后跳转到dashboard.html页面
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 5px 20px rgba(0, 37, 120, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 37, 120, 0.1)';
        }

        // 添加视差滚动效果
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // 视差滚动效果
            const scrollY = window.scrollY;
            const bgElements = document.querySelectorAll('.decoration-element');
            bgElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
            
            // 让动漫角色也有视差效果
            const animeCharacter = document.querySelector('.anime-character');
            if (animeCharacter) {
                animeCharacter.style.transform = `translateY(${scrollY * 0.05}px)`;
            }
        }
    });
    
    // 社交媒体链接追踪
    document.querySelectorAll('.social-icons a').forEach(socialLink => {
        socialLink.addEventListener('click', function(event) {
            // 这里可以添加链接点击追踪代码，例如Google Analytics
            console.log('社交媒体链接点击:', this.href);
        });
    });

    // 给特色卡片添加动漫风格浮动效果
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标在元素内的x坐标
            const y = e.clientY - rect.top; // 鼠标在元素内的y坐标
            
            // 计算旋转角度
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15; // 垂直方向的旋转
            const rotateY = (centerX - x) / 15; // 水平方向的旋转
            
            // 应用3D效果
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // 添加光影效果
            const glowStrength = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 5;
            card.style.boxShadow = `0 10px 30px rgba(255, 107, 53, 0.15), 
                                   ${(x - centerX) / 10}px ${(y - centerY) / 10}px 
                                   ${glowStrength}px rgba(255, 107, 53, 0.3)`;
        });
        
        card.addEventListener('mouseleave', function() {
            // 恢复原状
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 37, 120, 0.1)';
            card.style.transition = 'all 0.5s ease';
        });
    });
});

// 登录和注册功能代码
document.addEventListener('DOMContentLoaded', function() {
    // 登录和注册按钮事件监听
    const loginBtns = document.querySelectorAll('.btn-login');
    const signupBtns = document.querySelectorAll('.btn-signup');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // 密码显示/隐藏切换
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputField = this.previousElementSibling;
            
            if (inputField.type === 'password') {
                inputField.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                inputField.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
    
    // 显示登录模态框
    if (loginBtns && loginBtns.length > 0) {
        loginBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (loginModal) {
                    console.log('登录按钮被点击');
                    loginModal.style.display = 'flex';
                    // 添加科幻风格动画效果
                    createAnimePortalEffect();
                    // 添加进入动画
                    animateModalEntry(loginModal.querySelector('.modal-content'));
                }
            });
        });
    }

    // 显示注册模态框
    if (signupBtns && signupBtns.length > 0) {
        signupBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (signupModal) {
                    console.log('注册按钮被点击');
                    signupModal.style.display = 'flex';
                    // 添加科幻风格动画效果
                    createAnimePortalEffect();
                    // 添加进入动画
                    animateModalEntry(signupModal.querySelector('.modal-content'));
                }
            });
        });
    }

    // 关闭模态框
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                // 添加退出动画
                const modalContent = modal.querySelector('.modal-content');
                animateModalExit(modalContent, function() {
                    modal.style.display = 'none';
                });
            }
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            const modalContent = loginModal.querySelector('.modal-content');
            animateModalExit(modalContent, function() {
                loginModal.style.display = 'none';
            });
        }
        if (event.target === signupModal) {
            const modalContent = signupModal.querySelector('.modal-content');
            animateModalExit(modalContent, function() {
                signupModal.style.display = 'none';
            });
        }
    });

    // 禁止模态框内部点击事件冒泡
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    // 表单提交处理
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // 这里只是示例，实际应该连接到后端进行验证
            console.log('登录信息:', { email, password });
            
            // 模拟登录成功
            document.getElementById('login-success').style.display = 'block';
            
            // 添加退出动画然后关闭模态框
            setTimeout(() => {
                const modalContent = loginModal.querySelector('.modal-content');
                animateModalExit(modalContent, function() {
                    loginModal.style.display = 'none';
                    // 重置表单和成功信息
                    document.getElementById('login-success').style.display = 'none';
                    loginForm.reset();
                });
            }, 1500);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nickname = document.getElementById('signup-nickname').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // 这里只是示例，实际应该连接到后端进行验证和存储
            console.log('注册信息:', { nickname, email, phone, password, confirmPassword });
            
            // 模拟注册成功
            document.getElementById('signup-success').style.display = 'block';
            
            // 添加退出动画然后关闭模态框
            setTimeout(() => {
                const modalContent = signupModal.querySelector('.modal-content');
                animateModalExit(modalContent, function() {
                    signupModal.style.display = 'none';
                    // 重置表单和成功信息
                    document.getElementById('signup-success').style.display = 'none';
                    signupForm.reset();
                });
            }, 1500);
        });
    }
});

// 模态框入场动画函数
function animateModalEntry(modalContent) {
    if (modalContent) {
        modalContent.style.animation = 'none';
        setTimeout(() => {
            modalContent.style.animation = 'modalFadeIn 0.5s ease forwards';
        }, 10);
    }
}

// 模态框退出动画函数
function animateModalExit(modalContent, callback) {
    if (modalContent) {
        modalContent.style.animation = 'none';
        setTimeout(() => {
            modalContent.style.animation = 'modalFadeIn 0.5s ease forwards reverse';
            setTimeout(() => {
                if (callback) callback();
            }, 450);
        }, 10);
    } else {
        if (callback) callback();
    }
}

// 初始化动漫效果
function initAnimeEffects() {
    // 添加动漫效果样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0%, 100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
            50% {
                opacity: 0.6;
                transform: scale(1.2) rotate(180deg);
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        @keyframes levelUp {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                transform: scale(1.2);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        @keyframes portal-rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 创建随机漂浮气泡
    createFloatingElements();
}

// 创建动漫风格漂浮元素
function createFloatingElements() {
    const container = document.querySelector('.features');
    if (!container) return;
    
    const elementsCount = 8;
    const emojis = ['✨', '⭐', '🌟', '💫', '🔥', '✨', '💻', '🚀'];
    
    for (let i = 0; i < elementsCount; i++) {
        const element = document.createElement('div');
        element.className = 'floating-emoji';
        element.textContent = emojis[i % emojis.length];
        element.style.position = 'absolute';
        element.style.fontSize = `${20 + Math.random() * 20}px`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.opacity = '0.3';
        element.style.color = `hsl(${Math.random() * 30 + 15}, 80%, 60%)`;
        element.style.zIndex = '1';
        element.style.pointerEvents = 'none';
        
        // 设置动画
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(element);
    }
}

// 创建动漫风格传送门效果
function createAnimePortalEffect() {
    const container = document.createElement('div');
    container.className = 'anime-portal-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9998';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    document.body.appendChild(container);
    
    // 创建传送门效果
    const portal = document.createElement('div');
    portal.className = 'anime-portal';
    portal.style.width = '220px';
    portal.style.height = '220px';
    portal.style.borderRadius = '50%';
    portal.style.background = 'linear-gradient(135deg, rgba(253, 94, 83, 0.8) 0%, rgba(255, 107, 53, 0.8) 100%)';
    portal.style.boxShadow = '0 0 40px rgba(253, 94, 83, 0.6), 0 0 80px rgba(255, 107, 53, 0.4)';
    portal.style.position = 'relative';
    portal.style.animation = 'portal-rotate 2s linear infinite';
    
    // 创建内圈
    const innerPortal = document.createElement('div');
    innerPortal.style.position = 'absolute';
    innerPortal.style.top = '50%';
    innerPortal.style.left = '50%';
    innerPortal.style.transform = 'translate(-50%, -50%)';
    innerPortal.style.width = '150px';
    innerPortal.style.height = '150px';
    innerPortal.style.borderRadius = '50%';
    innerPortal.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.8) 0%, rgba(255, 189, 105, 0.8) 100%)';
    innerPortal.style.animation = 'portal-rotate 1.5s linear infinite reverse';
    
    // 创建最内圈
    const corePortal = document.createElement('div');
    corePortal.style.position = 'absolute';
    corePortal.style.top = '50%';
    corePortal.style.left = '50%';
    corePortal.style.transform = 'translate(-50%, -50%)';
    corePortal.style.width = '80px';
    corePortal.style.height = '80px';
    corePortal.style.borderRadius = '50%';
    corePortal.style.background = 'white';
    corePortal.style.boxShadow = '0 0 25px white';
    
    innerPortal.appendChild(corePortal);
    portal.appendChild(innerPortal);
    container.appendChild(portal);
    
    // 创建闪光粒子
    for (let i = 0; i < 30; i++) {
        createPortalParticle(container);
    }
    
    // 2秒后移除效果
    setTimeout(() => {
        portal.style.transform = 'scale(1.5)';
        portal.style.opacity = '0';
        portal.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            document.body.removeChild(container);
        }, 800);
    }, 1500);
}

// 创建传送门粒子
function createPortalParticle(container) {
    const particle = document.createElement('div');
    
    // 随机角度和距离
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;
    const size = 3 + Math.random() * 5;
    
    // 计算起始和结束位置
    const startX = Math.cos(angle) * 50;
    const startY = Math.sin(angle) * 50;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = 'white';
    particle.style.borderRadius = '50%';
    particle.style.top = '50%';
    particle.style.left = '50%';
    particle.style.transform = `translate(-50%, -50%) translate(${startX}px, ${startY}px)`;
    particle.style.boxShadow = '0 0 10px white';
    
    // 设置动画
    const duration = 0.5 + Math.random() * 1.5;
    const delay = Math.random() * 2;
    
    particle.style.transition = `all ${duration}s ease-out ${delay}s`;
    
    container.appendChild(particle);
    
    // 触发动画
    setTimeout(() => {
        particle.style.transform = `translate(-50%, -50%) translate(${endX}px, ${endY}px)`;
        particle.style.opacity = '0';
    }, 10);
}

// 创建角色升级特效
function createLevelUpEffect(name) {
    const container = document.createElement('div');
    container.className = 'level-up-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9997';
    
    document.body.appendChild(container);
    
    // 创建光环效果
    const aura = document.createElement('div');
    aura.className = 'level-up-aura';
    aura.style.width = '200px';
    aura.style.height = '200px';
    aura.style.borderRadius = '50%';
    aura.style.background = 'radial-gradient(circle, rgba(255, 189, 105, 0.8) 0%, rgba(255, 107, 53, 0) 70%)';
    aura.style.position = 'absolute';
    aura.style.animation = 'levelUp 2s ease-out forwards';
    
    // 创建文本
    const levelText = document.createElement('div');
    levelText.className = 'level-up-text';
    levelText.textContent = `欢迎 ${name || '新同学'} 加入火花课堂！`;
    levelText.style.color = '#FF6B35';
    levelText.style.fontSize = '24px';
    levelText.style.fontWeight = 'bold';
    levelText.style.textShadow = '0 0 10px rgba(255, 107, 53, 0.7)';
    levelText.style.marginTop = '220px';
    levelText.style.opacity = '0';
    levelText.style.transform = 'translateY(20px)';
    levelText.style.transition = 'all 0.5s ease-out 0.5s';
    
    container.appendChild(aura);
    container.appendChild(levelText);
    
    // 创建升级特效粒子
    for (let i = 0; i < 30; i++) {
        createLevelUpParticle(container);
    }
    
    // 显示文字
    setTimeout(() => {
        levelText.style.opacity = '1';
        levelText.style.transform = 'translateY(0)';
    }, 100);
    
    // 3秒后移除效果
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            document.body.removeChild(container);
        }, 1000);
    }, 3000);
}

// 创建升级粒子
function createLevelUpParticle(container) {
    const particle = document.createElement('div');
    
    // 随机角度和速度
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    const size = 5 + Math.random() * 10;
    const duration = 1 + Math.random() * 2;
    
    // 随机颜色
    const colors = ['#FF6B35', '#FD5E53', '#FFBD69', '#3CAEA3'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
    
    // 设置初始位置和动画
    particle.style.top = '50%';
    particle.style.left = '50%';
    particle.style.transform = 'translate(-50%, -50%)';
    
    container.appendChild(particle);
    
    // 动画处理
    let startTime = null;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;
        
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const distance = speed * 100 * progress;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const opacity = 1 - progress;
            const scale = 1 - (progress * 0.5);
            
            particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
            particle.style.opacity = opacity.toString();
            
            requestAnimationFrame(animate);
        } else {
            container.removeChild(particle);
        }
    }
    
    requestAnimationFrame(animate);
}

// 初始化背景粒子效果
function initParticles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes digital-fall {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(${window.innerHeight + 200}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 创建背景粒子
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'absolute';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.overflow = 'hidden';
        particleContainer.style.pointerEvents = 'none';
        
        for (let i = 0; i < 50; i++) {
            createParticle(particleContainer);
        }
        
        heroSection.appendChild(particleContainer);
    }
}

// 创建单个粒子
function createParticle(container) {
    const particle = document.createElement('div');
    
    // 随机大小、位置和动画
    const size = 1 + Math.random() * 3;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const colors = [
        'rgba(255, 107, 53, 0.4)', 
        'rgba(253, 94, 83, 0.4)',
        'rgba(255, 189, 105, 0.4)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 20 + Math.random() * 40;
    const delay = Math.random() * 5;
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.top = `${y}%`;
    particle.style.left = `${x}%`;
    particle.style.opacity = 0.1 + Math.random() * 0.4;
    
    // 随机浮动动画
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    container.appendChild(particle);
}

// 显示动漫风格通知
function showAnimeNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'anime-notification';
    
    // 创建图标
    const icon = document.createElement('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#4caf50';
    } else if (type === 'error') {
        icon.className = 'fas fa-times-circle';
        icon.style.color = '#f44336';
    } else {
        icon.className = 'fas fa-info-circle';
        icon.style.color = '#2196f3';
    }
    
    icon.style.marginRight = '10px';
    icon.style.fontSize = '18px';
    
    // 创建消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 组合通知
    notification.appendChild(icon);
    notification.appendChild(text);
    
    // 样式设置
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%) translateY(-100px)';
    notification.style.padding = '12px 24px';
    notification.style.background = 'white';
    notification.style.color = '#333';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.fontWeight = '500';
    notification.style.borderLeft = type === 'success' ? '4px solid #4caf50' : 
                                    type === 'error' ? '4px solid #f44336' : 
                                    '4px solid #2196f3';
    notification.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // 添加闪光效果
    notification.style.overflow = 'hidden';
    const shine = document.createElement('div');
    shine.style.position = 'absolute';
    shine.style.top = '0';
    shine.style.left = '-100%';
    shine.style.width = '50%';
    shine.style.height = '100%';
    shine.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)';
    shine.style.transform = 'skewX(-15deg)';
    shine.style.animation = 'shine 2s ease-in-out infinite';
    notification.appendChild(shine);
    
    // 添加动漫风格小图标
    const animeIcon = document.createElement('div');
    animeIcon.style.position = 'absolute';
    animeIcon.style.top = '-15px';
    animeIcon.style.right = '-15px';
    animeIcon.style.width = '30px';
    animeIcon.style.height = '30px';
    animeIcon.style.background = 'white';
    animeIcon.style.borderRadius = '50%';
    animeIcon.style.display = 'flex';
    animeIcon.style.alignItems = 'center';
    animeIcon.style.justifyContent = 'center';
    animeIcon.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    animeIcon.innerHTML = type === 'success' ? '🔥' : 
                         type === 'error' ? '💢' : 
                         '💭';
    animeIcon.style.fontSize = '16px';
    notification.appendChild(animeIcon);
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
        
        // 添加闪光动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shine {
                0% {
                    left: -100%;
                }
                20% {
                    left: 100%;
                }
                100% {
                    left: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// 设置当前页面的导航链接为活动状态
function setActiveNavLink() {
    // 获取当前页面的URL路径
    const currentPath = window.location.pathname;
    // 获取当前页面的文件名
    const currentPage = currentPath.split('/').pop();
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 遍历所有导航链接
    navLinks.forEach(link => {
        // 获取链接的href属性
        const href = link.getAttribute('href');
        
        // 如果链接href与当前页面文件名匹配，则添加active类
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            // 如果当前是主页（URL可能没有显示文件名）
            link.classList.add('active');
        } else {
            // 否则移除active类
            link.classList.remove('active');
        }
    });
}