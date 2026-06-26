/* ==========================================
   Portfolio Script
========================================== */

console.log("Portfolio Loaded");

/* ==========================================
   Smooth Navigation
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/* ==========================================
   Reveal Animation
========================================== */

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("fade");

        }

    });

},{
    threshold:0.15
});

document.querySelectorAll("section").forEach(section=>{

    observer.observe(section);

});

/* ==========================================
   Sakura Animation
========================================== */

function createSakura(){

    const petal=document.createElement("div");

    petal.classList.add("sakura");

    petal.style.left=Math.random()*100+"vw";

    petal.style.animationDuration=
        (Math.random()*5+6)+"s";

    petal.style.opacity=Math.random();

    petal.style.transform=
        "scale("+(Math.random()+0.3)+")";

    document.body.appendChild(petal);

    setTimeout(()=>{

        petal.remove();

    },12000);

}

setInterval(createSakura,450);

/* ==========================================
   Active Menu
========================================== */

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(section=>{

        const sectionTop=section.offsetTop-150;

        if(scrollY>=sectionTop){

            current=section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   Hero Glow
========================================== */

const circle=document.querySelector(".circle");

window.addEventListener("mousemove",(e)=>{

    if(circle){

        circle.style.transform=

        "translate("+

        (e.clientX/90)+"px,"+

        (e.clientY/90)+"px)";

    }

});

/* ==========================================
   Footer Year
========================================== */

const footer=document.querySelector("footer p");

if(footer){

    footer.innerHTML=
    "© "+new Date().getFullYear()+
    " Anas Anida • Japanese Cyber Portfolio";

}

/* ==========================================
   Console Message
========================================== */

console.log("Welcome Anas Anida 🚀");