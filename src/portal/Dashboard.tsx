import { useEffect, useState } from 'react'
import type { PortalMember, PortalTenantIdentity } from './api'
import './dashboard.css'

type Lang = 'en' | 'zh'
type TL = { en: string; zh: string }

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem('agency-lang')
  if (stored === 'zh' || stored === 'en') return stored
  if (navigator.language && navigator.language.toLowerCase().startsWith('zh')) return 'zh'
  return 'en'
}

function tl(lang: Lang, v: string | TL): string {
  return typeof v === 'string' ? v : v[lang]
}

const T = {
  'demo.pill': { en: 'DEMO', zh: '演示' },
  'back.site': { en: 'Back to site', zh: '返回主站' },
  'call': { en: 'Call', zh: '通话' },
  'header.tagline': {
    en: 'A calm, senior creative team for your launch — every brief, revision, and approval tracked in this portal.',
    zh: '一支从容、资深的创意团队为你的上线而工作——每一份 brief、每一轮修改、每一次签字都记录在这个门户里。',
  },
  'tab.journey': { en: 'Runsheet', zh: 'Runsheet' },
  'tab.deliverables': { en: 'Work Wall', zh: 'Work Wall' },
  'tab.brand': { en: 'Mark', zh: 'Mark' },
  'tab.schedule': { en: 'Calendar', zh: 'Calendar' },
  'tab.billing': { en: 'Statement', zh: 'Statement' },
  'tab.documents': { en: 'File Room', zh: 'File Room' },
  'tab.messages': { en: 'Studio Line', zh: 'Studio Line' },
  'running.eyebrow': { en: "WHAT'S RUNNING", zh: 'WHAT’S RUNNING' },
  'running.current': {
    en: 'Final packaging review · Tide & Tonic Day 18',
    zh: '包装最终审阅 · Tide & Tonic 第 18 天',
  },
  'running.deadline': {
    en: 'DUE 04 / 22 · 10:00 AM ET',
    zh: '截止 04 / 22 · 10:00 ET',
  },
  'running.next': { en: 'NEXT THREE', zh: '接下来三步' },
  'journey.eyebrow': { en: 'The Runsheet', zh: '生产排程' },
  'journey.title.suffix': { en: ' — production schedule', zh: ' — 生产排程' },
  'journey.subtitle': { en: 'From the kickoff brief to the launch window — every step, on the same wall.', zh: '从立项 brief 到上线窗口——每一步，集中在同一面墙上。' },
  'journey.complete': { en: '% complete', zh: '% 已完成' },
  'journey.of': { en: 'of', zh: '/' },
  'journey.stages.done': { en: 'stages done · Now:', zh: '阶段已完成 · 当前：' },
  'journey.current': { en: 'CURRENT', zh: '当前' },
  'journey.done': { en: 'DONE', zh: '完成' },
  'journey.upcoming': { en: 'NEXT', zh: '后续' },
  'deliverables.title': { en: 'Work Wall', zh: '作品墙' },
  'deliverables.subtitle': { en: 'Every artifact in the engagement — what stage it sits at, who owns it, and what the next gate is.', zh: '本次合作中的每一件交付物——它处于哪个阶段、由谁负责，以及下一个签字节点是什么。' },
  'brand.title': { en: 'The Mark', zh: '品牌符号' },
  'brand.subtitle': { en: 'Tide & Tonic’s positioning, voice, and visual system — the language we built around the product so every channel speaks the same way.', zh: 'Tide & Tonic 的定位、语调与视觉系统——围绕产品建立的一套语言，让每一条渠道都用同样的方式说话。' },
  'brand.hero.caption': { en: 'Tide & Tonic — small-batch RTD craft cocktails, born in Brooklyn', zh: 'Tide & Tonic — 在布鲁克林诞生的小批量预调精酿鸡尾酒' },
  'schedule.title': { en: 'Calendar', zh: '日程' },
  'schedule.subtitle': { en: 'What’s on the calendar between now and the post-launch debrief.', zh: '从现在到上线后复盘之间，日历上有些什么。' },
  'billing.title': { en: 'Statement', zh: '账单' },
  'billing.paid': { en: 'paid', zh: '已付款' },
  'billing.pending': { en: 'pending. Every milestone draw and reimbursable, in one ledger.', zh: '待付款。每一笔阶段付款和代垫报销，都在一个账本里。' },
  'documents.title': { en: 'File Room', zh: '文件室' },
  'documents.subtitle': { en: 'Everything signed, sent for approval, or shared — always in one place.', zh: '所有已签署、已送签或已共享的文件——始终集中在一处。' },
  'messages.title': { en: 'Studio Line', zh: '工作室对话' },
  'messages.subtitle': { en: 'Your shared thread with the studio. Use the chat bubble for faster questions.', zh: '你和工作室的共享消息线。要问得更快，用右下角的聊天气泡。' },
  'addcal': { en: 'Add to calendar', zh: '加入日历' },
  'download': { en: 'Download', zh: '下载' },
  'reviewsign': { en: 'Review & approve', zh: '审阅并签字' },
  'review': { en: 'Review', zh: '查看' },
  'open': { en: 'Open', zh: '打开' },
  'reese.takeaway': { en: 'Reese’s takeaway', zh: 'Reese 的总结' },
  'why.route2': { en: 'Why route 2 won', zh: '为什么最终选择了第二条路线' },
  'what.learned': { en: 'What we learned', zh: '我们学到了什么' },
  'invoice.fraud': { en: 'Reminder on master-file release', zh: '母文件交付提醒' },
  'message.studio': { en: 'Message the studio', zh: '发消息给工作室' },
  'review.sign': { en: 'Review & approve', zh: '审阅并签字' },
} as const

type TKey = keyof typeof T
function t(lang: Lang, key: TKey): string {
  return T[key][lang]
}

interface Props {
  member: PortalMember
  tenant: PortalTenantIdentity | null
  onSignOut: () => void
}

type TabId = 'journey' | 'deliverables' | 'brand' | 'schedule' | 'billing' | 'documents' | 'messages'

type StageContent =
  | { kind: 'info-grid'; rows: { label: TL; value: TL; emphasis?: 'success' | 'warning' | 'accent' }[] }
  | { kind: 'documents'; items: { name: TL; size: TL; action?: boolean }[] }
  | { kind: 'checklist'; items: { label: TL; done: boolean; sub?: TL }[] }
  | { kind: 'actions'; buttons: { labelKey: TKey; primary?: boolean; href?: string }[] }
  | { kind: 'note'; titleKey: TKey; body: TL }

interface Stage {
  id: string
  idx: number
  tag: TL
  title: TL
  status: 'done' | 'active' | 'upcoming'
  dateLabel: TL
  summary: TL
  content: StageContent[]
}

