'use strict';

/* =========================
   STATE AND UTILITIES
   ========================= */

const rawTheme = new URLSearchParams(window.location.search).get('theme');
const requestedTheme = rawTheme === 'portal' ? 'studio' : rawTheme;
const availableThemes = ['corporate', 'minimal', 'studio'];
let theme = availableThemes.includes(requestedTheme)
    ? requestedTheme
    : rawTheme !== null
    ? 'corporate'
    : availableThemes.includes(document.body.dataset.theme)
    ? document.body.dataset.theme
    : 'corporate';
if (rawTheme !== null && !availableThemes.includes(requestedTheme)) {
    const url = new URL(location.href);
    url.searchParams.set('theme', theme);
    history.replaceState(null, '', url);
}
document.body.dataset.theme = theme;
const themeNames = {
    corporate: 'Corporate',
    minimal: 'Executive Minimal',
    studio: 'Studio',
};

const notes = {
    corporate:
        'Side navigation and a spacious dashboard with the profile above the main content.',
    minimal:
        'Horizontal navigation, generous spacing, and understated component shapes.',
    studio: 'Bottom navigation dock and a bento dashboard with profile, certificates, and updates.',
};

const params = new URLSearchParams(window.location.search);
const pageNames = {
    login: 'Sign In',
    dashboard: 'Dashboard',
    account: 'Account',
    distributives: 'Distributives',
    partnership: 'Partnership',
    notifications: 'Notifications',
    'ui-kit': 'UI Kit',
    support: 'Support',
};
let page = Object.hasOwn(pageNames, params.get('page'))
    ? params.get('page')
    : document.body.dataset.referencePage || 'login';

let loginLayout = ['split', 'centered', 'clean', 'compact'].includes(
    params.get('layout'),
)
    ? params.get('layout')
    : 'centered';

const embedded = params.get('embedded') === '1';
const paletteNames = {
    corporate: 'Navy & Yellow',
    minimal: 'Sage & Ink',
    portal: 'Teal & Cloud',
};
let palette = Object.hasOwn(paletteNames, params.get('palette'))
    ? params.get('palette')
    : 'corporate';
const pageSettingDefinitions = {
    support: [
        {
            key: 'supportSection',
            label: 'Sections',
            choices: [
                ['all', 'All sections'],
                ['services', 'Services'],
                ['levels', 'Support levels'],
                ['contacts', 'Contacts'],
            ],
        },
    ],
    dashboard: [
        {
            key: 'dashboardWidgets',
            label: 'Widgets',
            choices: [
                ['all', 'All widgets'],
                ['certificates', 'Certificates'],
                ['updates', 'Updates'],
            ],
        },
    ],
    account: [
        {
            key: 'accountSections',
            label: 'Sections',
            choices: [
                ['all', 'All sections'],
                ['profile', 'Profile'],
                ['settings', 'Settings'],
            ],
        },
    ],
    distributives: [
        {
            key: 'downloadFamily',
            label: 'Products',
            choices: [
                ['drive', '1C:Drive'],
                ['enterprise', '1C:Enterprise'],
                ['all', 'All products'],
            ],
        },
        {
            key: 'downloadLayout',
            label: 'View',
            choices: [
                ['grid', 'Cards'],
                ['list', 'List'],
            ],
        },
    ],
    partnership: [
        {
            key: 'partnerState',
            label: 'Connection',
            choices: [
                ['linked', 'Linked'],
                ['unlinked', 'Unlinked'],
            ],
        },
    ],
    notifications: [
        {
            key: 'notificationFilter',
            label: 'Show',
            choices: [
                ['all', 'All notifications'],
                ['unread', 'Unread'],
                ['read', 'Read'],
            ],
        },
    ],
    'ui-kit': [
        {
            key: 'kitSection',
            label: 'Components',
            choices: [
                ['all', 'All components'],
                ['buttons', 'Buttons'],
                ['forms', 'Forms'],
            ],
        },
    ],
};
const inputOutlineDefinitions = Object.fromEntries(
    Object.keys(pageNames).map((pageId) => [
        pageId,
        {
            key: `${pageId.replace(/-([a-z])/g, (_, letter) =>
                letter.toUpperCase(),
            )}InputOutline`,
            label: 'Input outline',
            choices: [
                ['highlighted', 'Blue + shadow'],
                ['current', 'Current'],
            ],
        },
    ]),
);
const inputOutlineKeys = Object.values(inputOutlineDefinitions).map(
    (definition) => definition.key,
);
const pageOptionDefaults = Object.fromEntries(
    inputOutlineKeys.map((key) => [key, 'current']),
);
const layoutSettingDefinitions = {
    corporateSidebar: {
        key: 'corporateSidebar',
        label: 'Sidebar',
        choices: [
            ['classic', 'Classic'],
            ['rail', 'Icon rail'],
            ['light', 'Light panel'],
        ],
    },
    drawerStyle: {
        key: 'drawerStyle',
        label: 'Drawer',
        choices: [
            ['attached', 'Behind navigation'],
            ['overlay', 'Overlay'],
            ['floating', 'Floating'],
        ],
    },
};
const pageSettingChoices = Object.fromEntries(
    [
        ...Object.values(pageSettingDefinitions),
        Object.values(layoutSettingDefinitions),
        Object.values(inputOutlineDefinitions),
    ]
        .flat()
        .map(({ key, choices }) => [key, choices.map(([value]) => value)]),
);
const pageOptions = Object.fromEntries(
    Object.entries(pageSettingChoices)
        .filter(([key]) => key !== 'partnerState')
        .map(([key, choices]) => [
            key,
            choices.includes(params.get(key))
                ? params.get(key)
                : pageOptionDefaults[key] || choices[0],
        ]),
);

function isIsoDate(value) {
    if (value === '') return true;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    const date = new Date(`${value}T12:00:00Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}
let notificationFrom = isIsoDate(params.get('notificationFrom'))
    ? params.get('notificationFrom')
    : '';
let notificationTo = isIsoDate(params.get('notificationTo'))
    ? params.get('notificationTo')
    : '';

let releaseFrom = isIsoDate(params.get('releaseFrom'))
    ? params.get('releaseFrom')
    : '';
let releaseTo = isIsoDate(params.get('releaseTo'))
    ? params.get('releaseTo')
    : '';

let device = ['mobile', 'tablet', 'desktop'].includes(params.get('device'))
    ? params.get('device')
    : 'desktop';
let loginPosition = ['top', 'center', 'between'].includes(
    params.get('position'),
)
    ? params.get('position')
    : 'center';
const accessibilityStorageKey = '1ci-reference-accessibility';
function savedAccessibility(name, parameter) {
    if (params.has(parameter)) return params.get(parameter) === '1';
    try {
        return (
            JSON.parse(localStorage.getItem(accessibilityStorageKey) || '{}')[
                name
            ] === true
        );
    } catch {
        return false;
    }
}
let assistiveMode = embedded && params.get('inputMode') === 'keyboard';
let visionMode = savedAccessibility('vision', 'vision');
function setInputMode(keyboard, { broadcast = true } = {}) {
    if (assistiveMode === keyboard) return;
    assistiveMode = keyboard;
    applyAccessibility();
    if (keyboard) viewerAnimation?.finish();
    if (viewerRenderedState)
        viewerRenderedState.inputMode = keyboard ? 'keyboard' : 'pointer';
    if (broadcast) {
        const message = {
            type: 'reference-input-mode',
            mode: keyboard ? 'keyboard' : 'pointer',
        };
        if (embedded) window.parent.postMessage(message, '*');
        else
            document
                .getElementById('reference-frame')
                ?.contentWindow.postMessage(message, '*');
        if (keyboard) announceAccessibility('Keyboard navigation enabled.');
    }
}
// Detect actual input without rebuilding controls or moving the current focus.
document.addEventListener(
    'keydown',
    (event) => {
        if (
            ![
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'CapsLock',
                'NumLock',
                'ScrollLock',
            ].includes(event.key)
        )
            setInputMode(true);
    },
    true,
);
document.addEventListener('pointerdown', () => setInputMode(false), true);
document.addEventListener('wheel', () => setInputMode(false), {
    capture: true,
    passive: true,
});

function announceAccessibility(message) {
    if (!assistiveMode) return;
    const region = document.getElementById('reference-announcement');
    if (region) region.textContent = message;
}
function resetPageScroll() {
    const scroller = document.querySelector('.page-scroll');
    if (scroller) scroller.scrollTop = 0;
    else window.scrollTo(0, 0);
}
function focusPageContent() {
    const main = document.getElementById('main-content');
    const target =
        main?.querySelector('.login-wrap h1') ||
        main?.querySelector('h1') ||
        main;
    if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        resetPageScroll();
    }
}
function applyAccessibility() {
    document.body.dataset.assistive = String(assistiveMode);
    document.body.dataset.vision = String(visionMode);
    let skip = document.getElementById('reference-skip-link');
    if (!skip) {
        skip = document.createElement('a');
        skip.id = 'reference-skip-link';
        skip.className = 'skip-link';
        skip.href = embedded ? '#main-content' : '#reference-frame';
        skip.dataset.skipContent = '';
        skip.textContent = embedded
            ? 'Skip to main content'
            : 'Skip to reference content';
        document.body.prepend(skip);
    }
    skip.hidden = !assistiveMode;
    let region = document.getElementById('reference-announcement');
    if (!region) {
        region = document.createElement('div');
        region.id = 'reference-announcement';
        region.className = 'sr-only';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        document.body.append(region);
    }
    region.hidden = !assistiveMode;
    finishSurfacesWithoutMotion();
}
function saveAccessibility() {
    try {
        localStorage.setItem(
            accessibilityStorageKey,
            JSON.stringify({ vision: visionMode }),
        );
    } catch {}
}

let previewHeightObserver;
let viewerCollapsed = false;
let viewerAnimation;
let viewerControlsAnimation;
let viewerRenderedState;

function viewState() {
    return {
        theme,
        palette,
        page,
        layout: loginLayout,
        device,
        position: loginPosition,
        inputMode: assistiveMode ? 'keyboard' : 'pointer',
        vision: visionMode ? '1' : '0',
        ...pageOptions,
        notificationFrom,
        notificationTo,
        releaseFrom,
        releaseTo,
        partnerState: partnerLinked ? 'linked' : 'unlinked',
    };
}
function saveViewState() {
    const url = new URL(window.location.href);
    url.searchParams.delete('assistive');
    url.searchParams.delete('inputMode');
    Object.entries(viewState()).forEach(([key, value]) => {
        if (key !== 'inputMode') url.searchParams.set(key, value);
    });
    history.replaceState(null, '', url);
    if (window.parent !== window)
        window.parent.postMessage({ type: 'reference-settings' }, '*');
}
function updatePreviewHeight() {
    const frame = document.getElementById('reference-frame');
    if (!frame) return;
    const stageStyle = getComputedStyle(frame.parentElement);
    const stagePadding =
        parseFloat(stageStyle.paddingTop) +
        parseFloat(stageStyle.paddingBottom);
    frame.style.height = `${Math.max(
        320,
        window.innerHeight -
            document.getElementById('viewer').offsetHeight -
            stagePadding -
            2,
    )}px`;
}
function renderPreview() {
    document.body.dataset.device = device;
    let frame = document.getElementById('reference-frame');
    if (!frame) {
        const url = new URL(window.location.href);
        Object.entries(viewState()).forEach(([key, value]) =>
            url.searchParams.set(key, value),
        );
        url.searchParams.set('embedded', '1');
        document.getElementById(
            'app',
        ).innerHTML = `<div class="device-stage"><iframe id="reference-frame" title="${
            themeNames[theme]
        } ${pageNames[page]} reference" src="${esc(url.href)}"></iframe></div>`;
        frame = document.getElementById('reference-frame');
        frame.addEventListener('load', () =>
            frame.contentWindow.postMessage(
                { type: 'reference-view', state: viewState() },
                '*',
            ),
        );
        previewHeightObserver = new ResizeObserver(updatePreviewHeight);
        previewHeightObserver.observe(document.getElementById('viewer'));
    } else {
        frame.title = `${themeNames[theme]} ${pageNames[page]} reference`;
        frame.contentWindow.postMessage(
            { type: 'reference-view', state: viewState() },
            '*',
        );
    }
    updatePreviewHeight();
}
window.addEventListener('resize', updatePreviewHeight);
window.addEventListener('message', (event) => {
    const validOrigin =
        event.origin === window.location.origin ||
        (window.location.protocol === 'file:' && event.origin === 'null');
    if (!validOrigin) return;
    if (
        event.data?.type === 'reference-input-mode' &&
        ['keyboard', 'pointer'].includes(event.data.mode)
    ) {
        const sourceIsPreview =
            !embedded &&
            event.source ===
                document.getElementById('reference-frame')?.contentWindow;
        if ((embedded && event.source === window.parent) || sourceIsPreview)
            setInputMode(event.data.mode === 'keyboard', { broadcast: false });
        return;
    }
    if (
        embedded &&
        event.source === window.parent &&
        event.data?.type === 'reference-focus'
    ) {
        focusPageContent();
        return;
    }
    if (
        embedded &&
        event.source === window.parent &&
        event.data?.type === 'reference-view'
    ) {
        const previous = viewState();
        const state = event.data.state || {};
        if (Object.hasOwn(themeNames, state.theme)) theme = state.theme;
        if (Object.hasOwn(paletteNames, state.palette)) palette = state.palette;
        if (Object.hasOwn(pageNames, state.page)) page = state.page;
        if (['split', 'centered', 'clean', 'compact'].includes(state.layout))
            loginLayout = state.layout;
        if (['top', 'center', 'between'].includes(state.position))
            loginPosition = state.position;
        if (['keyboard', 'pointer'].includes(state.inputMode))
            setInputMode(state.inputMode === 'keyboard', { broadcast: false });
        for (const [key, choices] of Object.entries(pageSettingChoices)) {
            if (!choices.includes(state[key])) continue;
            if (key === 'partnerState') partnerLinked = state[key] === 'linked';
            else pageOptions[key] = state[key];
        }
        if (isIsoDate(state.notificationFrom))
            notificationFrom = state.notificationFrom;
        if (isIsoDate(state.notificationTo))
            notificationTo = state.notificationTo;
        if (isIsoDate(state.releaseFrom)) releaseFrom = state.releaseFrom;
        if (isIsoDate(state.releaseTo)) releaseTo = state.releaseTo;
        if (['0', '1'].includes(state.vision))
            visionMode = state.vision === '1';
        applyAccessibility();
        const layoutChanged =
            previous.theme !== theme ||
            previous.page !== page ||
            previous.layout !== loginLayout ||
            Object.keys(pageSettingChoices).some(
                (key) =>
                    previous[key] !== viewState()[key] &&
                    !(key === 'downloadLayout' && page === 'distributives') &&
                    !(
                        key === 'notificationFilter' && page === 'notifications'
                    ) &&
                    !['corporateSidebar', 'drawerStyle'].includes(key) &&
                    !inputOutlineKeys.includes(key),
            );
        if (
            layoutChanged ||
            (page === 'ui-kit' && previous.palette !== palette)
        ) {
            render();
            if (previous.page !== page) {
                resetPageScroll();
                if (assistiveMode) focusPageContent();
                announceAccessibility(`${pageNames[page]} page opened.`);
            }
        } else {
            document.body.dataset.palette = palette;
            document.body.dataset.position = loginPosition;
            applyLayoutOptions();
            if (
                previous.drawerStyle !== pageOptions.drawerStyle &&
                corporateDrawer?.open &&
                drawerGroup
            )
                openCorporateDrawer('left', drawerOpener, drawerGroup, true);
            syncDownloadLayout();
            syncNotificationFilters();
            syncDistributiveDates();
        }
    } else if (
        !embedded &&
        event.source ===
            document.getElementById('reference-frame')?.contentWindow &&
        event.data?.type === 'reference-page'
    ) {
        if (Object.hasOwn(pageNames, event.data.page)) {
            page = event.data.page;
            for (const [key, choices] of Object.entries(pageSettingChoices)) {
                const value = event.data.state?.[key];
                if (!choices.includes(value)) continue;
                if (key === 'partnerState') partnerLinked = value === 'linked';
                else pageOptions[key] = value;
            }
            if (isIsoDate(event.data.state?.notificationFrom))
                notificationFrom = event.data.state.notificationFrom;
            if (isIsoDate(event.data.state?.notificationTo))
                notificationTo = event.data.state.notificationTo;
            if (isIsoDate(event.data.state?.releaseFrom))
                releaseFrom = event.data.state.releaseFrom;
            if (isIsoDate(event.data.state?.releaseTo))
                releaseTo = event.data.state.releaseTo;
            renderViewer();
            saveViewState();
        }
    }
});

let sidebarCollapsed = false;
let selectedLanguage = 'en';
let partnerLinked = params.get('partnerState') !== 'unlinked';
const languages = [
    [
        'en',
        'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20aria-hidden%3D%22true%22%20viewBox%3D%220%200%2021%2015%22%3E%3Crect%20width%3D%2221%22%20height%3D%2215%22%20fill%3D%22%2342526e%22%20rx%3D%222%22%2F%3E%3Cg%20stroke%3D%22%23fff%22%3E%3Ccircle%20cx%3D%2210.5%22%20cy%3D%227.5%22%20r%3D%225%22%2F%3E%3Cellipse%20cx%3D%2210.5%22%20cy%3D%227.5%22%20rx%3D%222%22%20ry%3D%225%22%2F%3E%3Cpath%20d%3D%22M5.5%207.5h10%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        'Global',
        'English',
    ],
    [
        'tr',
        'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20aria-hidden%3D%22true%22%20viewBox%3D%220%200%2021%2015%22%3E%3Crect%20width%3D%2221%22%20height%3D%2215%22%20fill%3D%22%23e92434%22%20rx%3D%222%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%227.5%22%20r%3D%224%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%227.5%22%20r%3D%223.2%22%20fill%3D%22%23e92434%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22m14.1%204.9.5%201.5h1.6l-1.3.9.5%201.5-1.3-.9-1.3.9.5-1.5-1.3-.9h1.6Z%22%2F%3E%3C%2Fsvg%3E',
        'Turkish',
        'Türkçe',
    ],
    [
        'es',
        'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20aria-hidden%3D%22true%22%20viewBox%3D%220%200%2021%2015%22%3E%3Crect%20width%3D%2221%22%20height%3D%2215%22%20fill%3D%22%23aa151b%22%20rx%3D%222%22%2F%3E%3Cpath%20fill%3D%22%23f1bf00%22%20d%3D%22M0%203.75h21v7.5H0z%22%2F%3E%3Cpath%20fill%3D%22%23aa151b%22%20d%3D%22m5.5%205%20.5-.5L7%205l1-.5.5.5v.5h-3Zm0%201h3v3a1.5%201.5%200%200%201-3%200Z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M6.25%206.75h1.5v1.5h-1.5z%22%2F%3E%3C%2Fsvg%3E',
        'Spanish',
        'Español',
    ],
    [
        'id',
        'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20aria-hidden%3D%22true%22%20viewBox%3D%220%200%2021%2015%22%3E%3Crect%20width%3D%2221%22%20height%3D%2215%22%20fill%3D%22%23fff%22%20rx%3D%222%22%2F%3E%3Cpath%20fill%3D%22%23e12237%22%20d%3D%22M2%200h17a2%202%200%200%201%202%202v5.5H0V2a2%202%200%200%201%202-2%22%2F%3E%3Cpath%20stroke%3D%22%23c1c7d0%22%20d%3D%22M.5%207.5V13A1.5%201.5%200%200%200%202%2014.5h17a1.5%201.5%200%200%200%201.5-1.5V7.5%22%2F%3E%3C%2Fsvg%3E',
        'Indonesian',
        'Bahasa Indonesia',
    ],
];
let toastTimer;

