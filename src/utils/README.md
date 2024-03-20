### Interface `DeviceSize` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `laptop` | `string \| number` | `''` | 电脑端
| `mobile` | `string \| number` | `''` | 移动端
| `tablet` | `string \| number` | `''` | 平板端

### Interface `ResponseData` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `ret` | [`ResponseRet`](./README.md) | `{}` | 电脑端
| `data` | `any` | `''` | 响应数据

### Interface `ResponseRet` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `code` | `string \| number` | `''` | 状态码
| `message` | `string` | `''` | 信息
