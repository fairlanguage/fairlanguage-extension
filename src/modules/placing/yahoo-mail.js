const yahooMail = (elementClickedOn) => {

  const con = document.getElementsByClassName('z_Z14vXdP D_F ab_C I_52qC W_6D6F p_R B_0')[0];

  const container = document.createElement('div');

  container.style.marginLeft = '8px';
  container.style.marginRight = '5px';

  //container.style.height = '44px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  //con.appendChild(container)

  con.insertBefore(container, con.childNodes[1]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default yahooMail;