const profile = {
    first: 'Eugene',
    last: 'Egorov',
    country: 'Russian Federation',
    phone: '',
    skype: '',
    position: '',
};

const settings = { type: 'Developer', newsletter: true };
const addresses = { billing: null, delivery: null };

const esc = (value) =>
    String(value).replace(
        /[&<>"']/g,
        (char) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[char],
    );

const initials = () =>
    esc((profile.first.charAt(0) + profile.last.charAt(0)).toUpperCase());

const fullName = () => `${esc(profile.first)} ${esc(profile.last)}`;
const moscowDateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
function updateCurrentDate() {
    const today = moscowDateFormatter.format(new Date());
    document.querySelectorAll('[data-moscow-date]').forEach((element) => {
        element.textContent = today;
    });
}
if (embedded) setInterval(updateCurrentDate, 60_000);

const icons = {
    reload: '<path d="M20 7v5h-5"/><path d="M19.2 7.5A8 8 0 1 0 20 16"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    keyboard:
        '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1m3 0h1M7 16h10"/>',
    mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>',
    desktop:
        '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/>',
    home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    store: '<path d="M3 3h2l3 12h10l3-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
    bag: '<path d="M5 7h14l1 14H4Z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>',
    link: '<path d="m10 14 4-4"/><path d="M8 16l-2 2a4 4 0 0 1-6-6l5-5" transform="translate(3 0)"/><path d="m13 7 2-2a4 4 0 0 1 6 6l-4 4"/>',
    support:
        '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="11" width="4" height="7" rx="2"/><rect x="18" y="11" width="4" height="7" rx="2"/><path d="M20 18c0 3-4 3-7 3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    exit: '<path d="M10 4H4v16h6"/><path d="M9 12h12m-4-4 4 4-4 4"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    external: '<path d="M14 3h7v7m0-7L10 14"/><path d="M10 4H4v16h16v-6"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/><path d="m12 5 1 2 2 .3-1.5 1.5.3 2.2-1.8-1-1.8 1 .3-2.2L9 7.3l2-.3Z"/>',
    book: '<path d="M12 5C8 2 4 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-2-1-6-2-10 1v16"/>',
    shield: '<path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5Z"/><path d="m8 12 3 3 5-6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="m15 3 6 6-12 12H3v-6Z"/><path d="m12 6 6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    file: '<path d="M5 2h9l5 5v15H5Z"/><path d="M14 2v6h5M8 12h8M8 16h8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    pin: '<path d="M19 9c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/>',
};

const ico = (name) =>
    `<svg class="icon ${
        ['arrow', 'external'].includes(name) ? 'action-arrow' : ''
    }" viewBox="0 0 24 24" aria-hidden="true">${
        icons[name] || icons.file
    }</svg>`;

const logoAssets = {
    dark: 'data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2234%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20fill%3D%22%23FFDD2D%22%20fill-rule%3D%22nonzero%22%20x%3D%224%22%20y%3D%2229%22%20width%3D%2236%22%20height%3D%225%22%20rx%3D%222.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M36%200a3.5%203.5%200%20100%207%203.5%203.5%200%20000-7z%22%20fill%3D%22%23FFDD2D%22%20fill-rule%3D%22nonzero%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M36.017%209.002a3.422%203.422%200%2000-2.105.659%202.398%202.398%200%2000-.907%202.02v12.654c-.048.763.27%201.503.856%201.994.615.455%201.365.69%202.13.668a3.354%203.354%200%20002.148-.668%202.406%202.406%200%2000.856-1.994V11.68a2.423%202.423%200%2000-.856-2.003%203.35%203.35%200%2000-2.122-.676zM29.03%2020.398a2.624%202.624%200%2000-.8.133%204.73%204.73%200%2000-.799.406c-.66.413-1.356.76-2.08%201.036a5.418%205.418%200%2001-1.807.299c-3.303%200-4.91-2.056-4.91-6.3%200-2.123.415-3.723%201.247-4.76a4.367%204.367%200%20013.663-1.509%205.874%205.874%200%20011.896.299%209.148%209.148%200%20011.927%201.011c.245.184.514.33.8.431.279.094.57.139.864.133a1.755%201.755%200%20001.44-.746%202.6%202.6%200%2000.527-1.658%202.567%202.567%200%2000-.2-1.094%202.748%202.748%200%2000-.8-.888%2010.732%2010.732%200%2000-6.726-2.188%2010.7%2010.7%200%2000-5.422%201.343%209.068%209.068%200%2000-3.6%203.838%2012.815%2012.815%200%2000-1.247%205.804c-.04%202.01.387%204%201.248%205.803a9.061%209.061%200%20003.615%203.863%2010.7%2010.7%200%20005.422%201.343c2.412.043%204.77-.738%206.71-2.221a2.58%202.58%200%2000.728-.83c.175-.35.26-.741.248-1.135.018-.6-.17-1.187-.528-1.658a1.757%201.757%200%2000-1.415-.755z%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3D%22%23091E42%22%20fill-rule%3D%22nonzero%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M11%207.867c0-.956-.538-1.875-1.003-2.242-1.004-.79-2.659-.884-4.128%200L1.115%208.271A1.978%201.978%200%20000%2010.07c.001.572.184%201.158.611%201.551.713.66%201.749.9%202.641.42l1.815-.904-.002%2013.228c0%20.75.267%201.486.848%201.97.61.45%201.087.661%202.111.661.976.003%201.516-.202%202.128-.66.58-.485.848-1.21.848-1.971V7.867z%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3D%22%23091E42%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E',
    light: 'data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2234%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20fill%3D%22%23FFDD2D%22%20fill-rule%3D%22nonzero%22%20x%3D%224%22%20y%3D%2229%22%20width%3D%2236%22%20height%3D%225%22%20rx%3D%222.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M36%200a3.5%203.5%200%20100%207%203.5%203.5%200%20000-7z%22%20fill%3D%22%23FFDD2D%22%20fill-rule%3D%22nonzero%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M36.017%209.002a3.422%203.422%200%2000-2.105.659%202.398%202.398%200%2000-.907%202.02v12.654c-.048.763.27%201.503.856%201.994.615.455%201.365.69%202.13.668a3.354%203.354%200%20002.148-.668%202.406%202.406%200%2000.856-1.994V11.68a2.423%202.423%200%2000-.856-2.003%203.35%203.35%200%2000-2.122-.676zM29.03%2020.398a2.624%202.624%200%2000-.8.133%204.73%204.73%200%2000-.799.406c-.66.413-1.356.76-2.08%201.036a5.418%205.418%200%2001-1.807.299c-3.303%200-4.91-2.056-4.91-6.3%200-2.123.415-3.723%201.247-4.76a4.367%204.367%200%20013.663-1.509%205.874%205.874%200%20011.896.299%209.148%209.148%200%20011.927%201.011c.245.184.514.33.8.431.279.094.57.139.864.133a1.755%201.755%200%20001.44-.746%202.6%202.6%200%2000.527-1.658%202.567%202.567%200%2000-.2-1.094%202.748%202.748%200%2000-.8-.888%2010.732%2010.732%200%2000-6.726-2.188%2010.7%2010.7%200%2000-5.422%201.343%209.068%209.068%200%2000-3.6%203.838%2012.815%2012.815%200%2000-1.247%205.804c-.04%202.01.387%204%201.248%205.803a9.061%209.061%200%20003.615%203.863%2010.7%2010.7%200%20005.422%201.343c2.412.043%204.77-.738%206.71-2.221a2.58%202.58%200%2000.728-.83c.175-.35.26-.741.248-1.135.018-.6-.17-1.187-.528-1.658a1.757%201.757%200%2000-1.415-.755z%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3D%22%23FFFFFF%22%20fill-rule%3D%22nonzero%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M11%207.867c0-.956-.538-1.875-1.003-2.242-1.004-.79-2.659-.884-4.128%200L1.115%208.271A1.978%201.978%200%20000%2010.07c.001.572.184%201.158.611%201.551.713.66%201.749.9%202.641.42l1.815-.904-.002%2013.228c0%20.75.267%201.486.848%201.97.61.45%201.087.661%202.111.661.976.003%201.516-.202%202.128-.66.58-.485.848-1.21.848-1.971V7.867z%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E',
};

const brand = () => `
  <div class="brand">
    <span class="brand-mark"><img class="brand-logo-dark" src="${logoAssets.dark}" alt="1Ci" width="40" height="34"><img class="brand-logo-light" src="${logoAssets.light}" alt="1Ci" width="40" height="34"></span>
    <span class="brand-name">My Account</span>
  </div>`;

function footer() {
    return `
    <footer class="footer">
      <span>© 2026 1C International</span>
      <div class="footer-links">
        <a href="#" data-action="privacy">Privacy Policy</a>
        <a href="#" data-action="cookies">Cookie Policy</a>
        <a href="#" data-action="terms">Terms of Use</a>
      </div>
    </footer>`;
}

/* =========================
   VIEWER
   ========================= */

function toggleViewer() {
    const viewer = document.getElementById('viewer');
    const from = viewer.getBoundingClientRect().height;
    const oldMarkup = viewer.innerHTML;
    viewerAnimation?.cancel();
    viewerControlsAnimation?.cancel();
    viewerAnimation = null;
    viewerCollapsed = !viewerCollapsed;
    const closing = viewerCollapsed;
    renderViewer();
    const to = viewer.getBoundingClientRect().height;
    if (
        !assistiveMode &&
        !visionMode &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        if (closing) {
            viewer.innerHTML = oldMarkup;
            document.body.dataset.viewerCollapsed = 'false';
            viewerRenderedState = null;
            document.getElementById('viewer-controls').inert = true;
        }
        viewer.style.overflow = 'hidden';
        const animation = viewer.animate(
            [{ height: `${from}px` }, { height: `${to}px` }],
            { duration: 220, easing: 'ease-in-out' },
        );
        viewerAnimation = animation;
        const controls = document.getElementById('viewer-controls');
        viewerControlsAnimation = controls.animate(
            closing
                ? [{ opacity: 1 }, { opacity: 0 }]
                : [{ opacity: 0 }, { opacity: 1 }],
            { duration: 220, easing: 'ease-in-out', fill: 'forwards' },
        );
        animation.finished
            .then(() => {
                if (viewerAnimation !== animation) return;
                const restoreToggle =
                    document.activeElement?.hasAttribute('data-viewer-toggle');
                viewerAnimation = null;
                viewerControlsAnimation?.cancel();
                viewerControlsAnimation = null;
                if (closing && viewerCollapsed) renderViewer();
                viewer.style.overflow = '';
                updatePreviewHeight();
                if (restoreToggle)
                    document
                        .querySelector('[data-viewer-toggle]')
                        ?.focus({ preventScroll: true });
            })
            .catch(() => {});
    } else {
        viewer.style.overflow = '';
    }
    updatePreviewHeight();
    document
        .querySelector('[data-viewer-toggle]')
        ?.focus({ preventScroll: true });
}

function pageSettingControls() {
    const definitions =
        page === 'login'
            ? [
                  {
                      key: 'layout',
                      label: 'Login layout',
                      choices: [
                          ['split', 'Split Panel'],
                          ['centered', 'Centered Card'],
                          ['clean', 'Clean Page'],
                          ['compact', 'Compact Card'],
                      ],
                  },
                  {
                      key: 'position',
                      label: 'Position',
                      choices: [
                          ['top', 'Top center'],
                          ['center', 'Center'],
                          ['between', 'Space between'],
                      ],
                  },
              ]
            : pageSettingDefinitions[page];
    return settingControls(
        [...definitions, inputOutlineDefinitions[page]],
        `${pageNames[page]}: `,
    );
}
function layoutSettingControls() {
    const definitions = [
        ...(theme === 'corporate'
            ? [layoutSettingDefinitions.corporateSidebar]
            : []),
        layoutSettingDefinitions.drawerStyle,
    ];
    return definitions
        .map(
            (definition) =>
                `<div class="viewer-row">${settingControls([
                    definition,
                ])}</div>`,
        )
        .join('');
}
function settingControls(definitions, scope = '') {
    const state = viewState();
    return definitions
        .map(
            ({ key, label, choices }) =>
                `<div class="control-group"><span>${label}</span><div class="switch-group" role="group" aria-label="${esc(
                    `${scope}${label}`,
                )}">${choices
                    .map(
                        ([value, text]) =>
                            `<button type="button" ${
                                key === 'layout' || key === 'position'
                                    ? `data-${key}`
                                    : `data-page-setting="${key}" data-value`
                            }="${value}" class="${
                                state[key] === value ? 'active' : ''
                            }" aria-pressed="${state[key] === value}">${
                                key === 'downloadLayout' ? ico(value) : ''
                            }${text}</button>`,
                    )
                    .join('')}</div></div>`,
        )
        .join('');
}

function renderViewer() {
    if (viewerCollapsed && viewerAnimation?.playState === 'running') return;
    if (embedded) {
        document.getElementById('viewer').hidden = true;
        return;
    }
    document.body.dataset.viewerCollapsed = String(viewerCollapsed);
    const viewer = document.getElementById('viewer');
    const state = { ...viewState(), collapsed: viewerCollapsed };
    const sameControls =
        viewerRenderedState &&
        [
            'theme',
            'palette',
            'layout',
            'device',
            'position',
            'collapsed',
            'inputMode',
            'vision',
            ...Object.keys(pageSettingChoices),
        ].every((key) => viewerRenderedState[key] === state[key]);
    if (sameControls && viewer.querySelector('.viewer-bar')) {
        viewer.querySelectorAll('button[data-go]').forEach((button) => {
            const active = button.dataset.go === page;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        if (viewerRenderedState.page !== page) {
            const controls = viewer.querySelector('.viewer-page-settings');
            controls.innerHTML = pageSettingControls();
            controls.setAttribute('aria-label', `${pageNames[page]} settings`);
        }
        viewer.querySelector('.viewer-summary').textContent = `${
            themeNames[theme]
        } · ${pageNames[page]} · ${
            device.charAt(0).toUpperCase() + device.slice(1)
        }`;
        viewerRenderedState = state;
        return;
    }
    const paletteColors = {
        corporate: ['#091e42', '#ffdd2d', '#158aff'],
        minimal: ['#303d39', '#e4ead9', '#f7f7f5'],
        portal: ['#0b7779', '#103c46', '#d8eeea'],
    };
    const buttons = (items, attribute, current) =>
        items
            .map(
                ([id, label]) =>
                    `<button type="button" ${attribute}="${id}" class="${
                        current === id ? 'active' : ''
                    }" aria-pressed="${current === id}">${
                        attribute === 'data-device'
                            ? ico(id)
                            : attribute === 'data-palette'
                            ? `<span class="palette-preview" aria-hidden="true">${paletteColors[
                                  id
                              ]
                                  .map(
                                      (color) =>
                                          `<i style="background:${color}"></i>`,
                                  )
                                  .join('')}</span>`
                            : ''
                    }${label}</button>`,
            )
            .join('');
    document.getElementById('viewer').innerHTML = `
    <header class="viewer-bar">
        <div class="viewer-head">
            <div class="viewer-brand"><img src="${
                logoAssets.light
            }" alt="1Ci" width="28" height="24"><div class="viewer-title">Design References<small>Layout & responsive preview</small></div></div>
            <span class="viewer-summary" ${!viewerCollapsed ? 'hidden' : ''}>${
                themeNames[theme]
            } · ${pageNames[page]} · ${
                device.charAt(0).toUpperCase() + device.slice(1)
            }</span>
            <div class="viewer-accessibility" role="group" aria-label="Accessibility options">

                <button type="button" class="accessibility-toggle" data-accessibility="vision" aria-label="Режим для слабовидящих" lang="ru" aria-pressed="${visionMode}" title="${
                    visionMode
                        ? 'Выключить режим для слабовидящих'
                        : 'Включить режим для слабовидящих'
                }">${ico('eye')}<span>Для слабовидящих</span></button>
            </div>
            <button type="button" class="viewer-toggle" data-viewer-toggle aria-controls="viewer-controls" aria-expanded="${!viewerCollapsed}" title="${
                viewerCollapsed
                    ? 'Show preview settings'
                    : 'Minimize preview settings'
            }"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg><span>${
                viewerCollapsed ? 'Settings' : 'Minimize'
            }</span></button>
        </div>
        <div class="viewer-controls" id="viewer-controls" ${
            viewerCollapsed ? 'hidden' : ''
        }>
        <div class="viewer-navigation">
            <div class="viewer-row"><nav class="switch-group" aria-label="Reference page">${buttons(
                [
                    ['login', 'Sign In'],
                    ['dashboard', 'Dashboard'],
                    ['account', 'Account'],
                    ['distributives', 'Distributives'],
                    ['partnership', 'Partnership'],
                    ['notifications', 'Notifications'],
                    ['ui-kit', 'UI Kit'],
                    ['support', 'Support'],
                ],
                'data-go',
                page,
            )}</nav></div>
            <div class="viewer-row"><div class="control-group"><span>Style</span><nav class="switch-group" aria-label="Layout style">${buttons(
                [
                    ['corporate', 'Corporate'],
                    ['studio', 'Studio'],
                    ['minimal', 'Minimal'],
                ],
                'data-theme',
                theme,
            )}</nav></div></div>
            <div class="viewer-layout-settings" aria-label="Navigation settings">${layoutSettingControls()}</div>
        </div>
        <div class="viewer-options">
            <div class="viewer-row"><div class="switch-group device-controls" aria-label="Preview device">${buttons(
                [
                    ['mobile', 'Mobile · 390'],
                    ['tablet', 'Tablet · 768'],
                    ['desktop', 'Desktop'],
                ],
                'data-device',
                device,
            )}</div></div>
            <div class="viewer-page-settings" aria-label="${
                pageNames[page]
            } settings">${pageSettingControls()}</div>
        </div>
        </div>
    </header>
    <div class="concept-note" ${viewerCollapsed ? 'hidden' : ''}>${
        themeNames[theme]
    } — ${notes[theme]} <span class="palette-note">Palette: ${
        paletteNames[palette]
    }</span></div>`;
    viewerRenderedState = state;
}

/* =========================
   APPLICATION SHELL
   ========================= */

const navigationGroups = {
    store: {
        label: 'Store',
        children: [
            {
                id: 'store-buy',
                label: 'Buy',
                children: [
                    { action: 'store-apps', label: 'Apps & Platform' },
                    { action: 'store-nfr', label: 'Not For Resale' },
                    { action: 'store-fee', label: 'Partner Fee' },
                    {
                        action: 'certification',
                        label: 'Certifications Attempts',
                    },
                    { action: 'store-smua', label: 'SMUA' },
                ],
            },
            { action: 'orders', label: 'My Orders' },
        ],
    },
    purchases: {
        label: 'My Purchases',
        children: [
            { page: 'distributives', label: 'Distributives' },
            { action: 'licenses', label: 'Products and Licenses' },
        ],
    },
    links: {
        label: 'Quick Links',
        children: [
            { href: 'https://academy.1ci.com/', label: 'Academy' },
            { page: 'support', label: 'Support' },
            { href: 'https://partnerkit.1ci.com/', label: 'Partner Kit' },
        ],
    },
};
function navigationGroupHasPage(items, currentPage) {
    return items.some(
        (item) =>
            item.page === currentPage ||
            (item.children &&
                navigationGroupHasPage(item.children, currentPage)),
    );
}
function navigationGroupContent(groupId) {
    const group = navigationGroups[groupId];
    const renderItem = (item) => {
        if (item.children)
            return `<details class="drawer-subgroup" data-nav-subgroup="${
                item.id
            }" open><summary><span>${esc(
                item.label,
            )}</span><svg class="icon drawer-subgroup-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="drawer-sublinks">${item.children
                .map(renderItem)
                .join('')}</div></details>`;
        const label = `<span class="drawer-link-label">${esc(item.label)}${
            item.href ? ico('external') : ''
        }</span>`;
        if (item.href)
            return `<a href="${esc(
                item.href,
            )}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        return `<button type="button" ${
            item.page
                ? `data-go="${item.page}"`
                : `data-action="${item.action}"`
        } ${item.page === page ? 'aria-current="page"' : ''}>${label}</button>`;
    };
    return `<nav class="drawer-links" aria-label="${esc(
        group.label,
    )}">${group.children.map(renderItem).join('')}</nav>`;
}

function navigation(compact = false) {
    const items = compact
        ? [
              ['dashboard', 'home', 'Dashboard'],
              ['store', 'store', 'Store'],
              ['purchases', 'bag', 'My Purchases'],
              ['links', 'link', 'Quick Links'],
          ]
        : [
              ['dashboard', 'home', 'Dashboard'],
              ['store', 'store', 'Store'],
              ['purchases', 'bag', 'My Purchases'],
              ['links', 'link', 'Quick Links'],
              ['request', 'support', 'Submit a Request'],
          ];

    return `<nav class="nav" aria-label="Main navigation">${items
        .map(([id, icon, label]) => {
            const group = navigationGroups[id];
            const current =
                page === id ||
                (!!group && navigationGroupHasPage(group.children, page));
            const attrs = group
                ? `data-open-nav-group="${id}" aria-haspopup="dialog" aria-controls="corporate-mobile-drawer" aria-expanded="false"`
                : Object.hasOwn(pageNames, id)
                ? `data-go="${id}"`
                : `data-action="${id === 'request' ? 'support' : id}"`;
            return `<button type="button" ${attrs} class="${
                current ? 'active' : ''
            }" aria-label="${label}" title="${label}" ${
                current && !group ? 'aria-current="page"' : ''
            }>${ico(icon)}<span class="nav-label">${label}</span>${
                group
                    ? '<span class="nav-submenu-indicator" aria-hidden="true">›</span>'
                    : ''
            }</button>`;
        })
        .join('')}</nav>`;
}

