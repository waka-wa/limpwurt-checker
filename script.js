const startingExp = 20041506;
let minotaursKilled = 0;

async function fetchPlayerEXP() {
  const apiUrl = `https://osrs-hiscore-pulling.onrender.com/stats/OneChunkUp?skill=ranged`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Response:', data);
    return data.experience;
  } catch (error) {
    console.error('Error fetching player EXP:', error);
    return null;
  }
}

function updateMinotaurCount() {
  minotaursKilled++;
  updateResult();
}

async function updateResult() {
  const currentExp = await fetchPlayerEXP();
  console.log('Current EXP:', currentExp);
  
  if (currentExp !== null) {
    const expGained = currentExp - startingExp;
    console.log('EXP Gained:', expGained);
    
    const calculatedMinotaursKilled = Math.floor(expGained / 40);
    console.log('Calculated Minotaurs Killed:', calculatedMinotaursKilled);
    
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
      <p>OneChunkUp has killed approximately ${calculatedMinotaursKilled + minotaursKilled} Minotaurs.</p>
    `;
  } else {
    console.error('Failed to fetch player EXP.');
  }
}

updateResult();