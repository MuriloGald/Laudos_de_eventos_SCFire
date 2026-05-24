/**
 * Página: Dashboard
 */

window.Pages = window.Pages || {};

window.Pages.Dashboard = function() {
    const container = document.createElement('div');
    container.className = 'dashboard-page fade-in';
    
    // Obter dados do Store
    const clientes = window.Store.getClientes();
    const eventos = window.Store.getEventos();
    
    container.innerHTML = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-users stat-icon" style="color: var(--primary);"></i>
                <div class="stat-value">${clientes.length}</div>
                <div class="stat-label">Clientes Cadastrados</div>
            </div>
            
            <div class="stat-card">
                <i class="fas fa-file-signature stat-icon" style="color: var(--accent-red);"></i>
                <div class="stat-value">${eventos.length}</div>
                <div class="stat-label">Laudos Emitidos</div>
            </div>
            
            <div class="stat-card">
                <i class="fas fa-chart-pie stat-icon" style="color: var(--accent-gold);"></i>
                <div class="stat-value">0</div>
                <div class="stat-label">Eventos por Tamanho</div>
            </div>
        </div>
        
        <div class="dashboard-actions">
            <a href="#/cadastrar-cliente" class="action-card blue">
                <i class="fas fa-user-plus action-icon"></i>
                <h3 class="action-title">Cadastrar Cliente</h3>
                <p class="action-desc">Adicione uma nova empresa ou pessoa responsável à base.</p>
            </a>
            
            <a href="#/consultar-cliente" class="action-card gold">
                <i class="fas fa-search action-icon"></i>
                <h3 class="action-title">Consultar Clientes</h3>
                <p class="action-desc">Busque, edite ou inicie um evento a partir de um cliente existente.</p>
            </a>
            
            <a href="#/cadastrar-evento" class="action-card green">
                <i class="fas fa-calendar-plus action-icon"></i>
                <h3 class="action-title">Cadastrar Evento</h3>
                <p class="action-desc">Inicie o fluxo de emissão de um novo laudo de evento.</p>
            </a>
            
            <a href="#/consultar-evento" class="action-card red">
                <i class="fas fa-list-alt action-icon"></i>
                <h3 class="action-title">Consultar Eventos</h3>
                <p class="action-desc">Busque laudos emitidos por código, protocolo ou nome.</p>
            </a>
        </div>
    `;
    
    return container;
};