function corporateMobileBar() {
    const personalActive = ['dashboard', 'account', 'partnership'].includes(
        page,
    );
    return `<header class="corporate-mobile-bar" aria-label="Mobile navigation">
        <button type="button" class="mobile-icon-button" data-open-drawer="left" aria-label="Open navigation" aria-controls="corporate-mobile-drawer" aria-expanded="false">${ico(
            'menu',
        )}</button>
        <button type="button" class="mobile-brand-button" data-go="dashboard" aria-label="Dashboard"><img src="${
            logoAssets.light
        }" alt="1Ci" width="40" height="34"></button>
        <button type="button" class="avatar mobile-account-button" data-open-drawer="right" data-personal-active="${personalActive}" aria-label="Open account menu" aria-controls="corporate-mobile-drawer" aria-expanded="false">${initials()}</button>
    </header>`;
}

function sidebarToggleButton() {
    return `<button type="button" class="sidebar-toggle" data-action="toggle-sidebar" aria-controls="reference-sidebar" aria-expanded="${!sidebarCollapsed}" aria-label="${
        sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
    }" title="${
        sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
    }"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>`;
}

function shell(content) {
    const parentGroup = Object.values(navigationGroups).find((group) =>
        navigationGroupHasPage(group.children, page),
    );
    return `
    <div class="app-shell">
      <aside class="sidebar" id="reference-sidebar">
        <div class="sidebar-header"><button type="button" class="sidebar-brand-button" data-go="dashboard" aria-label="Dashboard">${brand()}</button></div>
        ${navigation()}

        <div class="sidebar-bottom">
          ${personalMenu('sidebar')}
        </div>
      </aside>

      <div class="workspace">
        ${theme === 'corporate' ? corporateMobileBar() : ''}
        <header class="topbar">
          ${theme === 'corporate' ? sidebarToggleButton() : ''}
          <div class="breadcrumb">
            My Account / ${
                parentGroup ? `${esc(parentGroup.label)} / ` : ''
            }<b>${pageNames[page]}</b>
          </div>
          <div class="topnav">${brand()}${navigation(true)}</div>
          <div class="topbar-actions">
            <time class="date" data-moscow-date>${moscowDateFormatter.format(
                new Date(),
            )}</time>
            <button type="button" class="icon-button"
              data-action="notifications" aria-label="View notifications">
              ${ico('bell')}<span class="unread"></span>
            </button>
            ${languageMenu()}
            ${personalMenu()}
          </div>
        </header>

        <div class="page-scroll"><main class="content" id="main-content" tabindex="-1" aria-label="${
            pageNames[page]
        }">${content}</main>${footer()}</div>
      </div>
    </div>`;
}

/* =========================
   SIGN IN
   ========================= */

function loginPage() {
    return `
    <div class="login-stage"><main class="login" id="main-content" tabindex="-1" aria-label="Sign In">
      <section class="login-story" aria-label="Account benefits">
        ${brand()}

        <div class="login-copy">
          <h1>Your 1Ci workspace<br>All in one place</h1>
          <p>Access your products, certifications, and support from a single account.</p>

          <div class="story-features">
            <div class="flex">
              <div class="icon-box">${ico('bag')}</div>
              <div><strong>Products & purchases</strong><br><small>Orders, licenses, and downloads</small></div>
            </div>
            <div class="flex">
              <div class="icon-box">${ico('award')}</div>
              <div><strong>Learning & certification</strong><br><small>Build your professional expertise</small></div>
            </div>
            <div class="flex">
              <div class="icon-box">${ico('support')}</div>
              <div><strong>Personal support</strong><br><small>Expert help when you need it</small></div>
            </div>
          </div>
        </div>

        <div class="story-bottom">A dedicated workspace for 1Ci users and partners</div>
      </section>

      <section class="login-area">
        <div class="mobile-brand">${brand()}</div>

        <div class="login-wrap">
          <h1>Sign in to your account</h1>
          <p>Enter your account email address to get started.</p>

          <form id="login-form" class="login-form">
            <div class="field">
              <label for="login-email">Email address</label>
              <input id="login-email" type="email" autocomplete="username"
                value="test@test.test" placeholder="name@company.com" required>
            </div>

            <div class="field">
              <label for="login-password">Password</label>
              <div class="password-wrap">
                <input id="login-password" type="password"
                  value="Test123!" autocomplete="current-password" placeholder="Enter your password" required>
                <button type="button" class="password-toggle"
                  data-action="toggle-password" aria-label="Show password"
                  aria-pressed="false">${ico('eye')}</button>
              </div>
            </div>

            <div class="login-options">
              <label class="check"><input type="checkbox">Remember me</label>
              <button type="button" class="text-button"
                data-action="forgot">Forgot password?</button>
            </div>

            <button type="submit" class="btn primary full">Sign In ${ico(
                'arrow',
            )}</button>
          </form>

          <p class="login-register">
            Don't have an account?
            <button type="button" class="text-button" data-action="register">Create one</button>
          </p>

        </div>

      </section>
    </main>
    <aside class="demo-plaque login-demo">${ico(
        'shield',
    )}<span>Demo sign-in · No credentials are sent</span></aside></div>${footer()}`;
}

/* =========================
   DASHBOARD
   ========================= */

const notificationDateParts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
        .formatToParts(new Date())
        .map((part) => [part.type, part.value]),
);
const notificationToday = `${notificationDateParts.year}-${notificationDateParts.month}-${notificationDateParts.day}`;

const notifications = [
    [
        'Today, 09:07',
        'Partner link updated',
        'Review your linked partner company details.',
        false,
        notificationToday,
    ],
    [
        'Today, 09:02',
        'Account information updated',
        'Your contact details are available in your profile.',
        false,
        notificationToday,
    ],
    [
        '24 October, 23:06',
        'Partner information',
        'Linked company information is available in your account.',
        true,
        '2026-10-24',
    ],
];

function notificationRows(filter = 'all') {
    return notifications
        .filter(
            (item) =>
                filter === 'all' ||
                (filter === 'unread' && !item[3]) ||
                (filter === 'read' && item[3]),
        )
        .map(
            ([time, title, text, read, date]) => `
    <div class="list-row" data-notification data-read="${read}" data-date="${date}">
      <span class="dot notification-mark ${read ? 'read' : ''}"></span>
      <div class="row-content">
        <time class="notification-time" datetime="${date}T${time.slice(
            -5,
        )}:00+03:00">${time}</time>
        <strong style="font-size:12px">${title}</strong>
        <p class="muted">${text}</p>
      </div>
    </div>`,
        )
        .join('');
}

function profileCard() {
    return `<section class="card profile-card">
        <div class="profile-identity"><div class="flex between"><div class="avatar large">${initials()}</div><button type="button" class="icon-button" data-go="account" aria-label="Edit account">${ico(
            'edit',
        )}</button></div>
        <h2>${fullName()}</h2><span class="badge">Community member</span><div class="profile-meta muted">Account ID 299<br><span style="color:var(--text)">eego@1ci.com</span></div></div>
        <div class="profile-contact"><small class="muted">Your personal contact</small><div class="flex contact-person"><div class="avatar">NS</div><div><button type="button" class="text-button contact-name" data-action="manager">Nina Sitkina</button><p class="muted">Sales support manager</p></div></div></div>
        <div class="profile-partner"><small class="muted">Your 1Ci partner</small><h3 style="margin-top:8px">${
            partnerLinked ? 'Partner Company' : 'No partner connected'
        }</h3>${
            partnerLinked
                ? '<p class="muted" style="font-size:12px">Account ID 6363 · test@1ci.app</p>'
                : ''
        }<button type="button" class="btn small" data-go="partnership">View partnership</button></div>
    </section>`;
}

function notificationsCard() {
    return `<section class="card notifications-card">
          <div class="card-heading"><h2>Notifications</h2><button type="button" class="badge" data-go="notifications" data-notification-filter="unread" aria-label="View 2 unread notifications">2 new</button></div>
          <div class="notification-list">${notificationRows()}</div>
          <button type="button" class="text-button mt"
            data-go="notifications">View all notifications ${ico(
                'arrow',
            )}</button>
        </section>`;
}

function newsCard() {
    return `<section class="card news-card">
          <div class="card-heading"><h2>News & Updates</h2></div>
          ${[
              ['23 October 2026', 'New release: 1C:ERP Turkish Edition'],
              ['19 October 2026', '1C:Drive Indonesian Edition update'],
              ['14 October 2026', 'Documentation Digest — Q3 2026'],
          ]
              .map(
                  ([date, title]) => `
            <article class="news-item">
              <small>${date}</small><h3>${title}</h3>
              <button type="button" class="text-button" data-action="news">Read more ${ico(
                  'arrow',
              )}</button>
            </article>`,
              )
              .join('')}
          <button type="button" class="text-button mt"
            data-action="news">View all news ${ico('arrow')}</button>
        </section>`;
}

function dashboardPage() {
    const certificates = [
        '1C:Enterprise<br>Junior',
        '1C:Enterprise<br>Senior',
        '1C:Enterprise<br>Architect',
        '1C:Enterprise<br>Engineer',
        '1C:Drive<br>Consultant',
    ];

    return shell(`
    <div class="page-heading">
      <div>
        <h1>Hello, ${esc(profile.first)}!</h1>
        <p>Your services, certifications, and latest updates at a glance.</p>
      </div>
      <button type="button" class="btn primary"
        data-action="store">${ico('store')}Browse Store</button>
    </div>

    <div class="stats">
      ${[
          ['award', '10', 'Certificates'],
          ['file', '—', 'Your purchases'],
          ['bell', '2', 'New notifications'],
          ['shield', partnerLinked ? 'Linked' : 'Unlinked', 'Partner status'],
      ]
          .map(
              ([icon, value, label]) => `
        <div class="card stat">
          <div class="icon-box">${ico(icon)}</div>
          <div>
            <strong ${
                value === 'Linked' ? 'style="font-size:20px"' : ''
            }>${value}</strong>
            <small>${label}</small>
          </div>
        </div>`,
          )
          .join('')}
    </div>

    ${
        theme === 'corporate'
            ? `<div class="dashboard-overview">${profileCard()}${notificationsCard()}</div>`
            : ''
    }
    <div class="dashboard-grid">
      <div class="dashboard-main">
        <section class="card cert-card">
          <div class="card-heading">
            <h2>My Certificates</h2>
            <span class="badge success">${ico('award')}10 certificates</span>
          </div>

          <div class="cert-layout">
            <div class="certificates">
              ${certificates
                  .map(
                      (name) => `
                <div class="certificate">
                  <div class="cert-symbol">${ico('award')}</div>
                  <strong>${name}</strong>
                </div>`,
                  )
                  .join('')}
            </div>

            <div class="cert-action">
              <h3>Take your next career step</h3>
              <p>View your certification attempts or explore a new qualification.</p>
              <button type="button" class="btn primary small"
                data-action="certification">Certification Attempts ${ico(
                    'arrow',
                )}</button>
              <button type="button" class="text-button"
                data-action="attempts">Get more attempts</button>
            </div>
          </div>

          <div class="academy-banner">
            <span><strong>1Ci Academy</strong> · Training and certification preparation</span>
            <button type="button" class="text-button flex"
              data-action="academy">Learn more ${ico('external')}</button>
          </div>
        </section>

        ${theme === 'corporate' ? newsCard() : notificationsCard()}

        <section class="card support-card">
          <div class="card-heading"><h2>Support Services</h2>${ico(
              'support',
          )}</div>
          ${[
              [
                  'support',
                  'support',
                  'Submit a request',
                  'Get help with a question or issue',
              ],
              [
                  'knowledge',
                  'book',
                  'Product Knowledge Base',
                  'Explore product documentation',
              ],
              [
                  'demo',
                  'globe',
                  'Demo applications',
                  'Discover product capabilities',
              ],
              [
                  'policies',
                  'shield',
                  'Support policies',
                  'Service terms and guidelines',
              ],
          ]
              .map(
                  ([action, icon, title, subtitle]) => `
            <button type="button" class="support-link" data-action="${action}">
              <div class="icon-box">${ico(icon)}</div>
              <span><strong>${title}</strong><small>${subtitle}</small></span>
              <span class="arrow">${ico('arrow')}</span>
            </button>`,
              )
              .join('')}
        </section>

        <section class="card faq-card">
          <div class="card-heading">
            <h2>Frequently Asked Questions</h2>
            <button type="button" class="text-button"
              data-action="guide">Purchase Guide</button>
          </div>
          ${[
              [
                  'Where can I place an order?',
                  'Use the Store navigation item. The store is represented by a demo dialog in this reference.',
              ],
              [
                  'Where can I find my purchases and licenses?',
                  'My Purchases is the designated entry point. Detailed purchase screens are outside this reference.',
              ],
              [
                  'Where can I find my certificates?',
                  'Your certificates are displayed in the My Certificates card on this dashboard.',
              ],
              [
                  'How can I contact support?',
                  "Select Submit a Request or use your personal manager's email address.",
              ],
          ]
              .map(
                  ([question, answer]) => `
            <details><summary>${question}</summary><p>${answer}</p></details>`,
              )
              .join('')}
        </section>
      </div>

      ${
          theme !== 'corporate'
              ? `<aside class="stack dashboard-aside">${profileCard()}${newsCard()}</aside>`
              : ''
      }
    </div>`);
}

/* =========================
   ACCOUNT
   ========================= */

function addressesContent() {
    return `
    <section class="card">
      <div class="card-heading"><h2>Addresses</h2>${ico('pin')}</div>
      ${[
          ['billing', 'Billing address'],
          ['delivery', 'Delivery address'],
      ]
          .map(([key, label]) => {
              const address = addresses[key];
              return `
            <div class="address-row">
              <div>
                <strong>${label}</strong>
                <small>${
                    address
                        ? esc(
                              `${address.street}, ${address.city}, ${address.postcode}, ${address.country}`,
                          )
                        : 'Not added yet'
                }</small>
              </div>
              <button type="button" class="btn small"
                data-action="${key}">${address ? 'Edit' : '+ Add'}</button>
            </div>`;
          })
          .join('')}
    </section>`;
}

function profileContent() {
    return `
    <section class="card">
      <div class="card-heading">
        <div><h2>Contact Information</h2><small class="muted">Personal details and contact information</small></div>
        <button type="button" class="btn small"
          data-action="edit-contacts">${ico('edit')}Edit</button>
      </div>

      <div class="data-grid">
        ${[
            ['First name', profile.first],
            ['Last name', profile.last],
            ['Country', profile.country],
            ['Phone', profile.phone],
            ['Skype ID', profile.skype],
            ['Job position', profile.position],
        ]
            .map(
                ([label, value]) => `
          <div><small>${label}</small><strong>${esc(
              value || 'Not provided',
          )}</strong></div>`,
            )
            .join('')}
      </div>

      <div class="email-block">
        <div>
          <small class="muted">Email address</small>
          <div class="flex" style="margin-top:5px;flex-wrap:wrap">
            <strong>eego@1ci.com</strong><span class="badge success">Verified</span>
          </div>
        </div>
        <button type="button" class="btn small"
          data-action="email">Request Email Change</button>
      </div>
    </section>

    <section class="card">
      <div class="card-heading">
        <div><h2>Company Information</h2><small class="muted">Linked partner company details</small></div>
        <span class="badge">Read-only</span>
      </div>

      <div class="data-grid">
        ${[
            ['Company', 'test'],
            ['Number of employees', 'Not provided'],
            ['Year of foundation', 'Not provided'],
            ['Website', 'Not provided'],
        ]
            .map(
                ([label, value]) => `
          <div><small>${label}</small><strong>${value}</strong></div>`,
            )
            .join('')}
      </div>

      <div class="notice mt">
        Company information is read-only because your account is linked to a partner company.
      </div>
    </section>

    ${addressesContent()}

    <section class="card">
      <h2>Newsletter Preferences</h2>
      <p class="muted" style="font-size:12px">Choose which updates you would like to receive.</p>
      <label class="check">
        <input type="checkbox" data-setting="newsletter"
          ${settings.newsletter ? 'checked' : ''}>
        Notify me about new product releases available for download
      </label>
    </section>`;
}

