const telegram = (elementClickedOn) => {

  const con = document.getElementsByClassName('im_send_buttons_wrap clearfix')[0];

  const container = document.createElement('div');
  container.style.width = '26px';
  container.style.height = '24px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  container.style.marginTop = '2px'

  con.append(container);

  document.getElementsByClassName('composer_emoji_panel')[0].remove();

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];

}

export default telegram;