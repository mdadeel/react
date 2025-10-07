#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Beautiful ASCII Art Banner
const banner = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   	██████╗ ███████╗ █████╗  ██████╗████████╗           ║
║   	██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝           ║
║   	██████╔╝█████╗  ███████║██║        ██║              ║
║  	██╔══██╗██╔══╝  ██╔══██║██║        ██║              ║
║  	██║  ██║███████╗██║  ██║╚██████╗   ██║              ║
║   	╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝              ║
║                                                           ║
║              🚀 Project Setup - v2.0.5                    ║
║         Create modern web apps in seconds!                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

console.clear();
console.log(chalk.magenta(banner));
console.log(chalk.bold.cyan('  💡 Navigation Tips:'));
console.log(chalk.gray('     • Use ↑↓ arrow keys to move'));
console.log(chalk.gray('     • Press Enter to confirm'));
console.log(chalk.gray('     • Selected option will be ') + chalk.magenta.bold('highlighted') + chalk.gray(' in magenta\n'));

// Enhanced prompts with custom colors and arrow
const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: chalk.bold.magenta('📦 Project name:'),
    default: 'my-app',
    prefix: chalk.magenta('❯'),
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      return chalk.red('❌ Project name can only contain letters, numbers, dashes and underscores');
    },
    transformer: (input) => chalk.cyan(input)
  },
  {
    type: 'list',
    name: 'framework',
    message: chalk.bold.magenta('🎨 Choose your framework:'),
    prefix: chalk.magenta('❯'),
    choices: [
      { 
        name: '⚛️  React', 
        value: 'react',
        short: 'React'
      },
      { 
        name: '💚 Vue', 
        value: 'vue',
        short: 'Vue'
      },
      { 
        name: '🔺 Svelte', 
        value: 'svelte',
        short: 'Svelte'
      },
      { 
        name: '🔷 Preact', 
        value: 'preact',
        short: 'Preact'
      },
      { 
        name: '🔶 Lit', 
        value: 'lit',
        short: 'Lit'
      },
      { 
        name: '⚡ Vanilla', 
        value: 'vanilla',
        short: 'Vanilla'
      }
    ],
    default: 'react',
    pageSize: 6,
    loop: false
  },
  {
    type: 'list',
    name: 'language',
    message: chalk.bold.magenta('📝 Select your language:'),
    prefix: chalk.magenta('❯'),
    choices: [
      { 
        name: '📘 TypeScript', 
        value: 'typescript',
        short: 'TypeScript'
      },
      { 
        name: '📙 JavaScript', 
        value: 'javascript',
        short: 'JavaScript'
      }
    ],
    default: 'javascript',
    loop: false
  },
  {
    type: 'confirm',
    name: 'tailwind',
    message: chalk.bold.magenta('🎨 Add Tailwind CSS?') + chalk.gray(' (Utility-first CSS framework)'),
    prefix: chalk.magenta('❯'),
    default: true,
    when: (answers) => ['react', 'vue', 'svelte', 'preact'].includes(answers.framework),
    transformer: (answer) => answer ? chalk.cyan('✓ Yes') : chalk.red('✗ No')
  },
  {
    type: 'confirm',
    name: 'router',
    message: chalk.bold.magenta('🧭 Include router?') + chalk.gray(' (For multi-page navigation)'),
    prefix: chalk.magenta('❯'),
    default: false,
    when: (answers) => ['react', 'vue', 'svelte'].includes(answers.framework),
    transformer: (answer) => answer ? chalk.cyan('✓ Yes') : chalk.red('✗ No')
  },
  {
    type: 'confirm',
    name: 'folderStructure',
    message: chalk.bold.magenta('📁 Create organized folder structure?') + chalk.gray(' (Recommended)'),
    prefix: chalk.magenta('❯'),
    default: true,
    transformer: (answer) => answer ? chalk.cyan('✓ Yes') : chalk.red('✗ No')
  }
];

