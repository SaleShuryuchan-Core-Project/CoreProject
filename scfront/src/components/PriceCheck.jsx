import React, { useEffect, useState } from 'react';
import Papa from 'papaparse'; // CSV파일을 자바스크립트에서 쉽게 읽기할 수 있게 해주는 라이브러리
import '../css/pricecheck.css'
import Gemini from './Gemini';
import Reset from '../img/reset.png';
import Toparrow from '../img/toparrow.png';
import Samsung from '../img/samsung.png';
import Apple from '../img/apple.png';
import Lg from '../img/lg.png';

const PriceCheck = ({ onComplete }) => {
  const [selectedManufacturer, setSelectedManufacturer] = useState(null); // 사용자가 선택한 제조사를 저장하는 상태
  const [selectedSeries, setSelectedSeries] = useState(null); // 사용자가 선택한 시리즈를 저장하는 상태
  const [selectedModel, setSelectedModel] = useState(null); // 사용자가 선택한 모델을 저장하는 상태
  const [selectedVoume, setSelectedVoume] = useState(null);

  const [seriesList, setSeriesList] = useState([]); // 선택한 제조사에 해당하는 시리즈 목록 배열 저장
  const [modelList, setModelList] = useState([]); // 선택한 모델에 해당하는 시리즈 목록 배열 저장
  const [voumeList, setVoumeList] = useState([]); // 선택한 용량에 해당하는 시리즈 목록 배열 저장
  const [rawData, setRawData] = useState([]); // CSV파일에서 파싱된 전체 데이터를 저장하는 배열

  const [showGemini, setShowGemini] = useState(false); //  Gemini 컴포넌트 출력 여부
  const [finalPhoneName, setFinalPhoneName] = useState(''); //  Gemini로 보낼 핸드폰 이름

  // 선택한 항목들을 조합해서 모델명 완성
  const getPhoneName = () => {
    return `${selectedManufacturer} ${selectedModel} ${selectedVoume}`;
  };

  // '평균 중고가 확인' 버튼 클릭 시 실행
  const handleConfirm = () => {
    const phoneName = getPhoneName();
    setFinalPhoneName(phoneName); // Gemini.jsx로 전달
    setShowGemini(true); // 결과 보이게
    
    if (typeof onComplete === "function") {
      onComplete(phoneName);       // props가 함수일 경우에만 실행
    }
  };

  // 현재 어떤 단계를 보여줄지 관리하는 상태
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (step) => {
    setCurrentStep(step);
    if (step === 1) {
      setSelectedSeries(null);
      setSelectedModel(null);
      setSelectedVoume(null);
    } else if (step === 2) {
      setSelectedModel(null);

      setSelectedVoume(null);
    } else if (step === 3) {
      setSelectedVoume(null);
    } else if (step === 4) {
      setSelectedVoume(null);
    }
  };

  useEffect(() => {
    Papa.parse('/data/phone.csv', {
      download: true,
      header: true, // CSV의 첫 번째 줄 컬럼 이름으로 인식하고, 각 행을 객체로 변환
      complete: function (results) { // 파싱이 완료되면 실행되는 콜백함수
        setRawData(results.data);
      },
    });
  }, []);

  // 제조사 선택 시 시리즈 리스트 필터링
  useEffect(() => {
    if (selectedManufacturer && rawData.length > 0) {
      const filteredSeries = rawData
        .filter((item) => item.제조사 === selectedManufacturer) // csv파일에서 선택한 제조사와 일치하는 항목들만 필터링
        .map((item) => item.시리즈) // 필터링된 항목들의 시리즈값만 추출하여 배열생성
        .filter((v, i, a) => a.indexOf(v) === i); // 정리해야함
      setSeriesList(filteredSeries);
      setSelectedSeries(null); // 제조사 바뀌면 시리즈 초기화
      setModelList([]); // 제조사 바뀌면 모델 초기화
    }
  }, [selectedManufacturer, rawData]);

  // 시리즈 선택 시 모델 리스트 필터링
  useEffect(() => {
    if (selectedManufacturer && selectedSeries && rawData.length > 0) {
      const filteredModels = rawData
        .filter(
          (item) =>
            item.제조사 === selectedManufacturer &&
            item.시리즈 === selectedSeries
        )
        .map((item) => item.모델)
        .filter((v, i, a) => a.indexOf(v) === i);
      setModelList(filteredModels);
    }
  }, [selectedSeries, selectedManufacturer, rawData]);

  // 모델 선택 시 용량 리스트 필터링
  useEffect(() => {
    if (selectedManufacturer && selectedSeries && selectedModel&& rawData.length > 0) {
      const filteredVoumes = rawData
        .filter(
          (item) =>
            item.제조사 === selectedManufacturer &&
            item.시리즈 === selectedSeries &&
            item.모델 === selectedModel
        )
        .map((item) => item.용량)
        .filter((v, i, a) => a.indexOf(v) === i);
      setVoumeList(filteredVoumes);
    }
  }, [selectedModel, selectedManufacturer, selectedSeries, rawData]);

  // 핸들러 함수
  const handleManufacturerClick = (name) => {
    setSelectedManufacturer(name);
    setCurrentStep(2); // 제조사를 고르면 2단계(시리즈)로 넘어감
  };

  const handleSeriesClick = (series) => {
    setSelectedSeries(series);
    setCurrentStep(3); // 시리즈를 고르면 3단계(모델)로 넘어감
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);
    setCurrentStep(4); // 모델을 고르면 4단계(용량)로 넘어감
  };

  const handleVoumeClick = (voume) => {
    setSelectedVoume(voume);
  };

  const handleReset = () => {
    setSelectedManufacturer(null);
    setSelectedSeries(null);
    setSelectedModel(null);
    setSelectedVoume(null);
    setSeriesList([]);
    setModelList([]);
    setVoumeList([]);
    setCurrentStep(1); // 처음 단계로 리셋
  };

  return (
    <div className='priceCheckRoot'>
       {showGemini ? (
        <div className="geminiResultWrapper">
          <Gemini phoneName={finalPhoneName} />
        </div>
      ) : (
      <section className='priceCheckSection'>
        <header className='priceCheckHeader'>
          <h1 className='priceCheckTitle'>
            시세조회 할
            <br />
            휴대폰 정보를 선택해 주세요
          </h1>
        </header>

        <div className='priceCheckListWrapper'>
          {/* 초기화 버튼 */}
          <div className='priceCheckReset'>
            <button className='btm2' onClick={handleReset}>
              선택사항 초기화
              <img src={Reset} alt='reset' width='24px' />
            </button>
          </div>

          {/* 제조사 선택 */}
          <div className='priceCheckStep' onClick={() => handleStepClick(1)}>
            <div className='priceCheckStepList'>
              <div className='priceCheckTimeLine'>
                <div className='priceCheckTimeLineContent'>
                  <span className='priceCheckTimeLineIcon'>1</span>
                  <h4 className='priceCheckTimeLineTitle'>제조사</h4>
                  {selectedManufacturer && (  // 조건부 렌더링 : 제조사를 클릭했을때 h4태그 옆에 선택한 제조사 표시
                    <p className='priceCheckTimeLineText'>
                      {selectedManufacturer}
                    </p>
                  )}
                </div>
                <img src={Toparrow} alt='toparrow' width='24px' />
              </div>

              {/* currentStep이 1인 경우에만 제조사 리스트 표시 */}
              {currentStep === 1 && (
                <ul className='priceCheckList'>
                  <li
                    className='priceCheckListItem imgBox'
                    onClick={(e) => { e.stopPropagation(); handleManufacturerClick('삼성전자'); }} 
                  >
                    <div className='priceCheckListItemDataWrapper'>
                      <img
                        src={Samsung}
                        className='priceCheckCompany'
                        alt='삼성전자'
                      />
                      <p className='priceCheckListItemDataName'>삼성전자</p>
                    </div>
                  </li>
                  <li
                    className='priceCheckListItem imgBox'
                    onClick={(e) => { e.stopPropagation(); handleManufacturerClick('애플'); }}
                  >
                    <div className='priceCheckListItemDataWrapper'>
                      <img
                        src={Apple}
                        className='priceCheckCompany'
                        alt='애플'
                      />
                      <p className='priceCheckListItemDataName'>애플</p>
                    </div>
                  </li>
                  <li
                    className='priceCheckListItem imgBox'
                    onClick={(e) => { e.stopPropagation(); handleManufacturerClick('LG전자'); }}
                  >
                    <div className='priceCheckListItemDataWrapper'>
                      <img
                        src={Lg}
                        className='priceCheckCompany'
                        alt='LG전자'
                      />
                      <p className='priceCheckListItemDataName'>LG전자</p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* 시리즈 선택 */}
          {currentStep >= 2 && selectedManufacturer && (
            <div className='priceCheckStep' onClick={() => handleStepClick(2)}>
              <div className='priceCheckStepList'>
                <div className='priceCheckTimeLine'>
                  <div className='priceCheckTimeLineContent'>
                    <span className='priceCheckTimeLineIcon'>2</span>
                    <h4 className='priceCheckTimeLineTitle'>시리즈</h4>
                    {selectedSeries && ( // 시리즈를 클릭했을때 h4태그 옆에 선택한 시리즈 표시
                      <p className='priceCheckTimeLineText'>
                        {selectedSeries}
                      </p>
                    )}
                  </div>
                  <img src={Toparrow} alt='toparrow' width='24px' />
                </div>
                {/* currentStep이 2인 경우에만 시리즈 리스트 표시 */}
                {currentStep === 2 && (
                  <ul className='priceCheckList'>
                    {seriesList.map((series, index) => (
                      <li
                        key={index}
                        className='priceCheckListItem itemBox'
                        onClick={(e) => { e.stopPropagation(); handleSeriesClick(series); }}
                      >
                        {series}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 모델 선택 */}
          {currentStep >= 3 && selectedSeries && modelList.length > 0 && (
            <div className='priceCheckStep' onClick={() => handleStepClick(3)}>
              <div className='priceCheckStepList'>
                <div className='priceCheckTimeLine'>
                  <div className='priceCheckTimeLineContent'>
                    <span className='priceCheckTimeLineIcon'>3</span>
                    <h4 className='priceCheckTimeLineTitle'>모델</h4>
                    {selectedModel && ( // 모델을 클릭했을때 h4태그 옆에 선택한 모델 표시
                      <p className='priceCheckTimeLineText'>
                        {selectedModel}
                      </p>
                    )}
                  </div>
                  <img src={Toparrow} alt='toparrow' width='24px' />
                </div>
                {/* currentStep이 3인 경우에만 모델 리스트 표시 */}
                {currentStep === 3 && (
                  <ul className='priceCheckList'>
                    {modelList.map((model, index) => (
                      <li
                        key={index}
                        className='priceCheckListItem itemBox'
                        onClick={(e) => { e.stopPropagation(); handleModelClick(model); }}
                      >
                        {model}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 용량 선택 */}
          {currentStep >= 4 && selectedModel && voumeList.length > 0 && (
            <div className='priceCheckStep' onClick={() => handleStepClick(4)}>
              <div className='priceCheckStepList'>
                <div className='priceCheckTimeLine'>
                  <div className='priceCheckTimeLineContent'>
                    <span className='priceCheckTimeLineIcon'>4</span>
                    <h4 className='priceCheckTimeLineTitle'>용량</h4>
                    {selectedVoume && ( // 용량을 클릭했을때 h4태그 옆에 선택한 용량 표시
                      <p className='priceCheckTimeLineText'>
                        {selectedVoume}
                      </p>
                    )}
                  </div>
                  <img src={Toparrow} alt='toparrow' width='24px' />
                </div>
                
                {/* !selectedVoume를 조건에 추가하여, 이미 용량을 선택했다면 리스트가 사라지도록 함 */}
                {currentStep === 4 && !selectedVoume && (
                  <ul className='priceCheckList'>
                    {voumeList.map((voume, index) => (
                      <li
                        key={index}
                        className='priceCheckListItem itemBox'
                        onClick={(e) => { e.stopPropagation(); handleVoumeClick(voume); }}
                      >
                        {voume}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 시세조회 버튼 */}
          {selectedVoume && rawData.length > 0 && !showGemini &&  (
            <div className='priceCheckButton' >
             <button className='checkButton' onClick={handleConfirm}>
                  평균 시세 조회
             </button>
            </div>
          )}
        </div>
      </section>
    )}
  </div>
  );
};

export default PriceCheck;