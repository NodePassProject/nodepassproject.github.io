document.addEventListener('DOMContentLoaded', () => {
    [
        initParticles,           // 初始化背景粒子效果
        initScrollAnimations,    // 初始化滚动动画
        initCardHover,           // 初始化卡片悬停效果
        initNavbar,              // 初始化导航栏交互
        initSmoothScroll,        // 初始化平滑滚动
        initTerminalTyping,      // 初始化终端打字动画
        initMobileMenu,          // 初始化移动端菜单
        initLanguageToggle,      // 初始化语言切换功能
        initArchitectureDiagram  // 初始化架构图交互
    ].forEach(fn => fn());
});

/**
 * 初始化背景粒子效果
 * 使用particles.js库创建动态粒子背景
 */
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#6875F5" },
            shape: {
                type: "circle",
                stroke: { width: 0 }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6875F5",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    });
}

/**
 * 初始化页面滚动动画
 * 使用GSAP库为元素添加滚动时的入场动画
 */
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    /**
     * 创建滚动动画的助手函数
     * @param {string} selector - 要添加动画的元素选择器
     * @param {number} stagger - 元素间的动画延迟时间
     */
    const createScrollAnimation = (selector, stagger = 0) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            // 检查是否有自定义延迟设置
            const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : index * stagger;
            
            // 应用GSAP动画
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    delay: delay,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    };
    
    // 为不同区域的元素应用动画
    createScrollAnimation('.feature-card', 0.2);
    createScrollAnimation('.demo-title');
    createScrollAnimation('.resources-title');
    createScrollAnimation('.resources-links');
    createScrollAnimation('.download-section');
}

/**
 * 初始化卡片悬停3D效果
 * 根据鼠标位置创建卡片的3D透视效果
 */
function initCardHover() {
    document.querySelectorAll('.card-3d').forEach(card => {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
        
            // 计算鼠标位置相对于卡片中心的位置
            const midCardWidth = rect.width / 2;
            const midCardHeight = rect.height / 2;
            
            // 根据鼠标位置计算倾斜角度
            const angleY = -(((x - midCardWidth) / midCardWidth) * 10);
            const angleX = ((y - midCardHeight) / midCardHeight) * 10;
            
            // 应用3D旋转变换
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        };
        
        // 添加鼠标事件监听器
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', () => {
            // 鼠标离开时重置卡片角度
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * 初始化导航栏滚动效果
 * 当页面滚动时改变导航栏样式
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // 滚动超过50px时添加'scrolled'类
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/**
 * 初始化平滑滚动效果
 * 使锚点链接点击时实现平滑滚动到目标位置
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 如果移动菜单打开，点击时关闭它
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('block')) {
                mobileMenu.classList.replace('block', 'hidden');
            }
            
            // 获取目标元素
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // 使用GSAP平滑滚动到目标位置
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80  // 顶部偏移，考虑固定导航栏高度
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
}

/**
 * 初始化终端打字效果
 * 模拟终端命令行的逐字输入效果
 */
function initTerminalTyping() {
    const terminalText = document.getElementById('terminal-text');
    if (!terminalText) return;
    
    // 保存原始文本并清空
    const text = terminalText.textContent;
    terminalText.textContent = '';
    
    let i = 0;
    let isTagOpen = false; // 标记是否在HTML标签内
    
    /**
     * 实现打字效果的递归函数
     */
    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            
            // 处理HTML标签
            if (char === '<') isTagOpen = true;
            if (char === '>') isTagOpen = false;
            
            if (isTagOpen) {
                // 如果在标签内，一次性添加整个标签内容
                while (i < text.length && text.charAt(i) !== '>') {
                    terminalText.innerHTML += text.charAt(i);
                    i++;
                }
                if (i < text.length) {
                    terminalText.innerHTML += text.charAt(i);
                    i++;
                }
                requestAnimationFrame(typeWriter);
            } else {
                // 普通文本则逐字添加
                terminalText.innerHTML += char;
                i++;
                
                // 根据字符类型动态调整打字速度
                let speed = 20;
                if (char === '#' || char === '$' || char === '\n') {
                    speed = 100 + Math.random() * 100; // 命令提示符或换行处暂停时间更长
                } else {
                    speed = 10 + Math.random() * 30; // 普通字符的速度随机变化
                }
                
                setTimeout(typeWriter, speed);
            }
        }
    }
    
    // 使用Intersection Observer, 当终端进入视图时开始动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target); // 动画开始后停止观察
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(terminalText.parentElement.parentElement);
}

