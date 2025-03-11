var celebs = [{
    "name": "Beyonce",
    "title": "Houses, CTO",
    "quote": "Hello, I am Beyonce. I like to sell homes to you and I am good at it."
  },
 {
    "name": "John Mayers",
    "title": "Halcyon, CEO",
    "quote": "I am John Mayers. I sing good I think, I am not sure. I haven't listened to him."
  },
 {
    "name": "Bruno Mars",
    "title": "Places, CFO",
    "quote": "I am Bruno Mars. Let's go to Mars everybody."
  }];

var buttons = document.querySelectorAll("button");
var images = document.querySelectorAll("img");
var quote = document.querySelector('.quote');
var name = document.querySelector('.name');
var title = document.querySelector('.position');

buttons.forEach(function(button){
button.addEventListener("click", function(){
buttons.forEach(function(button){
button.classList.remove("active-button");
});
this.classList.add("active-button");
});
});

images.forEach(function(image){
image.addEventListener("click", function(){
images.forEach(function(image){
image.classList.remove("active-image");
});
this.classList.add("active-image");
if(this == images[0]){
quote.textContent = celebs[0].quote;
name.textContent = celebs[0].name;
title.textContent = celebs[0].title;
}
else if(this == images[1]){
quote.textContent = celebs[1].quote;
name.textContent = celebs[1].name;
title.textContent = celebs[1].title;
}
else if(this == images[2]){
quote.textContent = celebs[2].quote;
name.textContent = celebs[2].name;
title.textContent = celebs[2].title;
}
});
});