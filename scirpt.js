var questions = [
    { question: "Choose your favorite card type:", answers: { a: "Offensive (e.g., Hog Rider, Balloon)", b: "Defensive (e.g., Tesla, Tornado)", c: "Support (e.g., Musketeer, Wizard)", d: "Tank (e.g., Golem, Giant)" }},
    { question: "What's your preferred strategy?", answers: { a: "Fast-paced attacks", b: "Control and counter", c: "Building up a big push", d: "Surprise elements and versatility" }},
    { question: "How do you react to an enemy push?", answers: { a: "Counter-attack on the other lane", b: "Defend solidly and counter-push", c: "Absorb some damage and build a counter-push", d: "Use cycle cards to defend and quickly reset" }},
    { question: "Pick a card you consider essential in any deck:", answers: { a: "Fireball", b: "Zap", c: "Skeleton Army", d: "Elixir Collector" }},
    { question: "What is your reaction to seeing a big tank like Golem?", answers: { a: "Rush the other lane", b: "Build a big defense", c: "Ignore and push the opposite lane", d: "Try to distract and chip away" }},
    { question: "Your favorite time to attack is:", answers: { a: "Immediately after defending", b: "When I have an elixir advantage", c: "Double elixir time", d: "When my opponent makes a mistake" }},
    { question: "Which of these spells do you prefer?", answers: { a: "Lightning", b: "Poison", c: "Fireball", d: "Rocket" }},
    { question: "What role do you prefer your cards to have?", answers: { a: "Versatility", b: "Specific counter", c: "High damage output", d: "Tankiness" }},
    { question: "How do you prefer to win matches?", answers: { a: "One big push", b: "Consistent pressure", c: "Defensive play and counter-attacks", d: "Spell cycle" }},
    { question: "What's your stance on elixir management?", answers: { a: "Aggressive spending for pressure", b: "Balanced - spend wisely", c: "Save for big pushes", d: "Spend as needed but focus on counters" }}
];
var results = { a: 0, b: 0, c: 0, d: 0 };
var currentQuestion = 0;
var swapHistory = [];
function startQuiz() {
    results = { a: 0, b: 0, c: 0, d: 0 };
    currentQuestion = 0;
    document.getElementById('result').style.display = 'none';
    document.getElementById('viableOptions').style.display = 'none';
    document.getElementById('nextBtn').textContent = 'Start Quiz';
    nextQuestion();
}
function nextQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById('quiz').innerHTML = createQuestionElement(currentQuestion);
        document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question';
    } else {
        showResults();
    }
    currentQuestion++;
    };
