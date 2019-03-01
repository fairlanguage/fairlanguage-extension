const messenger = (elementClickedOn) => {

  const con = document.getElementsByClassName('_4rv4')[0];

  const container = document.createElement('li');
  container.style.width = '35px';
  container.style.height = '32px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  con.prepend(container);

  const textElement = document.querySelectorAll('[aria-label="Type a message..."]')[0];
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default messenger;