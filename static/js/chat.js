/**
 * CACME - Módulo del Chat Conversacional
 * Maneja toda la lógica del asistente virtual
 */

const ChatModule = {
    // Estado del chat
    state: {
        isOpen: false,
        isTyping: false,
        messageHistory: [],
        userSession: null,
        lastActivity: null
    },

    // Configuración del chat
    config: {
        autoGreetingDelay: 8000,
        typingDelay: 1500,
        maxHistoryLength: 50,
        enableNotifications: true,
        enableAutoSuggestions: true
    },

    // Base de conocimiento de CACME
    knowledgeBase: {
        // Información general
        general: {
            name: 'CACME',
            fullName: 'Cooperativa de Ahorro y Crédito Mercedes Cadena LTDA',
            founded: '1995',
            experience: '17 años',
            slogan: 'Fomentamos tu desarrollo',
            motto: 'Ahorra, Crece, Vive, Bienvenido a CACME'
        },

        // Productos financieros
        products: {
            'ahorro-programado': {
                name: 'Ahorro Programado',
                description: 'Cada aporte es un paso confiable hacia tus sueños, respaldado por la solidez de CACME',
                benefits: ['Débitos automáticos', 'Metas específicas', 'Rendimientos atractivos']
            },
            'ahorro-futuro': {
                name: 'Ahorro Futuro',
                description: 'Invierte a largo plazo con la seguridad y respaldo de CACME',
                benefits: ['Largo plazo', 'Excelentes rendimientos', 'Liquidez cuando necesites']
            },
            'ahorro-infantil': {
                name: 'Ahorro Infantil',
                description: 'Construye un fondo que respalde sus estudios, actividades y primeros proyectos',
                benefits: ['Sin monto mínimo', 'Educación financiera', 'Futuro asegurado']
            },
            'credito': {
                name: 'CACME Crédito',
                description: 'Atrévete a conquistar tus metas con nuestro crédito inmediato',
                benefits: ['Tasas preferenciales desde 9.5%', 'Aprobación rápida', 'Flexibilidad de pago']
            },
            'inversiones': {
                name: 'Inversiones',
                description: 'Al invertir en CACME, tu rendimiento impulsa proyectos locales',
                benefits: ['Diferentes plazos', 'Tasas competitivas', 'Impacto social']
            },
            'ahorro-vista': {
                name: 'Ahorro a la Vista',
                description: 'Un respaldo sólido que te acompaña en cada paso de tu vida',
                benefits: ['Disponibilidad inmediata', 'Sin restricciones', 'Seguridad total']
            }
        },

        // Agencias
        agencies: [
            { name: 'Matriz Atuntaqui', address: 'General Enríquez y Sucre esquina', province: 'Imbabura' },
            { name: 'Riobamba', address: 'Calle Chile y Juan Lavalle', province: 'Chimborazo' },
            { name: 'Quito', address: 'Centro Histórico Venezuela y Simón Bolívar', province: 'Pichincha' },
            { name: 'Cuenca', address: 'Mariscal Lamar 11-24 entre General Torres y Tarqui', province: 'Azuay' },
            { name: 'Machala', address: 'Calle Rocafuerte y Santa Rosa esquina', province: 'El Oro' },
            { name: 'Sangolquí', address: 'Av. Luis Cordero 696 y Leopoldo M.', province: 'Pichincha' },
            { name: 'Otavalo', address: 'Morales entre Sucre y Modesto Jaramillo', province: 'Imbabura' },
            { name: 'Imantag', address: 'Virgilio Morán y Sucre', province: 'Imbabura' },
            { name: 'Mercedes Cadena', address: 'Barrio central', province: 'Imbabura' },
            { name: 'Guamote', address: 'Panamericana García Moreno y Chile', province: 'Chimborazo' }
        ],

        // Información de contacto
        contact: {
            phones: {
                main: '(06) 2910327',
                mobile: '0981045327',
                whatsapp: '+593 98 104 5327'
            },
            emails: {
                general: 'info@coopcacme.fin.ec',
                management: 'gerencia@coopcacme.fin.ec',
                credits: 'creditos@coopcacme.fin.ec'
            },
            schedule: {
                weekdays: 'Lunes a Viernes 8:00 AM - 5:00 PM',
                saturday: 'Sábados 8:00 AM - 12:00 PM',
                online: 'CACME EN LÍNEA 24/7'
            }
        },

        // Reguladores
        regulators: [
            'Superintendencia de Economía Popular y Solidaria (SEPS)',
            'Banco Central del Ecuador (BCE)',
            'COSEDE - Protegemos tu dinero hasta $32,000',
            'UAFE - Unidad de Análisis Financiero y Económico'
        ]
    },

    // Inicializar el módulo
    init() {
        this.setupEventListeners();
        this.initializeSession();
        this.setupAutoGreeting();
        
        console.log('✅ ChatModule inicializado');
    },

    // Configurar event listeners
    setupEventListeners() {
        // Click fuera del chat para cerrar
        document.addEventListener('click', (e) => {
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer && !chatContainer.contains(e.target) && this.state.isOpen) {
                this.close();
            }
        });

        // Tecla Escape para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.close();
            }
        });
    },

    // Inicializar sesión
    initializeSession() {
        this.state.userSession = Utils.generateId();
        this.state.lastActivity = Date.now();
        
        // Recuperar historial si existe
        const savedHistory = Utils.getStorage('cacme_chat_history');
        if (savedHistory && Array.isArray(savedHistory)) {
            this.state.messageHistory = savedHistory.slice(-this.config.maxHistoryLength);
        }
    },

    // Configurar saludo automático
    setupAutoGreeting() {
        setTimeout(() => {
            if (!this.state.isOpen && this.state.messageHistory.length === 0) {
                this.addMessage(
                    '👋 ¡Hola! ¿Sabías que en CACME llevamos 17 años fomentando el desarrollo de nuestra comunidad? ¿Te gustaría conocer nuestros productos financieros?',
                    'bot'
                );
                this.showNotificationBadge();
            }
        }, this.config.autoGreetingDelay);
    },

    // Alternar chat (abrir/cerrar)
    toggle() {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    // Abrir chat
    open() {
        const widget = document.getElementById('chatWidget');
        const icon = document.getElementById('chat-icon');
        
        if (widget && icon) {
            widget.classList.add('active');
            icon.className = 'fas fa-times';
            this.state.isOpen = true;
            
            // Scroll al último mensaje
            setTimeout(() => {
                this.scrollToBottom();
            }, 100);
            
            // Quitar badge de notificación
            this.hideNotificationBadge();
            
            // Marcar actividad
            this.updateActivity();
        }
    },

    // Cerrar chat
    close() {
        const widget = document.getElementById('chatWidget');
        const icon = document.getElementById('chat-icon');
        
        if (widget && icon) {
            widget.classList.remove('active');
            icon.className = 'fas fa-comments';
            this.state.isOpen = false;
        }
    },

    // Enviar mensaje
    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        // Procesar respuesta
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
            
            // Sugerir acciones adicionales
            if (this.config.enableAutoSuggestions) {
                this.showSuggestions(message);
            }
        }, this.config.typingDelay);
        
        this.updateActivity();
    },

    // Enviar mensaje rápido
    sendQuickMessage(message) {
        this.addMessage(message, 'user');
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
        
        this.updateActivity();
    },

    // Manejar tecla presionada
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    },

    // Agregar mensaje
    addMessage(text, sender, timestamp = null) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        // Crear elemento del mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        // Agregar contenido
        const contentDiv = document.createElement('div');
        contentDiv.textContent = text;
        messageElement.appendChild(contentDiv);
        
        // Agregar timestamp si es necesario
        if (timestamp || sender === 'user') {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-status';
            timeDiv.textContent = new Date().toLocaleTimeString('es-EC', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            messageElement.appendChild(timeDiv);
        }
        
        // Animación de entrada
        messageElement.classList.add('message-enter');
        messagesContainer.appendChild(messageElement);
        
        // Activar animación
        setTimeout(() => {
            messageElement.classList.remove('message-enter');
            messageElement.classList.add('message-enter-active');
        }, 10);
        
        // Guardar en historial
        this.state.messageHistory.push({
            text,
            sender,
            timestamp: timestamp || Date.now()
        });
        
        // Limitar historial
        if (this.state.messageHistory.length > this.config.maxHistoryLength) {
            this.state.messageHistory = this.state.messageHistory.slice(-this.config.maxHistoryLength);
        }
        
        // Guardar en storage
        Utils.setStorage('cacme_chat_history', this.state.messageHistory);
        
        // Scroll automático
        this.scrollToBottom();
    },

    // Obtener respuesta del bot
    getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        const kb = this.knowledgeBase;
        
        // Respuestas sobre productos
        if (lowerMessage.includes('cuenta') || lowerMessage.includes('abrir')) {
            return `🏦 Para abrir una cuenta en CACME necesitas: cédula de identidad, papeleta de votación y un depósito mínimo de $25. Puedes acercarte a cualquiera de nuestras ${kb.agencies.length} agencias. ¿Te gustaría conocer la ubicación más cercana?`;
        }
        
        if (lowerMessage.includes('crédito') || lowerMessage.includes('préstamo')) {
            const creditProduct = kb.products.credito;
            return `💰 ${creditProduct.description}. ${creditProduct.benefits.join(', ')}. Requisitos: cédula, papeleta de votación, comprobante de ingresos. ¿Qué tipo de crédito te interesa?`;
        }
        
        if (lowerMessage.includes('ahorro programado')) {
            const product = kb.products['ahorro-programado'];
            return `💫 ${product.description}. Beneficios: ${product.benefits.join(', ')}. ¿Te gustaría más información sobre cómo programar tus ahorros?`;
        }
        
        if (lowerMessage.includes('ahorro futuro')) {
            const product = kb.products['ahorro-futuro'];
            return `🚀 ${product.description}. Beneficios: ${product.benefits.join(', ')}. ¿Qué plazo de inversión te interesa?`;
        }
        
        if (lowerMessage.includes('ahorro infantil')) {
            const product = kb.products['ahorro-infantil'];
            return `👶 ${product.description}. Beneficios: ${product.benefits.join(', ')}. ¡La mejor inversión en el futuro de tus hijos!`;
        }
        
        if (lowerMessage.includes('inversión') || lowerMessage.includes('invertir')) {
            const product = kb.products.inversiones;
            return `📈 ${product.description}. Beneficios: ${product.benefits.join(', ')}. ¿Te interesa conocer nuestras tasas actuales?`;
        }
        
        // Respuestas sobre ubicación y agencias
        if (lowerMessage.includes('ubicación') || lowerMessage.includes('agencia') || lowerMessage.includes('dirección')) {
            const agencyList = kb.agencies.slice(0, 5).map(agency => 
                `• ${agency.name}: ${agency.address}`
            ).join('\n');
            return `📍 Tenemos ${kb.agencies.length} agencias:\n\n${agencyList}\n\n¿En qué ciudad te encuentras para darte la dirección exacta?`;
        }
        
        // Respuestas sobre horarios
        if (lowerMessage.includes('horario') || lowerMessage.includes('atención')) {
            return `🕐 Nuestros horarios:\n• ${kb.contact.schedule.weekdays}\n• ${kb.contact.schedule.saturday}\n• ${kb.contact.schedule.online}`;
        }
        
        // Respuestas sobre contacto
        if (lowerMessage.includes('teléfono') || lowerMessage.includes('contacto') || lowerMessage.includes('llamar')) {
            return `📞 Contáctanos:\n• Matriz: ${kb.contact.phones.main}\n• Celular: ${kb.contact.phones.mobile}\n• WhatsApp: ${kb.contact.phones.whatsapp}\n• Email: ${kb.contact.emails.general}`;
        }
        
        // Respuestas sobre historia
        if (lowerMessage.includes('mercedes cadena') || lowerMessage.includes('historia') || lowerMessage.includes('fundación')) {
            return `🏛️ CACME nació en ${kb.general.founded} para atender a la comunidad Mercedes Cadena cuando la banca tradicional no acogía a la población indígena. Hoy tenemos ${kb.general.experience} de experiencia sirviendo a nuestra comunidad.`;
        }
        
        // Respuestas sobre requisitos
        if (lowerMessage.includes('requisito') || lowerMessage.includes('documento')) {
            return `📋 Requisitos generales:\n• Cédula de identidad\n• Papeleta de votación actualizada\n• Para créditos: comprobante de ingresos y referencias\n\n¿Para qué producto específico necesitas información?`;
        }
        
        // Respuestas sobre tasas
        if (lowerMessage.includes('tasa') || lowerMessage.includes('interés') || lowerMessage.includes('rendimiento')) {
            return `💵 Nuestras tasas son preferenciales:\n• Ahorros: hasta 6% anual\n• Créditos: desde 9.5% anual para socios\n\nComo cooperativa, ofrecemos mejores condiciones que la banca tradicional. ¡Contáctanos para una cotización personalizada!`;
        }
        
        // Respuestas sobre seguridad
        if (lowerMessage.includes('cosede') || lowerMessage.includes('seguro') || lowerMessage.includes('protección')) {
            return `🛡️ Tu dinero está completamente protegido:\n• COSEDE protege tus depósitos hasta $32,000\n• Supervisados por ${kb.regulators[0]}\n• Respaldados por ${kb.regulators[1]}\n\n¡Tu tranquilidad es nuestra prioridad!`;
        }
        
        // Respuestas sobre banca digital
        if (lowerMessage.includes('línea') || lowerMessage.includes('online') || lowerMessage.includes('digital')) {
            return `💻 CACME EN LÍNEA te permite:\n• Consultar saldos y movimientos\n• Realizar transferencias\n• Pagar servicios básicos\n• Y mucho más, disponible 24/7\n\n¿Necesitas ayuda para registrarte?`;
        }
        
        // Respuestas sobre emprendimientos
        if (lowerMessage.includes('emprendimiento') || lowerMessage.includes('negocio') || lowerMessage.includes('microcrédito')) {
            return `🚀 ¡Fomentamos emprendedores! Ofrecemos:\n• Microcréditos desde $500\n• Asesoría personalizada\n• Tasas preferenciales\n• ${kb.general.experience} apoyando el crecimiento\n\n¿Cuál es tu proyecto emprendedor?`;
        }
        
        // Saludos
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
            const greetings = [
                `¡Hola! 😊 Bienvenido a ${kb.general.name}, ${kb.general.experience} fomentando tu desarrollo.`,
                `¡Saludos! 👋 Soy tu asistente virtual de ${kb.general.fullName}.`,
                `¡Hola! 🌟 "${kb.general.slogan}" es nuestro compromiso contigo.`
            ];
            return greetings[Math.floor(Math.random() * greetings.length)] + ' ¿En qué puedo ayudarte hoy?';
        }
        
        // Agradecimientos
        if (lowerMessage.includes('gracias') || lowerMessage.includes('perfecto') || lowerMessage.includes('excelente')) {
            return `¡De nada! 😊 En ${kb.general.name} siempre estamos aquí para apoyarte. "${kb.general.slogan}" es más que un lema, es nuestro compromiso contigo. ¿Hay algo más en lo que pueda ayudarte?`;
        }
        
        // Despedidas
        if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('hasta luego')) {
            return `¡Hasta pronto! 👋 Recuerda que en ${kb.general.name} estamos siempre listos para apoyarte. ${kb.general.motto}. ¡Que tengas un excelente día!`;
        }
        
        // Respuesta por defecto
        const defaultResponses = [
            `🤔 Esa es una excelente pregunta. Para brindarte información más detallada, te invito a contactar a nuestros asesores al ${kb.contact.phones.mobile} o visitar cualquiera de nuestras ${kb.agencies.length} agencias.`,
            `💡 Para información específica sobre ese tema, nuestros asesores especializados pueden ayudarte mejor. Puedes llamarnos al ${kb.contact.phones.main} o escribirnos a ${kb.contact.emails.general}.`,
            `📞 Te recomiendo contactar directamente con nuestro equipo para una atención personalizada. Estamos disponibles en ${kb.contact.phones.mobile} o puedes visitarnos en nuestras agencias.`
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)] + ' ¿Hay algo más específico sobre nuestros productos que te interese?';
    },

    // Mostrar indicador de escritura
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        this.state.isTyping = true;
    },

    // Ocultar indicador de escritura
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.state.isTyping = false;
    },

    // Mostrar sugerencias
    showSuggestions(lastMessage) {
        const suggestions = this.generateSuggestions(lastMessage);
        if (suggestions.length === 0) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        // Remover sugerencias anteriores
        const existingSuggestions = messagesContainer.querySelector('.suggestions-container');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';
        
        const title = document.createElement('div');
        title.className = 'suggestions-title';
        title.textContent = 'También puedes preguntar:';
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion';
            suggestionElement.textContent = suggestion;
            suggestionElement.onclick = () => {
                this.sendQuickMessage(suggestion);
                suggestionsContainer.remove();
            };
            suggestionsDiv.appendChild(suggestionElement);
        });
        
        suggestionsContainer.appendChild(title);
        suggestionsContainer.appendChild(suggestionsDiv);
        messagesContainer.appendChild(suggestionsContainer);
        
        this.scrollToBottom();
    },

    // Generar sugerencias contextuales
    generateSuggestions(lastMessage) {
        const lowerMessage = lastMessage.toLowerCase();
        
        if (lowerMessage.includes('crédito') || lowerMessage.includes('préstamo')) {
            return ['¿Qué requisitos necesito?', '¿Cuáles son las tasas?', '¿Dónde puedo aplicar?'];
        }
        
        if (lowerMessage.includes('ahorro')) {
            return ['¿Qué tipos de ahorro tienen?', '¿Cuál es el rendimiento?', '¿Cómo abro una cuenta?'];
        }
        
        if (lowerMessage.includes('ubicación') || lowerMessage.includes('agencia')) {
            return ['Horarios de atención', '¿Cómo llego a la matriz?', 'Servicios disponibles'];
        }
        
        if (lowerMessage.includes('contacto')) {
            return ['Horarios de atención', 'Servicios por WhatsApp', 'CACME en línea'];
        }
        
        // Sugerencias generales
        return ['¿Cómo abrir una cuenta?', 'Información sobre créditos', 'Horarios de atención'];
    },

    // Scroll al final
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    },

    // Mostrar badge de notificación
    showNotificationBadge() {
        const chatButton = document.querySelector('.chat-button');
        if (!chatButton) return;
        
        let badge = chatButton.querySelector('.notification-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'notification-badge';
            badge.textContent = '1';
            chatButton.appendChild(badge);
        }
        
        // Agregar animación de pulso
        chatButton.classList.add('pulse');
    },

    // Ocultar badge de notificación
    hideNotificationBadge() {
        const chatButton = document.querySelector('.chat-button');
        if (!chatButton) return;
        
        const badge = chatButton.querySelector('.notification-badge');
        if (badge) {
            badge.remove();
        }
        
        chatButton.classList.remove('pulse');
    },

    // Actualizar actividad del usuario
    updateActivity() {
        this.state.lastActivity = Date.now();
    },

    // Manejar resize (para móviles)
    handleResize() {
        const widget = document.getElementById('chatWidget');
        if (!widget || !this.state.isOpen) return;
        
        // Ajustar altura en móviles
        if (window.innerWidth <= 768) {
            widget.style.height = '70vh';
            widget.style.maxHeight = '500px';
        } else {
            widget.style.height = '520px';
            widget.style.maxHeight = 'none';
        }
        
        this.scrollToBottom();
    },

    // Limpiar historial
    clearHistory() {
        this.state.messageHistory = [];
        Utils.setStorage('cacme_chat_history', []);
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="message bot">
                    ¡Hola! 👋 Soy tu asistente virtual de CACME. ¿En qué puedo ayudarte hoy?
                </div>
                <div class="quick-actions">
                    <div class="quick-action" onclick="ChatModule.sendQuickMessage('¿Cómo abrir una cuenta?')">Abrir cuenta</div>
                    <div class="quick-action" onclick="ChatModule.sendQuickMessage('Información sobre créditos')">Créditos</div>
                    <div class="quick-action" onclick="ChatModule.sendQuickMessage('¿Dónde están ubicados?')">Ubicaciones</div>
                    <div class="quick-action" onclick="ChatModule.sendQuickMessage('Horarios de atención')">Horarios</div>
                </div>
            `;
        }
        
        Utils.showNotification('Historial del chat limpiado', 'success');
    },

    // Exportar conversación
    exportConversation() {
        if (this.state.messageHistory.length === 0) {
            Utils.showNotification('No hay conversación para exportar', 'info');
            return;
        }
        
        const conversation = this.state.messageHistory.map(msg => {
            const time = new Date(msg.timestamp).toLocaleString('es-EC');
            const sender = msg.sender === 'user' ? 'Usuario' : 'Asistente CACME';
            return `[${time}] ${sender}: ${msg.text}`;
        }).join('\n\n');
        
        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversacion-cacme-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showNotification('Conversación exportada', 'success');
    },

    // Obtener estadísticas del chat
    getStats() {
        const totalMessages = this.state.messageHistory.length;
        const userMessages = this.state.messageHistory.filter(msg => msg.sender === 'user').length;
        const botMessages = this.state.messageHistory.filter(msg => msg.sender === 'bot').length;
        
        return {
            totalMessages,
            userMessages,
            botMessages,
            sessionId: this.state.userSession,
            lastActivity: this.state.lastActivity ? new Date(this.state.lastActivity).toLocaleString('es-EC') : null
        };
    },

    // Buscar en el historial
    searchHistory(query) {
        if (!query || query.length < 2) return [];
        
        const results = this.state.messageHistory.filter(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
        );
        
        return results.map(msg => ({
            ...msg,
            formattedTime: new Date(msg.timestamp).toLocaleString('es-EC')
        }));
    },

    // Configurar recordatorios (para futuras implementaciones)
    setReminder(message, delay) {
        setTimeout(() => {
            if (!this.state.isOpen) {
                this.addMessage(message, 'system');
                this.showNotificationBadge();
            }
        }, delay);
    },

    // Validar entrada del usuario
    validateInput(input) {
        if (!input || typeof input !== 'string') return false;
        if (input.length > 500) return false; // Límite de caracteres
        if (input.trim().length === 0) return false;
        
        // Filtro básico de spam/contenido inapropiado
        const spamPatterns = [
            /(.)\1{10,}/, // Repetición excesiva de caracteres
            /https?:\/\/[^\s]+/gi, // URLs (opcional filtrarlas)
        ];
        
        return !spamPatterns.some(pattern => pattern.test(input));
    },

    // Procesar comandos especiales (para debug/admin)
    processCommand(input) {
        if (!input.startsWith('/')) return false;
        
        const command = input.toLowerCase().substring(1);
        
        switch (command) {
            case 'clear':
                this.clearHistory();
                return true;
            case 'export':
                this.exportConversation();
                return true;
            case 'stats':
                const stats = this.getStats();
                this.addMessage(`📊 Estadísticas:\n• Total mensajes: ${stats.totalMessages}\n• Mensajes usuario: ${stats.userMessages}\n• Mensajes bot: ${stats.botMessages}\n• Última actividad: ${stats.lastActivity}`, 'system');
                return true;
            case 'help':
                this.addMessage(`ℹ️ Comandos disponibles:\n• /clear - Limpiar historial\n• /export - Exportar conversación\n• /stats - Ver estadísticas\n• /help - Mostrar ayuda`, 'system');
                return true;
            default:
                return false;
        }
    }
};

// Event listeners adicionales para funcionalidades avanzadas
document.addEventListener('DOMContentLoaded', function() {
    // Interceptar envío de mensajes para validación
    const originalSendMessage = ChatModule.sendMessage;
    ChatModule.sendMessage = function() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        // Validar entrada
        if (!this.validateInput(message)) {
            Utils.showNotification('Mensaje no válido', 'error');
            return;
        }
        
        // Procesar comandos especiales
        if (this.processCommand(message)) {
            input.value = '';
            return;
        }
        
        // Continuar con el flujo normal
        originalSendMessage.call(this);
    };
});

// Exportar para uso global
window.ChatModule = ChatModule;