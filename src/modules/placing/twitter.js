const twitter = (elementClickedOn) => {

  const container = document.createElement('div');

  container.style.marginLeft = '12px';
  container.style.marginRight = '8px';
  container.style.width = '46px';
  container.style.height = '38px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  let textElement;
  let con;

  if(elementClickedOn.parentNode === document.getElementById('tweet-box-global')){
    con = document.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[1].parentNode;
    con.insertBefore(container, con.childNodes[1]);
    textElement = elementClickedOn.parentNode;
  }else{
    con = document.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0].parentNode;
    con.insertBefore(container, con.childNodes[1]);
    textElement = document.getElementById('tweet-box-home-timeline');  
  }

  textElement.setAttribute('data-placeholder-default', '');
  textElement.setAttribute('data-placeholder-reply', '');

  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default twitter;