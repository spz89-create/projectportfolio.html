// Contact Form Alert
document.getElementById("contactForm").addEventListener("submit", function(e){

  e.preventDefault();

  alert("Message Sent Successfully!");

});


// Navbar Scroll Effect
window.addEventListener("scroll", function(){

  const navbar = document.querySelector(".navbar");

  if(window.scrollY > 50){
    navbar.style.background = "#020617";
  } else {
    navbar.style.background = "transparent";
  }

});
