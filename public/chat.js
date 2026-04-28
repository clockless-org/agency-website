// Landing-page floating chat bubble — squared blackout pill, demo-only, no backend.
(function () {
  const STRINGS = {
    en: {
      title: "Aperture & Ink",
      sub: "Brooklyn studio · Usually replies within the hour",
      greeting: "Hi! I'm Reese. Aperture & Ink builds brand identity systems, packaging, and launch campaigns for founder-led brands. Ask me anything — scope, timelines, what the portal looks like, how we run a launch.",
      placeholder: "Type a message…",
      replies: [
        "Great question — most brands I work with come in 6–18 weeks before launch. Want to jump on a 15-minute call to sanity-check your timeline?",
        "Honest answer: a brand identity engagement runs $45–95k depending on scope, and packaging adds on top. Send me a quick email at hello@agency.clockless.ai and I'll size it for you.",
        "Yes — every client gets a private portal like the one Tide & Tonic are using. You can peek at their build at /portal.",
        "I usually have a studio walk-through slot on Friday afternoons. Want me to save you one?",
        "Production, color proofs, and final deliverable approval are where 95% of launch stress happens. We track every revision in the portal so nothing slips.",
      ],
      closeLabel: "Close studio line",
      openLabel: "Open studio line",
      buttonLabel: "Studio",
    },
    zh: {
      title: "Aperture & Ink",
      sub: "布鲁克林工作室 · 通常一小时内回复",
      greeting: "你好！我是 Reese。Aperture & Ink 为创始人主导的品牌打造品牌识别系统、包装与上线战役。scope、时间线、门户长什么样、上线怎么跑——随便问。",
      placeholder: "输入消息…",
      replies: [
        "好问题——我合作的多数品牌是在上线前 6 到 18 周找到我们的。要不要先约一个 15 分钟的电话，把时间线捋一遍？",
        "诚实地说，品牌识别项目通常在 $45k 到 $95k 之间，包装是另算的。写封邮件到 hello@agency.clockless.ai，我帮你把 scope 大致估一下。",
        "是——每位客户都有一个和 Tide & Tonic 同样的私人门户。想先看看他们的建设过程，去 /portal 就行。",
        "周五下午我一般都有一个工作室走访时段。要不要帮你预留一个？",
        "生产、色稿、最终交付物签字是 95% 上线压力的来源。我们把每一轮修改都记在门户里，不会漏掉一项。",
      ],
      closeLabel: "关闭工作室对话",
      openLabel: "打开工作室对话",
      buttonLabel: "工作室",
    },
  };

  function currentLang() {
    const l = document.documentElement.lang;
    return l === "zh" ? "zh" : "en";
  }
  function S() {
    return STRINGS[currentLang()];
  }

  const host = document.createElement("div");
  host.className = "studio-chat";
  host.innerHTML = `
    <button class="studio-chat__bubble" type="button" aria-label="" data-role="toggle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span data-role="button-label">Studio</span>
    </button>
    <div class="studio-chat__panel" role="dialog" aria-hidden="true">
      <header class="studio-chat__head">
        <span class="studio-chat__head-avatar" aria-hidden="true">RO</span>
        <div class="studio-chat__head-text">
          <strong data-role="title"></strong>
          <span data-role="sub"></span>
        </div>
        <button class="studio-chat__close" type="button" aria-label="" data-role="close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 6-12 12M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="studio-chat__scroll" data-role="scroll"></div>
      <footer class="studio-chat__input">
        <textarea rows="1" data-role="input"></textarea>
        <button class="studio-chat__send" type="button" aria-label="Send" data-role="send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2-7-8-3z"/></svg>
        </button>
      </footer>
    </div>
  `;
  document.body.appendChild(host);

  const $ = (sel) => host.querySelector(sel);
  const toggleBtn = $('[data-role="toggle"]');
  const closeBtn = $('[data-role="close"]');
  const panel = $(".studio-chat__panel");
  const scroll = $('[data-role="scroll"]');
  const input = $('[data-role="input"]');
  const sendBtn = $('[data-role="send"]');
  const titleEl = $('[data-role="title"]');
  const subEl = $('[data-role="sub"]');
  const buttonLabelEl = $('[data-role="button-label"]');

  let replyIdx = 0;
  let busy = false;
  const history = [];

  function renderHistory() {
    const lang = currentLang();
    scroll.innerHTML = "";
    history.forEach((m) => {
      const div = document.createElement("div");
      div.className =
        "studio-chat__msg studio-chat__msg--" + (m.role === "user" ? "user" : "agent");
      div.textContent = typeof m.body === "string" ? m.body : m.body[lang];
      scroll.appendChild(div);
    });
    scroll.scrollTop = scroll.scrollHeight;
  }

  function refreshLanguage() {
    const s = S();
    titleEl.textContent = s.title;
    subEl.textContent = s.sub;
    input.placeholder = s.placeholder;
    buttonLabelEl.textContent = s.buttonLabel;
    toggleBtn.setAttribute(
      "aria-label",
      panel.classList.contains("is-open") ? s.closeLabel : s.openLabel,
    );
    closeBtn.setAttribute("aria-label", s.closeLabel);
    if (history.length === 0) {
      history.push({
        role: "agent",
        body: { en: STRINGS.en.greeting, zh: STRINGS.zh.greeting },
      });
    }
    renderHistory();
  }

  function openPanel(open) {
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    toggleBtn.setAttribute(
      "aria-label",
      open ? S().closeLabel : S().openLabel,
    );
    if (open) setTimeout(() => input.focus(), 50);
  }

  toggleBtn.addEventListener("click", () =>
    openPanel(!panel.classList.contains("is-open")),
  );
  closeBtn.addEventListener("click", () => openPanel(false));

  function send() {
    const val = input.value.trim();
    if (!val || busy) return;
    busy = true;
    history.push({ role: "user", body: val });
    input.value = "";
    renderHistory();
    const typingIdx = history.push({
      role: "agent",
      body: { en: "…", zh: "…" },
    }) - 1;
    renderHistory();
    setTimeout(() => {
      const en = STRINGS.en.replies[replyIdx % STRINGS.en.replies.length];
      const zh = STRINGS.zh.replies[replyIdx % STRINGS.zh.replies.length];
      replyIdx += 1;
      history[typingIdx] = { role: "agent", body: { en, zh } };
      renderHistory();
      busy = false;
    }, 900);
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  const observer = new MutationObserver(() => refreshLanguage());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "data-lang"],
  });

  refreshLanguage();
})();