// Template mapping
const getTemplate = (framework, language) => {
  const templates = {
    react: language === 'typescript' ? 'react-ts' : 'react',
    vue: language === 'typescript' ? 'vue-ts' : 'vue',
    svelte: language === 'typescript' ? 'svelte-ts' : 'svelte',
    preact: language === 'typescript' ? 'preact-ts' : 'preact',
    lit: language === 'typescript' ? 'lit-ts' : 'lit',
    vanilla: language === 'typescript' ? 'vanilla-ts' : 'vanilla'
  };
  return templates[framework];
};

// Router packages
const getRouterPackage = (framework) => {
  const routers = {
    react: 'react-router-dom',
    vue: 'vue-router',
    svelte: 'svelte-routing'
  };
  return routers[framework];
};

// File extensions
const getFileExtension = (framework, language) => {
  if (language === 'typescript') {
    return framework === 'react' || framework === 'preact' ? 'tsx' : 'ts';
  }
  return framework === 'react' || framework === 'preact' ? 'jsx' : 'js';
};

// Draw a nice box
const drawBox = (title, content) => {
  const width = 55;
  console.log(chalk.magenta('┌' + '─'.repeat(width) + '┐'));
  console.log(chalk.magenta('│') + chalk.bold.cyan(title.padEnd(width)) + chalk.magenta('│'));
  console.log(chalk.magenta('├' + '─'.repeat(width) + '┤'));
  content.forEach(line => {
    console.log(chalk.magenta('│') + ' ' + line.padEnd(width - 1) + chalk.magenta('│'));
  });
  console.log(chalk.magenta('└' + '─'.repeat(width) + '┘'));
};

