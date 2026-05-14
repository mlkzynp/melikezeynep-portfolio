(function() {
  'use strict';

  // ──────────────────────────────
  // 1. REAL-TIME API with PHP Backend
  // ──────────────────────────────
  const API_BASE = 'api';

  const API = {
    async request(endpoint, method = 'GET', body = null, hideErrorToast = false) {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(`${API_BASE}/${endpoint}`, options);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen sunucu hatası' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        if (response.status === 204) { // No Content
          return null;
        }
        return response.json();
      } catch (error) {
        console.error(`API ${method} request to ${endpoint} failed:`, error);
        if (!hideErrorToast) {
            showToast(error.message || 'Sunucuyla iletişim kurulamadı.', 'error');
        }
        throw error;
      }
    },

    get(endpoint, hideErrorToast) { return this.request(endpoint, 'GET', null, hideErrorToast); },
    post(endpoint, body) { return this.request(endpoint, 'POST', body); },
    put(endpoint, body) { return this.request(endpoint, 'PUT', body); },
    delete(endpoint) { return this.request(endpoint, 'DELETE'); }
  };


  // ──────────────────────────────
  // 2. TOAST NOTIFICATIONS
  // ──────────────────────────────
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-brand-500', warning: 'bg-yellow-500' };
    const icons = { success: 'lucide:check-circle', error: 'lucide:x-circle', info: 'lucide:info', warning: 'lucide:alert-triangle' };
    toast.className = `toast-enter flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white text-sm ${colors[type] || colors.info}`;
    toast.innerHTML = `<span class="iconify shrink-0" data-icon="${icons[type] || icons.info}" data-width="20"></span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ──────────────────────────────
  // 3. THEME (DARK MODE)
  // ──────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('pz_theme');
    const cookieTheme = getCookie('theme');
    const theme = saved || cookieTheme || 'light';
    applyTheme(theme);
  }
  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pz_theme', theme);
    setCookie('theme', theme, 30);
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (theme === 'dark') {
      sunIcon && sunIcon.classList.add('hidden');
      moonIcon && moonIcon.classList.remove('hidden');
      document.getElementById('navbar').style.background = 'rgba(12,10,9,.9)';
    } else {
      sunIcon && sunIcon.classList.remove('hidden');
      moonIcon && moonIcon.classList.add('hidden');
      document.getElementById('navbar').style.background = 'rgba(250,250,249,.9)';
    }
  }
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  // ──────────────────────────────
  // 4. COOKIES
  // ──────────────────────────────
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }
  function getCookie(name) {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  }
  function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // ──────────────────────────────
  // 5. HERO SLIDER
  // ──────────────────────────────
  let currentSlide = 0;
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // ──────────────────────────────
  // 6. TYPING ANIMATION
  // ──────────────────────────────
  function initTyping() {
    const texts = [
      'Frontend geliştiriciyim 💻',
      'Modern web teknolojileriyle uğraşıyorum 🚀',
      'Kullanıcı deneyimine önem veriyorum ✨',
      'HTML5 • CSS3 • JavaScript • PHP • MySQL 🛠️'
    ];
    const el = document.getElementById('typingText');
    if (!el) return;
    let textIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const current = texts[textIdx];
      if (deleting) {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }
      let delay = deleting ? 40 : 70;
      if (!deleting && charIdx === current.length) { delay = 2500; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; delay = 400; }
      setTimeout(type, delay);
    }
    type();
  }

  // ──────────────────────────────
  // 7. MOBILE MENU
  // ──────────────────────────────
  function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileMenuClose');
    const links = menu.querySelectorAll('.mobile-nav');
    btn.addEventListener('click', () => menu.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => menu.classList.add('hidden'));
    links.forEach(l => l.addEventListener('click', () => menu.classList.add('hidden')));
  }

  // ──────────────────────────────
  // 8. SCROLL ANIMATIONS
  // ──────────────────────────────
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Animate skill bars
          e.target.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-section').forEach(s => observer.observe(s));
  }

  // ──────────────────────────────
  // 9. PROJECTS (Load + Filter)
  // ──────────────────────────────
  let allProjects = [];

  const defaultFallbackProjects = [
    {
      id: 1,
      title: 'Weather App (Demo)',
      description: 'OpenWeather API kullanarak gerçek zamanlı hava durumu bilgisi gösteren responsive bir web uygulaması.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      image_url: 'https://picsum.photos/seed/weather-app-proj/600/400.jpg',
      project_link: '#',
      github_link: '#'
    },
    {
      id: 2,
      title: 'Task Manager (Demo)',
      description: 'Sürükle-bırak özelliği ile Kanban tabanlı görev yönetim uygulaması.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      image_url: 'https://picsum.photos/seed/task-manager-proj/600/400.jpg',
      project_link: '#',
      github_link: '#'
    },
    {
      id: 3,
      title: 'E-Commerce UI (Demo)',
      description: 'Modern ve kullanıcı dostu bir e-ticaret arayüzü.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      image_url: 'https://picsum.photos/seed/ecommerce-proj/600/400.jpg',
      project_link: '#',
      github_link: '#'
    }
  ];

  async function loadProjects() {
    try {
      // API'ye istek atarken hata durumunda toast göstermesini kapattık (sessiz fallback için)
      const response = await API.get('projects.php', true);
      
      if (response && !response.error && Array.isArray(response)) {
        allProjects = response;
      } else {
        throw new Error(response.error || "Invalid response format");
      }

      // Veritabanı başarıyla bağlandı ama tablo boşsa, yine de demo projeleri gösterelim
      if (allProjects.length === 0) {
        console.warn("Veritabanı boş, demo projeler gösteriliyor.");
        allProjects = defaultFallbackProjects;
      }

      renderProjects(allProjects);
      
      // İlk filtrelemeyi veriler geldikten sonra yapalım ki boş tablo görünmesin
      const activeFilterBtn = document.querySelector('.filter-btn.active');
      const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
      filterProjects(filter);
      
    } catch (err) {
      console.warn("Veritabanı bağlantısı kurulamadı. Demo veriler gösteriliyor.", err);
      // Fallback
      allProjects = defaultFallbackProjects;
      renderProjects(allProjects);
      filterProjects('all');
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    if (!projects || projects.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-16"><span class="iconify mx-auto mb-4" data-icon="lucide:folder-open" data-width="48" style="color:var(--text-muted)"></span><p class="text-lg" style="color:var(--text-secondary)">Henüz proje eklenmemiş.</p></div>`;
      return;
    }
    grid.innerHTML = projects.map(p => `
      <article class="rounded-2xl overflow-hidden card-hover cursor-pointer group" style="background:var(--bg-card);border:1px solid var(--border);box-shadow:var(--shadow)" onclick="openProjectModal(${p.id})">
        <div class="relative overflow-hidden">
          <img src="${p.image_url || 'https://picsum.photos/seed/default-proj/600/400.jpg'}" alt="${p.title}" class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <span class="text-white text-sm font-medium flex items-center gap-1"><span class="iconify" data-icon="lucide:eye" data-width="16"></span>Detayları Gör</span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-serif text-lg font-medium mb-2" style="color:var(--text-primary)">${p.title}</h3>
          <p class="text-sm leading-relaxed mb-4 line-clamp-2" style="color:var(--text-secondary)">${p.description}</p>
          <div class="flex flex-wrap gap-1.5">
            ${(p.technologies || []).map(t => `<span class="px-2.5 py-1 text-xs font-medium rounded-full" style="background:var(--accent-light);color:var(--accent)">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');
  }

  function filterProjects(filter) {
    if (filter === 'all') {
      renderProjects(allProjects);
    } else {
      renderProjects(allProjects.filter(p => (p.technologies || []).includes(filter)));
    }
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
      if (btn.dataset.filter === filter) {
        btn.style.background = 'var(--accent)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--accent)';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-secondary)';
        btn.style.borderColor = 'var(--border)';
      }
    });
  }

  // Project Modal
  window.openProjectModal = function(id) {
    const p = allProjects.find(x => x.id == id);
    if (!p) return;
    document.getElementById('modalImage').src = p.image_url || 'https://picsum.photos/seed/default-proj/600/400.jpg';
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').textContent = p.description;
    document.getElementById('modalLink').href = p.project_link || '#';
    document.getElementById('modalGithub').href = p.github_link || '#';
    document.getElementById('modalTechs').innerHTML = (p.technologies || []).map(t =>
      `<span class="px-3 py-1 text-xs font-medium rounded-full" style="background:var(--accent-light);color:var(--accent)">${t}</span>`
    ).join('');
    document.getElementById('projectModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    document.getElementById('projectModal').classList.remove('open');
    document.body.style.overflow = '';
  };

  function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
    });
  }

  // ──────────────────────────────
  // 10. CONTACT FORM
  // ──────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateContactForm()) return;

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
      };

      try {
        await API.post('messages.php', formData);
        showToast('Mesajınız başarıyla gönderildi! 🎉', 'success');
        form.reset();
        clearFormErrors(form);
      } catch (err) {
        showToast('Mesaj gönderilirken hata oluştu. Veritabanı bağlantınızı kontrol edin.', 'error');
      }
    });
  }

  function validateContactForm() {
    const form = document.getElementById('contactForm');
    let valid = true;
    clearFormErrors(form);

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2) { showFieldError(form.name, 'İsim en az 2 karakter olmalıdır.'); valid = false; }
    if (!isValidEmail(email)) { showFieldError(form.email, 'Geçerli bir e-posta adresi giriniz.'); valid = false; }
    if (subject.length < 3) { showFieldError(form.subject, 'Konu en az 3 karakter olmalıdır.'); valid = false; }
    if (message.length < 10) { showFieldError(form.message, 'Mesaj en az 10 karakter olmalıdır.'); valid = false; }

    return valid;
  }

  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function showFieldError(input, msg) {
    input.style.borderColor = '#ef4444';
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.error-msg').forEach(e => e.classList.add('hidden'));
    form.querySelectorAll('input, textarea').forEach(i => i.style.borderColor = '');
  }

  // ──────────────────────────────
  // 11. ADMIN AUTHENTICATION
  // ──────────────────────────────
  async function checkSession() {
    try {
      const session = await API.get('auth.php', true);
      if (session && session.loggedIn) {
        return session;
      }
    } catch (e) { /* Ignore */ }
    return null;
  }

  async function initAdmin() {
    const session = await checkSession();
    if (session) {
      showAdminDashboard(session.username);
    }

    document.getElementById('adminBtn').addEventListener('click', async () => {
      const currentSession = await checkSession();
      if (currentSession) {
        showAdminDashboard(currentSession.username);
      } else {
        showLoginModal();
      }
    });

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('rememberMe').checked;

      try {
        const result = await API.post('auth.php', { username, password, remember });
        if (result.success) {
          closeLoginModal();
          showAdminDashboard(result.username);
          showToast('Başarıyla giriş yapıldı!', 'success');
        }
      } catch (error) {
        document.getElementById('loginError').classList.remove('hidden');
        setTimeout(() => document.getElementById('loginError').classList.add('hidden'), 3000);
      }
    });
  }

  window.showLoginModal = function() {
    document.getElementById('loginModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLoginModal = function() {
    document.getElementById('loginModal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('loginForm').reset();
  };

  function showAdminDashboard(username) {
    document.getElementById('adminName').textContent = username || 'Admin';
    document.getElementById('adminDashboard').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderAdminProjects();
    renderAdminMessages();
  }

  window.adminLogout = async function() {
    try {
      await API.delete('auth.php');
      document.getElementById('adminDashboard').classList.remove('open');
      document.body.style.overflow = '';
      showToast('Çıkış yapıldı.', 'info');
    } catch (error) {
      showToast('Çıkış yapılırken bir hata oluştu.', 'error');
    }
  };

  // ──────────────────────────────
  // 12. ADMIN TABS
  // ──────────────────────────────
  window.switchAdminTab = function(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden'));
    document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.style.borderColor = isActive ? 'var(--accent)' : 'transparent';
      btn.style.color = isActive ? 'var(--accent)' : 'var(--text-secondary)';
    });
    if (tab === 'messages') renderAdminMessages();
  };

  // ──────────────────────────────
  // 13. ADMIN PROJECTS CRUD
  // ──────────────────────────────
  async function renderAdminProjects() {
    try {
      const projects = await API.get('projects.php', true);
      const container = document.getElementById('adminProjectsList');
      if (!projects || projects.length === 0 || projects.error) {
        container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Henüz proje eklenmemiş.</p>';
        return;
      }
      container.innerHTML = projects.map(p => `
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl" style="background:var(--bg-card);border:1px solid var(--border)">
          <img src="${p.image_url || 'https://picsum.photos/seed/default-proj/100/100.jpg'}" alt="${p.title}" class="w-16 h-16 rounded-lg object-cover shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="font-medium" style="color:var(--text-primary)">${p.title}</h4>
            <p class="text-sm truncate" style="color:var(--text-secondary)">${p.description}</p>
            <div class="flex flex-wrap gap-1 mt-1">${(p.technologies||[]).map(t=>`<span class="text-xs px-2 py-0.5 rounded-full" style="background:var(--accent-light);color:var(--accent)">${t}</span>`).join('')}</div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="editProject(${p.id})" class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-brand-100 dark:hover:bg-brand-900/30" title="Düzenle"><span class="iconify text-brand-500" data-icon="lucide:pencil" data-width="16"></span></button>
            <button onclick="deleteProject(${p.id})" class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" title="Sil"><span class="iconify text-red-500" data-icon="lucide:trash-2" data-width="16"></span></button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      document.getElementById('adminProjectsList').innerHTML = '<p class="text-center py-8 text-red-500">Veriler yüklenemedi. Veritabanını kontrol edin.</p>';
    }
  }

  window.showProjectForm = function(project = null) {
    const container = document.getElementById('projectFormContainer');
    container.classList.remove('hidden');
    if (project) {
      document.getElementById('projectFormTitle').textContent = 'Projeyi Düzenle';
      document.getElementById('projectId').value = project.id;
      document.getElementById('projTitle').value = project.title;
      document.getElementById('projTechs').value = (project.technologies || []).join(', ');
      document.getElementById('projDesc').value = project.description;
      document.getElementById('projImage').value = project.image_url || '';
      document.getElementById('projLink').value = project.project_link || '';
      document.getElementById('projGithub').value = project.github_link || '';
    } else {
      document.getElementById('projectFormTitle').textContent = 'Yeni Proje Ekle';
      document.getElementById('projectForm').reset();
      document.getElementById('projectId').value = '';
    }
  };

  window.hideProjectForm = function() {
    document.getElementById('projectFormContainer').classList.add('hidden');
    document.getElementById('projectForm').reset();
  };

  window.editProject = async function(id) {
    try {
      const project = await API.get(`projects.php?id=${id}`);
      if (project) showProjectForm(project);
    } catch (error) {
      showToast('Proje bilgileri getirilemedi.', 'error');
    }
  };

  window.deleteProject = async function(id) {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await API.delete(`projects.php?id=${id}`);
      renderAdminProjects();
      loadProjects(); // Refresh frontend
      showToast('Proje silindi.', 'info');
    } catch (error) {
      showToast('Proje silinirken hata oluştu.', 'error');
    }
  };

  function initProjectForm() {
    document.getElementById('projectForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('projectId').value;
      const techsRaw = document.getElementById('projTechs').value;
      const technologies = techsRaw.split(',').map(t => t.trim()).filter(t => t);

      const projectData = {
        id: id || null,
        title: document.getElementById('projTitle').value.trim(),
        description: document.getElementById('projDesc').value.trim(),
        technologies,
        image_url: document.getElementById('projImage').value.trim() || `https://picsum.photos/seed/${Date.now()}/600/400.jpg`,
        project_link: document.getElementById('projLink').value.trim() || '#',
        github_link: document.getElementById('projGithub').value.trim() || '#'
      };

      try {
        if (id) {
          await API.put('projects.php', projectData);
          showToast('Proje güncellendi!', 'success');
        } else {
          await API.post('projects.php', projectData);
          showToast('Yeni proje eklendi!', 'success');
        }
        hideProjectForm();
        renderAdminProjects();
        loadProjects(); // Refresh frontend
      } catch (error) {
        showToast('Proje kaydedilirken hata oluştu.', 'error');
      }
    });
  }

  // ──────────────────────────────
  // 14. ADMIN MESSAGES
  // ──────────────────────────────
  async function renderAdminMessages() {
    try {
      const messages = await API.get('messages.php', true);
      const container = document.getElementById('adminMessagesList');
      
      if (!messages || messages.error) throw new Error();

      const unread = messages.filter(m => !m.is_read).length;
      document.getElementById('msgBadge').textContent = unread;

      if (messages.length === 0) {
        container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Henüz mesaj yok.</p>';
        return;
      }
      container.innerHTML = messages.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(m => `
        <div class="p-5 rounded-xl transition-all ${m.is_read ? '' : 'ring-2 ring-brand-500/30'}" style="background:var(--bg-card);border:1px solid var(--border)">
          <div class="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 class="font-medium" style="color:var(--text-primary)">${m.name} <span class="font-normal text-sm" style="color:var(--text-muted)">&lt;${m.email}&gt;</span></h4>
              <p class="text-sm font-medium" style="color:var(--text-secondary)">${m.subject}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs" style="color:var(--text-muted)">${m.created_at ? new Date(m.created_at).toLocaleDateString('tr-TR') : ''}</span>
              ${!m.is_read ? `<button onclick="markRead(${m.id})" class="text-xs px-3 py-1 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition-colors">Okundu</button>` : '<span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Okundu</span>'}
            </div>
          </div>
          <p class="text-sm leading-relaxed" style="color:var(--text-secondary)">${m.message}</p>
        </div>
      `).join('');
    } catch (error) {
      document.getElementById('adminMessagesList').innerHTML = '<p class="text-center py-8 text-red-500">Mesajlar yüklenemedi. Veritabanını kontrol edin.</p>';
    }
  }

  window.markRead = async function(id) {
    try {
      await API.put('messages.php', { id, is_read: true });
      renderAdminMessages();
      showToast('Mesaj okundu olarak işaretlendi.', 'info');
    } catch (error) {
      showToast('Hata oluştu.', 'error');
    }
  };

  // ──────────────────────────────
  // 15. ACTIVE NAV HIGHLIGHT
  // ──────────────────────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        const top = s.offsetTop - 100;
        if (window.scrollY >= top) current = s.getAttribute('id');
      });
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === '#' + current ? 'var(--accent)' : 'var(--text-secondary)';
      });
    });
  }

  // ──────────────────────────────
  // 16. CLOSE MODALS ON BACKDROP CLICK
  // ──────────────────────────────
  function initModalClose() {
    ['projectModal', 'loginModal'].forEach(id => {
      document.getElementById(id).addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ──────────────────────────────
  // 17. INIT
  // ──────────────────────────────
  function init() {
    initTheme();
    initHeroSlider();
    initTyping();
    initMobileMenu();
    initScrollAnimations();
    initFilterButtons();
    loadProjects();
    initContactForm();
    initAdmin();
    initProjectForm();
    initActiveNav();
    initModalClose();

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // ESC to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();