/**
 * 初始化移动端菜单
 * 控制移动设备上的折叠菜单
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // 切换菜单可见性
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * 初始化语言切换功能
 * 支持英文和中文界面切换
 */
function initLanguageToggle() {
    // 不同语言的界面文本
    const translations = {
        'en': {
            'features': 'Features',
            'architecture': 'Architecture',
            'documentation': 'Documentation',
            'repository': 'Repository',
            'subtitle': 'NodePass is a secure, efficient TCP/UDP tunneling solution that delivers fast, reliable access across network restrictions using pre-established TLS/TCP connections.',
            'github': 'GitHub Project',
            'learn-more': 'App Store',
            'features-title': 'Core Features',
            'feature1-title': 'High-Performance Tunnel',
            'feature1-desc': 'Lightweight tunnel implemented in Go, with extremely low latency and high throughput, supporting large-scale concurrent connections.',
            'feature2-title': 'Three-Layer Architecture',
            'feature2-desc': 'Innovative master, server, and client three-layer architecture, achieving flexible network topology and unified management.',
            'feature3-title': 'Multi-Protocol Support',
            'feature3-desc': 'Supports TCP and UDP protocols, meeting network requirements for different application scenarios, with flexible configuration options.',
            'feature4-title': 'Secure and Reliable',
            'feature4-desc': 'Built-in TLS encryption and authentication mechanisms ensure the security and integrity of data transmission, preventing unauthorized access.',
            'feature5-title': 'Easy Configuration',
            'feature5-desc': 'Simple command-line interface without configuration files, making deployment and management simple and efficient, suitable for users of all technical levels.',
            'feature6-title': 'Cross-Platform Compatible',
            'feature6-desc': 'Supports Linux, Windows, macOS, and other operating systems, can be seamlessly deployed and run in various environments.',
            'how-it-works': 'NodePass Architecture',
            'master-node-1': 'Master API',
            'master-node-2': 'Master API',
            'server-component': 'Server',
            'server-desc': 'Handles connections and protocol translation',
            'client-component': 'Client',
            'client-desc': 'Establishes and maintains tunnel connections',
            'connection-channels': 'Connection Channels',
            'data-flow': 'Data Transmission Flow',
            'data-flow-desc': 'NodePass establishes peer-to-peer bidirectional data flow between instances:',
            'control-channel': 'Control Channel',
            'control-channel-1': 'Unencrypted TCP connection for signaling',
            'control-channel-2': 'Persistent connection for tunnel lifetime',
            'control-channel-3': 'URL-based signaling protocol',
            'control-channel-4': 'Coordinates connection tunnel establishment',
            'data-channel': 'Data Channel',
            'data-channel-1': 'Configurable TLS encryption (3 modes)',
            'data-channel-2': 'Created on-demand for each connection',
            'data-channel-3': 'Efficient connection pooling system',
            'data-channel-4': 'Supports both TCP and UDP protocols',
            'security-features': 'Security Features',
            'security-mode-0': 'Mode 0',
            'security-mode-0-desc': 'Unencrypted data transfer (fastest, least secure)',
            'security-mode-1': 'Mode 1',
            'security-mode-1-desc': 'Self-signed certificate encryption (good security, no verification)',
            'security-mode-2': 'Mode 2',
            'security-mode-2-desc': 'Verified certificate encryption (highest security, requires valid certificates)',
            'architecture-benefit': 'This peer-to-peer architecture allows NodePass to flexibly adapt to various network environments, achieving efficient data transmission between endpoints with enhanced security and protocol translation.',
            'resources-title': 'Resources & Documentation',
            'doc1-title': 'Installation Guide',
            'doc1-desc': 'Detailed installation steps and system requirements to help you quickly deploy NodePass.',
            'doc2-title': 'API Documentation',
            'doc2-desc': 'Detailed description of Restful API for building custom applications and integrations.',
            'doc3-title': 'Configuration Guide',
            'doc3-desc': 'Comprehensive explanation of configuration options to help you customize NodePass according to your needs.',
            'doc4-title': 'Usage Examples',
            'doc4-desc': 'Common application scenario examples to help you quickly get started and apply to actual projects.',
            'doc5-title': 'Troubleshooting',
            'doc5-desc': 'FAQs and troubleshooting guide to solve problems you may encounter when using NodePass.',
            'doc6-title': 'GitHub Repository',
            'doc6-desc': 'Visit the GitHub repository to get the latest code, report issues, or contribute code.',
            'start-using': 'Start Using NodePass',
            'download-desc': 'Download and deploy NodePass now to experience an efficient and secure network tunnel solution.',
            'download-latest': 'Download Latest Version',
            'view-installation': 'View Installation Guide',
            'footer-desc': 'Universal TCP/UDP Tunneling Solution'
        },
        'zh': {
            'features': '特性',
            'architecture': '架构',
            'documentation': '文档',
            'repository': '仓库',
            'subtitle': '通用TCP/UDP隧道解决方案，免配置单文件多模式，采用控制数据双路分离架构，内置零延迟自适应连接池，实现跨网络限制的快速安全访问。',
            'github': 'GitHub项目',
            'learn-more': 'App Store',
            'features-title': '核心特性',
            'feature1-title': '高性能隧道',
            'feature1-desc': '使用Go语言实现的轻量级隧道，具有极低的延迟和高吞吐量，支持大规模并发连接。',
            'feature2-title': '三层架构',
            'feature2-desc': '创新的主控、服务端、客户端三层架构，实现灵活的网络拓扑和统一管理。',
            'feature3-title': '多协议支持',
            'feature3-desc': '支持TCP和UDP协议，满足不同应用场景的网络需求，具有灵活的配置选项。',
            'feature4-title': '安全可靠',
            'feature4-desc': '内置TLS加密和认证机制，确保数据传输的安全性和完整性，防止未授权访问。',
            'feature5-title': '易于配置',
            'feature5-desc': '简单的命令行界面无需配置文件，使部署和管理变得简单高效，适合各技术水平用户。',
            'feature6-title': '跨平台兼容',
            'feature6-desc': '支持Linux、Windows、macOS等操作系统，可以在各种环境中无缝部署和运行。',
            'how-it-works': 'NodePass架构',
            'master-node-1': '主控API',
            'master-node-2': '主控API',
            'server-component': '服务端',
            'server-desc': '处理传入连接和协议转换',
            'client-component': '客户端',
            'client-desc': '建立和维护隧道连接',
            'connection-channels': '连接通道',
            'data-flow': '数据传输流程',
            'data-flow-desc': 'NodePass在实例之间建立点对点双向数据流：',
            'control-channel': '控制通道',
            'control-channel-1': '用于信令的非加密TCP连接',
            'control-channel-2': '隧道生命周期内的持久连接',
            'control-channel-3': '基于URL的信令协议',
            'control-channel-4': '协调连接隧道建立',
            'data-channel': '数据通道',
            'data-channel-1': '可配置的TLS加密（3种模式）',
            'data-channel-2': '按需为每个连接创建',
            'data-channel-3': '高效的连接池系统',
            'data-channel-4': '同时支持TCP和UDP协议',
            'security-features': '安全特性',
            'security-mode-0': '模式 0',
            'security-mode-0-desc': '非加密数据传输（最快，安全性最低）',
            'security-mode-1': '模式 1',
            'security-mode-1-desc': '自签名证书加密（良好安全性，无验证）',
            'security-mode-2': '模式 2',
            'security-mode-2-desc': '已验证证书加密（最高安全性，需要有效证书）',
            'architecture-benefit': '这种点对点架构使NodePass能够灵活适应各种网络环境，通过增强的安全性和协议转换实现端点之间的高效数据传输。',
            'resources-title': '资源与文档',
            'doc1-title': '安装指南',
            'doc1-desc': '详细的安装步骤和系统要求，帮助您快速部署NodePass。',
            'doc2-title': 'API文档',
            'doc2-desc': '详细描述Restful API，用于构建自定义应用程序和集成。',
            'doc3-title': '配置指南',
            'doc3-desc': '全面解释配置选项，帮助您按需自定义NodePass行为。',
            'doc4-title': '使用示例',
            'doc4-desc': '常见应用场景用例，帮助您快速上手并应用到实际项目中。',
            'doc5-title': '故障排除',
            'doc5-desc': '常见问题和排查指南，解决NodePass使用时遇到的问题。',
            'doc6-title': 'GitHub仓库',
            'doc6-desc': '访问GitHub仓库获取最新代码、报告问题或贡献代码。',
            'start-using': '开始使用NodePass',
            'download-desc': '立即下载并部署NodePass，体验高效安全的网络隧道解决方案。',
            'download-latest': '下载最新版本',
            'view-installation': '查看安装指南',
            'footer-desc': '通用TCP/UDP隧道解决方案'
        }
    };
    
    // 从本地存储获取用户语言偏好，默认为英语
    let currentLang = localStorage.getItem('nodepass-lang') || 'en';
    if (!['en', 'zh'].includes(currentLang)) currentLang = 'en';
    
    /**
     * 应用语言翻译到页面元素
     * @param {string} lang - 语言代码 ('en' 或 'zh')
     * @returns {string} - 返回应用的语言代码
     */
    const applyTranslation = (lang) => {
        // 查找所有带有data-i18n属性的元素并翻译
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // 更新语言显示标签
        ['current-lang', 'mobile-current-lang'].forEach(id => {
            const langElem = document.getElementById(id);
            if (langElem) langElem.textContent = lang.toUpperCase();
        });
        
        // 更新多语言文档链接
        document.querySelectorAll('[data-langurl-en]').forEach(link => {
            const enUrl = link.getAttribute('data-langurl-en');
            const zhUrl = link.getAttribute('data-langurl-zh');
            link.setAttribute('href', lang === 'en' ? enUrl : zhUrl);
        });
        
        // 保存语言设置到本地存储
        localStorage.setItem('nodepass-lang', lang);
        
        return lang;
    };
    
    /**
     * 切换语言并应用翻译
     * @param {string} currentLang - 当前语言代码
     * @returns {string} - 切换后的语言代码
     */
    const toggleAndApplyLanguage = (currentLang) => {
        const newLang = currentLang === 'en' ? 'zh' : 'en';
        return applyTranslation(newLang);
    };
    
    // 初始应用当前语言
    applyTranslation(currentLang);
    
    // 添加语言切换按钮事件
    ['language-toggle', 'mobile-language-toggle'].forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.addEventListener('click', () => {
                currentLang = toggleAndApplyLanguage(currentLang);
            });
        }
    });
}

