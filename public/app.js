// Main application logic
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const generateBtn = document.getElementById("generate-btn")
    const cardSelection = document.getElementById("card-selection")
    const collectionBtn = document.getElementById("collection-btn")
    const collectionView = document.getElementById("collection-view")
    const backFromCollectionBtn = document.getElementById("back-from-collection")
    const inventoryBtn = document.getElementById("inventory-btn")
    const inventoryView = document.getElementById("inventory-view")
    const backFromInventoryBtn = document.getElementById("back-from-inventory")
    const voteBtn = document.getElementById("vote-btn")
    const voteView = document.getElementById("vote-view")
    const backFromVoteBtn = document.getElementById("back-from-vote")
    const dailyBtn = document.getElementById("daily-btn")
    const dailyView = document.getElementById("daily-view")
    const backFromDailyBtn = document.getElementById("back-from-daily")
    const selectBtns = document.querySelectorAll(".select-btn")
    const claimDailyBtn = document.getElementById("claim-daily")
    const voteOptions = document.querySelectorAll(".vote-option")
    const goldAmount = document.getElementById("gold-amount")
    const ticketAmount = document.getElementById("ticket-amount")
    const collectionCards = document.getElementById("collection-cards")
    const filterEdition = document.getElementById("filter-edition")
    const filterRarity = document.getElementById("filter-rarity")
    const sortBtn = document.getElementById("sort-btn")
    const notification = document.getElementById("notification")
    const notificationText = document.getElementById("notification-text")
    const timerElement = document.getElementById("timer")
  
    // Game state
    const gameState = {
      user: {
        username: "Guest",
        gold: 0,
        tickets: 0,
        collection: [],
        lastCardGeneration: null,
        lastDailyClaim: null,
        lastVotes: {},
      },
      currentCards: [],
      rejectedCards: [], // Cards that were not chosen
      sortAscending: true,
      activeView: "main",
    }
  
    // Initialize the game
    function initGame() {
      console.log("Initializing game...")
      loadGameState()
      updateUI()
  
      // Set up event listeners
      setupEventListeners()
  
      // Set initial timer display if no generation has happened yet
      if (!gameState.user.lastCardGeneration) {
        timerElement.textContent = "00:20"
      }
      
      // Expose the generateCards function to the window so timer.js can call it
      window.autoGenerateCards = generateCards;
      
      // Verify that getRandomCardBase is available
      if (typeof window.getRandomCardBase !== 'function') {
        console.error("getRandomCardBase is not available. Check if cards.js is loaded properly.");
      } else {
        console.log("getRandomCardBase is available and ready to use.");
      }
    }
  
    // Load game state from localStorage
    function loadGameState() {
      const savedState = localStorage.getItem("animeTcgGameState")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        gameState.user = parsedState.user
        gameState.rejectedCards = parsedState.rejectedCards || []
      }
    }
  
    // Save game state to localStorage
    function saveGameState() {
      localStorage.setItem(
        "animeTcgGameState",
        JSON.stringify({
          user: gameState.user,
          rejectedCards: gameState.rejectedCards,
        }),
      )
    }
  
    // Update UI based on game state
    function updateUI() {
      // Update inventory
      goldAmount.textContent = gameState.user.gold
      ticketAmount.textContent = gameState.user.tickets
  
      // Update generate button state
      updateGenerateButtonState()
  
      // Update collection view
      renderCollection()
  
      // Update daily claim button
      updateDailyClaimButton()
  
      // Update vote options
      updateVoteOptions()
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Navigation buttons
      collectionBtn.addEventListener("click", () => showView("collection"))
      backFromCollectionBtn.addEventListener("click", () => showView("main"))
  
      inventoryBtn.addEventListener("click", () => showView("inventory"))
      backFromInventoryBtn.addEventListener("click", () => showView("main"))
  
      voteBtn.addEventListener("click", () => showView("vote"))
      backFromVoteBtn.addEventListener("click", () => showView("main"))
  
      dailyBtn.addEventListener("click", () => showView("daily"))
      backFromDailyBtn.addEventListener("click", () => showView("main"))
  
      // Generate cards button
      generateBtn.addEventListener("click", generateCards)
  
      // Card selection buttons
      selectBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const cardIndex = Number.parseInt(e.target.closest(".card").dataset.index)
          selectCard(cardIndex)
        })
      })
  
      // Daily claim button
      claimDailyBtn.addEventListener("click", claimDaily)
  
      // Vote options
      voteOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault()
          const site = e.currentTarget.dataset.site
          vote(site)
        })
      })
  
      // Collection filters and sorting
      filterEdition.addEventListener("change", renderCollection)
      filterRarity.addEventListener("change", renderCollection)
      sortBtn.addEventListener("click", () => {
        gameState.sortAscending = !gameState.sortAscending
        sortBtn.textContent = gameState.sortAscending ? "Sort by Print # ↑" : "Sort by Print # ↓"
        renderCollection()
      })
    }
  
    // Show a specific view and hide others
    function showView(viewName) {
      // Hide all views
      cardSelection.classList.add("hidden")
      collectionView.classList.add("hidden")
      inventoryView.classList.add("hidden")
      voteView.classList.add("hidden")
      dailyView.classList.add("hidden")
  
      // Show the requested view
      gameState.activeView = viewName
  
      switch (viewName) {
        case "main":
          // Main view is always visible
          break
        case "card-selection":
          cardSelection.classList.remove("hidden")
          break
        case "collection":
          collectionView.classList.remove("hidden")
          break
        case "inventory":
          inventoryView.classList.remove("hidden")
          break
        case "vote":
          voteView.classList.remove("hidden")
          break
        case "daily":
          dailyView.classList.remove("hidden")
          break
      }
    }
  
    // Generate three random cards
    function generateCards() {
      console.log("Generate cards function called");
      
      if (!canGenerateCards()) {
        console.log("Cannot generate cards yet");
        return;
      }
  
      console.log("Generating cards...");
      
      try {
        // Generate 3 random cards
        gameState.currentCards = [];
  
        for (let i = 0; i < 3; i++) {
          const card = generateRandomCard();
          console.log(`Generated card ${i}:`, card);
          gameState.currentCards.push(card);
  
          // Update the card display
          const cardElement = document.querySelector(`.card[data-index="${i}"]`);
          const cardNameElement = cardElement.querySelector(".card-name");
          const cardRarityElement = cardElement.querySelector(".card-rarity");
          const cardEditionElement = cardElement.querySelector(".card-edition");
          const cardPrintElement = cardElement.querySelector(".card-print");
          const cardIdElement = cardElement.querySelector(".card-id");
          const cardImage = cardElement.querySelector(".card-front img");
  
          cardNameElement.textContent = card.name;
          cardRarityElement.textContent = card.rarity;
          cardRarityElement.style.color = getRarityColor(card.rarity);
          cardEditionElement.textContent = `Edition #${card.edition}`;
          cardPrintElement.textContent = `Print #${card.printNumber.toString().padStart(4, "0")}`;
          cardIdElement.textContent = `ID: ${card.id}`;
          cardImage.src = card.image || "placeholder.svg";
        }
  
        // Update last generation time
        gameState.user.lastCardGeneration = Date.now();
        saveGameState();
  
        // Show card selection view
        showView("card-selection");
        console.log("Card selection view shown");
  
        // Disable generate button
        updateGenerateButtonState();
      } catch (error) {
        console.error("Error generating cards:", error);
        showNotification("Error generating cards. Please try again.");
      }
    }
  
    // Generate a random card
    function generateRandomCard() {
      try {
        // Check if getRandomCardBase is available
        if (typeof window.getRandomCardBase !== 'function') {
          console.error("getRandomCardBase is not available");
          throw new Error("Card generation function not available");
        }
        
        // Get a random card from the cards database
        let cardBase = window.getRandomCardBase();
        console.log("Generated card base:", cardBase);
  
        // Check if this card is in the rejected list
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loop
        
        while (gameState.rejectedCards.some(rc => rc.baseId === cardBase.id) && attempts < maxAttempts) {
          cardBase = window.getRandomCardBase();
          attempts++;
        }
  
        // Generate a unique ID for this card instance
        const uniqueId = generateUniqueId();
  
        // Get the next sequential print number for this character
        const printNumber = window.getNextPrintNumber(cardBase.id);
  
        return {
          id: uniqueId,
          baseId: cardBase.id,
          name: cardBase.name,
          rarity: cardBase.rarity,
          edition: cardBase.edition || 1,
          printNumber: printNumber,
          image: cardBase.image,
        };
      } catch (error) {
        console.error("Error in generateRandomCard:", error);
        // Return a fallback card if there's an error
        return {
          id: generateUniqueId(),
          baseId: 0,
          name: "Error Card",
          rarity: "Common",
          edition: 1,
          printNumber: 9999,
          image: "placeholder.svg",
        };
      }
    }
  
    // Select a card to add to collection
    function selectCard(index) {
      if (!gameState.currentCards || gameState.currentCards.length === 0) return
  
      // Add the selected card to the collection
      const selectedCard = gameState.currentCards[index]
      gameState.user.collection.push(selectedCard)
  
      // Add the rejected cards to the rejected list
      for (let i = 0; i < gameState.currentCards.length; i++) {
        if (i !== index) {
          gameState.rejectedCards.push(gameState.currentCards[i])
        }
      }
  
      // Clear current cards
      gameState.currentCards = []
  
      // Save game state
      saveGameState()
  
      // Show notification
      showNotification(`Added ${selectedCard.name} to your collection!`)
  
      // Return to main view
      showView("main")
  
      // Update UI
      updateUI()
    }
    
    // Burn (delete) a card from collection
    function burnCard(cardId) {
      // Find the card index in the collection
      const cardIndex = gameState.user.collection.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) {
        console.error("Card not found in collection:", cardId);
        return;
      }
      
      // Get the card name before removing it
      const cardName = gameState.user.collection[cardIndex].name;
      
      // Remove the card from collection
      gameState.user.collection.splice(cardIndex, 1);
      
      // Save game state
      saveGameState();
      
      // Show notification
      showNotification(`Burned ${cardName} from your collection!`);
      
      // Update UI
      renderCollection();
    }
  
    // Claim daily reward
    function claimDaily() {
      if (!canClaimDaily()) return
  
      // Random gold amount between 300-400
      const goldAmount = Math.floor(Math.random() * 101) + 300
  
      // Add gold to user
      gameState.user.gold += goldAmount
  
      // Update last claim time
      gameState.user.lastDailyClaim = Date.now()
  
      // Save game state
      saveGameState()
  
      // Update UI
      updateUI()
  
      // Show notification
      showNotification(`Claimed ${goldAmount} gold from daily reward!`)
    }
  
    // Vote for tickets
    function vote(site) {
      if (!canVote(site)) return
  
      // Add tickets to user
      gameState.user.tickets += 2
  
      // Update last vote time for this site
      gameState.user.lastVotes[site] = Date.now()
  
      // Save game state
      saveGameState()
  
      // Update UI
      updateUI()
  
      // Show notification
      showNotification(`Received 2 tickets for voting on ${site}!`)
  
      // Open vote site in new tab (in a real implementation)
      // window.open('https://vote-site.com', '_blank');
    }
  
    // Render the collection view
    function renderCollection() {
      // Clear current collection display
      collectionCards.innerHTML = ""
  
      if (!gameState.user.collection || gameState.user.collection.length === 0) {
        collectionCards.innerHTML = '<p class="empty-collection">Your collection is empty. Generate some cards!</p>'
        return
      }
  
      // Filter collection based on selected filters
      let filteredCollection = [...gameState.user.collection]
  
      const editionFilter = filterEdition.value
      if (editionFilter !== "all") {
        filteredCollection = filteredCollection.filter((card) => card.edition.toString() === editionFilter)
      }
  
      const rarityFilter = filterRarity.value
      if (rarityFilter !== "all") {
        filteredCollection = filteredCollection.filter((card) => card.rarity.toLowerCase() === rarityFilter)
      }
  
      // Sort collection
      filteredCollection.sort((a, b) => {
        if (gameState.sortAscending) {
          return a.printNumber - b.printNumber
        } else {
          return b.printNumber - a.printNumber
        }
      })
  
      // Render each card
      filteredCollection.forEach((card) => {
        const cardElement = document.createElement("div")
        cardElement.className = "card collection-card"
  
        cardElement.innerHTML = `
          <div class="card-inner">
            <div class="card-front">
              <img src="${card.image || "placeholder.svg"}" alt="${card.name}">
            </div>
            <div class="card-back">
              <div class="card-info">
                <h3 class="card-name">${card.name}</h3>
                <p class="card-rarity" style="color: ${getRarityColor(card.rarity)}">${card.rarity}</p>
                <p class="card-edition">Edition #${card.edition}</p>
                <p class="card-print">Print #${card.printNumber.toString().padStart(4, "0")}</p>
                <p class="card-id">ID: ${card.id}</p>
              </div>
            </div>
          </div>
          <button class="burn-btn" data-card-id="${card.id}">Burn Card</button>
        `
  
        collectionCards.appendChild(cardElement)
        
        // Add event listener to the burn button
        const burnBtn = cardElement.querySelector(".burn-btn")
        burnBtn.addEventListener("click", (e) => {
          const cardId = e.target.dataset.cardId
          burnCard(cardId)
        })
      })
    }
  
    // Update generate button state
    function updateGenerateButtonState() {
      if (canGenerateCards()) {
        generateBtn.disabled = false
        generateBtn.textContent = "Generate Cards"
      } else {
        generateBtn.disabled = true
        generateBtn.textContent = "Cooldown Active"
      }
    }
  
    // For testing purposes, let's reduce the cooldown time to 10 seconds
    function canGenerateCards() {
      if (!gameState.user.lastCardGeneration) return true
  
      const now = Date.now()
      const timeSinceLastGeneration = now - gameState.user.lastCardGeneration
      const cooldownTime = 20 * 1000 // 20 seconds for testing (change back to 20 * 60 * 1000 for production)
  
      return timeSinceLastGeneration >= cooldownTime
    }
  
    // Check if user can claim daily reward
    function canClaimDaily() {
      if (!gameState.user.lastDailyClaim) return true
  
      const now = Date.now()
      const timeSinceLastClaim = now - gameState.user.lastDailyClaim
      const cooldownTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
      return timeSinceLastClaim >= cooldownTime
    }
  
    // Check if user can vote on a specific site
    function canVote(site) {
      if (!gameState.user.lastVotes || !gameState.user.lastVotes[site]) return true
  
      const now = Date.now()
      const timeSinceLastVote = now - gameState.user.lastVotes[site]
      const cooldownTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
      return timeSinceLastVote >= cooldownTime
    }
  
    // Update daily claim button
    function updateDailyClaimButton() {
      if (canClaimDaily()) {
        claimDailyBtn.disabled = false
        document.getElementById("daily-timer").parentElement.classList.add("hidden")
      } else {
        claimDailyBtn.disabled = true
        document.getElementById("daily-timer").parentElement.classList.remove("hidden")
      }
    }
  
    // Update vote options
    function updateVoteOptions() {
      voteOptions.forEach((option) => {
        const site = option.dataset.site
        if (canVote(site)) {
          option.classList.remove("voted")
        } else {
          option.classList.add("voted")
        }
      })
    }
  
    // Show notification
    function showNotification(message) {
      notificationText.textContent = message
      notification.classList.remove("hidden")
      notification.classList.add("show")
  
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          notification.classList.add("hidden")
        }, 300)
      }, 3000)
    }
  
    // Generate a unique ID for cards
    function generateUniqueId() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let id = ""
  
      // Generate 4 groups of 4 characters
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        if (i < 3) id += "-"
      }
  
      return id
    }
  
    // Get color for rarity display
    function getRarityColor(rarity) {
      switch (rarity.toLowerCase()) {
        case "common":
          return "var(--common)"
        case "uncommon":
          return "var(--uncommon)"
        case "rare":
          return "var(--rare)"
        case "ultra-rare":
          return "var(--ultra-rare)"
        default:
          return "var(--text)"
      }
    }
  
    // Initialize the game
    initGame()
  })
  