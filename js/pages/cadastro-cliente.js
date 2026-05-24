/**
 * Página: Cadastro de Cliente
 */

window.Pages = window.Pages || {};

window.Pages.CadastroCliente = function(mainContainer, params) {
    const container = document.createElement('div');
    container.className = 'page-container fade-in';
    
    // Verifica se estamos em modo edição
    const isEdit = params && params.get('id');
    let clienteToEdit = null;
    
    if (isEdit) {
        clienteToEdit = window.Store.getCliente(params.get('id'));
        if (!clienteToEdit) {
            window.Router.navigate('#/consultar-cliente');
            return container;
        }
    }
    
    container.innerHTML = `
        <div class="page-header">
            <h2>${isEdit ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
            <p>Preencha os dados do responsável legal ou empresa.</p>
        </div>
        
        <div class="card">
            <form id="form-cliente">
                ${isEdit ? `<input type="hidden" id="cliente_id" value="${clienteToEdit.id}">` : ''}
                
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label for="cnpj">CNPJ</label>
                        <input type="text" id="cnpj" name="cnpj" class="form-control" data-mask="cnpj" placeholder="00.000.000/0000-00" value="${clienteToEdit?.cnpj || ''}">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="cpf">CPF (Opcional)</label>
                        <input type="text" id="cpf" name="cpf" class="form-control" data-mask="cpf" placeholder="000.000.000-00" value="${clienteToEdit?.cpf || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="razao_social">Razão Social / Nome da Empresa</label>
                    <input type="text" id="razao_social" name="razao_social" class="form-control" required value="${clienteToEdit?.razao_social || ''}">
                </div>
                
                <div class="form-group">
                    <label for="nome_responsavel">Nome do Responsável Legal</label>
                    <input type="text" id="nome_responsavel" name="nome_responsavel" class="form-control" required value="${clienteToEdit?.nome_responsavel || ''}">
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label for="telefone">Telefone</label>
                        <input type="text" id="telefone" name="telefone" class="form-control" data-mask="phone" required placeholder="(00) 00000-0000" value="${clienteToEdit?.telefone || ''}">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" name="email" class="form-control" required value="${clienteToEdit?.email || ''}">
                    </div>
                </div>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--primary);">Endereço</h3>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label for="cep">CEP</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="cep" name="cep" class="form-control" data-mask="cep" required placeholder="00000-000" value="${clienteToEdit?.cep || ''}">
                            <button type="button" id="btn-buscar-cep" class="btn btn-secondary">Buscar</button>
                        </div>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="estado">Estado</label>
                        <input type="text" id="estado" name="estado" class="form-control" required maxlength="2" placeholder="SC" value="${clienteToEdit?.estado || 'SC'}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label for="cidade">Cidade</label>
                        <input type="text" id="cidade" name="cidade" class="form-control" required value="${clienteToEdit?.cidade || ''}">
                    </div>
                    <div class="form-group" style="flex: 2;">
                        <label for="bairro">Bairro</label>
                        <input type="text" id="bairro" name="bairro" class="form-control" required value="${clienteToEdit?.bairro || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 3;">
                        <label for="logradouro">Logradouro / Endereço</label>
                        <input type="text" id="logradouro" name="logradouro" class="form-control" required value="${clienteToEdit?.logradouro || ''}">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="numero">Número</label>
                        <input type="text" id="numero" name="numero" class="form-control" required value="${clienteToEdit?.numero || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="complemento">Complemento (Opcional)</label>
                    <input type="text" id="complemento" name="complemento" class="form-control" value="${clienteToEdit?.complemento || ''}">
                </div>
                
                <div class="form-actions" style="margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="window.Router.navigate('#/')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Cliente</button>
                </div>
            </form>
        </div>
    `;
    
    // Adiciona lógica após o elemento estar no DOM
    setTimeout(() => {
        // Aplica máscaras
        if (window.applyMasks) window.applyMasks();
        
        const form = document.getElementById('form-cliente');
        const btnBuscaCep = document.getElementById('btn-buscar-cep');
        const cepInput = document.getElementById('cep');
        
        // Busca CEP
        btnBuscaCep.addEventListener('click', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) {
                alert('CEP inválido');
                return;
            }
            
            btnBuscaCep.textContent = 'Buscando...';
            btnBuscaCep.disabled = true;
            
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                
                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                    document.getElementById('numero').focus();
                } else {
                    alert('CEP não encontrado.');
                }
            } catch (err) {
                alert('Erro ao buscar CEP.');
            } finally {
                btnBuscaCep.textContent = 'Buscar';
                btnBuscaCep.disabled = false;
            }
        });
        
        // Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Valida CNPJ/CPF básicos se informados
            const cnpj = document.getElementById('cnpj').value;
            const cpf = document.getElementById('cpf').value;
            
            if (cnpj && !window.validarCNPJ(cnpj)) {
                window.showError(document.getElementById('cnpj'), 'CNPJ Inválido');
                return;
            } else {
                window.clearError(document.getElementById('cnpj'));
            }
            
            if (cpf && !window.validarCPF(cpf)) {
                window.showError(document.getElementById('cpf'), 'CPF Inválido');
                return;
            } else {
                window.clearError(document.getElementById('cpf'));
            }
            
            if (!cnpj && !cpf) {
                alert('Por favor, informe o CNPJ ou CPF.');
                return;
            }
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const idInput = document.getElementById('cliente_id');
            if (idInput) {
                data.id = idInput.value;
            }
            
            window.Store.salvarCliente(data);
            
            alert('Cliente salvo com sucesso!');
            window.Router.navigate('#/consultar-cliente');
        });
        
    }, 0);
    
    return container;
};
