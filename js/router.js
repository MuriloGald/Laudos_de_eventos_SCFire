/**
 * Sistema de Roteamento SPA
 */

const Router = {
    routes: {},
    currentRoute: null,
    
    // Registra as rotas e suas funções de inicialização e destruição
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Trata o clique nos links para garantir que o menu recolha, etc.
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                // Pode adicionar comportamento extra aqui, como fechar menu mobile
            }
        });
        
        // Carrega a rota inicial
        this.handleRoute();
    },
    
    addRoute(path, renderFn, cleanupFn) {
        this.routes[path] = {
            render: renderFn,
            cleanup: cleanupFn
        };
    },
    
    handleRoute() {
        let hash = window.location.hash || '#/';
        
        // Extrai rota base e params (ex: #/editar-cliente?id=123)
        const parts = hash.split('?');
        const path = parts[0];
        
        const queryString = parts[1] || '';
        const params = new URLSearchParams(queryString);
        
        // Limpa a rota anterior se existir
        if (this.currentRoute && this.routes[this.currentRoute] && this.routes[this.currentRoute].cleanup) {
            this.routes[this.currentRoute].cleanup();
        }
        
        this.currentRoute = path;
        
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = ''; // Limpa o container
        
        // Renderiza Header (Pode ser otimizado para não renderizar toda vez)
        appContainer.appendChild(window.Components.Header());
        
        // Container principal da rota
        const main = document.createElement('main');
        main.className = 'container page-transition';
        main.id = 'main-content';
        appContainer.appendChild(main);
        
        // Renderiza a rota atual
        if (this.routes[path]) {
            this.routes[path].render(main, params);
        } else {
            // Rota 404 fallback
            main.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent-red); margin-bottom: 1rem;"></i>
                    <h2>Página não encontrada</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">A página que você tentou acessar não existe.</p>
                    <a href="#/" class="btn btn-primary">Voltar ao Início</a>
                </div>
            `;
        }
        
        // Faz o scroll para o topo ao mudar de rota
        window.scrollTo(0, 0);
        
        // Reaplica máscaras
        if (window.applyMasks) window.applyMasks();
    },
    
    navigate(path) {
        window.location.hash = path;
    }
};

window.Router = Router;
