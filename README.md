# 客户端平台类型检测

用于检测客户端平台类型

## 使用

```ts
import whichPlat from "@x-drive/which-platform";

// 自动尝试从当前 window 中获取平台信息
const autoGetPlatInfo = whichPlat();

// 根据传入的字符串获取
// 如页面中直接读取 userAgent 或 nodeJS 请求中获取 request headers 中的 user-agent
const getPlatInfo = whichPlat(window.navigator.userAgent);
```