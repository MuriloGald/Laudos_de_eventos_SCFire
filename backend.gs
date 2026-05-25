function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Cria a aba Clientes se não existir
  let sheetClientes = ss.getSheetByName('Clientes');
  if (!sheetClientes) {
    sheetClientes = ss.insertSheet('Clientes');
    sheetClientes.appendRow(['ID', 'Atualizado Em', 'Dados (JSON)']);
    sheetClientes.getRange('A1:C1').setFontWeight('bold');
    sheetClientes.setFrozenRows(1);
    sheetClientes.setColumnWidth(1, 150);
    sheetClientes.setColumnWidth(2, 180);
    sheetClientes.setColumnWidth(3, 800);
  }
  
  // Cria a aba Eventos se não existir
  let sheetEventos = ss.getSheetByName('Eventos');
  if (!sheetEventos) {
    sheetEventos = ss.insertSheet('Eventos');
    sheetEventos.appendRow(['ID', 'Atualizado Em', 'Dados (JSON)']);
    sheetEventos.getRange('A1:C1').setFontWeight('bold');
    sheetEventos.setFrozenRows(1);
    sheetEventos.setColumnWidth(1, 150);
    sheetEventos.setColumnWidth(2, 180);
    sheetEventos.setColumnWidth(3, 800);
  }
  
  // Apaga a Página1 padrao se ela estiver vazia e não for a única
  let sheet1 = ss.getSheetByName('Página1');
  if (sheet1 && ss.getSheets().length > 1) {
    ss.deleteSheet(sheet1);
  }
}

// Responde a requisições GET (Baixar dados)
function doGet(e) {
  setup(); // Garante que as abas existam
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Pega os Clientes
  const sheetClientes = ss.getSheetByName('Clientes');
  const dadosClientes = sheetClientes.getDataRange().getValues();
  let clientes = [];
  if (dadosClientes.length > 1) {
    for (let i = 1; i < dadosClientes.length; i++) {
      try {
        clientes.push(JSON.parse(dadosClientes[i][2]));
      } catch(err) {}
    }
  }
  
  // Pega os Eventos
  const sheetEventos = ss.getSheetByName('Eventos');
  const dadosEventos = sheetEventos.getDataRange().getValues();
  let eventos = [];
  if (dadosEventos.length > 1) {
    for (let i = 1; i < dadosEventos.length; i++) {
      try {
        eventos.push(JSON.parse(dadosEventos[i][2]));
      } catch(err) {}
    }
  }
  
  // Retorna tudo como JSON
  const response = { status: 'success', data: { clientes: clientes, eventos: eventos } };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Responde a requisições POST (Salvar dados)
function doPost(e) {
  try {
    setup();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const item = payload.data;
    
    if (!action || !item || !item.id) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Payload invalido' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;
    
    if (action === 'saveCliente') {
      sheet = ss.getSheetByName('Clientes');
    } else if (action === 'saveEvento') {
      sheet = ss.getSheetByName('Eventos');
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Acao desconhecida' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    // Procura o ID para atualizar
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === item.id) {
        rowIndex = i + 1; // +1 porque array começa no 0 e linha no 1
        break;
      }
    }
    
    const timestamp = new Date().toISOString();
    const rowData = [item.id, timestamp, JSON.stringify(item)];
    
    if (rowIndex > -1) {
      // Atualiza linha existente
      sheet.getRange(rowIndex, 1, 1, 3).setValues([rowData]);
    } else {
      // Cria nova linha
      sheet.appendRow(rowData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
