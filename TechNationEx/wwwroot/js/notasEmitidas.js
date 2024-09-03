const statusMap = {
    1: 'Emitida',
    2: 'Cobrança Realizada',
    3: 'Pagamento em Atraso',
    4: 'Pagamento Realizado'
};

function showSwal(message, type) {
    Swal.fire({
        icon: type,
        title: message,
        confirmButtonText: 'OK'
    });
}

document.querySelector('#editNotaModal .close').addEventListener('click', function () {
    $('#editNotaModal').modal('hide');
});

document.querySelector('#addNotaModal .close').addEventListener('click', function () {
    $('#addNotaModal').modal('hide');
});

let currentPage = 1;
const pageSize = 10;

function loadNotasFiscais(page = 1) {
    const mesEmissao = document.querySelector('#filterMesEmissao').value;
    const anoEmissao = document.querySelector('#filterAnoEmissao').value;
    const status = document.querySelector('#filterStatus').value;

    // Cria a string de parâmetros apenas se eles têm valor
    const params = new URLSearchParams();
    params.append('pagina', page);
    params.append('tamanhoPagina', pageSize);
    if (mesEmissao) params.append('MesEmissao', mesEmissao);
    if (anoEmissao) params.append('AnoEmissao', anoEmissao);
    if (status) params.append('Status', status);

    fetch(`/api/notasfiscais/filtradas?${params.toString()}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (!data.items) {
                console.error('Erro: a propriedade "items" está indefinida na resposta.');
                return;
            }

            const tableBody = document.querySelector('#notasTable tbody');
            const pagination = document.querySelector('#pagination');
            tableBody.innerHTML = '';
            data.items.forEach(notaFiscal => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                        <td>${notaFiscal.nomePagador}</td>
                                        <td>${notaFiscal.numeroIdentificacao}</td>
                                        <td>${notaFiscal.dataEmissao}</td>
                                        <td>${notaFiscal.dataCobranca || '-'}</td>
                                        <td>${notaFiscal.dataPagamento || '-'}</td>
                                        <td>${notaFiscal.valor.toFixed(2)}</td>
                                        <td>${statusMap[notaFiscal.status]}</td>
                                        <td>
                                            <button class="btn btn-primary-technation" onclick="editNotaFiscal(${notaFiscal.id})"><i class="fas fa-pencil-alt"></i></button>
                                            <button class="btn btn-danger" onclick="deleteNotaFiscal(${notaFiscal.id})"><i class="fa fa-trash"></i></button>
                                        </td>
                                    `;
                tableBody.appendChild(row);
            });

            const totalPages = Math.ceil(data.totalCount / pageSize);
            pagination.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement('li');
                pageLink.className = 'page-item';
                pageLink.innerHTML = `<a class="page-link" href="#" style="color: #132b51" onclick="loadNotasFiscais(${i})">${i}</a>`;
                pagination.appendChild(pageLink);
            }
        })
        .catch(error => console.error('Erro ao carregar notas fiscais:', error));
}

function applyFilters() {
    loadNotasFiscais(1);
}

function editNotaFiscal(id) {
    fetch(`/api/notasfiscais/${id}`)
        .then(response => response.json())
        .then(notaFiscal => {
            document.querySelector('#editNotaId').value = notaFiscal.id;
            document.querySelector('#editNomePagador').value = notaFiscal.nomePagador;
            document.querySelector('#editNumeroIdentificacao').value = notaFiscal.numeroIdentificacao;
            document.querySelector('#editDataEmissao').value = notaFiscal.dataEmissao.split('T')[0];
            document.querySelector('#editDataCobranca').value = notaFiscal.dataCobranca ? notaFiscal.dataCobranca.split('T')[0] : '';
            document.querySelector('#editDataPagamento').value = notaFiscal.dataPagamento ? notaFiscal.dataPagamento.split('T')[0] : '';
            document.querySelector('#editValor').value = notaFiscal.valor;
            document.querySelector('#editStatus').value = notaFiscal.status;
            $('#editNotaModal').modal('show');
        })
        .catch(error => console.error(error));
}

function deleteNotaFiscal(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter essa ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/notasfiscais/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        loadNotasFiscais(currentPage);
                        Swal.fire(
                            'Excluído!',
                            'A nota fiscal foi excluída.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Erro!',
                            'Não foi possível excluir a nota fiscal.',
                            'error'
                        );
                    }
                })
                .catch(() => Swal.fire(
                    'Erro!',
                    'Não foi possível excluir a nota fiscal.',
                    'error'
                ));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNotasFiscais(1);
});

document.querySelector('#addNotaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const notaFiscal = {
        nomePagador: document.querySelector('#nomePagador').value,
        numeroIdentificacao: document.querySelector('#numeroIdentificacao').value,
        dataEmissao: new Date(document.querySelector('#dataEmissao').value).toISOString(),
        dataCobranca: document.querySelector('#dataCobranca').value ? new Date(document.querySelector('#dataCobranca').value).toISOString() : null,
        dataPagamento: document.querySelector('#dataPagamento').value ? new Date(document.querySelector('#dataPagamento').value).toISOString() : null,
        valor: parseFloat(document.querySelector('#valor').value),
        status: parseInt(document.querySelector('#status').value, 10),
        documentoNotaFiscal: 'notaFiscal.pdf',
        documentoBoletoBancario: 'boletoBancario.pdf'
    };

    fetch('/api/notasfiscais', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notaFiscal)
    })
        .then(response => {
            if (response.ok) {
                $('#addNotaModal').modal('hide');
                loadNotasFiscais(currentPage);
                showSwal('Nota Fiscal adicionada com sucesso!', 'success');
            } else {
                response.json().then(error => showSwal('Erro ao adicionar nota fiscal.', 'error'));
            }
        })
        .catch(() => showSwal('Erro ao adicionar nota fiscal.', 'error'));
});


document.querySelector('#editNotaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const notaFiscal = {
        id: document.querySelector('#editNotaId').value,
        nomePagador: document.querySelector('#editNomePagador').value,
        numeroIdentificacao: document.querySelector('#editNumeroIdentificacao').value,
        dataEmissao: new Date(document.querySelector('#editDataEmissao').value).toISOString(),
        dataCobranca: document.querySelector('#editDataCobranca').value ? new Date(document.querySelector('#editDataCobranca').value).toISOString() : null,
        dataPagamento: document.querySelector('#editDataPagamento').value ? new Date(document.querySelector('#editDataPagamento').value).toISOString() : null,
        valor: parseFloat(document.querySelector('#editValor').value),
        status: parseInt(document.querySelector('#editStatus').value, 10),
        documentoNotaFiscal: 'notaFiscal.pdf',
        documentoBoletoBancario: 'boletoBancario.pdf'
    };

    fetch(`/api/notasfiscais/${notaFiscal.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notaFiscal)
    })
        .then(response => {
            if (response.ok) {
                $('#editNotaModal').modal('hide');
                loadNotasFiscais(currentPage);
                showSwal('Nota Fiscal editada com sucesso!', 'success');
            } else {
                response.json().then(error => showSwal('Erro ao editar nota fiscal.', 'error'));
            }
        })
        .catch(() => showSwal('Erro ao editar nota fiscal.', 'error'));
});