async function createProject() {
  try {
    const answers = await inquirer.prompt(questions);
    const { projectName, framework, language, tailwind, router, folderStructure } = answers;
    
    // Show framework description after selection
    const frameworkInfo = {
      react: { emoji: '⚛️', desc: 'The most popular library for building user interfaces' },
      vue: { emoji: '💚', desc: 'Progressive framework that\'s easy to learn and powerful' },
      svelte: { emoji: '🔺', desc: 'Truly reactive framework with no virtual DOM' },
      preact: { emoji: '🔷', desc: 'Fast 3KB alternative to React with the same API' },
      lit: { emoji: '🔶', desc: 'Simple, fast, and lightweight web components' },
      vanilla: { emoji: '⚡', desc: 'Pure JavaScript with no framework overhead' }
    };
    
    console.log('\n' + chalk.magenta('  ✓ Selected: ') + frameworkInfo[framework].emoji + ' ' + chalk.bold.cyan(framework.toUpperCase()));
    console.log(chalk.gray('    ' + frameworkInfo[framework].desc) + '\n');
    
    const projectPath = path.join(process.cwd(), projectName);
    const template = getTemplate(framework, language);
    const fileExt = getFileExtension(framework, language);
    const isTypeScript = language === 'typescript';
    
    // Display beautiful configuration summary
    console.log('\n');
    drawBox('  📋 YOUR CONFIGURATION', [
      '',
      `  ${chalk.gray('Project:')}      ${chalk.cyan.bold(projectName)}`,
      `  ${chalk.gray('Framework:')}    ${chalk.cyan.bold(framework.toUpperCase())}`,
      `  ${chalk.gray('Language:')}     ${chalk.cyan.bold(isTypeScript ? 'TypeScript' : 'JavaScript')}`,
      `  ${chalk.gray('Tailwind CSS:')} ${tailwind ? chalk.magenta.bold('✓ Yes') : chalk.red.bold('✗ No')}`,
      `  ${chalk.gray('Router:')}       ${router ? chalk.magenta.bold('✓ Yes') : chalk.red.bold('✗ No')}`,
      `  ${chalk.gray('Structure:')}    ${folderStructure ? chalk.magenta.bold('✓ Yes') : chalk.red.bold('✗ No')}`,
      ''
    ]);
    console.log('\n');
    
    // 1. Create Vite project with latest template
    const spinner = ora({
      text: chalk.magenta(`Creating ${framework} project with latest Vite...`),
      color: 'magenta',
      spinner: 'dots12'
    }).start();
    
    execSync(`npm create vite@latest ${projectName} -- --template ${template}`, { stdio: 'inherit' });
    spinner.succeed(chalk.cyan(`✓ ${framework.charAt(0).toUpperCase() + framework.slice(1)} project created with latest version!`));
    
    process.chdir(projectPath);
    
    // 2. Install dependencies
    spinner.start(chalk.magenta('Installing dependencies...'));
    execSync('npm install', { stdio: 'ignore' });
    spinner.succeed(chalk.cyan('✓ Dependencies installed!'));
    
    // 3. Setup Tailwind CSS (Latest Version)
    if (tailwind) {
      spinner.start(chalk.magenta('Setting up Tailwind CSS...'));
      
      try {
        // Install latest Tailwind CSS
        execSync('npm install -D tailwindcss@latest postcss@latest autoprefixer@latest', { stdio: 'ignore' });
        
        // Create tailwind.config.js manually instead of using init
        const contentPaths = {
          react: './src/**/*.{js,jsx,ts,tsx}',
          vue: './src/**/*.{vue,js,ts,jsx,tsx}',
          svelte: './src/**/*.{svelte,js,ts,jsx,tsx}',
          preact: './src/**/*.{js,jsx,ts,tsx}'
        };
        
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "${contentPaths[framework] || './src/**/*.{js,jsx,ts,tsx}'}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
        
        fs.writeFileSync('tailwind.config.js', tailwindConfig);
        
        // Create postcss.config.js
        const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
        
        fs.writeFileSync('postcss.config.js', postcssConfig);
        
        // Update CSS file with Tailwind directives
        const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
        
        const cssFiles = ['src/index.css', 'src/style.css', 'src/app.css'];
        const cssFile = cssFiles.find(file => fs.existsSync(file)) || 'src/index.css';
        fs.writeFileSync(cssFile, cssContent);
        
        spinner.succeed(chalk.cyan('✓ Latest Tailwind CSS configured!'));
      } catch (error) {
        spinner.fail(chalk.red('✗ Tailwind CSS setup failed'));
        console.log(chalk.yellow('  You can set up Tailwind manually later with: npx tailwindcss init -p'));
      }
    }
    
    // 4. Setup Router (Latest Versions)
    if (router) {
      spinner.start(chalk.magenta(`Setting up ${framework} router...`));
      
      const routerPackages = {
        react: 'react-router-dom@latest',
        vue: 'vue-router@latest',
        svelte: 'svelte-routing@latest'
      };
      
      const routerPackage = routerPackages[framework];
      execSync(`npm install ${routerPackage}`, { stdio: 'ignore' });
      
      spinner.succeed(chalk.cyan(`✓ Latest ${framework.charAt(0).toUpperCase() + framework.slice(1)} router installed!`));
    }
    
    // 5. Create folder structure
    if (folderStructure) {
      spinner.start(chalk.magenta('Creating folder structure...'));
      
      const folders = framework === 'vue' 
        ? ['components', 'views', 'composables', 'assets']
        : framework === 'svelte'
        ? ['components', 'routes', 'stores', 'assets']
        : ['components', 'pages', 'hooks', 'assets'];
      
      folders.forEach(folder => {
        const folderPath = path.join('src', folder);
        fs.ensureDirSync(folderPath);
        
        let readmeContent = `# ${folder.charAt(0).toUpperCase() + folder.slice(1)}\n\n`;
        if (folder === 'components') readmeContent += 'Put your reusable components here!';
        else if (folder === 'pages' || folder === 'views' || folder === 'routes') readmeContent += 'Put your page/route components here!';
        else if (folder === 'hooks' || folder === 'composables') readmeContent += 'Put your custom hooks/composables here!';
        else if (folder === 'stores') readmeContent += 'Put your Svelte stores here!';
        else readmeContent += 'Put your images, fonts, and other files here!';
        
        fs.writeFileSync(path.join(folderPath, 'README.md'), readmeContent);
      });
      
      spinner.succeed(chalk.cyan('✓ Folder structure created!'));
    }
    
    // 6. Create README
    const frameworkDocs = {
      react: 'https://react.dev',
      vue: 'https://vuejs.org',
      svelte: 'https://svelte.dev',
      preact: 'https://preactjs.com',
      lit: 'https://lit.dev',
      vanilla: 'https://vitejs.dev'
    };
    
    const readmeContent = `# ${projectName}

Welcome to your new ${framework} project! 🚀

## Tech Stack

- **Framework:** ${framework.charAt(0).toUpperCase() + framework.slice(1)} (Latest)
- **Language:** ${isTypeScript ? 'TypeScript' : 'JavaScript'}
- **Build Tool:** Vite (Latest)
${tailwind ? '- **Styling:** Tailwind CSS (Latest)\n' : ''}${router ? `- **Router:** ${framework === 'react' ? 'React Router' : framework === 'vue' ? 'Vue Router' : 'Svelte Routing'} (Latest)\n` : ''}
## Getting Started

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:5173 in your browser

## Available Commands

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## Learn More

- [${framework.charAt(0).toUpperCase() + framework.slice(1)} Documentation](${frameworkDocs[framework]})
- [Vite Documentation](https://vitejs.dev)
${tailwind ? '- [Tailwind CSS Documentation](https://tailwindcss.com)\n' : ''}${isTypeScript ? '- [TypeScript Documentation](https://www.typescriptlang.org)\n' : ''}
## Package Versions

All packages are installed with \`@latest\` tag to ensure you're using the most up-to-date versions.

Happy coding! 💻✨
`;
    
    fs.writeFileSync('README.md', readmeContent);
    
    // Final success message with beautiful formatting
    const frameworkEmojis = {
      react: '⚛️',
      vue: '💚',
      svelte: '🔺',
      preact: '🔷',
      lit: '🔶',
      vanilla: '⚡'
    };
    
    console.log('\n');
    console.log(chalk.magenta('═'.repeat(60)));
    console.log(chalk.magenta.bold('  ✨ SUCCESS! Your project is ready to go! ✨'));
    console.log(chalk.magenta('═'.repeat(60)));
    console.log('');
    console.log(chalk.cyan.bold('  📂 Project:'), chalk.white(projectName), frameworkEmojis[framework]);
    console.log('');
    console.log(chalk.magenta.bold('  🚀 Next Steps:'));
    console.log('');
    console.log(chalk.white('     1.'), chalk.cyan(`cd ${projectName}`));
    console.log(chalk.white('     2.'), chalk.cyan('npm run dev'));
    console.log(chalk.white('     3.'), chalk.cyan('Open http://localhost:5173'));
    console.log('');
    
    if (tailwind) {
      console.log(chalk.cyan.bold('  💡 Tailwind Tip:'));
      console.log(chalk.gray('     Try: ') + chalk.white('className="bg-blue-500 text-white p-4 rounded-lg"'));
      console.log(chalk.gray('     All utility classes are available!'));
      console.log('');
    }
    
    if (router) {
      console.log(chalk.cyan.bold('  🧭 Router Docs:'));
      if (framework === 'react') {
        console.log(chalk.gray('     https://reactrouter.com'));
      } else if (framework === 'vue') {
        console.log(chalk.gray('     https://router.vuejs.org'));
      } else if (framework === 'svelte') {
        console.log(chalk.gray('     https://github.com/EmilTholin/svelte-routing'));
      }
      console.log('');
    }
    
    console.log(chalk.magenta('═'.repeat(60)));
    console.log(chalk.gray('  Need help? Check out README.md in your project folder!'));
    console.log(chalk.magenta('═'.repeat(60)));
    console.log('');
    
  } catch (error) {
    console.log('');
    console.log(chalk.red('═'.repeat(60)));
    console.log(chalk.red.bold('  ❌ ERROR'));
    console.log(chalk.red('═'.repeat(60)));
    console.log('');
    console.log(chalk.white('  Message:'), chalk.magenta(error.message));
    console.log('');
    console.log(chalk.cyan('  💡 Troubleshooting tips:'));
    console.log(chalk.white('     • Check your internet connection'));
    console.log(chalk.white('     • Make sure Node.js is installed (node --version)'));
    console.log(chalk.white('     • Try running the command again'));
    console.log('');
    console.log(chalk.red('═'.repeat(60)));
    console.log('');
    process.exit(1);
  }
}

createProject();
