// https://github.com/hexschool/js-training/blob/main/travelApi.json

let data = [
  {
    id: 0,
    name: "肥宅心碎賞櫻3日",
    imgUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
    area: "高雄",
    description: "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
    group: 87,
    price: 1400,
    rank: 10,
  },
  {
    id: 1,
    name: "貓空纜車雙程票",
    imgUrl:
      "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    area: "台北",
    description:
      "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
    group: 99,
    price: 240,
    rank: 2,
  },
  {
    id: 2,
    name: "台中谷關溫泉會1日",
    imgUrl:
      "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    area: "台北",
    description:
      "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
    group: 20,
    price: 1765,
    rank: 7,
  },
];

const form = document.querySelector(".addTicket-form");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketDescription = document.querySelector("#ticketDescription");
const searchAreaSelect = document.querySelector("#search-area-select");
const searchResultText = document.querySelector("#searchResult-text");
const inputs = document.querySelectorAll("input");
const warnings = document.querySelectorAll(".fa-exclamation-circle + span");

const ticketCardArea = document.querySelector(".ticketCard-area");
const cantFindFrea = document.querySelector(".cantFind-area");

const tempTicketInfo = {};

const ticketProxy = new Proxy(tempTicketInfo, {
  get(target, prop) {
    // console.log(prop, target[prop]);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    if (value.trim() === "") {
      alert(`輸入不能為空白請重新輸入`);
      return;
    }
    if (prop === "imgUrl") {
      const regex =
        /^(https?):\/\/([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w\.\-]*)*\/?(.)*/g;
      if (!regex.test(value)) {
        alert(`輸入網址格式有問題請再確認一次`);
        return;
      }
    }
    console.log(`新增一個屬性${prop}, 值為${value.trim()}`);
    return Reflect.set(target, prop, value.trim());
  },
  deleteProperty(target, prop) {
    // console.log(target[prop], prop);
    return Reflect.deleteProperty(target, prop);
  },
});

function rendnerDom(array) {
  const fragment = document.createDocumentFragment();
  array.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML += `
            <div class="ticketCard-img">
                <a href="#">
                    <img
                        src="${item.imgUrl}"
                        alt="${item.name}"
                    />
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rank}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${item.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                </div>
            </div>`;
    const cardClass = ["ticketCard", "card-fadeUp"];
    li.classList.add(...cardClass);
    fragment.append(li);
  });
  ticketCardArea.innerHTML = "";
  ticketCardArea.append(fragment);
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

if (localStorage.getItem("data")) {
  data = JSON.parse(localStorage.getItem("data"));
}
rendnerDom(data);

function reRedner(item) {
  const fragment = document.createDocumentFragment();
  const li = document.createElement("li");
  li.innerHTML += `
              <div class="ticketCard-img">
                  <a href="#">
                      <img
                          src="${item.imgUrl}"
                          alt="${item.name}"
                      />
                  </a>
                  <div class="ticketCard-region">${item.area}</div>
                  <div class="ticketCard-rank">${item.rank}</div>
              </div>
              <div class="ticketCard-content">
                  <div>
                      <h3>
                          <a href="#" class="ticketCard-name">${item.name}</a>
                      </h3>
                      <p class="ticketCard-description">
                          ${item.description}
                      </p>
                  </div>
                  <div class="ticketCard-info">
                      <p class="ticketCard-num">
                          <span><i class="fas fa-exclamation-circle"></i></span>
                          剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                      </p>
                      <p class="ticketCard-price">
                          TWD <span id="ticketCard-price">$${item.price}</span>
                      </p>
                  </div>
              </div>`;
  const cardClass = ["ticketCard", "card-fadeUp"];
  li.classList.add(...cardClass);
  fragment.append(li);
  ticketCardArea.append(fragment);
}

function eventListener(event, element) {
  element.addEventListener(event, (e) => {
    const i =
      e.target.parentElement.parentElement.childNodes[3].childNodes[1]
        .childNodes[1];
    const span =
      e.target.parentElement.parentElement.childNodes[3].childNodes[1]
        .childNodes[3];
    if (e.target.value.trim() !== "") {
      i.classList.add("warning-none");
      span.classList.add("warning-none");
    } else {
      i.classList.remove("warning-none");
      span.classList.remove("warning-none");
    }
    ticketProxy[e.target.dataset.prop] = e.target.value;
  });
}

inputs.forEach((element) => {
  eventListener("change", element);
});
eventListener("change", ticketRegion);
eventListener("change", ticketDescription);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (Object.keys(tempTicketInfo).length < 7) {
    alert("有欄位尚未填入，請重新操作");
    return;
  }
  for (let key in tempTicketInfo) {
    if (tempTicketInfo[key] === "") {
      alert("有欄位尚未填入，請重新操作");
      return;
    }
  }
  ticketProxy.id = Date.now() + Math.random().toString(16);
  data.push(JSON.parse(JSON.stringify(tempTicketInfo)));
  localStorage.setItem("data", JSON.stringify(data));
  reRedner(data[data.length - 1]);
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
  for (let key in ticketProxy) {
    delete ticketProxy[key];
  }
  form.reset();
});

searchAreaSelect.addEventListener("change", (e) => {
  //   console.log(e.target.id, e.target.value);
  if (!cantFindFrea.classList.contains("d-none")) {
    cantFindFrea.classList.add("d-none");
  }

  const result = data.filter((item) => {
    if (e.target.value === "all") {
      return true;
    } else {
      return item.area === e.target.value;
    }
  });
  if (result.length === 0) {
    cantFindFrea.classList.remove("d-none");
    searchResultText.textContent = `本次搜尋共 ${result.length} 筆資料`;
  }

  ticketCardArea.innerHTML = "";
  result.forEach((item) => {
    reRedner(item);
    searchResultText.textContent = `本次搜尋共 ${result.length} 筆資料`;
  });
});
