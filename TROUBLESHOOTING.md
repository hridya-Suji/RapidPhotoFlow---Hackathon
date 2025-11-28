# Troubleshooting "Connection to Host Failed"

## Common Causes and Solutions

### 1. Port Already in Use
If port 5173 is already in use, Vite will fail to start.

**Solution:**
```bash
# Option 1: Kill the process using port 5173
# Windows PowerShell:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Option 2: Use a different port
npm run dev -- --port 3000
```

Or update `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true // Allow external connections
  }
})
```

### 2. Dependencies Not Installed
Make sure all dependencies are installed:

```bash
cd RapidPhotoFlow
npm install
```

### 3. Firewall/Antivirus Blocking
- Check Windows Firewall settings
- Temporarily disable antivirus to test
- Add Vite to firewall exceptions

### 4. Start the Dev Server
```bash
cd RapidPhotoFlow
npm run dev
```

The server should start and show:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Check for Errors
Look for error messages in the terminal when running `npm run dev`. Common issues:
- Missing dependencies
- Syntax errors in code
- Port conflicts
- Node version incompatibility

### 6. Clear Cache and Reinstall
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try again
npm run dev
```

### 7. Check Node Version
Vite requires Node.js 18+:
```bash
node --version
```

If version is too old, update Node.js from nodejs.org

