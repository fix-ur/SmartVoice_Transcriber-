const toggleBtn = document.getElementById('toggleBtn');
const output = document.getElementById('output');
const languageSelect = document.getElementById('languageSelect');
const submitAdBtn = document.getElementById('submitAdBtn');
const adLinkInput = document.getElementById('adLink');
const adUsername = document.getElementById('adUsername');
const adPassword = document.getElementById('adPassword');
const authFields = document.getElementById('authFields');
const copyBtn = document.getElementById('copyBtn');
const saveTextBtn = document.getElementById('saveTextBtn');
const savePdfBtn = document.getElementById('savePdfBtn');
const clearBtn = document.getElementById('clearBtn');
const adContainer = document.getElementById('adContainer');
const activityList = document.getElementById('activityList');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const adLimitWarning = document.getElementById('adLimitWarning');
const transcriptionStat = document.getElementById('transcriptionStat');
const accuracyStat = document.getElementById('accuracyStat');
const adsStat = document.getElementById('adsStat');
const statusValue = document.getElementById('statusValue');
const confidenceValue = document.getElementById('confidenceValue');
const detectedLanguage = document.getElementById('detectedLanguage');
const passwordModal = document.getElementById('passwordModal');
const verifyUsername = document.getElementById('verifyUsername');
const verifyPassword = document.getElementById('verifyPassword');
const verifyBtn = document.getElementById('verifyBtn');
const modalClose = document.getElementById('modalClose');
const userIdElement = document.getElementById('userId');

let isRecording = false;
let recognition = null;
let transcript = "";
let adCounter = 0;
let transcriptionCounter = 0;
let totalAccuracy = 0;
let activities = [];
let ads = [];
const MAX_ADS = 10;
const AD_EXPIRY_HOURS = 7;
let currentAdToRemove = null;
let userId = null;
let userAds = {};

