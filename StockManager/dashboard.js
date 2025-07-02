        // Bloco de dados para o gráfico.
        // Substitua estes dados de exemplo pelos seus dados reais, vindos de um banco de dados ou API.
        const chartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Entradas',
                data: [50, 75, 120, 90, 110, 150, 130, 160, 140, 180, 200, 220],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            }, {
                label: 'Saídas',
                data: [40, 60, 100, 80, 100, 130, 110, 140, 120, 160, 180, 200],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            }]
        };

        // Bloco de configuração geral do gráfico.
        // Define o tipo de gráfico, os dados a serem usados e as opções de visualização.
        const chartConfig = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f8f9fa'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#f8f9fa' },
                        grid: { color: '#374151' }
                    },
                    y: {
                        ticks: { color: '#f8f9fa' },
                        grid: { color: '#374151' }
                    }
                }
            }
        };

        // Cria e renderiza o gráfico no elemento <canvas> com o ID 'estoqueChart'.
        const estoqueChart = new Chart(
            document.getElementById('estoqueChart'),
            chartConfig
        );

// Lógica para os botões de filtro do gráfico
const filterButtons = document.querySelectorAll('.chart-filters .btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões do grupo.
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona a classe 'active' apenas ao botão que foi clicado.
        button.classList.add('active');

        const filter = button.dataset.filter;

        // Define a visibilidade dos datasets com base no filtro selecionado.
        // O dataset de 'Entradas' é o primeiro (índice 0) e 'Saídas' é o segundo (índice 1).
        estoqueChart.data.datasets[0].hidden = !(filter === 'entradas' || filter === 'ambos');
        estoqueChart.data.datasets[1].hidden = !(filter === 'saidas' || filter === 'ambos');

        // Atualiza o gráfico para renderizar as mudanças de visibilidade.
        estoqueChart.update();
    });
});