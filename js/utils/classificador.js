/**
 * Lógica de Classificação de Porte do Evento baseado na IN 24 CBMSC
 */

function classificarEvento(respostas) {
    // respostas = {
    //   arLivreSemDelimitacao: true/false,
    //   arLivreComDelimitacao: true/false, publicoArLivre: number,
    //   cobertoAberto: true/false, publicoCobertoAberto: number,
    //   cobertoFechado: true/false, publicoCobertoFechado: number
    // }
    
    let porteSugerido = 'pequeno'; // Default inicial
    let nivelPorte = 1; // 1 = Pequeno, 2 = Médio, 3 = Grande

    // O porte final do evento é definido pela situação de MAIOR risco encontrada.

    // 1. Ar livre sem delimitação (Sempre Pequeno Porte se for apenas isso)
    if (respostas.arLivreSemDelimitacao) {
        // nivel já é 1
    }

    // 2. Ar livre com delimitação
    if (respostas.arLivreComDelimitacao) {
        let pub = parseInt(respostas.publicoArLivre) || 0;
        if (pub > 2500) {
            nivelPorte = Math.max(nivelPorte, 3);
        } else if (pub > 1000) {
            nivelPorte = Math.max(nivelPorte, 2);
        } else {
            nivelPorte = Math.max(nivelPorte, 1);
        }
    }

    // 3. Coberto e aberto nas laterais
    if (respostas.cobertoAberto) {
        let pub = parseInt(respostas.publicoCobertoAberto) || 0;
        if (pub > 1250) {
            nivelPorte = Math.max(nivelPorte, 3);
        } else if (pub > 500) {
            nivelPorte = Math.max(nivelPorte, 2);
        } else {
            nivelPorte = Math.max(nivelPorte, 1);
        }
    }

    // 4. Coberto e fechado nas laterais
    if (respostas.cobertoFechado) {
        let pub = parseInt(respostas.publicoCobertoFechado) || 0;
        if (pub > 500) {
            nivelPorte = Math.max(nivelPorte, 3);
        } else if (pub > 100) {
            nivelPorte = Math.max(nivelPorte, 2);
        } else {
            nivelPorte = Math.max(nivelPorte, 1);
        }
    }

    // Traduz o nível para string
    if (nivelPorte === 3) return 'grande';
    if (nivelPorte === 2) return 'medio';
    return 'pequeno';
}

window.ClassificadorEventos = { classificarEvento };