const languageNames = {
    'en-US': 'English (US)',
    'es-ES': 'Spanish (ES)',
    'fr-FR': 'French (FR)',
    'de-DE': 'German (DE)',
    'it-IT': 'Italian (IT)',
    'pt-BR': 'Portuguese (BR)',
    'ru-RU': 'Russian (RU)',
    'ja-JP': 'Japanese (JP)',
    'zh-CN': 'Chinese (CN)',
    'ko-KR': 'Korean (KR)',
    'ar-SA': 'Arabic (SA)',
    'hi-IN': 'Hindi (IN)',
    'bn-IN': 'Bengali (IN)',
    'ur-PK': 'Urdu (PK)',
    'tr-TR': 'Turkish (TR)',
    'nl-NL': 'Dutch (NL)',
    'sv-SE': 'Swedish (SE)',
    'da-DK': 'Danish (DK)',
    'no-NO': 'Norwegian (NO)',
    'fi-FI': 'Finnish (FI)',
    'el-GR': 'Greek (GR)',
    'pl-PL': 'Polish (PL)',
    'cs-CZ': 'Czech (CZ)',
    'hu-HU': 'Hungarian (HU)',
    'th-TH': 'Thai (TH)',
    'vi-VN': 'Vietnamese (VN)',
    'id-ID': 'Indonesian (ID)',
    'ms-MY': 'Malay (MY)',
    'fil-PH': 'Filipino (PH)',
    'he-IL': 'Hebrew (IL)',
    'fa-IR': 'Persian (IR)',
    'af-ZA': 'Afrikaans',
    'am-ET': 'Amharic',
    'az-AZ': 'Azerbaijani',
    'be-BY': 'Belarusian',
    'bg-BG': 'Bulgarian',
    'ca-ES': 'Catalan',
    'cy-GB': 'Welsh',
    'et-EE': 'Estonian',
    'eu-ES': 'Basque',
    'ga-IE': 'Irish',
    'gl-ES': 'Galician',
    'gu-IN': 'Gujarati',
    'ha-NG': 'Hausa',
    'hr-HR': 'Croatian',
    'hy-AM': 'Armenian',
    'is-IS': 'Icelandic',
    'jv-ID': 'Javanese',
    'ka-GE': 'Georgian',
    'kk-KZ': 'Kazakh',
    'km-KH': 'Khmer',
    'kn-IN': 'Kannada',
    'ku-TR': 'Kurdish',
    'ky-KG': 'Kyrgyz',
    'la-VA': 'Latin',
    'lb-LU': 'Luxembourgish',
    'lo-LA': 'Lao',
    'lt-LT': 'Lithuanian',
    'lv-LV': 'Latvian',
    'mg-MG': 'Malagasy',
    'mi-NZ': 'Māori',
    'mk-MK': 'Macedonian',
    'ml-IN': 'Malayalam',
    'mn-MN': 'Mongolian',
    'mr-IN': 'Marathi',
    'mt-MT': 'Maltese',
    'my-MM': 'Burmese',
    'ne-NP': 'Nepali',
    'pa-IN': 'Punjabi',
    'ps-AF': 'Pashto',
    'ro-RO': 'Romanian',
    'rw-RW': 'Kinyarwanda',
    'sd-PK': 'Sindhi',
    'si-LK': 'Sinhala',
    'sk-SK': 'Slovak',
    'sl-SI': 'Slovenian',
    'so-SO': 'Somali',
    'sq-AL': 'Albanian',
    'sr-RS': 'Serbian',
    'su-ID': 'Sundanese',
    'sw-KE': 'Swahili',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'tg-TJ': 'Tajik',
    'tk-TM': 'Turkmen',
    'tl-PH': 'Tagalog',
    'tt-RU': 'Tatar',
    'ug-CN': 'Uyghur',
    'uk-UA': 'Ukrainian',
    'uz-UZ': 'Uzbek',
    'xh-ZA': 'Xhosa',
    'yi-US': 'Yiddish',
    'yo-NG': 'Yoruba',
    'zu-ZA': 'Zulu',
    'as-IN': 'Assamese',
    'br-FR': 'Breton',
    'ceb-PH': 'Cebuano',
    'co-FR': 'Corsican',
    'dv-MV': 'Dhivehi',
    'dz-BT': 'Dzongkha',
    'ee-GH': 'Ewe',
    'ff-SN': 'Fula',
    'gd-GB': 'Scottish Gaelic',
    'gn-PY': 'Guaraní',
    'ht-HT': 'Haitian Creole',
    'iu-CA': 'Inuktitut',
    'kmr-TR': 'Kurmanji',
    'ks-IN': 'Kashmiri',
    'lg-UG': 'Luganda',
    'ln-CD': 'Lingala',
    'mg-MG': 'Malagasy',
    'na-NR': 'Nauru',
    'ny-MW': 'Chichewa',
    'om-ET': 'Oromo',
    'qu-PE': 'Quechua',
    'rn-BI': 'Kirundi',
    'sg-CF': 'Sango',
    'sn-ZW': 'Shona',
    'ti-ET': 'Tigrinya',
    'tn-BW': 'Tswana',
    'ts-ZA': 'Tsonga',
    'wo-SN': 'Wolof',
    'yo-NG': 'Yoruba'
};

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languageSelect.value;

        recognition.onstart = () => {
            isRecording = true;
            toggleBtn.innerHTML = `<i class="fas fa-stop"></i> Stop Recording`;
            toggleBtn.classList.add('active');
            statusValue.textContent = "Recording...";
            showNotification("Recording started");
            addActivity("Recording started", "fas fa-microphone");
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                } else {
                    interimTranscript += transcriptPiece;
                }
            }

            transcript = transcript + finalTranscript;
            output.value = transcript + interimTranscript;

            if (event.results.length > 0 && event.results[event.results.length - 1][0].confidence > 0) {
                updateConfidence(event.results[event.results.length - 1][0].confidence);
            }
        };

        recognition.onerror = (event) => {
            showNotification(`Speech recognition error: ${event.error}`, true);
            stopRecording();
        };

        recognition.onend = () => {
            if (isRecording) {
                try {
                    recognition.start();
                } catch (error) {
                    showNotification(`Error restarting recognition: ${error.message}`, true);
                    stopRecording();
                }
            }
        };
    } else {
        showNotification("Speech recognition not supported. Please use Chrome or Edge.", true);
        toggleBtn.disabled = true;
    }
}

