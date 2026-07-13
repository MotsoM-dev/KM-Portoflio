# MotsoM-Dev Portfolio

Next.js portfolio app for Kgomotso Mathombo.

## Run The App On Windows

Use the launcher:

```powershell
.\run-dev.cmd
```

You can also double-click `run-dev.cmd` in File Explorer.

PowerShell may block `npm run dev` because it tries to execute `npm.ps1`. If you want to use npm directly, use:

```powershell
npm.cmd run dev
```

Next.js will print the local URL. It is usually:

```text
http://127.0.0.1:3000
```

If port 3000 is already being used, Next may choose another port. Open the URL shown in the terminal.

## If Dependencies Are Missing

```powershell
npm.cmd install
```

Then run the app again.

## Other Commands

```powershell
npm.cmd run build
npm.cmd run start
```