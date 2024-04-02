// Fetch the player data from the API
fetch('https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=OneChunkUp')
  .then(response => response.json())
  .then(data => {
    // Find the "Ranged" skill object
    const rangedSkill = data.skills.find(skill => skill.id === 5);

    // Calculate the number of Minotaurs killed
    const baseXP = 20041506;
    const xpPerMinotaur = 40;
    const minotaursKilled = Math.floor((rangedSkill.xp - baseXP) / xpPerMinotaur);

    // Display the result on the page
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `Number of Minotaurs killed: ${minotaursKilled}`;
  })
  .catch(error => console.error('Error fetching player data:', error));