async function generateUserId() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;
        
        const browserFingerprint = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            navigator.hardwareConcurrency,
            screen.width,
            screen.height,
            screen.colorDepth,
            navigator.maxTouchPoints || 0,
            new Date().getTimezoneOffset()
        ].join('|');
        
        const idSource = ipAddress + '|' + browserFingerprint;
        
        let hash = 0;
        for (let i = 0; i < idSource.length; i++) {
            const char = idSource.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        
        return 'user_' + Math.abs(hash).toString(16).substring(0, 12);
    } catch (error) {
        const fallbackFingerprint = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            navigator.hardwareConcurrency,
            screen.width,
            screen.height,
            screen.colorDepth,
            navigator.maxTouchPoints || 0,
            new Date().getTimezoneOffset()
        ].join('|');
        
        let hash = 0;
        for (let i = 0; i < fallbackFingerprint.length; i++) {
            const char = fallbackFingerprint.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        
        return 'user_' + Math.abs(hash).toString(16).substring(0, 12);
    }
}

async function getUserId() {
    let id = localStorage.getItem('smartvoice_userId');
    
    if (id) return id;
    
    id = await generateUserId();
    
    localStorage.setItem('smartvoice_userId', id);
    
    return id;
}

function loadUserAds() {
    const data = localStorage.getItem('smartvoice_userAds');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }
    return {};
}

function saveUserAds() {
    localStorage.setItem('smartvoice_userAds', JSON.stringify(userAds));
}

function updateConfidence(confidence) {
    const percent = (confidence * 100).toFixed(1);
    confidenceValue.textContent = `${percent}%`;
    totalAccuracy = ((totalAccuracy * transcriptionCounter) + parseFloat(percent)) / (transcriptionCounter + 1);
    accuracyStat.textContent = `${totalAccuracy.toFixed(1)}%`;
}

async function initApp() {
    userId = await getUserId();
    userIdElement.textContent = userId;
    
    userAds = loadUserAds();
    
    initSpeechRecognition();
    loadActivities();
    setupEventListeners();
    setInterval(updateAdTimers, 1000);
    
    updateAdTimers();
    
    languageSelect.addEventListener('change', () => {
        const selectedLang = languageSelect.value;
        if (languageNames[selectedLang]) {
            detectedLanguage.textContent = languageNames[selectedLang];
            addActivity(`Language set to ${languageNames[selectedLang]}`, "fas fa-language");
        }
    });
}

function setupEventListeners() {
    toggleBtn.addEventListener('click', toggleRecording);
    languageSelect.addEventListener('change', () => {
        if (recognition) {
            recognition.lang = languageSelect.value;
            if (isRecording) {
                recognition.stop();
                setTimeout(() => {
                    if (isRecording) recognition.start();
                }, 100);
            }
        }
    });

    submitAdBtn.addEventListener('click', submitAd);
    copyBtn.addEventListener('click', copyText);
    saveTextBtn.addEventListener('click', saveAsText);
    savePdfBtn.addEventListener('click', saveAsPDF);
    clearBtn.addEventListener('click', clearText);
    verifyBtn.addEventListener('click', verifyAdRemoval);
    modalClose.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    adLinkInput.addEventListener('input', () => {
        if (adLinkInput.value.trim() !== '') {
            authFields.style.display = 'block';
        } else {
            authFields.style.display = 'none';
        }
    });

    window.addEventListener('beforeunload', () => {
        if (recognition && isRecording) recognition.stop();
    });
    
    output.addEventListener('input', () => {
        transcript = output.value;
    });
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (recognition) {
        navigator.permissions.query({ name: 'microphone' }).then((result) => {
            if (result.state === 'granted') {
                try {
                    recognition.start();
                } catch (error) {
                    showNotification(`Error starting recognition: ${error.message}`, true);
                }
            } else if (result.state === 'prompt') {
                showNotification("Please allow microphone access to start recording", true);
                try {
                    recognition.start();
                } catch (error) {
                    showNotification(`Error requesting microphone: ${error.message}`, true);
                }
            } else {
                showNotification("Microphone access denied. Please enable it in browser settings.", true);
            }
        }).catch((error) => {
            showNotification(`Permission error: ${error.message}`, true);
        });
    } else {
        showNotification("Speech recognition not available", true);
    }
}

function stopRecording() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        toggleBtn.innerHTML = `<i class="fas fa-microphone"></i> Start Recording`;
        toggleBtn.classList.remove('active');
        statusValue.textContent = "Ready";
        showNotification("Recording stopped");
        addActivity("Recording completed", "fas fa-stop");
        transcriptionCounter++;
        transcriptionStat.textContent = transcriptionCounter;
        updateStats();
    }
}

