export default {
    'zh-cn': `简体中文`,
    'en-us': `英文`,
    management: `语系管理`,
    system: `内置语言项`,
    custom: `自定义语言项`,
    customize: {
        management: `语言项管理`
    },
    module: `模块管理`,
    modules: {
        name: `模块名称`,
        belong: `所属模块`,
        builtin: `内置模块`,
        customize: `自定义模块`,
        create: `新增模块`,
        update: `更新模块`
    },
    placeholder: {
        search: `请输入待搜索关键词`,
        select: `请选择语系`,
        config: {
            key: '请输入语言项的关键词',
            value: '请输入语言项关键词对应的语言内容'
        },
        type: {
            key: '请输入语系的关键词',
            value: '请输入语系关键词对应的语言显示名称'
        },
        language: {
            active: `请选择语系`,
            key: `语言编码，如简体中文的关键词为: zh-cn`,
            display: `语系显示名称，如：简体中文`
        },
        module: {
            key: `请输入模块关键词`,
            name: `请输入模块名称`
        }
    },
    create: `新增语系`,
    update: `更新语系`,
    current: `当前语系`,
    add: `新增配置`,
    default: {
        none: `暂无设定语系`,
        set: `设为默认`,
        name: `默认语系`,
        tip: `默认语系将作为新增语系的数据基础，新语系可选择是否生成一套与默认语系当前语言配置相同 Key 值的配置属性，同时可选自动翻译功能，调用百度翻译 API 所支持的语言内容进行自动翻译。`,
        setting: `设为默认语系`
    },
    key: `语言编码`,
    'key-tip': `<a>关键词格式：</a><br />1. 英文字母开头，支持大小写英文、数字、小数点及下划线。<br />2. 长度在 2 到 64 个字符之间。`,
    display: `显示名称`,
    translate: {
        auto: `是否自动翻译`,
        tip: `注意事项：<br /><a>1. 支持自定义翻译功能。<br />2. 更新状态时，此选项无效。</a><br />默认调用百度翻译 API 进行自动翻译，请预先配置 KEY & APPID 等参数。`,
        target: `翻译目标语言`,
        explain: `<a>注：更新状态时，此选项无效。</a><br />以默认语系的配置内容为基准，自动翻译为当前选中的语系。如：当前默认的语系为简体中文，选择的目标语言为英语，则自动翻译简体中文语系中所有已存在的语言配置内容为英语。`
    },
    error: {
        language: `请输入语系显示名称`,
        default: `请选择是否为默认语系选项`,
        none: `请先选定语系后再设定为默认`,
        repeated: `当前已是默认语系，无需再次设定`,
        reg: `关键词格式不正确，请重新输入`,
        key: {
            exist: '关键词已存在，请重新输入',
            again: '关键词有误，请重新输入',
            empty: `请输入语系关键词`
        },
        config: `无法执行相关动作，请先配置「 {name} 」参数`
    },
    content: {
        create: `新增语言配置`,
        update: `更新语言配置`,
        key: `关键词`,
        content: `语言内容`,
        status: `内容状态`,
        sync: {
            label: `同步 Key 值`,
            select: `选择同步语系`,
            tip: `单选属性值说明：<br /><a>0: 不同步; 1: 全部; 2: 指定;</a><br /><a>同步后的内容默认为禁用状态。</a><br />将当前新增的语言配置内容，不翻译，同步新增到其他所有语系或指定的语系内。`,
            all: `全部`,
            specify: `指定`,
            none: `不同步`
        }
    },
    status: {
        name: `状态管控`,
        title: `批量启用/禁用语言项状态`
    },
    delete: {
        sync: `同步删除其他语系相同 key 值的语言项`,
        confirm: `确定删除当前所选的语言项？`
    },
    list: {
        zh: '简体中文',
        en: '英语',
        jp: '日语',
        kor: '韩语',
        fra: '法语',
        spa: '西班牙语',
        th: '泰语',
        ara: '阿拉伯语',
        ru: '俄语',
        pt: '葡萄牙语',
        de: '德语',
        it: '意大利语',
        el: '希腊语',
        nl: '荷兰语',
        pl: '波兰语',
        bul: '保加利亚语',
        est: '爱沙尼亚语',
        dan: '丹麦语',
        fin: '芬兰语',
        cs: '捷克语',
        rom: '罗马尼亚语',
        slo: '斯洛文尼亚语',
        swe: '瑞典语',
        hu: '匈牙利语',
        cht: '繁体中文',
        vie: '越南语'
    }
}
