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
                
                let botoesDownload = '';
                if (Array.isArray(e.arquivo)) {
                    botoesDownload = `
                        <button class="btn btn-primary" onclick="window.Pages.ConsultaEvento.baixarPdf('${e.codigo}', 'anexod')" title="Baixar Anexo D">
                            <i class="fas fa-file-pdf"></i> Anexo D
                        </button>
                        <button class="btn btn-primary" onclick="window.Pages.ConsultaEvento.baixarPdf('${e.codigo}', 'anexoe')" title="Baixar Anexo E">
                            <i class="fas fa-file-pdf"></i> Anexo E
                        </button>
                    `;
                } else {
                    botoesDownload = `
                        <button class="btn btn-primary" onclick="window.Pages.ConsultaEvento.baixarPdf('${e.codigo}', 'ambos')" title="Baixar Laudo">
                            <i class="fas fa-download"></i> Baixar
                        </button>
                    `;
                }
                
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
                        <button class="btn btn-secondary" onclick="window.Pages.ConsultaEvento.abrirModal('${e.codigo}')" title="Ver Respostas">
                            <i class="fas fa-eye"></i> Detalhes
                        </button>
                        <button class="btn btn-warning" onclick="window.Pages.ConsultaEvento.editar('${e.codigo}')" title="Editar e Gerar Novamente">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        ${botoesDownload}
                        <button class="btn btn-danger" onclick="window.Pages.ConsultaEvento.excluir('${e.codigo}')" title="Excluir">
                            <i class="fas fa-trash"></i>
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
        
        // Modal logic
        window.Pages.ConsultaEvento.abrirModal = function(codigo) {
            const eventos = window.Store.getEventos();
            const e = eventos.find(ev => ev.codigo === codigo);
            if(!e) return;
            
            const cliente = window.Store.getCliente(e.cliente_id) || {};
            const respostas = e.respostas_pequeno || e.respostas_medio || e.respostas_grande || {};
            
            let respostasHtml = '';
            for (const [key, value] of Object.entries(respostas)) {
                if (key !== 'subStep' && value !== '') {
                    let displayVal = value;
                    if(value === 'sim') displayVal = '<span style="color: var(--success); font-weight: bold;">Sim</span>';
                    if(value === 'nao') displayVal = '<span style="color: var(--accent-red); font-weight: bold;">Não</span>';
                    if(value === 'na') displayVal = '<span style="color: var(--text-muted);">Não se aplica</span>';
                    if(value === 'manual_auto') displayVal = 'Manual ou automatizado';
                    if(value === 'automatizado') displayVal = 'Automatizado (>1000 pessoas)';
                    
                    const questionLabel = window.PERGUNTAS_MAP && window.PERGUNTAS_MAP[key] ? window.PERGUNTAS_MAP[key] : key.replace(/_/g, ' ');
                    
                    respostasHtml += `
                        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; gap: 1rem; align-items: center;">
                            <span style="font-size: 0.9rem; color: var(--text-muted); flex: 1;">${questionLabel}</span>
                            <span style="font-weight: 600; font-size: 0.95rem; text-align: right; min-width: 120px;">${displayVal}</span>
                        </div>
                    `;
                }
            }
            
            const modalHtml = `
                <div id="eventoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem;">
                    <div class="card fade-in" style="width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; background: var(--surface);">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                            <h3 style="margin: 0; color: var(--primary);"><i class="fas fa-clipboard-list"></i> Detalhes do Evento (${e.codigo})</h3>
                            <button onclick="document.getElementById('eventoModal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                        </div>
                        
                        <h4 style="color: var(--primary-dark); margin-bottom: 0.5rem;">Informações Básicas</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div><strong>Nome:</strong> ${e.nome_evento}</div>
                            <div><strong>Porte:</strong> <span style="text-transform: capitalize;">${e.porteFinal}</span></div>
                            <div><strong>Data:</strong> ${e.data_inicio} até ${e.data_termino}</div>
                            <div><strong>Público:</strong> ${e.publico} pessoas</div>
                            <div><strong>Responsável:</strong> ${cliente.razao_social}</div>
                            <div><strong>Emissão:</strong> ${new Date(e.data_emissao).toLocaleString('pt-BR')}</div>
                        </div>
                        
                        <h4 style="color: var(--primary-dark); margin-bottom: 0.5rem;">Respostas do Questionário</h4>
                        <div style="background: #f9fafb; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                            ${respostasHtml}
                        </div>
                        
                        ${e.locais ? `
                        <h4 style="color: var(--primary-dark); margin-bottom: 0.5rem;">Tabela de Locais Cadastrados</h4>
                        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                            <table class="table" style="font-size: 0.85rem; margin-bottom: 0; min-width: 600px;">
                                <thead style="background: var(--bg-color);">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Boate</th>
                                        <th>Público</th>
                                        <th>Qtd. Saídas</th>
                                        <th>Largura Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${JSON.parse(e.locais).map(l => `
                                        <tr>
                                            <td>${l.nome || '-'}</td>
                                            <td>${l.boate || '-'}</td>
                                            <td>${l.publico || '-'}</td>
                                            <td>${l.qtd || '-'}</td>
                                            <td>${l.largura || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : ''}
                        
                        <div style="text-align: center;">
                            <button class="btn btn-primary" onclick="document.getElementById('eventoModal').remove()">Fechar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        };
        
        window.Pages.ConsultaEvento.excluir = function(codigo) {
            if(confirm('Tem certeza que deseja excluir o histórico deste evento? O laudo não poderá mais ser baixado.')) {
                let eventos = window.Store.getEventos();
                eventos = eventos.filter(e => e.codigo !== codigo);
                localStorage.setItem('scfire_eventos', JSON.stringify(eventos));
                renderList();
            }
        };
        
        window.Pages.ConsultaEvento.baixarPdf = function(codigo, tipo) {
            const eventos = window.Store.getEventos();
            const e = eventos.find(ev => ev.codigo === codigo);
            if(e) {
                try {
                    window.PdfGenerator.gerar(e, tipo);
                } catch(err) {
                    console.error("Erro ao gerar PDF:", err);
                    alert("Ocorreu um erro ao gerar o PDF. Verifique se os dados estão corretos.");
                }
            }
        };
        
        window.Pages.ConsultaEvento.editar = function(codigo) {
            const eventos = window.Store.getEventos();
            const e = eventos.find(ev => ev.codigo === codigo);
            if(e) {
                // Guarda o evento inteiro no rascunho para reabrir o form
                window.Store.salvarEstadoWizard(e);
                window.Router.navigate('#/cadastrar-evento');
            }
        };
        
    }, 0);
    
    return container;
};