const STAGES: Stage[] = [
  {
    id: 'discovery', idx: 1,
    tag: { en: 'Discovery', zh: '初次沟通' },
    title: { en: 'The first honest scope conversation', zh: '第一次诚实地聊清楚 scope' },
    status: 'done',
    dateLabel: { en: 'Sep 2025', zh: '2025 年 9 月' },
    summary: { en: 'Aligned on goals. Series Seed CPG, Q3 launch window, three SKUs of packaging plus a hero campaign. Reese sanity-checked the timeline.', zh: '对齐了目标。Seed 轮 CPG 公司、Q3 上线窗口、三个 SKU 的包装加一个主片战役。Reese 把时间线核了一遍。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Engagement budget', zh: '合作预算' }, value: { en: '$185k–$215k all-in', zh: '$185k – $215k（含税总价）' } },
        { label: { en: 'Phase mix', zh: '阶段构成' }, value: { en: '40% identity · 35% packaging · 25% campaign', zh: '40% 识别 · 35% 包装 · 25% 战役' } },
        { label: { en: 'Target launch', zh: '目标上线' }, value: { en: 'Q3 — first SKUs on shelf in 14 weeks', zh: 'Q3 — 首批 SKU 在 14 周内上架' } },
        { label: { en: 'Channel mix', zh: '渠道构成' }, value: { en: 'NYC indie grocers · DTC · select wine bars', zh: '纽约独立超市 · DTC · 精选酒吧' } },
        { label: { en: 'Decision quorum', zh: '决策核心' }, value: { en: 'Camilla + Jonah · founders, both signers', zh: 'Camilla + Jonah · 两位创始人，共同签字' } },
      ]},
      { kind: 'note', titleKey: 'reese.takeaway',
        body: {
          en: 'Your real budget is $195k with a small launch-prod stretch. The $215k top is only for a campaign that genuinely earns it. Don’t anchor to that ceiling in the brief — it will distort every concept route.',
          zh: '你们真实的预算是 $195k，再加一点上线制作的伸展空间。$215k 这个上限，只为真正配得上的战役保留。别在 brief 里拿那个上限去锚定——它会扭曲我们对每一条概念方向的判断。',
        } },
    ],
  },
  {
    id: 'audit', idx: 2,
    tag: { en: 'Brand Audit', zh: '品牌审计' },
    title: { en: 'Audit complete with category map', zh: '完成审计 + 品类地图' },
    status: 'done',
    dateLabel: { en: 'Oct 2025', zh: '2025 年 10 月' },
    summary: { en: 'Walked the RTD cocktail aisle in Brooklyn, Manhattan, and Hudson Valley. 27 competitors mapped, voice tested across 18 social handles, and one regulatory landmine found early.', zh: '走访了布鲁克林、曼哈顿与哈德逊河谷的预调鸡尾酒货架。绘出 27 家竞品地图、在 18 个社媒账号上测试了语调，并提前发现了一个监管地雷。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Direct competitors', zh: '直接竞品' }, value: { en: '11 — most lean &ldquo;clean / minimal&rdquo;', zh: '11 家——多数走「干净 / 极简」路线' } },
        { label: { en: 'Adjacent competitors', zh: '邻近竞品' }, value: { en: '16 — non-alc, hard seltzer, indie wine', zh: '16 家——无酒精、硬苏打、独立葡萄酒' } },
        { label: { en: 'Whitespace', zh: '空白地带' }, value: { en: '&ldquo;Brooklyn-side, dinner-party, mid-ABV&rdquo;', zh: '「布鲁克林一侧、晚宴场景、中等酒精度」' }, emphasis: 'success' },
        { label: { en: 'Regulatory flag', zh: '监管警示' }, value: { en: 'NY ABC label review needs 6-week buffer', zh: 'NY 酒类管理局标签审阅需要 6 周缓冲' }, emphasis: 'warning' },
      ]},
    ],
  },
  {
    id: 'concept', idx: 3,
    tag: { en: 'Concept Sprint', zh: '概念冲刺' },
    title: { en: 'Three concept routes presented', zh: '提报三条概念路线' },
    status: 'done',
    dateLabel: { en: 'Nov 2025', zh: '2025 年 11 月' },
    summary: { en: 'Three defendable routes. Route 1 leaned heritage-Italian, route 2 leaned Brooklyn-modern, route 3 leaned playful-illustration. Each had a real thesis behind it.', zh: '三条都站得住的路线。路线 1 偏意式传承、路线 2 偏布鲁克林现代、路线 3 偏俏皮插画。每条路线背后都有真实可辩护的命题。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Route 1 — &ldquo;Aperitivo&rdquo;', zh: '路线 1 —「Aperitivo」' }, value: { en: 'Heritage-Italian, dinner-table seriousness', zh: '意式传承，晚餐桌的庄重感' } },
        { label: { en: 'Route 2 — &ldquo;Tide Line&rdquo;', zh: '路线 2 —「Tide Line」' }, value: { en: 'Brooklyn-modern, dinner-party warmth', zh: '布鲁克林现代，晚宴的温度' }, emphasis: 'success' },
        { label: { en: 'Route 3 — &ldquo;After Hours&rdquo;', zh: '路线 3 —「After Hours」' }, value: { en: 'Playful-illustration, late-night levity', zh: '俏皮插画，深夜的轻盈' } },
      ]},
      { kind: 'note', titleKey: 'why.route2',
        body: {
          en: 'Route 2 owns the dinner-party occasion better than any competitor on the wall, holds up at trade-press scale, and survives the regulatory back panel without losing its voice. We recommended it; you both agreed in the room.',
          zh: '在所有货架上的竞品中，路线 2 最能 own「晚宴场景」这个时刻；放大到行业刊物层级也站得住；经过监管类后侧文案审阅之后语调依然不变。我们推荐它；你们两位当场都同意了。',
        } },
    ],
  },
  {
    id: 'direction', idx: 4,
    tag: { en: 'Brand Direction', zh: '品牌方向' },
    title: { en: 'Locked direction with refined system', zh: '锁定方向 + 精炼系统' },
    status: 'done',
    dateLabel: { en: 'Dec 2025', zh: '2025 年 12 月' },
    summary: { en: 'Selected route 2 sharpened: type stack locked, color palette narrowed to four core tones, photography direction approved.', zh: '路线 2 被进一步锐化：字体堆栈锁定、色彩缩到四个核心色调、摄影方向通过。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Wordmark', zh: '字标' }, value: { en: 'Locked — custom drawn', zh: '锁定 — 手绘' }, emphasis: 'success' },
        { label: { en: 'Type stack', zh: '字体堆栈' }, value: { en: 'Display serif + house grotesk', zh: 'Display serif + house grotesk' } },
        { label: { en: 'Core palette', zh: '核心色板' }, value: { en: 'Tide green · Brick · Cream · Off-black', zh: 'Tide 绿 · 砖红 · 奶油 · 近黑' } },
        { label: { en: 'Photography', zh: '摄影方向' }, value: { en: 'Warm-flash, dinner-table, hands-in-frame', zh: '暖闪、餐桌、手部入画' } },
      ]},
    ],
  },
  {
    id: 'round1', idx: 5,
    tag: { en: 'Round-1 Revisions', zh: '第一轮修改' },
    title: { en: 'Revised packaging back panel for NY ABC', zh: '为 NY 酒管局修改包装后侧' },
    status: 'done',
    dateLabel: { en: 'Jan 2026', zh: '2026 年 1 月' },
    summary: { en: 'Round-1 review with the founders. Front-of-can stayed; back panel needed two passes for ABV legibility and government warning placement.', zh: '与创始人完成第一轮审阅。罐体正面保留；后侧因酒精度可读性与政府警示语位置需要做两轮调整。' },
    content: [
      { kind: 'note', titleKey: 'what.learned',
        body: {
          en: 'NY ABC reviews are stricter on warning language size than the federal TTB minimum. We updated our packaging template to pre-stage the larger warning block at draft stage, removing one round from every future SKU.',
          zh: 'NY 酒管局对警示语字号的要求比联邦 TTB 最低标准更严。我们更新了包装模板：在草稿阶段就预留更大的警示块，未来每个 SKU 都能少一轮反复。',
        } },
    ],
  },
  {
    id: 'final-system', idx: 6,
    tag: { en: 'Final Brand System', zh: '最终品牌系统' },
    title: { en: 'Brand Guidelines v1.0 locked', zh: 'Brand Guidelines v1.0 锁定' },
    status: 'done',
    dateLabel: { en: 'Feb 2026', zh: '2026 年 2 月' },
    summary: { en: 'Final guidelines doc with 38 pages, 3 SKU front-of-can comps, retail tier, and a tightly scoped revision log. Founders signed off; SOW phase 2 closed.', zh: '最终品牌规范 38 页定稿：3 个 SKU 罐体正面 comp、零售层级、收紧的修改日志。两位创始人签字；SOW 第二阶段结清。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Guidelines version', zh: '品牌规范版本' }, value: { en: 'v1.0 · 38 pages', zh: 'v1.0 · 38 页' }, emphasis: 'success' },
        { label: { en: 'SKU comps', zh: 'SKU 设计图' }, value: { en: '3 — Spritz · Tonic · Aperitif', zh: '3 个——Spritz · Tonic · Aperitif' } },
        { label: { en: 'Retail tier', zh: '零售层级' }, value: { en: 'Indie / specialty / wine bars', zh: '独立 / 精品 / 酒吧' } },
        { label: { en: 'Revision rounds used', zh: '已用修改轮次' }, value: { en: '4 of 5 contracted', zh: '合同 5 轮已用 4 轮' } },
      ]},
    ],
  },
  {
    id: 'production', idx: 7,
    tag: { en: 'Production', zh: '生产' },
    title: { en: 'Color proofs at the printer', zh: '印厂色稿审核中' },
    status: 'active',
    dateLabel: { en: 'Apr 2026', zh: '2026 年 4 月' },
    summary: { en: 'Printer’s wet proofs back. Pantone 5605 needs a small tonal lift on the Tonic SKU. Hero film and OOH masters in offline edit.', zh: '印厂湿样回来了。Tonic SKU 上的 Pantone 5605 需要微调亮度。主片与户外大牌母版在离线剪辑中。' },
    content: [
      { kind: 'info-grid', rows: [
        { label: { en: 'Production deposit', zh: '生产定金' }, value: { en: '$48,000 · paid Apr 02', zh: '$48,000 · 4 月 2 日已付' }, emphasis: 'success' },
        { label: { en: 'Color proofs', zh: '色稿' }, value: { en: 'Round-2 approved · Pantone 5605 lift', zh: '第二轮通过 · Pantone 5605 微调' }, emphasis: 'success' },
        { label: { en: 'Hero film offline', zh: '主片离线剪辑' }, value: { en: '60s + 30s + 15s + 6s vertical', zh: '60秒 + 30秒 + 15秒 + 6秒竖版' }, emphasis: 'success' },
        { label: { en: 'OOH masters', zh: '户外大牌母版' }, value: { en: 'Subway · billboard · transit · all routed', zh: '地铁 · 户外大牌 · 交通 · 全部路由完成' }, emphasis: 'success' },
        { label: { en: 'Brand Guidelines v1.0 sign-off', zh: 'Brand Guidelines v1.0 签字' }, value: { en: 'Review + approve by Apr 22', zh: '4 月 22 日前审阅并签字' }, emphasis: 'warning' },
      ]},
      { kind: 'documents', items: [
        { name: { en: 'Brand Guidelines v1.0', zh: 'Brand Guidelines v1.0' }, size: { en: 'PDF · 38 pages', zh: 'PDF · 38 页' }, action: true },
        { name: { en: 'Color-proof memo (round 2)', zh: '色稿备忘录（第二轮）' }, size: { en: 'PDF · 6 pages', zh: 'PDF · 6 页' } },
        { name: { en: 'Hero film offline cut', zh: '主片离线剪辑' }, size: { en: 'MP4 · 60s', zh: 'MP4 · 60 秒' } },
        { name: { en: 'OOH master files', zh: '户外大牌母版' }, size: { en: '4 PDFs', zh: '4 个 PDF' } },
      ]},
      { kind: 'actions', buttons: [
        { labelKey: 'review.sign', primary: true },
        { labelKey: 'message.studio' },
      ]},
    ],
  },
  {
    id: 'launch', idx: 8,
    tag: { en: 'Launch Window', zh: '上线窗口' },
    title: { en: 'Photo shoot, color session, and master release', zh: '摄影、调色、母文件交付' },
    status: 'upcoming',
    dateLabel: { en: 'Apr 25 – May 03', zh: '4 月 25 日 – 5 月 3 日' },
    summary: { en: 'Three appointments, eight days. Reese will be physically at two of them.', zh: '八天三个日程。其中两个 Reese 会亲自到场。' },
    content: [
      { kind: 'checklist', items: [
        { label: { en: 'Photo shoot — Brooklyn Navy Yard', zh: '摄影日 — 布鲁克林海军船坞' }, done: false, sub: { en: 'Sun Apr 26 · all day · Reese on set', zh: '4 月 26 日（日）全天 · Reese 全程' } },
        { label: { en: 'Final film color session — Final Frame', zh: '主片最终调色 — Final Frame' }, done: false, sub: { en: 'Tue Apr 29 · 11:00 AM · Williamsburg', zh: '4 月 29 日（二）11:00 · 威廉斯堡' } },
        { label: { en: 'Master files & IP transfer signing', zh: '母文件与 IP 转让签字' }, done: false, sub: { en: 'Wed Apr 30 · 1:00 PM · Aperture & Ink studio · Reese attending', zh: '4 月 30 日（三）13:00 · Aperture & Ink 工作室 · Reese 到场' } },
      ]},
      { kind: 'note', titleKey: 'invoice.fraud',
        body: {
          en: 'Master files only release after the final invoice clears and the IP assignment is countersigned. Any email asking you to wire production funds — even from the studio — should be confirmed by phone before sending. We do not change banking details mid-engagement.',
          zh: '母文件只有在尾款结清、IP 转让协议双方签字之后才会交付。任何要求你们电汇生产款的邮件——哪怕看起来是工作室发的——都请先电话确认。项目过程中，我们不会更改收款账户信息。',
        } },
    ],
  },
  {
    id: 'post-launch', idx: 9,
    tag: { en: 'Post-Launch & Care', zh: '上线后护航' },
    title: { en: 'Master files, brand-care window, and 90-day debrief', zh: '母文件、品牌护航期、90 天复盘' },
    status: 'upcoming',
    dateLabel: { en: 'May – Aug 2026', zh: '2026 年 5–8 月' },
    summary: { en: 'Studio sends the full asset-handoff bundle 3 days before launch. 30-day brand-care window included; 90-day debrief already on the calendar.', zh: '工作室会在上线前 3 天发完整的资产交付包。包含 30 天品牌护航期；90 天复盘已经放进日历。' },
    content: [
      { kind: 'checklist', items: [
        { label: { en: 'Master files released', zh: '母文件交付' }, done: false, sub: { en: 'Thu May 01 · 10:00 AM', zh: '5 月 1 日（四）10:00' } },
        { label: { en: 'Trade press kit — sent to 14 outlets', zh: '行业媒体物料 — 发送至 14 家' }, done: false },
        { label: { en: 'Paid social toolkit handoff', zh: '付费社媒物料包交付' }, done: false },
        { label: { en: 'OOH placement — subway + Brooklyn', zh: '户外投放 — 地铁 + 布鲁克林' }, done: false },
        { label: { en: 'Trademark filing — USPTO confirmation', zh: '商标申请 — USPTO 确认' }, done: false },
        { label: { en: 'Brand-care window — 30 days', zh: '品牌护航期 — 30 天' }, done: false },
        { label: { en: '90-day post-launch debrief with Reese', zh: '90 天上线后复盘（Reese 主持）' }, done: false, sub: { en: 'Aug 2026 · sell-through review + next-window plan', zh: '2026 年 8 月 · 动销复盘 + 下一波计划' } },
      ]},
    ],
  },
]

