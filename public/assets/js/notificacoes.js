import logout from '/js.utils/logout.js';

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

let notifications = [
            {
                id: 1,
                group: 'Hoje',
                title: 'Pagamento Fatura de Cartão Aprovado',
                message: 'O pagamento referente à fatura do mês atual no valor de R$ 1.250,00 foi processado com sucesso.',
                time: '10:42',
                category: 'finance',
                categoryLabel: 'Financeiro',
                read: false,
                icon: 'credit-card',
                urgent: true
            },
            {
                id: 2,
                group: 'Hoje',
                title: 'Tentativa de Login Suspeita',
                message: 'Detectamos um novo acesso à sua conta a partir de um dispositivo não reconhecido em São Paulo, SP.',
                time: '08:15',
                category: 'security',
                categoryLabel: 'Segurança',
                read: false,
                icon: 'shield-alert',
                urgent: true
            },
            {
                id: 3,
                group: 'Hoje',
                title: 'Atualização do Sistema Agendada',
                message: 'O sistema passará por manutenção programada no próximo domingo entre 02:00 e 04:00 da manhã.',
                time: '07:30',
                category: 'system',
                categoryLabel: 'Sistema',
                read: true,
                icon: 'cpu',
                urgent: false
            },
            {
                id: 4,
                group: 'Ontem',
                title: 'Relatório Mensal Disponível',
                message: 'Seu relatório de movimentações financeiras do último mês já está pronto para download em PDF.',
                time: 'Ontem às 18:20',
                category: 'finance',
                categoryLabel: 'Financeiro',
                read: false,
                icon: 'file-text',
                urgent: false
            },
            {
                id: 5,
                group: 'Ontem',
                title: 'Sua Senha Foi Alterada',
                message: 'A senha da sua conta principal foi alterada com sucesso via aplicativo móvel.',
                time: 'Ontem às 14:05',
                category: 'security',
                categoryLabel: 'Segurança',
                read: true,
                icon: 'key-round',
                urgent: false
            },
            {
                id: 6,
                group: 'Esta Semana',
                title: 'Bem-vindo ao StartFreela!',
                message: 'Sua conta foi criada com sucesso. Configure suas preferências de notificação para uma experiência personalizada.',
                time: 'Segunda às 09:00',
                category: 'system',
                categoryLabel: 'Sistema',
                read: false,
                icon: 'sparkles',
                urgent: false
            }
        ];

let currentFilter = 'all';
let activeNotificationId = null;

// Filtros
function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-brand-blue', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-600');
    });
    event.target.classList.add('bg-brand-blue', 'text-white', 'shadow-sm');
    event.target.classList.remove('text-slate-600');
    renderNotifications();
}

const nomeCategorias = ['all', 'unread', 'system', 'finance', 'security'];
const categorias = document.querySelectorAll('#category');
for(let i = 0; i < categorias.length; i++){
    categorias[i].addEventListener('click', () => {
        filterCategory(nomeCategorias[i]);
    });
};

function handleSearch() {
    renderNotifications();
}

// Alternar status de Leitura
function toggleReadStatus(id) {
    const item = notifications.find(n => n.id === id);
    if (item) {
        item.read = !item.read;
        renderNotifications();
        updateStats();
    }
}

// Seleção em Lote
function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
}

function markSelectedAsRead() {
    const selected = document.querySelectorAll('.item-checkbox:checked');
    selected.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        const item = notifications.find(n => n.id === id);
        if (item) item.read = true;
    });
    renderNotifications();
    updateStats();
}

// Atualizar Estatísticas
function updateStats() {
    const unread = notifications.filter(n => !n.read).length;
    const urgent = notifications.filter(n => n.urgent && !n.read).length;
    
    document.getElementById('stat-unread').innerText = unread;
    document.getElementById('stat-urgent').innerText = urgent;
    document.getElementById('stat-total').innerText = notifications.length;
}


function closeDetailPanel() {
    console.log('clicou em fechar');
    const panel = document.getElementById('detail-panel');
    const overlay = document.getElementById('detail-panel-overlay');

    panel.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    renderNotifications();
    updateStats();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();
    updateStats();
    lucide.createIcons();
});

