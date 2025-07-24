document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('habilidadeForm');
    const habilidadesList = document.getElementById('habilidadesList');
    
    // Usa o hostname atual da página e porta 8000 para a API
    const API_URL = `http://${window.location.hostname}:8000`;
    
    // Carrega habilidades ao carregar a página
    carregarHabilidades();
    
    // Envia o formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const habilidade = document.getElementById('habilidade').value;
        
        try {
            const response = await fetch(`${API_URL}/habilidades/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    idade: parseInt(idade),
                    habilidade
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao cadastrar habilidade');
            }
            
            alert('Habilidade cadastrada com sucesso!');
            form.reset();
            carregarHabilidades();
        } catch (error) {
            console.error('Erro completo:', error);
            alert(`Erro: ${error.message}`);
        }
    });
    
    async function carregarHabilidades() {
        try {
            const response = await fetch(`${API_URL}/habilidades/`);
            
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            
            const habilidades = await response.json();
            
            habilidadesList.innerHTML = '';
            
            if (habilidades.length === 0) {
                habilidadesList.innerHTML = '<p class="text-center">Nenhuma habilidade cadastrada ainda.</p>';
                return;
            }
            
            habilidades.forEach(habilidade => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-3';
                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${habilidade.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Idade: ${habilidade.idade}</h6>
                            <p class="card-text">Habilidade: ${habilidade.habilidade}</p>
                            <small class="text-muted">Cadastrado em: ${new Date(habilidade.created_at).toLocaleString()}</small>
                        </div>
                    </div>
                `;
                habilidadesList.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar habilidades:', error);
            habilidadesList.innerHTML = `
                <div class="alert alert-danger">
                    Erro ao carregar habilidades: ${error.message}
                </div>
            `;
        }
    }
});