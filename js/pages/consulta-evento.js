/**
 * Página: Consulta de Eventos Emitidos
 */

window.Pages = window.Pages || {};

window.Pages.ConsultaEvento = function() {
    const container = document.createElement('div');
    container.className = 'page-container fade-in';
    
    container.innerHTML = `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>Consultar Eventos e Laudos</h2>
                <p>Veja o histórico de eventos já cadastrados e gerados.</p>
            </div>
            <button class="btn btn-primary" onclick="window.Router.navigate('#/cadastrar-evento')">
                <i class="fas fa-plus"></i> Novo Evento
            </button>
        </div>
        
        <div class="card" style="margin-bottom: 2rem;">
            <div class="form-group" style="margin-bottom: 0;">
                <div class="search-input-wrapper" style="position: relative;">
                    <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                    <input type="text" id="search-evento" class="form-control" placeholder="Buscar por código (EVT-2026-001) ou nome do evento..." style="padding-left: 2.5rem;">
                </div>
            </div>
        </div>
        
        <div id="eventos-list" style="display: grid; gap: 1rem;">
            <!-- Renderizado via JS -->
        </div>
    `;
    
    setTimeout(() => {
        const searchInput = document.getElementById('search-evento');
        const listContainer = document.getElementById('eventos-list');
        
        const renderList = (searchTerm = '') => {
            const eventos = window.Store.getEventos();
            
            const filtered = eventos.filter(e => {
                const term = searchTerm.toLowerCase();
                return (e.nome_evento && e.nome_evento.toLowerCase().includes(term)) ||
                       (e.codigo && e.codigo.toLowerCase().includes(term));
            });
            
            if (filtered.length === 0) {
                listContainer.innerHTML = `
                    <div class="card" style="text-align: center; padding: 3rem 1rem;">
                        <i class="fas fa-file-signature" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--text-muted);">Nenhum evento emitido ainda</h3>
                        ${searchTerm ? `<p>Tente buscar por outro termo.</p>` : `<p>Gere o seu primeiro laudo no botão acima.</p>`}
                    </div>
                `;
                return;
            }
            
            listContainer.innerHTML = filtered.map(e => {
                const cliente = window.Store.getCliente(e.cliente_id) || {};
                
                return `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 4px solid var(--primary);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-muted);">${e.codigo}</span>
                            <h3 style="margin-bottom: 0;">${e.nome_evento}</h3>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                            <strong>Responsável:</strong> ${cliente.razao_social || 'Desconhecido'} 
                            | <strong>Data:</strong> ${e.data_inicio} até ${e.data_termino}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="alert('Esta função visualizará os detalhes do evento emitido.')" title="Detalhes do Evento">
                            <i class="fas fa-eye"></i> Detalhes
                        </button>
                    </div>
                </div>
            `}).join('');
        };
        
        searchInput.addEventListener('input', (e) => {
            renderList(e.target.value);
        });
        
        // Renderiza inicial
        renderList();
        
    }, 0);
    
    return container;
};
