export default {
    'zh-cn': `Simplified Chinese`,
    'en-us': `English`,
    management: `Language management`,
    system: `System language`,
    custom: `Customized language`,
    customize: `Language management`,
    module: `Module management`,
    modules: {
        all: `All modules`,
        name: `Module name`,
        belong: `Belonging module`,
        builtin: `Built-in module`,
        customize: `Customized module`,
        create: `Add new module`,
        update: `Update module`
    },
    tips: {
        customize: `Customize the language item content of the configuration language, support overwriting the system built-in language items. `,
        builtin: `The system built-in language item content does not support operations such as adding/modifying/deleting. `,
        module: `Dividing language items by module can effectively reduce the coupling degree of keywords and simplify the input length. `,
        management: `Built-in Chinese/English bilingual system, support Baidu translation of more than 20 languages ​​and synchronize keywords. `
    },
    placeholder: {
        search: `Please enter the keyword to be searched`,
        select: `Please select the language`,
        config: {
            key: 'Please enter the keyword of the language item',
            value: 'Please enter the language content corresponding to the keyword of the language item'
        },
        type: {
            key: 'Please enter the keyword of the language',
            value: 'Please enter the language display name corresponding to the language keyword'
        },
        language: {
            active: `Please select the language`,
            key: `Language encoding, such as the keyword for simplified Chinese is: zh-cn`,
            display: `Language display name, such as: Simplified Chinese`
        },
        module: {
            key: `Please enter the module keyword`,
            name: `Please enter the module name`
        }
    },
    create: `Add a new language`,
    update: `Update the language`,
    current: `Current language`,
    add: `Add a new language item`,
    default: {
        none: `No language set yet`,
        set: `Set the default language`,
        name: `Default language`,
        tip: `The default language will be used as the data basis for the new language. The new language can choose whether to generate a set of configuration attributes with the same key value as the current language configuration of the default language. At the same time, the automatic translation function can be selected to call the language content supported by the Baidu Translate API for automatic translation. `,
        setting: `Set as default language`
    },
    key: `Language encoding`,
    'key-tip': `<a>Keyword format:</a><br />1. Start with an English letter, support uppercase and lowercase English, numbers, decimal points and underscores. <br />2. The length is between 2 and 64 characters. `,
    display: `Display name`,
    translate: {
        auto: `Whether to translate automatically`,
        tip: `<a>Note: Supports custom translation function. </a><br />Baidu Translate API is called for automatic translation by default. Please pre-configure the KEY & APPID parameters applied by the Baidu Translate platform. `,
        target: `Translation target language`,
        explain: `<a>Note: All language items generated after synchronization are in "disabled" state by default. </a><br /> Based on the configuration content of the default language, automatically translate to the currently selected language. For example: the current default language is Simplified Chinese, and the selected target language is English, then all existing language configuration content in the Simplified Chinese language will be automatically translated to English. `
    },
    error: {
        language: `Please enter the language display name`,
        default: `Please select whether to use the default language option`,
        none: `Please select the language first and then set it as default`,
        repeated: `The current language is already the default, no need to set it again`,
        reg: `The keyword format is incorrect, please re-enter`,
        key: {
            exist: 'The keyword already exists, please re-enter',
            again: 'The keyword is incorrect, please re-enter',
            empty: `Please enter the language keyword`
        },
        config: `Unable to perform related actions, please configure the "{name}" parameter first`
    },
    content: {
        create: `Add a new language configuration`,
        update: `Update language configuration`,
        key: `Keyword`,
        content: `Language content`,
        module: `Module`,
        status: `Content status`,
        none: `Does not belong to any module`,
        sync: {
            label: `Synchronize Key value`,
            select: `Select the synchronized language`,
            tip: `Single-select attribute value description: <br /><a>0: No synchronization; 1: All; 2: Specified;</a><br /><a>The synchronization language item is disabled by default. </a><br />Add the currently added language item to all other languages ​​or specified languages ​​without translation. `,
            all: `All`,
            specify: `Specified`,
            none: `No synchronization`
        }
    },
    status: {
        name: `Batch enable/disable`,
        title: `Batch enable/disable language item status`
    },
    delete: {
        sync: `Synchronize and delete language items with the same key value in other languages`,
        confirm: `Are you sure you want to delete the currently selected language item? `
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
