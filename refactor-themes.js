const fs = require('fs');

const files = [
  { path: 'src/components/Workflow/WorkflowHome.tsx', theme: 'workflow.homepage', oldColor: 'teal', typeString: 'Workflows' },
  { path: 'src/components/Apps/AppHome.tsx', theme: 'app.homepage', oldColor: 'sky', typeString: 'Apps' },
  { path: 'src/components/Agents/AgentHome.tsx', theme: 'agent.homepage', oldColor: 'violet', typeString: 'Agents' },
  { path: 'src/components/VibeCoding/VibeHome.tsx', theme: 'vibeCoding.homepage', oldColor: 'indigo', typeString: 'Projects' },
];

files.forEach(f => {
  console.log(`Processing ${f.path}...`);
  let content = fs.readFileSync(f.path, 'utf8');
  
  if (!content.includes('studioThemeColors')) {
    content = content.replace(
      /import \{ useTypewriter, useRandomTitle \} from '\.\.\/\.\.\/hooks\/useTypewriter';/, 
      `import { useTypewriter, useRandomTitle } from '../../hooks/useTypewriter';\nimport { studioThemeColors } from '../../constants/themeColors';`
    );
  }
  
  if (!content.includes(`const theme = studioThemeColors.${f.theme};`)) {
    content = content.replace(
      /const filtered/, 
      `const theme = studioThemeColors.${f.theme};\n\n  const filtered`
    );
  }
  
  const tagMapping = [
    { tag: 'StudioPageWrapper', prop: 'pageWrapper' },
    { tag: 'StudioHeader', prop: 'header' },
    { tag: 'StudioHero', prop: 'hero' },
    { tag: 'StudioToolbar', prop: 'toolbar' },
    { tag: 'StudioEmptyState', prop: 'emptyState' },
    { tag: 'StudioTipsSection', prop: 'tipsSection' },
  ];
  
  tagMapping.forEach(m => {
    const reg = new RegExp(`(<${m.tag}[^>]*?)themeColor="${f.oldColor}"`, 'gs');
    content = content.replace(reg, `$1colors={theme.${m.prop}}`);
  });
  
  ['StudioCard', 'StudioTable'].forEach(tag => {
    const propMap = { StudioCard: 'card', StudioTable: 'table' };
    const reg = new RegExp(`(<${tag}(?:<[^>]+>)?[^>]*?)theme="${f.oldColor}"`, 'gs');
    content = content.replace(reg, `$1colors={theme.${propMap[tag]}}`);
  });
  
  fs.writeFileSync(f.path, content);
});
console.log('Successfully refactored all theme call sites.');
