function removeAttributes(el) {

  // get its attributes and cast to array, then loop through
  Array.prototype.slice.call(el.attributes).forEach(function(attr) {

      // remove each attribute
      el.removeAttribute(attr.name);
  });
}

function synchronizeCssStyles(src, destination, recursively) {

// if recursively = true, then we assume the src dom structure and destination dom structure are identical (ie: cloneNode was used)

// window.getComputedStyle vs document.defaultView.getComputedStyle 
// @TBD: also check for compatibility on IE/Edge 
destination.style.cssText = document.defaultView.getComputedStyle(src, "").cssText;

if (recursively) {
    var vSrcElements = src.getElementsByTagName("*");
    var vDstElements = destination.getElementsByTagName("*");

    for (var i = vSrcElements.length; i--;) {
        var vSrcElement = vSrcElements[i];
        var vDstElement = vDstElements[i];
//          console.log(i + " >> " + vSrcElement + " :: " + vDstElement);
        vDstElement.style.cssText = document.defaultView.getComputedStyle(vSrcElement, "").cssText;
    }
}
}


const formatTextElements = (originalTextElement, clonedtextElement) => {

  originalTextElement.style.top = '15px';
  originalTextElement.style.width = window.getComputedStyle(clonedtextElement).width;


  clonedtextElement.style.fontFamily = 'Calibri, Arial, Helvetica, sans-serif';
  clonedtextElement.style.fontSize = '12pt';

  originalTextElement.style.fontFamily = 'Calibri, Arial, Helvetica, sans-serif';
  originalTextElement.style.fontSize = '12pt';

}
export default formatTextElements;