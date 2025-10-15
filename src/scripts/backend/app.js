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

async function fetchStacks() {
  try {
    // Resolve relative to app.html
    const response = await fetch('../data/stacks.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load stacks.json: ${response.status}`);
    const stacksFromJson = await response.json();
    return Array.isArray(stacksFromJson) ? stacksFromJson : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function createCard(stack) {
  const card = document.createElement('div');
  card.className = 'card reveal';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-expanded', 'false');

  const headerHtml = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="font-size:1.6rem">${stack.logo ?? ''}</div>
      <h3 style="margin:0">${stack.name ?? ''}</h3>
    </div>
  `;

  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'stack-details';
  detailsContainer.style.display = 'none';
  detailsContainer.innerHTML = `
    <p style="margin-bottom:10px">${stack.description ?? ''}</p>
    <p style="color:#9dd; margin-bottom:8px"><strong>Difficulty:</strong> ${stack.difficulty ?? ''}</p>
    <p style="margin-bottom:8px"><strong>Careers:</strong> ${(stack.careers || []).join(', ')}</p>
    <p style="margin-bottom:0"><strong>Roadmap:</strong> ${(stack.roadmap || []).join(' → ')}</p>
  `;

  card.innerHTML = headerHtml;
  card.appendChild(detailsContainer);

  function toggleDetails() {
    const isExpanded = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', String(!isExpanded));
    detailsContainer.style.display = isExpanded ? 'none' : 'block';
  }

  card.addEventListener('click', toggleDetails);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDetails();
    }
  });

  return card;
}

async function renderStacks() {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;
  const stacks = await fetchStacks();
  stacks.forEach((stack) => grid.appendChild(createCard(stack)));
}

renderStacks();

document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await supabaseApp.auth.signOut();
  window.location.href = './login.html';
});