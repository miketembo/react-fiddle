window.addEventListener('message', (e)=> {
  console.log('message', e);

  if (typeof e.data == 'number') return;
  if (e.data.indexOf('webpackHotUpdate') != -1) {
    // console && console.clear();
    // location.reload();
  }
});
