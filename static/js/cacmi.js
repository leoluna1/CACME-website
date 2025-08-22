/**
 * CACMI - Asistente Virtual de CACME (Versión Mejorada)
 * Cooperativa de Ahorro y Crédito Mercedes Cadena
 * Version: 2.0.0
 * Author: Leonardo Luna
 */

(function() {
    'use strict';

    // Configuración del asistente
    const CACMI_CONFIG = {
        name: 'CACMI',
        company: 'CACME',
        primaryColor: '#0066cc',
        secondaryColor: '#0052a3',
        goldColor: '#f1c40f',
        position: {
            bottom: '20px',
            right: '20px'
        },
        messages: {
            welcome: '¡Hola! 👋 Bienvenido a CACME. Soy CACMI, tu asistente virtual disponible 24/7. ¿En qué puedo ayudarte hoy?',
            typing: 'CACMI está escribiendo...',
            offline: 'El asistente está temporalmente fuera de línea'
        }
    };

    // CSS Styles (tu CSS original + mejoras)
    const CACMI_STYLES = `
        .cacmi-chat-button {
            position: fixed;
            bottom: ${CACMI_CONFIG.position.bottom};
            right: ${CACMI_CONFIG.position.right};
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, ${CACMI_CONFIG.primaryColor} 0%, ${CACMI_CONFIG.secondaryColor} 100%);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: cacmi-float 3s ease-in-out infinite;
            border: 2px solid rgba(255,255,255,0.1);
        }

        @keyframes cacmi-float {
            0%, 100% {
                transform: translateY(0px) scale(1);
                box-shadow: 0 4px 15px rgba(0,102,204,0.4);
            }
            50% {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 0 12px 30px rgba(0,102,204,0.6);
            }
        }

        .cacmi-chat-button:hover {
            transform: scale(1.15);
            animation: none;
            box-shadow: 0 8px 25px rgba(0,102,204,0.8);
        }

        .cacmi-notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ff4444;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            animation: cacmi-pulse 1s infinite;
            border: 2px solid white;
        }

        @keyframes cacmi-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .cacmi-welcome-message {
            position: fixed;
            bottom: 30px;
            right: 100px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            color: #333;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            font-size: 14px;
            font-weight: 500;
            z-index: 999;
            animation: cacmi-slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            white-space: nowrap;
            display: none;
            align-items: center;
            gap: 10px;
            border: 1px solid rgba(0,102,204,0.1);
        }

        .cacmi-welcome-message::after {
            content: '';
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid #f8f9fa;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }

        @keyframes cacmi-slideIn {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .cacmi-chat-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 380px;
            height: 550px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.1);
        }

        .cacmi-chat-container.active {
            display: flex;
            animation: cacmi-chatSlideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes cacmi-chatSlideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .cacmi-chat-header {
            background: linear-gradient(135deg, ${CACMI_CONFIG.primaryColor} 0%, ${CACMI_CONFIG.secondaryColor} 100%);
            color: white;
            padding: 18px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .cacmi-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .cacmi-header-avatar {
            width: 35px;
            height: 35px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .cacmi-header-text h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 2px 0;
        }

        .cacmi-status {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            opacity: 0.9;
        }

        .cacmi-status-dot {
            width: 6px;
            height: 6px;
            background: #00ff00;
            border-radius: 50%;
            animation: cacmi-blink 2s infinite;
        }

        @keyframes cacmi-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        .cacmi-close-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .cacmi-close-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: rotate(90deg);
        }

        .cacmi-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
            scroll-behavior: smooth;
        }

        .cacmi-message {
            margin-bottom: 15px;
            display: flex;
            animation: cacmi-messageIn 0.3s ease-out;
        }

        @keyframes cacmi-messageIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .cacmi-message.user {
            justify-content: flex-end;
        }

        .cacmi-message-bubble {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            line-height: 1.4;
            position: relative;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .cacmi-message.bot .cacmi-message-bubble {
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
            border-bottom-left-radius: 4px;
        }

        .cacmi-message.user .cacmi-message-bubble {
            background: linear-gradient(135deg, ${CACMI_CONFIG.primaryColor} 0%, ${CACMI_CONFIG.secondaryColor} 100%);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .cacmi-message-time {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 4px;
            display: block;
        }

        .cacmi-typing {
            display: none;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            margin-bottom: 10px;
            width: fit-content;
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .cacmi-typing.active {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .cacmi-typing span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #999;
            animation: cacmi-typingBounce 1.4s infinite;
        }

        .cacmi-typing span:nth-child(1) { animation-delay: 0s; }
        .cacmi-typing span:nth-child(2) { animation-delay: 0.2s; }
        .cacmi-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes cacmi-typingBounce {
            0%, 60%, 100% {
                transform: translateY(0);
                background: #999;
            }
            30% {
                transform: translateY(-10px);
                background: ${CACMI_CONFIG.primaryColor};
            }
        }

        .cacmi-quick-replies {
            padding: 10px 15px;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .cacmi-quick-replies::-webkit-scrollbar {
            display: none;
        }

        .cacmi-quick-reply {
            padding: 8px 14px;
            background: white;
            border: 1px solid ${CACMI_CONFIG.primaryColor};
            color: ${CACMI_CONFIG.primaryColor};
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
            font-family: inherit;
        }

        .cacmi-quick-reply:hover {
            background: ${CACMI_CONFIG.primaryColor};
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,102,204,0.3);
        }

        .cacmi-input-container {
            padding: 15px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .cacmi-input-wrapper {
            flex: 1;
            position: relative;
        }

        .cacmi-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-family: inherit;
            font-size: 14px;
            transition: all 0.3s;
            background: #f8f9fa;
        }

        .cacmi-input:focus {
            border-color: ${CACMI_CONFIG.primaryColor};
            background: white;
            box-shadow: 0 0 0 3px rgba(0,102,204,0.1);
        }

        .cacmi-send-btn {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, ${CACMI_CONFIG.primaryColor} 0%, ${CACMI_CONFIG.secondaryColor} 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 2px 10px rgba(0,102,204,0.3);
        }

        .cacmi-send-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0,102,204,0.5);
        }

        .cacmi-send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }

        /* NUEVOS ESTILOS PARA RATING */
        .cacmi-rating-container {
            background: #f0f8ff;
            border: 1px solid #e0e6ff;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            text-align: center;
        }

        .cacmi-rating-stars {
            font-size: 24px;
            margin: 10px 0;
            cursor: pointer;
            user-select: none;
        }

        .cacmi-rating-stars:hover {
            transform: scale(1.1);
        }

        @media (max-width: 500px) {
            .cacmi-welcome-message {
                display: none !important;
            }
            
            .cacmi-chat-container {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
                max-width: 100%;
            }
        }
    `;

    // Clase principal del asistente MEJORADA
    class CacmiAssistant {
        constructor() {
            this.isOpen = false;
            this.isTyping = false;
            this.messageCount = 0;
            this.conversationHistory = [];
            this.userInterests = [];
            this.sessionStats = {
                startTime: new Date(),
                messageCount: 0,
                ratings: []
            };
            this.responses = this.initResponses();
            this.shortcuts = this.initShortcuts();
            
            this.init();
        }

        init() {
            this.injectStyles();
            this.createHTML();
            this.bindEvents();
            this.showWelcomeMessage();
            console.log('🤖 CACMI Assistant v2.0 initialized successfully');
        }

        injectStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = CACMI_STYLES;
            document.head.appendChild(styleSheet);
        }

        createHTML() {
            // Crear contenedor principal
            const container = document.createElement('div');
            container.id = 'cacmi-assistant';
            container.innerHTML = `
                <!-- Botón flotante -->
                <div class="cacmi-chat-button" id="cacmiChatButton">
                    <svg viewBox="0 0 100 100" width="50" height="50">
                        <circle cx="50" cy="45" r="22" fill="#fff" stroke="${CACMI_CONFIG.primaryColor}" stroke-width="2.5"/>
                        <line x1="50" y1="23" x2="50" y2="15" stroke="${CACMI_CONFIG.primaryColor}" stroke-width="2"/>
                        <circle cx="50" cy="13" r="4" fill="${CACMI_CONFIG.primaryColor}">
                            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                        </circle>
                        <ellipse cx="42" cy="42" rx="4" ry="5" fill="${CACMI_CONFIG.primaryColor}">
                            <animate attributeName="ry" values="5;1;5" dur="4s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse cx="58" cy="42" rx="4" ry="5" fill="${CACMI_CONFIG.primaryColor}">
                            <animate attributeName="ry" values="5;1;5" dur="4s" repeatCount="indefinite" begin="0.2s"/>
                        </ellipse>
                        <path d="M 38 52 Q 50 58 62 52" stroke="${CACMI_CONFIG.primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round">
                            <animate attributeName="d" values="M 38 52 Q 50 58 62 52;M 38 52 Q 50 60 62 52;M 38 52 Q 50 58 62 52" dur="3s" repeatCount="indefinite"/>
                        </path>
                        <rect x="33" y="67" width="34" height="20" rx="6" fill="#fff" stroke="${CACMI_CONFIG.primaryColor}" stroke-width="2.5"/>
                    </svg>
                    <span class="cacmi-notification-badge" id="cacmiNotificationBadge">1</span>
                </div>

                <!-- Mensaje de bienvenida -->
                <div class="cacmi-welcome-message" id="cacmiWelcomeMessage">
                    <span>🤖</span>
                    <span>¡Hola! Soy ${CACMI_CONFIG.name}, tu asistente virtual</span>
                </div>

                <!-- Ventana del chat -->
                <div class="cacmi-chat-container" id="cacmiChatContainer">
                    <div class="cacmi-chat-header">
                        <div class="cacmi-header-info">
                            <div class="cacmi-header-avatar">🤖</div>
                            <div class="cacmi-header-text">
                                <h3>${CACMI_CONFIG.name} - Asistente Virtual</h3>
                                <div class="cacmi-status">
                                    <span class="cacmi-status-dot"></span>
                                    <span>En línea y listo para ayudarte</span>
                                </div>
                            </div>
                        </div>
                        <button class="cacmi-close-btn" id="cacmiCloseBtn">✕</button>
                    </div>

                    <div class="cacmi-messages" id="cacmiMessages">
                        <div class="cacmi-message bot">
                            <div class="cacmi-message-bubble">
                                ${CACMI_CONFIG.messages.welcome}
                                <span class="cacmi-message-time">${this.getCurrentTime()}</span>
                            </div>
                        </div>
                        <div class="cacmi-typing" id="cacmiTyping">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <div class="cacmi-quick-replies" id="cacmiQuickReplies">
                        <button class="cacmi-quick-reply" data-message="Información sobre créditos">💰 Créditos</button>
                        <button class="cacmi-quick-reply" data-message="Cuentas de ahorro">💳 Ahorros</button>
                        <button class="cacmi-quick-reply" data-message="Requisitos para abrir cuenta">📋 Requisitos</button>
                        <button class="cacmi-quick-reply" data-message="Horarios de atención">🕐 Horarios</button>
                        <button class="cacmi-quick-reply" data-message="Ubicación">📍 Ubicación</button>
                    </div>

                    <div class="cacmi-input-container">
                        <div class="cacmi-input-wrapper">
                            <input 
                                type="text" 
                                class="cacmi-input" 
                                id="cacmiInput" 
                                placeholder="Escribe tu mensaje..."
                                maxlength="500"
                            >
                        </div>
                        <button class="cacmi-send-btn" id="cacmiSendBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
        }

        bindEvents() {
            // Botón principal
            document.getElementById('cacmiChatButton').addEventListener('click', () => this.toggleChat());
            
            // Botón cerrar
            document.getElementById('cacmiCloseBtn').addEventListener('click', () => this.toggleChat());
            
            // Enviar mensaje
            document.getElementById('cacmiSendBtn').addEventListener('click', () => this.sendMessage());
            
            // Enter para enviar
            document.getElementById('cacmiInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Quick replies
            document.querySelectorAll('.cacmi-quick-reply').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const message = e.target.getAttribute('data-message');
                    this.sendQuickReply(message);
                });
            });
        }

        // FUNCIÓN MEJORADA: Toggle Chat
        toggleChat() {
            this.isOpen = !this.isOpen;
            const container = document.getElementById('cacmiChatContainer');
            const welcomeMsg = document.getElementById('cacmiWelcomeMessage');
            const badge = document.getElementById('cacmiNotificationBadge');
            
            if (this.isOpen) {
                container.classList.add('active');
                welcomeMsg.style.display = 'none';
                badge.style.display = 'none';
                document.getElementById('cacmiInput').focus();
                
                // Tracking de apertura
                this.sessionStats.startTime = new Date();
            } else {
                container.classList.remove('active');
                
                // Mostrar resumen si hubo conversación significativa
                if (this.sessionStats.messageCount > 3) {
                    setTimeout(() => this.showSessionSummary(), 1000);
                }
                
                setTimeout(() => this.showWelcomeMessage(), 3000);
            }
        }

        showWelcomeMessage() {
            const welcomeMsg = document.getElementById('cacmiWelcomeMessage');
            if (!this.isOpen && welcomeMsg) {
                welcomeMsg.style.display = 'flex';
                setTimeout(() => {
                    if (!this.isOpen) {
                        welcomeMsg.style.display = 'none';
                    }
                }, 10000);
            }
        }

        // FUNCIÓN MEJORADA: Send Message
        async sendMessage() {
            const input = document.getElementById('cacmiInput');
            const message = input.value.trim();
            
            if (!message || this.isTyping) return;
            
            // Verificar shortcuts primero
            const shortcutResponse = this.processShortcuts(message);
            if (shortcutResponse) {
                input.value = '';
                this.addMessage(message, 'user');
                setTimeout(() => {
                    this.addMessage(shortcutResponse, 'bot');
                }, 500);
                return;
            }
            
            this.isTyping = true;
            input.disabled = true;
            document.getElementById('cacmiSendBtn').disabled = true;
            
            // Agregar mensaje del usuario
            this.addMessage(message, 'user');
            input.value = '';
            
            // Actualizar contexto
            this.updateUserContext(message);
            
            // Mostrar indicador de escritura
            this.showTyping();
            
            // Simular delay
            await this.sleep(Math.min(message.length * 20, 2000));
            
            // Verificar si es rating
            const ratingResponse = this.handleRating(message);
            if (ratingResponse) {
                this.hideTyping();
                this.addMessage(ratingResponse, 'bot');
            } else {
                // Obtener y mostrar respuesta
                const response = this.getResponse(message);
                this.hideTyping();
                this.addMessage(response, 'bot');
                
                // Actualizar quick replies basado en contexto
                this.updateQuickReplies(message);
                
                // Mostrar rating ocasionalmente
                if (Math.random() > 0.7 && this.sessionStats.messageCount > 2) {
                    setTimeout(() => this.showRatingRequest(), 2000);
                }
            }
            
            // Rehabilitar input
            this.isTyping = false;
            input.disabled = false;
            document.getElementById('cacmiSendBtn').disabled = false;
            input.focus();
        }

        sendQuickReply(message) {
            document.getElementById('cacmiInput').value = message;
            this.sendMessage();
        }

        // FUNCIÓN MEJORADA: Add Message
        addMessage(text, sender) {
            const messagesContainer = document.getElementById('cacmiMessages');
            const typing = document.getElementById('cacmiTyping');
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `cacmi-message ${sender}`;
            
            const formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            
            messageDiv.innerHTML = `
                <div class="cacmi-message-bubble">
                    ${formattedText}
                    <span class="cacmi-message-time">${this.getCurrentTime()}</span>
                </div>
            `;
            
            messagesContainer.insertBefore(messageDiv, typing);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            this.messageCount++;
            this.sessionStats.messageCount++;
        }

        // NUEVA FUNCIÓN: Process Shortcuts
        processShortcuts(message) {
            const lower = message.toLowerCase().trim();
            return this.shortcuts[lower] || null;
        }

        // NUEVA FUNCIÓN: Handle Rating
        handleRating(message) {
            const stars = (message.match(/⭐/g) || []).length;
            
            if (stars > 0) {
                this.sessionStats.ratings.push(stars);
                
                const responses = {
                    5: `🌟 ¡WOW! ¡5 estrellas! 

¡Eres increíble! Me motivas a seguir mejorando cada día.

🎉 **Como agradecimiento:**
• Atención prioritaria si necesitas más ayuda
• Acceso a ofertas especiales de CACME
• ¡Eres nuestro socio VIP!

¿Hay algo más en lo que pueda ayudarte?`,
                    4: `⭐ ¡Excelente! 4 estrellas 

¡Qué alegría saber que te ayudé bien!

💪 **Seguiré mejorando para llegar a 5 estrellas.**

¿Qué podría hacer mejor la próxima vez?`,
                    3: `👍 ¡Gracias! 3 estrellas

Aprecio mucho tu honestidad.

🔧 **¿Podrías contarme qué puedo mejorar?**
Tu feedback me ayuda a ser un mejor asistente.`,
                    2: `😅 Entiendo... 2 estrellas

Claramente necesito mejorar.

🙏 **¿Me das una segunda oportunidad?**
Dime qué necesitas y lo haré mejor esta vez.`,
                    1: `😔 Lo siento mucho... 1 estrella

Me duele no haberte ayudado bien.

📞 **Te conectaré con un humano:**
• Llama: 0981045327
• O dime qué necesitas y buscaré la mejor solución

Tu experiencia es muy importante para nosotros.`
                };
                
                return responses[stars] || responses[3];
            }
            
            return null;
        }

        // NUEVA FUNCIÓN: Update User Context
        updateUserContext(message) {
            const lower = message.toLowerCase();
            
            // Detectar intereses
            if (lower.includes('casa') || lower.includes('vivienda')) {
                this.addInterest('vivienda');
            }
            if (lower.includes('negocio') || lower.includes('empresa')) {
                this.addInterest('emprendimiento');
            }
            if (lower.includes('ahorrar') || lower.includes('guardar')) {
                this.addInterest('ahorros');
            }
            if (lower.includes('invertir') || lower.includes('rentabilidad')) {
                this.addInterest('inversiones');
            }
        }

        addInterest(interest) {
            if (!this.userInterests.includes(interest)) {
                this.userInterests.push(interest);
            }
        }

        // NUEVA FUNCIÓN: Update Quick Replies
        updateQuickReplies(lastMessage) {
            const quickReplies = document.getElementById('cacmiQuickReplies');
            const lower = lastMessage.toLowerCase();
            
            if (lower.includes('crédito') || lower.includes('préstamo')) {
                quickReplies.innerHTML = `
                    <button class="cacmi-quick-reply" data-message="Requisitos para crédito de consumo">📋 Requisitos</button>
                    <button class="cacmi-quick-reply" data-message="Calcular crédito $5000 24 meses">🧮 Simular</button>
                    <button class="cacmi-quick-reply" data-message="Tasas de interés créditos">📊 Tasas</button>
                    <button class="cacmi-quick-reply" data-message="Proceso de aprobación">⏰ Proceso</button>
                `;
            } else if (lower.includes('ahorro')) {
                quickReplies.innerHTML = `
                    <button class="cacmi-quick-reply" data-message="Tipos de ahorro disponibles">💰 Tipos</button>
                    <button class="cacmi-quick-reply" data-message="Calcular ahorro $100 mensual">🧮 Simular</button>
                    <button class="cacmi-quick-reply" data-message="Beneficios del ahorro programado">🎁 Beneficios</button>
                    <button class="cacmi-quick-reply" data-message="Abrir cuenta de ahorros">✅ Abrir</button>
                `;
            } else {
                // Restaurar botones por defecto
                quickReplies.innerHTML = `
                    <button class="cacmi-quick-reply" data-message="Información sobre créditos">💰 Créditos</button>
                    <button class="cacmi-quick-reply" data-message="Cuentas de ahorro">💳 Ahorros</button>
                    <button class="cacmi-quick-reply" data-message="Requisitos para abrir cuenta">📋 Requisitos</button>
                    <button class="cacmi-quick-reply" data-message="Horarios de atención">🕐 Horarios</button>
                    <button class="cacmi-quick-reply" data-message="Ubicación">📍 Ubicación</button>
                `;
            }
            
            // Re-bind eventos
            document.querySelectorAll('.cacmi-quick-reply').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const message = e.target.getAttribute('data-message');
                    this.sendQuickReply(message);
                });
            });
        }

        // NUEVA FUNCIÓN: Show Rating Request
        showRatingRequest() {
            const ratingMessage = `⭐ **¿Te ayudé a resolver tu consulta?**

Califica mi atención con estrellas:
⭐⭐⭐⭐⭐ ⭐⭐⭐⭐ ⭐⭐⭐ ⭐⭐ ⭐

¡Tu opinión me ayuda a mejorar! 😊`;
            
            this.addMessage(ratingMessage, 'bot');
        }

        // NUEVA FUNCIÓN: Show Session Summary
        showSessionSummary() {
            const duration = Math.round((new Date() - this.sessionStats.startTime) / 1000 / 60);
            const avgRating = this.sessionStats.ratings.length > 0 
                ? (this.sessionStats.ratings.reduce((a, b) => a + b, 0) / this.sessionStats.ratings.length).toFixed(1)
                : 'N/A';
            
            const summary = `📊 **Resumen de nuestra conversación:**

💬 Mensajes intercambiados: ${this.sessionStats.messageCount}
⏱️ Duración: ${duration} minutos
🎯 Temas consultados: ${this.userInterests.join(', ') || 'Información general'}
⭐ Calificación promedio: ${avgRating}

¡Gracias por conversar conmigo! Siempre estoy aquí para ayudarte. 😊`;
            
            if (!this.isOpen) {
                setTimeout(() => {
                    this.addMessage(summary, 'bot');
                }, 500);
            }
        }

        // FUNCIÓN MEJORADA: Get Response con calculadora
        getResponse(message) {
            const lower = message.toLowerCase();
            
            // Verificar si es una calculación
            const calculation = this.processCalculation(message);
            if (calculation) {
                return calculation;
            }
            
            // Buscar respuesta normal
            for (const [key, data] of Object.entries(this.responses)) {
                for (const keyword of data.keywords) {
                    if (lower.includes(keyword)) {
                        // Agregar sugerencia personalizada ocasionalmente
                        let response = data.response;
                        const suggestion = this.getPersonalizedSuggestion();
                        if (suggestion && Math.random() > 0.6) {
                            response += `\n\n💡 **Sugerencia:** ${suggestion}`;
                        }
                        return response;
                    }
                }
            }
            
            return this.responses.default.response;
        }

        // NUEVA FUNCIÓN: Process Calculation
        processCalculation(message) {
            const lower = message.toLowerCase();
            
            if (lower.includes('calcular') || lower.includes('simular')) {
                const numbers = message.match(/\d+/g);
                if (!numbers || numbers.length < 2) {
                    return `🧮 **Para calcular necesito más datos:**
                    
**Formato correcto:**
"Calcular crédito $5000 24 meses"
"Calcular ahorro $100 mensual 12 meses"

¿Puedes darme monto y plazo?`;
                }
                
                const amount = parseInt(numbers[0]);
                const term = parseInt(numbers[1]);
                
                if (lower.includes('crédito') || lower.includes('prestamo')) {
                    return this.calculateCredit(amount, term, lower);
                }
                
                if (lower.includes('ahorro')) {
                    return this.calculateSavings(amount, term);
                }
            }
            
            return null;
        }

        // NUEVA FUNCIÓN: Calculate Credit
        calculateCredit(amount, term, messageType) {
            let rate = 12; // tasa por defecto
            let type = 'consumo';
            
            if (messageType.includes('hipotecario')) { rate = 10; type = 'hipotecario'; }
            else if (messageType.includes('vehicular')) { rate = 11; type = 'vehicular'; }
            else if (messageType.includes('micro')) { rate = 15; type = 'microcrédito'; }
            
            const monthlyRate = rate / 12 / 100;
            const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                           (Math.pow(1 + monthlyRate, term) - 1);
            const totalPayment = payment * term;
            const totalInterest = totalPayment - amount;
            
            return `💰 **Simulación Crédito ${type.charAt(0).toUpperCase() + type.slice(1)}:**

💵 **Monto:** ${amount.toLocaleString()}
📅 **Plazo:** ${term} meses
📊 **Tasa:** ${rate}% anual

💳 **Cuota mensual:** ${payment.toFixed(2)}
💲 **Total a pagar:** ${totalPayment.toFixed(2)}
📈 **Total intereses:** ${totalInterest.toFixed(2)}

⚠️ *Cálculo referencial sujeto a evaluación*

¿Te gustaría solicitar este crédito?`;
        }

        // NUEVA FUNCIÓN: Calculate Savings
        calculateSavings(amount, term) {
            const annualRate = 5.5;
            const monthlyRate = annualRate / 12 / 100;
            let total = 0;
            
            for (let i = 0; i < term; i++) {
                total = (total + amount) * (1 + monthlyRate);
            }
            
            const totalDeposits = amount * term;
            const earnings = total - totalDeposits;
            
            return `🐷 **Simulación Ahorro Programado:**

💰 **Ahorro mensual:** ${amount.toLocaleString()}
📅 **Plazo:** ${term} meses
📊 **Tasa:** 5.5% anual

💵 **Total depositado:** ${totalDeposits.toFixed(2)}
📈 **Intereses ganados:** ${earnings.toFixed(2)}
🎯 **Total acumulado:** ${total.toFixed(2)}

✨ *¡Excelente plan de ahorro!*

¿Te gustaría abrir esta cuenta?`;
        }

        // NUEVA FUNCIÓN: Get Personalized Suggestion
        getPersonalizedSuggestion() {
            const suggestions = [];
            
            if (this.userInterests.includes('vivienda')) {
                suggestions.push('¿Sabías que tenemos crédito hipotecario con tasa desde 10%?');
            }
            if (this.userInterests.includes('emprendimiento')) {
                suggestions.push('Nuestro microcrédito puede impulsar tu negocio');
            }
            if (this.userInterests.includes('ahorros')) {
                suggestions.push('El ahorro programado te ayuda a cumplir metas específicas');
            }
            
            return suggestions.length > 0 ? suggestions[Math.floor(Math.random() * suggestions.length)] : null;
        }

        // FUNCIÓN MEJORADA: Init Responses
        initResponses() {
            return {
                // CRÉDITOS ESPECÍFICOS
                credito_consumo: {
                    keywords: ['crédito consumo', 'préstamo personal', 'crédito personal'],
                    response: `💰 **Crédito de Consumo CACME:**
                    
✅ **Características:**
• Monto: $500 - $20,000
• Plazo: Hasta 48 meses  
• Tasa: Desde 12% anual
• Aprobación: Máximo 48 horas

📋 **Requisitos:**
• Ser socio CACME
• Cédula vigente
• Comprobante de ingresos
• Garante personal

🎯 **Ideal para:** Gastos personales, electrodomésticos, educación
                    
¿Te gustaría simular una cuota?`
                },
                
                credito_hipotecario: {
                    keywords: ['hipotecario', 'vivienda', 'casa', 'construcción'],
                    response: `🏠 **Crédito Hipotecario CACME:**
                    
✅ **Características:**
• Monto: $10,000 - $50,000
• Plazo: Hasta 15 años
• Tasa: Desde 10% anual
• Financia hasta 70% del avalúo

📋 **Requisitos especiales:**
• Escrituras del inmueble
• Avalúo comercial actualizado
• Certificado de gravámenes

🎯 **Para:** Compra, construcción, remodelación
                    
¿Necesitas más detalles sobre el proceso?`
                },
                
                credito_vehicular: {
                    keywords: ['vehicular', 'auto', 'carro', 'vehículo', 'moto'],
                    response: `🚗 **Crédito Vehicular CACME:**
                    
✅ **Características:**
• Monto: $5,000 - $30,000
• Plazo: Hasta 5 años
• Tasa: Desde 11% anual
• Financia hasta 80% del valor

🎯 **Ventajas:**
• Seguro de desgravamen incluido
• Sin penalización por pago anticipado
• Acepta vehículos nuevos y usados
                    
¿Tienes algún vehículo en mente?`
                },
                
                microcredito: {
                    keywords: ['microcrédito', 'negocio', 'emprendimiento', 'comercio'],
                    response: `🏪 **Microcrédito CACME:**
                    
✅ **Características:**
• Monto: $300 - $10,000
• Plazo: Hasta 36 meses
• Tasa: Desde 15% anual
• Evaluación rápida

🎯 **Ideal para:**
• Capital de trabajo
• Inventario
• Equipamiento
• Expansión del negocio
                    
¿Cuéntame sobre tu emprendimiento?`
                },
                
                credito: {
                    keywords: ['crédito', 'préstamo', 'financiamiento', 'prestar'],
                    response: '💰 Ofrecemos varios tipos de créditos:\n\n• **Consumo**: Hasta $20,000\n• **Microcrédito**: Para emprendedores\n• **Hipotecario**: Para tu vivienda\n• **Vehicular**: Para tu auto\n\nTodos con tasas competitivas y aprobación rápida. ¿Cuál te interesa?'
                },
                
                ahorro: {
                    keywords: ['ahorro', 'cuenta', 'guardar', 'deposito'],
                    response: '💳 Nuestras opciones de ahorro incluyen:\n\n• **Cuenta de ahorros**: Desde $20\n• **Plazo fijo**: Tasas desde 6% anual\n• **Ahorro programado**: Plan personalizado\n• **Ahorro infantil**: Para los más pequeños\n\nSin costos de mantenimiento. ¿Deseas más información?'
                },
                
                requisitos: {
                    keywords: ['requisito', 'documento', 'necesito', 'papeles', 'abrir'],
                    response: '📋 Para abrir tu cuenta necesitas:\n\n• Cédula de identidad vigente\n• Certificado de votación\n• Planilla de servicios básicos\n• Comprobante de ingresos\n• Monto mínimo: $20\n\nEl proceso es rápido y sencillo.'
                },
                
                horario: {
                    keywords: ['horario', 'hora', 'cuando', 'atienden', 'abierto'],
                    response: '🕐 Nuestros horarios son:\n\n• **Lunes a Viernes**: 8:00 AM - 5:00 PM\n• **Sábados**: 9:00 AM - 1:00 PM\n• **Domingos**: Cerrado\n\nTe esperamos en nuestras oficinas.'
                },
                
                ubicacion: {
                    keywords: ['donde', 'ubicación', 'dirección', 'lugar', 'oficina'],
                    response: '📍 Estamos ubicados en:\n\n**Atuntaqui, Imbabura, Ecuador**\nGeneral Enríquez y Sucre esquina\n\n📞 Contáctanos:\n• Tel: (06) 2910327\n• Móvil: 0981045327'
                },
                
                saludo: {
                    keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey'],
                    response: '¡Hola! 😊 Es un gusto saludarte. Soy CACMI, tu asistente virtual de CACME. ¿En qué puedo ayudarte hoy?'
                },
                
                despedida: {
                    keywords: ['gracias', 'adiós', 'chao', 'hasta luego', 'bye'],
                    response: '¡Ha sido un placer ayudarte! 😊\n\n📞 **Recuerda que puedes:**\n• Llamarnos: 0981045327\n• Visitarnos en nuestras oficinas\n• Escribirme cuando quieras (estoy 24/7)\n\n🏆 **CACME - 17 años fomentando tu desarrollo**'
                },
                
                default: {
                    keywords: [],
                    response: 'Gracias por tu consulta. Para brindarte información más específica, te sugiero:\n\n• Llamarnos al 0981045327\n• Visitar nuestra oficina en Atuntaqui\n• O preguntarme sobre créditos, ahorros, requisitos u horarios.\n\n💡 **Comandos rápidos:** Escribe "ayuda" para ver opciones'
                }
            };
        }

        // NUEVA FUNCIÓN: Init Shortcuts
        initShortcuts() {
            return {
                'ayuda': `🆘 **Comandos rápidos:**
• calc - Calculadora
• horario - Horarios  
• tel - Teléfono
• ubicacion - Dirección
• requisitos - Documentos
• productos - Lista productos`,
                
                'calc': 'Para calcular envíame: "Calcular $5000 24 meses consumo"',
                'horario': 'Lunes a Viernes: 8AM-5PM | Sábados: 9AM-1PM',
                'tel': '📞 Teléfono: 0981045327',
                'ubicacion': '📍 Matriz: General Enríquez y Sucre, Atuntaqui',
                'requisitos': '📋 Cédula, certificado votación, planilla servicios, foto carnet',
                'productos': `💼 **Productos CACME:**
• Créditos: consumo, hipotecario, vehicular, micro
• Ahorros: programado, futuro, infantil, a la vista
• Inversiones: básica, plus, premium`
            };
        }

        showTyping() {
            document.getElementById('cacmiTyping').classList.add('active');
            const container = document.getElementById('cacmiMessages');
            container.scrollTop = container.scrollHeight;
        }

        hideTyping() {
            document.getElementById('cacmiTyping').classList.remove('active');
        }

        getCurrentTime() {
            return new Date().toLocaleTimeString('es-EC', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.CACMI = new CacmiAssistant();
        });
    } else {
        window.CACMI = new CacmiAssistant();
    }
})();