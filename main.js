const address = document.querySelector(".address");
const betsList = document.querySelector(".table-body");

const daysOne = document.querySelector("#days-1");
const daysTwo = document.querySelector("#days-2");
const hoursOne = document.querySelector("#hours-1");
const hoursTwo = document.querySelector("#hours-2");
const minutesOne = document.querySelector("#minutes-1");
const minutesTwo = document.querySelector("#minutes-2");
const height = 74;
let localPrizes = [];

// таймер
const transmute = str => [parseInt(str[0], 10), parseInt(str[1], 10)];
const toDigit = num => transmute(num.toString().padStart(2, '0'));
const updateTime = whenStops => {
    let howMuchTimeLeft = whenStops - Math.floor(Date.now()/1000);

    let days = toDigit(Math.floor(howMuchTimeLeft / (24 * 3600)));
    let hours = toDigit(Math.floor((howMuchTimeLeft % (24 * 3600)) / 3600));
    let minutes = toDigit(Math.floor((howMuchTimeLeft % 3600) / 60));

    daysOne.innerText = days[0];
    daysTwo.innerText = days[1];
    hoursOne.innerText = hours[0];
    hoursTwo.innerText = hours[1];
    minutesOne.innerText = minutes[0];
    minutesTwo.innerText = minutes[1];
    
    console.log("Время было обновлено!");

    setTimeout(updateTime, 60000, whenStops);
}

const addNewBet = (bet, prize) => {
    let tableRow = document.createElement("div");
    tableRow.classList.add("table-row");
    tableRow.style.top = `${height * (bet.place - 1)}px`;
    tableRow.id = bet.place;
    console.log(height * (bet.place - 1));

    let place = document.createElement("div");
    place.classList.add("place", "table-row-piece");
        let placeNumber = document.createElement("div");
        placeNumber.classList.add("place-number");
    let phone = document.createElement("div");
    phone.classList.add("player", "table-row-piece");
    let sum = document.createElement("div");
    sum.classList.add("win", "table-row-piece");
    let coef = document.createElement("div");
    coef.classList.add("coef", "table-row-piece");
    let total = document.createElement("div");
    total.classList.add("total", "table-row-piece");
    let prizeElement = document.createElement("div");
    prizeElement.classList.add("prize", "table-row-piece");

    placeNumber.innerText = bet.place;
    phone.innerText = "+7..." + bet.phone;
    sum.innerText = new Intl.NumberFormat('ru-RU').format(bet.sum) + " ₽";
    coef.innerText = bet.coef;
    total.innerText = new Intl.NumberFormat('ru-RU').format(bet.total);
    prizeElement.innerText = new Intl.NumberFormat('ru-RU').format(prize);

    place.append(placeNumber);
    tableRow.append(place, phone, sum, coef, total, prizeElement);
    betsList.append(tableRow);
}

const addBets = (topBets, prizes) => {
    betsList.innerHTML = "";

    for (let i = 0; i < topBets.length; i++) addNewBet(topBets[i], prizes[i]);
}

const reShuffle = obj => {
    // сначала нужно определить какие именно элементы будут изменяться
    if (obj.old === 0) {
        // смотрим сколько сейчас вообще есть мест
        if (betsList.children.length);
        return;
    }

    let movingCounter = 1 + obj.old - obj.new;

    let movingPlaces = []
    for (let i = 0; i < movingCounter; i++) {
        movingPlaces.push(obj.new + i)
    }

    // а может и использовать для перестановок единый массив, сколько элементов, столько и перестановок
    let pickedBlocks = [];
    
    for (let i = 0; i < movingPlaces.length - 1; i++) {
        let player = document.getElementById(movingPlaces[i]);
        pickedBlocks.push(player);
        player.querySelector('.place-number').innerText = movingPlaces[i+1];
        player.querySelector('.prize').innerText = new Intl.NumberFormat('ru-RU').format(localPrizes[movingPlaces[i]]);
        player.style.top = `${height * movingPlaces[i]}px`;
    }
    for (let i = 0; i < pickedBlocks.length; i++) {
        pickedBlocks[i].id = movingPlaces[i+1];
    }

    let arr = [];
    for (let i = 0; i < betsList.children.length; i++) {
        arr[i] = betsList.children[i].id;
    }
    let arrDuplicates = arr.filter((number, index, numbers) => {
        numbers.indexOf(number) !== index;
    });
    if (arrDuplicates.length) console.log('наличие повторяющихся id:', arrDuplicates);
}

const updateOrder = changeData => {
    console.log('ауу');
    let player = document.getElementById(changeData.old);

    reShuffle(changeData);

    player.style.top = `${height * (changeData.new - 1)}px`;
    player.querySelector('.place-number').innerText = player.id = changeData.new;
    player.querySelector('.win').innerText = new Intl.NumberFormat('ru-RU').format(changeData.sum) + " ₽";
    player.querySelector('.coef').innerText = changeData.coef;
    player.querySelector('.total').innerText = new Intl.NumberFormat('ru-RU').format(changeData.total);
    player.querySelector('.prize').innerText = new Intl.NumberFormat('ru-RU').format(localPrizes[player.id - 1]);
}

const currentUrl = new URL(window.location.href);
let socketUrl = currentUrl.href.replace("http", "ws");
socketUrl = socketUrl.replace("/ladder/", "/ws/");
socketUrl = socketUrl.replace("/index.html", "");

const socket = new WebSocket(socketUrl);
console.log("socket:", socket);
setTimeout(() => {
    if (socket.readyState != 1 || 0) {
        setTimeout(()=>{
            location.reload();
        }, 50000);
    }
}, 10000);
socket.onopen = connection => {
    console.log(connection);
}
socket.onmessage = event => {
    let data = JSON.parse(event.data);
    console.log(data);
    if (data.name % data.prizes) {
        address.innerText = data.name;
        localPrizes = data.prizes
        addBets(data.rating, prizes);
    }
    if (data.period) updateTime(data.period);
    if (data.add) {
        if (data.add.place > betsList.children.length) {
            addNewBet(data.add, localPrizes[(data.add.place - 1)]);
        } else location.reload();
    }
    if (data.update) {
        console.log(data.update);
        updateOrder(data.update);
    }

}
