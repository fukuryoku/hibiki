

// Change nav backgr on scroll
$(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNavbar");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
});

// ++++++++++++CART CONTROL++++++++++++++++++++++++
let cart = document.getElementById('cart');

var cartCounter=0;
// adding event listener to order a with .this context
var OrderBtnArr = document.querySelectorAll('a.order')
for(var i=0;i<OrderBtnArr.length;i++){
      OrderBtnArr[i].onclick = addCart
        // this.parentNode.innerHTML = "Not a button";
    
}

//Adding prod to cart
function addCart(btn)
{
    let newBuy = document.createElement('div');
    let price=this.parentNode.querySelector("p.price").innerText;
    let title=this.parentNode.querySelector("h5.t").innerText;
    newBuy.className = "row";
    newBuy.innerHTML = 
    `<div  name="title"   class="col" >${title} </div>
    <div name="price"class="col">${price}</div>
    `;
   // <div name="sum" class="col"></div>
    // <div  class="col"> <input name="quantity" type="number" min="1" max="5" value="1" step="1" readonly = "readonly"> </div>

    cart.insertBefore(newBuy, cart.children[0]);
    
    let delBtn = document.createElement('button');
    delBtn.innerText="delete";
    delBtn.classList="btn btn-danger"
    newBuy.appendChild(delBtn);
    cartCounter++
    refreshCart()
    document.querySelector("#cartCounter").innerText =cartCounter;
    delBtn.onclick=function()
    {
      cart.removeChild(newBuy)
      cartCounter--
      document.querySelector("#cartCounter").innerText =cartCounter;
      refreshCart()
      
    }
  
   
  
  }
  
  function  refreshCart(){
      // var sums = document.querySelectorAll('div [name=sum]')
      var prices = document.querySelectorAll('div [name=price]')
      // var quants = document.querySelectorAll('input [name=quantity]')
      // var total=document.querySelector('div [name=total]').innerText
      // for(var i=0; i<sums.length;i++){
      //   sums[i].innerText=1*Number(document.querySelectorAll('div [name=price]')[i].innerText);
        // Number(document.querySelectorAll('input[name=quantity]')[i].value)
      
      var res=0
      // for(var i=0; i<sums.length;i++){
      //   res+=Number(sums[i].innerText);
      // }
      for(var i=0; i<prices.length;i++){
        res+=Number(prices[i].innerText);
      }
      if(document.getElementById('discount')){res-= (res/100)*document.getElementById('discount').innerText} //span from ejs

      document.querySelector('div [name=total]').innerText="Сумма "+res+" UAH";
      addCartHtmlToOrderForm();
  }
  
// ++++++++++++END OF CART CONTROL+++++++++++++++++++++++++++++++++=


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").classList.add("myBtnUnHidden");
        document.getElementById("myBtn").style.display = "block";

    } else {
        document.getElementById("myBtn").style.display = "none";
        document.getElementById("myBtn").classList.remove("myBtnUnHidden");
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 

$('body').scrollspy({ target: '#mainNavbar' });


// Animation on viewport

var animateHTML = function() {
    var elems;
    var windowHeight;
    function init() {
      elems = document.querySelectorAll('.hidden');
      elemsTwo = document.querySelectorAll('.hidden2');

      windowHeight = window.innerHeight;
      addEventHandlers();
      checkPosition();
    }
    function addEventHandlers() {
      window.addEventListener('scroll', checkPosition);
      window.addEventListener('resize', init);
    }
    function checkPosition() {

      for (var i = 0; i < elems.length; i++) {
        var positionFromTop = elems[i].getBoundingClientRect().top;
        if (positionFromTop - windowHeight <= 0) {
          elems[i].className = elems[i].className.replace(
            'hidden',
            'fade-in-element'
          );
        }
      }

      for (var i = 0; i < elemsTwo.length; i++) {
        var positionFromTop = elemsTwo[i].getBoundingClientRect().top;
        if (positionFromTop - windowHeight <= 0) {
          elemsTwo[i].className = elemsTwo[i].className.replace(
            'hidden2',
            'fade-in-element2'
          );
        }
      }

    }
    
    return {
      init: init
    };
  };

  animateHTML().init();
  
  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
 

let refreshBtn = document.getElementById('refreshBtn')
refreshBtn.onclick=function(){
  refreshCart()
}


let cartBtn = document.getElementById('cartBtn')
let cartDiv = document.getElementById('cart')
cartBtn.onclick=function(){
  cartDiv.style.display = "block"
}


let CheckoutBtn = document.getElementById('CheckoutBtn')
let formDiv = document.getElementById('form')

CheckoutBtn.onclick=function(){
  refreshCart()
  formDiv.style.display = "block"
  

}

function addCartHtmlToOrderForm(){
  document.getElementById('orderTable').value=document.getElementById('cart').innerHTML;
}
