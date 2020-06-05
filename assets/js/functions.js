{{- $siteParams := .Site.Params }}
var page = document;
var modalClass = 'modal';
var payPalButtonID = "paypal-btn-smart";
var coursePrice = {{ $siteParams.coursePrice }};
var payPalPromptText = `To enrol, please complete the payment of $${coursePrice}`;

function elem(selector, parent = document){
  let elem = parent.querySelector(selector);
  return elem != false ? elem : false;
}

function elems(selector, parent = document) {
  let elems = parent.querySelectorAll(selector);
  return elems.length ? elems : false; 
}

function pushClass(el, targetClass) {
  // equivalent to addClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass) {
  // equivalent to removeClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function modifyClass(el, targetClass) {
  // equivalent to toggleClass
  if (el && typeof el == 'object' && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

function containsClass(el, targetClass) {
  if (el && typeof el == 'object' && targetClass) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

function createEl(element = 'div') {
  return document.createElement(element);
}

function createModal() {
  modal = createEl();
  modal.className = modalClass;
  return modal
}


function appendModal(parent, scroll = false) {
  // append modal only once
  // parent node
  let node = parent.parentNode;
  let children = node.children;
  let hasModal = containsClass(children[children.length - 1], modalClass);
  
  if (!hasModal) {
    parent = parent.parentNode;
    pushClass(parent, 'minimal');
    node.appendChild(modal);
    window.scrollTo(0, 0);
  } 
}
