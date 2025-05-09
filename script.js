// document.addEventListener('DOMContentLoaded', function() {
//     // Toggle accessibility panel
//     const toggleBtn = document.getElementById('accessibilityToggle');
//     const panel = document.getElementById('accessibilityPanel');
//     const keyboard = document.getElementById('virtualKeyboard');
    
//     // Keyboard resize controls
//     const keyboardIncrease = document.getElementById('keyboardIncrease');
//     const keyboardDecrease = document.getElementById('keyboardDecrease');
//     const keyboardClose = document.getElementById('keyboardClose');
    
//     // Змінні для голосового введення
//     const voiceBtn = document.createElement('button');
//     voiceBtn.className = 'keyboard-key voice-control';
//     voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
//     document.querySelector('.keyboard-row:last-child').appendChild(voiceBtn);
    
//     let recognition = null;
//     let isListening = false;
    
//     // Змінна для відстеження активного елемента
//     let activeElement = null;
//     let keyboardNavEnabled = false;
    
//     // Функція для встановлення активного елемента
//     function setActiveElement(element) {
//         // Видаляємо виділення з попереднього активного елемента
//         if (activeElement) {
//             activeElement.classList.remove('keyboard-focused');
//         }
        
//         activeElement = element;
//         // Додаємо клас для візуального виділення
//         if (activeElement) {
//             activeElement.classList.add('keyboard-focused');
//             activeElement.focus();
            
//             // Показуємо клавіатуру, якщо увімкнено motorToggle
//             if (document.getElementById('motorToggle').checked) {
//                 keyboard.style.display = 'block';
//                 adjustPanelPosition();
//             }
//         }
//     }
    
//     // Move accessibility panel when keyboard appears
//     function adjustPanelPosition() {
//         if (keyboard.style.display === 'block') {
//             panel.style.bottom = (keyboard.offsetHeight + 30) + 'px';
//         } else {
//             panel.style.bottom = '80px';
//         }
//     }
    
//     // Ініціалізація голосового введення
//     function initVoiceRecognition() {
//         try {
//             recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//             recognition.continuous = false;
//             recognition.interimResults = false;
//             recognition.lang = 'uk-UA'; // Можна змінити на потрібну мову
            
//             recognition.onresult = function(event) {
//                 const transcript = event.results[0][0].transcript;
//                 if (activeElement) {
//                     if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                         activeElement.value += transcript;
//                         const inputEvent = new Event('input', { bubbles: true });
//                         activeElement.dispatchEvent(inputEvent);
//                     }
//                 }
//             };
            
//             recognition.onerror = function(event) {
//                 console.error('Voice recognition error', event.error);
//             };
            
//             recognition.onend = function() {
//                 if (isListening) {
//                     recognition.start();
//                 }
//             };
//         } catch (e) {
//             console.error('Voice recognition not supported', e);
//             voiceBtn.disabled = true;
//             voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
//         }
//     }
    
//     // Навігація клавіатурою
//     function setupKeyboardNavigation() {
//         const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
//         let focusable = Array.from(document.querySelectorAll(focusableElements));
//         let currentIndex = -1;
        
//         document.addEventListener('keydown', function(e) {
//             if (!keyboardNavEnabled) return;
            
//             if (e.key === 'Tab') {
//                 e.preventDefault();
//                 currentIndex = (currentIndex + 1) % focusable.length;
//                 focusable[currentIndex].focus();
//                 setActiveElement(focusable[currentIndex]);
//             } else if (e.key === 'Enter' && document.activeElement) {
//                 document.activeElement.click();
//             }
//         });
        
//         // Оновлюємо список елементів при зміні DOM
//         const observer = new MutationObserver(function() {
//             focusable = Array.from(document.querySelectorAll(focusableElements));
//         });
        
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true
//         });
//     }
    
//     toggleBtn.addEventListener('click', function(e) {
//         e.stopPropagation(); // Запобігаємо всплиттю події
//         const expanded = this.getAttribute('aria-expanded') === 'true';
//         this.setAttribute('aria-expanded', !expanded);
//         panel.style.display = expanded ? 'none' : 'block';
//         adjustPanelPosition();
//     });
    
