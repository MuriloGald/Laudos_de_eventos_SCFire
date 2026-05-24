/**
 * Gerenciamento de Estado e Persistência (Local Storage / Mock API)
 */

const Store = {
    // Inicializa a store
    init() {
        if (!localStorage.getItem('scfire_clientes')) {
            localStorage.setItem('scfire_clientes', JSON.stringify([]));
        }
        if (!localStorage.getItem('scfire_eventos')) {
            localStorage.setItem('scfire_eventos', JSON.stringify([]));
        }
    },

    // Gera um ID unico
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    // CLIENTES
    getClientes() {
        return JSON.parse(localStorage.getItem('scfire_clientes')) || [];
    },

    getCliente(id) {
        return this.getClientes().find(c => c.id === id);
    },

    salvarCliente(cliente) {
        const clientes = this.getClientes();
        
        if (cliente.id) {
            // Update
            const index = clientes.findIndex(c => c.id === cliente.id);
            if (index !== -1) {
                clientes[index] = { ...clientes[index], ...cliente, updated_at: new Date().toISOString() };
            } else {
                clientes.push(cliente);
            }
        } else {
            // Create
            cliente.id = this.generateId();
            cliente.created_at = new Date().toISOString();
            clientes.push(cliente);
        }
        
        localStorage.setItem('scfire_clientes', JSON.stringify(clientes));
        return cliente;
    },

    // EVENTOS
    getEventos() {
        return JSON.parse(localStorage.getItem('scfire_eventos')) || [];
    },

    getEvento(id) {
        return this.getEventos().find(e => e.id === id);
    },

    salvarEvento(evento) {
        const eventos = this.getEventos();
        
        if (evento.id) {
            // Update
            const index = eventos.findIndex(e => e.id === evento.id);
            if (index !== -1) {
                eventos[index] = { ...eventos[index], ...evento, updated_at: new Date().toISOString() };
            } else {
                eventos.push(evento);
            }
        } else {
            // Create
            evento.id = this.generateId();
            
            // Gera um código interno, ex: EVT-2026-001
            const count = eventos.length + 1;
            const ano = new Date().getFullYear();
            evento.codigo = `EVT-${ano}-${count.toString().padStart(3, '0')}`;
            
            evento.created_at = new Date().toISOString();
            eventos.push(evento);
        }
        
        localStorage.setItem('scfire_eventos', JSON.stringify(eventos));
        return evento;
    },
    
    // ESTADO TEMPORÁRIO DO WIZARD
    salvarEstadoWizard(dados) {
        localStorage.setItem('scfire_wizard_draft', JSON.stringify(dados));
    },
    
    getEstadoWizard() {
        return JSON.parse(localStorage.getItem('scfire_wizard_draft')) || {};
    },
    
    limparEstadoWizard() {
        localStorage.removeItem('scfire_wizard_draft');
    }
};

window.Store = Store;