interface DeliverableRow { status: TL; title: string; subtitle: TL; rounds: number; revs: number; sku: number; price: string; accent?: boolean; notes?: TL; tone: 'lime' | 'magenta' | 'blackout' | 'paper-deep' }

const DELIVERABLES: DeliverableRow[] = [
  { status: { en: 'In Approval', zh: '签字中' }, title: 'Brand Guidelines v1.0', subtitle: { en: 'Master identity doc · 38 pages', zh: '品牌识别母规范 · 38 页' }, rounds: 4, revs: 4, sku: 1, price: '$58,000', accent: true, notes: { en: 'Final sign-off blocks production master release.', zh: '最终签字是母文件交付的前置门。' }, tone: 'lime' },
  { status: { en: 'Production', zh: '生产' }, title: 'Tide & Tonic Spritz · 12oz can', subtitle: { en: 'Packaging · 3 SKUs · NY ABC cleared', zh: '包装 · 3 个 SKU · NY 酒管局通过' }, rounds: 5, revs: 5, sku: 3, price: '$46,500', notes: { en: 'Pantone 5605 lift confirmed at the wet-proof stage.', zh: '湿样阶段确认了 Pantone 5605 的微调。' }, tone: 'magenta' },
  { status: { en: 'Production', zh: '生产' }, title: 'Hero Film · 60s + cuts', subtitle: { en: 'Campaign film · 60s / 30s / 15s / 6s', zh: '战役主片 · 60秒 / 30秒 / 15秒 / 6秒' }, rounds: 3, revs: 2, sku: 4, price: '$38,000', notes: { en: 'Final color session at Final Frame on Apr 29.', zh: '4 月 29 日在 Final Frame 做最终调色。' }, tone: 'blackout' },
  { status: { en: 'Routed', zh: '已发布通路' }, title: 'OOH Series · Subway + Brooklyn', subtitle: { en: 'Out-of-home · 4 placements', zh: '户外 · 4 个媒介' }, rounds: 2, revs: 2, sku: 4, price: '$22,400', notes: { en: 'Subway car-card, Bedford station, BK billboard, Williamsburg bridge.', zh: '地铁车厢卡、Bedford 站、布鲁克林大牌、威廉斯堡桥。' }, tone: 'paper-deep' },
  { status: { en: 'Approved', zh: '已通过' }, title: 'Brand Strategy Doc · final', subtitle: { en: 'Strategy · audience + voice + system', zh: '策略 · 受众 + 语调 + 系统' }, rounds: 3, revs: 2, sku: 1, price: '$24,500', notes: { en: 'Audience: dinner-party hosts, mid-30s, NYC + Hudson Valley.', zh: '受众：晚宴主理人、35 岁上下、纽约 + 哈德逊河谷。' }, tone: 'lime' },
  { status: { en: 'In Concept', zh: '概念中' }, title: 'Trade Marketing Toolkit', subtitle: { en: 'Sell sheet, retailer one-pager, shelf strip', zh: '销售单、零售单页、货架条' }, rounds: 1, revs: 0, sku: 3, price: '$11,200', notes: { en: 'Drafts due May 09 ahead of indie-grocer trade show.', zh: '5 月 9 日交稿，赶上独立超市行业展。' }, tone: 'magenta' },
]

