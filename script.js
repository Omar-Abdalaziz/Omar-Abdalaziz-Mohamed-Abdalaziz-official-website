// Professional JavaScript for Mohamed Abdel Aziz Law Office Website

$(document).ready(function() {

    // Add custom easing functions for smooth navigation
    $.easing.easeInOutCubic = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    };

    $.easing.easeOutQuart = function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    };

    // Initialize all functionality
    initializeProfessionalNavigation();
    initializeProfessionalAnimations();
    initializeWhatsAppIntegration();
    initializeScrollEffects();
    initializeLoadingAnimations();
    initializeContactForm();
    initializeJudgmentsSection();

    // Handle initial page load with hash
    handleInitialHash();

    // Enhanced Professional Navigation functionality
    function initializeProfessionalNavigation() {
        // Enhanced smooth scrolling for navigation links
        $('.simple-nav-menu a[href^="#"], .hero-actions a[href^="#"], a[href^="#"]').on('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const target = $(targetId);

            if (target.length) {
                // Calculate precise offset
                const headerHeight = $('.simplified-header').outerHeight() || 80;
                const extraOffset = 20; // Additional padding for better visual spacing
                const targetPosition = target.offset().top - headerHeight - extraOffset;

                // Add active state to clicked link
                $('.simple-nav-menu a').removeClass('active');
                $(this).addClass('active');

                // Smooth scroll with easing
                $('html, body').stop().animate({
                    scrollTop: targetPosition
                }, {
                    duration: 1000,
                    easing: 'easeInOutCubic',
                    complete: function() {
                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                });
            }

            // Close mobile menu after clicking
            $('.navbar-collapse').collapse('hide');
            $('.simple-toggler').removeClass('active');
        });

        // Enhanced active navigation highlighting with throttling
        let scrollTimeout;
        $(window).on('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                updateActiveNavigation();
                updateHeaderState();
            }, 10);
        });

        function updateActiveNavigation() {
            const scrollPos = $(window).scrollTop();
            const headerHeight = $('.simplified-header').outerHeight() || 80;
            const offset = headerHeight + 50;

            let activeSection = null;

            // Check each section
            $('.simple-nav-menu a[href^="#"]').each(function() {
                const targetId = this.getAttribute('href');
                const target = $(targetId);

                if (target.length) {
                    const sectionTop = target.offset().top - offset;
                    const sectionBottom = sectionTop + target.outerHeight();

                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        activeSection = targetId;
                    }
                }
            });

            // Update active states
            $('.simple-nav-menu a').removeClass('active');
            if (activeSection) {
                $(`.simple-nav-menu a[href="${activeSection}"]`).addClass('active');
            }
        }

        function updateHeaderState() {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > 50) {
                $('.simple-nav').addClass('scrolled');
                $('.simplified-header').addClass('scrolled');
            } else {
                $('.simple-nav').removeClass('scrolled');
                $('.simplified-header').removeClass('scrolled');
            }
        }

        // Enhanced mobile menu functionality
        $('.simple-toggler').on('click', function(e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $('.navbar-collapse').collapse('toggle');
        });

        // Close mobile menu when clicking outside or on overlay
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.simple-nav').length) {
                $('.navbar-collapse').collapse('hide');
                $('.simple-toggler').removeClass('active');
            }
        });

        // Close mobile menu when clicking on nav links
        $('.simple-nav-menu a').on('click', function() {
            $('.navbar-collapse').collapse('hide');
            $('.simple-toggler').removeClass('active');
        });

        // Enhanced brand hover effect
        $('.simple-brand').hover(
            function() {
                $(this).find('.brand-icon').addClass('animate__animated animate__pulse');
            },
            function() {
                $(this).find('.brand-icon').removeClass('animate__animated animate__pulse');
            }
        );

        // Initialize on page load
        updateActiveNavigation();
        updateHeaderState();

        // Handle navigation to sections that might not exist
        handleMissingSections();
    }

    // Handle navigation to sections that might not exist
    function handleMissingSections() {
        const navLinks = $('.simple-nav-menu a[href^="#"]');

        navLinks.each(function() {
            const targetId = this.getAttribute('href');
            const target = $(targetId);

            if (!target.length) {
                // If section doesn't exist, scroll to a reasonable alternative
                $(this).on('click', function(e) {
                    e.preventDefault();

                    let alternativeTarget = null;

                    switch(targetId) {
                        case '#services':
                            // Look for services section alternatives
                            alternativeTarget = $('#خدماتنا') || $('.services-section') || $('.professional-services');
                            break;
                        case '#about':
                            // Look for about section alternatives
                            alternativeTarget = $('#من-نحن') || $('.about-section') || $('.lawyer-profile');
                            break;
                        case '#judgments':
                            // Look for judgments section alternatives
                            alternativeTarget = $('#أحكام-هامة') || $('.judgments-section') || $('.important-judgments');
                            break;
                        case '#contact':
                            // Look for contact section alternatives
                            alternativeTarget = $('#اتصل-بنا') || $('.contact-section') || $('.footer-main');
                            break;
                        case '#home':
                            // Always scroll to top for home
                            $('html, body').animate({ scrollTop: 0 }, 800, 'easeInOutCubic');
                            return;
                    }

                    if (alternativeTarget && alternativeTarget.length) {
                        const headerHeight = $('.simplified-header').outerHeight() || 80;
                        const targetPosition = alternativeTarget.offset().top - headerHeight - 20;

                        $('html, body').animate({
                            scrollTop: targetPosition
                        }, 800, 'easeInOutCubic');
                    } else {
                        // If no alternative found, show notification
                        showNotification('هذا القسم غير متوفر حالياً', 'info');
                    }
                });
            }
        });
    }

    // Initialize Judgments Section functionality
    function initializeJudgmentsSection() {
        // Handle PDF view buttons (for future use when PDFs are added)
        $(document).on('click', '.pdf-view-btn', function(e) {
            e.preventDefault();

            const pdfUrl = $(this).data('pdf-url');
            const judgmentTitle = $(this).data('judgment-title') || 'حكم قضائي';

            if (pdfUrl && pdfUrl.trim() !== '') {
                // Open PDF in new window/tab
                const pdfWindow = window.open(pdfUrl, '_blank');

                if (!pdfWindow) {
                    // If popup blocked, show notification
                    showNotification('يرجى السماح بفتح النوافذ المنبثقة لعرض الحكم', 'warning');
                } else {
                    // Track PDF view
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'pdf_view', {
                            'event_category': 'judgments',
                            'event_label': judgmentTitle
                        });
                    }
                }
            } else {
                // For demo purposes, show info about the sample judgment
                if (judgmentTitle.includes('تجريبي') || judgmentTitle.includes('نموذج') || judgmentTitle.includes('مثال')) {
                    showNotification('هذا حكم تجريبي للعرض فقط. سيتم إضافة ملفات PDF الفعلية لاحقاً.', 'info');
                } else {
                    showNotification('ملف الحكم غير متوفر حالياً', 'info');
                }
            }
        });

        // Add animation to judgments table rows
        $('.judgments-table tbody tr').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });

        // Add mobile data labels for responsive table
        addMobileTableLabels();
    }

    // Add data labels for mobile responsive table
    function addMobileTableLabels() {
        const headers = [];
        $('.judgments-table thead th').each(function() {
            headers.push($(this).text().trim());
        });

        $('.judgments-table tbody tr').each(function() {
            $(this).find('td').each(function(index) {
                if (headers[index]) {
                    $(this).attr('data-label', headers[index]);
                }
            });
        });
    }

    // Function to add new judgment row (for future use)
    function addJudgmentRow(judgmentData) {
        const row = `
            <tr class="animate__animated animate__fadeInUp">
                <td data-label="رقم الحكم">${judgmentData.number}</td>
                <td data-label="الموضوع">${judgmentData.subject}</td>
                <td data-label="نوع القضية">${judgmentData.type}</td>
                <td data-label="المحكمة">${judgmentData.court}</td>
                <td data-label="عرض الحكم">
                    <button class="pdf-view-btn" data-pdf-url="${judgmentData.pdfUrl}" data-judgment-title="${judgmentData.subject}">
                        <i class="fas fa-file-pdf"></i>
                        عرض الحكم
                    </button>
                </td>
            </tr>
        `;

        // Remove no-data row if exists
        $('.no-data-row').remove();

        // Add new row
        $('.judgments-table tbody').append(row);

        // Update mobile labels
        addMobileTableLabels();

        // Update stats
        updateJudgmentsStats();
    }

    // Update judgments statistics
    function updateJudgmentsStats() {
        const totalJudgments = $('.judgments-table tbody tr:not(.no-data-row):not(.future-judgments-row)').length;
        const isDemo = $('.judgments-table tbody tr').first().find('td').first().text().includes('نموذج') ||
                       $('.judgments-table tbody tr').first().find('td').first().text().includes('مثال');

        if (isDemo && totalJudgments > 0) {
            $('.stat-number').text(totalJudgments + ' (تجريبي)');
        } else if (totalJudgments > 0) {
            $('.stat-number').text(totalJudgments);
        } else {
            $('.stat-number').text('قريباً');
        }
    }

    // Handle initial page load with hash in URL
    function handleInitialHash() {
        // Wait for page to fully load
        setTimeout(function() {
            const hash = window.location.hash;
            if (hash) {
                const target = $(hash);
                if (target.length) {
                    const headerHeight = $('.simplified-header').outerHeight() || 80;
                    const targetPosition = target.offset().top - headerHeight - 20;

                    // Smooth scroll to target
                    $('html, body').animate({
                        scrollTop: targetPosition
                    }, 800, 'easeInOutCubic');

                    // Update active navigation
                    $('.simple-nav-menu a').removeClass('active');
                    $(`.simple-nav-menu a[href="${hash}"]`).addClass('active');
                }
            }
        }, 500);
    }

    // Professional Animation functionality
    function initializeProfessionalAnimations() {
        // Animate simple elements on scroll
        function animateOnScroll() {
            $('.professional-service-card, .feature-item-professional, .contact-card, .achievement-item, .stat-item, .modern-lawyer-card, .trust-item-modern, .judgments-table-container, .section-header-professional').each(function() {
                const elementTop = $(this).offset().top;
                const elementBottom = elementTop + $(this).outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();

                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).addClass('animate__animated animate__fadeInUp');
                }
            });
        }

        // Initial animation check
        animateOnScroll();

        // Animation on scroll
        $(window).on('scroll', animateOnScroll);

        // Simple service card hover effects
        $('.professional-service-card').hover(
            function() {
                $(this).find('.service-icon-professional').addClass('animate__animated animate__pulse');
            },
            function() {
                $(this).find('.service-icon-professional').removeClass('animate__animated animate__pulse');
            }
        );

        // Modern hero card hover effects
        $('.modern-lawyer-card').hover(
            function() {
                $(this).find('.lawyer-photo').addClass('animate__animated animate__pulse');
                $(this).find('.photo-fallback').addClass('animate__animated animate__pulse');
            },
            function() {
                $(this).find('.lawyer-photo').removeClass('animate__animated animate__pulse');
                $(this).find('.photo-fallback').removeClass('animate__animated animate__pulse');
            }
        );

        // Enhanced card interactions
        $('.primary-contact-btn, .secondary-contact-btn').on('click', function(e) {
            $(this).addClass('animate__animated animate__pulse');
            setTimeout(() => {
                $(this).removeClass('animate__animated animate__pulse');
            }, 600);
        });

        // Simple stats counter animation
        function animateCounters() {
            $('.stat-number').each(function() {
                const $this = $(this);
                const countTo = $this.text().replace('+', '').replace('%', '');
                const suffix = $this.text().includes('+') ? '+' : ($this.text().includes('%') ? '%' : '');

                $({ countNum: 0 }).animate({
                    countNum: countTo
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum) + suffix);
                    },
                    complete: function() {
                        $this.text(countTo + suffix);
                    }
                });
            });
        }

        // Simple stats observer
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        if ($('.hero-stats').length) {
            statsObserver.observe($('.hero-stats')[0]);
        }

        // Image loading optimization
        function optimizeImageLoading() {
            const lawyerPhoto = $('.lawyer-photo');
            if (lawyerPhoto.length) {
                lawyerPhoto.on('load', function() {
                    $(this).addClass('loaded');
                });

                lawyerPhoto.on('error', function() {
                    $(this).hide();
                    $(this).siblings('.photo-fallback').show();
                });
            }
        }

        optimizeImageLoading();
    }

    // Enhanced WhatsApp integration
    function initializeWhatsAppIntegration() {
        const phoneNumber = '+201032980273';
        const defaultMessage = 'السلام عليكم، أود الحصول على استشارة قانونية من المحامي محمد عبدالعزيز';

        // Main WhatsApp button functionality
        $('#whatsapp-btn').on('click', function(e) {
            e.preventDefault();

            // Add professional click animation
            $(this).addClass('animate__animated animate__pulse');

            setTimeout(() => {
                $(this).removeClass('animate__animated animate__pulse');
            }, 600);

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(defaultMessage)}`;

            // Open WhatsApp in new window/tab
            window.open(whatsappUrl, '_blank');

            // Track WhatsApp click for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': 'main_whatsapp_button'
                });
            }
        });

        // Create professional floating WhatsApp button
        createProfessionalFloatingWhatsApp();
    }

    // Initialize scroll performance optimization
    function initializeScrollEffects() {
        // Throttle scroll events for better performance
        let ticking = false;

        function updateScrollEffects() {
            // Update any scroll-based effects here
            ticking = false;
        }

        $(window).on('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    // Create enhanced floating WhatsApp button
    function createProfessionalFloatingWhatsApp() {
        const phoneNumber = '+201032980273';
        const defaultMessage = 'السلام عليكم، أود الحصول على استشارة قانونية من المحامي محمد عبدالعزيز';

        const floatingBtn = $(`
            <div class="floating-whatsapp">
                <a href="#" class="floating-whatsapp-btn" id="floating-whatsapp-btn" title="تواصل معنا عبر واتساب">
                    <i class="fab fa-whatsapp"></i>
                    <div class="whatsapp-badge">!</div>
                    <div class="whatsapp-tooltip">استشارة مجانية</div>
                </a>
            </div>
        `);

        $('body').append(floatingBtn);

        // Enhanced floating WhatsApp button click
        $('#floating-whatsapp-btn').on('click', function(e) {
            e.preventDefault();

            // Add professional animation
            $(this).addClass('animate__animated animate__pulse');

            setTimeout(() => {
                $(this).removeClass('animate__animated animate__pulse');
            }, 600);

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(defaultMessage)}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Track floating WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': 'floating_whatsapp_button'
                });
            }
        });
    }

    // Enhanced Contact Form functionality with WhatsApp integration
    function initializeContactForm() {
        // Handle professional contact form
        $('.professional-contact-form').on('submit', function(e) {
            e.preventDefault();
            handleFormSubmission($(this));
        });

        // Handle consultation booking form
        $('form[action*="consultation"], .consultation-form, #consultation-form').on('submit', function(e) {
            e.preventDefault();
            handleFormSubmission($(this));
        });

        // Handle any form with consultation-related classes or IDs
        $('button, a').filter(function() {
            return $(this).text().includes('احجز استشارتك') ||
                   $(this).text().includes('استشارة مجانية') ||
                   $(this).hasClass('consultation-btn') ||
                   $(this).attr('href') === '#consultation';
        }).on('click', function(e) {
            e.preventDefault();

            // Check if there's a form to fill
            const nearestForm = $(this).closest('form');
            if (nearestForm.length) {
                handleFormSubmission(nearestForm);
            } else {
                // Direct WhatsApp contact for consultation
                const consultationMessage = `السلام عليكم ورحمة الله وبركاته

أود حجز استشارة قانونية مجانية مع المحامي محمد عبدالعزيز.

يرجى التواصل معي لتحديد موعد مناسب.

شكراً لكم.`;

                sendWhatsAppMessage(consultationMessage, 'consultation_booking');
            }
        });
    }

    // Enhanced form submission handler
    function handleFormSubmission(form) {
        const formData = extractFormData(form);

        // Validate form
        if (validateProfessionalForm(formData)) {
            // Show loading state
            const submitBtn = form.find('button[type="submit"], .submit-btn, .consultation-btn').first();
            const originalText = submitBtn.html();
            submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...');
            submitBtn.prop('disabled', true);

            // Process form submission
            setTimeout(() => {
                const whatsappMessage = formatWhatsAppMessage(formData);
                sendWhatsAppMessage(whatsappMessage, 'form_submission');

                // Reset form and button
                form[0].reset();
                submitBtn.html(originalText);
                submitBtn.prop('disabled', false);

                // Show success message
                showNotification('تم إرسال طلب الاستشارة بنجاح! سيتم توجيهك إلى واتساب.', 'success');

            }, 1500);
        }
    }

    // Extract form data from any form structure
    function extractFormData(form) {
        return {
            name: form.find('input[name*="name"], input[placeholder*="اسم"], input[placeholder*="الاسم"]').val() ||
                  form.find('input[type="text"]').first().val() || '',
            phone: form.find('input[name*="phone"], input[name*="tel"], input[type="tel"], input[placeholder*="هاتف"], input[placeholder*="رقم"]').val() || '',
            email: form.find('input[name*="email"], input[type="email"], input[placeholder*="بريد"]').val() || '',
            consultationType: form.find('select, input[name*="type"], input[name*="service"]').val() || 'استشارة عامة',
            message: form.find('textarea, input[name*="message"], input[placeholder*="رسالة"]').val() || '',
            subject: form.find('input[name*="subject"], input[placeholder*="موضوع"]').val() || ''
        };
    }

    // Format WhatsApp message professionally
    function formatWhatsAppMessage(formData) {
        const consultationTypes = {
            'civil': 'قضايا مدنية وتجارية',
            'marriage': 'زواج الأجانب',
            'real-estate': 'عقارات وشهر عقاري',
            'inheritance': 'قضايا الميراث',
            'power-attorney': 'التوكيلات القانونية',
            'abroad': 'خدمات المصريين بالخارج',
            'consultation': 'استشارة قانونية عامة'
        };

        let message = `السلام عليكم ورحمة الله وبركاته

📋 *طلب استشارة قانونية جديد*
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *الاسم:* ${formData.name || 'غير محدد'}`;

        if (formData.phone) {
            message += `\n📞 *رقم الهاتف:* ${formData.phone}`;
        }

        if (formData.email) {
            message += `\n📧 *البريد الإلكتروني:* ${formData.email}`;
        }

        const consultationType = consultationTypes[formData.consultationType] || formData.consultationType || 'استشارة عامة';
        message += `\n⚖️ *نوع الاستشارة:* ${consultationType}`;

        if (formData.subject) {
            message += `\n📝 *الموضوع:* ${formData.subject}`;
        }

        if (formData.message) {
            message += `\n💬 *تفاصيل الاستشارة:*\n${formData.message}`;
        }

        message += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 *تاريخ الطلب:* ${new Date().toLocaleDateString('ar-EG')}
⏰ *وقت الطلب:* ${new Date().toLocaleTimeString('ar-EG')}

أرجو التواصل معي في أقرب وقت ممكن.
شكراً لكم.`;

        return message;
    }

    // Send WhatsApp message
    function sendWhatsAppMessage(message, eventLabel = 'whatsapp_contact') {
        const phoneNumber = '+201032980273';
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'contact',
                'event_label': eventLabel
            });
        }
    }

    // Enhanced form validation
    function validateProfessionalForm(formData) {
        let isValid = true;
        let errors = [];

        // Clear previous errors
        $('.form-control, input, select, textarea').removeClass('is-invalid');

        // Validate name (required)
        if (!formData.name || formData.name.trim().length < 2) {
            $('input[name*="name"], input[placeholder*="اسم"], input[placeholder*="الاسم"]').addClass('is-invalid');
            $('input[type="text"]').first().addClass('is-invalid');
            errors.push('يرجى إدخال الاسم بشكل صحيح (حد أدنى حرفين)');
            isValid = false;
        }

        // Validate phone (required)
        if (!formData.phone || formData.phone.trim().length < 10) {
            $('input[name*="phone"], input[name*="tel"], input[type="tel"]').addClass('is-invalid');
            errors.push('يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)');
            isValid = false;
        }

        // Validate email (optional but if provided, must be valid)
        if (formData.email && formData.email.trim() && !isValidEmail(formData.email)) {
            $('input[name*="email"], input[type="email"]').addClass('is-invalid');
            errors.push('يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        // Validate message (optional but if provided, minimum length)
        if (formData.message && formData.message.trim() && formData.message.trim().length < 5) {
            $('textarea, input[name*="message"]').addClass('is-invalid');
            errors.push('يرجى إدخال رسالة أكثر تفصيلاً (5 أحرف على الأقل)');
            isValid = false;
        }

        // Show specific error messages
        if (!isValid) {
            const errorMessage = errors.length > 1 ?
                'يرجى تصحيح الأخطاء التالية:\n• ' + errors.join('\n• ') :
                errors[0];
            showNotification(errorMessage, 'error');
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        $('.professional-notification').remove();

        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };

        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };

        const notification = $(`
            <div class="professional-notification ${type}">
                <div class="notification-content">
                    <i class="fas ${icons[type] || icons.info} notification-icon"></i>
                    <div class="notification-message">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);

        $('body').append(notification);

        // Add enhanced notification styles
        notification.css({
            'position': 'fixed',
            'top': '20px',
            'right': '20px',
            'background': colors[type] || colors.info,
            'color': 'white',
            'padding': '0',
            'border-radius': '12px',
            'z-index': '9999',
            'box-shadow': '0 8px 25px rgba(0,0,0,0.15)',
            'transform': 'translateX(100%) scale(0.8)',
            'transition': 'all 0.3s ease',
            'max-width': '350px',
            'min-width': '250px',
            'font-family': 'Cairo, sans-serif'
        });

        notification.find('.notification-content').css({
            'display': 'flex',
            'align-items': 'flex-start',
            'padding': '15px 20px',
            'gap': '12px'
        });

        notification.find('.notification-icon').css({
            'font-size': '1.2rem',
            'margin-top': '2px',
            'flex-shrink': '0'
        });

        notification.find('.notification-message').css({
            'flex': '1',
            'line-height': '1.4',
            'font-size': '0.9rem'
        });

        notification.find('.notification-close').css({
            'position': 'absolute',
            'top': '8px',
            'right': '8px',
            'background': 'rgba(255,255,255,0.2)',
            'border': 'none',
            'color': 'white',
            'width': '24px',
            'height': '24px',
            'border-radius': '50%',
            'cursor': 'pointer',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'font-size': '0.8rem',
            'transition': 'background 0.2s ease'
        });

        // Close button functionality
        notification.find('.notification-close').on('click', function() {
            hideNotification(notification);
        });

        notification.find('.notification-close').hover(
            function() { $(this).css('background', 'rgba(255,255,255,0.3)'); },
            function() { $(this).css('background', 'rgba(255,255,255,0.2)'); }
        );

        // Animate in
        setTimeout(() => {
            notification.css({
                'transform': 'translateX(0) scale(1)'
            });
        }, 100);

        // Auto-hide after delay
        const hideDelay = type === 'error' ? 8000 : 5000; // Errors stay longer
        setTimeout(() => {
            hideNotification(notification);
        }, hideDelay);
    }

    // Hide notification helper
    function hideNotification(notification) {
        notification.css('transform', 'translateX(100%) scale(0.8)');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Scroll effects
    function initializeScrollEffects() {
        // Create scroll to top button
        const scrollTopBtn = $('<button class="scroll-top"><i class="fas fa-arrow-up"></i></button>');
        $('body').append(scrollTopBtn);
        
        // Show/hide scroll to top button
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 300) {
                $('.scroll-top').addClass('show');
            } else {
                $('.scroll-top').removeClass('show');
            }
        });
        
        // Scroll to top functionality
        $('.scroll-top').on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 600, 'easeInOutQuart');
        });
        
        // Parallax effect for hero section
        $(window).on('scroll', function() {
            const scrolled = $(window).scrollTop();
            const parallax = $('.hero-section');
            const speed = scrolled * 0.5;
            
            parallax.css('transform', `translateY(${speed}px)`);
        });
    }
    
    // Loading animations
    function initializeLoadingAnimations() {
        // Add loading class to elements
        $('.service-card, .contact-info, .about-image').addClass('loading');
        
        // Intersection Observer for loading animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        $(entry.target).addClass('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            $('.loading').each(function() {
                observer.observe(this);
            });
        } else {
            // Fallback for older browsers
            $('.loading').addClass('loaded');
        }
    }
    
    // Utility functions
    
    // Custom easing function for smooth animations
    $.easing.easeInOutQuart = function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
    
    // Mobile menu enhancements
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.navbar-collapse').collapse('hide');
            $('.navbar-toggler').removeClass('active');
        }
    });
    
    // Keyboard navigation support
    $(document).on('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.keyCode === 27) {
            $('.navbar-collapse').collapse('hide');
            $('.navbar-toggler').removeClass('active');
        }
    });
    
    // Performance optimization
    let ticking = false;
    
    function updateOnScroll() {
        // Throttle scroll events for better performance
        if (!ticking) {
            requestAnimationFrame(function() {
                // Scroll-dependent functions here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    $(window).on('scroll', updateOnScroll);
    
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Console welcome message
    console.log('%c مكتب محمد عبدالعزيز للمحاماه ', 'background: #1a365d; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('Website developed with modern web technologies');
    
});

// Additional CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .navbar.scrolled {
        background: rgba(26, 54, 93, 0.98) !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .animate__fadeInUp {
        animation-name: fadeInUp;
        animation-duration: 0.8s;
        animation-fill-mode: both;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
`;
document.head.appendChild(style);
