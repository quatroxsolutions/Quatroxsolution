(function () {
  "use strict";

  var EMAIL = "contact@quatroxsolutions.com";
  var PHONE = "+91 7200801765";
  var state = { step: "", name: "", email: "" };

  function isTamil(text) {
    return /[\u0B80-\u0BFF]/.test(text);
  }

  function emailLink() {
    return '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>";
  }

  function phoneLink() {
    return '<a href="tel:+917200801765">' + PHONE + "</a>";
  }

  function contactDetails(tamil) {
    return tamil
      ? "மின்னஞ்சல்: " + emailLink() + " | தொலைபேசி: " + phoneLink() + ". திங்கள்–சனி, காலை 9 முதல் மாலை 6 வரை (IST) தொடர்புகொள்ளலாம்."
      : "Email: " + emailLink() + " | Phone/WhatsApp: " + phoneLink() + ". Our hours are Monday–Saturday, 9 AM–6 PM IST.";
  }

  function responseFor(message) {
    var text = message.trim().toLowerCase();
    var tamil = isTamil(message);
    var contact = contactDetails(tamil);
    var fallback = tamil
      ? "இதற்கான தகவல் இணையதளத்தில் இல்லை. " + contact + " என்ற முகவரியில் எங்கள் குழுவைத் தொடர்புகொள்ளுங்கள்."
      : "I'm not sure about that. Please contact our team at " + emailLink() + " or " + phoneLink() + " and they'll help you.";

    if (state.step) {
      if (/^(cancel|stop|nevermind|never mind|cancel request|ரத்து|வேண்டாம்)$/i.test(text)) {
        state.step = "";
        return tamil ? "சரி, கோரிக்கையை நிறுத்திவிட்டேன். வேறு ஏதேனும் உதவி வேண்டுமா?" : "No problem; I've stopped the request. Can I help with anything else?";
      }
      if (state.step === "name") {
        if (message.trim().length < 2) {
          return tamil ? "உங்கள் பெயரைத் தெரிவிக்கவும்." : "Please enter your name.";
        }
        state.name = message.trim();
        state.step = "email";
        return tamil ? "நன்றி. உங்கள் மின்னஞ்சல் முகவரி என்ன?" : "Thanks. What is your email address?";
      }
      if (state.step === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.trim())) {
          return tamil ? "சரியான மின்னஞ்சல் முகவரியைத் தெரிவிக்கவும்." : "Please enter a valid email address.";
        }
        state.email = message.trim();
        state.step = "requirement";
        return tamil ? "எந்த சேவை அல்லது தேவைக்காக தொடர்புகொள்கிறீர்கள்?" : "What service or requirement would you like to discuss?";
      }
      if (state.step === "requirement") {
        state.step = "";
        var subject = encodeURIComponent("Website enquiry from " + state.name);
        var body = encodeURIComponent(
          "Name: " + state.name + "\nEmail: " + state.email + "\nRequirement: " + message.trim()
        );
        var mailto = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
        state.name = "";
        state.email = "";
        return tamil
          ? 'நன்றி. உங்கள் விவரங்களுடன் மின்னஞ்சல் தயார் செய்யப்பட்டுள்ளது. <a href="' + mailto + '">மின்னஞ்சலைத் திறக்கவும்</a>. தொலைபேசி: ' + phoneLink() + "."
          : 'Thank you. Your enquiry is ready to send with those details. <a href="' + mailto + '">Open the email draft</a>, or contact us at ' + phoneLink() + ".";
      }
    }

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(text) || /^(வணக்கம்|ஹாய்)/.test(text)) {
      return tamil ? "வணக்கம்! Quatrox Solutions பற்றி என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?" : "Hi! I'm Quatro. How can I help you with Quatrox Solutions today?";
    }
    if (/\b(thank you|thanks|thank)\b/.test(text) || /நன்றி/.test(text)) {
      return tamil ? "மகிழ்ச்சி! வேறு ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்." : "You're welcome! Feel free to ask if you have any other questions.";
    }
    if (/\b(bye|goodbye|see you)\b/.test(text) || /போய்வருகிறேன்/.test(text)) {
      return tamil ? "நன்றி. Quatrox குழுவைத் தொடர்புகொள்ள " + emailLink() + " அல்லது " + phoneLink() + " பயன்படுத்தலாம்." : "Thanks for chatting. You can reach the Quatrox team at " + emailLink() + " or " + phoneLink() + ".";
    }

    if (/\b(quote|quotation|estimate|pricing|price|pricing|cost|how much|book a call|meeting|meet with|consultation)\b/.test(text) || /விலை|கட்டணம்|மேற்கோள்|சந்திப்பு/.test(text)) {
      state.step = "name";
      return tamil ? "தனிப்பயன் விலை அல்லது சந்திப்பு கோரிக்கைக்காக, முதலில் உங்கள் பெயரைத் தெரிவிக்கவும்." : "The website doesn't list standard prices; project pricing depends on the requirements. To request a custom quote or meeting, may I have your name?";
    }

    if (/\b(ceo|chief executive|leadership|leaders?|director|founder|who leads|management|fahima)\b/.test(text) || /தலைவர்|நிர்வாகி|சிஇஓ|ஃபஹிமா/.test(text)) {
      if (/\b(fahima|ceo|chief executive)\b/.test(text) || /ஃபஹிமா|சிஇஓ/.test(text)) {
        return tamil ? "Fahima Barveen அவர்கள் Quatrox Solutions-இன் CEO. அவர் AI/ML/Deep Learning-இல் MBA மற்றும் Computer Applications-இல் B.Com பட்டம் பெற்றவர்." : "Fahima Barveen is the CEO of Quatrox Solutions. She holds an MBA in AI/ML/Deep Learning and a B.Com in Computer Applications.";
      }
      return tamil
        ? "நிறுவனத் தலைமை: Mohamed Fahad (Founder & Managing Director), Sameera Hajara (Director), Fahima Barveen (CEO), Sunil Walker (Vice President)."
        : "The website lists Mohamed Fahad (Founder & Managing Director), Sameera Hajara (Director), Fahima Barveen (CEO), and Sunil Walker (Vice President).";
    }

    if (/\b(intern|internship|internships|job|jobs|career|careers|hiring|opening|openings|vacancy|vacancies|apply|application|role|position)\b/.test(text) || /வேலை|பயிற்சி/.test(text)) {
      if (/\b(intern|internship|internships)\b/.test(text) || /பயிற்சி/.test(text)) {
        return tamil ? "இணையதளத்தில் internship விவரங்கள் குறிப்பிடப்படவில்லை. " + contact : "Internship details aren't listed on the website. Please contact the team at " + emailLink() + " or " + phoneLink() + " to ask about current opportunities.";
      }
      return tamil
        ? 'Careers பக்கத்தில் XML & ePub Executive, Data Processing Executive, AI Data Annotator (Voice & Non-Voice), Media Localisation Editor ஆகிய பணியிடங்கள் பட்டியலிடப்பட்டுள்ளன. <a href="careers.html#open-roles">பணியிடங்கள் மற்றும் விண்ணப்பம்</a>.'
        : 'The careers page lists XML & ePub Executive, Data Processing Executive, AI Data Annotator (Voice & Non-Voice), and Media Localisation Editor roles. See <a href="careers.html#open-roles">open positions and apply</a>. The website says application reviews take 3–5 working days.';
    }

    if (/\b(address|location|located|office|where are you|where is|thuckalay|madurai)\b/.test(text) || /முகவரி|எங்கே|இடம்/.test(text)) {
      return tamil
        ? "தமிழ்நாட்டில் இரண்டு அலுவலகங்கள் உள்ளன: Thuckalay — 16-74A, HMP Towers, Market Rd, Tamil Nadu 629175; Madurai — 66, 5-5/9 Meenakshi Street, Thirunagar, Tamil Nadu 625006."
        : "Quatrox has two offices in Tamil Nadu: Thuckalay — 16-74A, HMP Towers, Market Rd, Tamil Nadu 629175; and Madurai — 66, 5-5/9 Meenakshi Street, Thirunagar, Tamil Nadu 625006.";
    }

    if (/\b(contact|email|phone|telephone|call|whatsapp|reach|hours|working hours|business hours|open today)\b/.test(text) || /தொடர்பு|மின்னஞ்சல்|தொலைபேசி|நேரம்/.test(text)) {
      return contact;
    }

    if (/\b(client|clients|portfolio|customer stor|case stud|past work|industries|global|international)\b/.test(text)) {
      return tamil
        ? "இணையதளத்தில் EPUB மாற்றம், PDF-to-Word மாற்றம், மற்றும் SRT subtitle workflow தொடர்பான மூன்று customer stories உள்ளன. வாடிக்கையாளர் பெயர்கள் குறிப்பிடப்படவில்லை. நிறுவனம் உலகளாவிய publishers மற்றும் enterprises-க்கு சேவை வழங்குவதாகத் தெரிவிக்கிறது."
        : "The website features customer stories about large-scale EPUB conversion, PDF-to-Word conversion, and an AI-assisted SRT subtitle workflow. It doesn't name the clients. Quatrox says it serves publishers and enterprises across the US, UK, Europe, and Asia-Pacific.";
    }

    if (/\b(when|timeline|turnaround|how long|start a project|project start|process|payment|pay|deposit|book publishing|publish my book|publish a book)\b/.test(text) || /புத்தகம்|கட்டணம்|எவ்வளவு நாள்/.test(text)) {
      return tamil
        ? "இணையதளத்தில் திட்டத் தொடக்க நடைமுறை, கட்டண விதிமுறைகள் அல்லது பொதுவான காலக்கெடு குறிப்பிடப்படவில்லை. Quatrox-இன் வெளியீட்டு சேவைகளில் ePub/XML, copy editing, typesetting மற்றும் accessibility உள்ளன. உங்கள் திட்ட விவரங்களை " + emailLink() + " முகவரிக்கு அனுப்புங்கள்."
        : "The website doesn't specify a standard project-start process, payment terms, or general timelines. Publishing production services listed include ePub/XML, copy editing, typesetting, and accessibility. Contact " + emailLink() + " with your project details to discuss your book.";
    }

    if (/\b(mission|vision|who are you|about|company|what does quatrox do|what is quatrox|tell me about)\b/.test(text) || /நிறுவனம்|குவாட்ராக்ஸ் பற்றி|குவாட்ராக்ஸ் என்ன/.test(text)) {
      return tamil
        ? "Quatrox Solutions Private Limited என்பது தமிழ்நாட்டைத் தளமாகக் கொண்ட BPO நிறுவனம். 2025-ல் நிறுவப்பட்டது; publishing மற்றும் content technology சேவைகளை உலகளாவிய வாடிக்கையாளர்களுக்கு வழங்குகிறது. அதன் mission: துல்லியம், தொழில்நுட்பம் மற்றும் மக்களை முன்னிலைப்படுத்தும் பண்பாட்டின் மூலம் நம்பகமான, விரைவான outsourcing சேவைகளை வழங்குதல்."
        : "Quatrox Solutions Private Limited is a Tamil Nadu-based BPO company founded in 2025, providing publishing and content technology services to global clients. Its mission is to deliver fast, reliable outsourcing through precision, technology, and a people-first culture.";
    }

    if (/\b(service|services|offer|offering|what do you do|publishing|bpo|digital content|editing|edit|typesetting|accessib|conversion|convert|xml|epub|pdf|word|excel|ocr|data extract|transcri|subtitle|caption|locali[sz]|voice)\b/.test(text) || /சேவை|என்ன வழங்குகிறீர்கள்/.test(text)) {
      if (/\b(book|books|manuscript)\b/.test(text)) {
        return tamil
          ? "Quatrox இணையதளம் ePub/XML, editing, typesetting மற்றும் accessibility போன்ற publishing production சேவைகளைப் பட்டியலிடுகிறது; புத்தக வெளியீடு அல்லது விநியோகத்தைப் பற்றிய விவரங்கள் இல்லை. உங்கள் புத்தகத் திட்டத்தைப் பற்றி " + emailLink() + " தொடர்புகொள்ளுங்கள்."
          : "The website lists publishing production support such as ePub/XML, editing, typesetting, and accessibility, but doesn't describe book publication or distribution. Contact " + emailLink() + " to discuss your book project.";
      }
      if (/\b(epub|xml)\b/.test(text)) {
        return tamil
          ? "Quatrox ePub 2/3 conversion மற்றும் XML structuring சேவைகளை வழங்குகிறது. ePub reflowable அல்லது fixed-layout வடிவமாக இருக்கலாம்; XML உள்ளடக்கத்தை கட்டமைக்க உதவுகிறது. குறிப்பிட்ட தேவைக்கு " + emailLink() + " தொடர்புகொள்ளுங்கள்."
          : "Quatrox provides EPUB 2/3 conversion (reflowable or fixed-layout) and XML structuring. Contact " + emailLink() + " to discuss your files and specifications.";
      }
      if (/\b(subtitle|caption|transcri|locali[sz]|voice)\b/.test(text)) {
        return tamil
          ? "Media சேவைகளில் audio transcription, video subtitles/SRT, translation, captioning, localisation மற்றும் multilingual voice internationalisation அடங்கும். மேலும் விவரங்களுக்கு " + emailLink() + " தொடர்புகொள்ளுங்கள்."
          : "Media services include audio transcription, video subtitles/SRT, translation, accessibility captions, localisation, and multilingual voice internationalisation. Contact " + emailLink() + " to discuss a project.";
      }
      if (/\b(accessib)\b/.test(text)) {
        return tamil
          ? "Accessibility சேவைகளில் WCAG 2.1 மற்றும் PDF/UA tagging/remediation அடங்கும். உங்கள் ஆவணங்களைப் பற்றி பேச " + emailLink() + " தொடர்புகொள்ளுங்கள்."
          : "Accessibility services include WCAG 2.1 and PDF/UA tagging and remediation. Contact " + emailLink() + " with your content and requirements.";
      }
      return tamil
        ? "Quatrox publishing/content technology மற்றும் BPO சேவைகள்: ePub/XML conversion, PDF-to-Word/Excel conversion, document/data extraction, copy editing, proofreading, typesetting, accessibility remediation, transcription, subtitling, localisation மற்றும் voice internationalisation. விரிவான பட்டியலுக்கு <a href=\"service.html\">சேவைகள்</a> பக்கத்தைப் பாருங்கள்."
        : 'Quatrox provides publishing/content technology and BPO services: ePub/XML conversion, PDF-to-Word/Excel conversion, document/data extraction, copy editing, proofreading, typesetting, accessibility remediation, transcription, subtitling, localisation, and voice internationalisation. See the <a href="service.html">services page</a> for details.';
    }

    if (/\b(project|achievement|result|story|stories|turnaround|accuracy|how many|pages per day)\b/.test(text)) {
      return tamil
        ? "இணையதள customer stories-ல் EPUB திட்டத்திற்கு title ஒன்றுக்கு 2–3 நாட்கள், PDF-to-Word பணிக்கு நாளொன்றுக்கு 1,200+ பக்கங்கள், மற்றும் subtitle workflow-க்கு 30–50% வேகமான turnaround எனக் குறிப்பிடுகிறது. இவை குறிப்பிட்ட case study முடிவுகள்; எதிர்கால திட்டங்களுக்கான உத்தரவாதம் அல்ல."
        : "Published customer stories report 2–3 days per EPUB title, 1,200+ pages per day for a PDF-to-Word project, and 30–50% faster turnaround for an SRT workflow. These are results from specific case studies, not guarantees for every project.";
    }

    if (/\b(unrelated|weather|recipe|politic|sports|joke)\b/.test(text)) {
      return tamil ? "நான் Quatrox Solutions பற்றிய கேள்விகளுக்கு உதவுகிறேன். சேவைகள், பணியிடங்கள் அல்லது தொடர்பு விவரங்களைப் பற்றி கேளுங்கள்." : "I can help with questions about Quatrox Solutions. Please ask about our services, careers, or contact details.";
    }

    return fallback;
  }

  function setup() {
    var button = document.getElementById("chatbot-button");
    var chatWindow = document.getElementById("chatbot-window");
    var close = document.getElementById("chatbot-close");
    var input = document.getElementById("chatbot-input");
    var send = document.getElementById("chatbot-send");
    var messages = document.getElementById("chatbot-messages");
    if (!button || !chatWindow || !close || !input || !send || !messages) return;
    var notification = button.querySelector(".chatbot-notification");
    var hasWelcomed = false;
    var mobileViewport = window.matchMedia("(max-width: 600px)");
    var visualViewport = window.visualViewport;
    var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var viewportHeightBeforeFocus = visualViewport ? visualViewport.height : window.innerHeight;
    var viewportSyncTimer = 0;
    var viewportSyncFrame = 0;
    var pageScrollIntentUntil = 0;
    var pageTouchStart = null;

    if (isIOS) document.documentElement.classList.add("ios-chatbot-viewport");

    function syncKeyboardLayout() {
      viewportSyncFrame = 0;
      if (!mobileViewport.matches || !visualViewport || !chatWindow.classList.contains("open")) {
        chatWindow.classList.remove("keyboard-open");
        chatWindow.style.removeProperty("--chatbot-viewport-height");
        chatWindow.style.removeProperty("--chatbot-viewport-offset-top");
        if (visualViewport) viewportHeightBeforeFocus = visualViewport.height;
        return;
      }

      var activeField = chatWindow.contains(document.activeElement) &&
        document.activeElement.matches("input, textarea, select");
      var viewportHeight = visualViewport.height;
      if (!activeField || viewportHeight >= viewportHeightBeforeFocus - 100) {
        chatWindow.classList.remove("keyboard-open");
        chatWindow.style.removeProperty("--chatbot-viewport-height");
        chatWindow.style.removeProperty("--chatbot-viewport-offset-top");
        viewportHeightBeforeFocus = viewportHeight;
        return;
      }

      var heightValue = Math.round(viewportHeight) + "px";
      var offsetValue = Math.round(visualViewport.offsetTop) + "px";
      if (chatWindow.style.getPropertyValue("--chatbot-viewport-height") !== heightValue) {
        chatWindow.style.setProperty("--chatbot-viewport-height", heightValue);
      }
      if (chatWindow.style.getPropertyValue("--chatbot-viewport-offset-top") !== offsetValue) {
        chatWindow.style.setProperty("--chatbot-viewport-offset-top", offsetValue);
      }
      chatWindow.classList.add("keyboard-open");
    }

    function scheduleKeyboardLayout() {
      window.clearTimeout(viewportSyncTimer);
      if (viewportSyncFrame) window.cancelAnimationFrame(viewportSyncFrame);
      viewportSyncTimer = window.setTimeout(function () {
        viewportSyncFrame = window.requestAnimationFrame(syncKeyboardLayout);
      }, isIOS ? 120 : 0);
    }

    function closeChat(restoreFocus) {
      chatWindow.classList.remove("open", "keyboard-open");
      chatWindow.style.removeProperty("--chatbot-viewport-height");
      chatWindow.style.removeProperty("--chatbot-viewport-offset-top");
      if (chatWindow.contains(document.activeElement) && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      scheduleKeyboardLayout();
      if (restoreFocus) {
        window.requestAnimationFrame(function () { button.focus(); });
      }
    }

    if (visualViewport) {
      visualViewport.addEventListener("resize", scheduleKeyboardLayout);
      visualViewport.addEventListener("scroll", scheduleKeyboardLayout);
    }
    window.addEventListener("resize", scheduleKeyboardLayout);
    window.addEventListener("orientationchange", function () {
      viewportHeightBeforeFocus = window.innerHeight;
      scheduleKeyboardLayout();
    });
    chatWindow.addEventListener("focusin", function (event) {
      if (event.target.matches("input, textarea, select")) {
        scheduleKeyboardLayout();
      }
    });
    chatWindow.addEventListener("focusout", scheduleKeyboardLayout);
    if (!isIOS) {
      function notePageTouchStart(event) {
        if (!mobileViewport.matches || !chatWindow.classList.contains("open") ||
            chatWindow.contains(event.target) || !event.touches.length) {
          pageTouchStart = null;
          return;
        }
        pageTouchStart = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }

      document.addEventListener("touchstart", notePageTouchStart, { capture: true, passive: true });
      document.addEventListener("touchmove", function (event) {
        if (!pageTouchStart || !event.touches.length) return;
        var touch = event.touches[0];
        if (Math.abs(touch.clientX - pageTouchStart.x) > 8 ||
            Math.abs(touch.clientY - pageTouchStart.y) > 8) {
          pageScrollIntentUntil = Date.now() + 1200;
        }
      }, { capture: true, passive: true });
      document.addEventListener("touchend", function () {
        pageTouchStart = null;
      }, { capture: true, passive: true });
      document.addEventListener("touchcancel", function () {
        pageTouchStart = null;
      }, { capture: true, passive: true });
      document.addEventListener("wheel", function (event) {
        if (mobileViewport.matches && chatWindow.classList.contains("open") &&
            !chatWindow.contains(event.target)) {
          pageScrollIntentUntil = Date.now() + 500;
        }
      }, { capture: true, passive: true });
    }
    window.addEventListener("scroll", function () {
      if (!isIOS && mobileViewport.matches && chatWindow.classList.contains("open") &&
          Date.now() <= pageScrollIntentUntil) {
        pageScrollIntentUntil = 0;
        closeChat(false);
        return;
      }
      if (chatWindow.classList.contains("open")) scheduleKeyboardLayout();
    }, { passive: true });

    if (window.emailjs && typeof window.emailjs.init === "function") {
      window.emailjs.init({ publicKey: "eOLCPZHW3sfnApbFD" });
    }
    button.setAttribute("aria-label", "How Can We Help? ✨");
    var launcherLabel = button.querySelector(".chatbot-tooltip");
    if (launcherLabel) launcherLabel.textContent = "How Can We Help? ✨";

    function syncChatAccessibility() {
      var isOpen = chatWindow.classList.contains("open");
      button.setAttribute("aria-expanded", String(isOpen));
      chatWindow.setAttribute("aria-hidden", String(!isOpen));
      button.style.display = isOpen ? "none" : "";
      if (notification) notification.hidden = isOpen;
    }
    syncChatAccessibility();
    new MutationObserver(syncChatAccessibility).observe(chatWindow, {
      attributes: true,
      attributeFilter: ["class"]
    });

    var title = document.querySelector("#chatbot-header span");
    if (title) title.textContent = "Quatrox Solutions Assistant";

    function addMessage(label, content, fromUser) {
      var bubble = document.createElement("div");
      bubble.className = "chatbot-message " + (fromUser ? "user-message" : "assistant-message");
      var speaker = document.createElement("strong");
      speaker.textContent = label + ": ";
      bubble.appendChild(speaker);
      if (fromUser) {
        bubble.appendChild(document.createTextNode(content));
      } else {
        var answer = document.createElement("span");
        answer.innerHTML = content;
        bubble.appendChild(answer);
      }
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
      return bubble;
    }

    function addContactLinks(parent) {
      var links = document.createElement("div");
      links.className = "chatbot-contact-links";
      [
        { text: "Email us", href: "mailto:" + EMAIL },
        { text: "Call us", href: "tel:+917200801765" },
        { text: "WhatsApp", href: "https://wa.me/917200801765" }
      ].forEach(function (item) {
        var link = document.createElement("a");
        link.textContent = item.text;
        link.href = item.href;
        if (item.href.indexOf("https://") === 0) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        links.appendChild(link);
      });
      parent.appendChild(links);
    }

    function addQuickReplies(parent, items) {
      var group = document.createElement("div");
      group.className = "chatbot-quick-replies";
      items.forEach(function (item) {
        var reply = document.createElement("button");
        reply.type = "button";
        reply.textContent = item.label;
        reply.addEventListener("click", function () {
          if (item.project) {
            addMessage("You", item.label, true);
            appendProjectForm("");
          } else if (item.contact) {
            addMessage("You", item.label, true);
            var contact = addMessage("Quatro", "Need a little human help? 💙 Our team would be happy to assist you!", false);
            addContactLinks(contact);
          } else if (item.closing) {
            addMessage("You", item.label, true);
            var closing = addMessage("Quatro", "Thanks for stopping by! ✨ Great projects start with great conversations. Let's create something wonderful together!", false);
            addContactLinks(closing);
          } else {
            handleQuickReply(item);
          }
        });
        group.appendChild(reply);
      });
      messages.appendChild(group);
      messages.scrollTop = messages.scrollHeight;
    }

    function showWelcome() {
      if (hasWelcomed) return;
      hasWelcomed = true;
      addMessage("Quatro", "Hey there! 👋 Welcome to Quatrox Solutions!", false);
      var welcome = addMessage(
        "Quatro",
        "Big project or a little question? We're here to make your work easier. What can we help you with today? ✨<br><br>Need a little human help? 💙 Our team would be happy to assist you!",
        false
      );
      addContactLinks(welcome);
      addQuickReplies(welcome, [
        { label: "📚 Publishing Services", response: "Publishing services include copy editing, proofreading, typesetting, and digital publishing production. Tell me a little about what you're working on, or choose “Discuss a Project” to send an enquiry." },
        { label: "💻 XML & EPUB Solutions", response: "Quatrox provides EPUB 2/3 conversion (reflowable or fixed-layout) and XML structuring. Share your file types and specifications and the team can discuss a suitable workflow." },
        { label: "♿ Accessibility Services", response: "Accessibility services include WCAG 2.1 support and PDF/UA tagging and remediation. The team can review your content and accessibility requirements." },
        { label: "🌍 Translation & Subtitling", response: "Media services include transcription, video subtitles/SRT, translation, captioning, localisation, and multilingual voice internationalisation." },
        { label: "📊 BPO & Data Services", response: "BPO and data services include PDF-to-Word/Excel conversion, document and data extraction, and data processing. Tell us about your volumes and output needs." },
        { label: "🤝 Discuss a Project", project: true }
      ]);
    }

    function addFallbackDraft(parent, href) {
      if (parent.querySelector(".chatbot-fallback-draft")) return;
      var link = document.createElement("a");
      link.className = "chatbot-fallback-draft";
      link.href = href;
      link.textContent = "Open pre-filled email draft";
      parent.appendChild(link);
    }

    function appendProjectForm(serviceValue) {
      var bubble = addMessage(
        "Quatro",
        "Wonderful! 🚀 We'd love to hear about your project. Tell us a little about what you need, and our team will help you explore the right solution.",
        false
      );
      var form = document.createElement("form");
      form.className = "chatbot-enquiry-form";
      form.innerHTML =
        '<label>Your name *<input name="name" type="text" autocomplete="name" required minlength="2"></label>' +
        '<label>Email address *<input name="email" type="email" autocomplete="email" required></label>' +
        '<label>Service required *<select name="service" required>' +
          '<option value="">Choose a service</option>' +
          '<option>Publishing Services</option><option>XML & EPUB Solutions</option>' +
          '<option>Accessibility Services</option><option>Translation & Subtitling</option>' +
          '<option>BPO & Data Services</option><option>Other</option></select></label>' +
        '<label>Company name (optional)<input name="company" type="text" autocomplete="organization"></label>' +
        '<label>Brief project description *<textarea name="description" required minlength="5" rows="3"></textarea></label>' +
        '<button type="submit">Send project enquiry</button>' +
        '<p class="chatbot-form-status" role="status" aria-live="polite"></p>';
      bubble.appendChild(form);
      if (serviceValue) form.elements.service.value = serviceValue;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var values = {
          name: form.elements.namedItem("name").value.trim(),
          email: form.elements.namedItem("email").value.trim(),
          service: form.elements.namedItem("service").value,
          company: form.elements.namedItem("company").value.trim(),
          description: form.elements.namedItem("description").value.trim()
        };
        var status = form.querySelector(".chatbot-form-status");
        var submitButton = form.querySelector('button[type="submit"]');
        var details = "Project description: " + values.description +
          "\nCompany: " + (values.company || "Not provided");
        var draft = "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent("Website project enquiry - " + values.service) +
          "&body=" + encodeURIComponent(
            "Name: " + values.name + "\nEmail: " + values.email +
            "\nService: " + values.service + "\n" + details
          );

        if (!window.emailjs || typeof window.emailjs.send !== "function") {
          status.textContent = "We couldn't send this enquiry right now. Please email our team or use the pre-filled email draft below.";
          addFallbackDraft(form, draft);
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        status.textContent = "";
        window.emailjs.send("service_qoouqes", "template_656lb9e", {
          from_name: values.name,
          from_email: values.email,
          service: values.service,
          message: details
        }).then(function () {
          status.className = "chatbot-form-status success";
          status.textContent = "Your enquiry has been sent. Our team will be in touch.";
          form.reset();
          var closing = addMessage(
            "Quatro",
            "Thanks for stopping by! ✨ Great projects start with great conversations. Let's create something wonderful together!",
            false
          );
          addContactLinks(closing);
        }).catch(function (error) {
          console.error("Chatbot project enquiry error:", error);
          status.textContent = "We couldn't send your enquiry just now. Please email our team directly or use this pre-filled draft.";
          addFallbackDraft(form, draft);
        }).finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = "Send project enquiry";
        });
      });
      messages.scrollTop = messages.scrollHeight;
    }

    function handleQuickReply(item) {
      addMessage("You", item.label, true);
      var typing = document.createElement("div");
      typing.className = "chatbot-message assistant-message chatbot-typing";
      typing.setAttribute("aria-label", "Quatro is typing");
      typing.innerHTML = "Quatro is typing <span></span><span></span><span></span>";
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      window.setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        addMessage("Quatro", item.response, false);
        addQuickReplies(messages, [
          { label: "🤝 Discuss a Project", project: true },
          { label: "Contact our team", contact: true },
          { label: "✨ Finish chat", closing: true }
        ]);
      }, 400);
    }

    function submitMessage() {
      var message = input.value.trim();
      if (!message) return;
      addMessage("You", message, true);
      input.value = "";
      if (/^(discuss a project|project enquiry|start a project)$/i.test(message)) {
        appendProjectForm("");
        return;
      }
      if (/^(contact our team|contact team)$/i.test(message)) {
        var contact = addMessage("Quatro", "Need a little human help? 💙 Our team would be happy to assist you!", false);
        addContactLinks(contact);
        return;
      }
      if (/^(finish chat|bye|goodbye|see you)$/i.test(message)) {
        var closing = addMessage("Quatro", "Thanks for stopping by! ✨ Great projects start with great conversations. Let's create something wonderful together!", false);
        addContactLinks(closing);
        return;
      }
      var typing = document.createElement("div");
      typing.className = "chatbot-message assistant-message chatbot-typing";
      typing.setAttribute("aria-label", "Quatro is typing");
      typing.innerHTML = "Quatro is typing <span></span><span></span><span></span>";
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      window.setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        addMessage("Quatro", responseFor(message), false);
      }, 400);
    }

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("#chatbot-button")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var isOpen = !chatWindow.classList.contains("open");
        chatWindow.classList.toggle("open", isOpen);
        if (isOpen) {
          showWelcome();
          if (!mobileViewport.matches) input.focus();
        } else {
          closeChat(true);
        }
      } else if (target.closest("#chatbot-close")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeChat(true);
      } else if (target.closest("#chatbot-send")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitMessage();
      }
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.target === input && event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitMessage();
        return;
      }
      if (event.key !== "Escape" || !chatWindow.classList.contains("open")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeChat(true);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
