/* NAV */
const menuBtn = document.getElementById("menu-btn");
const navOverlay = document.getElementById("nav-overlay");
const closeMenu = document.getElementById("close-menu");

menuBtn.onclick = () => navOverlay.classList.add("active");
closeMenu.onclick = () => navOverlay.classList.remove("active");

/* DATA */
const burgers = [
  {
    src:"McCrispyBurger.png",
    name:"McCrispy Burger",
    subtitle:"CLASSIC FAVORITE",
    desc:"Crispy chicken & lettuce",
    ingredients:["Chicken","Lettuce","Sauce","Bun"]
  },
  {
    src:"BigMac.png",
    name:"Big Mac",
    subtitle:"WORLD FAMOUS",
    desc:"Two patties & sauce",
    ingredients:["Beef","Cheese","Pickles"]
  },
  {
    src:"Cheeseburger.png",
    name:"Cheeseburger",
    subtitle:"CLASSIC",
    desc:"Beef & cheese",
    ingredients:["Beef","Cheese","Bun"]
  }
];

let index = 0;

/* HERO */
const img = document.querySelector(".burger.main");
const h1 = document.querySelector(".hero-right h1");
const h4 = document.querySelector(".hero-right h4");
const p = document.querySelector(".hero-right p");

function updateHero(i) {
  img.src = burgers[i].src;
  h1.textContent = burgers[i].name;
  h4.textContent = burgers[i].subtitle;
  p.textContent = burgers[i].desc;
}

updateHero(0);

/* ARROWS */
document.querySelector(".arrow.right").onclick = () => {
  index = (index + 1) % burgers.length;
  updateHero(index);
};

document.querySelector(".arrow.left").onclick = () => {
  index = (index - 1 + burgers.length) % burgers.length;
  updateHero(index);
};

/* FULL MENU */
const grid = document.querySelector(".menu-grid");
const fullMenu = document.getElementById("full-menu");

burgers.forEach((b,i)=>{
  const card = document.createElement("div");
  card.className="menu-card";
  card.innerHTML=`<img src="${b.src}"><h4>${b.name}</h4>`;
  card.onclick=()=>{
    index=i;
    updateHero(i);
  };
  grid.appendChild(card);
});

document.getElementById("fullMenuBtn").onclick=()=>fullMenu.classList.add("active");
document.getElementById("backHero").onclick=()=>fullMenu.classList.remove("active");

/* MODAL */
const modal = document.getElementById("ingredients-modal");
const list = document.getElementById("ingredients-list");
const title = document.getElementById("ingredients-title");

document.getElementById("viewMoreBtn").onclick=()=>{
  list.innerHTML="";
  title.textContent=burgers[index].name;
  burgers[index].ingredients.forEach(i=>{
    const li=document.createElement("li");
    li.textContent=i;
    list.appendChild(li);
  });
  modal.classList.add("active");
};

document.querySelector(".close-ingredients").onclick=()=>modal.classList.remove("active");
modal.onclick=e=>{ if(e.target===modal) modal.classList.remove("active"); };
