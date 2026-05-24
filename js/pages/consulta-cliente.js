/**
 * Página: Consulta de Cliente
 */

window.Pages = window.Pages || {};

window.Pages.ConsultaCliente = function() {
    const container = document.createElement('div');
    container.className = 'page-container fade-in';
    
    container.innerHTML = `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>Consultar Clientes</h2>
                <p>Gerencie os responsáveis ou inicie um novo evento.</p>
            </div>
            <button class="btn btn-primary" onclick="window.Router.navigate('#/cadastrar-cliente')">
                <i class="fas fa-plus"></i> Novo Cliente
            </button>
        </div>
        
        <div class="card" style="margin-bottom: 2rem;">
            <div class="form-group" style="margin-bottom: 0;">
                <div class="search-input-wrapper" style="position: relative;">
                    <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                    <input type="text" id="search-cliente" class="form-control" placeholder="Buscar por Razão Social, CNPJ ou Responsável..." style="padding-left: 2.5rem;">
                </div>
            </div>
        </div>
        
        <div id="clientes-list" style="display: grid; gap: 1rem;">
            <!-- Renderizado via JS -->
        </div>
    `;
    
    setTimeout(() => {
        const searchInput = document.getElementById('search-cliente');
        const listContainer = document.getElementById('clientes-list');
        
        const renderList = (searchTerm = '') => {
            const clientes = window.Store.getClientes();
            
            const filtered = clientes.filter(c => {
                const term = searchTerm.toLowerCase();
                return (c.razao_social && c.razao_social.toLowerCase().includes(term)) ||
                       (c.cnpj && c.cnpj.includes(term)) ||
                       (c.nome_responsavel && c.nome_responsavel.toLowerCase().includes(term));
            });
            
            if (filtered.length === 0) {
                listContainer.innerHTML = `
                    <div class="card" style="text-align: center; padding: 3rem 1rem;">
                        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--text-muted);">Nenhum cliente encontrado</h3>
                        ${searchTerm ? `<p>Tente buscar por outro termo.</p>` : `<p>Comece cadastrando um novo cliente.</p>`}
                    </div>
                `;
                return;
            }
            
            listContainer.innerHTML = filtered.map(c => `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h3 style="margin-bottom: 0.25rem;">${c.razao_social}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                            <strong>CNPJ:</strong> ${c.cnpj || 'Não informado'} | <strong>Responsável:</strong> ${c.nome_responsavel}
                        </p>
                        <p style="font-size: 0.85rem; color: var(--primary);"><i class="fas fa-map-marker-alt"></i> ${c.cidade} - ${c.estado}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-icon" onclick="window.Router.navigate('#/editar-cliente?id=${c.id}')" title="Editar Cliente">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-primary" onclick="iniciarEvento('${c.id}')" title="Cadastrar Evento para este cliente">
                            <i class="fas fa-calendar-plus"></i> Novo Evento
                        </button>
                    </div>
                </div>
            `).join('');
        };
        
        // Define a função globalmente (temporário para o onclick)
        window.iniciarEvento = (clienteId) => {
            // Prepara um draft vazio para o wizard
            window.Store.salvarEstadoWizard({ cliente_id: clienteId });
            window.Router.navigate('#/cadastrar-evento');
        };
        
        searchInput.addEventListener('input', (e) => {
            renderList(e.target.value);
        });
        
        // Renderiza inicial
        renderList();
        
    }, 0);
    
    // Rota de edição (Pequena adaptação no router dinâmico)
    if (!window.Router.routes['#/editar-cliente']) {
        window.Router.addRoute('#/editar-cliente', (container, params) => {
            if (window.Pages.CadastroCliente) {
                container.appendChild(window.Pages.CadastroCliente(container, params));
            }
        });
    }
    
    return container;
};
