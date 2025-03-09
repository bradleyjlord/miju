// Card database and card generation logic
// Make sure these functions are available globally
const cardDatabase = [
    {
      id: 1,
      name: "Naruto Uzumaki",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Naruto.png",
    },
    {
      id: 2,
      name: "Sasuke Uchiha",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Sasuke.png",
    },
    {
      id: 3,
      name: "Sakura Haruno",
      rarity: "Uncommon",
      edition: 1,
      image: "/src/image/Sakura.png",
    },
    {
      id: 4,
      name: "Kakashi Hatake",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Kakashi.png",
    },
    {
      id: 5,
      name: "Hinata Hyuga",
      rarity: "Uncommon",
      edition: 1,
      image: "/src/image/Hinata.png",
    },
    {
      id: 6,
      name: "Gaara",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Gaara.png",
    },
    {
      id: 7,
      name: "Itachi Uchiha",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Itachi.png",
    },
    {
      id: 8,
      name: "Jiraiya",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Jiraiya.png",
    },
    {
      id: 9,
      name: "Tsunade",
      rarity: "Rare",
      edition: 1,
      image: "/src/image/Tsunade.png",
    },
    {
      id: 10,
      name: "Orochimaru",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Orochimaru.png",
    },
    {
      id: 11,
      name: "Rock Lee",
      rarity: "Uncommon",
      edition: 1,
      image: "/src/image/RockLee.png",
    },
    {
      id: 12,
      name: "Neji Hyuga",
      rarity: "Uncommon",
      edition: 1,
      image: "/src/image/Neji.png",
    },
    {
      id: 13,
      name: "Shikamaru Nara",
      rarity: "Uncommon",
      edition: 1,
      image: "/src/image/Shikamaru.png",
    },
    {
      id: 14,
      name: "Choji Akimichi",
      rarity: "Common",
      edition: 1,
      image: "/src/image/Choji.png",
    },
    {
      id: 15,
      name: "Ino Yamanaka",
      rarity: "Common",
      edition: 1,
      image: "/src/image/Ino.png",
    },
    // IRL inspired cards
    {
      id: 16,
      name: "Michael Jordan",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Jordan.png",
    },
    {
      id: 17,
      name: "LeBron James",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Lebron.png",
    },
    {
      id: 18,
      name: "Kobe Bryant",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Kobe.png",
    },
    {
      id: 19,
      name: "Lionel Messi",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Messi.png",
    },
    {
      id: 20,
      name: "Cristiano Ronaldo",
      rarity: "Ultra-Rare",
      edition: 1,
      image: "/src/image/Ronaldo.png",
    },
  ];
  
  // Print number counters for each character
  let printCounters = {};
  
  // Initialize print counters from localStorage if available
  function initPrintCounters() {
    const savedCounters = localStorage.getItem("animeTcgPrintCounters");
    if (savedCounters) {
      printCounters = JSON.parse(savedCounters);
    } else {
      // Initialize all counters to 0
      cardDatabase.forEach(card => {
        printCounters[card.id] = 0;
      });
      savePrintCounters();
    }
  }
  
  // Save print counters to localStorage
  function savePrintCounters() {
    localStorage.setItem("animeTcgPrintCounters", JSON.stringify(printCounters));
  }
  
  // Get next print number for a card
  function getNextPrintNumber(cardId) {
    // If counter doesn't exist, initialize it
    if (printCounters[cardId] === undefined) {
      printCounters[cardId] = 0;
    }
    
    // Increment counter
    printCounters[cardId]++;
    
    // Save updated counters
    savePrintCounters();
    
    return printCounters[cardId];
  }
  
  // Get a random card from the database
  function getRandomCardBase() {
    const randomIndex = Math.floor(Math.random() * cardDatabase.length);
    return cardDatabase[randomIndex];
  }
  
  // Get a card by ID
  function getCardById(id) {
    return cardDatabase.find((card) => card.id === id);
  }
  
  // Get all cards
  function getAllCards() {
    return [...cardDatabase];
  }
  
  // Initialize print counters
  initPrintCounters();
  
  // Explicitly assign functions to window object
  window.getRandomCardBase = getRandomCardBase;
  window.getCardById = getCardById;
  window.getAllCards = getAllCards;
  window.getNextPrintNumber = getNextPrintNumber;
  