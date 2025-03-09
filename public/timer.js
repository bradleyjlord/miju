// Timer functionality for card generation, daily rewards, and voting
;(() => {
    // DOM Elements
    const timerElement = document.getElementById("timer")
    const dailyTimerElement = document.getElementById("daily-timer")
    const voteTimerElement = document.getElementById("vote-timer")
    const generateBtn = document.getElementById("generate-btn")
  
    // Timer intervals
    let cardGenerationTimer
    let dailyRewardTimer
    const voteTimerIntervals = {}
    
    // Flag to track if we've already triggered auto-generation
    let autoGenerationTriggered = false
  
    // Start all timers
    window.startTimers = () => {
      // Make sure DOM is fully loaded before accessing elements
      if (!timerElement || !dailyTimerElement || !voteTimerElement || !generateBtn) {
        console.error("Timer elements not found. Retrying in 500ms...")
        setTimeout(window.startTimers, 500)
        return
      }
  
      console.log("Starting timers...")
      startCardGenerationTimer()
      startDailyRewardTimer()
      startVoteTimers()
    }
  
    // Start card generation timer
    function startCardGenerationTimer() {
      // Clear existing timer
      if (cardGenerationTimer) {
        clearInterval(cardGenerationTimer)
      }
      
      // Reset auto-generation flag
      autoGenerationTriggered = false
  
      // Update timer immediately
      updateCardGenerationTimer()
  
      // Set interval to update timer every second
      cardGenerationTimer = setInterval(updateCardGenerationTimer, 1000)
      console.log("Card generation timer started")
    }
  
    // Update card generation timer
    function updateCardGenerationTimer() {
      const gameState = JSON.parse(localStorage.getItem('animeTcgGameState')) || { user: {} };
    
      if (!gameState.user.lastCardGeneration) {
        timerElement.textContent = '00:00';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Cards';
        return;
      }
  
      const now = Date.now();
      const lastGeneration = gameState.user.lastCardGeneration;
      // Make sure this matches the cooldown time in app.js
      const cooldownTime = 300 * 1000; // 5 minutes for testing (change to 20 * 60 * 1000 for production)
      const timeElapsed = now - lastGeneration;
      const timeRemaining = cooldownTime - timeElapsed;
  
      if (timeRemaining <= 0) {
        timerElement.textContent = '00:00';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Cards';
        
        // Auto-generate cards when timer reaches zero, but only once
        if (!autoGenerationTriggered && window.autoGenerateCards) {
          console.log("Auto-generating cards...");
          autoGenerationTriggered = true;
          window.autoGenerateCards();
        }
        
        return;
      }
  
      // Format time remaining as MM:SS
      const minutes = Math.floor(timeRemaining / 60000);
      const seconds = Math.floor((timeRemaining % 60000) / 1000);
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      generateBtn.disabled = true;
      generateBtn.textContent = 'Cooldown Active';
    }
  
    // Start daily reward timer
    function startDailyRewardTimer() {
      // Clear existing timer
      if (dailyRewardTimer) {
        clearInterval(dailyRewardTimer)
      }
  
      // Update timer immediately
      updateDailyRewardTimer()
  
      // Set interval to update timer every second
      dailyRewardTimer = setInterval(updateDailyRewardTimer, 1000)
      console.log("Daily reward timer started")
    }
  
    // Update daily reward timer
    function updateDailyRewardTimer() {
      const gameState = JSON.parse(localStorage.getItem("animeTcgGameState")) || { user: {} }
  
      if (!gameState.user.lastDailyClaim) {
        dailyTimerElement.textContent = "00:00:00"
        return
      }
  
      const now = Date.now()
      const lastClaim = gameState.user.lastDailyClaim
      const cooldownTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const timeElapsed = now - lastClaim
      const timeRemaining = cooldownTime - timeElapsed
  
      if (timeRemaining <= 0) {
        dailyTimerElement.textContent = "00:00:00"
        return
      }
  
      // Format time remaining as HH:MM:SS
      const hours = Math.floor(timeRemaining / 3600000)
      const minutes = Math.floor((timeRemaining % 3600000) / 60000)
      const seconds = Math.floor((timeRemaining % 60000) / 1000)
      dailyTimerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
  
    // Start vote timers
    function startVoteTimers() {
      // Clear existing timers
      for (const site in voteTimerIntervals) {
        clearInterval(voteTimerIntervals[site])
      }
  
      // Update timer immediately
      updateVoteTimers()
  
      // Set interval to update timer every second
      voteTimerIntervals.main = setInterval(updateVoteTimers, 1000)
      console.log("Vote timers started")
    }
  
    // Update vote timers
    function updateVoteTimers() {
      const gameState = JSON.parse(localStorage.getItem("animeTcgGameState")) || { user: {} }
  
      if (!gameState.user.lastVotes) {
        voteTimerElement.textContent = "00:00:00"
        return
      }
  
      // Find the earliest time when any vote will be available
      const now = Date.now()
      const cooldownTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
      let earliestVoteTime = Number.POSITIVE_INFINITY
  
      for (const site in gameState.user.lastVotes) {
        const lastVote = gameState.user.lastVotes[site]
        const timeElapsed = now - lastVote
        const timeRemaining = cooldownTime - timeElapsed
  
        if (timeRemaining > 0 && timeRemaining < earliestVoteTime) {
          earliestVoteTime = timeRemaining
        }
      }
  
      if (earliestVoteTime === Number.POSITIVE_INFINITY) {
        voteTimerElement.textContent = "00:00:00"
        return
      }
  
      // Format time remaining as HH:MM:SS
      const hours = Math.floor(earliestVoteTime / 3600000)
      const minutes = Math.floor((earliestVoteTime % 3600000) / 60000)
      const seconds = Math.floor((earliestVoteTime % 60000) / 1000)
      voteTimerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
  
    // Reset auto-generation flag when the page is refreshed
    window.addEventListener('beforeunload', () => {
      autoGenerationTriggered = false;
    });
  
    // Make sure timers start when the page loads
    document.addEventListener("DOMContentLoaded", window.startTimers)
  })()
  