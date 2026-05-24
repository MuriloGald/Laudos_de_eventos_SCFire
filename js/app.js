/**
 * Inicialização da Aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Store (Local Storage)
    window.Store.init();
    
    // Evitar que o scroll do mouse altere inputs numéricos acidentalmente
    document.addEventListener('wheel', function(event) {
        if (document.activeElement.type === 'number') {
            document.activeElement.blur();
        }
    });
    
    // 2. Define as rotas usando o Router
    
    // Rota: Dashboard
    window.Router.addRoute('#/', (container) => {
        if (window.Pages && window.Pages.Dashboard) {
            container.appendChild(window.Pages.Dashboard());
        } else {
            container.innerHTML = '<p>Carregando Dashboard...</p>';
        }
    });
    
    // Rota: Cadastrar Cliente
    window.Router.addRoute('#/cadastrar-cliente', (container) => {
        if (window.Pages && window.Pages.CadastroCliente) {
            container.appendChild(window.Pages.CadastroCliente());
        }
    });
    
    // Rota: Consultar Cliente
    window.Router.addRoute('#/consultar-cliente', (container) => {
        if (window.Pages && window.Pages.ConsultaCliente) {
            container.appendChild(window.Pages.ConsultaCliente());
        }
    });
    
    // Rota: Cadastrar Evento
    window.Router.addRoute('#/cadastrar-evento', (container) => {
        if (window.Pages && window.Pages.CadastroEvento) {
            container.appendChild(window.Pages.CadastroEvento());
        }
    });
    
    // Rota: Consultar Evento
    window.Router.addRoute('#/consultar-evento', (container) => {
        if (window.Pages && window.Pages.ConsultaEvento) {
            container.appendChild(window.Pages.ConsultaEvento());
        }
    });
    
    // 3. Inicia o Router (vai ler o hash atual e renderizar a rota)
    window.Router.init();
});
