function render(selector, template, model) {
  axios.get('./' + template + '.html').then(function(res) {
    var html = Mustache.to_html(res.data, model);
    $(selector).html(html);
  });
}

function route(path) {
  window.location.hash = path;
}

const pages = ['login', 'home', 'page-not-found'];

function routing() {
  var params = window.location.hash.substr(1).split('/');
  var page = params[0];
  if (!page) 
    route('home');
  else if (!pages.includes(page))
    route('page-not-found');
  else
    render('#page', page, {});
};

function signIn() {
  var login = $('#input-login').val();
  var password = $('#input-password').val();
  $.api.post('/login', { login: login, password: password })
      .then(function(res) {
          $.cookie('access_token', res.data.access_token);
          route('home');
      })
      .catch(function(error) {
          $('#error-msg').show();
      });
}

(function () {
  window.onhashchange = routing;

  $.api = axios.create({
    baseURL: '/api/',
    headers: { 'Authorization' : 'Bearer ' + $.cookie('access_token') },
    validateStatus: function (status) {
      if (status == 403 || status == 401) {
        route('login');
      }
      return status >= 200 && status < 300;
    },
  });

  routing();
  
  $.api.get('/auth', function(data) {
    console.log(data);
  })
})();
