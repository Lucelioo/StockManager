// Dados de exemplo das movimentações (substitua pela sua fonte de dados real)
const movimentacoesData = [
    { data: '2025-06-10 14:30', tipo: 'Entrada', produto: 'Notebook Dell Inspiron', quantidade: 50, fornecedor: 'TechSupply Ltda', responsavel: 'João Silva' },
    { data: '2025-06-10 10:15', tipo: 'Saída', produto: 'Mouse Logitech MX Master', quantidade: -25, fornecedor: 'Cliente Corporativo', responsavel: 'Maria Santos' },
    { data: '2025-06-09 16:45', tipo: 'Entrada', produto: 'Cabo HDMI', quantidade: 100, fornecedor: 'Digital Components', responsavel: 'João Silva' },
    { data: '2025-06-09 11:20', tipo: 'Saída', produto: 'Teclado Mecânico Corsair', quantidade: -15, fornecedor: 'Loja ABC', responsavel: 'Ana Costa' },
    { data: '2025-06-08 15:10', tipo: 'Entrada', produto: 'Monitor LG 24"', quantidade: 30, fornecedor: 'TechSupply Ltda', responsavel: 'João Silva' },
    { data: '2025-06-08 09:30', tipo: 'Saída', produto: 'Impressora HP LaserJet', quantidade: -8, fornecedor: 'Empresa XYZ', responsavel: 'Carlos Lima' },
    { data: '2025-06-07 13:45', tipo: 'Entrada', produto: 'SSD Samsung 1TB', quantidade: 75, fornecedor: 'Digital Components', responsavel: 'Maria Santos' },
    { data: '2025-06-07 08:15', tipo: 'Saída', produto: 'Webcam Logitech', quantidade: -12, fornecedor: 'Home Office Solutions', responsavel: 'Ana Costa' },
    { data: '2025-06-06 17:20', tipo: 'Entrada', produto: 'Roteador TP-Link', quantidade: 40, fornecedor: 'Network Pro', responsavel: 'João Silva' },
    { data: '2025-06-06 14:50', tipo: 'Saída', produto: 'Smartphone Samsung', quantidade: -20, fornecedor: 'Mobile Store', responsavel: 'Carlos Lima' }
];

let movimentacoesFiltradas = [];

// Carregar todas as movimentações ao iniciar
window.onload = function() {
    movimentacoesFiltradas = [...movimentacoesData];
    atualizarTabelaMovimentacoes();
    
    // Definir data padrão (últimos 30 dias)
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    document.getElementById('dataFim').value = hoje.toISOString().split('T')[0];
    document.getElementById('dataInicio').value = trintaDiasAtras.toISOString().split('T')[0];
};

function filtrarMovimentacoes() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione ambas as datas para filtrar.');
        return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
        alert('A data de início não pode ser posterior à data de fim.');
        return;
    }

    // Filtrar movimentações por data
    movimentacoesFiltradas = movimentacoesData.filter(mov => {
        const dataMovimentacao = mov.data.split(' ')[0]; // Pegar apenas a data (YYYY-MM-DD)
        return dataMovimentacao >= dataInicio && dataMovimentacao <= dataFim;
    });

    atualizarTabelaMovimentacoes();
}

function atualizarTabelaMovimentacoes() {
    const tbody = document.getElementById('movimentacoesTableBody');
    const totalElement = document.getElementById('totalMovimentacoes');
    
    tbody.innerHTML = '';
    
    if (movimentacoesFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma movimentação encontrada no período selecionado</td></tr>';
        totalElement.textContent = '0 movimentações encontradas';
        return;
    }

    movimentacoesFiltradas.forEach(mov => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatarData(mov.data)}</td>
            <td><span class="badge ${mov.tipo === 'Entrada' ? 'bg-success' : 'bg-danger'}">${mov.tipo}</span></td>
            <td>${mov.produto}</td>
            <td>${mov.quantidade > 0 ? '+' : ''}${mov.quantidade}</td>
            <td>${mov.fornecedor}</td>
            <td>${mov.responsavel}</td>
        `;
    });

    totalElement.textContent = `${movimentacoesFiltradas.length} movimentações encontradas`;
}

function formatarData(dataStr) {
    const data = new Date(dataStr.replace(' ', 'T'));
    return data.toLocaleString('pt-BR');
}

function gerarRelatorio() {
    const titulo = document.getElementById('tituloRelatorio').value;
    const autor = document.getElementById('autorRelatorio').value;
    const descricao = document.getElementById('descricaoRelatorio').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    // Validações básicas
    if (!titulo || !autor) {
        alert('Por favor, preencha o título e o autor do relatório.');
        return;
    }

    if (movimentacoesFiltradas.length === 0) {
        alert('Não há movimentações para gerar o relatório. Ajuste o filtro de datas.');
        return;
    }

    // Mostrar loading
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';

    // Simular tempo de processamento
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Configurações do PDF
            doc.setFont('helvetica');
            
            // Cabeçalho
            doc.setFontSize(20);
            doc.setTextColor(220, 38, 38);
            doc.text('StockManager', 20, 20);
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(titulo, 20, 35);
            
            // Informações do relatório
            doc.setFontSize(10);
            doc.text(`Autor: ${autor}`, 20, 50);
            doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 20, 55);
            doc.text(`Período: ${formatarDataSimples(dataInicio)} a ${formatarDataSimples(dataFim)}`, 20, 60);
            doc.text(`Total de movimentações: ${movimentacoesFiltradas.length}`, 20, 65);

            // Descrição
            if (descricao) {
                doc.setFontSize(12);
                doc.text('Descrição/Observações:', 20, 80);
                doc.setFontSize(10);
                const linhasDescricao = doc.splitTextToSize(descricao, 170);
                doc.text(linhasDescricao, 20, 90);
            }

            // Preparar dados da tabela
            const colunas = ['Data', 'Tipo', 'Produto', 'Qtd', 'Fornecedor/Cliente', 'Responsável'];
            const linhas = movimentacoesFiltradas.map(mov => [
                formatarData(mov.data),
                mov.tipo,
                mov.produto,
                mov.quantidade.toString(),
                mov.fornecedor,
                mov.responsavel
            ]);

            // Adicionar tabela
            doc.autoTable({
                head: [colunas],
                body: linhas,
                startY: descricao ? 110 : 75,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    overflow: 'linebreak',
                    cellWidth: 'wrap'
                },
                headStyles: {
                    fillColor: [220, 38, 38],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 15 },
                    2: { cellWidth: 40 },
                    3: { cellWidth: 15 },
                    4: { cellWidth: 35 },
                    5: { cellWidth: 25 }
                }
            });

            // Salvar o PDF
            const nomeArquivo = `relatorio_${titulo.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(nomeArquivo);

            alert('Relatório gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar o relatório. Tente novamente.');
        } finally {
            // Esconder loading
            loadingSpinner.style.display = 'none';
        }
    }, 1500);
}

function formatarDataSimples(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
}