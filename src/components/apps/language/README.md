# 语系管理

> 「 语系管理 」 组件统一管理语系及语言项内容。

## 使用示例

> 各个管理动作支持「 string 」直接获取 API 数据或自定义 「 function 」设定相关数据。

### 默认

```html
<mi-apps-language />
```

### 语系管理动作

```html
<mi-apps-language get-category-action="/v1/languages/categories"
    create-category-action="/v1/languages/categories"
    update-category-action="/v1/languages/categories"
    delete-category-action="/v1/languages/categories"
    set-default-category-action="/v1/languages/categories/default"
    check-category-exist-action="/v1/languages/categories/check" />
```

### 语言项管理动作

```html
<mi-apps-language get-content-action="/v1/languages"
    create-content-action="/v1/languages"
    update-content-status-action="/v1/languages/status"
    batch-create-content-action="/v1/languages/batch-create"
    update-content-action="/v1/languages"
    delete-content-action="/v1/languages"
    check-content-exist-action="/v1/languages/check" />
```

### 语言模块管理动作

```html
<mi-apps-language get-module-action="/v1/languages/modules"
    check-module-exist-action="/v1/languages/modules/check"
    create-module-action="/v1/languages/modules"
    delete-module-action="/v1/languages/modules"
    update-module-action="/v1/languages/modules" />
```

### 自动翻译配置

> 默认调用百度翻译，请预先配置百度翻译的 appid 和 key。

```html
<!-- 默认 -->
<mi-apps-language :translate="{
    baidu: {
        url: 'api/trans/vip/translate',
        appid: 'baidu_translate_appid',
        key: 'baidu_translate_key'
    }
}" />

<!-- 自定义 -->
 <mi-apps-language :translate="{
    translate: () => {
        // ...
    }
}" />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Title Tokens

| Token | 默认值
| :---- | :----
| `--mi-language-tabs-text-customize` | `--mi-on-primary`
| `--mi-language-tabs-subtext-customize` | `rgba(--mi-rgb-on-primary, 0.75)`
| `--mi-language-tabs-background-customize` | `--mi-primary`
| `--mi-language-tabs-icon-text-customize` | `--mi-primary`
| `--mi-language-tabs-icon-background-customize` | `--mi-on-primary`
| `--mi-language-tabs-icon-check-background-customize` | `--mi-on-primary`
| `--mi-language-tabs-icon-check-text-customize` | `--mi-on-primary`
| `--mi-language-tabs-text-builtin` | `--mi-on-tertiary`
| `--mi-language-tabs-subtext-builtin` | `rgba(--mi-rgb-on-tertiary, 0.75)`
| `--mi-language-tabs-background-builtin` | `--mi-tertiary`
| `--mi-language-tabs-icon-text-builtin` | `--mi-tertiary`
| `--mi-language-tabs-icon-background-builtin` | `--mi-on-tertiary`
| `--mi-language-tabs-icon-check-background-builtin` | `--mi-on-tertiary`
| `--mi-language-tabs-icon-check-text-builtin` | `--mi-on-tertiary`
| `--mi-language-tabs-text-module` | `--mi-on-error`
| `--mi-language-tabs-subtext-module` | `rgba(--mi-rgb-on-error, 0.75)`
| `--mi-language-tabs-background-module` | `--mi-error`
| `--mi-language-tabs-icon-text-module` | `--mi-error`
| `--mi-language-tabs-icon-background-module` | `--mi-on-error`
| `--mi-language-tabs-text-management` | `--mi-inverse-on-surface`
| `--mi-language-tabs-subtext-management` | `rgba(--mi-rgb-inverse-on-surface, 0.75)`
| `--mi-language-tabs-background-management` | `--mi-inverse-surface`
| `--mi-language-tabs-icon-text-management` | `--mi-inverse-surface`
| `--mi-language-tabs-icon-background-management` | `--mi-inverse-on-surface`
| `--mi-language-text` | `--mi-surface`
| `--mi-language-background` | `--mi-on-surface`
| `--mi-language-default-text` | `--mi-surface`
| `--mi-language-default-background-start` | `--mi-primary`
| `--mi-language-default-background-hint` | `--mi-secondary`
| `--mi-language-default-background-end` | `--mi-tertiary`
| `--mi-language-danger` | `#dc4446`
| `--mi-language-search-background` | `rgba(--mi-rgb-on-primary, 0.5)`

## API

### MiAppsLanguage `<mi-apps-language>`