//     // Close panel when clicking outside
//     document.addEventListener('click', function(e) {
//         if (!panel.contains(e.target) && e.target !== toggleBtn) {
//             panel.style.display = 'none';
//             toggleBtn.setAttribute('aria-expanded', 'false');
//         }
//     });
    
//     // Profile toggles
//     const profileToggles = {
//         'blindnessToggle': 'accessibility-blindness',
//         'motorToggle': 'accessibility-motor',
//         'colorblindToggle': 'accessibility-colorblind',
//         'visuallyImpairedToggle': 'accessibility-visually-impaired',
//         'epilepsyToggle': 'accessibility-epilepsy',
//         'dyslexiaToggle': 'accessibility-dyslexia'
//     };
    
//     Object.keys(profileToggles).forEach(toggleId => {
//         const toggle = document.getElementById(toggleId);
//         const className = profileToggles[toggleId];
        
//         toggle.addEventListener('change', function(e) {
//             e.stopPropagation(); // Запобігаємо всплиттю події
//             document.body.classList.toggle(className, this.checked);
//             savePreference(toggleId, this.checked);
            
//             // Special handling for motor skills support
//             if (toggleId === 'motorToggle') {
//                 if (this.checked && activeElement) {
//                     keyboard.style.display = 'block';
//                     adjustPanelPosition();
//                 } else {
//                     keyboard.style.display = 'none';
//                     adjustPanelPosition();
//                 }
//             }
//         });
//     });
    
//     // Color mode toggles (radio buttons)
//     const colorModes = {
//         'monochromeToggle': 'accessibility-monochrome',
//         'darkContrastToggle': 'accessibility-dark-contrast',
//         'brightContrastToggle': 'accessibility-bright-contrast'
//     };
    
//     Object.keys(colorModes).forEach(toggleId => {
//         const toggle = document.getElementById(toggleId);
//         const className = colorModes[toggleId];
        
//         toggle.addEventListener('change', function(e) {
//             e.stopPropagation(); // Запобігаємо всплиттю події
//             if (this.checked) {
//                 // Remove all color mode classes first
//                 Object.values(colorModes).forEach(mode => {
//                     document.body.classList.remove(mode);
//                 });
//                 document.body.classList.add(className);
//                 savePreference('colorMode', className);
//             }
//         });
//     });
    
//     // Navigation toggles
//     document.getElementById('screenReaderToggle').addEventListener('change', function(e) {
//         e.stopPropagation();
//         savePreference('screenReader', this.checked);
//     });
    
//     document.getElementById('keyboardNavToggle').addEventListener('change', function(e) {
//         e.stopPropagation();
//         keyboardNavEnabled = this.checked;
//         savePreference('keyboardNav', this.checked);
//         if (this.checked) {
//             document.body.classList.add('keyboard-navigation');
//         } else {
//             document.body.classList.remove('keyboard-navigation');
//         }
//     });
    
//     document.getElementById('textReaderToggle').addEventListener('change', function(e) {
//         e.stopPropagation();
//         savePreference('textReader', this.checked);
//     });
    
//     // Virtual keyboard functionality
//     document.querySelectorAll('.keyboard-key').forEach(key => {
//         key.addEventListener('click', function(e) {
//             e.stopPropagation();
//             if (activeElement) {
//                 const keyText = this.textContent;
//                 if (keyText === '←') {
//                     // Backspace
//                     if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                         activeElement.value = activeElement.value.slice(0, -1);
//                     }
//                 } else if (keyText === 'Space') {
//                     // Space
//                     if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                         activeElement.value += ' ';
//                     }
//                 } else if (keyText === 'Enter') {
//                     // Enter - імітуємо клік для будь-якого елемента
//                     activeElement.click();
//                 } else {
//                     // Regular key
//                     if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                         activeElement.value += keyText;
//                     }
//                 }
                
