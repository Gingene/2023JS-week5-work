// https://github.com/hexschool/js-training/blob/main/travelApi.json
const url1 =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json";
const url2 =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];

const form = document.querySelector(".addTicket-form");
const searchAreaSelect = document.querySelector("#search-area-select");
const searchResultText = document.querySelector("#searchResult-text");
const inputs = document.querySelectorAll(
  "input, #ticketDescription, #ticketRegion"
);
const ticketCardArea = document.querySelector(".ticketCard-area");
const cantFindFrea = document.querySelector(".cantFind-area");

// console.log(inputs);

function getData() {
  axios
    .get(url2)
    .then((res) => {
      console.log(res);
      data = res.data.data;
      rendnerDom(data);
    })
    .catch((err) => {
      console.log(err);
      cantFindFrea.classList.add("d-none");
    });
}
getData();

const tempTicketInfo = {};

const ticketProxy = new Proxy(tempTicketInfo, {
  get(target, prop) {
    // console.log(prop, target[prop]);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    if (value.trim() === "") {
      return;
    }
    if (prop === "imgUrl") {
      return new Promise((resolve, reject) => {
        const handleImgUrl = async (imgurl) => {
          try {
            const res = await checkImgURL(imgurl);
            console.log("圖片OK");
            resolve(Reflect.set(target, prop, value.trim()));
          } catch (err) {
            alert("圖片似乎不存在");
            reject("Invalid Image");
          }
        };
        handleImgUrl(value);
      });
      // 當屬性為imgUrl檢查圖片是否存在，放棄原本的正規表達是因為圖片原因寫的規則沒辦法很好的匹配圖片網址，此寫法直接參考網路的作法
      // const regex =
      //   /^(https?):\/\/([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w\.\-]*)*\/?(.)*/g;
      // if (!regex.test(value)) {
      //   alert(`輸入網址格式有問題請再確認一次`);
      //   return;
      // }
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
                <div class="ticketCard-rate">${item.rate}</div>
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
                        剩下最後 <span id="ticketCard-num-${item.id}"> ${item.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price-${item.id}">$${item.price}</span>
                    </p>
                </div>
            </div>`;
    const cardClass = ["ticketCard", "card-fadeUp"];
    li.classList.add(...cardClass);
    li.setAttribute("id", item.id);
    fragment.append(li);
  });
  while (ticketCardArea.firstChild) {
    ticketCardArea.removeChild(ticketCardArea.firstChild);
  }
  ticketCardArea.append(fragment);
  searchResultText.textContent = `本次搜尋共 ${array.length} 筆資料`;
}

// if (localStorage.getItem("data")) {
//   data = JSON.parse(localStorage.getItem("data"));
// }

function eventListener(event, element) {
  element.addEventListener(event, (e) => {
    const p = e.target.parentElement.nextElementSibling.childNodes[1];
    if (e.target.value.trim() !== "") {
      p.classList.add("warning-none");
    } else {
      p.classList.remove("warning-none");
    }
    ticketProxy[e.target.dataset.prop] = e.target.value;
  });
}

inputs.forEach((element) => {
  eventListener("change", element);
});

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
  // localStorage.setItem("data", JSON.stringify(data));
  rendnerDom(data);
  // document
  //   .getElementById(ticketProxy.id)
  //   .scrollIntoView({ behavior: "smooth" });
  // element.scrollIntoViewIfNeeded() // scrollIntoView()的變體
  searchAreaSelect.value = "all";
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

  rendnerDom(result);
});

function checkImgURL(imgurl) {
  return new Promise((resolve, reject) => {
    const imgObj = new Image();
    imgObj.src = imgurl;
    imgObj.onload = (res) => {
      resolve(res);
    };
    imgObj.onerror = (err) => {
      reject(err);
    };
  });
}
