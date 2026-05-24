/**
 * Questionário: Grande Porte (Anexo D)
 * Possui sub-etapas internas com perguntas EXATAS do modelo.
 */

window.FormsGrande = function(state, avancarCallback) {
    const container = document.createElement('div');
    container.className = 'fade-in';
    
    let formState = state.respostas_grande || {};
    let subStep = formState.subStep || 1;
    
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
    
    const renderSubStep = () => {
        container.innerHTML = '';
        
        const form = document.createElement('form');
        form.id = 'form-grande-porte';
        
        const totalSteps = 7;
        let progressHtml = '<div style="display: flex; gap: 4px; margin-bottom: 2rem;">';
        for(let i=1; i<=totalSteps; i++) {
            progressHtml += `<div style="flex: 1; height: 6px; border-radius: 3px; background-color: ${subStep >= i ? 'var(--primary)' : 'var(--border-color)'}"></div>`;
        }
        progressHtml += '</div>';
        
        let contentHtml = '';
        
        if (subStep === 1) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">1/7 - Características Gerais</h4>
                ${renderQuestion('CGGP01', 'O evento será realizado ao ar livre com delimitação de área e previsão de público acima de 2.500 pessoas?')}
                ${renderQuestion('CGGP02', 'O evento será realizado em local ou estrutura coberto e aberto nas laterais, possuindo ou não delimitação de área por barreira física nas laterais, desde que estas não comprometam a ventilação, com previsão de público acima de 1.250 pessoas?')}
                ${renderQuestion('CGGP03', 'O evento será realizado em local ou estrutura coberto e fechado nas laterais com previsão de público acima de 500 pessoas?')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Estruturas provisórias</h4>
                ${renderQuestion('PROVISORIAGP01', 'Serão utilizadas tendas ou blocos de tendas, ambos com mais de 100 m² ou sem afastamento?')}
                ${renderQuestion('PROVISORIAGP02', 'Serão utilizadas arquibancadas provisórias?')}
                ${renderQuestion('PROVISORIAGP03', 'Serão utilizadas estruturas como tablados, camarotes e estruturas congêneres destinadas ao público, com nível superior a 60 cm de altura do seu piso em relação ao solo?')}
                ${renderQuestion('PROVISORIAGP04', 'Serão utilizados grandes brinquedos mecânicos denominados “atrações”, como os de parques temáticos ou de diversão?')}
                ${renderQuestion('PROVISORIAGP05', 'Serão utilizadas estruturas tais como pontes, passarelas e similares?')}
                ${renderQuestion('PROVISORIAGP06', 'Serão utilizadas estruturas metálicas?')}
                ${renderQuestion('PROVISORIAGP07', 'Serão utilizadas instalações elétricas, englobando iluminação, sonorização, gerador de emergência, dentre outros dispositivos energizados?')}
                ${renderQuestion('PROVISORIAGP08', 'Serão utilizadas estruturas relacionadas a esportes de aventura?')}
            `;
        } 
        else if (subStep === 2) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">2/7 - Instalações de Gás e Extintores</h4>
                
                <div class="question-block" id="block-gas">
                    <div class="question-text">Haverá uso de GLP?</div>
                    <div class="radio-group mb-2">
                        <label class="radio-label"><input type="radio" name="GLPGP01" value="sim" ${formState['GLPGP01'] === 'sim' ? 'checked' : ''} required> Sim</label>
                        <label class="radio-label"><input type="radio" name="GLPGP01" value="nao" ${formState['GLPGP01'] === 'nao' ? 'checked' : ''}> Não</label>
                        <label class="radio-label"><input type="radio" name="GLPGP01" value="na" ${formState['GLPGP01'] === 'na' ? 'checked' : ''}> Não se aplica</label>
                    </div>
                    <div id="div-gas-qtd" class="form-group mt-3 ${formState['GLPGP01'] === 'sim' ? '' : 'hidden'}">
                        <label>Se sim, informe a quantidade (kg):</label>
                        <input type="number" name="GAS" class="form-control" value="${formState['GAS'] || ''}">
                    </div>
                </div>
                ${renderQuestion('GLPGP02', 'A instalação de gás combustível atenderá aos requisitos da IN 8?')}
                ${renderQuestion('GLPGP03', 'Os recipientes estarão posicionados em locais comprovadamente sem acesso ao público e protegidos das intempéries?')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Sistema Preventivo por Extintores</h4>
                ${renderQuestion('EXTGP1', 'A proteção por extintores atende aos requisitos da IN 6?')}
                
                <div class="form-row mt-3 mb-4">
                    <div class="form-group" style="flex: 1;">
                        <label>Informe a quantidade de extintores portáteis previstos para o evento:</label>
                        <input type="number" name="EXTGP02_QTD" class="form-control" value="${formState['EXTGP02_QTD'] || ''}" placeholder="Qtd" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Informe a quantidade de extintores sobrerrodas previstos para o evento:</label>
                        <input type="number" name="EXTGP03_QTD" class="form-control" value="${formState['EXTGP03_QTD'] || ''}" placeholder="Qtd" required>
                    </div>
                </div>
            `;
        }
        else if (subStep === 3) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">3/7 - Saídas de Emergência (Parte 1)</h4>
                ${renderQuestion('SEGP01', 'As saídas de emergência atendem aos requisitos da IN 9?')}
                
                <div class="form-group mb-4">
                    <label>Informe a quantidade de estruturas com delimitação de área e ambientes fechados que terão concentração de público no evento:</label>
                    <input type="number" name="AMBFEC" class="form-control" value="${formState['AMBFEC'] || ''}" placeholder="Ex: 2" required>
                </div>
                
                ${renderQuestion('SEGP03', 'Identifique no item 3 deste memorial, todas as estruturas com delimitação de área e ambientes fechados informadas no item anterior, informando as características do local, previsão de público, área, distância máxima a ser percorrida, quantidade e largura total das saídas de emergência para cada um deles.')}
                ${renderQuestion('SEGP04', 'Existem, no mínimo, duas alternativas de saídas de emergência para cada ambiente com reunião de público que possibilitem diferentes sentidos de fuga?')}
                ${renderQuestion('SEGP05', 'Foram atendidas as larguras mínimas das rotas de fuga horizontais (acessos) e verticais (escadas e rampas)?')}
                ${renderQuestion('SEGP06', 'Para eventos que se assemelham a boates ou shows musicais, quando realizados em locais cobertos e fechados nas laterais, foram atendidas as larguras mínimas admitidas das portas conforme a IN 9?')}
                ${renderQuestion('SEGP07', 'As portas de saída são do tipo “de abrir” e têm sentido de abertura igual ao do fluxo de saída?')}
            `;
        }
        else if (subStep === 4) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">4/7 - Saídas de Emergência (Parte 2)</h4>
                ${renderQuestion('SEGP08', 'As portas que não abrem no sentido do fluxo de saída permanecerão abertas durante toda a realização do evento?')}
                ${renderQuestion('SEGP09', 'Foram previstas barras antipânico nas portas de saída?')}
                ${renderQuestion('SEGP10', 'Foi prevista área de dispersão?')}
                ${renderQuestion('SEGP11', 'Será fixada placa próximo à entrada, com dimensões mínimas de 40 x 20 cm, indicando a lotação máxima autorizada para o local?')}
                
                <div class="question-block">
                    <div class="question-text">Foi previsto controle de lotação de público? Selecione:</div>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        <label class="radio-label" style="justify-content: flex-start; text-align: left; padding: 1rem;">
                            <input type="radio" name="CONTROLE" value="manual_auto" ${formState['CONTROLE'] === 'manual_auto' ? 'checked' : ''} required> 
                            <span>Manual ou automatizado, para eventos ao ar livre ou cobertos sem fechamento lateral, mas que tenham delimitação de área por barreiras físicas nas laterais, com público superior a 5.000 pessoas e nos eventos em locais cobertos e fechados nas laterais para público até 1.000 pessoas.</span>
                        </label>
                        <label class="radio-label" style="justify-content: flex-start; text-align: left; padding: 1rem;">
                            <input type="radio" name="CONTROLE" value="automatizado" ${formState['CONTROLE'] === 'automatizado' ? 'checked' : ''}>
                            <span>Automatizado, para eventos em locais cobertos e fechados nas laterais com público acima de 1.000 pessoas.</span>
                        </label>
                        <label class="radio-label" style="justify-content: flex-start; text-align: left; padding: 1rem;">
                            <input type="radio" name="CONTROLE" value="na" ${formState['CONTROLE'] === 'na' ? 'checked' : ''}>
                            <span>Não se aplica</span>
                        </label>
                    </div>
                </div>
                
                ${renderQuestion('SEGP12', 'Para controle de público automatizado, foi previsto monitor ou placar eletrônico exibindo a lotação existente no local?')}
            `;
        }
        else if (subStep === 5) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">5/7 - Saídas de Emergência (Parte 3) e Iluminação</h4>
                ${renderQuestion('SEGP13', 'Para eventos em locais cobertos, as distâncias máximas a serem percorridas atendem à Tabela 9 do Anexo C da IN 9?')}
                ${renderQuestion('SEGP14', 'Os parâmetros mínimos para as arquibancadas são atendidos conforme a IN 9?')}
                
                <div class="question-block">
                    <div class="question-text">Foram atendidas as exigências da IN 9 para as rampas?</div>
                    <div class="radio-group mb-2">
                        <label class="radio-label"><input type="radio" name="SEGP15" value="sim" ${formState['SEGP15'] === 'sim' ? 'checked' : ''} required> Sim</label>
                        <label class="radio-label"><input type="radio" name="SEGP15" value="nao" ${formState['SEGP15'] === 'nao' ? 'checked' : ''}> Não</label>
                        <label class="radio-label"><input type="radio" name="SEGP15" value="na" ${formState['SEGP15'] === 'na' ? 'checked' : ''}> Não se aplica</label>
                    </div>
                    <div id="div-rampa-inc" class="form-group mt-3 ${formState['SEGP15'] === 'sim' ? '' : 'hidden'}">
                        <label>Informe a inclinação máxima das rampas prevista para o evento (%):</label>
                        <input type="number" name="INCRAMP" class="form-control" value="${formState['INCRAMP'] || ''}" placeholder="Ex: 8">
                    </div>
                </div>
                
                ${renderQuestion('SEGP16', 'O evento conta com escadas de emergência conforme a IN 9? Se sim, seus critérios são atendidos?')}
                ${renderQuestion('SEGP17', 'O local do evento possui passarelas? Se sim, atende aos requisitos da IN 9?')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Sistema de Iluminação de Emergência</h4>
                ${renderQuestion('SIEGP01', 'O Sistema de Iluminação de Emergência atende aos requisitos da IN 11?')}
                ${renderQuestion('SIEGP02', 'Foram previstas luminárias de emergência em todos os locais com desníveis, mudanças de direção e intersecções de corredores na rota de fuga, etc?')}
                ${renderQuestion('SIEGP03', 'A distância máxima entre dois pontos de SIE atende ao limite de quatro vezes a altura de instalação destes em relação ao piso?')}
                
                <div class="form-group mb-4">
                    <label>Informe a quantidade total de luminárias previstas para o evento:</label>
                    <input type="number" name="LUM" class="form-control" value="${formState['LUM'] || ''}" required>
                </div>
            `;
        }
        else if (subStep === 6) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">6/7 - Sinalização, Demais Normativas e Brigadistas</h4>
                
                <h4 class="mb-2" style="color: var(--primary); font-size: 1.1rem;">Sinalização para Abandono de Local</h4>
                ${renderQuestion('SALGP01', 'O Sistema de Sinalização para Abandono de Local atende aos requisitos da IN 13?')}
                ${renderQuestion('SALGP02', 'Foram previstas placas de SAL para assinalar todas as mudanças de direção, saídas, obstáculos, etc, de tal forma que em cada ponto de SAL seja possível visualizar o ponto seguinte?')}
                
                <div class="question-block">
                    <div class="question-text">Foram previstas placas indicativas de fluxo?</div>
                    <div class="radio-group mb-2">
                        <label class="radio-label"><input type="radio" name="SALGP03" value="sim" ${formState['SALGP03'] === 'sim' ? 'checked' : ''} required> Sim</label>
                        <label class="radio-label"><input type="radio" name="SALGP03" value="nao" ${formState['SALGP03'] === 'nao' ? 'checked' : ''}> Não</label>
                        <label class="radio-label"><input type="radio" name="SALGP03" value="na" ${formState['SALGP03'] === 'na' ? 'checked' : ''}> Não se aplica</label>
                    </div>
                    <div id="div-pla-qtd" class="form-group mt-3 ${formState['SALGP03'] === 'sim' ? '' : 'hidden'}">
                        <label>Se sim, indique a quantidade de placas:</label>
                        <input type="number" name="PLACA" class="form-control" value="${formState['PLACA'] || ''}">
                    </div>
                </div>
                
                ${renderQuestion('SALGP04', 'As placas de SAL possuem as dimensões mínimas e distâncias de visualização que atendam o previsto na Tabela 1 - Anexo A da IN 13?')}
                ${renderQuestion('SALGP05', 'Para eventos que se assemelham a boates ou shows musicais realizados em locais cobertos e fechados nas laterais, foram previstas placas luminosas que devem permanecer constantemente iluminadas durante todo o evento?')}
                
                <h4 class="mb-2 mt-4" style="color: var(--primary); font-size: 1.1rem;">Demais normativas</h4>
                ${renderQuestion('DEMAISGP01', 'Serão utilizados materiais de acabamento e revestimento de acordo com a IN 18 - CMAR?')}
                ${renderQuestion('DEMAISGP02', 'Havendo espetáculo pirotécnico, este atende aos requisitos da IN 27?')}
                ${renderQuestion('DEMAISGP03', 'O grupo motogerador previsto possui o devido isolamento e exaustão de gases da combustão?')}
                
                <div class="question-block">
                    <div class="question-text">Os brigadistas previstos atendem aos requisitos da IN 28, com a emissão da respectiva DRT de dimensionamento?</div>
                    <div class="radio-group mb-2">
                        <label class="radio-label"><input type="radio" name="DEMAISGP04" value="sim" ${formState['DEMAISGP04'] === 'sim' ? 'checked' : ''} required> Sim</label>
                        <label class="radio-label"><input type="radio" name="DEMAISGP04" value="nao" ${formState['DEMAISGP04'] === 'nao' ? 'checked' : ''}> Não</label>
                        <label class="radio-label"><input type="radio" name="DEMAISGP04" value="na" ${formState['DEMAISGP04'] === 'na' ? 'checked' : ''}> Não se aplica</label>
                    </div>
                    <div id="div-brig-qtd" class="form-group mt-3 ${formState['DEMAISGP04'] === 'sim' ? '' : 'hidden'}">
                        <label>Informe a quantidade de brigadistas prevista para o evento:</label>
                        <input type="number" name="BRIG" class="form-control" value="${formState['BRIG'] || ''}">
                    </div>
                </div>
            `;
        }
        else if (subStep === 7) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">7/7 - Demais Normativas (Cont.), Equipamentos e Documentação</h4>
                ${renderQuestion('DEMAISGP05', 'O acesso de viaturas foi previsto e atende aos requisitos da IN 35?')}
                ${renderQuestion('DEMAISGP06', 'Caso sejam necessários outros SMSCI, de acordo com as Tabelas 1 e 2 da IN 24, estes foram previstos e atendem aos requisitos normativos?')}
                ${renderQuestion('DEMAISGP07', 'O croqui apresentado contempla todas estruturas e o dimensionamento e localização de todos os SMSCI previstos para o evento, conforme as NSCI?')}
                
                <h4 class="mb-2 mt-4" style="color: var(--primary); font-size: 1.1rem;">Equipamentos</h4>
                ${renderQuestion('EQUIPSGP', 'Sendo o público previsto igual ou superior a 1.500 pessoas, foi previsto desfibrilador externo automático (DEA)?')}
                
                <h4 class="mb-2 mt-4" style="color: var(--primary); font-size: 1.1rem;">Documentação</h4>
                ${renderQuestion('DOCGP', 'Os documentos previstos no Artigo 34 da IN 24, referentes ao dimensionamento dos SMSCI e de eventuais estruturas previstas para o evento, foram emitidos e estão de acordo com as NSCI?')}
                
                <div class="form-group mt-4 mb-4">
                    <label>Observações:</label>
                    <textarea name="OBS" class="form-control" rows="3" placeholder="Insira observações relevantes aqui...">${formState['OBS'] || ''}</textarea>
                </div>
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Responsável Técnico (RT)</h4>
                <div class="form-group mb-4">
                    <label>Selecione o RT que assinará o Laudo</label>
                    <select name="rt_selecionado" class="form-control" required>
                        <option value="">-- Selecione --</option>
                        <option value="rt1" ${formState.rt_selecionado === 'rt1' ? 'selected' : ''}>Dione Borges</option>
                        <option value="rt2" ${formState.rt_selecionado === 'rt2' ? 'selected' : ''}>Paulo Roberto Ramos</option>
                    </select>
                </div>
            `;
        }
        
        const actionsHtml = `
            <div class="form-actions mt-4">
                <button type="button" id="btn-back-sub" class="btn btn-secondary">Voltar</button>
                <button type="submit" class="btn btn-primary">${subStep === totalSteps ? 'Revisar e Gerar PDF <i class="fas fa-check"></i>' : 'Próxima <i class="fas fa-arrow-right"></i>'}</button>
            </div>
        `;
        
        form.innerHTML = progressHtml + contentHtml + actionsHtml;
        container.appendChild(form);
        
        // Condicionais
        const setupRadioToggle = (radioName, divId, reqInputNames = []) => {
            if (form.querySelector(`input[name="${radioName}"]`)) {
                const radios = form.querySelectorAll(`input[name="${radioName}"]`);
                const div = document.getElementById(divId);
                
                radios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        if (e.target.value === 'sim') {
                            div.classList.remove('hidden');
                            reqInputNames.forEach(n => {
                                const inp = form.querySelector(`input[name="${n}"]`);
                                if(inp) inp.setAttribute('required', 'true');
                            });
                        } else {
                            div.classList.add('hidden');
                            reqInputNames.forEach(n => {
                                const inp = form.querySelector(`input[name="${n}"]`);
                                if(inp) {
                                    inp.removeAttribute('required');
                                    inp.value = '';
                                }
                            });
                        }
                    });
                });
            }
        };
        
        if(subStep === 2) setupRadioToggle('GLPGP01', 'div-gas-qtd', ['GAS']);
        if(subStep === 5) setupRadioToggle('SEGP15', 'div-rampa-inc', ['INCRAMP']);
        if(subStep === 6) {
            setupRadioToggle('SALGP03', 'div-pla-qtd', ['PLACA']);
            setupRadioToggle('DEMAISGP04', 'div-brig-qtd', ['BRIG']);
        }
        
        document.getElementById('btn-back-sub').addEventListener('click', () => {
            const formData = new FormData(form);
            formState = { ...formState, ...Object.fromEntries(formData.entries()) };
            
            if (subStep > 1) {
                subStep--;
                renderSubStep();
            } else {
                avancarCallback(2, { respostas_grande: formState });
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formState = { ...formState, ...Object.fromEntries(formData.entries()) };
            
            if (subStep < totalSteps) {
                subStep++;
                renderSubStep();
            } else {
                avancarCallback(4, { respostas_grande: formState });
            }
        });
    };
    
    setTimeout(renderSubStep, 0);
    
    return container;
};