function getThumbnail(url) {
    try {
        const domain = new URL(url).hostname;
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
        }
        return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    } catch (e) {
        return null;
    }
}

async function submitAd() {
    const link = adLinkInput.value.trim();
    const username = adUsername.value.trim();
    const password = adPassword.value.trim();

    if (!link) {
        showNotification("Please enter a link", true);
        return;
    }

    if (!isValidUrl(link)) {
        showNotification("Please enter a valid URL", true);
        return;
    }

    if (!username || !password) {
        showNotification("Please enter both username and password", true);
        return;
    }
    
    if (userAds[userId]) {
        const existingAd = ads.find(ad => ad.id === userAds[userId]);
        
        if (existingAd && existingAd.expires > Date.now()) {
            showNotification("You already have an active ad. You can submit a new one after it expires.", true);
            return;
        } else {
            delete userAds[userId];
            saveUserAds();
        }
    }

    if (ads.length >= MAX_ADS) {
        showNotification(`Maximum ${MAX_ADS} ads reached. Removing oldest ad.`, true);
        ads.pop();
        adContainer.innerHTML = '';
        ads.forEach(ad => addAdToDisplay(ad));
    }

    submitAdBtn.innerHTML = `<span class="spinner"></span> Loading...`;
    submitAdBtn.disabled = true;

    const thumbnail = getThumbnail(link);
    const title = link.substring(0, 30) + (link.length > 30 ? "..." : "");

    const ad = {
        id: adCounter++,
        link,
        image: thumbnail,
        title: title,
        description: "Promoted content - click to visit",
        timestamp: Date.now(),
        expires: Date.now() + (AD_EXPIRY_HOURS * 60 * 60 * 1000),
        username: username,
        password: password,
        userId: userId
    };

    ads.unshift(ad);
    addAdToDisplay(ad);
    
    userAds[userId] = ad.id;
    saveUserAds();

    adLinkInput.value = "";
    adUsername.value = "";
    adPassword.value = "";
    authFields.style.display = "none";
    submitAdBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Ad`;
    submitAdBtn.disabled = false;

    showNotification("Ad submitted successfully!");
    addActivity("New ad submitted", "fas fa-ad");
    updateStats();
}

function addAdToDisplay(ad) {
    const adCard = document.createElement('div');
    adCard.className = 'ad-card';
    adCard.dataset.id = ad.id;
    
    const now = Date.now();
    const remainingMs = ad.expires - now;
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    adCard.innerHTML = `
        <div class="ad-image">
            ${ad.image ? `<img src="${ad.image}" alt="Ad Thumbnail" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-globe\\'></i>'">` : `<i class="fas fa-globe"></i>`}
        </div>
        <div class="ad-content">
            <div class="ad-title">${ad.title}</div>
            <div class="ad-description">${ad.description}</div>
            <a href="${ad.link}" target="_blank" class="ad-link">Visit Website</a>
        </div>
        <button class="ad-remove" data-id="${ad.id}">
            <i class="fas fa-times"></i>
        </button>
        <div class="ad-expiry">Expires in: ${remainingHours}h ${remainingMinutes}m</div>
    `;
    
    adContainer.prepend(adCard);
    updateAdLimitWarning();
    
    const removeBtn = adCard.querySelector('.ad-remove');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentAdToRemove = ad.id;
        passwordModal.style.display = 'flex';
    });
}

function verifyAdRemoval() {
    const username = verifyUsername.value.trim();
    const password = verifyPassword.value.trim();
    
    if (!username || !password) {
        showNotification("Please enter both username and password", true);
        return;
    }
    
    const adIndex = ads.findIndex(ad => ad.id === currentAdToRemove);
    
    if (adIndex !== -1) {
        const ad = ads[adIndex];
        
        if (ad.username === username && ad.password === password) {
            ads.splice(adIndex, 1);
            document.querySelector(`.ad-card[data-id="${currentAdToRemove}"]`).remove();
            
            if (userAds[ad.userId] === ad.id) {
                delete userAds[ad.userId];
                saveUserAds();
            }
            
            showNotification("Ad removed successfully");
            addActivity("Ad removed", "fas fa-trash");
            updateStats();
        } else {
            showNotification("Incorrect username or password", true);
        }
    } else {
        showNotification("Ad not found", true);
    }
    
    verifyUsername.value = "";
    verifyPassword.value = "";
    passwordModal.style.display = 'none';
    currentAdToRemove = null;
}

function updateAdLimitWarning() {
    const remaining = MAX_ADS - ads.length;
    if (remaining <= 0) {
        adLimitWarning.innerHTML = `<i class="fas fa-exclamation-circle"></i> Maximum ads reached! Oldest ads will be removed automatically after ${AD_EXPIRY_HOURS} hours.`;
        adLimitWarning.style.display = 'block';
    } else if (remaining <= 2) {
        adLimitWarning.innerHTML = `<i class="fas fa-info-circle"></i> You can add ${remaining} more ad${remaining > 1 ? 's' : ''}`;
        adLimitWarning.style.display = 'block';
    } else {
        adLimitWarning.style.display = 'none';
    }
}

function updateAdTimers() {
    const now = Date.now();
    const expiredAds = ads.filter(ad => ad.expires <= now);
    
    if (expiredAds.length > 0) {
        ads = ads.filter(ad => ad.expires > now);
        adContainer.innerHTML = '';
        ads.forEach(ad => addAdToDisplay(ad));
        
        expiredAds.forEach(ad => {
            if (userAds[ad.userId] === ad.id) {
                delete userAds[ad.userId];
            }
        });
        saveUserAds();
        
        showNotification(`${expiredAds.length} ad(s) expired and removed`);
        addActivity(`${expiredAds.length} ad(s) expired`, "fas fa-clock");
        updateStats();
    } else {
        document.querySelectorAll('.ad-card').forEach(card => {
            const adId = parseInt(card.dataset.id);
            const ad = ads.find(a => a.id === adId);
            if (ad) {
                const remainingMs = ad.expires - now;
                const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
                const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
                const expiryElement = card.querySelector('.ad-expiry');
                if (expiryElement) {
                    expiryElement.textContent = `Expires in: ${remainingHours}h ${remainingMinutes}m`;
                }
            }
        });
    }
}

function addActivity(title, icon) {
    const activity = {
        title,
        icon,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    activities.unshift(activity);
    if (activities.length > 5) {
        activities.pop();
    }
    renderActivities();
}

function renderActivities() {
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon} activity-icon"></i>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function loadActivities() {
    activities = [
        { title: "App initialized", icon: "fas fa-check-circle", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    renderActivities();
}

function updateStats() {
    transcriptionStat.textContent = transcriptionCounter;
    adsStat.textContent = ads.length;
    accuracyStat.textContent = totalAccuracy.toFixed(1) + '%';
}

function copyText() {
    if (output.value) {
        navigator.clipboard.writeText(output.value).then(() => {
            showNotification("Text copied to clipboard!");
            addActivity("Text copied", "fas fa-copy");
        }).catch((error) => {
            showNotification(`Failed to copy text: ${error.message}`, true);
        });
    } else {
        showNotification("No text to copy", true);
    }
}

function saveAsText() {
    if (output.value) {
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcription_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification("Text file saved!");
        addActivity("Text saved", "fas fa-file-alt");
    } else {
        showNotification("No text to save", true);
    }
}

function saveAsPDF() {
    if (output.value) {
        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.fontFamily = 'Poppins, sans-serif';
        element.style.fontSize = '12px';
        element.style.whiteSpace = 'pre-wrap';
        element.textContent = output.value;

        html2pdf().set({
            margin: 1,
            filename: `transcription_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(element).save().then(() => {
            showNotification("PDF file saved!");
            addActivity("PDF saved", "fas fa-file-pdf");
        }).catch((error) => {
            showNotification(`Failed to save PDF: ${error.message}`, true);
        });
    } else {
        showNotification("No text to save", true);
    }
}

function clearText() {
    output.value = "";
    transcript = "";
    confidenceValue.textContent = "N/A";
    detectedLanguage.textContent = "None";
    showNotification("Text cleared!");
    addActivity("Text cleared", "fas fa-sync-alt");
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.className = `notification ${isError ? 'error' : ''} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

window.addEventListener('DOMContentLoaded', initApp);