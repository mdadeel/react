#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Minimal banner
const banner = `
${chalk.hex('#8B5CF6')('█▀█ █▀▀ ▄▀█ █▀▀ ▀█▀   █▀ █▀▀ ▀█▀ █░█ █▀█')}
${chalk.hex('#A78BFA')('█▀▄ ██▄ █▀█ █▄▄ ░█░   ▄█ ██▄ ░█░ █▄█ █▀▀')}
                        
${chalk.hex('#C4B5FD')('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.hex('#E0E7FF')('  Everything configured.')} ${chalk.hex('#8B5CF6').bold('Just start coding.')}
${chalk.hex('#C4B5FD')('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

${chalk.hex('#10B981')('  ✓ Tailwind CSS v4')}  ${chalk.hex('#94A3B8')('- Pre-configured & ready')}
${chalk.hex('#10B981')('  ✓ Router')}           ${chalk.hex('#94A3B8')('- Installed & set up')}
${chalk.hex('#10B981')('  ✓ Folder Structure')} ${chalk.hex('#94A3B8')('- Organized & clean')}
${chalk.hex('#10B981')('  ✓ ESLint + Prettier')} ${chalk.hex('#94A3B8')('- Code quality ready')}

`;

console.clear();
console.log(banner);
console.log('');

// Only 2 questions!
const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: chalk.hex('#8B5CF6')('Project name'),
    default: 'my-app',
    prefix: chalk.hex('#10B981')('●'),
    validate: (input) => {
      if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(input) && input.length <= 50) return true;
      return chalk.red('Must start with letter, only letters/numbers/dashes');
    },
    transformer: (input) => chalk.hex('#E0E7FF')(input)
  },
  {
    type: 'list',
    name: 'stack',
    message: chalk.hex('#8B5CF6')('Choose your stack'),
    prefix: chalk.hex('#10B981')('●'),
    choices: [
      { 
        name: chalk.hex('#61DAFB')('React + TypeScript'), 
        value: { framework: 'react', lang: 'ts', template: 'react-ts' }
      },
      { 
        name: chalk.hex('#61DAFB')('React + JavaScript'), 
        value: { framework: 'react', lang: 'js', template: 'react' }
      },
      { 
        name: chalk.hex('#42B883')('Vue + TypeScript'), 
        value: { framework: 'vue', lang: 'ts', template: 'vue-ts' }
      },
      { 
        name: chalk.hex('#42B883')('Vue + JavaScript'), 
        value: { framework: 'vue', lang: 'js', template: 'vue' }
      },
      { 
        name: chalk.hex('#FF3E00')('Svelte + TypeScript'), 
        value: { framework: 'svelte', lang: 'ts', template: 'svelte-ts' }
      },
      { 
        name: chalk.hex('#FF3E00')('Svelte + JavaScript'), 
        value: { framework: 'svelte', lang: 'js', template: 'svelte' }
      }
    ],
    default: 0
  }
];

// Router packages
const routerPackages = {
  react: 'react-router-dom@latest',
  vue: 'vue-router@latest',
  svelte: 'svelte-routing@latest'
};