function createQuestionElement(index) {
    var question = questions[index];
    var qElement = '<div class="question"><p>' + question.question + '</p>';
    for (var key in question.answers) {
        qElement += '<label><input type="radio" name="question' + index + '" value="' + key + '" onclick="selectAnswer(\'' + key + '\')">' + question.answers[key] + '</label>';
    }
    qElement += '</div>';
    return qElement;
}
function selectAnswer(answer) {
    results[answer]++;
    if (currentQuestion === questions.length) {
        document.getElementById('nextBtn').textContent = 'Show Results';
    }
}
function showResults() {
    var deckSuggestion = calculateDeckSuggestion();
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    var deckListHtml = '<h3>Your Ideal Deck:</h3><div id="deckImages">';
    var totalElixirCost = 0;
    var deckListText = deckSuggestion.split(': ')[1].split(', ');
    deckListText.forEach(function(cardName) {
        deckListHtml += `<div><img src="${cardImages[cardName.trim()]}" alt="${cardName}" class="card-image">${cardName}</div>`;
        totalElixirCost += elixirCosts[cardName.trim()];
    });
    var averageElixirCost = (totalElixirCost / deckListText.length).toFixed(2);
    document.getElementById('result').innerHTML = deckListHtml;
    var avgElixirCostElement = document.getElementById('averageElixirCost');
    if (!avgElixirCostElement) {
        avgElixirCostElement = document.createElement('p');
        avgElixirCostElement.id = 'averageElixirCost';
        document.getElementById('result').appendChild(avgElixirCostElement);
    }
    avgElixirCostElement.textContent = 'Average Elixir Cost: ' + averageElixirCost;
    document.getElementById('result').style.display = 'block';
    showViableOptions(deckSuggestion);
}
function calculateDeckSuggestion() {
    var maxScore = Math.max(...Object.values(results));
    var deckType = Object.keys(results).find(key => results[key] === maxScore);
    switch (deckType) {
        case 'a':
            return "Fast Cycle Deck: Hog Rider, Ice Spirit, Zap, Fireball, Skeletons, Musketeer, Cannon, Ice Golem";
        case 'b':
            return "Control Deck: X-Bow, Tesla, Fireball, Log, Ice Spirit, Skeletons, Archers, Knight";
        case 'c':
            return "Beatdown Deck: Golem, Baby Dragon, Mega Minion, Lightning, Zap, Elixir Collector, Lumberjack, Night Witch";
        case 'd':
            return "Hybrid Deck: Royal Giant, Furnace, Lightning, Log, Guards, Electro Wizard, Mega Minion, Miner";
        default:
            return "Explore various decks to find your perfect match!";
    }
}
function showViableOptions(deckSuggestion) {
    var viableOptionsText = "<h4>Viable Card Swaps:</h4><ul>";
    var deckType = deckSuggestion.split(":")[0].trim();
    var swaps = {
        "Fast Cycle Deck": ["Mini P.E.K.K.A (for Hog Rider)", "Firecracker (for Musketeer)"],
        "Control Deck": ["Ice Wizard (for Archers)", "Tornado (for Log)"],
        "Beatdown Deck": ["Dark Prince (for Mega Minion)", "Poison (for Lightning)"],
        "Hybrid Deck": ["Minions (for Mega Minion)", "Bowler (for Furnace)"]
    };
    swaps[deckType].forEach(function(swap, index) {
        viableOptionsText += `<li>${swap} <button class="swapBtn" onclick="swapCard('${deckType}', ${index}, false)">Swap</button></li>`;
    });
    viableOptionsText += "</ul>";
    document.getElementById('viableOptions').innerHTML = viableOptionsText;
    document.getElementById('viableOptions').style.display = 'block';
}
function swapCard(deckType, swapIndex, isUnswap) {
    var swaps = {
        "Fast Cycle Deck": ["Mini P.E.K.K.A (for Hog Rider)", "Firecracker (for Musketeer)"],
        "Control Deck": ["Ice Wizard (for Archers)", "Tornado (for Log)"],
        "Beatdown Deck": ["Dark Prince (for Mega Minion)", "Poison (for Lightning)"],
        "Hybrid Deck": ["Minions (for Mega Minion)", "Bowler (for Furnace)"]
    };
    var swapDetail = swaps[deckType][swapIndex];
    var newCard = isUnswap ? swapDetail.split(" (for ")[1].slice(0, -1) : swapDetail.split(" (for ")[0];
    var oldCard = isUnswap ? swapDetail.split(" (for ")[0] : swapDetail.split(" (for ")[1].slice(0, -1);
    var cardDivs = document.getElementById('deckImages').querySelectorAll('div');
    cardDivs.forEach(function(div) {
        if (div.textContent.includes(oldCard)) {
            div.innerHTML = `<img src="${cardImages[newCard]}" alt="${newCard}" class="card-image">${newCard}`;
        }
    });
    var swapButton = document.querySelectorAll('.swapBtn')[swapIndex];
    swapButton.textContent = isUnswap ? "Swap" : "Unswap";
    swapButton.onclick = () => swapCard(deckType, swapIndex, !isUnswap);
    recalculateAndDisplayAverageElixirCost();
}
function recalculateAndDisplayAverageElixirCost() {
    var totalElixirCost = 0;
    var cardDivs = document.getElementById('deckImages').querySelectorAll('div');
    cardDivs.forEach(function(div) {
        var cardName = div.querySelector('img').alt;
        totalElixirCost += elixirCosts[cardName];
    });
    var averageElixirCost = (totalElixirCost / cardDivs.length).toFixed(2);
    var avgElixirCostElement = document.getElementById('averageElixirCost');
    if (!avgElixirCostElement) {
        avgElixirCostElement = document.createElement('p');
        avgElixirCostElement.id = 'averageElixirCost';
        document.getElementById('result').appendChild(avgElixirCostElement);
    }
    avgElixirCostElement.textContent = 'Average Elixir Cost: ' + averageElixirCost;
}
var elixirCosts = {
    "Hog Rider": 4,
    "Ice Spirit": 1,
    "Zap": 2,
    "Fireball": 4,
    "Skeletons": 1,
    "Musketeer": 4,
    "Cannon": 3,
    "Ice Golem": 2,
    "X-Bow": 6,
    "Tesla": 4,
    "Log": 2,
    "Archers": 3,
    "Knight": 3,
    "Golem": 8,
    "Baby Dragon": 4,
    "Mega Minion": 3,
    "Lightning": 6,
    "Elixir Collector": 6,
    "Lumberjack": 4,
    "Night Witch": 4,
    "Royal Giant": 6,
    "Furnace": 4,
    "Guards": 3,
    "Electro Wizard": 4,
    "Miner": 3,
    "Mini P.E.K.K.A": 4,
    "Firecracker": 3,
    "Ice Wizard": 3,
    "Tornado": 3,
    "Dark Prince": 4,
    "Poison": 4,
    "Minions": 3,
    "Bowler": 5,
};
var cardImages = {
    "Hog Rider": "https://th.bing.com/th/id/OIP.nktPtncr0gZT1pl2cN6t5QAAAA?rs=1&pid=ImgDetMain",
    "Ice Spirit": "https://th.bing.com/th/id/R.16bc4e655a74c1684778d34f2f7de19b?rik=eIv76AvwkbsSvw&riu=http%3a%2f%2fvignette1.wikia.nocookie.net%2fclashroyale%2fimages%2f2%2f2c%2fIceSpiritCard.png%2frevision%2flatest%3fcb%3d20160702201134&ehk=VlpPGk06Dk7p%2bVWAkcTsEMTr6giJ7ivUbo1bIVAadig%3d&risl=&pid=ImgRaw&r=0",
    "Zap": "https://th.bing.com/th/id/OIP.rTYA_-__1HIUxXO8FruRwgAAAA?rs=1&pid=ImgDetMain",
    "Fireball": "https://th.bing.com/th/id/OIP.dDSSKqfkem0s4mhZbqA-tgHaJB?rs=1&pid=ImgDetMain",
    "Skeletons": "https://th.bing.com/th/id/R.8d7d7c119a0a91cafbbe1bfca996a182?rik=ChBMqDLHXnuXfg&riu=http%3a%2f%2fvignette3.wikia.nocookie.net%2fclashroyale%2fimages%2ff%2ff0%2fSkeletonsCard.png%2frevision%2flatest%2fscale-to-width-down%2f200%3fcb%3d20160124213515&ehk=Tvo98oSjeSTMg%2bnPu1dlFMHDFdvudaRgSEjpd0DZGpw%3d&risl=&pid=ImgRaw&r=0",
    "Musketeer": "https://th.bing.com/th/id/OIP.MwRe7FLj535cxQXRkzb8SgAAAA?rs=1&pid=ImgDetMain",
    "Cannon": "https://th.bing.com/th/id/R.0ae6062a8df37aa57e5369f4163be6fc?rik=Raxe1YWsqHniuA&riu=http%3a%2f%2fvignette1.wikia.nocookie.net%2fclashroyale%2fimages%2f7%2f70%2fCannonCard.png%2frevision%2flatest%3fcb%3d20160702201036&ehk=f0W%2fnh0elTzQYk5BYpuQ%2b%2bPoq1K8NDW8TxMjJynrtWI%3d&risl=&pid=ImgRaw&r=0",
    "Ice Golem": "https://vignette2.wikia.nocookie.net/clashroyale/images/5/5f/IceGolemCard.png/revision/latest/scale-to-width-down/218?cb=20160930145935",
    "X-Bow": "https://vignette.wikia.nocookie.net/clashroyale/images/b/b5/X-BowCard.png/revision/latest?cb=20160702201313",
    "Tesla": "https://th.bing.com/th/id/OIP.uTb7RS_I5-ur6hxbdcwXHgAAAA?rs=1&pid=ImgDetMain",
    "Log": "https://vignette1.wikia.nocookie.net/clashroyale/images/4/4d/TheLogCard.png/revision/latest?cb=20160702201255",
    "Archers": "https://cdn.royaleapi.com/static/img/cards/archers.png?t=00e6f836c",
    "Knight": "https://th.bing.com/th/id/OIP.9VOo26K24ACChbxkDAhU9QAAAA?rs=1&pid=ImgDetMain",
    "Golem": "https://th.bing.com/th/id/R.4475f487e746eb555b3001877f7f2bd7?rik=edwz1J8No9GeMQ&riu=http%3a%2f%2fvignette3.wikia.nocookie.net%2fclashroyale%2fimages%2fd%2fd4%2fGolemCard.png%2frevision%2flatest%2fscale-to-width-down%2f218%3fcb%3d20160124213213&ehk=hQfoUT%2bdXAcITd3y8ODRjiBqDIFx6cQ3sagerv3CSoo%3d&risl=&pid=ImgRaw&r=0",
    "Baby Dragon": "https://th.bing.com/th/id/OIP.peWovAvronkm6322ojegFgHaI4?rs=1&pid=ImgDetMain",
    "Mega Minion": "https://th.bing.com/th/id/OIP.KS8HoGqdjVpT7kiOZcnKzQHaI3?rs=1&pid=ImgDetMain",
    "Lightning": "https://th.bing.com/th/id/OIP.yHtRnwGndFEpPlNkcprGjwAAAA?rs=1&pid=ImgDetMain",
    "Elixir Collector": "https://th.bing.com/th/id/OIP.At4dmvjxoDVX7cBtmXkPoQAAAA?rs=1&pid=ImgDetMain",
    "Lumberjack": "https://www.pngkit.com/png/detail/338-3385597_lumberjack-clash-royale-cards-lumberjack.png",
    "Night Witch": "https://th.bing.com/th/id/OIP.e_sJatfkyMiFvv03nsu_VQAAAA?rs=1&pid=ImgDetMain",
    "Royal Giant": "https://th.bing.com/th/id/R.582d170b5f3ab22340dd3cfb24fa0154?rik=pLCnpTFypGxCGg&riu=http%3a%2f%2fvignette3.wikia.nocookie.net%2fclashroyale%2fimages%2f8%2f8b%2fRoyalGiantCard.png%2frevision%2flatest%3fcb%3d20160302023049&ehk=uV3thRYaigGuHwxZQCFslX3SFwUDifex9RNk5AYij6Y%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1",
    "Furnace": "https://th.bing.com/th/id/R.e84462305dcc4b6a186c99524c5a1264?rik=F6L8AnwPZZxW6g&riu=http%3a%2f%2fvignette4.wikia.nocookie.net%2fclashroyale%2fimages%2f5%2f51%2fFurnaceCard.png%2frevision%2flatest%3fcb%3d20160518083429&ehk=nxrXXjsUcKPWmYWzbzThRAhtlYTVjKHOjEo5V15pvfw%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1",
    "Guards": "https://th.bing.com/th/id/R.8cca169150f7da186a5c87a763ec331a?rik=gXl2a7UfN9uqPQ&riu=http%3a%2f%2fvignette3.wikia.nocookie.net%2fclashroyale%2fimages%2f5%2f51%2fGuardsCard.png%2frevision%2flatest%3fcb%3d20160514062101&ehk=ALYe%2bsRyTGXPF3zh32rgwL06245tBV5dnDB6jGUdWcM%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1",
    "Electro Wizard": "https://th.bing.com/th/id/R.1f6b37f5d49e769f8e72483344cf3e01?rik=vHCHo8LBYbbp5Q&pid=ImgRaw&r=0",
    "Miner": "https://th.bing.com/th/id/OIP.Ajeg7jXPUgn-3QjpDiBs1AAAAA?rs=1&pid=ImgDetMain",
    "Mini P.E.K.K.A": "https://th.bing.com/th/id/OIP.sB7n6gyyiA5VbRUb17EemwAAAA?pid=ImgDet&w=230&h=276&rs=1",
    "Firecracker": "https://th.bing.com/th/id/OIP.aka4WZ7QIomaXhQFTIOz9gAAAA?rs=1&pid=ImgDetMain",
    "Ice Wizard": "https://th.bing.com/th/id/OIP.oiwR9g_xBSjJlZFXN4x33wAAAA?rs=1&pid=ImgDetMain",
    "Tornado": "https://vignette4.wikia.nocookie.net/clashroyale/images/3/37/TornadoCard.png/revision/latest?cb=20161031190737",
    "Dark Prince": "https://th.bing.com/th/id/OIP.o9_abzOUwu43ijabiUr-9AAAAA?rs=1&pid=ImgDetMain",
    "Poison": "https://th.bing.com/th/id/OIP.EdCn5FHkc3K9V26d_qUn3AAAAA?rs=1&pid=ImgDetMain",
    "Minions": "https://th.bing.com/th/id/OIP.sPVtaVlg1Igj9YdWqxQmQAAAAA?rs=1&pid=ImgDetMain",
    "Bowler": "https://th.bing.com/th/id/OIP.w8BlgUHsUfspZZ7uaRYKOwAAAA?rs=1&pid=ImgDetMain",
};
var allCards = [
    { name: "Hog Rider", type: "Offensive", strategy: "Fast-paced attacks", elixirCost: 4 },
    { name: "Tesla", type: "Defensive", strategy: "Control and counter", elixirCost: 4 },
    { name: "Musketeer", type: "Support", strategy: "Control and counter", elixirCost: 4 },
    { name: "Golem", type: "Tank", strategy: "Building up a big push", elixirCost: 8 },
    { name: "Balloon", type: "Offensive", strategy: "Fast-paced attacks", elixirCost: 5 },
    { name: "Tornado", type: "Defensive", strategy: "Control and counter", elixirCost: 3 },
    { name: "Wizard", type: "Support", strategy: "Building up a big push", elixirCost: 5 },
    { name: "Giant", type: "Tank", strategy: "Building up a big push", elixirCost: 5 },
    { name: "Zap", type: "Support", strategy: "Fast-paced attacks", elixirCost: 2 },
    { name: "Fireball", type: "Support", strategy: "Control and counter", elixirCost: 4 },
    { name: "Ice Spirit", type: "Defensive", strategy: "Fast-paced attacks", elixirCost: 1 },
    { name: "Miner", type: "Offensive", strategy: "Surprise elements and versatility", elixirCost: 3 },
    { name: "Skeleton Army", type: "Defensive", strategy: "Control and counter", elixirCost: 3 },
    { name: "Elixir Collector", type: "Support", strategy: "Building up a big push", elixirCost: 6 },
    { name: "Lumberjack", type: "Offensive", strategy: "Fast-paced attacks", elixirCost: 4 },
    { name: "Baby Dragon", type: "Support", strategy: "Building up a big push", elixirCost: 4 },
    { name: "Night Witch", type: "Offensive", strategy: "Building up a big push", elixirCost: 4 },
    { name: "Royal Giant", type: "Tank", strategy: "Surprise elements and versatility", elixirCost: 6 },
    { name: "Electro Wizard", type: "Support", strategy: "Control and counter", elixirCost: 4 },
    { name: "Mega Minion", type: "Defensive", strategy: "Control and counter", elixirCost: 3 },
    { name: "Poison", type: "Support", strategy: "Surprise elements and versatility", elixirCost: 4 },
    { name: "Dark Prince", type: "Offensive", strategy: "Fast-paced attacks", elixirCost: 4 },
    { name: "Bowler", type: "Defensive", strategy: "Control and counter", elixirCost: 5 },
];
var userCardTypePreference = "Offensive";
var userStrategyPreference = "Fast-paced attacks";
function generateCustomDeckRecommendation(cardTypePreference, strategyPreference) {
    /*var filteredCards = allCards.filter(function(card) {
        return card.type === cardTypePreference && card.strategy === strategyPreference;
    });*/
    var filteredcards=[]; 
    for(i=0; i<allCards.length; i++) {
        if(allCards[i].type === cardTypePreference && allCards[i].strategy === strategyPreference) {
            filteredcards.push(allCards[i]);
        }
    }
    var recommendedDeck = filteredCards.map(function(card) {
        return card.name;
    }).join(', ')
    return "Recommended Deck based on your preferences: " + recommendedDeck;
}
var customDeckRecommendation = generateCustomDeckRecommendation(userCardTypePreference, userStrategyPreference);
console.log(customDeckRecommendation);
document.getElementById('nextBtn').addEventListener('click', function() {
    if (currentQuestion === questions.length) {
        showResults();
    } else {
        nextQuestion();
    }
});
startQuiz(); 