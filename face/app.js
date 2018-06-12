const g = {
  page: null,
  view: null,
}

const pages = {
  login: true,
  main: {
    status: true,
    conf: true
  },
  page_not_found: true
};

function routing() {
  const params = window.location.hash.substr(1).split('/');
  g.page = params[0];
  g.view = params[1];
  if (!g.page)
    route('main/status');
  else if (!pages[g.page])
    route('page_not_found');
  else
    render('#page', g.page, {}, () => {
      if (pages[g.page][g.view]) render('#view', g.view, {});
    });
};

function render(selector, template, model, cb) {
  axios.get('./view/' + template + '.html').then(function (res) {
    var html = Mustache.to_html(res.data, model);
    $(selector).html(html);
    if (cb) cb();
  });
}

function route(path) {
  window.location.hash = path;
}

function signIn() {
  var login = $('#input-login').val();
  var password = $('#input-password').val();
  $.api.post('/login', { login: login, password: password })
    .then(function (res) {
      $.cookie('access_token', res.data.access_token);
      initApi();
      route('main/status');
    })
    .catch(function (error) {
      $('#error-msg').show();
    });
}

function signOut() {
  $.cookie('access_token', null);
  route('login');
}

function initApi() {
  $.api = axios.create({
    baseURL: '/api/',
    headers: { 'Authorization': 'Bearer ' + $.cookie('access_token') },
    validateStatus: function (status) {
      if (status == 403 || status == 401) {
        route('login');
      }
      return status >= 200 && status < 300;
    },
  });
};

// main()
(function () {
  window.onhashchange = routing;
  initApi();
  routing();
})();
