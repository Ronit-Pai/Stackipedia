
const supabaseApp = window.supabase.createClient(
  window.SUPABASE_URL || '',
  window.SUPABASE_ANON_KEY || ''
);

(async function guard() {
  const { data } = await supabaseApp.auth.getSession();
  if (!data.session) {
    window.location.href = './login.html';
  }
})();

const stacks = [
  {
    id: 'web-dev',
    name: 'Web Development',
    logo: '🌐',
    description: 'Frontend + backend foundations with modern frameworks.',
    difficulty: 'Beginner → Intermediate',
    careers: ['Frontend Developer', 'Full-Stack Developer'],
    roadmap: ['HTML/CSS/JS', 'React', 'Node.js + Express', 'DB + Auth']
  },
  {
    id: 'ai-ml',
    name: 'AI / ML',
    logo: '🤖',
    description: 'From Python basics to training ML models and deploying.',
    difficulty: 'Intermediate',
    careers: ['ML Engineer', 'Data Scientist'],
    roadmap: ['Python + NumPy', 'Pandas', 'Scikit-learn', 'NNs + Deployment']
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    logo: '⛓️',
    description: 'Smart contracts, dApps, and Web3 fundamentals.',
    difficulty: 'Intermediate',
    careers: ['Smart Contract Dev', 'Web3 Developer'],
    roadmap: ['Solidity', 'Hardhat', 'Ethers.js', 'Security + Audits']
  }
];

function createCard(stack) {
  const card = document.createElement('div');
  card.className = 'card reveal';
  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="font-size:1.6rem">${stack.logo}</div>
      <h3 style="margin:0">${stack.name}</h3>
    </div>
    <p style="margin-bottom:10px">${stack.description}</p>
    <p style="color:#9dd; margin-bottom:8px"><strong>Difficulty:</strong> ${stack.difficulty}</p>
    <p style="margin-bottom:8px"><strong>Careers:</strong> ${stack.careers.join(', ')}</p>
    <p style="margin-bottom:0"><strong>Roadmap:</strong> ${stack.roadmap.join(' → ')}</p>
  `;
  return card;
}

function renderStacks() {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;
  stacks.forEach((s) => grid.appendChild(createCard(s)));
}

renderStacks();

document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await supabaseApp.auth.signOut();
  window.location.href = './login.html';
});


