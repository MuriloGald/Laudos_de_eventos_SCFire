/**
 * Gerador de PDF utilizando jsPDF e jsPDF-AutoTable
 * Gera documentos no formato exato dos Anexos do CBMSC.
 */

window.PdfGenerator = (function() {
    
    // Configurações globais
    const margin = 14;
    const pageWidth = 210; // A4 width em mm
    
    // Helper para desenhar o Cabeçalho comum
    const drawHeader = (doc, title, subtitle) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, pageWidth / 2, margin + 10, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(subtitle, pageWidth / 2, margin + 16, { align: 'center' });
        
        return margin + 25; // Retorna Y atual
    };
    
    // Helper para desenhar a Identificação do Evento (Item 1)
    const drawIdentificacao = (doc, startY, state) => {
        const c = state.cliente || {};
        const rt = window.RESPONSAVEIS_TECNICOS[state.respostas_pequeno?.rt_selecionado || state.respostas_medio?.rt_selecionado || state.respostas_grande?.rt_selecionado || 'rt1'];
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('1. IDENTIFICAÇÃO DO EVENTO', margin, startY);
        
        const bodyData = [
            [{ content: `Nome do evento: ${state.nome_evento || ''}`, colSpan: 2 }],
            [{ content: `Descrição do evento: ${state.descricao_evento || ''}`, colSpan: 2 }],
            [`Início: ${state.data_inicio || ''} Horário: ${state.hora_inicio || ''}h`, `Encerramento: ${state.data_termino || ''} Horário: ${state.hora_termino || ''}h`],
            [{ content: `Público total previsto: ${state.publico || ''} pessoas`, colSpan: 2 }],
            [`End.: ${state.logradouro_evento || ''}, Nº ${state.numero_evento || ''}`, `CEP: ${state.cep_evento || ''}`],
            [`Bairro: ${state.bairro_evento || ''}`, `Cidade: ${state.cidade_evento || ''}`],
            [{ content: `Complemento/Ponto de referência: ${state.complemento_evento || ''}`, colSpan: 2 }],
            [`Responsável pelo Evento: ${c.razao_social || ''} (CPF/CNPJ: ${c.cnpj || c.cpf || ''})`, `Fone: ${c.telefone || ''}`],
        ];
        
        if (state.porteFinal !== 'pequeno') {
            bodyData.push([`Responsável Técnico: ${rt.nome}`, `CPF: ${rt.cpf} | Fone: ${rt.telefone}`]);
        }
        
        bodyData.push(
            [{ content: 'Quadro de áreas', colSpan: 2, styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }],
            [{ content: `Área total utilizada no evento: ${state.area_total || ''} m²`, colSpan: 2 }],
            [{ content: `Área das instalações permanentes: ${state.area_permanente || ''} m²`, colSpan: 2 }],
            [{ content: `Área das estruturas provisórias: ${state.area_provisoria || ''} m²`, colSpan: 2 }]
        );
        
        doc.autoTable({
            startY: startY + 3,
            theme: 'grid',
            head: [],
            body: bodyData,
            styles: { fontSize: 9, cellPadding: 2, textColor: 0, lineColor: 0, lineWidth: 0.2 },
            columnStyles: { 0: { cellWidth: '60%' }, 1: { cellWidth: '40%' } }
        });
        
        return doc.lastAutoTable.finalY + 10;
    };
    
    // Helper para desenhar a tabela de Características
    const drawCaracteristicas = (doc, startY, state, respostas) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('2. CARACTERÍSTICAS DO EVENTO / SEGURANÇA CONTRA INCÊNDIO', margin, startY);
        
        const bodyData = [];
        let mapOrdem = [];

        if (state.porteFinal === 'pequeno') {
            mapOrdem = [
                { type: 'header', label: 'Características gerais' },
                { key: 'CGPP01' }, { key: 'CGPP02' }, { key: 'CGPP03' }, { key: 'CGPP04' },
                { type: 'header', label: 'Estruturas provisórias' },
                { key: 'PROVISORIAPP01' }, { key: 'PROVISORIAPP02' }, { key: 'PROVISORIAPP03' }, { key: 'PROVISORIAPP04' },
                { type: 'header', label: 'Instalações de Gás Combustível' },
                { key: 'GLPPP' }
            ];
        } else if (state.porteFinal === 'medio') {
            mapOrdem = [
                { type: 'header', label: 'Características gerais' },
                { key: 'CGMP01' }, { key: 'CGMP02' }, { key: 'CGMP03' }, { key: 'CGMP04' },
                { type: 'header', label: 'Estruturas provisórias' },
                { key: 'EPMP01' }, { key: 'EPMP02' }, { key: 'EPMP03' }, { key: 'EPMP04' }, { key: 'EPMP05' }, { key: 'EPMP06' }, { key: 'EPMP07' }, { key: 'EPMP08' },
                { type: 'header', label: 'SMSCI' },
                { key: 'SMSCIMP01', embedVal: 'GAS' }, { key: 'SMSCIMP02' }, { key: 'SMSCIMP03' }, { key: 'SMSCIMP04' }, { key: 'SMSCIMP05' }, { key: 'SMSCIMP06' }, { key: 'SMSCIMP07' }, { key: 'SMSCIMP08' }, { key: 'SMSCIMP09' }, { key: 'SMSCIMP10' }, { key: 'SMSCIMP11' }, { key: 'SMSCIMP12' }, { key: 'SMSCIMP13' },
                { type: 'header', label: 'Equipamentos' },
                { key: 'DEA' },
                { type: 'header', label: 'Documentação' },
                { key: 'DOCMP' }
            ];
        } else {
            mapOrdem = [
                { type: 'header', label: 'Características gerais' },
                { key: 'CGGP01' }, { key: 'CGGP02' }, { key: 'CGGP03' },
                { type: 'header', label: 'Estruturas provisórias' },
                { key: 'PROVISORIAGP01' }, { key: 'PROVISORIAGP02' }, { key: 'PROVISORIAGP03' }, { key: 'PROVISORIAGP04' }, { key: 'PROVISORIAGP05' }, { key: 'PROVISORIAGP06' }, { key: 'PROVISORIAGP07' }, { key: 'PROVISORIAGP08' },
                { type: 'header', label: 'Instalações de Gás Combustível' },
                { key: 'GLPGP01', embedVal: 'GAS' }, { key: 'GLPGP02' }, { key: 'GLPGP03' },
                { type: 'header', label: 'Sistema Preventivo por Extintores' },
                { key: 'EXTGP1' }, { key: 'EXTGP02_QTD', selfEmbed: true }, { key: 'EXTGP03_QTD', selfEmbed: true },
                { type: 'header', label: 'Saídas de Emergência' },
                { key: 'SEGP01' }, { key: 'AMBFEC', selfEmbed: true }, { key: 'SEGP03' }, { key: 'SEGP04' }, { key: 'SEGP05' }, { key: 'SEGP06' }, { key: 'SEGP07' }, { key: 'SEGP08' }, { key: 'SEGP09' }, { key: 'SEGP10' }, { key: 'SEGP11' }, { key: 'CONTROLE' }, { key: 'SEGP12' }, { key: 'SEGP13' }, { key: 'SEGP14' }, { key: 'SEGP15', embedVal: 'INCRAMP' }, { key: 'SEGP16' }, { key: 'SEGP17' },
                { type: 'header', label: 'Sistema de Iluminação de Emergência' },
                { key: 'SIEGP01' }, { key: 'SIEGP02' }, { key: 'SIEGP03' }, { key: 'LUM', selfEmbed: true },
                { type: 'header', label: 'Sinalização para Abandono de Local' },
                { key: 'SALGP01' }, { key: 'SALGP02' }, { key: 'SALGP03', embedVal: 'PLACA' }, { key: 'SALGP04' }, { key: 'SALGP05' },
                { type: 'header', label: 'Demais Sistemas e Documentos' },
                { key: 'DEMAISGP01' }, { key: 'DEMAISGP02' }, { key: 'DEMAISGP03' }, { key: 'DEMAISGP04', embedVal: 'BRIG' }, { key: 'DEMAISGP05' }, { key: 'DEMAISGP06' }, { key: 'DEMAISGP07' },
                { type: 'header', label: 'Equipamentos' },
                { key: 'EQUIPSGP' },
                { type: 'header', label: 'Documentação' },
                { key: 'DOCGP' }
            ];
        }
        
        mapOrdem.forEach(item => {
            if (item.type === 'header') {
                bodyData.push([{ content: item.label, styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }, { content: 'Status', styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }]);
            } else {
                let answer = respostas[item.key] || '';
                let status = answer;
                
                if(answer === 'sim') status = 'SIM';
                else if(answer === 'nao') status = 'NÃO';
                else if(answer === 'na') status = 'NA';
                else if(answer === 'manual_auto') status = 'MANUAL/AUTO';
                else if(answer === 'automatizado') status = 'AUTOMATIZADO';
                else if (item.selfEmbed) status = '';
                
                let questionText = window.PERGUNTAS_MAP[item.key] || item.key;
                
                if (item.embedVal) {
                    const embedAnswer = respostas[item.embedVal] || '___';
                    questionText = questionText.replace('{{VAL}}', embedAnswer);
                } else if (item.selfEmbed) {
                    questionText = questionText.replace('{{VAL}}', answer || '___');
                    status = '';
                }
                
                bodyData.push([ questionText, { content: status, styles: { halign: 'center', fontStyle: 'bold' } } ]);
            }
        });
        
        doc.autoTable({
            startY: startY + 3,
            theme: 'grid',
            head: [],
            body: bodyData,
            styles: { fontSize: 9, cellPadding: 2, textColor: 0, lineColor: 0, lineWidth: 0.2 },
            columnStyles: { 0: { cellWidth: '85%' }, 1: { cellWidth: '15%' } }
        });
        
        return doc.lastAutoTable.finalY + 10;
    };
    
    // Helper para Assinaturas
    const drawAssinaturas = (doc, startY, state, tipo) => {
        const c = state.cliente || {};
        const rt = window.RESPONSAVEIS_TECNICOS[state.respostas_pequeno?.rt_selecionado || state.respostas_medio?.rt_selecionado || state.respostas_grande?.rt_selecionado || 'rt1'];
        
        if (startY > 250) {
            doc.addPage();
            startY = margin + 10;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        if (tipo === 'pequeno') {
            doc.text('3. TERMO DE RESPONSABILIDADE', margin, startY);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            const texto = "Declaro junto ao Corpo de Bombeiros Militar de Santa Catarina (CBMSC) que estou ciente e assumo total responsabilidade pelas informações do evento temporário acima descritas, as quais enquadram o evento como sendo de Pequeno Porte, conforme a Instrução Normativa (IN) 24 do CBMSC, e que possuo o dever legal de garantir as condições de segurança do local, adotando, operacionalizando e disponibilizando os Sistemas e Medidas de Segurança Contra Incêndio (SMSCI) para o evento de acordo com as Normas de Segurança Contra Incêndio do CBMSC, em especial o artigo 18 da IN 24.\n\nDeclaro ainda estar ciente que o descumprimento das NSCI ou à inveracidade das informações prestadas ensejam infração administrativa, conforme Lei Estadual 13.157/2013, podendo ainda responder civil e criminalmente conforme a legislação vigente.";
            doc.text(texto, margin, startY + 5, { maxWidth: pageWidth - (margin*2), align: 'justify' });
            
            doc.line(pageWidth/2 - 40, startY + 60, pageWidth/2 + 40, startY + 60);
            doc.text(`Assinatura do Responsável (${c.razao_social || ''})`, pageWidth/2, startY + 65, { align: 'center' });
            
        } else {
            doc.text('3. RESPONSÁVEIS PELO EVENTO', margin, startY);
            
            // Tabela de RT e Responsável
            const rtData = [
                [{ content: 'RESPONSÁVEL TÉCNICO PELO LAUDO TÉCNICO', styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }, { content: `Nº documento de RT: ${rt.nr_rt}`, styles: { fillColor: [240, 240, 240] } }],
                [`Nome: ${rt.nome}`, `Nº C. Classe: ${rt.classe}`],
                [`End.: ${window.EMPRESA.endereco}, ${window.EMPRESA.numero}`, `CEP: ${window.EMPRESA.cep}`],
                [`Bairro: ${window.EMPRESA.bairro}`, `Cidade: ${window.EMPRESA.cidade}`],
                [{ content: `Complemento: ${window.EMPRESA.complemento}`, colSpan: 2 }],
                [`E-mail: ${window.EMPRESA.email}`, `Telefone: ${window.EMPRESA.telefone}`],
                [{ content: '\n\n_____________________________________\nAssinatura do RT', colSpan: 2, styles: { halign: 'center', minCellHeight: 25 } }],
                
                [{ content: 'RESPONSÁVEL PELO EVENTO', colSpan: 2, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }],
                [`Nome: ${c.razao_social || ''}`, `CPF/CNPJ: ${c.cnpj || ''}`],
                [`End.: ${c.logradouro || ''}, Nº ${c.numero || ''}`, `CEP: ${c.cep || ''}`],
                [`Bairro: ${c.bairro || ''}`, `Cidade: ${c.cidade || ''}`],
                [{ content: `Complemento: ${c.complemento || ''}`, colSpan: 2 }],
                [`E-mail: ${c.email || ''}`, `Telefone: ${c.telefone || ''}`],
                [{ content: '\n\n_____________________________________\nAssinatura do Responsável', colSpan: 2, styles: { halign: 'center', minCellHeight: 25 } }]
            ];
            
            doc.autoTable({
                startY: startY + 3,
                theme: 'grid',
                head: [],
                body: rtData,
                styles: { fontSize: 9, cellPadding: 2, textColor: 0, lineColor: 0, lineWidth: 0.2 },
                columnStyles: { 0: { cellWidth: '60%' }, 1: { cellWidth: '40%' } }
            });
            
            let finalY = doc.lastAutoTable.finalY + 10;
            if (finalY > 230) {
                doc.addPage();
                finalY = margin + 10;
            }
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('4. TERMO DE RESPONSABILIDADE DO RESPONSÁVEL TÉCNICO', margin, finalY);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            const texto = `Declaro junto ao Corpo de Bombeiros Militar de Santa Catarina (CBMSC) que estou ciente e assumo total responsabilidade pelas informações do evento temporário acima descritas, as quais enquadram o evento como sendo de ${tipo === 'medio' ? 'Médio Porte' : 'Grande Porte'}, conforme a Instrução Normativa (IN) 24 do CBMSC.\n\nAtesto que os SMSCI do evento, bem como eventuais estruturas montadas, estão corretamente previstos, dimensionados e serão instalados de acordo com as NSCI, estando em pleno funcionamento durante a realização do evento.\n\nDeclaro ainda estar ciente que o descumprimento das NSCI ou à inveracidade das informações prestadas ensejam infração administrativa, conforme Lei Estadual 13.157/2013, podendo ainda responder civil e criminalmente conforme a legislação vigente.`;
            doc.text(texto, margin, finalY + 5, { maxWidth: pageWidth - (margin*2), align: 'justify' });
            
            doc.text("__________________________, ____/____/____", margin, finalY + 45);
            doc.text("Local e data", margin + 25, finalY + 50);
            
            doc.text("__________________________________________", pageWidth - margin - 70, finalY + 45);
            doc.text("Assinatura do RT", pageWidth - margin - 50, finalY + 50);
        }
    };
    
    return {
        gerar: function(state) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const porte = state.porteFinal;
            let currentY = margin;
            
            if (porte === 'pequeno') {
                currentY = drawHeader(doc, 'Anexo B - Termo de Responsabilidade', 'EVENTO DE PEQUENO PORTE');
                currentY = drawIdentificacao(doc, currentY, state);
                
                currentY = drawCaracteristicas(doc, currentY, state, state.respostas_pequeno || {});
                drawAssinaturas(doc, currentY, state, 'pequeno');
                
            } else if (porte === 'medio') {
                currentY = drawHeader(doc, 'Anexo C - Laudo técnico', 'EVENTO DE MÉDIO PORTE');
                currentY = drawIdentificacao(doc, currentY, state);
                
                currentY = drawCaracteristicas(doc, currentY, state, state.respostas_medio || {});
                
                // Observações
                if (state.respostas_medio && state.respostas_medio.OBS) {
                    const obsText = `Observações: ${state.respostas_medio.OBS}`;
                    const lines = doc.splitTextToSize(obsText, pageWidth - (margin * 2));
                    doc.text(lines, margin, currentY);
                    currentY += (lines.length * 5) + 5;
                }
                
                drawAssinaturas(doc, currentY, state, 'medio');
                
            } else if (porte === 'grande') {
                // ANEXO D
                currentY = drawHeader(doc, 'Anexo D - Memorial Técnico de Segurança Contra Incêndio', 'EVENTO DE GRANDE PORTE');
                currentY = drawIdentificacao(doc, currentY, state);
                
                currentY = drawCaracteristicas(doc, currentY, state, state.respostas_grande || {});
                
                // Observações
                if (state.respostas_grande && state.respostas_grande.OBS) {
                    const obsText = `Observações: ${state.respostas_grande.OBS}`;
                    const lines = doc.splitTextToSize(obsText, pageWidth - (margin * 2));
                    doc.text(lines, margin, currentY);
                    currentY += (lines.length * 5) + 5;
                }
                
                drawAssinaturas(doc, currentY, state, 'grande');
                const fileNameD = `Laudo_${porte}_${state.nome_evento.replace(/ /g, '_')}_AnexoD.pdf`;
                doc.save(fileNameD);
                
                // ANEXO E (Laudo de Comissionamento)
                const docE = new jsPDF();
                let currentYE = margin;
                currentYE = drawHeader(docE, 'Anexo E - Laudo de Comissionamento', 'EVENTO DE GRANDE PORTE');
                currentYE = drawIdentificacao(docE, currentYE, state);
                
                // Desenhar tabela de características específicas do Anexo E
                docE.setFontSize(10);
                docE.setFont('helvetica', 'bold');
                docE.text('2. SEGURANÇA CONTRA INCÊNDIO E PÂNICO DO EVENTO', margin, currentYE);
                
                const respostasE = state.respostas_grande || {};
                const mapAnexoE = [
                    { type: 'header', label: 'Documentação' },
                    { key: 'LADOC' }, { key: 'DOCGP' },
                    { type: 'header', label: 'Estruturas provisórias' },
                    { key: 'PROVISORIAGP03' },
                    { type: 'header', label: 'Instalações de Gás Combustível' },
                    { key: 'GLPGP03' }, { key: 'GLPGP02' },
                    { type: 'header', label: 'Sistema Preventivo por Extintores' },
                    { key: 'EXTGP02_QTD', selfEmbed: true }, { key: 'EXTGP03_QTD', selfEmbed: true }, { key: 'EXTGP1' },
                    { type: 'header', label: 'Saídas de Emergência' },
                    { key: 'SEGP01' }, { key: 'LASE' }, { key: 'SEGP05' }, { key: 'SEGP06' }, { key: 'SEGP07' }, { key: 'SEGP08' }, { key: 'SEGP09' }, { key: 'SEGP10' }, { key: 'SEGP11' }, { key: 'CONTROLE' }, { key: 'SEGP12' }, { key: 'SEGP13' }, { key: 'SEGP14' }, { key: 'SEGP15', embedVal: 'INCRAMP' }, { key: 'SEGP16' }, { key: 'SEGP17' },
                    { type: 'header', label: 'Sistema de Iluminação de Emergência' },
                    { key: 'LASIE' }, { key: 'SIEGP03' }, { key: 'LUM', selfEmbed: true },
                    { type: 'header', label: 'Sinalização para Abandono de Local' },
                    { key: 'SALGP02' }, { key: 'SALGP03', embedVal: 'PLACA' }, { key: 'LASAL' }, { key: 'SALGP05' },
                    { type: 'header', label: 'Demais normativas' },
                    { key: 'LADE1' }, { key: 'DEMAISGP03' }, { key: 'DEMAISGP04', embedVal: 'BRIG' }, { key: 'DEMAISGP05' }, { key: 'LADE2' },
                    { type: 'header', label: 'Prevenção em Espetáculos Pirotécnicos' },
                    { key: 'LAPIRO1' }, { key: 'LAPIRO2' }, { key: 'LAPIRO3' }, { key: 'LAPIRO4' }, { key: 'LAPIRO5' },
                    { type: 'header', label: 'Equipamentos' },
                    { key: 'EQUIPSGP' }
                ];
                
                const bodyDataE = [];
                mapAnexoE.forEach(item => {
                    if (item.type === 'header') {
                        bodyDataE.push([{ content: item.label, styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }, { content: 'Status', styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }]);
                    } else {
                        // Se não tem piro e as perguntas são de piro, ignora
                        if (respostasE['TEM_PIRO'] !== 'sim' && item.key.startsWith('LAPIRO')) return;
                        
                        let answer = respostasE[item.key] || '';
                        let status = answer;
                        
                        if(answer === 'sim') status = 'SIM';
                        else if(answer === 'nao') status = 'NÃO';
                        else if(answer === 'na') status = 'NA';
                        else if(answer === 'manual_auto') status = 'MANUAL/AUTO';
                        else if(answer === 'automatizado') status = 'AUTOMATIZADO';
                        else if (item.selfEmbed) status = '';
                        
                        let questionText = window.PERGUNTAS_MAP[item.key] || item.key;
                        
                        if (item.embedVal) {
                            const embedAnswer = respostasE[item.embedVal] || '___';
                            questionText = questionText.replace('{{VAL}}', embedAnswer);
                        } else if (item.selfEmbed) {
                            questionText = questionText.replace('{{VAL}}', answer || '___');
                            status = '';
                        }
                        
                        // Formatação especial para EXT QTD no anexo E
                        if (item.key === 'EXTGP02_QTD') {
                            const q1 = respostasE['EXTGP02_QTD'] || '0';
                            const q2 = respostasE['EXTGP03_QTD'] || '0';
                            questionText = `Informe a quantidade total de extintores instalados no evento (portáteis e sobrerrodas): ${parseInt(q1)+parseInt(q2)} extintores.`;
                        }
                        // Omit EXTGP03_QTD as it was merged
                        if (item.key === 'EXTGP03_QTD') return;
                        
                        bodyDataE.push([ questionText, { content: status, styles: { halign: 'center', fontStyle: 'bold' } } ]);
                    }
                });
                
                docE.autoTable({
                    startY: currentYE + 3,
                    theme: 'grid',
                    head: [],
                    body: bodyDataE,
                    styles: { fontSize: 9, cellPadding: 2, textColor: 0, lineColor: 0, lineWidth: 0.2 },
                    columnStyles: { 0: { cellWidth: '85%' }, 1: { cellWidth: '15%' } }
                });
                
                currentYE = docE.lastAutoTable.finalY + 10;
                
                // Observações
                if (state.respostas_grande && state.respostas_grande.OBS) {
                    const obsText = `Observações: ${state.respostas_grande.OBS}`;
                    const lines = docE.splitTextToSize(obsText, pageWidth - (margin * 2));
                    docE.text(lines, margin, currentYE);
                    currentYE += (lines.length * 5) + 5;
                }
                
                drawAssinaturas(docE, currentYE, state, 'grande');
                const fileNameE = `Laudo_${porte}_${state.nome_evento.replace(/ /g, '_')}_AnexoE.pdf`;
                docE.save(fileNameE);
                
                return [fileNameD, fileNameE];
            }
            
            // Salvar para pequeno e medio
            const fileName = `Laudo_${porte}_${state.nome_evento.replace(/ /g, '_')}.pdf`;
            doc.save(fileName);
            
            return fileName;
        }
    };
})();