function accountPage() {
    return shell(`
    <div class="page-heading">
      <div>
        <h1>My Account</h1>
        <p>Manage your personal details, preferences, and contact information.</p>
      </div>
      <button type="button" class="btn"
        data-go="dashboard">${ico('home')}Back to Dashboard</button>
    </div>

    <div class="account-layout">
      <div class="stack">
        <section class="card">
          <div class="account-summary">
            <div class="avatar large">${initials()}</div>
            <div>
              <h2>${fullName()}</h2>
              <div class="summary-meta muted">
                <span>Account ID 299</span><span>Registered: 19 August 2019</span>
              </div>
              ${
                  partnerLinked
                      ? '<button type="button" class="badge success partner-info-trigger" data-action="partner-info"><span class="dot"></span>Linked to a partner</button>'
                      : '<span class="badge partner-info-trigger">No partner connected</span>'
              }
            </div>
          </div>


        </section>
        ${profileContent()}
      </div>

      <aside class="stack account-aside">
        <section class="card settings-card">
          <h2 style="margin-bottom:22px">Account Settings</h2>

          <div class="field">
            <label for="account-type">Account type</label>
            <select id="account-type" data-setting="type">
              ${['Developer', 'Community member', 'Partner']
                  .map(
                      (type) => `
                <option ${
                    settings.type === type ? 'selected' : ''
                }>${type}</option>`,
                  )
                  .join('')}
            </select>
          </div>

          <div class="field">
            <label for="account-language">Region & language</label>
            <select id="account-language">
              <option selected>${(
                  languages.find((item) => item[0] === selectedLanguage) ||
                  languages[0]
              )
                  .slice(2)
                  .join(' | ')}</option>
            </select>
          </div>

          <small class="muted">Sales support manager</small>
          <button type="button" class="text-button" data-action="manager"
            style="display:block;margin-top:5px">Nina Sitkina</button>

          <hr>
          <button type="button" class="btn small"
            data-action="password">${ico('shield')}Change Password</button>
          <button type="button" class="btn small danger"
            data-action="delete">Delete Account</button>
        </section>

        <section class="card academy-card">
          <div class="eyebrow">Professional development</div>
          <h2 class="academy-title">${ico('book')}<span>1Ci Academy</span></h2>
          <p>Build your skills, prepare for certification, and unlock new opportunities for your team.</p>
          <button type="button" class="btn primary full"
            data-action="academy">Go to Academy ${ico('arrow')}</button>
        </section>
      </aside>
    </div>`);
}

/* =========================
   RENDER AND DIALOGS
   ========================= */

function render() {
    applyAccessibility();
    document.body.dataset.sidebarCollapsed = String(sidebarCollapsed);
    document.body.dataset.theme = theme;
    document.body.dataset.palette = palette;
    document.body.dataset.embedded = String(embedded);
    document.body.dataset.position = loginPosition;
    document.body.dataset.page = page;
    applyLayoutOptions();

    if (page === 'login') {
        document.body.dataset.loginLayout = loginLayout;
    } else {
        delete document.body.dataset.loginLayout;
    }

    renderViewer();
    if (!embedded) {
        renderPreview();
        saveViewState();
        document.title = `${pageNames[page]} — ${themeNames[theme]} — 1Ci Account`;
        return;
    }

    document.getElementById('app').innerHTML =
        page === 'login'
            ? loginPage()
            : page === 'dashboard'
            ? dashboardPage()
            : page === 'account'
            ? accountPage()
            : page === 'distributives'
            ? distributivesPage()
            : page === 'notifications'
            ? notificationsPage()
            : page === 'support'
            ? supportPage()
            : page === 'partnership'
            ? partnershipPage()
            : uiKitPage();

    document
        .querySelectorAll(
            'button[data-action="manager"], button[data-action="partner-info"]',
        )
        .forEach((button) => {
            button.setAttribute('aria-haspopup', 'dialog');
            button.setAttribute('aria-controls', 'contact-info-popover');
            button.setAttribute('aria-expanded', 'false');
        });
    if (contactPopoverTrigger && !contactPopoverTrigger.isConnected)
        dismissContactPopover();
    if (drawerOpener && !drawerOpener.isConnected) dismissCorporateDrawer();
    applyPageSettings();
    enhanceSelects(document.getElementById('app'));
    setupFilterResetTooltips(document.getElementById('app'));
    setupDatePeriods(document.getElementById('app'));
    filterDistributives();
    syncNotificationFilters();
    window.parent.postMessage(
        { type: 'reference-page', page, state: viewState() },
        '*',
    );
    const pageName = pageNames[page];

    document.title = `${pageName} — ${themeNames[theme]} — 1Ci Account`;
}

function go(next) {
    if (!Object.hasOwn(pageNames, next) || next === page) return;
    page = next;
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    history.replaceState(null, '', url);
    render();
    if (embedded) {
        resetPageScroll();
        if (assistiveMode) focusPageContent();
        announceAccessibility(`${pageNames[page]} page opened.`);
    }
}

function toast(message) {
    const element = document.getElementById('toast');
    element.textContent = message;
    element.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        element.hidden = true;
    }, 4000);
}

