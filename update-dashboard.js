// 更新仪表盘功能
document.addEventListener("DOMContentLoaded", function() {
    // 系统学习导航点击事件
    const studyNavItems = document.querySelectorAll(".nav-item");
    studyNavItems.forEach(item => {
        const spanElement = item.querySelector("span");
        if (spanElement && spanElement.textContent === "系统学习") {
            item.addEventListener("click", function() {
                // 移除所有菜单项的active类
                studyNavItems.forEach(nav => nav.classList.remove("active"));
                
                // 给当前点击的菜单项添加active类
                this.classList.add("active");
                
                // 检查是否已引入study-module.js
                if (typeof window.showStudyModule === "function") {
                    window.showStudyModule();
                } else {
                    console.error("系统学习模块未正确加载");
                    if (typeof window.showNotification === "function") {
                        window.showNotification("系统学习模块加载失败，请稍后再试", "info");
                    } else {
                        alert("系统学习模块加载失败，请稍后再试");
                    }
                }
            });
        }
    });
}); 