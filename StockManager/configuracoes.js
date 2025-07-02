// Show Settings Section
function showSettingsSection(sectionName) {
    // Remove active class from all nav items
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Hide all sections
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    event.target.closest('.settings-nav-item').classList.add('active');
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
}

// Preview Avatar
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarPreview = document.getElementById('avatarPreview');
            avatarPreview.style.backgroundImage = `url(${e.target.result})`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            avatarPreview.innerHTML = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Salvar Perfil
function salvarPerfil() {
    const nome = document.getElementById('nomeCompleto').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cargo = document.getElementById('cargo').value;
    
    if (!nome || !email) {
        showAlert('Nome e email são obrigatórios!', 'danger');
        return;
    }
    
    // Simular salvamento
    showAlert('Perfil atualizado com sucesso!', 'success');
}

// Alterar Senha
function alterarSenha() {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        showAlert('Todos os campos de senha são obrigatórios!', 'danger');
        return;
    }
    
    if (novaSenha !== confirmarSenha) {
        showAlert('As senhas não coincidem!', 'danger');
        return;
    }
    
    if (novaSenha.length < 6) {
        showAlert('A nova senha deve ter pelo menos 6 caracteres!', 'warning');
        return;
    }
    
    // Simular alteração de senha
    showAlert('Senha alterada com sucesso!', 'success');
    
    // Limpar campos
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';
}

// Fazer Backup
function fazerBackup() {
    showAlert('Backup iniciado! Você será notificado quando estiver concluído.', 'success');
    
    // Simular progresso do backup
    setTimeout(() => {
        showAlert('Backup concluído com sucesso!', 'success');
    }, 3000);
}

// Agendar Backup
function agendarBackup() {
    const backupModal = new bootstrap.Modal(document.getElementById('backupModal'));
    backupModal.show();
}

// Salvar Agendamento de Backup
function salvarAgendamentoBackup() {
    const frequencia = document.getElementById('frequenciaBackup').value;
    const horario = document.getElementById('horarioBackup').value;
    const email = document.getElementById('emailBackup').value;
    
    if (!email) {
        showAlert('Email é obrigatório para notificações!', 'danger');
        return;
    }
    
    showAlert(`Backup ${frequencia} agendado para ${horario}!`, 'success');
    
    const backupModal = bootstrap.Modal.getInstance(document.getElementById('backupModal'));
    backupModal.hide();
}

// Restaurar Backup
function restaurarBackup() {
    const backupFile = document.getElementById('backupFile').files[0];
    
    if (!backupFile) {
        showAlert('Selecione um arquivo de backup!', 'danger');
        return;
    }
    
    if (confirm('ATENÇÃO: Esta ação irá sobrescrever todos os dados atuais. Deseja continuar?')) {
        showAlert('Restauração iniciada! O sistema será reiniciado após a conclusão.', 'warning');
        
        // Simular restauração
        setTimeout(() => {
            showAlert('Backup restaurado com sucesso!', 'success');
        }, 5000);
    }
}

// Enviar Suporte
function enviarSuporte() {
    const email = document.getElementById('emailSuporte').value;
    const categoria = document.getElementById('categoriaSuporte').value;
    const assunto = document.getElementById('assuntoSuporte').value;
    const descricao = document.getElementById('descricaoSuporte').value;
    
    if (!email || !categoria || !assunto || !descricao) {
        showAlert('Todos os campos são obrigatórios!', 'danger');
        return;
    }
    
    // Simular envio
    showAlert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.', 'success');
    
    // Limpar formulário
    document.getElementById('suporteForm').reset();
    
    const suporteModal = bootstrap.Modal.getInstance(document.getElementById('suporteModal'));
    suporteModal.hide();
}

// Show Alert
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize tooltips and other Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    // Enable tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});