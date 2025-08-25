# Tech Tavern

This is a project for website of Tech Tavern, LLC.

## Note on Windows Dev Setup

Because I seem to like the way of pain, I'm developing this on a Windows machine while using WSL.
Which causes problems with commanes like `npm run dev` and such.  So I've setup npm commands to
run through a win-npm wrapper instead.

The setup is as follows:

```bash
# Create wrapper scripts directory
mkdir -p ~/bin

# Create the win-npm wrapper
cat > ~/bin/win-npm << 'EOF'
#!/bin/bash
WIN_PATH=$(wslpath -w "$(pwd)")
powershell.exe -Command "cd '$WIN_PATH'; npm $*"
EOF

# Make it executable
chmod +x ~/bin/win-npm

# Add to PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
```

From there I just put the following my CLAUDE.md file

```markdown
# NextJS Windows Project

This project uses Windows npm through PowerShell. 

**Use `win-npm` instead of `npm` for all package management:**
- `win-npm install`
- `win-npm run dev` 
- `win-npm run build`

The development server runs on Windows for proper file watching.
```

Lastly, I add permissions explicitly to the claude local settings.

```json
{
    "permissions": {
      "allow": [
        "Bash(npm-win install)",
        "Bash(npm-win run build)",
        "Bash(npm-win run dev)",
        "Bash(npm-win run test)"
      ],
      "deny": [
        "Bash(npm install)",
        "Bash(npm run build)",
        "Bash(npm run dev)",
        "Bash(npm run test)"
      ],
      "ask": [],
      "defaultMode": "acceptEdits"
    }
  }
```