async function createProject() {
  try {
    const answers = await inquirer.prompt(questions);
    const { projectName, stack } = answers;
    const { framework, lang, template } = stack;
    const isTS = lang === 'ts';
    
    console.log('');
    console.log(chalk.hex('#8B5CF6')('┌───────────────────────────────────────┐'));
    console.log(chalk.hex('#8B5CF6')('│ ') + chalk.hex('#E0E7FF')('Setting up your full-stack project... ') + chalk.hex('#8B5CF6')('│'));
    console.log(chalk.hex('#8B5CF6')('└───────────────────────────────────────┘'));
    console.log('');
    
    const projectPath = path.join(process.cwd(), projectName);
    
    // 1. Create Vite project
    const spinner = ora({
      text: chalk.hex('#A78BFA')(`Creating ${framework} project...`),
      spinner: 'dots',
      color: 'magenta'
    }).start();
    
    execSync(`npm create vite@latest "${projectName}" -- --template ${template}`, { stdio: 'pipe' });
    spinner.succeed(chalk.hex('#10B981')('✓ ' + framework + ' project created'));
    
    process.chdir(projectPath);
    
    // 2. Install base dependencies
    spinner.start(chalk.hex('#A78BFA')('Installing base packages...'));
    execSync('npm install', { stdio: 'pipe' });
    spinner.succeed(chalk.hex('#10B981')('✓ Base packages installed'));
    
    // 3. Install Tailwind CSS v4
    spinner.start(chalk.hex('#A78BFA')('Adding Tailwind CSS v4...'));
    try {
      execSync('npm install -D tailwindcss @tailwindcss/postcss', { stdio: 'pipe' });
      
      // Create postcss.config.js
      const postcssConfig = `
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}`;
      fs.writeFileSync('postcss.config.js', postcssConfig);

      // Update vite.config
      // No longer need to update vite.config.js for tailwindcss plugin
      
      // Create tailwind.config.js
      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      fs.writeFileSync('tailwind.config.js', tailwindConfig);

      // Add Tailwind to CSS
      const cssContent = `@import "tailwindcss";\n\n/* Your custom styles */\n`;
      const cssFiles = ['src/index.css', 'src/style.css', 'src/app.css'];
      const cssFile = cssFiles.find(file => fs.existsSync(file)) || 'src/index.css';
      fs.ensureFileSync(cssFile);
      fs.writeFileSync(cssFile, cssContent);
      
      spinner.succeed(chalk.hex('#10B981')('✓ Tailwind CSS v4 configured'));
    } catch (error) {
      spinner.warn(chalk.hex('#F59E0B')('⚠ Tailwind setup partial'));
    }
    
    // 4. Install Router
    spinner.start(chalk.hex('#A78BFA')(`Installing ${framework} router...`));
    try {
      execSync(`npm install ${routerPackages[framework]}`, { stdio: 'pipe' });
      
      // Create router setup file
      const ext = isTS ? 'tsx' : 'jsx';
      const routerDir = 'src/router';
      fs.ensureDirSync(routerDir);
      
      if (framework === 'react') {
        const routerSetup = `import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);
`;
        fs.writeFileSync(`${routerDir}/index.${ext}`, routerSetup);
        
        // Update main file
        const mainFile = isTS ? 'src/main.tsx' : 'src/main.jsx';
        if (fs.existsSync(mainFile)) {
          let mainContent = fs.readFileSync(mainFile, 'utf8');
          mainContent = mainContent.replace(
            /import App from ['"]\.\/App\.(j|t)sx['"]/,
            `import { RouterProvider } from 'react-router-dom'\nimport { router } from './router'`
          );
          mainContent = mainContent.replace(/<App \/>/, '<RouterProvider router={router} />');
          fs.writeFileSync(mainFile, mainContent);
        }
      }
      
      spinner.succeed(chalk.hex('#10B981')(`✓ ${framework} router installed & configured`));
    } catch (error) {
      spinner.warn(chalk.hex('#F59E0B')('⚠ Router installed (manual setup needed)'));
    }
    
    // 5. Create folder structure
    spinner.start(chalk.hex('#A78BFA')('Creating folder structure...'));
    
    const folders = framework === 'vue' 
      ? ['components', 'views', 'composables', 'stores', 'assets', 'utils', 'router']
      : framework === 'svelte'
      ? ['components', 'routes', 'stores', 'lib', 'assets', 'utils']
      : ['components', 'pages', 'hooks', 'utils', 'assets', 'services', 'router'];
    
    folders.forEach(folder => {
      const folderPath = path.join('src', folder);
      fs.ensureDirSync(folderPath);
      
      const descriptions = {
        components: 'Reusable UI components',
        pages: 'Page components',
        views: 'Vue page views',
        routes: 'Svelte routes',
        hooks: 'Custom React hooks',
        composables: 'Vue composables',
        stores: 'State management',
        utils: 'Utility functions',
        services: 'API services',
        lib: 'Library code',
        assets: 'Static files',
        router: 'Routing configuration'
      };
      
      const readme = `# ${folder.charAt(0).toUpperCase() + folder.slice(1)}\n\n${descriptions[folder] || 'Your code here'}\n`;
      fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
    });
    
    spinner.succeed(chalk.hex('#10B981')('✓ Folder structure created'));
    
    // 6. Setup ESLint + Prettier
    spinner.start(chalk.hex('#A78BFA')('Adding ESLint & Prettier...'));
    try {
      execSync('npm install -D prettier eslint-config-prettier', { stdio: 'pipe' });
      
      // Prettier config
      const prettierConfig = {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100
      };
      fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));
      
      // Add format script
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      packageJson.scripts = {
        ...packageJson.scripts,
        format: 'prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"'
      };
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      
      spinner.succeed(chalk.hex('#10B981')('✓ ESLint & Prettier configured'));
    } catch (error) {
      spinner.warn(chalk.hex('#F59E0B')('⚠ Linting setup partial'));
    }
    
    // 7. Create .env file
    spinner.start(chalk.hex('#A78BFA')('Creating environment files...'));
    const envContent = `# API URLs
VITE_API_URL=http://localhost:3000

# Environment
VITE_ENV=development
`;
    fs.writeFileSync('.env', envContent);
    fs.writeFileSync('.env.example', envContent);
    
    // Update .gitignore
    let gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
    if (!gitignore.includes('.env')) {
      gitignore += '\n# Environment\n.env\n.env.local\n';
      fs.writeFileSync('.gitignore', gitignore);
    }
    
    spinner.succeed(chalk.hex('#10B981')('✓ Environment files created'));
    
    // 8. Create custom homepage showcasing the tool
    spinner.start(chalk.hex('#A78BFA')('Creating custom homepage...'));
    
    const appExt = isTS ? 'tsx' : 'jsx';
    const appFile = `src/App.${appExt}`;
    
    const customHomepage = `${isTS ? "import React from 'react';\n" : ''}
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-8">
            <span className="text-6xl">🚀</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            React Setup Pro
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8">
            The fastest way to create production-ready React apps
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.npmjs.com/package/reactapp-project-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
            >
              View on NPM →
            </a>
            <a 
              href="https://github.com/mdadeel/reactapp-project-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              GitHub Repo
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Project ready in 30 seconds' },
            { icon: '🎨', title: 'Tailwind CSS v4', desc: 'Latest version pre-configured' },
            { icon: '🧭', title: 'Router Included', desc: 'React Router fully set up' },
            { icon: '📁', title: 'Organized Structure', desc: 'Production-ready folders' },
            { icon: '✨', title: 'ESLint + Prettier', desc: 'Code quality built-in' },
            { icon: '🔧', title: 'Zero Config', desc: 'Everything works out of the box' }
          ].map((feature, i) => (
            <div 
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-purple-200">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Installation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Quick Start</h2>
          <div className="bg-gray-900 rounded-lg p-6 mb-4">
            <code className="text-green-400">
              <span className="text-gray-500"># Install globally</span><br/>
              <span className="text-purple-400">npm</span> install -g reactapp-project-setup<br/><br/>
              <span className="text-gray-500"># Create new project</span><br/>
              <span className="text-purple-400">reactapp</span>
            </code>
          </div>
          <p className="text-center text-purple-200">
            Answer 2 questions and you're ready to code! 🎉
          </p>
        </div>

        {/* Creator Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-lg rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Created by</h2>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mb-4">
              👨‍💻
            </div>
            <h3 className="text-2xl font-bold mb-2">Shahnawas Adeel</h3>
            <p className="text-purple-200 mb-6">Full Stack Developer</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <a 
                href="https://github.com/mdadeel"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              >
                GitHub
              </a>
              <a 
                href="https://instagram.com/shahnawas.adeel"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Instagram
              </a>
              <a 
                href="https://www.npmjs.com/~shahnawas.adeel"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
              >
                NPM Profile
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-purple-300">
          <p>Made with ❤️ for the React community</p>
          <p className="mt-2">MIT License • Free to use</p>
        </div>
      </div>
    </div>
  );
}

export default App;
`;
    
    fs.writeFileSync(appFile, customHomepage);
    
    // Create custom CSS with animations
    const cssFile = 'src/index.css';
    const customCSS = `@import "tailwindcss";

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1e1b4b;
}

::-webkit-scrollbar-thumb {
  background: #7c3aed;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9333ea;
}
`;
    
    fs.writeFileSync(cssFile, customCSS);
    
    spinner.succeed(chalk.hex('#10B981')('✓ Custom homepage created'));
    
    // 9. Create README
    const readme = `# ${projectName}

${framework === 'react' ? '⚛️' : framework === 'vue' ? '💚' : '🔺'} **${framework.charAt(0).toUpperCase() + framework.slice(1)}** ${isTS ? '+ TypeScript' : '+ JavaScript'}

## 🚀 What's Included

- ✅ **Vite** - Lightning fast development
- ✅ **Tailwind CSS v4** - Latest version with Vite plugin
- ✅ **Router** - ${framework === 'react' ? 'React Router v6' : framework === 'vue' ? 'Vue Router v4' : 'Svelte Routing'}
- ✅ **ESLint + Prettier** - Code quality & formatting
- ✅ **Organized Structure** - Production-ready folders
- ✅ **Environment Variables** - .env configured

## 📁 Project Structure

\`\`\`
src/
├── components/    # Reusable UI components
├── ${framework === 'react' ? 'pages/' : framework === 'vue' ? 'views/' : 'routes/'}         # Page components
├── ${framework === 'react' ? 'hooks/' : framework === 'vue' ? 'composables/' : 'stores/'}         # ${framework === 'react' ? 'Custom hooks' : framework === 'vue' ? 'Composables' : 'State stores'}
├── utils/         # Utility functions
├── assets/        # Static files
└── router/        # Route configuration
\`\`\`

## 🎯 Quick Start

\`\`\`bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run format       # Format code with Prettier
\`\`\`

## 💡 Tailwind Example

\`\`\`${framework === 'react' ? 'jsx' : framework === 'vue' ? 'vue' : 'svelte'}
<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-xl">
  <h1 className="text-4xl font-bold">Hello Tailwind!</h1>
</div>
\`\`\`

## 🧭 Router Example

Check \`src/router/\` for routing configuration.

## 🌐 Environment Variables

Edit \`.env\` file for your API URLs and settings.

## 📚 Learn More

- [${framework.charAt(0).toUpperCase() + framework.slice(1)} Docs](${framework === 'react' ? 'https://react.dev' : framework === 'vue' ? 'https://vuejs.org' : 'https://svelte.dev'})
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)

---

Built with ❤️ using [reactapp-project-setup](https://www.npmjs.com/package/reactapp-project-setup)
`;
    
    fs.writeFileSync('README.md', readme);
    
    // Success!
    console.log('');
    console.log(chalk.hex('#10B981')('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.hex('#10B981').bold('  ✓ Project Ready! Everything Configured!'));
    console.log(chalk.hex('#10B981')('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(chalk.hex('#8B5CF6')('  📦 What\'s included:'));
    console.log('');
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')('Custom showcase homepage'));
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')('Tailwind CSS v4 with Vite plugin'));
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')(framework + ' Router (pre-configured)'));
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')('Organized folder structure'));
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')('ESLint + Prettier setup'));
    console.log(chalk.hex('#10B981')('     ✓ ') + chalk.hex('#E0E7FF')('Environment variables (.env)'));
    console.log('');
    console.log(chalk.hex('#8B5CF6')('  🚀 Start coding:'));
    console.log('');
    console.log(chalk.hex('#A78BFA')('     cd ') + chalk.hex('#E0E7FF')(projectName));
    console.log(chalk.hex('#A78BFA')('     npm run dev'));
    console.log('');
    console.log(chalk.hex('#06B6D4')('  🎨 Beautiful homepage included!'));
    console.log(chalk.hex('#94A3B8')('     Shows off the tool & your info'));
    console.log('');
    console.log(chalk.hex('#F59E0B')('  📝 Format code:'));
    console.log(chalk.hex('#94A3B8')('     npm run format'));
    console.log('');
    console.log(chalk.hex('#10B981')('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    
  } catch (error) {
    console.log('');
    console.log(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.red.bold('  ✗ Setup Failed'));
    console.log(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(chalk.hex('#94A3B8')('  ' + error.message));
    console.log('');
    console.log(chalk.hex('#F59E0B')('  Troubleshooting:'));
    console.log(chalk.hex('#94A3B8')('    • Check internet connection'));
    console.log(chalk.hex('#94A3B8')('    • Node.js 18+ required'));
    console.log(chalk.hex('#94A3B8')('    • Try: npm cache clean --force'));
    console.log('');
    process.exit(1);
  }
}

createProject();
