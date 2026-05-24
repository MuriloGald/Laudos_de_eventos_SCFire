/**
 * Questionário: Pequeno Porte (Anexo B)
 */

window.FormsPequeno = function(state, avancarCallback) {
    const container = document.createElement('div');
    container.className = 'fade-in';
    
    // Recupera dados salvos do step 3 se houver
    const formState = state.respostas_pequeno || {};
    
    // Helper para gerar rádio buttons Sim/Não/NA
    const renderQuestion = (name, label, options = window.OPCOES_RESPOSTA) => {
        const val = formState[name] || '';
        const radios = options.map(opt => `
            <label class="radio-label">
                <input type="radio" name="${name}" value="${opt.value}" ${val === opt.value ? 'checked' : ''} required>
                ${opt.label}
            </label>
        `).join('');
        
        return `
            <div class="question-block">
                <div class="question-text">${label}</div>
                <div class="radio-group">
                    ${radios}
                </div>
            </div>
        `;
    };
    
    container.innerHTML = `
        <form id="form-pequeno-porte">
            <h4 class="mb-3" style="color: var(--primary);">Características gerais</h4>
            ${renderQuestion('CGPP01', 'O evento será realizado ao ar livre, sem delimitação de área?')}
            ${renderQuestion('CGPP02', 'O evento será realizado ao ar livre, com delimitação de área e com limitação de público de até 1.000 pessoas?')}
            ${renderQuestion('CGPP03', 'O evento será realizado em local ou estrutura coberto e aberto nas laterais, possuindo ou não delimitação de área por barreira física nas laterais, desde que estas não comprometam a ventilação, com previsão de público de até 500 pessoas?')}
            ${renderQuestion('CGPP04', 'O evento será realizado em local ou estrutura coberto e fechado nas laterais, com previsão de público de até 100 pessoas?')}
            
            <h4 class="mb-3 mt-4" style="color: var(--primary);">Instalações de Gás Combustível</h4>
            ${renderQuestion('GLPPP', 'Será utilizado mais de 90 kg de GLP?')}
            
            <h4 class="mb-3 mt-4" style="color: var(--primary);">Estruturas provisórias</h4>
            ${renderQuestion('PROVISORIAPP01', 'Serão utilizadas tendas ou blocos de tendas com mais de 100 m² cada, que não possuam isolamento de no mínimo 2 metros entre si?')}
            ${renderQuestion('PROVISORIAPP02', 'Serão utilizadas arquibancadas provisórias?')}
            ${renderQuestion('PROVISORIAPP03', 'Serão utilizadas estruturas provisórias como tablados, camarotes e estruturas congêneres destinadas ao público, essas com nível superior a 60 cm de altura do seu piso em relação ao solo?')}
            ${renderQuestion('PROVISORIAPP04', 'Serão utilizados grandes brinquedos mecânicos denominados “atrações”, como os de parques temáticos ou de diversão?')}
            
            <h4 class="mb-3 mt-4" style="color: var(--primary);">Responsável Técnico (RT)</h4>
            <div class="form-group mb-4">
                <label>Selecione o RT que assinará o Laudo</label>
                <select name="rt_selecionado" class="form-control" required>
                    <option value="">-- Selecione --</option>
                    <option value="rt1" ${formState.rt_selecionado === 'rt1' ? 'selected' : ''}>Dione Borges</option>
                    <option value="rt2" ${formState.rt_selecionado === 'rt2' ? 'selected' : ''}>Paulo Roberto Ramos</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="button" id="btn-back-3" class="btn btn-secondary">Voltar</button>
                <button type="submit" class="btn btn-primary">Revisar e Gerar PDF <i class="fas fa-check"></i></button>
            </div>
        </form>
    `;
    
    setTimeout(() => {
        document.getElementById('btn-back-3').addEventListener('click', () => {
            const formData = new FormData(document.getElementById('form-pequeno-porte'));
            const respostas_pequeno = Object.fromEntries(formData.entries());
            avancarCallback(2, { respostas_pequeno });
        });
        
        document.getElementById('form-pequeno-porte').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const respostas_pequeno = Object.fromEntries(formData.entries());
            avancarCallback(4, { respostas_pequeno });
        });
    }, 0);
    
    return container;
};
