<!doctype html>
<html lang="{{str_replace('_', '-', app()->getLocale())}}">
    <head>
        <meta charset="utf-8"/>
        <link rel="icon" href="/favicon.jpg"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="theme-color" content="#3f51b5"/>
        <meta name="description" content="{{__('صمت بوک - شبکه اجتماعی کسب و کار')}}"/>
        <link rel="apple-touch-icon" href="logo192.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <title>{{ config('app.name', 'Samtbook') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        <a
                href="#"
                onclick="ECSWAuthorize.call(this,event)"
        >
            ورود از طریق امتا
        </a>
        <p id="msg"></p>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script>
          window.onload = function () {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const ECSWCode = urlParams.get('code');
            if (ECSWCode) {
              getUserInfo(ECSWCode);
            }
          }

          function ECSWAuthorize(e) {
            e.preventDefault();
            let token = '{{\Illuminate\Support\Str::random(40)}}';
            let params = {
              response_type: 'code',
              client_id: '8a6d176e-0ac0-42c0-afc3-8f583b029f60',
              redirect_uri: 'https://samtbook.ir/oauth',
              scope: 'user:status user:identity:general user:primaryMobileNumber user:primaryEmail',
              state: token,
            }
            let url = `https://ecsw.ir/oauth/authorize`;
            for (let i in params) {
              if (params.hasOwnProperty(i)) {
                url = url + `${i === 'response_type' ? '?' : '&'}${i}=${params[i]}`;
              }
            }
            window.location.href = url;
          }

          function getUserInfo(code) {
            document.getElementById('msg').innerText = 'لطفا صبر کنید';
            const url = '{{url('api/login/getUserInfo')}}';
            const data = {code}
            axios.post(url, data).then(e => {
              let name = e.data.identityData.name;
              let family = e.data.identityData.family;
              let mobile = e.data.mobileData.primaryMobileNumber.mobileNumber;
              document.getElementById('msg').innerText = `${name} ${family} - ${mobile}`;
            }).catch(e => {
              document.getElementById('msg').innerText = 'خطا';
              console.log(e);
            })
          }
        </script>
    </body>
</html>