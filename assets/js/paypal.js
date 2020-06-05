{{- $payPalSuccess := .Site.Params.success }}

function payPalSuccessFeedback(name) {
  const successWidget = `
  <div class="modal modal_translucent">
  <div class="modal_inner">
  <img src="/icons/tick.svg" class="modal_icon modal_success">
  <h2>{{ $payPalSuccess.heading }} ${name}</h2>
  <p>{{ $payPalSuccess.description }}</p>
  <span class="modal_close"></span>
  </div>
  </div>
  `;
  return successWidget
}

(function closePayPalFeedbackWidget(){
  const close = '.modal_close';
  const modal = '.modal';
  
  page.addEventListener('click', function(event){
    const target = event.target;
    const isActionable = target.matches(close) || target.matches(modal);
    const thisModal = elem('.modal_translucent');
    if(isActionable) {
      thisModal.parentNode.remove(thisModal);
      location.reload();
    } 
  });
  
})();

const active = 'active';
const option = '.pricing_option';
const detail = '.pricing_detail';
const pricingOptionsButtons = elems(option);
const pricingOptionsDetails = elems(detail);

if(pricingOptionsButtons) {
  pricingOptionsButtons.forEach(function(button, index){
    const buttonWidth = button.offsetWidth;
    const buttonSpan = button.lastElementChild;
    buttonSpan.style.transform = index == 0 ? `translateX(${buttonWidth}px)` : `translateX(-${buttonWidth}px)`;
  });
}

(function pricingOptions(){
  pushClass(pricingOptionsButtons[0], active);
  pushClass(pricingOptionsDetails[0], active);
  
  function activateOption(items) {
    const activeItem = Array.from(items).filter(function(item){
      return item.matches(`.${active}`);
    })[0];
    
    const inActiveItem = Array.from(items).filter(function(item){
      return !item.matches(`.${active}`);
    })[0];
    // console.log(activeItem);
    deleteClass(activeItem, active);
    pushClass(inActiveItem, active);
    
  }
  
  page.addEventListener('click', function(event){
    const target = event.target;
    const isOptionButton = target.parentNode.matches(option) || target.matches(option);
    const isActiveOption = target.parentNode.matches(`.${active}`) || target.matches(`.${active}`);
    
    if(isOptionButton && !isActiveOption) {
      activateOption(pricingOptionsButtons);
      activateOption(pricingOptionsDetails);
    }
  })
})();

(function loadSmartPayPalButton(){
  const payPalButtonPlaceholders = elems('.pricing_button');
  if(payPalButtonPlaceholders) {
    payPalButtonPlaceholders.forEach(function(placeholder){
      const buttonID =  placeholder.id;
      const thisAmount = placeholder.dataset.amount;
      payUp(buttonID, thisAmount);
    });
  }
})();


function payUp(id, productAmount) {
  paypal.Buttons(
    {
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              "currency_code": "USD",
              "value": productAmount
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          // alert('Transaction completed by ' + details.payer.name.given_name);
          const thisDocument = elem('.modal');
          const successWidget = payPalSuccessFeedback(details.payer.name.given_name)
          thisDocument.innerHTML = successWidget;
        });
      }
    }
    ).render(`#${id}`);
    // This function displays Smart Payment Buttons on your web page.
  }
  