interface AppointmentRow { when: TL; title: TL; where: TL; status: TL }
const APPOINTMENTS: AppointmentRow[] = [
  { when: { en: 'Wed · Apr 22 · 10:00 AM', zh: '4 月 22 日（三）10:00' }, title: { en: 'Production review with Reese', zh: '与 Reese 的生产审阅通话' }, where: { en: 'Zoom', zh: 'Zoom' }, status: { en: 'Confirmed', zh: '已确认' } },
  { when: { en: 'Sun · Apr 26 · all day', zh: '4 月 26 日（日）全天' }, title: { en: 'Photo shoot — Brooklyn Navy Yard', zh: '摄影日 — 布鲁克林海军船坞' }, where: { en: 'On-set · Reese all day', zh: '现场 · Reese 全程' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Tue · Apr 29 · 11:00 AM', zh: '4 月 29 日（二）11:00' }, title: { en: 'Final film color session — Final Frame', zh: '主片最终调色 — Final Frame' }, where: { en: 'Williamsburg', zh: '威廉斯堡' }, status: { en: 'Action needed', zh: '需要处理' } },
  { when: { en: 'Wed · Apr 30 · 1:00 PM', zh: '4 月 30 日（三）13:00' }, title: { en: 'Master files & IP transfer signing', zh: '母文件与 IP 转让签字' }, where: { en: 'Aperture & Ink studio · 68 Jay St', zh: 'Aperture & Ink 工作室 · 68 Jay Street' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Thu · May 01 · 10:00 AM', zh: '5 月 1 日（四）10:00' }, title: { en: 'Master files released + photos', zh: '母文件交付 + 合影' }, where: { en: 'Aperture & Ink studio', zh: 'Aperture & Ink 工作室' }, status: { en: 'Scheduled', zh: '已安排' } },
  { when: { en: 'Sat · May 17 · 11:00 AM', zh: '5 月 17 日（六）11:00' }, title: { en: 'Post-launch toast at the studio', zh: '工作室上线庆祝' }, where: { en: 'Aperture & Ink studio', zh: 'Aperture & Ink 工作室' }, status: { en: 'Optional', zh: '可选' } },
]

interface BillingRow { label: TL; amount: string; status: TL; date: TL; note?: TL }
const BILLING: BillingRow[] = [
  { label: { en: 'Onboarding fee', zh: '立项费' }, amount: '$12,500', status: { en: 'Paid', zh: '已付' }, date: { en: 'Sep 18, 2025', zh: '2025 年 9 月 18 日' }, note: { en: 'Wired from operating account', zh: '从运营账户电汇' } },
  { label: { en: 'Phase 1 — Discovery + Audit', zh: '第一阶段 — 立项 + 审计' }, amount: '$42,000', status: { en: 'Paid', zh: '已付' }, date: { en: 'Oct 09, 2025', zh: '2025 年 10 月 9 日' }, note: { en: 'Audit deliverable accepted Oct 7', zh: '10 月 7 日审计交付物通过' } },
  { label: { en: 'Phase 2 — Concept + Direction', zh: '第二阶段 — 概念 + 方向' }, amount: '$58,000', status: { en: 'Paid', zh: '已付' }, date: { en: 'Feb 20, 2026', zh: '2026 年 2 月 20 日' }, note: { en: 'Brand Guidelines v1.0 locked', zh: 'Brand Guidelines v1.0 锁定' } },
  { label: { en: 'Production deposit', zh: '生产定金' }, amount: '$48,000', status: { en: 'Paid', zh: '已付' }, date: { en: 'Apr 02, 2026', zh: '2026 年 4 月 2 日' }, note: { en: 'Print + film + OOH master prep', zh: '印刷 + 影片 + 户外母版准备' } },
  { label: { en: 'Photo shoot day rate (reimbursable)', zh: '摄影日费（代垫报销）' }, amount: '$8,400', status: { en: 'Pending', zh: '待付' }, date: { en: 'Due Apr 29', zh: '4 月 29 日到期' }, note: { en: 'Photographer + crew + location', zh: '摄影师 + 团队 + 场地' } },
  { label: { en: 'Final master release fee', zh: '尾款（母文件交付）' }, amount: '$32,000', status: { en: 'Pending', zh: '待付' }, date: { en: 'Due Apr 29', zh: '4 月 29 日到期' }, note: { en: 'Releases master files + IP transfer', zh: '触发母文件交付与 IP 转让' } },
  { label: { en: 'OOH placement reimbursable', zh: '户外投放代垫' }, amount: '$22,400', status: { en: 'Pending', zh: '待付' }, date: { en: 'Due May 02', zh: '5 月 2 日到期' }, note: { en: 'Subway car-card + 1 billboard', zh: '地铁车厢卡 + 1 块大牌' } },
]

interface DocumentRow { name: TL; kind: TL; updated: TL; action?: boolean }
const DOCUMENTS: DocumentRow[] = [
  { name: { en: 'Master Services Agreement — signed', zh: '主服务合同 — 已签署' }, kind: { en: 'PDF · 14 pages', zh: 'PDF · 14 页' }, updated: { en: 'Sep 17, 2025', zh: '2025 年 9 月 17 日' } },
  { name: { en: 'SOW v3.2 — current scope', zh: 'SOW v3.2 — 当前 scope' }, kind: { en: 'PDF · 9 pages', zh: 'PDF · 9 页' }, updated: { en: 'Feb 18, 2026', zh: '2026 年 2 月 18 日' } },
  { name: { en: 'Project brief (locked)', zh: '项目 brief（锁定）' }, kind: { en: 'PDF · 11 pages', zh: 'PDF · 11 页' }, updated: { en: 'Oct 04, 2025', zh: '2025 年 10 月 4 日' } },
  { name: { en: 'Brand audit memo', zh: '品牌审计备忘录' }, kind: { en: 'PDF · 22 pages', zh: 'PDF · 22 页' }, updated: { en: 'Oct 30, 2025', zh: '2025 年 10 月 30 日' } },
  { name: { en: 'Concept routes — 3 routes', zh: '概念方向 — 3 条路线' }, kind: { en: '3 PDFs', zh: '3 个 PDF' }, updated: { en: 'Nov 14, 2025', zh: '2025 年 11 月 14 日' } },
  { name: { en: 'Brand strategy doc — final', zh: '品牌策略文档 — 最终' }, kind: { en: 'PDF · 24 pages', zh: 'PDF · 24 页' }, updated: { en: 'Dec 19, 2025', zh: '2025 年 12 月 19 日' } },
  { name: { en: 'Brand Guidelines v1.0', zh: 'Brand Guidelines v1.0' }, kind: { en: 'PDF · 38 pages · ACTION', zh: 'PDF · 38 页 · 待处理' }, updated: { en: 'Apr 16, 2026', zh: '2026 年 4 月 16 日' }, action: true },
  { name: { en: 'Production schedule v2', zh: '制作排期 v2' }, kind: { en: 'PDF · 6 pages', zh: 'PDF · 6 页' }, updated: { en: 'Mar 28, 2026', zh: '2026 年 3 月 28 日' } },
  { name: { en: 'Color-proof memo (round 2)', zh: '色稿备忘录（第二轮）' }, kind: { en: 'PDF · 6 pages', zh: 'PDF · 6 页' }, updated: { en: 'Apr 11, 2026', zh: '2026 年 4 月 11 日' } },
  { name: { en: 'IP assignment & trademark search', zh: 'IP 转让与商标检索' }, kind: { en: 'PDF · 18 pages', zh: 'PDF · 18 页' }, updated: { en: 'Apr 14, 2026', zh: '2026 年 4 月 14 日' } },
  { name: { en: 'NY ABC label review confirmation', zh: 'NY 酒管局标签审阅确认' }, kind: { en: 'PDF · 4 pages', zh: 'PDF · 4 页' }, updated: { en: 'Apr 03, 2026', zh: '2026 年 4 月 3 日' } },
]

interface BrandCard { label: TL; value: TL; sub: TL }
const BRAND_CARDS: BrandCard[] = [
  { label: { en: 'Audience', zh: '受众' }, value: { en: 'Dinner-party hosts · mid-30s · NYC + Hudson Valley', zh: '晚宴主理人 · 35 岁上下 · 纽约 + 哈德逊河谷' }, sub: { en: 'Already buys indie wine; not a hard-seltzer drinker.', zh: '已经在购买独立葡萄酒；不是硬苏打消费者。' } },
  { label: { en: 'Voice', zh: '语调' }, value: { en: 'Warm, specific, lightly literary — never wink-and-nudge', zh: '温暖、具体、略带文学感 —— 不耍机灵' }, sub: { en: 'A friend who reads. Not a marketer who sells.', zh: '像一位读书的朋友，不是推销的市场经理。' } },
  { label: { en: 'Visual system', zh: '视觉系统' }, value: { en: 'Tide green · Brick · Cream · Off-black', zh: 'Tide 绿 · 砖红 · 奶油 · 近黑' }, sub: { en: 'Display serif + house grotesk. Warm-flash photography only.', zh: 'Display serif + house grotesk。仅采用暖闪摄影。' } },
  { label: { en: 'Sound', zh: '声音' }, value: { en: 'Standup bass + brushed snare · no synths', zh: '低音提琴 + 刷扫小军鼓 · 无合成器' }, sub: { en: 'Hero film score commissioned from a Brooklyn jazz duo.', zh: '主片配乐委托给一组布鲁克林爵士二人组。' } },
  { label: { en: 'Photography', zh: '摄影' }, value: { en: 'Hands-in-frame · dinner table · golden-hour kitchens', zh: '手部入画 · 餐桌 · 黄金时刻的厨房' }, sub: { en: 'No model glamour shots. No isolated product on white.', zh: '不拍模特摆拍。不拍纯白底产品图。' } },
  { label: { en: 'Reactive strategy', zh: '反应式策略' }, value: { en: 'One day a week, by Reese herself, at trade pub level only', zh: '每周一天 · 由 Reese 亲自处理 · 仅至行业刊物层级' }, sub: { en: 'No meme-replies, no brand-hijinks. Quiet wins.', zh: '不做表情包式回复、不做品牌乱入式互动。靠安静取胜。' } },
]

interface BrandStat { big: TL; small: TL }
const BRAND_STATS: BrandStat[] = [
  { big: { en: '3 SKUs', zh: '3 个 SKU' }, small: { en: 'Spritz · Tonic · Aperitif', zh: 'Spritz · Tonic · Aperitif' } },
  { big: { en: '14 wks', zh: '14 周' }, small: { en: 'Brief to first SKU on shelf', zh: '从立项到首批 SKU 上架' } },
  { big: { en: '4 / 5', zh: '4 / 5' }, small: { en: 'Revision rounds used', zh: '已用修改轮次' } },
  { big: { en: '24', zh: '24' }, small: { en: 'NYC indie grocers committed', zh: '已确认上架的纽约独立超市' } },
]

interface MessageRow { speaker: TL; time: TL; body: TL; me?: boolean }
const MESSAGES: MessageRow[] = [
  { speaker: { en: 'Reese', zh: 'Reese' }, time: { en: 'Apr 16 · 4:12 PM', zh: '4 月 16 日 · 16:12' },
    body: { en: 'Brand Guidelines v1.0 is live in your Documents tab. Read it this week and flag any line you don’t buy yet — no nit is too small. I’ll walk through it with both of you on the 10am Wed call.',
            zh: 'Brand Guidelines v1.0 已经在「文件」标签里了。这周读一读，任何一条暂时不认同的都告诉我——再小的细节都不算挑剔。我们周三早上 10 点的通话里会一起过一遍。' } },
  { speaker: { en: 'Camilla & Jonah', zh: 'Camilla 和 Jonah' }, time: { en: 'Apr 15 · 6:40 PM', zh: '4 月 15 日 · 18:40' }, me: true,
    body: { en: 'Wet proof on Tonic SKU came back greener than the deck. Should we be worried?',
            zh: 'Tonic SKU 的湿样回来比方案里偏绿。我们要担心吗？' } },
  { speaker: { en: 'Reese', zh: 'Reese' }, time: { en: 'Apr 15 · 7:02 PM', zh: '4 月 15 日 · 19:02' },
    body: { en: 'Caught at proof — exactly what wet proofs are for. We bumped Pantone 5605 a half-step toward yellow at the printer. Round-2 wet proof passes Wednesday morning; you’ll see the shift in person.',
            zh: '湿样就是干这个用的——已经发现了。我们让印厂把 Pantone 5605 往黄色方向微调了半个梯度。第二轮湿样周三上午到，你们当面就能看到色差消失。' } },
  { speaker: { en: 'Camilla & Jonah', zh: 'Camilla 和 Jonah' }, time: { en: 'Apr 14 · 8:15 AM', zh: '4 月 14 日 · 08:15' }, me: true,
    body: { en: 'Quick one — Jonah wants to know if NY ABC flagged anything on the Aperitif back panel.',
            zh: '一个快问 —— Jonah 想知道 NY 酒管局对 Aperitif 后侧文案有没有标注问题。' } },
  { speaker: { en: 'Reese', zh: 'Reese' }, time: { en: 'Apr 14 · 8:41 AM', zh: '4 月 14 日 · 08:41' },
    body: { en: 'Good catch. Their note flagged the warning block needs an extra 0.5pt of leading. Not a defect, but a free fix on the next plate. Including it in the production memo.',
            zh: '好眼力。他们标注的是警示语块需要再加 0.5pt 的行距。不算缺陷，但是下一版印版顺手就能改的。我把它写进了生产备忘。' } },
  { speaker: { en: 'Reese', zh: 'Reese' }, time: { en: 'Apr 09 · 5:55 PM', zh: '4 月 9 日 · 17:55' },
    body: { en: 'Color-proof memo (round 2) is in. Two notes worth talking about — Pantone 5605 lift and Tonic-can leading. Proposed plate language going over tonight.',
            zh: '色稿备忘录（第二轮）出了。有两点值得聊一下——Pantone 5605 微调与 Tonic 罐体的字距。今晚把建议的印版改动语言发过来。' } },
]

const NEXT_THREE: TL[] = [
  { en: 'Photo shoot · Brooklyn Navy Yard · Apr 26', zh: '摄影日 · 布鲁克林海军船坞 · 4 月 26 日' },
  { en: 'Final color session · Final Frame · Apr 29', zh: '主片最终调色 · Final Frame · 4 月 29 日' },
  { en: 'Master files & IP transfer · Apr 30', zh: '母文件 & IP 转让 · 4 月 30 日' },
]

export default function Dashboard({ member, tenant, onSignOut }: Props) {
  const [tab, setTab] = useState<TabId>('journey')
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  function toggleLang() {
    const next: Lang = lang === 'zh' ? 'en' : 'zh'
    setLangState(next)
    try { window.localStorage.setItem('agency-lang', next) } catch {}
    document.documentElement.lang = next
    document.documentElement.setAttribute('data-lang', next)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  return (
    <div className="pv-shell">
      <RunningPanel lang={lang} />
      <Header current={tab} onTabChange={setTab} member={member} tenant={tenant} onSignOut={onSignOut} lang={lang} onToggleLang={toggleLang} />
      <main className="pv-main">
        <div className="pv-tabpanel">
          {tab === 'journey' && <RunsheetView member={member} lang={lang} />}
          {tab === 'deliverables' && <WorkWallView lang={lang} />}
          {tab === 'brand' && <MarkView lang={lang} />}
          {tab === 'schedule' && <CalendarView lang={lang} />}
          {tab === 'billing' && <StatementView lang={lang} />}
          {tab === 'documents' && <FileRoomView lang={lang} />}
          {tab === 'messages' && <StudioLineView lang={lang} />}
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  )
}

/* ─────────────── WHAT'S RUNNING panel (signature) ─────────────── */
function RunningPanel({ lang }: { lang: Lang }) {
  return (
    <section className="pv-running" aria-label="Currently running">
      <div className="pv-running__inner">
        <div className="pv-running__main">
          <p className="pv-running__eyebrow">{t(lang, 'running.eyebrow')}</p>
          <h1 className="pv-running__title">{t(lang, 'running.current')}</h1>
          <p className="pv-running__deadline">{t(lang, 'running.deadline')}</p>
        </div>
        <div className="pv-running__next">
          <span className="pv-running__nextlabel">{t(lang, 'running.next')}</span>
          <ol className="pv-running__list">
            {NEXT_THREE.map((it, i) => (
              <li key={i}>
                <span className="pv-running__idx">{String(i + 1).padStart(2, '0')}</span>
                <span>{tl(lang, it)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="pv-running__marquee marquee marquee--blackout" aria-hidden="true">
        <div className="marquee__track">
          {NEXT_THREE.concat(NEXT_THREE).map((it, i) => (
            <span key={i} className={`marquee__item ${i % 2 === 0 ? 'marquee__item--accent' : ''}`}>{tl(lang, it)}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Header ─────────────── */
function Header({ current, onTabChange, member, onSignOut, lang, onToggleLang }: { current: TabId; onTabChange: (t: TabId) => void; member: PortalMember; tenant: PortalTenantIdentity | null; onSignOut: () => void; lang: Lang; onToggleLang: () => void }) {
  const firstName = (member.name || 'You').split(/\s+/)[0] || 'You'
  return (
    <header className="pv-header">
      <div className="pv-header__top">
        <a className="pv-brand" href="/">
          <span className="pv-brand__mark">A&amp;I</span>
          <span className="pv-brand__text">
            <strong>Aperture &amp; Ink</strong>
            <span className="pv-brand__kicker">{lang === 'zh' ? '布鲁克林独立创意工作室 · EIN #88-3014502' : 'Independent Creative Agency · EIN #88-3014502'}</span>
          </span>
        </a>
        <div className="pv-header__right">
          <span className="pv-demo-pill" title={lang === 'zh' ? '公开演示 — 不需要登录。' : 'This is a public demo — no login required.'}>{t(lang, 'demo.pill')}</span>
          <button type="button" className="pv-lang-btn" onClick={onToggleLang} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <a className="pv-contact" href="tel:+17185550142" aria-label="Call the studio">
            <span>{t(lang, 'call')}</span>
          </a>
          <button type="button" className="pv-back" onClick={onSignOut}>
            {firstName} · {t(lang, 'back.site')}
          </button>
        </div>
      </div>
      <nav className="pv-tabs" aria-label="Portal sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`pv-tab ${current === tab.id ? 'pv-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{t(lang, tab.i18nKey)}</span>
            {tab.badge && <span className="pv-tab__badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>
    </header>
  )
}

const TABS: { id: TabId; i18nKey: TKey; badge?: number }[] = [
  { id: 'journey', i18nKey: 'tab.journey' },
  { id: 'deliverables', i18nKey: 'tab.deliverables' },
  { id: 'brand', i18nKey: 'tab.brand' },
  { id: 'schedule', i18nKey: 'tab.schedule', badge: 1 },
  { id: 'billing', i18nKey: 'tab.billing' },
  { id: 'documents', i18nKey: 'tab.documents', badge: 1 },
  { id: 'messages', i18nKey: 'tab.messages' },
]

/* ─────────────── RUNSHEET — hairline-ruled production schedule ─────────────── */
function RunsheetView({ member, lang }: { member: PortalMember; lang: Lang }) {
  const displayName = member.name || 'Tide & Tonic'
  const done = STAGES.filter(s => s.status === 'done').length
  const pct = Math.round(((done + 0.5) / STAGES.length) * 100)
  const nextTag = STAGES[done] ? tl(lang, STAGES[done].tag) : ''

  function statusPill(status: Stage['status'], lang: Lang) {
    if (status === 'done') return <span className="pv-pill pv-pill--done">{t(lang, 'journey.done')}</span>
    if (status === 'active') return <span className="pv-pill pv-pill--current">{t(lang, 'journey.current')}</span>
    return <span className="pv-pill pv-pill--upcoming">{t(lang, 'journey.upcoming')}</span>
  }

  return (
    <div className="pv-runsheet">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'journey.eyebrow')}</p>
        <h2>{displayName}{t(lang, 'journey.title.suffix')}</h2>
        <p className="pv-lede">{t(lang, 'journey.subtitle')}</p>
        <p className="pv-runsheet__progress">
          <span>{pct}{t(lang, 'journey.complete')}</span>
          <span> · {done} {t(lang, 'journey.of')} {STAGES.length} {t(lang, 'journey.stages.done')} {nextTag}</span>
        </p>
      </header>

      <ol className="pv-runsheet__list">
        {STAGES.map(stage => (
          <li key={stage.id} className={`pv-runrow pv-runrow--${stage.status}`}>
            <span className="pv-runrow__idx">{String(stage.idx).padStart(2, '0')}</span>
            <div className="pv-runrow__body">
              <span className="pv-runrow__tag">{tl(lang, stage.tag)}</span>
              <h3 className="pv-runrow__title">{tl(lang, stage.title)}</h3>
              {stage.summary && <p className="pv-runrow__summary">{tl(lang, stage.summary)}</p>}
              {stage.content.map((block, i) => <ContentBlock key={i} block={block} lang={lang} />)}
            </div>
            <div className="pv-runrow__meta">
              {statusPill(stage.status, lang)}
              <span className="pv-runrow__date">{tl(lang, stage.dateLabel)}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ContentBlock({ block, lang }: { block: StageContent; lang: Lang }) {
  switch (block.kind) {
    case 'info-grid': return (
      <dl className="pv-infogrid">
        {block.rows.map((r, i) => (
          <div key={i} className="pv-infogrid__row">
            <dt>{tl(lang, r.label)}</dt>
            <dd className={r.emphasis ? `pv-infogrid__value--${r.emphasis}` : ''} dangerouslySetInnerHTML={{ __html: tl(lang, r.value) }} />
          </div>
        ))}
      </dl>
    )
    case 'documents': return (
      <ul className="pv-docs">
        {block.items.map((d, i) => (
          <li key={i} className={`pv-docs__row ${d.action ? 'pv-docs__row--action' : ''}`}>
            <span className="pv-docs__icon" aria-hidden>—</span>
            <div className="pv-docs__body">
              <strong>{tl(lang, d.name)}</strong>
              <span>{tl(lang, d.size)}</span>
            </div>
            <a className="pv-docs__action" href="#">{d.action ? t(lang, 'review') : t(lang, 'open')}</a>
          </li>
        ))}
      </ul>
    )
    case 'checklist': return (
      <ul className="pv-check">
        {block.items.map((it, i) => (
          <li key={i} className={`pv-check__row ${it.done ? 'pv-check__row--done' : ''}`}>
            <span className="pv-check__mark" aria-hidden>{it.done ? '✓' : '·'}</span>
            <div className="pv-check__body">
              <span>{tl(lang, it.label)}</span>
              {it.sub && <span className="pv-check__sub">{tl(lang, it.sub)}</span>}
            </div>
          </li>
        ))}
      </ul>
    )
    case 'actions': return (
      <div className="pv-actions">
        {block.buttons.map((b, i) => (
          <a key={i} className={`button ${b.primary ? 'button--lime' : ''}`} href={b.href || '#'}>{t(lang, b.labelKey)}</a>
        ))}
      </div>
    )
    case 'note': return (
      <div className="pv-note">
        <strong>{t(lang, block.titleKey)}</strong>
        <p>{tl(lang, block.body)}</p>
      </div>
    )
  }
}

/* ─────────────── WORK WALL — riso swatch tiles ─────────────── */
function WorkWallView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'deliverables.title')}</p>
        <h2>{t(lang, 'deliverables.title')}</h2>
        <p className="pv-lede">{t(lang, 'deliverables.subtitle')}</p>
      </header>
      <div className="pv-wall">
        {DELIVERABLES.map((p, i) => (
          <article key={i} className={`pv-wall__tile pv-wall__tile--${p.tone}`}>
            <div className="pv-wall__corner">
              <span>WORK NO. {String(i + 1).padStart(2, '0')}</span>
              <span>{p.price}</span>
            </div>
            <h3 className="pv-wall__title">{p.title}</h3>
            <p className="pv-wall__sub">{tl(lang, p.subtitle)}</p>
            <div className="pv-wall__specs">
              <span>{p.rounds} {lang === 'zh' ? '轮' : 'round'}</span>
              <span>·</span>
              <span>{p.revs} {lang === 'zh' ? '次修改' : 'revs'}</span>
              <span>·</span>
              <span>{p.sku} {lang === 'zh' ? '个' : 'SKU'}</span>
            </div>
            <span className={`pv-pill ${p.accent ? 'pv-pill--current' : 'pv-pill--upcoming'}`}>{tl(lang, p.status)}</span>
            {p.notes && <p className="pv-wall__notes">{tl(lang, p.notes)}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── MARK — wordmark book spread ─────────────── */
function MarkView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'brand.hero.caption')}</p>
        <h2>{t(lang, 'brand.title')}</h2>
        <p className="pv-lede" dangerouslySetInnerHTML={{ __html: t(lang, 'brand.subtitle') }} />
      </header>
      <section className="pv-mark-states" aria-label="Wordmark states">
        <div className="pv-mark pv-mark--paper">Tide &amp; Tonic</div>
        <div className="pv-mark pv-mark--lime">Tide &amp; Tonic</div>
        <div className="pv-mark pv-mark--magenta">Tide &amp; Tonic</div>
        <div className="pv-mark pv-mark--blackout">Tide &amp; Tonic</div>
        <div className="pv-mark pv-mark--paper-deep">Tide &amp; Tonic</div>
        <div className="pv-mark pv-mark--inverse">T&amp;T</div>
      </section>
      <section className="pv-mark-stats">
        {BRAND_STATS.map((s, i) => (
          <div key={i} className="pv-mark-stat">
            <strong>{tl(lang, s.big)}</strong>
            <span>{tl(lang, s.small)}</span>
          </div>
        ))}
      </section>
      <section className="pv-mark-grid">
        {BRAND_CARDS.map((c, i) => (
          <article key={i} className="pv-mark-card">
            <span className="pv-mark-card__label">{tl(lang, c.label)}</span>
            <strong dangerouslySetInnerHTML={{ __html: tl(lang, c.value) }} />
            <p>{tl(lang, c.sub)}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

/* ─────────────── CALENDAR — hairline-grid schedule ─────────────── */
function CalendarView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'schedule.title')}</p>
        <h2>{t(lang, 'schedule.title')}</h2>
        <p className="pv-lede">{t(lang, 'schedule.subtitle')}</p>
      </header>
      <ul className="pv-cal">
        {APPOINTMENTS.map((a, i) => {
          const isAction = a.status.en === 'Action needed'
          return (
            <li key={i} className={`pv-cal__row ${isAction ? 'pv-cal__row--action' : ''}`}>
              <span className="pv-cal__when">{tl(lang, a.when)}</span>
              <div className="pv-cal__body">
                <strong>{tl(lang, a.title)}</strong>
                <span>{tl(lang, a.where)}</span>
              </div>
              <div className="pv-cal__right">
                <span className={`pv-pill ${isAction ? 'pv-pill--current' : 'pv-pill--upcoming'}`}>{tl(lang, a.status)}</span>
                <a className="button button--sm" href="#">{t(lang, 'addcal')}</a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─────────────── STATEMENT — mono ledger ─────────────── */
function StatementView({ lang }: { lang: Lang }) {
  const paid = BILLING.filter(p => p.status.en === 'Paid').length
  const total = BILLING.reduce((sum, b) => sum + Number(b.amount.replace(/[$,]/g, '')), 0)
  const pendingTotal = BILLING.filter(b => b.status.en !== 'Paid').reduce((sum, b) => sum + Number(b.amount.replace(/[$,]/g, '')), 0)
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'billing.title')}</p>
        <h2>{t(lang, 'billing.title')}</h2>
        <p className="pv-lede">{paid} {t(lang, 'billing.paid')} · {BILLING.length - paid} {t(lang, 'billing.pending')}</p>
      </header>
      <table className="pv-ledger">
        <thead>
          <tr>
            <th>{lang === 'zh' ? '日期' : 'Date'}</th>
            <th>{lang === 'zh' ? '描述' : 'Description'}</th>
            <th>{lang === 'zh' ? '状态' : 'Status'}</th>
            <th className="pv-ledger__num">{lang === 'zh' ? '金额' : 'Amount'}</th>
          </tr>
        </thead>
        <tbody>
          {BILLING.map((p, i) => {
            const isPaid = p.status.en === 'Paid'
            const noteStr = p.note ? tl(lang, p.note) : null
            return (
              <tr key={i}>
                <td>{tl(lang, p.date)}</td>
                <td>
                  <strong>{tl(lang, p.label)}</strong>
                  {noteStr && <span className="pv-ledger__note">{noteStr}</span>}
                </td>
                <td><span className={`pv-pill ${isPaid ? 'pv-pill--done' : 'pv-pill--current'}`}>{tl(lang, p.status)}</span></td>
                <td className="pv-ledger__num">{p.amount}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="pv-ledger__total">
            <td colSpan={3}>{lang === 'zh' ? '合计 · 待付' : 'Outstanding balance'}</td>
            <td className="pv-ledger__num">${pendingTotal.toLocaleString('en-US')}</td>
          </tr>
          <tr>
            <td colSpan={3}>{lang === 'zh' ? '合同总额' : 'Total engagement'}</td>
            <td className="pv-ledger__num">${total.toLocaleString('en-US')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ─────────────── FILE ROOM — mono filename + status pill ─────────────── */
function FileRoomView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'documents.title')}</p>
        <h2>{t(lang, 'documents.title')}</h2>
        <p className="pv-lede" dangerouslySetInnerHTML={{ __html: t(lang, 'documents.subtitle') }} />
      </header>
      <ul className="pv-files">
        {DOCUMENTS.map((d, i) => {
          const updatedLabel = lang === 'zh' ? '更新于' : 'updated'
          return (
            <li key={i} className={`pv-files__row ${d.action ? 'pv-files__row--action' : ''}`}>
              <span className="pv-files__hash">FILE {String(i + 1).padStart(3, '0')}</span>
              <div className="pv-files__body">
                <strong>{tl(lang, d.name)}</strong>
                <span>{tl(lang, d.kind)} · {updatedLabel} {tl(lang, d.updated)}</span>
              </div>
              <span className={`pv-pill ${d.action ? 'pv-pill--current' : 'pv-pill--done'}`}>
                {d.action ? (lang === 'zh' ? '待签' : 'PENDING') : (lang === 'zh' ? '已签' : 'SIGNED')}
              </span>
              <div className="pv-files__actions">
                <a className="button button--sm" href="#">{t(lang, 'download')}</a>
                {d.action && <a className="button button--sm button--lime" href="#">{t(lang, 'reviewsign')}</a>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─────────────── STUDIO LINE — slack-style monospaced thread ─────────────── */
function StudioLineView({ lang }: { lang: Lang }) {
  return (
    <div className="pv-stack">
      <header className="pv-section-head">
        <p className="pv-eyebrow">{t(lang, 'messages.title')}</p>
        <h2>{t(lang, 'messages.title')}</h2>
        <p className="pv-lede">{t(lang, 'messages.subtitle')}</p>
      </header>
      <div className="pv-thread">
        {MESSAGES.map((m, i) => (
          <div key={i} className={`pv-line ${m.me ? 'pv-line--you' : ''}`}>
            <div className="pv-line__head">
              <strong>{tl(lang, m.speaker)}</strong>
              <span>{tl(lang, m.time)}</span>
            </div>
            <p>{tl(lang, m.body)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="pv-footer">
      <div className="pv-footer__inner">
        <span>{lang === 'zh' ? 'Aperture & Ink LLC · 布鲁克林' : 'Aperture & Ink LLC · Brooklyn'}</span>
        <span>EIN #88-3014502</span>
        <span>&copy; 2026</span>
      </div>
    </footer>
  )
}