// Renderização dos Itens
function renderNotifications() {
    const container = document.getElementById('notifications-container');
    container.innerHTML = '';

    const searchValue = document.getElementById('search-input').value.toLowerCase();

    // Filtragem
    let filtered = notifications.filter(n => {
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'unread' ? !n.read :
            n.category === currentFilter;
        
        const matchesSearch = n.title.toLowerCase().includes(searchValue) || n.message.toLowerCase().includes(searchValue);
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="bell-off" class="w-8 h-8"></i>
                </div>
                <h3 class="text-base font-bold text-slate-800">Nenhuma notificação encontrada</h3>
                <p class="text-xs text-slate-500 mt-1">Tente mudar o filtro ou termo de busca.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Agrupar por Grupo (Hoje, Ontem, etc.)
    const groups = [...new Set(filtered.map(n => n.group))];

    groups.forEach(groupName => {
        const groupItems = filtered.filter(n => n.group === groupName);
        
        const groupSection = document.createElement('div');
        groupSection.className = 'space-y-3';
        
        groupSection.innerHTML = `
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">${groupName}</h3>
            <div class="space-y-2" id="group-list-${groupName.replace(/\s+/g, '')}"></div>
        `;

        container.appendChild(groupSection);
        const listContainer = document.getElementById(`group-list-${groupName.replace(/\s+/g, '')}`);

        groupItems.forEach(item => {
            const card = document.createElement('div');
            card.className = `group bg-white p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md ${
                item.read 
                    ? 'border-slate-200 opacity-80 bg-slate-50/50' 
                    : 'border-brand-blue/30 bg-white shadow-sm ring-1 ring-brand-blue/10'
            }`;

            card.onclick = (e) => {
                if (e.target.tagName !== 'INPUT') {
                    openDetailPanel(item.id);
                }
            };

            card.innerHTML = `
                <div class="flex items-center gap-3.5 flex-1 min-w-0">
                    <!-- Checkbox Batch -->
                    <input type="checkbox" data-id="${item.id}" class="item-checkbox w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue">
                    
                    <!-- Ícone da Categoria -->
                    <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        item.urgent 
                            ? 'bg-brand-yellowLight text-brand-yellow' 
                            : 'bg-brand-blueLight text-brand-blue'
                    }">
                        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                    </div>

                    <!-- Texto -->
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                            <h4 class="text-sm font-bold text-slate-900 truncate ${!item.read ? 'text-brand-blue' : ''}">${item.title}</h4>
                            ${!item.read ? '<span class="w-2 h-2 rounded-full bg-brand-yellow shrink-0"></span>' : ''}
                        </div>
                        <p class="text-xs text-slate-500 truncate">${item.message}</p>
                    </div>
                </div>

                <!-- Data e Ações Rápidas -->
                <div class="flex items-center gap-3 shrink-0">
                    <span class="text-xs font-medium text-slate-400">${item.time}</span>
                    <button onclick="event.stopPropagation(); toggleReadStatus(${item.id})" class="p-1.5 text-slate-400 hover:text-brand-blue rounded-lg hover:bg-slate-100 transition" title="${item.read ? 'Marcar como não lida' : 'Marcar como lida'}">
                        <i data-lucide="${item.read ? 'mail-unread' : 'mail-check'}" class="w-4 h-4"></i>
                    </button>
                </div>
            `;

            listContainer.appendChild(card);
        });
    });

    lucide.createIcons();
}

// Modal de Configurações
function openConfigModal() {
    const modal = document.getElementById('config-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeConfigModal() {
    const modal = document.getElementById('config-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 200);
}

// Painel Lateral de Detalhes
function openDetailPanel(id) {
    const item = notifications.find(n => n.id === id);
    if (!item) return;

    activeNotificationId = id;
    item.read = true; // Marcar como lido automaticamente ao abrir
    renderNotifications();
    updateStats();

    document.getElementById('panel-title').innerText = item.title;
    document.getElementById('panel-content').innerText = item.message;
    document.getElementById('panel-time').innerText = item.time;
    document.getElementById('panel-badge').innerText = item.categoryLabel;

    const panel = document.getElementById('detail-panel');
    const overlay = document.getElementById('detail-panel-overlay');

    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        panel.classList.remove('translate-x-full');
    }, 10);

    document.getElementById('closeDetail').addEventListener('click', () => {
        closeDetailPanel();
    });

    document.getElementById('panel-delete-btn').onclick = () => {
        deleteNotification(id);
        closeDetailPanel();
    };
}

document.getElementById('detail-panel-overlay').addEventListener('click', () => {
    closeDetailPanel();
});