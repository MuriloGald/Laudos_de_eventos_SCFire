/**
 * Componentes Globais da Aplicação
 */

window.Components = {};

// Header Component
window.Components.Header = function() {
    const header = document.createElement('header');
    header.className = 'app-header';
    
    header.innerHTML = `
        <div class="container header-content">
            <div class="logo-container" onclick="window.Router.navigate('#/')">
                <img src="LOGO EM 2D SC FIRE.png" alt="SC Fire Logo" class="logo-img" onerror="this.src=''; this.alt='SC FIRE'">
                <h1 class="app-title">Laudos de Eventos</h1>
            </div>
            <nav class="header-nav">
                <a href="#/" class="btn btn-icon" title="Página Inicial"><i class="fas fa-home"></i></a>
            </nav>
        </div>
    `;
    
    return header;
};
