const address = document.querySelector(".address");
const betsList = document.querySelector(".table-body");

const daysOne = document.querySelector("#days-1");
const daysTwo = document.querySelector("#days-2");
const hoursOne = document.querySelector("#hours-1");
const hoursTwo = document.querySelector("#hours-2");
const minutesOne = document.querySelector("#minutes-1");
const minutesTwo = document.querySelector("#minutes-2");

// таймер
const whenStops = 1747040400;
const transmute = str => [parseInt(str[0], 10), parseInt(str[1], 10)];
const toDigit = num => transmute(num.toString().padStart(2, '0'));
const updateTime = () => {
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
}
updateTime();
setInterval(updateTime, 60000);

// таблица топ-игроков и призов
const prizes = [
    10000,
    5000,
    3000,
    500,
    500,
    500,
    3000,
    500,
    500,
    500,

]

const topBets = [
    {
        place: 1,
        phone: "+7...4567",
        sum: 10000,
        coef: 10.01,
        total: 100100,
    },
    {
        place: 2,
        phone: "+7...1488",
        sum: 9000,
        coef: 10.00,
        total: 90000,
    },
    {
        place: 3,
        phone: "+7...4567",
        sum: 8000,
        coef: 10.00,
        total: 80000,
    },
    {
        place: 4,
        phone: "+7...4567",
        sum: 7000,
        coef: 10.00,
        total: 70000,
    },
    {
        place: 5,
        phone: "+7...4567",
        sum: 6000,
        coef: 10.00,
        total: 60000,
    },
    {
        place: 6,
        phone: "+7...4567",
        sum: 5000,
        coef: 10.00,
        total: 50000,
    },
    {
        place: 7,
        phone: "+7...4567",
        sum: 4000,
        coef: 10.00,
        total: 40000,
    },
    {
        place: 8,
        phone: "+7...4567",
        sum: 3000,
        coef: 10.00,
        total: 30000,
    },
    {
        place: 9,
        phone: "+7...4567",
        sum: 2000,
        coef: 10.00,
        total: 20000,
    },
    {
        place: 10,
        phone: "+7...1488",
        sum: 2000,
        coef: 2.20,
        total: 4400,
    },

]

const updateTopBets = topBets => {

    betsList.innerHTML = "";

    for (let i = 0; i < topBets.length; i++) {
        let tableRow = document.createElement("div");
        tableRow.classList.add("table-row");

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
        let prize = document.createElement("div");
        prize.classList.add("prize", "table-row-piece");

        placeNumber.innerText = topBets[i].place;
        phone.innerText = topBets[i].phone;
        sum.innerText = new Intl.NumberFormat('ru-RU').format(topBets[i].sum) + " ₽";
        coef.innerText = topBets[i].coef;
        total.innerText = new Intl.NumberFormat('ru-RU').format(topBets[i].total);
        prize.innerText = new Intl.NumberFormat('ru-RU').format(prizes[i]);

        place.append(placeNumber);
        tableRow.append(place, phone, sum, coef, total, prize);
        betsList.append(tableRow);
    }

}

updateTopBets(topBets);