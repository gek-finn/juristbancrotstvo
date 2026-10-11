// ===== Mobile Menu =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .why-card, .process-step, .contact-card').forEach(el => {
    observer.observe(el);
});

// ===== Header Shadow on Scroll =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ===== Phone Input Mask =====
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }
        
        if (!value.startsWith('7')) {
            value = '7' + value;
        }
        
        value = value.slice(0, 11);
        
        let formattedValue = '+7';
        if (value.length > 1) {
            formattedValue += ' (' + value.slice(1, 4);
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.slice(4, 7);
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.slice(7, 9);
        }
        if (value.length >= 9) {
            formattedValue += '-' + value.slice(9, 11);
        }
        
        this.value = formattedValue;
    });
}

// ===== Google Sheets Integration =====
// Замените этот URL на адрес вашего Google Apps Script Web App
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSTai4IaDDkpRY2Zu8LGoTm7iUWcLaWBH7ossw57syxUKhxTpnFHSH2rPZ21BLTZyU/exec';

// ===== Form Submission =====
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.lead-form__submit');
        const originalBtnText = submitBtn.textContent;
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const debt = document.getElementById('debt').value;
        
        // Validation
        if (!name) {
            showError('Пожалуйста, укажите ваше имя');
            return;
        }
        
        if (phone.replace(/\D/g, '').length < 11) {
            showError('Пожалуйста, укажите корректный номер телефона');
            return;
        }
        
        if (!debt) {
            showError('Пожалуйста, выберите сумму долга');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
        
        try {
            const formData = {
                name: name,
                phone: phone,
                debt: debt
            };

            // Используем text/plain чтобы избежать CORS preflight
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(formData)
            });

            showSuccess();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            showError('Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь со мной по телефону.');
        }
    });
}

function showError(message) {
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    const form = document.getElementById('leadForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message form-message--error';
    errorDiv.style.cssText = 'padding: 12px 16px; background: #fed7d7; color: #c53030; border-radius: 6px; margin-bottom: 16px; font-size: 0.875rem;';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess() {
    const form = document.getElementById('leadForm');
    form.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 4rem; margin-bottom: 16px;">✓</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 12px; color: #1a365d;">Заявка отправлена!</h3>
            <p style="color: #4a5568; margin-bottom: 24px;">Спасибо за обращение. Я перезвоню вам в течение 15 минут.</p>
            <p style="color: #718096; font-size: 0.875rem;">Если не дождетесь звонка — напишите мне в WhatsApp или Telegram.</p>
        </div>
    `;
}

// ===== Floating CTA Visibility =====
const floatingCta = document.getElementById('floatingCta');
const leadSection = document.getElementById('lead-form');

if (floatingCta && leadSection) {
    window.addEventListener('scroll', () => {
        const leadRect = leadSection.getBoundingClientRect();
        const isLeadVisible = leadRect.top < window.innerHeight && leadRect.bottom > 0;
        
        if (isLeadVisible) {
            floatingCta.style.opacity = '0';
            floatingCta.style.pointerEvents = 'none';
        } else {
            floatingCta.style.opacity = '1';
            floatingCta.style.pointerEvents = 'auto';
        }
    });
}
