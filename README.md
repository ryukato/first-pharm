# first-pharm react-native app

## How to setup dev env

Please refer to [React Native Dev Setup](https://ryukato.github.io/blog/react-native%20dev%20setup)
And please install `expo` by following commands.

```shell
npm install -g expo-cli
```

## How to run this project

### Install all required packages

```shell
npm install
```

### Run expo

```shell
npx expo start --clear
```

> Note
>
> If you scan the QR code with your mobile device, then you can run this app on your mobile.

## TODO

### open api data(xml) 처리 방안

- content의 value 형태에 따라 처리를 다르게한다.
  - 배열이 아니고, 객체도 아니면 단순 문자열로 처리
  - 객체이면 아래와 같이 처리한다.
    - tagName 확인 후, 해당 값과 일치하는 태그 생성
      - 예) p -> p tag 생성
    - marginLeft 를 읽어들여서 위에서 생성한 태그의 style로 적용한다.
      - 예) style=“margin-left: [value of marginLeft]px”
    - `#text`를 읽어서 위에서 생성한 태그의 text로 추가
  - 배열이면, 각 요소에 대해 iteration 하면서 “객체에서의 처리” 와 동일하게 각 요소를 처리한다.
- 최종적으로 생성한 태그들은 아래의 라이브러리를 통해 처리한다.
  - [react-native-render-html](https://www.npmjs.com/package/react-native-render-html)

### 페이징처리

- 더보기 버튼을 추가하여 처리한다.
  - 버튼 선택 시, 페이지 번호를 증가 시켜 요청하고 기존 목록 데이터에 추가한다.
- 현재 items만 처리하나, 추가로 body내의 pageNo, totalCount등을 같이 처리해줘야 함