//                 // Trigger input event for any listeners
//                 if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                     const event = new Event('input', { bubbles: true });
//                     activeElement.dispatchEvent(event);
//                 }
                
//                 // Trigger change event for select elements
//                 if (activeElement.tagName === 'SELECT') {
//                     const event = new Event('change', { bubbles: true });
//                     activeElement.dispatchEvent(event);
//                 }
//             }
//         });
//     });
    
//     // Голосове введення
//     voiceBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         if (!recognition) {
//             initVoiceRecognition();
//         }
        
//         if (isListening) {
//             recognition.stop();
//             isListening = false;
//             voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
//             voiceBtn.classList.remove('active');
//         } else {
//             try {
//                 recognition.start();
//                 isListening = true;
//                 voiceBtn.innerHTML = '<i class="fas fa-microphone-alt"></i> Говоріть...';
//                 voiceBtn.classList.add('active');
//             } catch (e) {
//                 console.error('Voice recognition error', e);
//                 voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Помилка';
//             }
//         }
//     });
    
//     // Keyboard resize functionality
//     keyboardIncrease.addEventListener('click', function(e) {
//         e.stopPropagation();
//         let currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--keyboard-scale')) || 1;
//         currentScale = Math.min(currentScale + 0.1, 1.5);
//         document.documentElement.style.setProperty('--keyboard-scale', currentScale);
//         savePreference('keyboardScale', currentScale);
//         adjustPanelPosition();
//     });
    
//     keyboardDecrease.addEventListener('click', function(e) {
//         e.stopPropagation();
//         let currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--keyboard-scale')) || 1;
//         currentScale = Math.max(currentScale - 0.1, 0.7);
//         document.documentElement.style.setProperty('--keyboard-scale', currentScale);
//         savePreference('keyboardScale', currentScale);
//         adjustPanelPosition();
//     });
    
//     keyboardClose.addEventListener('click', function(e) {
//         e.stopPropagation();
//         keyboard.style.display = 'none';
//         adjustPanelPosition();
//         savePreference('keyboardVisible', false);
//     });
    
//     // Обробник кліків для всіх кнопок та інтерактивних елементів
//     document.addEventListener('click', function(e) {
//         if (e.target.tagName === 'BUTTON' || 
//             e.target.tagName === 'INPUT' || 
//             e.target.tagName === 'TEXTAREA' || 
//             e.target.tagName === 'SELECT' ||
//             (e.target.tagName === 'A' && e.target.getAttribute('href'))) {
            
//             setActiveElement(e.target);
//         }
//     });
    
//     // Reset all accessibility settings
//     document.getElementById('resetAccessibility').addEventListener('click', function(e) {
//         e.stopPropagation();
//         // Reset profile toggles
//         Object.keys(profileToggles).forEach(toggleId => {
//             const toggle = document.getElementById(toggleId);
//             toggle.checked = false;
//             document.body.classList.remove(profileToggles[toggleId]);
//             localStorage.removeItem(toggleId);
//         });
    
//         // Reset color modes
//         Object.keys(colorModes).forEach(toggleId => {
//             const toggle = document.getElementById(toggleId);
//             toggle.checked = false;
//             document.body.classList.remove(colorModes[toggleId]);
//         });
//         localStorage.removeItem('colorMode');
    
//         // Reset navigation toggles
//         document.getElementById('screenReaderToggle').checked = false;
//         document.getElementById('keyboardNavToggle').checked = false;
//         document.getElementById('textReaderToggle').checked = false;
//         localStorage.removeItem('screenReader');
//         localStorage.removeItem('keyboardNav');
//         localStorage.removeItem('textReader');
    
//         // Reset keyboard
//         keyboard.style.display = 'none';
//         document.documentElement.style.setProperty('--keyboard-scale', 1);
//         localStorage.removeItem('keyboardScale');
//         localStorage.removeItem('keyboardVisible');
    
//         // Close panel
//         panel.style.display = 'none';
//         toggleBtn.setAttribute('aria-expanded', 'false');
        