const surfaceAnimations = new Map();
const popupTransitions = new WeakMap();
let modalTransition = 0;
let modalOpener;
function surfaceMotionEnabled() {
    return (
        !assistiveMode &&
        !visionMode &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}
function finishSurfacesWithoutMotion() {
    if (surfaceMotionEnabled()) return;
    surfaceAnimations.forEach((entry) => {
        entry.animation.finish();
        entry.backdrop?.finish();
    });
}
function cancelSurfaceAnimation(element) {
    const previous = surfaceAnimations.get(element);
    if (previous) {
        previous.animation.cancel();
        previous.backdrop?.cancel();
        surfaceAnimations.delete(element);
    }
}
function animateSurface(element, opening, kind) {
    const drawer = [
        'drawer-left',
        'drawer-right',
        'drawer-top',
        'drawer-bottom',
        'drawer-floating',
    ].includes(kind);
    const offset = drawer
        ? kind === 'drawer-floating'
            ? 'translateY(12px) scale(.97)'
            : kind === 'drawer-top' || kind === 'drawer-bottom'
            ? `translateY(${kind === 'drawer-top' ? '-100%' : '100%'})`
            : `translateX(${kind === 'drawer-left' ? '-100%' : '100%'})`
        : kind === 'modal'
        ? opening
            ? 'translateY(12px) scale(.97)'
            : 'translateY(10px) scale(.97)'
        : 'translateY(-6px) scale(.98)';
    const resting = drawer ? 'translateX(0)' : 'translateY(0) scale(1)';
    const previous = surfaceAnimations.get(element);
    const style = previous ? getComputedStyle(element) : null;
    const start = previous
        ? { opacity: style.opacity, transform: style.transform }
        : opening
        ? {
              opacity: 0,
              transform: offset,
          }
        : { opacity: 1, transform: resting };
    cancelSurfaceAnimation(element);
    if (!surfaceMotionEnabled()) return Promise.resolve(true);
    const end = opening
        ? { opacity: 1, transform: resting }
        : {
              opacity: 0,
              transform: offset,
          };
    const duration = drawer
        ? opening
            ? 240
            : 200
        : kind === 'modal'
        ? opening
            ? 200
            : 160
        : opening
        ? 180
        : 140;
    const animation = element.animate([start, end], {
        duration,
        easing: opening ? 'ease-out' : 'ease-in',
        fill: 'forwards',
    });
    const backdropFrames = [
        { opacity: opening ? 0 : 1 },
        { opacity: opening ? 1 : 0 },
    ];
    const backdropOptions = { duration, easing: 'ease-out', fill: 'forwards' };
    const attachedBackdrop =
        drawer &&
        attachedDrawerStage?.querySelector('.sidebar-drawer-backdrop');
    const backdrop = attachedBackdrop
        ? attachedBackdrop.animate(backdropFrames, backdropOptions)
        : (kind === 'modal' || drawer) && element.matches(':modal')
        ? element.animate(backdropFrames, {
              ...backdropOptions,
              pseudoElement: '::backdrop',
          })
        : null;
    const entry = { animation, backdrop };
    surfaceAnimations.set(element, entry);
    return animation.finished
        .then(() => surfaceAnimations.get(element) === entry)
        .catch(() => false);
}
function setPopup(popup, opening, restoreFocus = false) {
    const panel = popup.querySelector('.popup-panel');
    if (!panel) return Promise.resolve(false);
    const previous = popupTransitions.get(popup);
    if (previous?.opening === opening) return previous.promise;
    if (!opening && !popup.open) return Promise.resolve(true);
    if (
        opening &&
        popup.matches('.date-period-popup') &&
        (!popup.open || previous?.opening === false)
    )
        beginDatePeriod(popup);
    const transition = { opening };
    popupTransitions.set(popup, transition);
    popup.open = true;
    popup
        .querySelector('[role="combobox"], .date-period-trigger')
        ?.setAttribute('aria-expanded', String(opening));
    if (opening && popup.matches('.date-period-popup')) {
        if (!panel.matches(':popover-open')) panel.showPopover();
        positionDatePeriod(popup);
    }
    panel.style.pointerEvents = opening ? '' : 'none';
    const finish = () => {
        if (popupTransitions.get(popup) !== transition) return false;
        if (!opening) {
            const focusInside = panel.contains(document.activeElement);
            if (
                popup.matches('.date-period-popup') &&
                panel.matches(':popover-open')
            )
                panel.hidePopover();
            popup.open = false;
            if (restoreFocus || focusInside)
                popup.querySelector('summary')?.focus({ preventScroll: true });
        }
        panel.style.pointerEvents = '';
        cancelSurfaceAnimation(panel);
        popupTransitions.delete(popup);
        return true;
    };
    if (!surfaceMotionEnabled()) {
        cancelSurfaceAnimation(panel);
        transition.promise = Promise.resolve(finish());
    } else {
        transition.promise = animateSurface(panel, opening, 'popup').then(
            (done) => done && finish(),
        );
    }
    return transition.promise;
}
document.addEventListener(
    'keydown',
    (event) => {
        const popup = event.target.closest('.select-popup[open]');
        if (event.key !== 'Escape' || !popup) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        setPopup(popup, false, true);
    },
    true,
);

let contactPopover;
let contactPopoverTrigger;
let contactPopoverOpen = false;
let contactPopoverToken = 0;
let contactPopoverClosing;
function positionContactPopover() {
    if (!contactPopoverOpen || !contactPopoverTrigger?.isConnected) return;
    const anchor = contactPopoverTrigger.getBoundingClientRect();
    const margin = 12,
        gap = 10;
    const width = document.documentElement.clientWidth,
        height = innerHeight;
    contactPopover.style.maxWidth = `${Math.max(120, width - margin * 2)}px`;
    contactPopover.style.maxHeight = `${Math.max(80, height - margin * 2)}px`;
    let box = contactPopover.getBoundingClientRect();
    const below = height - anchor.bottom - gap - margin,
        above = anchor.top - gap - margin;
    const placeAbove = below < box.height && above > below;
    contactPopover.style.maxHeight = `${Math.max(
        80,
        Math.min(height - margin * 2, placeAbove ? above : below),
    )}px`;
    box = contactPopover.getBoundingClientRect();
    const left = Math.max(
        margin,
        Math.min(
            anchor.left + anchor.width / 2 - box.width / 2,
            width - box.width - margin,
        ),
    );
    const idealTop = placeAbove
        ? anchor.top - gap - box.height
        : anchor.bottom + gap;
    const top = Math.max(
        margin,
        Math.min(idealTop, height - box.height - margin),
    );
    contactPopover.style.left = `${left}px`;
    contactPopover.style.top = `${top}px`;
    const arrowLeft = Math.max(
        18,
        Math.min(anchor.left + anchor.width / 2 - left, box.width - 18),
    );
    contactPopover.dataset.placement = placeAbove ? 'above' : 'below';
    contactPopover.style.setProperty('--popover-arrow-left', `${arrowLeft}px`);
    contactPopover.style.transformOrigin = `${arrowLeft}px ${
        placeAbove ? 'bottom' : 'top'
    }`;
}
function dismissContactPopover() {
    contactPopoverToken++;
    if (!contactPopover) return;
    cancelSurfaceAnimation(contactPopover);
    if (contactPopover.hidePopover && contactPopover.matches(':popover-open'))
        contactPopover.hidePopover();
    contactPopover.hidden = true;
    contactPopoverOpen = false;
    contactPopoverClosing = null;
    contactPopoverTrigger?.setAttribute('aria-expanded', 'false');
    contactPopoverTrigger = null;
}
function closeContactPopover(restoreFocus = false) {
    if (contactPopoverClosing && !contactPopoverOpen) {
        contactPopoverClosing.restoreFocus ||= restoreFocus;
        return contactPopoverClosing.promise;
    }
    if (!contactPopoverOpen) return Promise.resolve(true);
    contactPopoverOpen = false;
    const token = ++contactPopoverToken;
    const closing = { restoreFocus };
    contactPopoverClosing = closing;
    contactPopover.style.pointerEvents = 'none';
    const finish = () => {
        if (token !== contactPopoverToken) return false;
        const trigger = contactPopoverTrigger;
        dismissContactPopover();
        if (closing.restoreFocus && trigger?.isConnected)
            trigger.focus({ preventScroll: true });
        return true;
    };
    if (!surfaceMotionEnabled()) closing.promise = Promise.resolve(finish());
    else
        closing.promise = animateSurface(contactPopover, false, 'popup').then(
            (done) => done && finish(),
        );
    return closing.promise;
}
function openContactPopover(title, content, trigger) {
    if (!trigger) return;
    if (contactPopoverOpen && contactPopoverTrigger === trigger) {
        closeContactPopover(true);
        return;
    }
    contactPopoverToken++;
    contactPopoverClosing = null;
    contactPopoverTrigger?.setAttribute('aria-expanded', 'false');
    contactPopoverTrigger = trigger;
    if (!contactPopover) {
        contactPopover = document.createElement('div');
        contactPopover.id = 'contact-info-popover';
        contactPopover.className = 'popup-panel contact-popover';
        contactPopover.setAttribute('popover', 'manual');
        contactPopover.setAttribute('role', 'dialog');
        contactPopover.setAttribute('aria-modal', 'false');
        contactPopover.setAttribute('aria-labelledby', 'contact-popover-title');
        contactPopover.hidden = true;
        contactPopover.addEventListener('focusout', () => {
            setTimeout(() => {
                if (
                    contactPopoverOpen &&
                    !contactPopover.contains(document.activeElement) &&
                    document.activeElement !== contactPopoverTrigger
                )
                    closeContactPopover();
            }, 0);
        });
        document.body.append(contactPopover);
    }
    contactPopover.innerHTML = `<div class="contact-popover-content"><div class="dialog-heading"><h2 id="contact-popover-title">${esc(
        title,
    )}</h2><button type="button" class="icon-button" data-close-contact aria-label="Close contact information">×</button></div>${content}</div>`;
    contactPopover.hidden = false;
    contactPopover.style.pointerEvents = '';
    if (contactPopover.showPopover && !contactPopover.matches(':popover-open'))
        contactPopover.showPopover();
    contactPopoverOpen = true;
    trigger.setAttribute('aria-expanded', 'true');
    positionContactPopover();
    animateSurface(contactPopover, true, 'popup').then((done) => {
        if (done) cancelSurfaceAnimation(contactPopover);
    });
    if (assistiveMode)
        contactPopover
            .querySelector('[data-close-contact]')
            .focus({ preventScroll: true });
}
window.addEventListener('resize', positionContactPopover);
window.addEventListener('blur', () => closeContactPopover());
document.addEventListener(
    'scroll',
    (event) => {
        if (!contactPopoverOpen || contactPopover.contains(event.target))
            return;
        const rect = contactPopoverTrigger?.getBoundingClientRect();
        if (!rect || rect.bottom < 0 || rect.top > innerHeight)
            closeContactPopover();
        else positionContactPopover();
    },
    true,
);

let corporateDrawer;
let drawerOpener;
let drawerSide;
let drawerGroup;
let attachedDrawerStage;
let attachedDrawerObserver;
let attachedDrawerInertRoot;
let attachedDrawerInertBefore;

function drawerAttachment(trigger) {
    const sidebar = trigger?.closest('.sidebar');
    if (sidebar && sidebar.getBoundingClientRect().width > 0)
        return {
            anchor: sidebar,
            placement: theme === 'studio' ? 'bottom' : 'left',
        };
    const header = trigger?.closest('.topbar');
    if (header && header.getBoundingClientRect().height > 0)
        return { anchor: header, placement: 'top' };
    const mobileHeader =
        pageOptions.drawerStyle === 'floating' &&
        trigger?.closest('.corporate-mobile-bar');
    if (mobileHeader) return { anchor: mobileHeader, placement: 'top' };
    return null;
}
function removeAttachedDrawer() {
    attachedDrawerObserver?.disconnect();
    attachedDrawerObserver = null;
    if (attachedDrawerInertRoot)
        attachedDrawerInertRoot.inert = attachedDrawerInertBefore;
    attachedDrawerInertRoot = null;
    if (attachedDrawerStage) {
        document.body.append(corporateDrawer);
        attachedDrawerStage.remove();
        attachedDrawerStage = null;
    }
    delete document.body.dataset.attachedDrawer;
    corporateDrawer?.classList.remove('sidebar-attached-drawer');
}
function positionAttachedDrawer() {
    if (!attachedDrawerStage) return;
    const attachment = drawerAttachment(drawerOpener);
    if (
        !attachment ||
        attachment.placement !== attachedDrawerStage.dataset.placement
    ) {
        dismissCorporateDrawer();
        return;
    }
    const rect = attachment.anchor.getBoundingClientRect();
    attachedDrawerStage.style.left =
        attachment.placement === 'left' ? `${rect.right}px` : '0';
    attachedDrawerStage.style.right = '0';
    attachedDrawerStage.style.top =
        attachment.placement === 'top' ? `${rect.bottom}px` : '0';
    attachedDrawerStage.style.bottom =
        attachment.placement === 'bottom'
            ? `${Math.max(0, innerHeight - rect.top)}px`
            : '0';
    if (attachment.placement === 'bottom') {
        const width = Math.min(360, innerWidth - 32);
        const left = Math.max(
            16,
            Math.min(
                drawerOpener.getBoundingClientRect().left,
                innerWidth - width - 16,
            ),
        );
        attachedDrawerStage.style.setProperty(
            '--drawer-panel-left',
            `${left}px`,
        );
    }
}
function attachDrawer(attachment) {
    if (!attachedDrawerStage) {
        attachedDrawerStage = document.createElement('div');
        attachedDrawerStage.className = 'sidebar-drawer-stage';
        attachedDrawerStage.dataset.placement = attachment.placement;
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-drawer-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        backdrop.addEventListener('click', () => closeCorporateDrawer());
        attachedDrawerStage.append(backdrop);
        document.body.append(attachedDrawerStage);
        attachedDrawerInertRoot = document.querySelector(
            attachment.placement === 'top' ? '.page-scroll' : '.workspace',
        );
        if (attachedDrawerInertRoot) {
            attachedDrawerInertBefore = attachedDrawerInertRoot.inert;
            attachedDrawerInertRoot.inert = true;
        }
        attachedDrawerObserver = new ResizeObserver(positionAttachedDrawer);
        attachedDrawerObserver.observe(attachment.anchor);
    }
    attachedDrawerStage.dataset.mode = pageOptions.drawerStyle;
    attachedDrawerStage.append(corporateDrawer);
    corporateDrawer.classList.add('sidebar-attached-drawer');
    corporateDrawer.setAttribute('aria-modal', 'false');
    document.body.dataset.attachedDrawer = attachment.placement;
    drawerSide = attachment.placement;
    positionAttachedDrawer();
}

let drawerToken = 0;
let drawerClosing;
function corporateCompact() {
    return (
        theme === 'corporate' &&
        matchMedia('(max-width: 1024px), (max-height: 480px)').matches
    );
}
function dismissCorporateDrawer() {
    drawerToken++;
    if (!corporateDrawer) return;
    cancelSurfaceAnimation(corporateDrawer);
    if (corporateDrawer.open) corporateDrawer.close();
    removeAttachedDrawer();
    drawerOpener?.setAttribute('aria-expanded', 'false');
    drawerOpener = null;
    drawerGroup = null;
    document
        .querySelectorAll('[data-open-drawer], [data-open-nav-group]')
        .forEach((button) => button.setAttribute('aria-expanded', 'false'));
    drawerClosing = null;
}
function drawerMotionKind() {
    return attachedDrawerStage?.dataset.mode === 'floating'
        ? 'drawer-floating'
        : `drawer-${drawerSide}`;
}
function closeCorporateDrawer(restoreFocus = true) {
    if (!corporateDrawer?.open) return Promise.resolve(true);
    if (drawerClosing) return drawerClosing;
    const token = ++drawerToken;
    const finish = () => {
        if (token !== drawerToken) return false;
        const opener = drawerOpener;
        dismissCorporateDrawer();
        if (restoreFocus && opener?.isConnected)
            opener.focus({ preventScroll: true });
        return true;
    };
    if (!surfaceMotionEnabled()) return Promise.resolve(finish());
    drawerClosing = animateSurface(
        corporateDrawer,
        false,
        drawerMotionKind(),
    ).then((done) => done && finish());
    return drawerClosing;
}
function openCorporateDrawer(side, opener, groupId = null, refresh = false) {
    if (groupId ? !navigationGroups[groupId] : !corporateCompact()) return;
    if (
        !refresh &&
        groupId &&
        corporateDrawer?.open &&
        drawerGroup === groupId &&
        drawerOpener === opener &&
        !drawerClosing
    ) {
        closeCorporateDrawer();
        return;
    }
    const subgroupStates =
        refresh && corporateDrawer
            ? new Map(
                  [...corporateDrawer.querySelectorAll('.drawer-subgroup')].map(
                      (group) => [group.dataset.navSubgroup, group.open],
                  ),
              )
            : null;
    const reuseAttached =
        !refresh &&
        !!attachedDrawerStage &&
        corporateDrawer?.open &&
        !drawerClosing;
    dismissContactPopover();
    drawerToken++;
    drawerClosing = null;
    const trigger = opener?.closest('.corporate-drawer')
        ? drawerOpener
        : opener;
    drawerOpener?.setAttribute('aria-expanded', 'false');
    drawerOpener = trigger;
    drawerSide = side;
    drawerGroup = groupId;
    if (!corporateDrawer) {
        corporateDrawer = document.createElement('dialog');
        corporateDrawer.id = 'corporate-mobile-drawer';
        corporateDrawer.setAttribute(
            'aria-labelledby',
            'corporate-drawer-title',
        );
        corporateDrawer.setAttribute('closedby', 'none');
        corporateDrawer.addEventListener('cancel', (event) => {
            event.preventDefault();
            closeCorporateDrawer();
        });
        corporateDrawer.addEventListener('click', (event) => {
            if (event.target !== corporateDrawer) return;
            const box = corporateDrawer.getBoundingClientRect();
            if (
                event.clientX < box.left ||
                event.clientX > box.right ||
                event.clientY < box.top ||
                event.clientY > box.bottom
            )
                closeCorporateDrawer();
        });
        document.body.append(corporateDrawer);
    }
    const navigationAttachment = groupId ? drawerAttachment(trigger) : null;
    const attachment =
        pageOptions.drawerStyle === 'overlay' ? null : navigationAttachment;
    drawerSide = attachment?.placement || side;
    corporateDrawer.className = `corporate-drawer drawer-${drawerSide}`;
    const content = groupId
        ? `${
              corporateCompact()
                  ? '<button type="button" class="text-button drawer-back" data-back-drawer>← Main navigation</button>'
                  : ''
          }${navigationGroupContent(groupId)}`
        : side === 'left'
        ? navigation()
        : `<nav class="drawer-links" aria-label="Personal navigation">${personalMenuContent()}<hr><button type="button" data-action="notifications">${ico(
              'bell',
          )}Notifications <span class="badge">${
              notifications.filter((item) => !item[3]).length
          }</span></button></nav><div class="field drawer-language"><label for="drawer-language">Region & language</label><select id="drawer-language">${languages
              .map(
                  ([id, flag, region, name]) =>
                      `<option value="${id}" ${
                          selectedLanguage === id ? 'selected' : ''
                      }>${region} | ${name}</option>`,
              )
              .join(
                  '',
              )}</select><small id="drawer-language-status" role="status"></small></div>`;
    corporateDrawer.innerHTML = `<div class="drawer-heading"><h2 id="corporate-drawer-title">${
        groupId
            ? navigationGroups[groupId].label
            : side === 'left'
            ? 'Navigation'
            : 'Your account'
    }</h2><button type="button" class="icon-button" data-close-drawer aria-label="Close drawer">×</button></div><div class="drawer-content">${content}</div>`;
    if (subgroupStates)
        corporateDrawer
            .querySelectorAll('.drawer-subgroup')
            .forEach((group) => {
                if (subgroupStates.has(group.dataset.navSubgroup))
                    group.open = subgroupStates.get(group.dataset.navSubgroup);
            });
    enhanceSelects(corporateDrawer);
    if (attachment) {
        if (corporateDrawer.matches(':modal')) corporateDrawer.close();
        attachDrawer(attachment);
        if (!corporateDrawer.open) corporateDrawer.show();
    } else {
        if (attachedDrawerStage) {
            if (corporateDrawer.open) corporateDrawer.close();
            removeAttachedDrawer();
        }
        corporateDrawer.setAttribute('aria-modal', 'true');
        if (!corporateDrawer.open) corporateDrawer.showModal();
    }
    trigger?.setAttribute('aria-expanded', 'true');
    corporateDrawer
        .querySelector('[data-close-drawer]')
        .focus({ preventScroll: true });
    if (attachment && reuseAttached) cancelSurfaceAnimation(corporateDrawer);
    else
        animateSurface(corporateDrawer, true, drawerMotionKind()).then(
            (done) => {
                if (done) cancelSurfaceAnimation(corporateDrawer);
            },
        );
}
window.addEventListener('resize', () => {
    if (attachedDrawerStage) positionAttachedDrawer();
    if (corporateDrawer?.open && !drawerGroup && !corporateCompact())
        dismissCorporateDrawer();
});
document.addEventListener(
    'keydown',
    (event) => {
        if (event.key === 'Escape' && corporateDrawer?.open) {
            event.preventDefault();
            event.stopImmediatePropagation();
            closeCorporateDrawer();
        }
    },
    true,
);
document.addEventListener('change', (event) => {
    if (event.target.id !== 'drawer-language') return;
    selectedLanguage = event.target.value;
    const language = languages.find((item) => item[0] === selectedLanguage);
    document.querySelectorAll('.language-trigger').forEach((trigger) => {
        trigger.querySelector('span').textContent = language[3];
        trigger.querySelector('img').src = language[1];
    });
    document.querySelectorAll('button[data-language]').forEach((button) => {
        const active = button.dataset.language === selectedLanguage;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', String(active));
        button.querySelector('.language-check').textContent = active ? '✓' : '';
    });
    const settingsLanguage = document.querySelector('#account-language option');
    if (settingsLanguage) {
        settingsLanguage.textContent = `${language[2]} | ${language[3]}`;
        settingsLanguage.parentElement.dispatchEvent(
            new Event('change', { bubbles: true }),
        );
    }
    document.getElementById(
        'drawer-language-status',
    ).textContent = `${language[3]} selected`;
});

function openModal(title, content) {
    const dialog = document.getElementById('modal');
    modalTransition++;
    if (!dialog.open) modalOpener = document.activeElement;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    enhanceSelects(dialog);
    dialog.setAttribute('closedby', 'none');
    if (!dialog.open) dialog.showModal();
    animateSurface(dialog, true, 'modal').then((done) => {
        if (done) cancelSurfaceAnimation(dialog);
    });
}
function closeModal() {
    const dialog = document.getElementById('modal');
    if (!dialog.open) return Promise.resolve(true);
    const token = ++modalTransition;
    const finish = () => {
        if (token !== modalTransition || !dialog.open) return false;
        dialog.close();
        cancelSurfaceAnimation(dialog);
        if (modalOpener?.isConnected)
            modalOpener.focus({ preventScroll: true });
        return true;
    };
    if (!surfaceMotionEnabled()) {
        cancelSurfaceAnimation(dialog);
        return Promise.resolve(finish());
    }
    return animateSurface(dialog, false, 'modal').then(
        (done) => done && finish(),
    );
}

function info(title, text) {
    openModal(
        title,
        `
    <p class="muted">${text}</p>
    <div class="notice">Interactive reference only. No data is sent to a server.</div>
    <div class="dialog-actions">
      <button type="button" class="btn primary" data-close>Got It</button>
    </div>`,
    );
}

/* =========================
   ACTIONS
   ========================= */

function handleAction(action, button) {
    if (action === 'partner-info' || action === 'manager') {
        const partner = action === 'partner-info';
        const contact = partner
            ? {
                  name: 'tester testerLastName',
                  email: 'test@1ci.app',
                  phone: '+1 202 555 0148',
              }
            : { name: 'Nina Sitkina', email: 'nina.sitkina@1ci.com' };
        openContactPopover(
            partner ? 'Your 1Ci Partner' : 'Sales Support Manager',
            `
            <div class="contact-dialog-heading"><div class="avatar large">${
                partner ? 'TP' : 'NS'
            }</div><div><h3>${esc(contact.name)}</h3><span class="muted">${
                partner
                    ? 'Connected partner · ID 6363'
                    : 'Your personal contact'
            }</span></div></div>
            <dl class="contact-details"><div><dt>Name</dt><dd>${esc(
                contact.name,
            )}</dd></div><div><dt>Email</dt><dd><a href="mailto:${
                contact.email
            }">${esc(contact.email)}</a></dd></div>${
                partner
                    ? `<div><dt>Phone</dt><dd><a href="tel:+12025550148">${esc(
                          contact.phone,
                      )}</a></dd></div>`
                    : ''
            }</dl>
            `,
            button,
        );
        return;
    }
    if (action === 'toggle-sidebar') {
        sidebarCollapsed = !sidebarCollapsed;
        document.body.dataset.sidebarCollapsed = String(sidebarCollapsed);
        button.setAttribute('aria-expanded', String(!sidebarCollapsed));
        const label = sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
        button.setAttribute('aria-label', label);
        button.title = label;
        return;
    }
    if (action === 'language-dialog') {
        openModal(
            'Region & language',
            `<p class="muted">Choose your preferred regional experience.</p><div class="language-cards">${languageOptions(
                'cards',
            )}</div><p class="muted mt">This reference previews selection; sample page content remains in English.</p>`,
        );
        return;
    }
    if (action === 'components' || action === 'versions') {
        const product = distributives[Number(button.dataset.product)];
        openModal(
            action === 'components'
                ? `${product.name} · Components`
                : `${product.name} · Other versions`,
            action === 'components'
                ? `<div class="list-row"><div class="row-content"><strong>Application ${product.version}</strong><small class="muted">Installation package · ZIP</small></div><button class="btn primary small" data-action="sample-download">Download</button></div><div class="list-row"><div class="row-content"><strong>Documentation</strong><small class="muted">Setup and upgrade guide · PDF</small></div><button class="btn small" data-action="sample-download">Download</button></div>`
                : `<p class="muted">Available versions for this product</p><div class="list-row"><strong>${
                      product.version
                  }</strong><span class="badge">Latest</span></div>${(product.upgrade
                      ? product.upgrade.split(', ')
                      : ['1.3.16.20']
                  )
                      .map(
                          (version) =>
                              `<div class="list-row"><strong>${esc(
                                  version,
                              )}</strong><button class="btn small" data-action="sample-download">View package</button></div>`,
                      )
                      .join('')}`,
        );
        return;
    }
    if (action === 'sample-download') {
        toast('Demo package selected. No file is downloaded.');
        return;
    }
    if (action === 'faq') {
        info(
            'Frequently Asked Questions',
            'Find downloads under Distributives. Manage your partner connection through the personal menu → Partnership.',
        );
        return;
    }

    if (action === 'toggle-password') {
        const input = document.getElementById('login-password');
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        button.setAttribute(
            'aria-label',
            visible ? 'Hide password' : 'Show password',
        );
        button.setAttribute('aria-pressed', String(visible));
        return;
    }

    if (action === 'edit-contacts') {
        openModal(
            'Edit Contact Information',
            `
      <form id="contacts-form" class="dialog-form">
        <div class="form-grid">
          ${[
              ['first', 'First name', true],
              ['last', 'Last name', true],
              ['country', 'Country', true],
              ['phone', 'Phone', false],
              ['skype', 'Skype ID', false],
              ['position', 'Job position', false],
          ]
              .map(
                  ([key, label, required]) => `
            <div class="field">
              <label for="edit-${key}">${label}${required ? ' *' : ''}</label>
              <input id="edit-${key}" name="${key}" value="${esc(profile[key])}"
                ${required ? 'required' : ''} ${
                    key === 'phone' ? 'type="tel"' : ''
                }>
            </div>`,
              )
              .join('')}
        </div>
        <small class="muted">Changes remain until you reload or open another concept.</small>
        <div class="dialog-actions">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn primary">Save Changes</button>
        </div>
      </form>`,
        );
        return;
    }

    if (['forgot', 'register', 'email'].includes(action)) {
        const title = {
            forgot: 'Reset Your Password',
            register: 'Create an Account',
            email: 'Request Email Change',
        }[action];

        openModal(
            title,
            `
      <form id="demo-form" class="dialog-form">
        <p class="muted">Enter your email address. No email is sent in this prototype.</p>
        <div class="field">
          <label for="request-email">Email address</label>
          <input id="request-email" type="email" autocomplete="email"
            placeholder="name@company.com" required>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn primary">Continue</button>
        </div>
      </form>`,
        );
        return;
    }

    if (action === 'support') {
        openModal(
            'Submit a Request',
            `
      <form id="demo-form" class="dialog-form">
        <div class="field">
          <label for="request-subject">Subject</label>
          <input id="request-subject" placeholder="Briefly describe your question" required>
        </div>
        <div class="field">
          <label for="request-text">Description</label>
          <textarea id="request-text" rows="4" placeholder="Tell us more" required></textarea>
        </div>
        <small class="muted">Demo form. Your request will not be submitted.</small>
        <div class="dialog-actions">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn primary">Submit Request</button>
        </div>
      </form>`,
        );
        return;
    }

    if (action === 'password') {
        openModal(
            'Change Password',
            `
      <form id="password-form" class="dialog-form">
        <div class="field">
          <label for="current-password">Current password</label>
          <input id="current-password" type="password"
            autocomplete="current-password" required>
        </div>
        <div class="field">
          <label for="new-password">New password</label>
          <input id="new-password" type="password"
            autocomplete="new-password" minlength="8" required>
        </div>
        <div class="field">
          <label for="repeat-password">Confirm new password</label>
          <input id="repeat-password" type="password"
            autocomplete="new-password" minlength="8" required>
        </div>
        <small class="muted">Demo validation: at least 8 characters. Passwords are not saved.</small>
        <div class="dialog-actions">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn primary">Change Password</button>
        </div>
      </form>`,
        );
        return;
    }

    if (['billing', 'delivery'].includes(action)) {
        const address = addresses[action] || {
            country: '',
            city: '',
            street: '',
            postcode: '',
        };

        openModal(
            action === 'billing' ? 'Billing Address' : 'Delivery Address',
            `
      <form id="address-form" class="dialog-form" data-address-type="${action}">
        <div class="form-grid">
          <div class="field">
            <label for="address-country">Country</label>
            <input id="address-country" name="country" value="${esc(
                address.country,
            )}"
              autocomplete="country-name" required>
          </div>
          <div class="field">
            <label for="address-city">City</label>
            <input id="address-city" name="city" value="${esc(address.city)}"
              autocomplete="address-level2" required>
          </div>
        </div>
        <div class="field">
          <label for="address-street">Street address</label>
          <input id="address-street" name="street" value="${esc(
              address.street,
          )}"
            autocomplete="street-address" required>
        </div>
        <div class="field">
          <label for="address-postcode">Postal code</label>
          <input id="address-postcode" name="postcode" value="${esc(
              address.postcode,
          )}"
            autocomplete="postal-code" required>
        </div>
        <small class="muted">The address remains until you reload or open another concept.</small>
        <div class="dialog-actions">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn primary">Save Address</button>
        </div>
      </form>`,
        );
        return;
    }

    if (action === 'notifications') {
        openModal(
            'Notifications',
            `
      <div>${notificationRows()}</div>
      <div class="dialog-actions">
        <button type="button" class="btn" data-close>Close</button>
        <button type="button" class="btn primary" data-go="notifications">View all notifications ${ico(
            'arrow',
        )}</button>
      </div>`,
        );
        return;
    }

    if (['delete', 'unlink'].includes(action)) {
        openModal(
            action === 'delete'
                ? 'Delete Your Account?'
                : 'Unlink Partner Account?',
            `
      <p class="muted">${
          action === 'delete'
              ? 'Deleting an account is a critical action and requires explicit confirmation.'
              : 'This action would disconnect your account from the current partner company.'
      }</p>
      <div class="notice">This operation is not performed in the prototype.</div>
      <div class="dialog-actions">
        <button type="button" class="btn" data-close>Cancel</button>
        <button type="button" class="btn danger" data-demo-confirm>Confirm in Demo</button>
      </div>`,
        );
        return;
    }

    const messages = {
        'store-apps': [
            'Apps & Platform',
            'Browse 1Ci applications and platform products.',
        ],
        'store-nfr': [
            'Not For Resale',
            'Not-for-resale licenses for partner use and demonstrations.',
        ],
        'store-fee': [
            'Partner Fee',
            'Partner program fees and membership options.',
        ],
        'store-smua': [
            'SMUA',
            'Software maintenance and update subscriptions.',
        ],
        orders: [
            'My Orders',
            'Your product orders and their status appear here.',
        ],
        licenses: [
            'Products and Licenses',
            'Your purchased products and license information appear here.',
        ],
        store: [
            'Store',
            'The entry point for browsing products and placing orders. Store screens are outside this reference.',
        ],
        purchases: [
            'My Purchases',
            'The entry point for orders, licenses, and downloads. Detailed purchase screens are outside this reference.',
        ],
        requests: [
            'My Requests',
            'Your submitted support requests appear here.',
        ],
        'drive-policies': [
            '1C:Drive Editions Support Policy',
            'Support for German, Polish, Turkish, and other non-English editions is covered by the relevant 1C:Drive edition support policy.',
        ],
        certification: [
            'Certification Attempts',
            'This action represents navigation to available certification attempts.',
        ],
        attempts: [
            'Get More Attempts',
            'This action represents navigation to additional certification attempts.',
        ],
        academy: [
            '1Ci Academy',
            'This action represents navigation to training and certification preparation.',
        ],
        knowledge: [
            'Product Knowledge Base',
            'This action represents navigation to product documentation.',
        ],
        demo: [
            'Demo Applications',
            'This action represents navigation to demonstration applications.',
        ],
        policies: [
            'Support Policies',
            'This action represents navigation to support service terms and guidelines.',
        ],
        guide: [
            'Purchase Guide',
            'A download entry point for the purchase guide. No PDF is included in this prototype.',
        ],
        news: [
            'News & Updates',
            'Sample content based on the supplied screenshots. Release announcements and dates have not been independently verified.',
        ],
        privacy: [
            'Privacy Policy',
            'The production site should display the approved privacy policy here.',
        ],
        cookies: [
            'Cookie Policy',
            'The production site should display the approved cookie policy and applicable preferences here.',
        ],
        terms: [
            'Terms of Use',
            'The production site should display the approved terms of use here.',
        ],
    };

    if (messages[action]) info(...messages[action]);
}

/* =========================
   EVENT HANDLERS
   ========================= */

document.addEventListener(
    'click',
    (event) => {
        const summary = event.target.closest('summary');
        const popup = summary?.parentElement;
        if (!popup?.matches('.reference-popup')) return;
        event.preventDefault();
        if (attachedDrawerStage && !attachedDrawerStage.contains(summary))
            closeCorporateDrawer(false);
        const intendedOpen = popupTransitions.get(popup)?.opening ?? popup.open;
        setPopup(popup, !intendedOpen);
    },
    true,
);

document.addEventListener(
    'keydown',
    (event) => {
        if (
            !['Enter', ' '].includes(event.key) ||
            !event.target.matches(
                'button[data-action="manager"], button[data-action="partner-info"]',
            )
        )
            return;
        event.preventDefault();
        if (!event.repeat) event.target.click();
    },
    true,
);

document.addEventListener('click', async (event) => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (
        attachedDrawerStage &&
        !attachedDrawerStage.contains(target) &&
        !target.hasAttribute('data-open-nav-group')
    ) {
        if (!(await closeCorporateDrawer(false))) return;
    }
    const popup = target.closest('.reference-popup[open]');
    if (popup && target.closest('.popup-panel')) {
        event.preventDefault();
        if (!(await setPopup(popup, false))) return;
    }

    if (target.hasAttribute('data-open-nav-group')) {
        openCorporateDrawer('left', target, target.dataset.openNavGroup);
        return;
    }
    if (target.hasAttribute('data-back-drawer')) {
        openCorporateDrawer('left', drawerOpener);
        return;
    }
    if (target.hasAttribute('data-open-drawer')) {
        openCorporateDrawer(target.dataset.openDrawer, target);
        return;
    }
    if (target.hasAttribute('data-close-drawer')) {
        closeCorporateDrawer();
        return;
    }
    if (target.closest('.corporate-drawer') && target.matches('a[href]')) {
        closeCorporateDrawer(false);
        return;
    }
    if (
        target.closest('.corporate-drawer') &&
        (target.hasAttribute('data-go') || target.hasAttribute('data-action'))
    ) {
        event.preventDefault();
        if (!(await closeCorporateDrawer(false))) return;
    }
    if (target.hasAttribute('data-close-contact')) {
        closeContactPopover(true);
        return;
    }
    if (target.hasAttribute('data-skip-content')) {
        event.preventDefault();
        if (embedded) focusPageContent();
        else
            document
                .getElementById('reference-frame')
                ?.contentWindow.postMessage({ type: 'reference-focus' }, '*');
        return;
    }
    if (target.hasAttribute('data-accessibility')) {
        const mode = target.dataset.accessibility;
        if (mode !== 'vision') return;
        visionMode = !visionMode;
        saveAccessibility();
        viewerAnimation?.cancel();
        viewerControlsAnimation?.cancel();
        viewerAnimation = null;
        viewerControlsAnimation = null;
        document.getElementById('viewer').style.overflow = '';
        render();
        document
            .querySelector(`button[data-accessibility="${mode}"]`)
            ?.focus({ preventScroll: true });
        announceAccessibility(
            `Enhanced visibility ${visionMode ? 'enabled' : 'disabled'}.`,
        );
        return;
    }
    if (target.hasAttribute('data-viewer-toggle')) {
        toggleViewer();
        return;
    }
    if (target.hasAttribute('data-language')) {
        selectedLanguage = target.dataset.language;
        document
            .querySelectorAll('.reference-popup[open]')
            .forEach((popup) => setPopup(popup, false));
        const modal = document.getElementById('modal');
        if (modal.open) closeModal();
        render();
        toast(
            `${
                languages.find(
                    (language) => language[0] === selectedLanguage,
                )[3]
            } selected. Sample content remains in English.`,
        );
        return;
    }
    if (target.hasAttribute('data-connect')) {
        partnerLinked = true;
        render();
        toast('Partner connected in this demo.');
        return;
    }
    if (target.hasAttribute('data-page-setting')) {
        const key = target.dataset.pageSetting;
        const value = target.dataset.value;
        if (!pageSettingChoices[key]?.includes(value)) return;
        if (key === 'partnerState') partnerLinked = value === 'linked';
        else pageOptions[key] = value;
        if (embedded && key === 'notificationFilter') {
            syncNotificationFilters();
            window.parent.postMessage(
                { type: 'reference-page', page, state: viewState() },
                '*',
            );
            return;
        }
        if (embedded && key === 'downloadLayout') {
            syncDownloadLayout();
            const url = new URL(location.href);
            url.searchParams.set('downloadLayout', value);
            history.replaceState(null, '', url);
            window.parent.postMessage(
                { type: 'reference-page', page, state: viewState() },
                '*',
            );
            return;
        }
        render();
        document
            .querySelector(
                `[data-page-setting="${key}"][data-value="${value}"]`,
            )
            ?.focus({ preventScroll: true });
        return;
    }
    if (target.hasAttribute('data-go')) {
        if (target.closest('#modal') && !(await closeModal())) return;
        if (target.dataset.notificationFilter === 'unread') {
            pageOptions.notificationFilter = 'unread';
            notificationFrom = '';
            notificationTo = '';
            const url = new URL(location.href);
            url.searchParams.set('notificationFilter', 'unread');
            url.searchParams.delete('notificationFrom');
            url.searchParams.delete('notificationTo');
            history.replaceState(null, '', url);
        }
        go(target.dataset.go);
        return;
    }

    for (const [attribute, values] of [
        ['theme', availableThemes],
        ['palette', Object.keys(paletteNames)],
        ['device', ['mobile', 'tablet', 'desktop']],
        ['position', ['top', 'center', 'between']],
    ]) {
        if (
            target.hasAttribute(`data-${attribute}`) &&
            values.includes(target.dataset[attribute])
        ) {
            const value = target.dataset[attribute];
            if (attribute === 'theme') theme = value;
            if (attribute === 'palette') palette = value;
            if (attribute === 'device') device = value;
            if (attribute === 'position') loginPosition = value;
            render();
            document
                .querySelector(`[data-${attribute}="${value}"]`)
                ?.focus({ preventScroll: true });
            return;
        }
    }
    if (target.hasAttribute('data-layout')) {
        loginLayout = target.dataset.layout;
        render();
        const selected = document.querySelector(
            `[data-layout="${loginLayout}"]`,
        );
        if (selected) selected.focus({ preventScroll: true });
        return;
    }

    if (target.hasAttribute('data-close')) {
        closeModal();
        return;
    }

    if (target.hasAttribute('data-demo-confirm')) {
        const disconnect =
            document.getElementById('modal-title').textContent ===
            'Unlink Partner Account?';
        closeModal();
        if (disconnect) {
            partnerLinked = false;
            render();
        }
        toast(
            disconnect
                ? 'Partner disconnected in this demo.'
                : 'Demo confirmation completed. No account changes were made.',
        );
        return;
    }

    if (target.hasAttribute('data-action')) {
        event.preventDefault();
        handleAction(target.dataset.action, target);
    }
});

