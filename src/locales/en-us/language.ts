export default {
    'zh-cn': `Simplified Chinese`,
    'en-us': `English`,
    management: 'Language Management',
    system: 'System Language Entries',
    custom: 'Custom Language Entries',
    customize: 'Language Configuration',
    module: 'Module Management',
    modules: {
        all: 'All Modules',
        name: 'Module Name',
        belong: 'Parent Module',
        builtin: 'Built-in Modules',
        customize: 'Custom Modules',
        create: 'Add Module',
        update: 'Edit Module'
    },
    tips: {
        customize:
            'Customize language entries for specific locales. Supports overriding system-built entries.',
        builtin: 'System-built language entries cannot be added, modified, or deleted.',
        module: 'Organize entries by modules to reduce coupling and streamline management.',
        management:
            'Built-in Chinese/English support. Integrated with Baidu Translate API for 20+ language conversions with key synchronization.'
    },
    placeholder: {
        search: 'Enter keywords to search',
        select: 'Select a locale',
        config: {
            key: 'Enter entry key',
            value: 'Enter localized content'
        },
        type: {
            key: 'Enter locale code (e.g. zh-cn)',
            value: 'Enter locale display name (e.g. Simplified Chinese)'
        },
        language: {
            active: 'Select target locale',
            key: 'Locale code (e.g. zh-cn)',
            display: 'Locale display name (e.g. Simplified Chinese)'
        },
        module: {
            key: 'Enter module key',
            name: 'Enter module name'
        }
    },
    create: 'Add Locale',
    update: 'Edit Locale',
    current: 'Active Locale',
    add: 'Add Entry',
    default: {
        none: 'No default locale set',
        set: 'Set Default Locale',
        name: 'Default Locale',
        tip: 'The default locale serves as the base configuration for new locales. New locales can inherit existing keys with optional auto-translation via Baidu Translate API.',
        setting: 'Set as Default'
    },
    key: 'Locale Code',
    'key-tip':
        '<a>Key requirements:</a><br />1. Start with letter, supports alphanumerics, periods and underscores.<br />2. Length between 2-64 characters.',
    display: 'Display Name',
    translate: {
        auto: 'Enable Auto-translation',
        tip: '<a>Note: Custom translations supported.</a><br />Uses Baidu Translate API by default. Configure API KEY & APPID first.',
        target: 'Target Language',
        explain:
            '<a>Note: Synced entries are disabled by default.</a><br />Translations use the default locale as source. Example: Chinese (default) → English translations.'
    },
    error: {
        language: 'Enter locale display name',
        default: 'Select default locale status',
        none: 'Select a locale before setting as default',
        repeated: 'This locale is already set as default',
        reg: 'Invalid key format',
        key: {
            exist: 'Key already exists',
            again: 'Invalid key format',
            empty: 'Enter locale code'
        },
        config: 'Cannot proceed - configure {name} first'
    },
    content: {
        create: 'Add Localization Entry',
        update: 'Edit Localization Entry',
        key: 'Key',
        content: 'Content',
        module: 'Parent Module',
        status: 'Status',
        none: 'No parent module',
        sync: {
            label: 'Sync Keys',
            select: 'Select target locales',
            tip: 'Sync options:<br /><a>0: Disabled; 1: All; 2: Specific;</a><br /><a>Synced entries start as disabled.</a><br />Propagate new entries to selected locales without translation.',
            all: 'All Locales',
            specify: 'Specific Locales',
            none: 'Disabled'
        }
    },
    status: {
        name: 'Batch Toggle Status',
        title: 'Batch Update Entry Status'
    },
    delete: {
        sync: 'Delete matching keys in all locales',
        confirm: 'Confirm deletion of selected entries?'
    },
    list: {
        zh: 'Simplified Chinese',
        en: 'English',
        jp: 'Japanese',
        kor: 'Korean',
        fra: 'French',
        spa: 'Spanish',
        th: 'Thai',
        ara: 'Arabic',
        ru: 'Russian',
        pt: 'Portuguese',
        de: 'German',
        it: 'Italian',
        el: 'Greek',
        nl: 'Dutch',
        pl: 'Polish',
        bul: 'Bulgarian',
        est: 'Estonian',
        dan: 'Danish',
        fin: 'Finnish',
        cs: 'Czech',
        rom: 'Romanian',
        slo: 'Slovenian',
        swe: 'Swedish',
        hu: 'Hungarian',
        cht: 'Traditional Chinese',
        vie: 'Vietnamese'
    }
}