/**
 * 初始化架构图的交互效果
 * 绘制节点之间的连接线
 */
function initArchitectureDiagram() {
    const diagram = document.querySelector('.architecture-diagram');
    if (!diagram) return;
    
    // 初始化连接线
    drawConnectionLines();
    
    // 窗口大小变化时重新绘制连接线
    window.addEventListener('resize', debounce(drawConnectionLines, 250));
}

/**
 * 防抖函数 - 减少频繁触发的函数调用
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间(毫秒)
 * @returns {Function} - 返回防抖处理后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

/**
 * 绘制架构图中节点之间的连接线
 * 使用SVG创建动态连接线
 */
function drawConnectionLines() {
    const connectionLinesContainer = document.getElementById('connection-lines');
    if (!connectionLinesContainer) return;
    
    // 清空当前连接线
    connectionLinesContainer.innerHTML = '';
    
    // 获取需要连接的节点
    const masterTopNode = document.querySelector('.arch-layer[data-node-type="master-top"]');
    const masterBottomNode = document.querySelector('.arch-layer[data-node-type="master-bottom"]');
    
    if (!masterTopNode || !masterBottomNode) return;
    
    // 创建SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    
    const containerRect = connectionLinesContainer.getBoundingClientRect();
    
    /**
     * 获取元素相对于容器的位置信息
     * @param {Element} element - DOM元素
     * @returns {Object} - 元素位置信息
     */
    const getElementRect = (element) => {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top,
            width: rect.width,
            height: rect.height
        };
    };
    
    /**
     * 创建SVG路径连接两点
     * @param {number} startX - 起点X坐标
     * @param {number} startY - 起点Y坐标
     * @param {number} endX - 终点X坐标
     * @param {number} endY - 终点Y坐标
     * @param {number} offset - 路径偏移量
     * @param {string} color - 路径颜色
     * @param {boolean} isDashed - 是否为虚线
     * @returns {SVGPathElement} - 创建的SVG路径元素
     */
    const createPath = (startX, startY, endX, endY, offset, color, isDashed) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midY = (startY + endY) / 2;
        
        // 创建贝塞尔曲线路径
        path.setAttribute('d', `M${startX + offset},${startY} 
                            C${startX + offset},${midY} 
                            ${endX + offset},${midY} 
                            ${endX + offset},${endY}`);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        
        // 添加虚线和动画效果
        if (isDashed) {
            path.setAttribute('stroke-dasharray', '4,4');
            
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'stroke-dashoffset');
            animate.setAttribute('from', '0');
            animate.setAttribute('to', '16');
            animate.setAttribute('dur', '1s');
            animate.setAttribute('repeatCount', 'indefinite');
            path.appendChild(animate);
        }
        
        return path;
    };
    
    // 获取需要连接的子元素
    const topServerElement = masterTopNode.querySelector('.bg-indigo-900');
    const topClientElement = masterTopNode.querySelector('.bg-green-900');
    const bottomServerElement = masterBottomNode.querySelector('.bg-indigo-900');
    const bottomClientElement = masterBottomNode.querySelector('.bg-green-900');
    
    if (!topServerElement || !topClientElement || !bottomServerElement || !bottomClientElement) return;
    
    // 获取各元素的位置信息
    const topServerRect = getElementRect(topServerElement);
    const topClientRect = getElementRect(topClientElement);
    const bottomServerRect = getElementRect(bottomServerElement);
    const bottomClientRect = getElementRect(bottomClientElement);
    
    // 设置连接点坐标
    const topServerBottom = {
        x: topServerRect.left + topServerRect.width / 2,
        y: topServerRect.bottom
    };
    
    const topClientBottom = {
        x: topClientRect.left + topClientRect.width / 2,
        y: topClientRect.bottom
    };
    
    const bottomServerTop = {
        x: bottomServerRect.left + bottomServerRect.width / 2,
        y: bottomServerRect.top
    };
    
    const bottomClientTop = {
        x: bottomClientRect.left + bottomClientRect.width / 2,
        y: bottomClientRect.top
    };
    
    const offset = 15; // 平行线的偏移量
    
    // 创建四条连接线, 代表不同的通信通道
    svg.appendChild(createPath(
        topServerBottom.x, topServerBottom.y,
        bottomClientTop.x, bottomClientTop.y,
        -offset, '#3B82F6', true  // 蓝色虚线
    ));
    
    svg.appendChild(createPath(
        topServerBottom.x, topServerBottom.y,
        bottomClientTop.x, bottomClientTop.y,
        offset, '#10B981', true  // 绿色虚线
    ));
    
    svg.appendChild(createPath(
        topClientBottom.x, topClientBottom.y,
        bottomServerTop.x, bottomServerTop.y,
        -offset, '#3B82F6', true  // 蓝色虚线
    ));
    
    svg.appendChild(createPath(
        topClientBottom.x, topClientBottom.y,
        bottomServerTop.x, bottomServerTop.y,
        offset, '#10B981', true  // 绿色虚线
    ));
    
    // 将SVG添加到容器
    connectionLinesContainer.appendChild(svg);
}