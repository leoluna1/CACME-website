/**
 * CACME - Sistema Principal de la Aplicación
 * Maneja la inicialización y coordinación de todos los módulos
 */

const App = {
    // Configuración global
    config: {
        apiBaseUrl: 'https://api.coopcacme.fin.ec',
        version: '1.0.0',
        environment: 'production'
    },

    // Estado global de la aplicación
    state: {
        currentSection: 'inicio',
        userPreferences: {},
        chatInitialized: false,
        sectionsLoaded: []
    },

    // Inicialización principal
    init() {
        console.log('🚀 Iniciando CACME App v' + this.config.version);
        
        this.loadComponents()
            .then(() => this.setupEventListeners())
            .then(() => this.initializeModules())
            .then(() => this.setupScrollEffects())
            .catch(error => {
                console.error('❌ Error inicializando la aplicación:', error);
            });
    },

    // Cargar todos los componentes HTML
    async loadComponents() {
        const components = [
            { id: 'top-bar', file: 'templates/components/top-bar.html' },
            { id: 'header', file: 'templates/components/header.html' },
            { id: 'navigation', file: 'templates/components/navigation.html' },
            { id: 'hero-section', file: 'templates/components/hero.html' },
            { id: 'chat-container', file: 'templates/components/chat.html' },
            { id: 'footer', file: 'templates/components/footer.html' }
        ];

        for (const component of components) {
            try {
                await this.loadComponent(component.id, component.file);
            } catch (error) {
                console.warn(`⚠️ No se pudo cargar ${component.file}, usando fallback`);
                this.loadFallbackComponent(component.id);
            }
        }
    },

    // Cargar un componente específico
    async loadComponent(elementId, filePath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            element.innerHTML = html;
            
            console.log(`✅ Componente ${elementId} cargado`);
        } catch (error) {
            console.warn(`⚠️ Error cargando ${filePath}:`, error);
            this.loadFallbackComponent(elementId);
        }
    },

    // Cargar componentes de respaldo (fallback)
    loadFallbackComponent(elementId) {
        const fallbacks = {
            'top-bar': this.createTopBar(),
            'header': this.createHeader(),
            'navigation': this.createNavigation(),
            'hero-section': this.createHero(),
            'chat-container': this.createChat(),
            'footer': this.createFooter()
        };

        const element = document.getElementById(elementId);
        if (element && fallbacks[elementId]) {
            element.innerHTML = fallbacks[elementId];
            console.log(`✅ Fallback para ${elementId} cargado`);
        }
    },

    // Configurar event listeners globales
    setupEventListeners() {
        // Navegación
        this.setupNavigation();
        
        // Scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Prevenir errores de formularios
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        console.log('✅ Event listeners configurados');
    },

    // Configurar navegación
    setupNavigation() {
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && navLink.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const sectionId = navLink.getAttribute('href').substring(1);
                this.navigateToSection(sectionId);
            }
        });
    },

    // Navegar a una sección
    async navigateToSection(sectionId) {
        try {
            // Actualizar estado
            this.state.currentSection = sectionId;
            
            // Cargar sección si no está cargada
            if (!this.state.sectionsLoaded.includes(sectionId)) {
                await this.loadSection(sectionId);
                this.state.sectionsLoaded.push(sectionId);
            }
            
            // Scroll suave a la sección
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            
            // Actualizar navegación activa
            this.updateActiveNavigation(sectionId);
            
        } catch (error) {
            console.error('❌ Error navegando a la sección:', error);
        }
    },

    // Cargar sección dinámica
    async loadSection(sectionId) {
        const sectionsContainer = document.getElementById('dynamic-sections');
        if (!sectionsContainer) return;

        try {
            const response = await fetch(`templates/sections/${sectionId}.html`);
            if (!response.ok) {
                // Si no existe el archivo, crear la sección con fallback
                this.createSectionFallback(sectionId, sectionsContainer);
                return;
            }
            
            const html = await response.text();
            
            // Crear contenedor para la sección
            const sectionElement = document.createElement('section');
            sectionElement.id = sectionId;
            sectionElement.innerHTML = html;
            
            sectionsContainer.appendChild(sectionElement);
            
            // Aplicar animaciones
            this.animateSection(sectionElement);
            
            console.log(`✅ Sección ${sectionId} cargada`);
            
        } catch (error) {
            console.warn(`⚠️ Error cargando sección ${sectionId}:`, error);
            this.createSectionFallback(sectionId, sectionsContainer);
        }
    },

    // Crear sección de respaldo
    createSectionFallback(sectionId, container) {
        const sections = {
            'nosotros': this.createNosotrosSection(),
            'productos': this.createProductosSection(),
            'servicios': this.createServiciosSection(),
            'clientes': this.createClientesSection(),
            'contactos': this.createContactosSection()
        };

        if (sections[sectionId]) {
            const sectionElement = document.createElement('section');
            sectionElement.id = sectionId;
            sectionElement.innerHTML = sections[sectionId];
            container.appendChild(sectionElement);
            
            this.animateSection(sectionElement);
            console.log(`✅ Sección fallback ${sectionId} creada`);
        }
    },

    // Inicializar módulos
    async initializeModules() {
        // Inicializar chat si está disponible
        if (typeof ChatModule !== 'undefined') {
            ChatModule.init();
            this.state.chatInitialized = true;
        }
        
        // Inicializar otros módulos
        this.initializeScrollSpy();
        this.initializeCarousels();
        this.initializeForms();
        
        console.log('✅ Módulos inicializados');
    },

    // Configurar efectos de scroll
    setupScrollEffects() {
        const header = document.querySelector('.header');
        const nav = document.querySelector('.nav-section');
        
        if (header && nav) {
            this.observeScrollTargets();
        }
    },

    // Manejar scroll
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Efecto en header
        const header = document.querySelector('.header');
        const nav = document.querySelector('.nav-section');
        
        if (header && nav) {
            if (scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                nav.style.background = 'rgba(30, 58, 95, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--white)';
                header.style.backdropFilter = 'none';
                nav.style.background = 'var(--primary-blue)';
                nav.style.backdropFilter = 'none';
            }
        }
    },

    // Manejar resize
    handleResize() {
        // Ajustar chat en móviles
        if (this.state.chatInitialized && typeof ChatModule !== 'undefined') {
            ChatModule.handleResize();
        }
    },

    // Manejar envío de formularios
    handleFormSubmit(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            // Validaciones adicionales aquí
            console.log('📝 Formulario enviado:', form.id || 'sin-id');
        }
    },

    // Actualizar navegación activa
    updateActiveNavigation(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeSection) {
                link.classList.add('active');
            }
        });
    },

    // Animar sección
    animateSection(section) {
        const cards = section.querySelectorAll('.service-card, .agency-card, .feature-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    // Inicializar scroll spy
    initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNavigation(sectionId);
                    this.state.currentSection = sectionId;
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    },

    // Inicializar carruseles (si los hay)
    initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            // Lógica del carrusel aquí
        });
    },

    // Inicializar formularios
    initializeForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.enhanceForm(form);
        });
    },

    // Mejorar formulario
    enhanceForm(form) {
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    },

    // Validar campo
    validateField(field) {
        // Lógica de validación aquí
        const isValid = field.checkValidity();
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
        }
    },

    // Observar targets de scroll
    observeScrollTargets() {
        const targets = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        targets.forEach(target => observer.observe(target));
    },

    // ============================================
    // COMPONENTES FALLBACK
    // ============================================

    createTopBar() {
        return `
            <div class="top-bar">
                <div class="top-bar-content">
                    <div>SÍGUENOS</div>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        `;
    },

    createHeader() {
        return `
            <div class="header-container">
                <div class="logo-section">
                    <div class="logo-main">CACME</div>
                    <div class="logo-text">
                        <div class="logo-title">CACME</div>
                        <div class="logo-subtitle">Cooperativa de Ahorro y Crédito</div>
                    </div>
                    <div class="anniversary-badge">17 Años Fomentando tu Desarrollo...</div>
                </div>
                
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>CALL: 0981045327</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>info@coopcacme.fin.ec</span>
                    </div>
                </div>
            </div>
        `;
    },

    createNavigation() {
        return `
            <div class="nav-container">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#inicio" class="nav-link inicio">INICIO</a>
                    </li>
                    <li class="nav-item">
                        <a href="#nosotros" class="nav-link">NOSOTROS</a>
                    </li>
                    <li class="nav-item">
                        <a href="#productos" class="nav-link">PRODUCTOS</a>
                    </li>
                    <li class="nav-item">
                        <a href="#servicios" class="nav-link">
                            SERVICIOS
                            <i class="fas fa-chevron-down dropdown-icon"></i>
                        </a>
                        <div class="dropdown">
                            <a href="#ahorro-programado">Ahorro Programado</a>
                            <a href="#ahorro-futuro">Ahorro Futuro</a>
                            <a href="#ahorro-infantil">Ahorro Infantil</a>
                            <a href="#inversiones">Inversiones</a>
                            <a href="#creditos">CACME Crédito</a>
                            <a href="#ahorro-vista">Ahorro a la Vista</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="#clientes" class="nav-link">CLIENTES</a>
                    </li>
                    <li class="nav-item">
                        <a href="#contactos" class="nav-link">
                            CONTACTOS
                            <i class="fas fa-search"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#cacme-online" class="nav-link cacme-online">CACME EN LÍNEA</a>
                    </li>
                </ul>
            </div>
        `;
    },

    createHero() {
        return `
            <div class="hero">
                <div class="hero-container">
                    <div class="hero-content">
                        <div class="main-logo">
                            <i class="fas fa-university"></i>
                            CACME
                        </div>
                        <h1>Haz Realidad Tus Sueños y Cumple Tus Metas</h1>
                        <div class="hero-subtitle">
                            Cooperativa de Ahorro y Crédito Mercedes Cadena - CACME LTDA.
                        </div>
                        <div class="hero-slogan">
                            "Ahorra, Crece, Vive, Bienvenido a CACME"
                        </div>
                        <div class="cta-buttons">
                            <a href="#productos" class="btn btn-primary">
                                <i class="fas fa-rocket"></i>
                                Explorar Productos
                            </a>
                            <a href="#contactos" class="btn btn-secondary">
                                <i class="fas fa-phone"></i>
                                Contáctanos
                            </a>
                        </div>
                    </div>
                    
                    <div class="hero-visual">
                        <div style="width: 400px; height: 400px; background: rgba(255,255,255,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
                            <i class="fas fa-handshake" style="font-size: 8rem; color: var(--accent-gold);"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createChat() {
        return `
            <button class="chat-button" onclick="ChatModule.toggle()" aria-label="Abrir asistente virtual">
                <i class="fas fa-comments" id="chat-icon"></i>
            </button>
            
            <div class="chat-widget" id="chatWidget">
                <div class="chat-header">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-info">
                        <h4>Asistente Virtual CACME</h4>
                        <span>En línea • Listo para ayudarte</span>
                    </div>
                    <button class="chat-close" onclick="ChatModule.toggle()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot">
                        ¡Hola! 👋 Soy tu asistente virtual de CACME. ¿En qué puedo ayudarte hoy?
                    </div>
                    <div class="quick-actions">
                        <div class="quick-action" onclick="ChatModule.sendQuickMessage('¿Cómo abrir una cuenta?')">Abrir cuenta</div>
                        <div class="quick-action" onclick="ChatModule.sendQuickMessage('Información sobre créditos')">Créditos</div>
                        <div class="quick-action" onclick="ChatModule.sendQuickMessage('¿Dónde están ubicados?')">Ubicaciones</div>
                        <div class="quick-action" onclick="ChatModule.sendQuickMessage('Horarios de atención')">Horarios</div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Escribe tu mensaje..." onkeypress="ChatModule.handleKeyPress(event)">
                    <button class="chat-send" onclick="ChatModule.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    },

    createFooter() {
        return `
            <div style="background: var(--primary-blue); color: var(--white); padding: 3rem 0 1rem;">
                <div class="container">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">CACME LTDA.</h3>
                            <p>Cooperativa de Ahorro y Crédito Mercedes Cadena</p>
                            <p><strong>"Fomentamos tu desarrollo"</strong></p>
                        </div>
                        
                        <div>
                            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Contacto</h3>
                            <p><i class="fas fa-phone" style="color: var(--accent-gold); margin-right: 0.5rem;"></i> (06) 2910327</p>
                            <p><i class="fas fa-envelope" style="color: var(--accent-gold); margin-right: 0.5rem;"></i> info@coopcacme.fin.ec</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);">
                        <p>&copy; 2025 CACME LTDA. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        `;
    },

    // ============================================
    // SECCIONES FALLBACK
    // ============================================

    createNosotrosSection() {
        return `
            <div class="section" style="background: var(--white); padding: 5rem 0;">
                <div class="container">
                    <div class="section-title">
                        <h2>QUIÉNES SOMOS</h2>
                        <p>17 años de experiencia construyendo el futuro de nuestra comunidad</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                        <div>
                            <h3 style="color: var(--primary-blue); font-size: 2rem; margin-bottom: 1.5rem;">17 Años de Confianza y Solidez</h3>
                            <p style="margin-bottom: 1.5rem; line-height: 1.8;">
                                La Cooperativa de Ahorro y Crédito Mercedes Cadena CACME LTDA. es una institución legalmente establecida y controlada por la Superintendencia de Economía Popular y Solidaria.
                            </p>
                            <p style="margin-bottom: 1.5rem; line-height: 1.8;">
                                CACME LTDA. inicia con la idea de facilitar el servicio de prestación de dinero entre los miembros de la comunidad Mercedes Cadena, ya que las entidades financieras en ese entonces no daban acogida a la gente indígena.
                            </p>
                        </div>
                        
                        <div style="background: var(--primary-blue); height: 400px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--white); font-size: 6rem;">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createProductosSection() {
        return `
            <div class="section" style="background: var(--light-gray); padding: 5rem 0;">
                <div class="container">
                    <div class="section-title">
                        <h2>Nuestros Productos Financieros</h2>
                        <p>Productos y servicios diseñados para satisfacer las necesidades de nuestros socios</p>
                    </div>
                    
                    <div class="services-grid">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-hand-holding-usd"></i>
                            </div>
                            <h3>Ahorro Programado</h3>
                            <p>Cada aporte es un paso confiable hacia tus sueños, respaldado por la solidez de CACME.</p>
                        </div>
                        
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h3>Ahorro Futuro</h3>
                            <p>Invierte a largo plazo con la seguridad y respaldo de CACME.</p>
                        </div>
                        
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-child"></i>
                            </div>
                            <h3>Ahorro Infantil</h3>
                            <p>Construye un fondo que respalde sus estudios y primeros proyectos.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createServiciosSection() {
        return `
            <div class="section" style="background: var(--primary-blue); color: var(--white); padding: 5rem 0;">
                <div class="container">
                    <div class="section-title">
                        <h2 style="color: var(--white);">Nuestras Agencias</h2>
                        <p style="color: rgba(255,255,255,0.9);">10 agencias a tu servicio en todo Ecuador</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; text-align: center;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Matriz Atuntaqui</h3>
                            <p>General Enríquez y Sucre esquina</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; text-align: center;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Riobamba</h3>
                            <p>Calle Chile y Juan Lavalle</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; text-align: center;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Quito</h3>
                            <p>Centro Histórico Venezuela y Simón Bolívar</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createClientesSection() {
        return `
            <div class="section" style="background: var(--white); padding: 5rem 0;">
                <div class="container">
                    <div class="section-title">
                        <h2>NUESTRA LABOR</h2>
                        <p>17 años fomentando el desarrollo de nuestra comunidad</p>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <p style="font-size: 1.1rem; color: var(--medium-gray); max-width: 800px; margin: 0 auto; line-height: 1.8;">
                            Agradecemos a todos ustedes por su confianza en estos 17 años de Vida Institucional. 
                            <strong style="color: var(--primary-blue);">"Fomentamos tu desarrollo"</strong> es nuestro emblema.
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                        <div style="background: var(--light-gray); padding: 2rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-store" style="font-size: 3rem; color: var(--primary-blue); margin-bottom: 1rem;"></i>
                            <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Microempresarios</h3>
                            <p>Apoyamos el crecimiento de pequeños negocios familiares.</p>
                        </div>
                        
                        <div style="background: var(--light-gray); padding: 2rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-home" style="font-size: 3rem; color: var(--primary-blue); margin-bottom: 1rem;"></i>
                            <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Familias</h3>
                            <p>Ayudamos a las familias a alcanzar sus metas de vivienda.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    createContactosSection() {
        return `
            <div class="section" style="background: var(--primary-blue); color: var(--white); padding: 5rem 0;">
                <div class="container">
                    <div class="section-title">
                        <h2 style="color: var(--white);">CONTACTOS</h2>
                        <p style="color: rgba(255,255,255,0.9);">Estamos aquí para atenderte</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                        <div style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 12px;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 2rem;">
                                <i class="fas fa-phone"></i> Teléfonos
                            </h3>
                            <p><strong>Matriz:</strong> (06) 2910327</p>
                            <p><strong>Celular:</strong> 0981045327</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 12px;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 2rem;">
                                <i class="fas fa-envelope"></i> Email
                            </h3>
                            <p><strong>General:</strong> info@coopcacme.fin.ec</p>
                            <p><strong>Gerencia:</strong> gerencia@coopcacme.fin.ec</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 12px;">
                            <h3 style="color: var(--accent-gold); margin-bottom: 2rem;">
                                <i class="fas fa-clock"></i> Horarios
                            </h3>
                            <p><strong>Lunes - Viernes:</strong> 8:00 AM - 5:00 PM</p>
                            <p><strong>Sábados:</strong> 8:00 AM - 12:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Utilidades globales
const Utils = {
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para limitar ejecución
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Formatear números para Colombia
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    },

    // Validar email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar teléfono ecuatoriano
    isValidPhone(phone) {
        const re = /^(\+593|0)?[2-9]\d{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Obtener parámetros de URL
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    // Storage local con fallback
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage no disponible');
        }
    },

    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('localStorage no disponible');
            return null;
        }
    },

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Generar ID único
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Exportar para uso global
window.App = App;
window.Utils = Utils;