let inadimplenciaChart = null;
let receitaChart = null;

document.addEventListener('DOMContentLoaded', function () {
    loadIndicadores();
    loadGraficos();
});

function loadIndicadores() {
    fetch(`/api/dashboard/indicadores`)
        .then(response => response.json())
        .then(data => {
            const totalNotasEmitidas = data.totalNotasEmitidas || 0;
            const totalSemCobrança = data.totalSemCobrança || 0;
            const totalInadimplente = data.totalInadimplente || 0;
            const totalAVencer = data.totalAVencer || 0;
            const totalPagas = data.totalPagas || 0;

            document.querySelector('#totalNotasEmitidas').textContent = `R$ ${totalNotasEmitidas.toFixed(2)}`;
            document.querySelector('#totalSemCobranca').textContent = `R$ ${totalSemCobrança.toFixed(2)}`;
            document.querySelector('#totalInadimplente').textContent = `R$ ${totalInadimplente.toFixed(2)}`;
            document.querySelector('#totalAVencer').textContent = `R$ ${totalAVencer.toFixed(2)}`;
            document.querySelector('#totalPagas').textContent = `R$ ${totalPagas.toFixed(2)}`;
        })
        .catch(error => console.error('Erro ao carregar indicadores:', error));
}

function loadGraficos() {
    const ano = document.querySelector('#filterAno').value;
    const trimestre = document.querySelector('#filterTrimestre').value;
    const mes = document.querySelector('#filterMes').value;

    fetch(`/api/dashboard/grafico?ano=${ano}&trimestre=${trimestre}&mes=${mes}`)
        .then(response => response.json())
        .then(data => {
            const inadimplenciaMensal = data.inadimplenciaMensal || [];
            const receitaMensal = data.receitaMensal || [];

            const ctxInadimplencia = document.getElementById('inadimplenciaChart');
            const ctxReceita = document.getElementById('receitaChart');

            var existing_inadimplenciaChart = Chart.getChart('inadimplenciaChart')
            if (existing_inadimplenciaChart) {
                existing_inadimplenciaChart.destroy();
            }

            var existing_receitaChart = Chart.getChart('receitaChart')
            if (existing_receitaChart) {
                existing_receitaChart.destroy();
            }

            if (inadimplenciaChart) {
                inadimplenciaChart.destroy();
            }
            if (receitaChart) {
                receitaChart.destroy();
            }

            inadimplenciaChart = new Chart(ctxInadimplencia, {
                type: 'bar',
                data: {
                    labels: inadimplenciaMensal.map(g => g.mes),
                    datasets: [{
                        label: 'Inadimplência',
                        data: inadimplenciaMensal.map(g => g.valor),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            receitaChart = new Chart(ctxReceita, {
                type: 'bar',
                data: {
                    labels: receitaMensal.map(g => g.mes),
                    datasets: [{
                        label: 'Receita Recebida',
                        data: receitaMensal.map(g => g.valor),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar gráficos:', error));
}

window.addEventListener('unload', function () {
    if (inadimplenciaChart) {
        inadimplenciaChart.destroy();
    }
    if (receitaChart) {
        receitaChart.destroy();
    }
});

document.querySelector('#filterAno').addEventListener('change', function () {
    loadIndicadores();
    loadGraficos();
});
document.querySelector('#filterTrimestre').addEventListener('change', function () {
    loadIndicadores();
    loadGraficos();
});
document.querySelector('#filterMes').addEventListener('change', function () {
    loadIndicadores();
    loadGraficos();
});
