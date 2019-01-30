const twitter = (elementClickedOn) => {

  const con = document.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0].parentNode;

  const container = document.createElement('div');

  container.style.marginLeft = '12px';
  container.style.marginRight = '8px';
  //container.style.marginTop = '-4px';

  container.style.width = '46px';
  container.style.height = '38px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  //con.appendChild(container)

  con.insertBefore(container, con.childNodes[1]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default twitter;