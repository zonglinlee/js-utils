# 业务代码工具库

## 开发

```shell
npm install
# 代码格式化
npm run prettier
# 提交代码
npm run cz
# 代码测试
npm run test
```

## browser 引入

```js
<script src="./@zonglinlee/js-utils/dist/umd/bundle.min.js"></script>
<script>
    const type = window.JsUtils.checkType('JsUtils', true)
    console.log(type);
</script>
```