//         // Remove active element
//         if (activeElement) {
//             activeElement.classList.remove('keyboard-focused');
//             activeElement = null;
//         }
        
//         // Stop voice recognition
//         if (recognition && isListening) {
//             recognition.stop();
//             isListening = false;
//             voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
//             voiceBtn.classList.remove('active');
//         }
//     });
    
//     // Save preferences to localStorage
//     function savePreference(key, value) {
//         localStorage.setItem(key, JSON.stringify(value));
//     }
    
//     // Load preferences from localStorage
//     function loadPreferences() {
//         // Load profile toggles
//         Object.keys(profileToggles).forEach(toggleId => {
//             const savedValue = localStorage.getItem(toggleId);
//             if (savedValue !== null) {
//                 const toggle = document.getElementById(toggleId);
//                 toggle.checked = JSON.parse(savedValue);
//                 if (toggle.checked) {
//                     document.body.classList.add(profileToggles[toggleId]);
//                 }
//             }
//         });
    
//         // Load color mode
//         const savedColorMode = localStorage.getItem('colorMode');
//         if (savedColorMode) {
//             document.body.classList.add(JSON.parse(savedColorMode));
//             const toggleId = Object.keys(colorModes).find(
//                 key => colorModes[key] === JSON.parse(savedColorMode)
//             );
//             if (toggleId) {
//                 document.getElementById(toggleId).checked = true;
//             }
//         }
    
//         // Load navigation toggles
//         const screenReader = localStorage.getItem('screenReader');
//         if (screenReader !== null) {
//             document.getElementById('screenReaderToggle').checked = JSON.parse(screenReader);
//         }
    
//         const keyboardNav = localStorage.getItem('keyboardNav');
//         if (keyboardNav !== null) {
//             keyboardNavEnabled = JSON.parse(keyboardNav);
//             document.getElementById('keyboardNavToggle').checked = keyboardNavEnabled;
//             if (keyboardNavEnabled) {
//                 document.body.classList.add('keyboard-navigation');
//             }
//         }
    
//         const textReader = localStorage.getItem('textReader');
//         if (textReader !== null) {
//             document.getElementById('textReaderToggle').checked = JSON.parse(textReader);
//         }
    
//         // Load keyboard settings
//         const keyboardScale = localStorage.getItem('keyboardScale');
//         if (keyboardScale !== null) {
//             document.documentElement.style.setProperty(
//                 '--keyboard-scale',
//                 JSON.parse(keyboardScale)
//             );
//         }
    
//         const keyboardVisible = localStorage.getItem('keyboardVisible');
//         if (keyboardVisible !== null && JSON.parse(keyboardVisible) && 
//             document.getElementById('motorToggle').checked) {
//             keyboard.style.display = 'block';
//         }
//     }
    
//     // Load preferences when page loads
//     loadPreferences();
//     setupKeyboardNavigation();
    
//     // Додаємо стилі для виділення активного елемента
//     const style = document.createElement('style');
//     style.textContent = `
//         .keyboard-focused {
//             outline: 3px solid var(--color-primary) !important;
//             outline-offset: 2px !important;
//             box-shadow: 0 0 0 3px rgba(0,123,255,0.5) !important;
//             position: relative;
//         }
//         .keyboard-focused::after {
//             content: '';
//             position: absolute;
//             top: -3px;
//             left: -3px;
//             right: -3px;
//             bottom: -3px;
//             border: 2px dashed var(--color-primary);
//             pointer-events: none;
//         }
//         .keyboard-navigation *:focus {
//             outline: 3px solid var(--color-primary) !important;
//         }
//         .voice-control {
//             flex: 1;
//             max-width: 80px;
//         }
//         .voice-control.active {
//             background-color: #dc3545 !important;
//             color: white !important;
//         }
//         .accessibility-option input[type="checkbox"],
//         .accessibility-option input[type="radio"] {
//             width: 18px;
//             height: 18px;
//             margin-right: 10px;
//         }
//         .accessibility-panel {
//             z-index: 1050 !important;
//         }
//     `;
//     document.head.appendChild(style);
// });