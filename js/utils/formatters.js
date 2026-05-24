// Formata CPF
function formatCPF(value) {
    if (!value) return '';
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Formata CNPJ
function formatCNPJ(value) {
    if (!value) return '';
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Formata CPF ou CNPJ (detecta pelo tamanho)
function formatCpfCnpj(value) {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 11) {
        return formatCPF(raw);
    }
    return formatCNPJ(raw);
}

// Formata CEP
function formatCEP(value) {
    if (!value) return '';
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

// Formata Telefone
function formatPhone(value) {
    if (!value) return '';
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 10) {
        return raw
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }
    return raw
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Aplica máscaras nos inputs
function applyMasks() {
    document.querySelectorAll('[data-mask="cpf"]').forEach(el => {
        el.addEventListener('input', e => e.target.value = formatCPF(e.target.value));
    });
    
    document.querySelectorAll('[data-mask="cnpj"]').forEach(el => {
        el.addEventListener('input', e => e.target.value = formatCNPJ(e.target.value));
    });
    
    document.querySelectorAll('[data-mask="cpfcnpj"]').forEach(el => {
        el.addEventListener('input', e => e.target.value = formatCpfCnpj(e.target.value));
    });
    
    document.querySelectorAll('[data-mask="cep"]').forEach(el => {
        el.addEventListener('input', e => e.target.value = formatCEP(e.target.value));
    });
    
    document.querySelectorAll('[data-mask="phone"]').forEach(el => {
        el.addEventListener('input', e => e.target.value = formatPhone(e.target.value));
    });
}