function readRequiredValues(form, keys) {
    const data = new FormData(form);
    const values = {};

    for (const key of keys) {
        const input = form.elements.namedItem(key);
        values[key] = String(data.get(key) || '').trim();

        if (!values[key]) {
            input.setCustomValidity('Please enter a value.');
            input.reportValidity();
            return null;
        }
    }

    return values;
}

document.addEventListener('submit', (event) => {
    const form = event.target;
    if (
        ![
            'login-form',
            'contacts-form',
            'address-form',
            'password-form',
            'demo-form',
        ].includes(form.id)
    )
        return;

    event.preventDefault();

    if (form.id === 'login-form') {
        form.reset();
        go('dashboard');
        toast('Demo sign-in completed. No credentials were sent.');
        return;
    }

    if (form.id === 'contacts-form') {
        if (!readRequiredValues(form, ['first', 'last', 'country'])) return;

        const data = new FormData(form);
        Object.keys(profile).forEach((key) => {
            profile[key] = String(data.get(key) || '').trim();
        });

        closeModal();
        render();
        toast('Contact information updated in the prototype.');
        return;
    }

    if (form.id === 'address-form') {
        const values = readRequiredValues(form, [
            'country',
            'city',
            'street',
            'postcode',
        ]);
        if (!values) return;

        addresses[form.dataset.addressType] = values;
        closeModal();
        render();
        toast('Address saved in the prototype only.');
        return;
    }

    if (form.id === 'password-form') {
        const password = form.querySelector('#new-password');
        const repeat = form.querySelector('#repeat-password');

        if (password.value !== repeat.value) {
            repeat.setCustomValidity('Passwords do not match.');
            repeat.reportValidity();
            return;
        }

        form.reset();
        closeModal();
        toast('Demo completed. Your password was not changed.');
        return;
    }

    closeModal();
    toast('Demo completed. No information was sent or saved.');
});

document.addEventListener('input', (event) => {
    const input = event.target;

    if (typeof input.setCustomValidity === 'function') {
        input.setCustomValidity('');
    }

    if (input.id === 'new-password') {
        const repeat = document.getElementById('repeat-password');
        if (repeat) repeat.setCustomValidity('');
    }
});

document.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.hasAttribute('data-setting')) return;

    if (input.dataset.setting === 'newsletter') {
        settings.newsletter = input.checked;
    }
    if (input.dataset.setting === 'type') {
        settings.type = input.value;
    }

    toast('Preference updated in the prototype only.');
});

const modal = document.getElementById('modal');

modal.addEventListener('click', (event) => {
    if (event.target !== modal) return;

    const rect = modal.getBoundingClientRect();
    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    )
        closeModal();
});

document.addEventListener(
    'keydown',
    (event) => {
        if (event.key === 'Escape' && modal.open) {
            event.preventDefault();
            event.stopImmediatePropagation();
            closeModal();
        }
    },
    true,
);

modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
});

modal.addEventListener('close', () => {
    if (!modal.open) cancelSurfaceAnimation(modal);
    if (!modal.open) document.getElementById('modal-content').innerHTML = '';
});

/* Shared navigation popups and additional reference screens. */
function personalMenuContent() {
    const current = (id) => (page === id ? 'aria-current="page"' : '');
    return `        <div class="popup-identity"><strong>${fullName()}</strong><small class="muted">eego@1ci.com</small></div>
        <button type="button" data-go="account" ${current('account')}>${ico(
            'user',
        )}Account</button>
        <button type="button" data-go="partnership" ${current(
            'partnership',
        )}>${ico('link')}Partnership</button>
        <button type="button" data-go="dashboard" ${current('dashboard')}>${ico(
            'award',
        )}My Certificates</button><hr>
        <button type="button" data-action="faq">${ico('book')}FAQ</button><hr>
        <button type="button" data-action="privacy">${ico(
            'shield',
        )}Privacy Policy</button><hr>
        <button type="button" data-go="login">${ico('exit')}Log Out</button>
    `;
}
function personalMenu(location = 'header') {
    const personalPageActive = ['account', 'partnership', 'dashboard'].includes(
        page,
    );
    const sidebar = location === 'sidebar';
    const trigger = sidebar
        ? `<summary class="sidebar-user flex" aria-label="Open personal menu for ${fullName()}" title="Personal menu"><span class="avatar">${initials()}</span><span class="sidebar-user-details"><strong>${esc(
              profile.first,
          )}</strong><small>Community member</small></span></summary>`
        : `<summary class="avatar" aria-label="Personal menu">${initials()}</summary>`;
    return `<details class="reference-popup personal-popup ${
        sidebar ? 'sidebar-personal-popup' : ''
    }" data-personal-active="${personalPageActive}">${trigger}<nav class="popup-panel" aria-label="${
        sidebar ? 'Sidebar personal navigation' : 'Personal navigation'
    }">
        <div class="popup-menu-content">${personalMenuContent()}</div></nav></details>`;
}
function languageOptions(variant = 'list') {
    return languages
        .map(
            ([id, flag, region, name]) =>
                `<button type="button" class="language-option ${
                    selectedLanguage === id ? 'selected' : ''
                }" data-language="${id}" aria-pressed="${
                    selectedLanguage === id
                }"><img class="language-flag" src="${flag}" alt="" width="21" height="15" aria-hidden="true"><span>${
                    variant === 'cards'
                        ? `<strong>${name}</strong><small>${region}</small>`
                        : `${region} <span class="muted">|</span> ${name}`
                }</span><span class="language-check" aria-hidden="true">${
                    selectedLanguage === id ? '✓' : ''
                }</span></button>`,
        )
        .join('');
}
function languageMenu() {
    const language = languages.find((item) => item[0] === selectedLanguage);
    const name = language[3];
    return `<details class="reference-popup language-popup"><summary class="language-trigger" aria-label="Change region and language"><img class="language-flag" src="${
        language[1]
    }" alt="" width="21" height="15" aria-hidden="true"><span>${esc(
        name,
    )}</span></summary><div class="popup-panel language-panel"><strong class="popup-label">Region & language</strong><div class="${
        theme === 'minimal' ? 'language-cards' : 'language-list'
    }">${languageOptions(theme === 'minimal' ? 'cards' : 'list')}</div>${
        theme === 'studio'
            ? `<button class="text-button mt" data-action="language-dialog">Explore regional experiences ${ico(
                  'arrow',
              )}</button>`
            : ''
    }</div></details>`;
}

