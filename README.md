# 🚀 ReactApp Project Setup

> A powerful, beginner-friendly CLI tool to scaffold modern web projects in seconds with React, Vue, Svelte, and more!


## ✨ Features

- 🎨 **Multiple Frameworks** - React, Vue, Svelte, Preact, Lit, or Vanilla JS
- 📘 **TypeScript & JavaScript** - Choose your preferred language
- ⚡ **Vite Powered** - Lightning-fast development experience
- 🎨 **Tailwind CSS v4** - Optional utility-first CSS framework with new Vite plugin approach
- 🧭 **Router Support** - Optional routing setup for React, Vue, and Svelte
- 📁 **Organized Structure** - Pre-configured folder structure
- 🎯 **Beginner Friendly** - Beautiful CLI with clear instructions
- 🚀 **Zero Config** - Start coding immediately

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g reactapp-project-setup
```

### One-time Use (npx)

```bash
npx reactapp-project-setup
```

## 🎯 Usage

Simply run the command:

```bash
reactapp
```

Then follow the interactive prompts:

```
┌─ 📁 Project name: my-awesome-app
└──
┌─ 🎨 Choose your framework:   ⚛️   React - The UI library everyone loves
└──
┌─ 📝 Select your language:   📘   TypeScript - Type-safe & scalable
└──
┌─ 🎨 Add Tailwind CSS? [ YES ]
└──
┌─ 🧭 Include router? [ NO ]
└──
┌─ 📁 Organized folder structure? [ YES ]
└──
```

The CLI features a neofetch-inspired banner design with SA ASCII on the left and system information on the right:

```
  ██████╗ ██████╗ │ Package:     reactapp-project-setup
  ╚════██╗╚════██╗│ Version:     v4.8.0
   █████╔╝ █████╔╝│ Created:     2025
   ╚═══██╗ ╚═══██╗│ License:     MIT
  ██████╔╝██████╔╝│ OS:          Node.js >=18.0.0
  ╚═════╝ ╚═════╝ │ Shell:       CLI Interface
                  │ Terminal:    Inquirer.js
                  │ Author:      Shahnawas Adeel
                  │ GitHub:      mdadeel/reactapp-project-setup

  🚀 Create Modern Web Apps in Seconds
  The fastest way to scaffold your next project
```

### Quick Example

```bash
# Install globally
npm install -g reactapp-project-setup

# Create a new project
reactapp

# Follow prompts, then:
cd my-awesome-app
npm run dev
```

## 🛠️ What You Get

### Framework Options

| Framework | Description | Size |
|-----------|-------------|------|
| ⚛️ React | Most popular UI library | ~45 KB |
| 💚 Vue | Progressive framework | ~34 KB |
| 🔺 Svelte | No virtual DOM, truly reactive | ~2 KB |
| 🔷 Preact | Fast 3KB React alternative | ~3 KB |
| 🔶 Lit | Lightweight web components | ~5 KB |
| ⚡ Vanilla | Pure JavaScript, no framework | 0 KB |

### Project Structure

After scaffolding, your project will have:

```
my-awesome-app/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks (React)
│   ├── assets/         # Images, fonts, etc.
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

### Optional Features

- **Tailwind CSS v4** - Pre-configured utility-first CSS framework with new Vite plugin approach
- **Router** - Navigation setup (React Router, Vue Router, or Svelte Routing)
- **Organized Folders** - Clean, scalable project structure

## 🎨 Supported Tech Stacks

### React
- ✅ React 18+
- ✅ JavaScript or TypeScript
- ✅ React Router (optional)
- ✅ Tailwind CSS (optional)

### Vue
- ✅ Vue 3+
- ✅ JavaScript or TypeScript
- ✅ Vue Router (optional)
- ✅ Tailwind CSS (optional)

### Svelte
- ✅ Svelte 4+
- ✅ JavaScript or TypeScript
- ✅ Svelte Routing (optional)
- ✅ Tailwind CSS (optional)

### Others
- ✅ Preact with Tailwind
- ✅ Lit (JavaScript or TypeScript)
- ✅ Vanilla JS/TS

## 📚 Commands

Once your project is created:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Example Projects

### Create a React + TypeScript + Tailwind app

```bash
reactapp
# Choose: React → TypeScript → Tailwind: Yes
```

### Create a Vue 3 app with router

```bash
reactapp
# Choose: Vue → JavaScript → Router: Yes
```

### Create a minimal Svelte app

```bash
reactapp
# Choose: Svelte → JavaScript → Tailwind: No → Router: No
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev)
- Powered by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- Styled with [Chalk](https://github.com/chalk/chalk)
- Inspired by [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)

## 📧 Support

- 🐛 [Report Issues](https://github.com/mdadeel/reactapp-project-setup/issues)
- 💬 [Discussions](https://github.com/mdadeel/reactapp-project-setup/discussions)
- 📧 Email: mdadeel125@gmail.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by [Shahnawas Adeel](https://github.com/mdadeel)
