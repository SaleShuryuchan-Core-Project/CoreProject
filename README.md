# 📱 세일수류찬 (SaleSuryuchan)
AI 기반 중고폰 시세 분석 및 거래 플랫폼

## 📌 프로젝트 소개
2020년대 중고폰 시장의 급격한 성장과 함께, 소비자들이 쉽고 빠르게 시세를 파악하고 거래할 수 있는 플랫폼의 필요성이 대두되고 있습니다.  
**세일수류찬**은 AI(Gemini 기반)를 활용한 실시간 중고폰 시세 분석과 사용자 맞춤형 매물 요청 기능을 제공하여,  
보다 효율적이고 신뢰도 높은 중고폰 거래를 지원하는 웹 서비스입니다.

## 👨‍👩‍👧‍👦 팀 소개
<table>
  <tr>
    <td align="center">
      <img src="./assets/KimChanYu.png" width="100" alt="김찬유" /><br/>
      <b>김찬유</b><br/>
      PM / Front-End / Back-End
    </td>
    <td align="center">
      <img src="./assets/LeeSeil.png" width="100" alt="이세일" /><br/>
      <b>이세일</b><br/>
      Front-End / Crawling
    </td>
    <td align="center">
      <img src="./assets/LeeChanik.png" width="100" alt="이찬익" /><br/>
      <b>이찬익</b><br/>
      프롬프트 엔지니어링 / Back-End
    </td>
    <td align="center">
      <img src="./assets/LeeChanyoung.png" width="100" alt="이찬영" /><br/>
      <b>이찬영</b><br/>
      Back-End / API 연동 및 전처리
    </td>
  </tr>
</table>

## 🔧 주요 기능
- ✅ **AI 기반 시세 분석** : Gemini API를 통한 스마트폰 모델 실시간 시세 분석 및 시각화
- ✅ **개인 맞춤형 요청 시스템** : 등록되지 않은 매물 요청 가능
- ✅ **사용자 중심의 UI/UX** : 반응형 웹 설계, 필터링, 페이징 기능 지원
- ✅ **SNS 로그인 연동** : 카카오 로그인 API
- ✅ **이미지 업로드** : imgbb API 연동을 통한 이미지 업로드 및 DB 저장
- ✅ **결제 시스템** : 포트원(PortOne) 연동을 통한 간편 결제
- ✅ **게시판** : 후기/요청 게시판, 마이페이지

## 🧪 기술 스택
| 구분 | 기술 |
|------|------|
| Front-End | React.js, JavaScript, CSS |
| Back-End | Spring MVC (eGovFrame), MyBatis |
| AI 분석 | Google Gemini API |
| 이미지 업로드 | imgbb API |
| 주소 검색 | Daum 우편번호 API |
| 결제 | PortOne (Iamport) |
| 데이터베이스 | MySQL |
| 협업 도구 | VSCode, GitHub, Notion |

## 🔄 시스템 아키텍처
- 사용자는 React 기반 웹에서 요청
- Spring MVC 백엔드에서 Gemini API 및 DB 연동
- 이미지/결제/주소검색은 외부 API 통해 처리
![시스템 아키텍처](./assets/시스템아키텍쳐.png)

## 🧩 주요 페이지
- 📱 시세 조회
- 📝 요청 게시판
- 📦 장바구니 및 결제
- 🧾 마이페이지
- 🔐 로그인/회원가입

## 🧠 Trouble Shooting
- ✅ AI 분석 결과 마크다운 렌더링 문제 → HTML 파싱 함수 직접 구현
- ✅ GZIP 한글 인코딩 깨짐 → InputStreamReader + BufferedReader로 조합 해결
- ✅ 이미지 업로드 문제 → 로컬 경로 대신 imgbb URL 사용

## 🌱 향후 발전 방향
- 향후 AI 정확도 향상에 따라 예측 신뢰도 강화
- 사용자 요청 기반 상품 자동 등록 기능 고도화
- 통신사, 요금제, 부가 서비스 정보 연동 예정

## 📚 참고자료
> 발표 자료 및 기획서에서 인용된 통계와 기사 출처는 프로젝트 Wiki에 정리되어 있습니다.