const distributives = [
    [
        '1C:Drive. NFR',
        '1.6.8.7',
        '2026-10-21',
        '1.6.5.2, 1.6.7.7',
        '8.3.27.2074',
    ],
    [
        '1C:Drive GE. Sales & Services',
        '1.5.4.12',
        '2024-09-09',
        '',
        '8.3.22.1750',
    ],
    ['1C:Drive GE. Production', '1.5.4.12', '2024-08-14', '', '8.3.22.1750'],
    [
        '1C:Drive PE. Production',
        '1.3.16.21',
        '2022-07-06',
        '',
        '',
        '1C:Drive Polish Edition',
    ],
    ['1C:Drive PE. Sales & Services', '1.3.16.21', '2022-07-06', '', ''],
    [
        '1C:Drive TE. Production',
        '1.6.6.9',
        '2026-09-15',
        '1.6.5.2, 1.6.6.8',
        '8.3.27.2074',
    ],
    [
        '1C:Drive TE. Sales & Services',
        '1.6.6.9',
        '2026-09-16',
        '1.6.5.2, 1.6.6.8',
        '8.3.27.2074',
    ],
    [
        '1C:Drive TE Sales & Services',
        '1.6.6.9',
        '2026-09-16',
        '1.6.5.2, 1.6.6.8',
        '8.3.27.2074',
    ],
    [
        '1C:Drive TE. NFR',
        '1.6.6.9',
        '2026-09-15',
        '1.6.5.2, 1.6.6.8',
        '8.3.27.2074',
    ],
    ['1C:Drive PE. NFR', '1.3.16.21', '2022-07-06', '', ''],
    ['1C:Drive GE. NFR', '1.5.4.12', '2024-08-14', '', '8.3.22.1750'],
    ['1C:Drive CE. NFR', '1.6.1.4', '2026-09-07', '', '8.3.22.1750'],
    ['1C:Drive MX. NFR', '1.5.5.11', '2024-08-05', '', ''],
    ['1C:Drive ID. NFR', '1.6.6.8', '2026-10-05', '1.6.5.2', '8.3.24.1691'],
    [
        '1C:Drive. Sales & Services',
        '1.6.8.7',
        '2026-10-22',
        '1.6.6.8, 1.6.7.7',
        '8.3.27.2074',
    ],
    ['1C:Enterprise Platform', '8.3.27.2074', '2026-10-20', '', ''],
].map(([name, version, date, upgrade, platform, subtitle]) => ({
    name,
    version,
    date,
    upgrade,
    platform,
    subtitle,
}));
const displayDate = (date) => date.split('-').reverse().join('.');
function productCards() {
    return distributives
        .map(
            (
                product,
                index,
            ) => `<article class="card product-card" data-product-card data-search="${esc(
                `${product.name} ${product.version} ${product.platform} ${
                    product.subtitle || ''
                }`.toLowerCase(),
            )}" data-family="${
                product.name.startsWith('1C:Drive') ? 'drive' : 'enterprise'
            }" data-date="${product.date}">
        <div class="product-title"><h2>${product.name}</h2>${
            product.subtitle ? `<p>${product.subtitle}</p>` : ''
        }</div>
        <h3>Latest Version</h3><div class="release-meta"><span><span class="muted">No.</span>${
            product.version
        }</span><span><span class="muted">Release date:</span> ${displayDate(
            product.date,
        )}</span></div>
        ${
            product.upgrade
                ? `<p class="product-detail"><span class="muted">Upgrade possible from versions:</span><br>${product.upgrade}</p>`
                : ''
        }
        ${
            product.platform
                ? `<p class="product-detail"><span class="muted">Recommended 1C:Enterprise version:</span><br>Platform ${product.platform}</p>`
                : ''
        }
        <div class="product-actions"><button type="button" class="btn primary small" data-action="components" data-product="${index}">Go to components</button><button type="button" class="text-button" data-action="versions" data-product="${index}">Other versions</button></div>
    </article>`,
        )
        .join('');
}
const datePeriodStates = new WeakMap();
const calendarShortDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});
const calendarFullDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeZone: 'UTC',
});
const calendarMonth = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});
const calendarDate = (value) => new Date(`${value}T12:00:00Z`);
const calendarIso = (date) => date.toISOString().slice(0, 10);
function calendarAddDays(value, offset) {
    const date = calendarDate(value);
    date.setUTCDate(date.getUTCDate() + offset);
    return calendarIso(date);
}
function datePeriodLabel(from, to) {
    if (!from && !to) return 'All time';
    if (!to) return `From ${calendarShortDate.format(calendarDate(from))}`;
    if (!from) return `Until ${calendarShortDate.format(calendarDate(to))}`;
    if (from === to) return calendarShortDate.format(calendarDate(from));
    if (from > to)
        return `${calendarShortDate.format(
            calendarDate(from),
        )} — ${calendarShortDate.format(calendarDate(to))}`;
    return calendarShortDate.formatRange(calendarDate(from), calendarDate(to));
}
function datePeriodControl(name, fromId, toId) {
    const from = name === 'notifications' ? notificationFrom : releaseFrom;
    const to = name === 'notifications' ? notificationTo : releaseTo;
    return `<div class="field date-period-field"><label id="${name}-period-label" for="${name}-period-trigger">Time period</label><details class="reference-popup date-period-popup" data-from="${fromId}" data-to="${toId}"><summary id="${name}-period-trigger" class="date-period-trigger" role="button" aria-labelledby="${name}-period-label ${name}-period-value" aria-haspopup="dialog" aria-controls="${name}-period-calendar" aria-expanded="false"><span class="date-period-value" id="${name}-period-value">${datePeriodLabel(
        from,
        to,
    )}</span><svg class="icon date-period-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="popup-panel date-period-panel" id="${name}-period-calendar" popover="manual" role="dialog" aria-modal="false" aria-label="Choose time period"></div></details><input type="date" id="${fromId}" value="${from}" hidden aria-hidden="true"><input type="date" id="${toId}" value="${to}" hidden aria-hidden="true"></div>`;
}
function syncDatePeriods() {
    document.querySelectorAll('.date-period-popup').forEach((popup) => {
        const from = document.getElementById(popup.dataset.from).value;
        const to = document.getElementById(popup.dataset.to).value;
        const label = datePeriodLabel(from, to);
        popup.querySelector('.date-period-value').textContent = label;
        popup.querySelector('summary').title = label;
        if (popup.open) positionDatePeriod(popup);
    });
}
function beginDatePeriod(popup) {
    const from = document.getElementById(popup.dataset.from).value;
    const to = document.getElementById(popup.dataset.to).value;
    const focusDate = from || to || notificationToday;
    const date = calendarDate(focusDate);
    datePeriodStates.set(popup, {
        from,
        to,
        month: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)),
        focusDate,
        touched: false,
    });
    renderDatePeriod(popup);
}
function renderDatePeriod(popup, focusTarget = null) {
    const state = datePeriodStates.get(popup);
    if (!state) return;
    const year = state.month.getUTCFullYear(),
        month = state.month.getUTCMonth();
    const first = new Date(Date.UTC(year, month, 1));
    const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const leading = first.getUTCDay();
    const monthPrefix = calendarIso(first).slice(0, 7);
    if (!state.focusDate.startsWith(monthPrefix))
        state.focusDate = `${monthPrefix}-01`;
    const days = [];
    for (let blank = 0; blank < leading; blank++)
        days.push('<span class="calendar-blank" aria-hidden="true"></span>');
    for (let day = 1; day <= length; day++) {
        const value = `${monthPrefix}-${String(day).padStart(2, '0')}`;
        const start = value === state.from,
            end = value === state.to;
        const inRange =
            state.from && state.to && value >= state.from && value <= state.to;
        days.push(
            `<button type="button" class="calendar-day${
                start ? ' is-start' : ''
            }${end ? ' is-end' : ''}${inRange ? ' in-range' : ''}${
                value === notificationToday ? ' is-today' : ''
            }" data-calendar-date="${value}" tabindex="${
                value === state.focusDate ? '0' : '-1'
            }" aria-label="${calendarFullDate.format(
                calendarDate(value),
            )}" aria-pressed="${Boolean(
                start || end || inRange,
            )}">${day}</button>`,
        );
    }
    while (days.length % 7)
        days.push('<span class="calendar-blank" aria-hidden="true"></span>');
    popup.querySelector(
        '.date-period-panel',
    ).innerHTML = `<div class="date-period-content"><div class="calendar-presets"><button type="button" class="text-button" data-calendar-action="week">Last week</button><button type="button" class="text-button" data-calendar-action="month">Last month</button></div><div class="calendar-heading"><strong class="calendar-month-title" aria-live="polite">${calendarMonth.format(
        state.month,
    )}</strong><div class="calendar-navigation"><button type="button" class="icon-button" data-calendar-action="previous" aria-label="Previous month"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><button type="button" class="icon-button" data-calendar-action="next" aria-label="Next month"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></div></div><div class="calendar-weekdays" aria-hidden="true">${[
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
    ]
        .map((day) => `<span>${day}</span>`)
        .join(
            '',
        )}</div><div class="calendar-day-grid" role="group" aria-label="Dates in ${calendarMonth.format(
        state.month,
    )}">${days.join('')}</div><p class="calendar-range-note" role="status">${
        !state.from && !state.to
            ? 'Select a date range'
            : state.from && !state.to && state.touched
            ? 'Choose an end date, or apply a single day.'
            : datePeriodLabel(state.from, state.to)
    }</p><div class="calendar-footer"><button type="button" class="text-button" data-calendar-action="all">All time</button><button type="button" class="btn primary sm date-period-apply" data-calendar-action="apply">Apply</button></div></div>`;
    if (popup.open) positionDatePeriod(popup);
    if (focusTarget)
        popup.querySelector(focusTarget)?.focus({ preventScroll: true });
}
function positionDatePeriod(popup) {
    const panel = popup.querySelector('.date-period-panel');
    if (!popup.open || !panel?.matches(':popover-open')) return;
    const anchor = popup.querySelector('summary').getBoundingClientRect();
    const workspace = document
        .querySelector('.workspace')
        ?.getBoundingClientRect();
    const margin = 12,
        gap = 12;
    const minimumLeft = Math.max(margin, (workspace?.left || 0) + margin);
    const maximumRight = Math.min(
        innerWidth - margin,
        (workspace?.right || innerWidth) - margin,
    );
    panel.style.width = `${Math.min(320, maximumRight - minimumLeft)}px`;
    const width = panel.offsetWidth,
        height = panel.offsetHeight;
    const left = Math.max(
        minimumLeft,
        Math.min(
            anchor.left + anchor.width / 2 - width / 2,
            maximumRight - width,
        ),
    );
    const below = innerHeight - anchor.bottom - gap - margin;
    const above = anchor.top - gap - margin;
    const placeAbove = below < height && above > below;
    const top = Math.max(
        margin,
        Math.min(
            placeAbove ? anchor.top - gap - height : anchor.bottom + gap,
            innerHeight - height - margin,
        ),
    );
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.dataset.placement = placeAbove ? 'above' : 'below';
    const arrow = Math.max(
        18,
        Math.min(anchor.left + anchor.width / 2 - left, width - 18),
    );
    panel.style.setProperty('--date-period-arrow', `${arrow}px`);
    panel.style.transformOrigin = `${arrow}px ${placeAbove ? 'bottom' : 'top'}`;
}
function setupDatePeriods(root) {
    root.querySelectorAll('.date-period-popup').forEach((popup) => {
        root.querySelector(
            `label[for="${popup.querySelector('summary').id}"]`,
        )?.addEventListener('click', () =>
            popup.querySelector('summary').focus(),
        );
        popup.addEventListener('focusout', () =>
            setTimeout(() => {
                if (popup.open && !popup.contains(document.activeElement))
                    setPopup(popup, false);
            }, 0),
        );
        popup
            .querySelector('.date-period-panel')
            .addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (!button) return;
                event.preventDefault();
                event.stopPropagation();
                const state = datePeriodStates.get(popup);
                const value = button.dataset.calendarDate;
                const action = button.dataset.calendarAction;
                if (value) {
                    if (!state.from || state.to) {
                        state.from = value;
                        state.to = '';
                    } else {
                        state.to = value;
                        if (state.to < state.from)
                            [state.from, state.to] = [state.to, state.from];
                    }
                    state.focusDate = value;
                    state.touched = true;
                    renderDatePeriod(popup, `[data-calendar-date="${value}"]`);
                    return;
                }
                if (action === 'apply') {
                    const from = document.getElementById(popup.dataset.from),
                        to = document.getElementById(popup.dataset.to);
                    from.value = state.from;
                    to.value =
                        state.to ||
                        (state.touched && state.from ? state.from : '');
                    to.dispatchEvent(new Event('input', { bubbles: true }));
                    syncDatePeriods();
                    setPopup(popup, false, true);
                    return;
                }
                if (action === 'previous' || action === 'next') {
                    state.month = new Date(
                        Date.UTC(
                            state.month.getUTCFullYear(),
                            state.month.getUTCMonth() +
                                (action === 'previous' ? -1 : 1),
                            1,
                        ),
                    );
                } else {
                    state.touched = true;
                    state.to = action === 'all' ? '' : notificationToday;
                    state.from =
                        action === 'week'
                            ? calendarAddDays(notificationToday, -6)
                            : action === 'month'
                            ? calendarAddDays(notificationToday, -29)
                            : '';
                    state.focusDate = state.from || notificationToday;
                    const date = calendarDate(state.focusDate);
                    state.month = new Date(
                        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
                    );
                }
                renderDatePeriod(popup, `[data-calendar-action="${action}"]`);
            });
        popup
            .querySelector('.date-period-panel')
            .addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    setPopup(popup, false, true);
                    return;
                }
                if (!event.target.matches('.calendar-day')) return;
                const state = datePeriodStates.get(popup);
                let value = event.target.dataset.calendarDate;
                const deltas = {
                    ArrowLeft: -1,
                    ArrowRight: 1,
                    ArrowUp: -7,
                    ArrowDown: 7,
                };
                if (Object.hasOwn(deltas, event.key))
                    value = calendarAddDays(value, deltas[event.key]);
                else if (event.key === 'Home' || event.key === 'End')
                    value = calendarAddDays(
                        value,
                        (event.key === 'Home' ? 0 : 6) -
                            calendarDate(value).getUTCDay(),
                    );
                else if (event.key === 'PageUp' || event.key === 'PageDown') {
                    const date = calendarDate(value);
                    date.setUTCDate(1);
                    date.setUTCMonth(
                        date.getUTCMonth() + (event.key === 'PageUp' ? -1 : 1),
                    );
                    value = calendarIso(date);
                } else return;
                event.preventDefault();
                event.stopPropagation();
                state.focusDate = value;
                const date = calendarDate(value);
                state.month = new Date(
                    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
                );
                renderDatePeriod(popup, `[data-calendar-date="${value}"]`);
            });
    });
    syncDatePeriods();
}
document.addEventListener('transitionend', (event) => {
    if (event.target.matches('.sidebar'))
        document
            .querySelectorAll('.date-period-popup[open]')
            .forEach(positionDatePeriod);
});
window.addEventListener('resize', () =>
    document
        .querySelectorAll('.date-period-popup[open]')
        .forEach(positionDatePeriod),
);
document.addEventListener(
    'scroll',
    () =>
        document
            .querySelectorAll('.date-period-popup[open]')
            .forEach(positionDatePeriod),
    true,
);

function filterResetControl(name) {
    const tooltipId = `${name}-reset-tooltip`;
    return `<span class="filter-reset-wrap"><button type="reset" class="icon-button filter-reset" aria-label="Reset filters" aria-describedby="${tooltipId}">${ico(
        'reload',
    )}</button><span class="filter-reset-tooltip" id="${tooltipId}" role="tooltip">Restore default filters</span></span>`;
}
function setupFilterResetTooltips(root) {
    root.querySelectorAll('.filter-reset-wrap').forEach((wrap) => {
        const button = wrap.querySelector('button');
        const clearDismissed = () => delete wrap.dataset.tooltipDismissed;
        wrap.addEventListener('mouseenter', clearDismissed);
        button.addEventListener('focus', clearDismissed);
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                wrap.dataset.tooltipDismissed = 'true';
            }
        });
    });
}

