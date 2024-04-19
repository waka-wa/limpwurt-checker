async function fetchPlayerEXP() {
  const url = 'https://corsproxy.io/?https://crystalmathlabs.com/track.php?player=onechunkup&skill=hitpoints&time=all';

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Parsing HTML to extract Hitpoints XP
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const hitpointsRow = doc.querySelector('td.column_skill img[title="Hitpoints"]').parentNode.parentNode;
    const xpElement = hitpointsRow.querySelector('td[title] span');
    const xpText = xpElement.textContent.trim().replace(/,/g, ''); // Removing commas from XP text
    const xp = parseInt(xpText, 10); // Parsing XP as integer

    console.log('Hitpoints XP:', xp);
    return xp;
  } catch (error) {
    console.error('Error fetching Hitpoints XP:', error);
    return null;
  }
}

async function updateResult() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';
  
  const currentHitpointsExp = await fetchPlayerEXP();
  console.log('Current Hitpoints EXP:', currentHitpointsExp);

  if (currentHitpointsExp !== null) {
    // Update your result logic here using the currentHitpointsExp
  } else {
    console.error('Failed to fetch Hitpoints XP.');
  }

  loadingElement.style.display = 'none';
}

updateResult();
