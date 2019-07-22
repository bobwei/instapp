export default `
(function addListeners() {
  if (!document.querySelectorAll('input').length) {
    setTimeout(addListeners, 300);
    return;
  }

  const $form = document.querySelectorAll('form')[0];
  $form.outerHTML = $form.outerHTML.replace('form', 'fform');

  const $elements = document.querySelectorAll('input');
  const [$username, $password] = $elements;

  $username.previousSibling.remove();
  $password.previousSibling.remove()

  $username.addEventListener('input', () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'setData',
      data: {
        username: $username.value,
      },
    }));
  });

  $password.addEventListener('input', () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'setData',
      data: {
        password: $password.value,
      },
    }));
  });

  const $submit = document.querySelectorAll('button')[1];
  $submit.removeAttribute('disabled');
  $submit.addEventListener('click', () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'submit',
    }));
  });
})()
`;
