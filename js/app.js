// QuickResume AI - Main Application JavaScript

// State Management
const state = {
    formData: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        summary: '',
        skills: '',
        experience: '',
        education: '',
        projects: '',
        certifications: '',
        achievements: ''
    },
    template: 'modern',
    zoomLevel: 100,
    currentEnhancement: {
        field: null,
        original: '',
        enhanced: ''
    }
};

// DOM Elements
const elements = {
    form: {
        fullName: document.getElementById('fullName'),
        title: document.getElementById('title'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        linkedin: document.getElementById('linkedin'),
        github: document.getElementById('github'),
        summary: document.getElementById('summary'),
        skills: document.getElementById('skills'),
        experience: document.getElementById('experience'),
        education: document.getElementById('education'),
        projects: document.getElementById('projects'),
        certifications: document.getElementById('certifications'),
        achievements: document.getElementById('achievements')
    },
    errors: {
        fullName: document.getElementById('fullNameError'),
        email: document.getElementById('emailError')
    },
    preview: document.getElementById('resumePreview'),
    previewWrapper: document.getElementById('previewWrapper'),
    templateOptions: document.querySelectorAll('.template-option'),
    downloadBtn: document.getElementById('downloadPDF'),
    clearBtn: document.getElementById('clearForm'),
    themeToggle: document.getElementById('themeToggle'),
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    zoomLevel: document.getElementById('zoomLevel'),
    aiButtons: document.querySelectorAll('.btn-ai'),
    modal: document.getElementById('aiModal'),
    modalClose: document.querySelector('.modal-close'),
    originalText: document.getElementById('originalText'),
    enhancedText: document.getElementById('enhancedText'),
    acceptEnhancement: document.getElementById('acceptEnhancement'),
    rejectEnhancement: document.getElementById('rejectEnhancement'),
    toast: document.getElementById('toast')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    attachEventListeners();
    updatePreview();
    checkTheme();
});

// Event Listeners
function attachEventListeners() {
    // Form inputs
    Object.keys(elements.form).forEach(key => {
        elements.form[key].addEventListener('input', (e) => {
            state.formData[key] = e.target.value;
            updatePreview();
            saveToLocalStorage();
            
            // Clear error on input
            if (elements.errors[key]) {
                clearError(key);
            }
        });
    });

    // Template selection
    elements.templateOptions.forEach(option => {
        option.addEventListener('click', () => {
            elements.templateOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            state.template = option.dataset.template;
            updatePreview();
        });
    });

    // AI Enhancement buttons
    elements.aiButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const field = btn.dataset.field;
            await enhanceWithAI(field);
        });
    });

    // Modal actions
    elements.modalClose.addEventListener('click', closeModal);
    elements.rejectEnhancement.addEventListener('click', closeModal);
    elements.acceptEnhancement.addEventListener('click', applyEnhancement);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    // Download PDF
    elements.downloadBtn.addEventListener('click', downloadPDF);

    // Clear form
    elements.clearBtn.addEventListener('click', clearForm);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Zoom controls
    elements.zoomIn.addEventListener('click', () => changeZoom(10));
    elements.zoomOut.addEventListener('click', () => changeZoom(-10));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'p') {
                e.preventDefault();
                downloadPDF();
            }
        }
    });
}

