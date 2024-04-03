const startingExp = 20041506;
let minotaursKilled = 0;

async function fetchPlayerEXP() {
  const apiUrl = `https://osrs-hiscore-pulling.onrender.com/stats/OneChunkUp?skill=ranged`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.experience;
}

function updateMinotaurCount() {
  minotaursKilled++;
  updateResult();
}

async function updateResult() {
  const currentExp = await fetchPlayerEXP();
  const expGained = currentExp - startingExp;
  const calculatedMinotaursKilled = Math.floor(expGained / 40);

  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <p>OneChunkUp has killed approximately ${calculatedMinotaursKilled + minotaursKilled} Minotaurs.</p>
  `;
}

updateResult();