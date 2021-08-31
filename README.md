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
