[“TypeScript configuration best practices”](https://notes.shiv.info/javascript/2025/04/21/tsconfig-best-practices/):

*Published: April 21, 2025*  
*Author: Shiv's Notes*

# TypeScript Configuration Best Practices

TypeScript has become the backbone of modern JavaScript development, offering type safety and enhanced developer experience across a variety of environments. This guide breaks down optimal configurations for different scenarios and provides practical recommendations for your `tsconfig.json` and `package.json`.

---

## 🔧 Key Configuration Options

- **`target`**: ECMAScript version to transpile to.
- **`module`**: Output module system (CommonJS, ESM, etc.).
- **`moduleResolution`**: Strategy for resolving imports.

---

## 🖥️ Node.js Applications

### Modern Node.js (v16+)

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "sourceMap": true,
    "strict": true
  }
}
```

**package.json**
```json
{
  "type": "module",
  "engines": {
    "node": ">=22.14.0"
  }
}
```

### Node.js v14

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```

**package.json**
```json
{
  "type": "module",
  "engines": {
    "node": ">=14.17.0"
  }
}
```

---

## 🌐 Browser Applications

### Modern Browsers with Bundler

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "noEmit": true,
    "strict": true
  }
}
```

### Supporting IE11

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

**package.json (React apps)**
```json
{
  "type": "module",
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

---

## 📦 Libraries and Packages

### Dual-Module (ESM + CJS)

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true
  }
}
```

**package.json**
```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false
}
```

**Build Scripts**
```json
{
  "scripts": {
    "build:esm": "tsc --outDir dist",
    "build:cjs": "tsc --module commonjs --outDir dist/cjs",
    "build": "npm run build:esm && npm run build:cjs && node scripts/create-package-json.js"
  }
}
```

---

## ⚡ Special Cases

### Electron Apps

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

---

## 🧩 Monorepos

Use a base `tsconfig.json` and extend it for:

- Node.js backend
- Browser frontend

---

## 💡 Pro Tips

1. `"sideEffects": false` in `package.json` enables tree-shaking.
2. Use `moduleResolution: "Bundler"` for bundler projects.
3. Enable `strict: true` by default.
4. Use `exports` in `package.json` for clear module entry points.

---

## 📋 Quick Reference Table

| Scenario                                | target  | module   | moduleResolution | Notes                                      |
|----------------------------------------|---------|----------|------------------|--------------------------------------------|
| Modern Node.js (v22+)                  | ESNext  | NodeNext | NodeNext         | Best for current Node.js LTS               |
| Node.js (v14)                          | ES2020  | Node16   | Node16           | Slightly older Node.js                     |
| Legacy Node.js (<v14)                  | ES2018  | CommonJS | Node             | Compatibility with older Node.js           |
| Modern browsers with bundler           | ES2020  | ESNext   | Bundler          | Optimal for modern browser apps            |
| Supporting older browsers (IE11)       | ES5     | ESNext   | Bundler          | Bundler handles transpilation and polyfills|
| Dual-environment library               | ES2020  | ESNext   | NodeNext         | Works in both Node.js and browsers         |
| Electron applications                  | ES2020  | NodeNext | NodeNext         | Main process uses Node.js                  |

---

Happy coding!  
*Original article by Shiv’s Notes*  
[Read the full post](https://notes.shiv.info/javascript/2025/04/21/tsconfig-best-practices/)