#### `MiAppsLanguage` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `translate` | [`TranslateProperties`](./README.md#translateproperties-属性--properties-) | `{}` | 自动翻译配置
| `translateType` | `string` | `baidu` | 自动翻译类型 ( 默认: baidu )
| `data` | [`LanguageItemProperties[]`](./README.md#languageitemproperties-属性--properties-) | `[]` | 语言项数据 (首选, 次选 `getContentAction`)
| `category` | [`LanguageItemProperties[]`](./README.md#languageitemproperties-属性--properties-) | `[]` | 语言分类数据 (首选, 次选 `getCategoryAction`)
| `getCategoryAction` | `string \| function` | `''` | 获取语言分类接口地址或自定义方法 ( 必填 )
| `getCategoryMethod` | `string` | `get` | 获取语言分类接口的请求方式 ( `getCategoryAction` string 时有效 )
| `getCategoryParams` | `object` | `{}` | 获取语言分类接口参数
| `createCategoryAction` | `string \| function` | `''` | 创建语言分类接口地址或自定义方法
| `createCategoryMethod` | `string` | `post` | 创建语言分类接口的请求方式 ( `createCategoryAction` string 时有效 )
| `createCategoryParams` | `object` | `{}` | 创建语言分类接口参数
| `updateCategoryAction` | `string \| function` | `''` | 更新语言分类接口地址或自定义方法
| `updateCategoryMethod` | `string` | `put` | 更新语言分类接口的请求方式 ( `updateCategoryAction` string 时有效 )
| `updateCategoryParams` | `object` | `{}` | 更新语言分类接口参数
| `deleteCategoryAction` | `string \| function` | `''` | 删除语言分类接口地址或自定义方法
| `deleteCategoryMethod` | `string` | `delete` | 删除语言分类接口的请求方式 ( `deleteCategoryAction` string 时有效 )
| `deleteCategoryParams` | `object` | `{}` | 删除语言分类接口参数
| `setDefaultCategoryAction` | `string \| function` | `''` | 设置默认语言分类接口地址或自定义方法
| `setDefaultCategoryMethod` | `string` | `put` | 设置默认语言分类接口的请求方式 ( `setDefaultCategoryAction` string 时有效 )
| `setDefaultCategoryParams` | `object` | `{}` | 设置默认语言分类接口参数
| `checkCategoryExistAction` | `string \| function` | `''` | 检测语言分类是否存在接口地址或自定义方法
| `checkCategoryExistMethod` | `string` | `get` | 检测语言分类是否存在接口的请求方式 ( `checkCategoryExistAction` string 时有效 )
| `checkCategoryExistParams` | `object` | `{}` | 检测语言分类是否存在接口参数
| `getContentAction` | `string \| function` | `''` | 获取语言项接口地址或自定义方法
| `getContentMethod` | `string` | `get` | 获取语言项接口的请求方式 ( `getContentAction` string 时有效 )
| `getContentParams` | `object` | `{}` | 获取语言项接口参数
| `createContentAction` | `string \| function` | `''` | 创建语言项接口地址或自定义方法
| `createContentMethod` | `string` | `post` | 创建语言项接口的请求方式 ( `createContentAction` string 时有效 )
| `createContentParams` | `object` | `{}` | 创建语言项接口参数
| `batchCreateContentAction` | `string \| function` | `''` | 批量创建语言项接口地址或自定义方法
| `batchCreateContentMethod` | `string` | `post` | 批量创建语言项接口的请求方式 ( `batchCreateContentAction` string 时有效 )
| `batchCreateContentParams` | `object` | `{}` | 批量创建语言项接口参数
| `updateContentAction` | `string \| function` | `''` | 更新语言项接口地址或自定义方法
| `updateContentMethod` | `string` | `put` | 更新语言项接口的请求方式 ( `updateContentAction` string 时有效 )
| `updateContentParams` | `object` | `{}` | 更新语言项接口参数
| `updateContentStatusAction` | `string \| function` | `''` | 更新语言项状态接口地址或自定义方法
| `updateContentStatusMethod` | `string` | `put` | 更新语言项状态接口的请求方式 ( `updateContentStatusAction` string 时有效 )
| `updateContentStatusParams` | `object` | `{}` | 更新语言项状态接口参数
| `deleteContentAction` | `string \| function` | `''` | 删除语言项接口地址或自定义方法
| `deleteContentMethod` | `string` | `delete` | 删除语言项接口的请求方式 ( `deleteContentAction` string 时有效 )
| `deleteContentParams` | `object` | `{}` | 删除语言项接口参数
| `searchContentAction` | `string \| function` | `''` | 搜索语言项接口地址或自定义方法
| `searchContentMethod` | `string` | `get` | 搜索语言项接口的请求方式 ( `searchContentAction` string 时有效 )
| `searchContentParams` | `object` | `{}` | 搜索语言项接口参数
| `checkContentExistAction` | `string \| function` | `''` | 检测语言项是否存在接口地址或自定义方法
| `checkContentExistMethod` | `string` | `get` | 检测语言项是否存在接口的请求方式 ( `checkContentExistAction` string 时有效 )
| `checkContentExistParams` | `object` | `{}` | 检测语言项是否存在接口参数
| `showBuiltinLanguages` | `boolean` | `true` | 是否显示内置语言项
| `paginationLocale` | `object` | `{}` | 是否显示内置语言项
| `getModuleAction` | `string \| function` | `''` | 获取模块列表接口地址或自定义方法
| `getModuleMethod` | `string` | `get` | 获取模块列表接口的请求方式 ( `getModuleAction` string 时有效 )
| `getModuleParams` | `object` | `{}` | 获取模块列表接口参数
| `createModuleAction` | `string \| function` | `''` | 新增模块接口地址或自定义方法
| `createModuleMethod` | `string` | `post` | 新增模块接口的请求方式 ( `createModuleAction` string 时有效 )
| `createModuleParams` | `object` | `{}` | 新增模块接口参数
| `updateModuleAction` | `string \| function` | `''` | 更新模块接口地址或自定义方法
| `updateModuleMethod` | `string` | `put` | 更新模块接口的请求方式 ( `updateModuleAction` string 时有效 )
| `updateModuleParams` | `object` | `{}` | 更新模块接口参数
| `deleteModuleAction` | `string \| function` | `''` | 删除模块接口地址或自定义方法
| `deleteModuleMethod` | `string` | `delete` | 删除模块接口的请求方式 ( `deleteModuleAction` string 时有效 )
| `deleteModuleParams` | `object` | `{}` | 删除模块接口参数
| `checkModuleExistAction` | `string \| function` | `''` | 检测模块是否存在接口地址或自定义方法
| `checkModuleExistMethod` | `string` | `get` | 检测模块是否存在接口的请求方式 ( `deleteModuleAction` string 时有效 )
| `checkModuleExistParams` | `object` | `{}` | 检测模块是否存在接口参数

#### `LanguageItemProperties` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `id` | `string \| number` | `''` | 语言项 id
| `uid` | `string \| number` | `''` | 语言项 uid
| `cid` | `string \| number` | `''` | 语系 id
| `mid` | `string \| number` | `''` | 模块 id
| `module` | `string` | `''` | 模块显示名称
| `key` | `string` | `''` | 语言项 key
| `language` | `string` | `''` | 语言项内容 ( 针对语系有效 )
| `is_default` | `number` | `''` | 是否默认
| `type` | `string` | `''` | 语言类型

#### `TranslateProperties` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `baidu` | [`BaiduTranslateProperties`](./README.md#baidutranslateproperties-属性--properties-) | `{}` | 百度翻译配置
| `languages` | `Record<string, string>` | `{}` | 自定义翻译语言列表
| `defaultLanguage` | `string` | `''` | 自定义翻译语言列表默认选中值
| `translate` | `function` | *`None`* | 自定义翻译功能

#### `BaiduTranslateProperties` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `url` | `string` | `api/trans/vip/translate` | 翻译接口地址
| `key` | `string \| number` | `''` | 翻译接口 key 值
| `appid` | `string \| number` | `''` | 翻译接口 appid

#### `LanguageModuleProperties` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `id` | `string \| number` | `''` | 序号
| `key` | `string` | `''` | 唯一值
| `name` | `string` | `''` | 名称

#### `MiAppsLanguage` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `afterGetContent` | [`ResponseData`](../../utils/README.md) \| *None*  | 获取单个语系的语言项 - 成功后的回调
| `afterCreateContent` | [`ResponseData`](../../utils/README.md) \| *None* | 创建语言项 - 成功后的回调
| `afterUpdateContent` | [`ResponseData`](../../utils/README.md) \| *None* | 更新语言项 - 成功后的回调
| `afterUpdateContentStatus` | [`ResponseData`](../../utils/README.md) \| *None* | 更新语言项状态 - 成功后的回调
| `afterBatchDeleteContent` | [`ResponseData`](../../utils/README.md) \| *None* | 批量删除语系内容 - 成功后的回调
| `afterGetCategory` | [`ResponseData`](../../utils/README.md) \| *None* | 获取语系分类 - 成功后的回调
| `afterCreateCategory` | [`ResponseData`](../../utils/README.md) \| *None* | 创建语系分类 - 成功后的回调
| `afterUpdateCategory` | [`ResponseData`](../../utils/README.md) \| *None* | 更新语系分类 - 成功后的回调
| `afterDeleteCategory` | [`ResponseData`](../../utils/README.md) \| *None* | 删除语系分类 - 成功后的回调
| `afterAutomaticTranslate` | [`ResponseData`](../../utils/README.md) \| *None* | 自动翻译 - 成功后的回调
| `afterGetModule` | [`ResponseData`](../../utils/README.md) \| *None* | 获取模块 - 成功后的回调
| `afterCreateModule` | [`ResponseData`](../../utils/README.md) \| *None* | 创建模块 - 成功后的回调
| `afterDeleteModule` | [`ResponseData`](../../utils/README.md) \| *None* | 删除模块 - 成功后的回调
| `afterUpdateModule` | [`ResponseData`](../../utils/README.md) \| *None* | 更新模块 - 成功后的回调