function distributivesPage() {
    return shell(`<div class="page-heading"><div><h1>Distributives</h1><p>Product releases, installation packages, and components.</p></div></div>
        <section class="downloads-banner"><div><h2>Distributives</h2><p>1Ci products and the 1C:Enterprise development platform are downloaded separately from each other.</p></div><div><h2>${ico(
            'support',
        )} Questions?</h2><p>In case of arising questions please contact us at <a href="mailto:partner@1ci.com">partner@1ci.com</a>.</p></div></section>
        <form class="download-filters" onsubmit="return false"><div class="filter-fields download-filter-fields"><div class="field search-field"><label for="product-search">Product / Version / Distributive / Component</label><input type="search" id="product-search" placeholder="Search product"></div><div class="period-filter">${datePeriodControl(
            'distributives',
            'release-from',
            'release-to',
        )}</div><div class="field"><label for="product-family">Product family</label><select id="product-family"><option value="drive">1C:Drive</option><option value="enterprise">1C:Enterprise</option><option value="all">All products</option></select></div></div>${filterResetControl(
            'distributives',
        )}</form>
        <div class="download-results-bar"><p class="muted result-count" id="product-count" role="status"></p><div class="switch-group download-view-toggle" role="group" aria-label="Distributives view">${[
            ['list', 'List'],
            ['grid', 'Cards'],
        ]
            .map(
                ([value, label]) =>
                    `<button type="button" data-page-setting="downloadLayout" data-value="${value}" aria-controls="distributive-results" aria-pressed="${
                        pageOptions.downloadLayout === value
                    }" class="${
                        pageOptions.downloadLayout === value ? 'active' : ''
                    }">${ico(value)}${label}</button>`,
            )
            .join(
                '',
            )}</div></div><div class="product-grid" id="distributive-results">${productCards()}</div><div class="card empty-products" id="empty-products" hidden><h2>No releases found</h2><p class="muted">Try another product name or a wider time period.</p></div>`);
}
function supportPage() {
    const rows = [
        [
            'Bug',
            'As per individual agreement',
            '8 business hours',
            '16 business hours',
            'Best effort',
        ],
        [
            'Feature request',
            'As per individual agreement',
            '16 business hours',
            '32 business hours',
            'Best effort',
        ],
        [
            'Other',
            'As per individual agreement',
            '32 business hours',
            'Best effort',
            'Not applicable',
        ],
    ];
    return shell(`<article class="card support-page-card">
        <h1>Support services</h1>
        <section data-support-section="services" aria-label="Support services">
            <p><strong>Guides.</strong> Products documentation: <a href="https://support.1ci.com/" target="_blank" rel="noopener noreferrer">support.1ci.com</a></p>
            <p><strong>Download center.</strong> All installers and updates in one place: <button type="button" class="text-button" data-go="distributives">Products Available</button></p>
            <p><strong>Tickets.</strong> Have an issue or question? <button type="button" class="text-button" data-action="support">Submit a request</button></p>
            <p>To view your support requests: <button type="button" class="text-button" data-action="requests">My requests</button></p>
        </section>
        <section data-support-section="levels" aria-labelledby="support-policy-heading">
            <h2 id="support-policy-heading">Support policy and subscription levels</h2>
            <p>The primary support audience is 1Ci Partners and Partners’ technical specialists.</p>
            <p>We offer 4 subscription levels (Premium, Advanced, NFR, and Community) to 1Ci Partners.</p>
            <div class="support-table-scroll" role="region" aria-label="Support response times" tabindex="0"><table class="support-levels-table"><caption class="sr-only">Support response times by issue type and subscription level</caption><thead><tr>${[
                'Issue type',
                'Premium',
                'Advanced',
                'NFR',
                'Community',
            ]
                .map((title) => `<th scope="col">${title}</th>`)
                .join('')}</tr></thead><tbody>${rows
                .map(
                    ([issue, ...cells]) =>
                        `<tr><th scope="row">${issue}</th>${cells
                            .map((cell) => `<td>${cell}</td>`)
                            .join('')}</tr>`,
                )
                .join('')}</tbody></table></div>
            <p>Read more about <button type="button" class="text-button" data-action="policies">Support policy</button></p>
            <p>For 1C:Drive German, Polish, Turkish, and other non-English editions see <button type="button" class="text-button" data-action="drive-policies">1C:Drive Editions Support Policy</button></p>
        </section>
        <section data-support-section="contacts" aria-labelledby="support-contacts-heading"><h2 id="support-contacts-heading">Contacts</h2><p>Website: <a href="https://support.1ci.com/" target="_blank" rel="noopener noreferrer">support.1ci.com</a></p><p>Email: <a href="mailto:support@1ci.com">support@1ci.com</a></p></section>
    </article>`);
}

function notificationsPage() {
    return shell(`<div class="page-heading"><div><h1>Notifications</h1><p>Your latest account updates.</p></div><button type="button" class="btn" data-go="dashboard">${ico(
        'home',
    )}Back to Dashboard</button></div>
        <form class="notification-filters" onsubmit="return false"><div class="filter-fields notification-filter-fields"><div class="field"><label for="notification-status">Status</label><select id="notification-status">${[
            ['all', 'All'],
            ['unread', 'Unread'],
            ['read', 'Read'],
        ]
            .map(
                ([value, label]) =>
                    `<option value="${value}" ${
                        pageOptions.notificationFilter === value
                            ? 'selected'
                            : ''
                    }>${label}</option>`,
            )
            .join('')}</select></div>
            ${datePeriodControl(
                'notifications',
                'notification-from',
                'notification-to',
            )}</div>${filterResetControl('notifications')}</form>
        <section class="card"><div class="notification-results-heading"><h2 id="notification-list-heading">All notifications</h2><small class="muted" id="notification-count" role="status"></small></div><div class="notification-list" id="notifications-list">${notificationRows()}</div><div class="empty-notifications" id="empty-notifications" hidden><h3>No notifications found</h3><p class="muted">Try another status or a wider date range.</p></div></section>`);
}
function filterNotifications() {
    if (page !== 'notifications') return;
    const status = document.getElementById('notification-status').value;
    const from = document.getElementById('notification-from').value;
    const to = document.getElementById('notification-to').value;
    const changed =
        status !== pageOptions.notificationFilter ||
        from !== notificationFrom ||
        to !== notificationTo;
    pageOptions.notificationFilter = status;
    notificationFrom = from;
    notificationTo = to;
    let count = 0;
    document
        .querySelectorAll('#notifications-list [data-notification]')
        .forEach((row) => {
            row.hidden =
                (status === 'unread' && row.dataset.read === 'true') ||
                (status === 'read' && row.dataset.read === 'false') ||
                (from && row.dataset.date < from) ||
                (to && row.dataset.date > to);
            if (!row.hidden) count++;
        });
    document.getElementById('notification-list-heading').textContent = {
        all: 'All notifications',
        unread: 'Unread notifications',
        read: 'Read notifications',
    }[status];
    document.getElementById(
        'notification-count',
    ).textContent = `${count} notification${count === 1 ? '' : 's'}`;
    document.getElementById('empty-notifications').hidden = count > 0;
    document.getElementById('notifications-list').hidden = count === 0;
    syncDatePeriods();
    if (changed) {
        const url = new URL(location.href);
        url.searchParams.set('notificationFilter', status);
        url.searchParams.set('notificationFrom', from);
        url.searchParams.set('notificationTo', to);
        history.replaceState(null, '', url);
        window.parent.postMessage(
            { type: 'reference-page', page, state: viewState() },
            '*',
        );
    }
}
function syncNotificationFilters() {
    if (page !== 'notifications') return;
    const status = document.getElementById('notification-status');
    if (!status) return;
    document.getElementById('notification-from').value = notificationFrom;
    document.getElementById('notification-to').value = notificationTo;
    if (status.value !== pageOptions.notificationFilter) {
        status.value = pageOptions.notificationFilter;
        status.dispatchEvent(new Event('change', { bubbles: true }));
    }
    filterNotifications();
}

function applyLayoutOptions() {
    document.body.dataset.corporateSidebar = pageOptions.corporateSidebar;
    document.body.dataset.drawerStyle = pageOptions.drawerStyle;
    document.body.dataset.inputOutline =
        pageOptions[inputOutlineDefinitions[page].key];
}

function syncDownloadLayout() {
    document.body.dataset.downloadLayout = pageOptions.downloadLayout;
    document
        .querySelectorAll('[data-page-setting="downloadLayout"]')
        .forEach((button) => {
            const active = button.dataset.value === pageOptions.downloadLayout;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
}

function applyPageSettings() {
    document.body.dataset.dashboardWidgets = pageOptions.dashboardWidgets;
    document.body.dataset.accountSections = pageOptions.accountSections;
    syncDownloadLayout();
    if (page === 'dashboard' && pageOptions.dashboardWidgets !== 'all') {
        const certificates = pageOptions.dashboardWidgets === 'certificates';
        document.querySelector('.stats').hidden = true;
        document.querySelectorAll('.content .card').forEach((card) => {
            card.hidden = certificates
                ? !card.matches('.cert-card')
                : !card.matches('.news-card, .notifications-card');
        });
        document
            .querySelectorAll(
                '.dashboard-overview, .dashboard-main, .dashboard-aside, .dashboard-grid',
            )
            .forEach((group) => {
                group.hidden = !group.querySelector('.card:not([hidden])');
            });
    }
    if (page === 'support') {
        document
            .querySelectorAll('[data-support-section]')
            .forEach((section) => {
                section.hidden =
                    pageOptions.supportSection !== 'all' &&
                    section.dataset.supportSection !==
                        pageOptions.supportSection;
            });
    }
    if (page === 'account') {
        document.querySelector('.account-layout > .stack').hidden =
            pageOptions.accountSections === 'settings';
        document.querySelector('.account-aside').hidden =
            pageOptions.accountSections === 'profile';
    }
    if (page === 'distributives')
        document.getElementById('product-family').value =
            pageOptions.downloadFamily;
    if (page === 'ui-kit' && pageOptions.kitSection !== 'all') {
        document.querySelectorAll('.kit-grid > section').forEach((section) => {
            section.hidden =
                section.dataset.kitSection !== pageOptions.kitSection;
        });
    }
}

function enhanceSelects(root) {
    root.querySelectorAll('select:not([data-enhanced])').forEach((select) => {
        select.dataset.enhanced = 'true';
        const labels = [...select.labels];
        const popup = document.createElement('details');
        popup.className = 'reference-popup select-popup';
        const triggerId = `${select.id}-trigger`;
        const listId = `${select.id}-options`;
        popup.innerHTML = `<summary id="${triggerId}" role="combobox" aria-haspopup="listbox" aria-controls="${listId}" aria-expanded="false" aria-label="${esc(
            labels.map((label) => label.textContent.trim()).join(' ') ||
                'Select option',
        )}"><span class="select-value"></span><svg class="icon select-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="popup-panel select-options" id="${listId}" role="listbox"></div>`;
        select.before(popup);
        popup.append(select);
        select.hidden = true;
        labels.forEach((label) => {
            label.htmlFor = triggerId;
            label.addEventListener('click', () =>
                popup.querySelector('summary').focus(),
            );
        });
        popup.addEventListener('focusout', () => {
            setTimeout(() => {
                if (popup.open && !popup.contains(document.activeElement))
                    setPopup(popup, false);
            }, 0);
        });
        const sync = () => {
            popup.querySelector('.select-value').textContent =
                select.selectedOptions[0]?.textContent || '';
            popup.querySelector('.select-options').innerHTML = [
                ...select.options,
            ]
                .map(
                    (option, index) =>
                        `<button type="button" role="option" data-select-index="${index}" aria-selected="${
                            option.selected
                        }" ${option.disabled ? 'disabled' : ''}><span>${esc(
                            option.textContent,
                        )}</span><span class="select-check" aria-hidden="true">${
                            option.selected ? '✓' : ''
                        }</span></button>`,
                )
                .join('');
        };
        sync();
        select.addEventListener('change', sync);
        select.form?.addEventListener('reset', () => setTimeout(sync, 0));
        popup.addEventListener('click', async (event) => {
            const option = event.target.closest('[data-select-index]');
            if (!option) return;
            event.stopPropagation();
            select.selectedIndex = Number(option.dataset.selectIndex);
            select.dispatchEvent(new Event('change', { bubbles: true }));
            await setPopup(popup, false, true);
        });
        popup.addEventListener('keydown', (event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
                return;
            event.preventDefault();
            const options = [
                ...popup.querySelectorAll('[role="option"]:not(:disabled)'),
            ];
            if (!options.length) return;
            const current = options.indexOf(document.activeElement);
            const next =
                event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                    ? options.length - 1
                    : current < 0
                    ? Math.max(
                          0,
                          options.findIndex(
                              (option) =>
                                  option.getAttribute('aria-selected') ===
                                  'true',
                          ),
                      )
                    : (current +
                          (event.key === 'ArrowUp' ? -1 : 1) +
                          options.length) %
                      options.length;
            setPopup(popup, true);
            options[next].focus({ preventScroll: true });
        });
    });
}

function syncDistributiveDates() {
    if (page !== 'distributives') return;
    document.getElementById('release-from').value = releaseFrom;
    document.getElementById('release-to').value = releaseTo;
    filterDistributives();
}
function filterDistributives() {
    if (page !== 'distributives') return;
    const search = document
        .getElementById('product-search')
        .value.trim()
        .toLowerCase();
    const family = document.getElementById('product-family').value;
    const from = document.getElementById('release-from').value;
    const to = document.getElementById('release-to').value;
    const datesChanged = from !== releaseFrom || to !== releaseTo;
    releaseFrom = from;
    releaseTo = to;
    let count = 0;
    document.querySelectorAll('[data-product-card]').forEach((card) => {
        card.hidden =
            !card.dataset.search.includes(search) ||
            (family !== 'all' && card.dataset.family !== family) ||
            (from && card.dataset.date < from) ||
            (to && card.dataset.date > to);
        if (!card.hidden) count++;
    });
    document.getElementById('product-count').textContent = `${count} releases`;
    document.getElementById('empty-products').hidden = count > 0;
    syncDatePeriods();
    if (datesChanged) {
        const url = new URL(location.href);
        url.searchParams.set('releaseFrom', from);
        url.searchParams.set('releaseTo', to);
        history.replaceState(null, '', url);
        window.parent.postMessage(
            { type: 'reference-page', page, state: viewState() },
            '*',
        );
    }
}
function partnershipPage() {
    return shell(`<div class="page-heading"><div><h1>Partnership</h1><p>Your connection with a 1Ci partner.</p></div></div><section class="card partnership-card">
        <div class="card-heading"><h2>${
            partnerLinked ? 'Connected Partner' : 'Connect a Partner'
        }</h2><span class="badge ${partnerLinked ? 'success' : ''}">${ico(
            'link',
        )}${partnerLinked ? 'Linked' : 'Not connected'}</span></div>
        ${
            partnerLinked
                ? `<h3>tester testerLastName <span class="muted">(test@1ci.app)</span></h3><dl class="partner-details"><div><dt>Connected Partner ID</dt><dd>6363</dd></div><div><dt>Date</dt><dd>24.11.2025</dd></div></dl><button type="button" class="btn" data-action="unlink">Cancel connection</button>`
                : `<p class="muted">Ask your partner for their account ID to connect your accounts.</p><form id="partner-form"><div class="field"><label for="partner-id">Partner account ID</label><input id="partner-id" inputmode="numeric" pattern="6363" title="Use demo partner ID 6363" placeholder="6363" required></div><small class="muted">Demo partner ID: 6363</small><div class="dialog-actions"><button class="btn primary" type="submit">Connect partner</button></div></form>`
        }
    </section>`);
}
function uiKitPage() {
    return shell(`<div class="page-heading"><div><div class="eyebrow muted">Design foundations</div><h1>UI Kit</h1><p>${
        themeNames[theme]
    } · Shared components and interaction states.</p></div><button class="btn" data-go="dashboard">View dashboard ${ico(
        'arrow',
    )}</button></div>
        <div class="kit-grid">
        <section class="card kit-wide"><h2>Color palette</h2><p class="muted">Theme tokens used throughout the reference.</p><div class="swatches">${[
            ['--sidebar', 'Navigation'],
            ['--background', 'Canvas'],
            ['--surface', 'Surface'],
            ['--text', 'Text'],
            ['--accent', 'Accent'],
            ['--primary', 'Primary action'],
            ['--border', 'Border'],
        ]
            .map(
                ([token, label]) =>
                    `<div><span class="swatch" style="background:var(${token})"></span><strong>${label}</strong><code>${token}</code></div>`,
            )
            .join('')}</div></section>
        <section class="card"><h2>Typography</h2><h1>Page heading</h1><h2>Section heading</h2><h3>Card heading</h3><p>Body copy keeps tasks clear and readable.</p><small class="muted">Supporting metadata · 12 px</small></section>
        <section class="card" data-kit-section="buttons"><h2>Buttons & states</h2><div class="kit-samples"><button class="btn primary" data-action="sample-download">Primary action</button><button class="btn" data-action="language-dialog">Secondary action</button><button class="btn danger" data-action="unlink">Destructive action</button><button class="btn" disabled>Disabled</button><button class="text-button" data-go="partnership">Text link ${ico(
            'arrow',
        )}</button><button class="icon-button" data-action="notifications" aria-label="Notifications">${ico(
            'bell',
        )}</button></div></section>
        <section class="card kit-wide button-size-kit" data-kit-section="buttons"><h2>Button sizes</h2><p class="muted">SM · 34 px / MD · 42 px (default) / LG · 50 px. Combine a size with any button style.</p><div class="kit-samples"><button type="button" class="btn primary sm" data-action="sample-download">SM ${ico(
            'arrow',
        )}</button><button type="button" class="btn primary md" data-action="sample-download">MD · Default ${ico(
            'arrow',
        )}</button><button type="button" class="btn primary lg" data-action="sample-download">LG ${ico(
            'arrow',
        )}</button></div><div class="kit-samples"><button type="button" class="btn sm" data-action="sample-download">Small</button><button type="button" class="btn" data-action="sample-download">Default (no size class)</button><button type="button" class="btn lg" data-action="sample-download">Large</button></div></section>
        <section class="card form-controls-kit" data-kit-section="forms"><h2>Form controls</h2><div class="form-stack"><div class="field"><label for="kit-email">Email address</label><input id="kit-email" type="email" placeholder="name@company.com"></div><div class="field"><label for="kit-disabled">Disabled field</label><input id="kit-disabled" value="Read-only example" disabled></div><div class="field"><label for="kit-select">Product</label><select id="kit-select"><option>1C:Drive</option><option>1C:Enterprise</option></select></div><label class="check"><input type="checkbox" checked>Receive product updates</label><p class="field-error">Example validation: please enter a valid email.</p></div></section>
        <section class="card"><h2>Badges, avatars & icons</h2><div class="kit-samples"><span class="badge">Community member</span><span class="badge success">Linked</span><span class="badge kit-warning">Pending</span><div class="avatar">EE</div><div class="avatar large">NS</div>${[
            'home',
            'store',
            'bag',
            'link',
            'file',
            'globe',
            'shield',
            'award',
            'mail',
        ]
            .map(ico)
            .join(
                '',
            )}</div><hr><div class="notice">Informational notice with a clear next step.</div><div class="demo-plaque">${ico(
            'shield',
        )}Demo sign-in · No credentials are sent</div></section>
        <section class="card kit-wide"><h2>Personal menu & language selection</h2><p class="muted">Corporate uses a compact list; Minimal uses language cards; Studio adds a regional chooser. All choices preview selection without translating sample content.</p><div class="kit-samples">${personalMenu()}${languageMenu()}<button class="btn" data-action="language-dialog">Open regional chooser</button></div><div class="language-showcase"><div><h3>Compact popup list</h3>${languageOptions()}</div><div><h3>Language cards</h3><div class="language-cards">${languageOptions(
            'cards',
        )}</div></div></div></section>
        <section class="card"><h2>Dialogs & feedback</h2><div class="kit-samples"><button class="btn" data-action="notifications">Notification dialog</button><button class="btn" data-action="support">Form dialog</button><button class="btn danger" data-action="unlink">Confirmation dialog</button><button class="btn" data-action="sample-download">Show toast</button></div></section>
        <section class="card"><h2>Spacing & shape</h2><p>4 · 8 · 12 · 16 · 24 · 32 px</p><p class="muted">Cards use the theme radius, thin borders, and consistent padding. Keyboard focus uses a visible accent outline.</p><details><summary>Accordion / disclosure</summary><p class="muted">Expandable content for secondary information.</p></details></section>
        <section class="card kit-wide spacing-kit"><h2>Spacing anatomy</h2><p class="muted">Colored areas show actual CSS spacing. Values are in pixels.</p>
            <figure class="spacing-figure"><div class="spacing-demo" aria-label="Example with 24 pixels of padding on all sides and text gaps of 16 and 24 pixels">
                <span class="padding-measure padding-top" aria-hidden="true">24 px</span><span class="padding-measure padding-right" aria-hidden="true">24 px</span><span class="padding-measure padding-bottom" aria-hidden="true">24 px</span><span class="padding-measure padding-left" aria-hidden="true">24 px</span>
                <div class="spacing-content"><h3>Account overview</h3><div class="spacing-gap gap-16"><span>16 px</span></div><p>Your services and profile</p><div class="spacing-gap gap-24"><span>24 px</span></div><p>All information in one place</p></div>
            </div><figcaption class="spacing-legend"><span><i class="padding-key" aria-hidden="true"></i>Padding · 24 px</span><span><i class="gap-key" aria-hidden="true"></i>Text spacing · 16 / 24 px</span></figcaption></figure>
        </section>
        </div>`);
}
document.addEventListener('input', (event) => {
    if (event.target.closest('.download-filters')) filterDistributives();
    if (event.target.closest('.notification-filters')) filterNotifications();
});
document.addEventListener('change', (event) => {
    if (event.target.closest('.download-filters')) filterDistributives();
    if (event.target.closest('.notification-filters')) filterNotifications();
});
document.addEventListener('reset', (event) => {
    if (event.target.matches('.download-filters'))
        setTimeout(() => {
            document.getElementById('release-from').value = '';
            document.getElementById('release-to').value = '';
            filterDistributives();
        }, 0);
    if (event.target.matches('.notification-filters'))
        setTimeout(() => {
            document.getElementById('notification-status').value = 'all';
            document.getElementById('notification-from').value = '';
            document.getElementById('notification-to').value = '';
            document
                .getElementById('notification-status')
                .dispatchEvent(new Event('change', { bubbles: true }));
            filterNotifications();
        }, 0);
});
document.addEventListener('submit', (event) => {
    if (event.target.id === 'partner-form') {
        event.preventDefault();
        partnerLinked = true;
        render();
        toast('Partner connected in this demo.');
    }
});
document.addEventListener('click', (event) => {
    if (
        contactPopoverOpen &&
        !contactPopover.contains(event.target) &&
        !contactPopoverTrigger?.contains(event.target)
    )
        closeContactPopover();
    document.querySelectorAll('.reference-popup[open]').forEach((popup) => {
        if (!popup.contains(event.target)) setPopup(popup, false);
    });
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !document.getElementById('modal').open) {
        closeContactPopover(true);
        document
            .querySelectorAll('.reference-popup[open]')
            .forEach((popup) => setPopup(popup, false, true));
    }
});

document.addEventListener('keydown', (event) => {
    if (!assistiveMode || event.altKey || event.ctrlKey || event.metaKey)
        return;
    if (
        ![
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
        ].includes(event.key)
    )
        return;
    const group = event.target.closest(
        '.switch-group, .sidebar .nav, .topnav .nav, .corporate-drawer .nav, .corporate-drawer .drawer-links',
    );
    if (!group || !event.target.matches('button')) return;
    const buttons = [...group.querySelectorAll('button')].filter(
        (button) =>
            !button.disabled &&
            !button.closest('[inert]') &&
            button.getClientRects().length,
    );
    const current = buttons.indexOf(event.target);
    if (current < 0 || !buttons.length) return;
    event.preventDefault();
    const next =
        event.key === 'Home'
            ? 0
            : event.key === 'End'
            ? buttons.length - 1
            : (current +
                  (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) +
                  buttons.length) %
              buttons.length;
    buttons[next].focus({ preventScroll: true });
});
document.addEventListener(
    'toggle',
    (event) => {
        const popup = event.target;
        if (
            assistiveMode &&
            popup.matches('.reference-popup') &&
            popup.open &&
            popup.querySelector('summary') === document.activeElement
        ) {
            popup
                .querySelector('.popup-panel button, .popup-panel a')
                ?.focus({ preventScroll: true });
        }
    },
    true,
);

document.addEventListener('keydown', (event) => {
    if (!assistiveMode || event.key !== 'Tab') return;
    const dialog = document.querySelector('dialog:modal');
    if (!dialog) return;
    const controls = [
        ...dialog.querySelectorAll(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
    ].filter((element) => !element.disabled && element.getClientRects().length);
    if (!controls.length) {
        event.preventDefault();
        return;
    }
    const first = controls[0],
        last = controls[controls.length - 1];
    if (
        event.shiftKey &&
        (document.activeElement === first ||
            !dialog.contains(document.activeElement))
    ) {
        event.preventDefault();
        last.focus({
            preventScroll: !dialog.classList.contains('corporate-drawer'),
        });
    } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
            !dialog.contains(document.activeElement))
    ) {
        event.preventDefault();
        first.focus({
            preventScroll: !dialog.classList.contains('corporate-drawer'),
        });
    }
});

matchMedia('(prefers-reduced-motion: reduce)').addEventListener(
    'change',
    finishSurfacesWithoutMotion,
);

render();