// Update Resume Preview
function updatePreview() {
    const { formData, template } = state;
    
    // Parse skills into array
    const skillsArray = formData.skills
        .split(/[,\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // Generate HTML based on template
    let html = '';
    
    switch(template) {
        case 'modern':
            html = generateModernTemplate(formData, skillsArray);
            break;
        case 'minimal':
            html = generateMinimalTemplate(formData, skillsArray);
            break;
        case 'professional':
            html = generateProfessionalTemplate(formData, skillsArray);
            break;
        case 'creative':
            html = generateCreativeTemplate(formData, skillsArray);
            break;
        case 'executive':
            html = generateExecutiveTemplate(formData, skillsArray);
            break;
        case 'tech':
            html = generateTechTemplate(formData, skillsArray);
            break;
        default:
            html = generateModernTemplate(formData, skillsArray);
    }

    elements.preview.innerHTML = html;
    elements.preview.className = `resume-preview ${template}-template`;
}

// Modern Template Generator
function generateModernTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="resume-header">
            <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
            ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
            ${hasContact ? `
                <div class="contact-info">
                    ${data.email ? `<span>📧 ${escapeHtml(data.email)}</span>` : ''}
                    ${data.phone ? `<span>📱 ${escapeHtml(data.phone)}</span>` : ''}
                    ${data.linkedin ? `<span>💼 LinkedIn</span>` : ''}
                    ${data.github ? `<span>🐙 GitHub</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="resume-body">
            ${data.summary ? `
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="section-content">${formatText(data.summary)}</div>
                </div>
            ` : ''}
            
            ${skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="section-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${data.experience ? `
                <div class="section">
                    <div class="section-title">Work Experience</div>
                    <div class="section-content">${formatText(data.experience)}</div>
                </div>
            ` : ''}
            
            ${data.education ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">${formatText(data.education)}</div>
                </div>
            ` : ''}
            
            ${data.projects ? `
                <div class="section">
                    <div class="section-title">Projects</div>
                    <div class="section-content">${formatText(data.projects)}</div>
                </div>
            ` : ''}
            
            ${data.certifications ? `
                <div class="section">
                    <div class="section-title">Certifications</div>
                    <div class="section-content">${formatText(data.certifications)}</div>
                </div>
            ` : ''}
            
            ${data.achievements ? `
                <div class="section">
                    <div class="section-title">Achievements</div>
                    <div class="section-content">${formatText(data.achievements)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Minimal Template Generator
function generateMinimalTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="resume-header">
            <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
            ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
            ${hasContact ? `
                <div class="contact-info">
                    ${data.email ? `<span>${escapeHtml(data.email)}</span>` : ''}
                    ${data.phone ? `<span>${escapeHtml(data.phone)}</span>` : ''}
                    ${data.linkedin ? `<span>linkedin.com</span>` : ''}
                    ${data.github ? `<span>github.com</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="resume-body">
            ${data.summary ? `
                <div class="section">
                    <div class="section-title">Summary</div>
                    <div class="section-content">${formatText(data.summary)}</div>
                </div>
            ` : ''}
            
            ${skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="section-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${data.experience ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    <div class="section-content">${formatText(data.experience)}</div>
                </div>
            ` : ''}
            
            ${data.education ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">${formatText(data.education)}</div>
                </div>
            ` : ''}
            
            ${data.projects ? `
                <div class="section">
                    <div class="section-title">Projects</div>
                    <div class="section-content">${formatText(data.projects)}</div>
                </div>
            ` : ''}
            
            ${data.certifications ? `
                <div class="section">
                    <div class="section-title">Certifications</div>
                    <div class="section-content">${formatText(data.certifications)}</div>
                </div>
            ` : ''}
            
            ${data.achievements ? `
                <div class="section">
                    <div class="section-title">Achievements</div>
                    <div class="section-content">${formatText(data.achievements)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Professional Template Generator
function generateProfessionalTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="resume-sidebar">
            ${skills.length > 0 ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Skills</div>
                    <div class="sidebar-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<div class="skill-tag">${escapeHtml(skill)}</div>`).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${hasContact ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Contact</div>
                    <div class="sidebar-content">
                        ${data.email ? `<div>${escapeHtml(data.email)}</div>` : ''}
                        ${data.phone ? `<div>${escapeHtml(data.phone)}</div>` : ''}
                        ${data.linkedin ? `<div>LinkedIn</div>` : ''}
                        ${data.github ? `<div>GitHub</div>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${data.certifications ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Certifications</div>
                    <div class="sidebar-content">${formatText(data.certifications)}</div>
                </div>
            ` : ''}
            
            ${data.achievements ? `
                <div class="sidebar-section">
                    <div class="sidebar-title">Achievements</div>
                    <div class="sidebar-content">${formatText(data.achievements)}</div>
                </div>
            ` : ''}
        </div>
        <div class="resume-main">
            <div class="resume-header">
                <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
                ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
            </div>
            
            ${data.summary ? `
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="section-content">${formatText(data.summary)}</div>
                </div>
            ` : ''}
            
            ${data.experience ? `
                <div class="section">
                    <div class="section-title">Work Experience</div>
                    <div class="section-content">${formatText(data.experience)}</div>
                </div>
            ` : ''}
            
            ${data.education ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">${formatText(data.education)}</div>
                </div>
            ` : ''}
            
            ${data.projects ? `
                <div class="section">
                    <div class="section-title">Projects</div>
                    <div class="section-content">${formatText(data.projects)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Creative Template Generator
function generateCreativeTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="resume-accent"></div>
        <div class="resume-header">
            <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
            ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
            ${hasContact ? `
                <div class="contact-info">
                    ${data.email ? `<span>${escapeHtml(data.email)}</span>` : ''}
                    ${data.phone ? `<span>${escapeHtml(data.phone)}</span>` : ''}
                    ${data.linkedin ? `<span>LinkedIn</span>` : ''}
                    ${data.github ? `<span>GitHub</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="resume-body">
            ${data.summary ? `
                <div class="section">
                    <div class="section-title">About Me</div>
                    <div class="section-content">${formatText(data.summary)}</div>
                </div>
            ` : ''}
            
            ${skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Skills & Expertise</div>
                    <div class="section-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${data.experience ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    <div class="section-content">${formatText(data.experience)}</div>
                </div>
            ` : ''}
            
            ${data.education ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    <div class="section-content">${formatText(data.education)}</div>
                </div>
            ` : ''}
            
            ${data.projects ? `
                <div class="section">
                    <div class="section-title">Projects</div>
                    <div class="section-content">${formatText(data.projects)}</div>
                </div>
            ` : ''}
            
            ${data.certifications ? `
                <div class="section">
                    <div class="section-title">Certifications</div>
                    <div class="section-content">${formatText(data.certifications)}</div>
                </div>
            ` : ''}
            
            ${data.achievements ? `
                <div class="section">
                    <div class="section-title">Achievements</div>
                    <div class="section-content">${formatText(data.achievements)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Executive Template Generator
function generateExecutiveTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="resume-header">
            <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
            ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
            ${hasContact ? `
                <div class="contact-info">
                    ${data.email ? `<span>${escapeHtml(data.email)}</span>` : ''}
                    ${data.phone ? `<span>${escapeHtml(data.phone)}</span>` : ''}
                    ${data.linkedin ? `<span>LinkedIn</span>` : ''}
                    ${data.github ? `<span>GitHub</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="resume-body">
            <div class="main-column">
                ${data.summary ? `
                    <div class="section">
                        <div class="section-title">Executive Summary</div>
                        <div class="section-content">${formatText(data.summary)}</div>
                    </div>
                ` : ''}
                
                ${data.experience ? `
                    <div class="section">
                        <div class="section-title">Professional Experience</div>
                        <div class="section-content">${formatText(data.experience)}</div>
                    </div>
                ` : ''}
                
                ${data.education ? `
                    <div class="section">
                        <div class="section-title">Education</div>
                        <div class="section-content">${formatText(data.education)}</div>
                    </div>
                ` : ''}
                
                ${data.projects ? `
                    <div class="section">
                        <div class="section-title">Key Projects</div>
                        <div class="section-content">${formatText(data.projects)}</div>
                    </div>
                ` : ''}
            </div>
            <div class="side-column">
                ${skills.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Core Competencies</div>
                        <div class="section-content">
                            <div class="skills-list">
                                ${skills.map(skill => `<div class="skill-tag">${escapeHtml(skill)}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${data.certifications ? `
                    <div class="section">
                        <div class="section-title">Certifications</div>
                        <div class="section-content">${formatText(data.certifications)}</div>
                    </div>
                ` : ''}
                
                ${data.achievements ? `
                    <div class="section">
                        <div class="section-title">Honors & Awards</div>
                        <div class="section-content">${formatText(data.achievements)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Tech Template Generator
function generateTechTemplate(data, skills) {
    const hasContact = data.email || data.phone || data.linkedin || data.github;
    
    return `
        <div class="code-header">
            <div class="code-dot red"></div>
            <div class="code-dot yellow"></div>
            <div class="code-dot green"></div>
            <span class="code-filename">${(data.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}.js</span>
        </div>
        <div class="resume-content">
            <div class="resume-header">
                <h1>${escapeHtml(data.fullName) || 'Your Name'}</h1>
                ${data.title ? `<div class="title">${escapeHtml(data.title)}</div>` : ''}
                ${hasContact ? `
                    <div class="contact-info">
                        ${data.email ? `<span>email: "${escapeHtml(data.email)}"</span>` : ''}
                        ${data.phone ? `<span>phone: "${escapeHtml(data.phone)}"</span>` : ''}
                        ${data.linkedin ? `<span>linkedin: "${escapeHtml(data.linkedin)}"</span>` : ''}
                        ${data.github ? `<span>github: "${escapeHtml(data.github)}"</span>` : ''}
                    </div>
                ` : ''}
            </div>
            
            ${data.summary ? `
                <div class="section">
                    <div class="section-title"> summary</div>
                    <div class="section-content">${formatText(data.summary)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${skills.length > 0 ? `
                <div class="section">
                    <div class="section-title"> skills</div>
                    <div class="section-content">
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-tag">"${escapeHtml(skill)}"</span>`).join(',')}
                        </div>
                    </div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${data.experience ? `
                <div class="section">
                    <div class="section-title"> experience</div>
                    <div class="section-content">${formatText(data.experience)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${data.education ? `
                <div class="section">
                    <div class="section-title"> education</div>
                    <div class="section-content">${formatText(data.education)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${data.projects ? `
                <div class="section">
                    <div class="section-title"> projects</div>
                    <div class="section-content">${formatText(data.projects)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${data.certifications ? `
                <div class="section">
                    <div class="section-title"> certifications</div>
                    <div class="section-content">${formatText(data.certifications)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
            
            ${data.achievements ? `
                <div class="section">
                    <div class="section-title"> achievements</div>
                    <div class="section-content">${formatText(data.achievements)}</div>
                    <div class="section-close">};</div>
                </div>
            ` : ''}
        </div>
    `;
}

// AI Enhancement
async function enhanceWithAI(field) {
    const text = state.formData[field];
    
    if (!text.trim()) {
        showToast('Please enter some text first', 'error');
        return;
    }

    // Show loading state
    const btn = document.querySelector(`[data-field="${field}"]`);
    btn.classList.add('loading');

    try {
        const response = await fetch('/api/enhance.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                type: field
            })
        });

        if (!response.ok) {
            throw new Error('Enhancement failed');
        }

        const data = await response.json();
        
        state.currentEnhancement = {
            field: field,
            original: data.original,
            enhanced: data.enhanced
        };

        showEnhancementModal();
    } catch (error) {
        // Fallback to client-side enhancement
        const enhanced = clientSideEnhancement(text, field);
        state.currentEnhancement = {
            field: field,
            original: text,
            enhanced: enhanced
        };
        showEnhancementModal();
    } finally {
        btn.classList.remove('loading');
    }
}

// Client-side enhancement fallback
function clientSideEnhancement(text, type) {
    const actionVerbs = [
        'Developed', 'Implemented', 'Designed', 'Created', 'Built',
        'Managed', 'Led', 'Spearheaded', 'Optimized', 'Streamlined',
        'Engineered', 'Architected', 'Delivered', 'Achieved', 'Improved'
    ];

    const professionalPhrases = {
        'made': 'developed',
        'did': 'executed',
        'helped': 'assisted',
        'worked on': 'contributed to',
        'was responsible for': 'managed',
        'in charge of': 'oversaw',
        'fixed': 'resolved',
        'started': 'initiated',
        'changed': 'transformed',
        'got': 'obtained'
    };

    let enhanced = text;

    // Convert to professional language
    Object.keys(professionalPhrases).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        enhanced = enhanced.replace(regex, professionalPhrases[key]);
    });

    // Add action verbs for experience/projects
    if (type === 'experience' || type === 'projects') {
        const lines = enhanced.split('\n').map((line, index) => {
            const trimmed = line.trim();
            if (trimmed && trimmed.startsWith('•')) {
                const content = trimmed.substring(1).trim();
                const verb = actionVerbs[index % actionVerbs.length];
                const startsWithVerb = actionVerbs.some(v => 
                    content.toLowerCase().startsWith(v.toLowerCase())
                );
                if (!startsWithVerb) {
                    return `• ${verb} ${content.charAt(0).toLowerCase() + content.slice(1)}`;
                }
            }
            return line;
        });
        enhanced = lines.join('\n');
    }

    // Enhance summary
    if (type === 'summary') {
        enhanced = enhanced.replace(/i am/gi, 'A dedicated professional');
        enhanced = enhanced.replace(/i have/gi, 'possessing');
        enhanced = enhanced.replace(/i like/gi, 'passionate about');
        enhanced = enhanced.replace(/good at/gi, 'proficient in');
    }

    return enhanced;
}

// Show Enhancement Modal
function showEnhancementModal() {
    elements.originalText.textContent = state.currentEnhancement.original;
    elements.enhancedText.textContent = state.currentEnhancement.enhanced;
    elements.modal.classList.add('active');
}

// Close Modal
function closeModal() {
    elements.modal.classList.remove('active');
    state.currentEnhancement = { field: null, original: '', enhanced: '' };
}

// Apply Enhancement
function applyEnhancement() {
    const { field, enhanced } = state.currentEnhancement;
    if (field && elements.form[field]) {
        elements.form[field].value = enhanced;
        state.formData[field] = enhanced;
        updatePreview();
        saveToLocalStorage();
        showToast('Text enhanced successfully!', 'success');
    }
    closeModal();
}

// PDF Download
async function downloadPDF() {
    // Validate required fields
    if (!validateForm()) {
        showToast('Please fill in required fields', 'error');
        return;
    }

    const btn = elements.downloadBtn;
    btn.classList.add('loading');

    try {
        const { jsPDF } = window.jspdf;
        const element = elements.preview;
        
        // Create canvas from HTML
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        let imgY = 0;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Handle multi-page if needed
        let heightLeft = imgHeight * ratio;
        let position = 0;
        
        while (heightLeft > pdfHeight) {
            position = heightLeft - imgHeight * ratio;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
            heightLeft -= pdfHeight;
        }

        // Save PDF
        const fileName = `${state.formData.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
        pdf.save(fileName);
        
        showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Validate full name
    if (!state.formData.fullName.trim()) {
        showError('fullName', 'Full name is required');
        isValid = false;
    }
    
    // Validate email
    if (!state.formData.email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(state.formData.email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    const input = elements.form[field];
    const error = elements.errors[field];
    if (input && error) {
        input.classList.add('error');
        error.textContent = message;
    }
}

function clearError(field) {
    const input = elements.form[field];
    const error = elements.errors[field];
    if (input && error) {
        input.classList.remove('error');
        error.textContent = '';
    }
}

// Clear Form
function clearForm() {
    if (confirm('Are you sure you want to clear all fields?')) {
        Object.keys(elements.form).forEach(key => {
            elements.form[key].value = '';
            state.formData[key] = '';
        });
        updatePreview();
        localStorage.removeItem('quickResumeData');
        showToast('Form cleared', 'success');
    }
}

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('quickResumeTheme', newTheme);
}

function checkTheme() {
    const savedTheme = localStorage.getItem('quickResumeTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Zoom Controls
function changeZoom(delta) {
    const newZoom = state.zoomLevel + delta;
    if (newZoom >= 50 && newZoom <= 150) {
        state.zoomLevel = newZoom;
        elements.zoomLevel.textContent = `${newZoom}%`;
        elements.preview.style.transform = `scale(${newZoom / 100})`;
    }
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('quickResumeData', JSON.stringify(state.formData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('quickResumeData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                if (elements.form[key]) {
                    elements.form[key].value = data[key] || '';
                    state.formData[key] = data[key] || '';
                }
            });
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Utility Functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatText(text) {
    if (!text) return '';
    // Convert newlines to <br> and bullet points
    return escapeHtml(text)
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
}

// Toast Notification
function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('active');
    
    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 3000);
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        state,
        validateForm,
        isValidEmail,
        escapeHtml,
        formatText
    };
}
