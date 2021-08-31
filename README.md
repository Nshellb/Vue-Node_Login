Vue - Express(node) 연동
https://mrw0119.tistory.com/136

1. 프로젝트 생성
1-1. Vue 프로젝트 생성
1) vue-cli 전역 설치.
npm i vue-cli -g 안됨. 아래 명령으로...
npm i -g @vue/cli-init

2) webpack 으로 vue 프로젝트 생성
vue init webpack frontend
각 항목은 필요에따라 수정. enter 로 진행. space bar로 선택.
vue-router는 필수 yes.

3) frontend 폴더로 이동
cd frontend

4) Vue 프로젝트 실행
npm run dev

5) Vue 페이지 접속
localhost:8080 크롬 접속

6) Vue 실행 중지
Ctrl + C


1-2. express (Node) 프로젝트 생성
1) 기존 프로젝트에서 express-generator 를 전역설치한다.
(cd ..)
npm i express-generator -g

2) express 프로젝트 생성
express backend --view=pug

3) backend 폴더로 이동
cd backend

4) 모듈을 설치
npm install

5) express 서버 실행
npm start

6) express 서버 페이지 접속
localhost:3000 크롬 접속

5) express 실행 중지
Ctrl + C


1-3. Vue - Express 연동
1) VSCode 에서 frontend 폴더를 연다.

2) config/index.js 파일을 열고 build의 폴더경로를 backend/public 으로 수정한다.
build: {
    // Template for index.html
    index: path.resolve(__dirname, '../../backend/public/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../../backend/public'),
빌드 결과물을 출력하는 경로를 수정하는 구문이다.

3) 터미널을 통해 프로젝트를 빌드한다. (Ctrl + `)
npm run build

4) build가 완료되면 VSCode 에서 backend 폴더를 연다.

5) backend/public 폴더를 보면 vue 에서 빌드된 index.html과 
static 폴더안에 css, js 파일들이 추가된것을 확인할 수 있다.

6) backend/router/index.js 파일을 열고 res.render() 는 주석처리하고 
res.sendfile() 을 추가한다.

var path = require('path'); 추가

res.sendfile(path.join(__dirname, '../public/index.html')); router.get ~ 에 추가

// res.render('index', { title: 'Express' }); 주석

기존의 express 화면이 아닌 출력되는 (client에게 보내주는) 파일을 
build 한 vue 프로젝트로 바꿔주는 과정이다.

7) 터미널을 열고 서버를 실행한다.
npm start

-> 최종적으로는 frontend 프로젝트를 빌드해서 실행가능한 상태로 만들고
backend 에서 express 로 배포한다.






2. API 데이터 호출 테스트
2-1. frontend 작업
1) frontend 프로젝트를 열고 config/index.js 파일을 열고 proxyTable 을 설정한다.
module.exports = {
  dev: {
      
      ~

    proxyTable: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
      }
    },

http 통신을 간편히 하기위한 작업. 
frontend 에서 /api 주소로 요청 발생시 'http://localhost:3000/api' 로 요청을 보낸다.
이 설정이 없다면 http 요청시마다 'http://localhost:3000/api' 주소를 일일이 넣어야 한다.

2) http 통신을 위한 axios 모듈을 설치한다.
npm i axios

3) axios 를 전역에서 사용할 수 있도록 src/main.js 파일을 열고 코드를 추가한다.
import axios from 'axios'
Vue.proxytype.$http = axios // vue 컴포넌트에서 this.$http로 요청할 수 있게한다.

4) componets/IndexPage.vue 파일을 만들고 코드를 작성한다.
<template>
    <div v-if="user">
        <h1>접속한 유저</h1>
        <p>아이디 : {{ user.id }} </p>
        <p>비밀번호 : {{ user.password }} </p>
        <p>이름 : {{ user.name }} </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
        };
    },
    created() {
        this.$http.get('/api/login')
            .then((res) => {
                const user = res.data.user;
                if (user) this.user = user;
            })
            .catch((err) => {
                console.error(err);
            });
    }}
</script>

<style></style>

현재 접속중인 계정의 id 와 pw, 이름을 확인하는 페이지이다.

Q. 받아오는 데이터가 key: value 3쌍인데 null 로 초기화하네...? ([] 아닌가...?)

5) router/index.js 파일을 열고 라우터를 설정한다.

import IndexPage from '@/components/IndexPage.vue'

~

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    }
  ]
})

접속 경로에 따른 출력(client에게 보내주는) 페이지를 설정한다.
vue-router 가 설치 되어있어야한다.

6) 터미널에서 빌드하여 frontend 작업을 완료한다.
npm run build

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
[ Vue Error ] Eslint 배포 오류 : Use //eslint-disable-next-line to ignore the next line.
config\index.js 에서 아래 코드로 수정.
useEslint: false,
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*


2-2. backend 작업
1) backend 프로젝트에 data 폴더와 users.json 파일을 만들고 테스트용 유저 데이터를 입력한다.
[
    {
        "id": "james",
        "password": "1234",
        "name": "제임스"
    },
    {
        "id": "donald",
        "password": "0000",
        "name": "도널드"
    },
    {
        "id": "john",
        "password": "9999",
        "name": "요한"
    }
]

key: vlaue 쌍의 데이터들이다.

2) routes 폴더에 login.js 파일을 만들고 코드를 작성한다.
const express = require('express');
const router = express.Router();

const users = require('../data/users.json');

router.get('/', function(req, res, next) {
    res.json({ user: users[0] });
});

module.exports = router;

3) app.js 파일에 login 라우터를 추가한다.
// var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

~

// app.use('/users', usersRouter);
app.use('/api/login', loginRouter);

4) 터미널에서 서버를 실행한다.
npm start

5) localhost:3000 에 접속하면 frontend 와 backend 가 작동하는것을 확인할 수 있다.


2-3. frontend 테스트
1) frontend 작업중에는 frontend 를 npm run dev 로 실행
(frontend 코드 수정시 수정된 내용이 자동으로 적용된다.)

2) localhost:8080 으로 접속하여 테스트

3) backend 작업중에는 frontend 를 npm start 로 실행
(디버그 모드 F5 로도 가능하다.)

4) localhost:3000 으로 접속하여 프로젝트를 최종확인