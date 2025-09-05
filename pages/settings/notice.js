import React, { useState } from 'react';
import Head from 'next/head';
import IonIcon from '@reacticons/ionicons';

const NoticeData = [
  {
    question: '25년 9월 업데이트 내역',
    date: '2025.09.05',
    answer: `
      - 플레이어 화면에서 이전/다음 스테이션으로 이동 가능<br/>
      - Android Auto 지원
       `,
  },
  {
    question: '25년 8월 업데이트 내역',
    date: '2025.08.20',
    answer: `
        <h3 style="margin-bottom: 10px;">신규 스테이션 추가</h3>
        <b>- 수도권</b><br/>
        · CBS JOY4U<br/>
        · BBS 서울불교방송<br/><br/>
        <b>- 부산·울산·경남</b><br/>
        · KNN 러브FM<br/>
        · KNN 파워FM<br/>
        · UBC 그린FM<br/><br/>
        <b>- 광주·전남</b><br/>
        · 광주CBS 음악FM<br/>
        · 광주국악방송<br/><br/>
        <b>- 전북</b><br/>
        · JTV 매직FM<br/><br/>
        <b>- 대전·세종·충남</b><br/>
        · 대전국악방송<br/><br/>
        <b>- 충북</b><br/>
        · CJB 조이FM<br/><br/>
        <b>- 강원</b><br/>
        · G1 프레쉬FM<br/>
        · 강원영동CBS 표준FM<br/><br/>
         <b>- 제주</b><br/>
        · JIBS 뉴파워FM<br/><br/>
        - 이외 재생되지 않던 일부 스테이션 수정
       `,
  },
  {
    question: '24년 9월 업데이트 내역',
    date: '2024.9.30',
    answer: `
        <h3>24.9.30</h3><br/>
        - 이제 설정에서 앱 시작 페이지를 '스테이션', '자주 듣는' 중 선택할 수 있어요.<br/>
       `,
  },
  {
    question: '일부 스테이션 재생 오류 안내',
    date: '2024.9.30',
    answer: `
    안녕하세요. 개발자입니다.<br/>
    지금까지 앱스토어 리뷰나 메일을 통해 특정 스테이션이 재생되지 않는다는 문의가 접수되어 왔습니다.<br/>
    이 중 대부분의 케이스가 라디오 방송국 측에서 허용되지 않는 외부 링크에서의 스트리밍 요청을 차단하고 있어 발생하는 문제임을 확인하였습니다.<br/>
    방송국 측의 이러한 조치를 우회하여 스트리밍 서비스를 제공하는 것은 적절하지 않다고 판단하여 이러한 스테이션은 서비스 내 스테이션 목록에서 제외하고 있습니다.<br/>
    만약 재생되지 않는 스테이션이 있는 경우 메일이나 앱스토어 리뷰 등으로 제보하여 주시면 빠르게 확인하여 조치하겠습니다.<br/>
    이용에 불편을 드려 죄송하다는 말씀 전하며, 앞으로 더 나은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다.
       `,
  },
  {
    question: '24년 1월 업데이트 내역',
    date: '2024.1.2',
    answer: `
        <h3>24.1.2</h3><br/>
        - 테마를 변경할 수 있도록 옵션을 추가했어요.<br/>
        - 글자 크기 조절 옵션을 추가했어요.<br/>
        - 안드로이드 앱에서 라디오 재생 중 외부 링크가 클릭되지 않는 이슈를 수정했어요.<br/>
        <br/>`,
  },
  {
    question: '23년 12월 업데이트 내역',
    date: '2023.12.30',
    answer: `
        <h3>23.12.30</h3><br/>
        - <span style="opacity: 0.7">(웹/웨일 확장앱)</span> 일시정지 후 다시 재생했을 때, 일시정지 시점이 아닌 실시간 스트리밍 위치로 이동하도록 개선했어요.<br/>
        - 스테이션 별로 현재 청취중인 사용자 수를 실시간으로 표시해줄게요.<br/>
        - <span style="opacity: 0.7">(웨일 확장앱)</span> 터치가 불가능한 환경에서 스테이션 지역 목록을 좌우로 탐색할 수 있도록 버튼을 추가했어요.<br/>
        <br/>
        <b>스테이션 변경 사항</b>
        <br/>
        - MBC강원영동 표준FM, MBC강원영동 FM4U 재생 오류 수정<br/>
        - G1 프레쉬FM 삭제(보안 정책 이슈)
        <br/><br/>
        <h3>23.12.26</h3><br/>
        - PC/태블릿에 맞게 반응형 레이아웃을 적용했어요.<br/><br/>
        `,
  },
  {
    question: '서비스 오픈 안내',
    date: '2023.12.11',
    answer: `안녕하세요 :)<br/>
        세상의 모든 라디오를 하나로 모은 라디오 앱을 <b>웹, 안드로이드, 네이버 웨일 확장앱</b> 버전으로 출시하였습니다.<br/><br/>
        <a href='https://store.whale.naver.com/detail/mebmjdmdebnhodookpfemachpamkjlkl' target="_blank" style="text-decoration:underline">웨일 확장앱 설치하기</a><br/>
        <a href='https://play.google.com/store/apps/details?id=com.icecream.simplemediaplayer' target="_blank" style="text-decoration:underline">안드로이드 앱 설치하기</a>
        <br/><br/>
        사용 중 불편한 점이나 문의 사항이 있으시면 언제든 <a href='mailto:hey@yuntae.in?subject=[라디오 앱 문의]' style="text-decoration:underline">문의</a>해주시기 바랍니다.<br/>
        앞으로 더 나은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다.
        `,
  }
];

const Settings = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(index);
  };

  return (
    <>
      <Head>
        <title>공지사항</title>
      </Head>
      <main className="settings">
        <header style={{ display: 'flex', alignItems: 'center', paddingLeft: '30px', paddingBottom: "20px" }}>
          <span onClick={() => window.history.back()} style={{ fontSize: '1.5rem' }}>
            <IonIcon name="arrow-back-outline" style={{ position: 'relative', top: '4px' }} />
          </span>
          <h2 style={{ width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '13px' }}>공지사항</h2>
        </header>

        <section style={{ marginTop: '60px', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: openIndex != null ? '0px' : '0' }}>
          {NoticeData.map((item, index) => (
            <div key={index} className="faq-item">
              <div className="question" onClick={() => handleToggle(index)}>
                {item.question}
                <div style={{ fontSize: '14px', color: '#999999', fontWeight: 'normal', marginTop: '5px' }}>{item.date}</div>
              </div>
              {openIndex === index && <div className="answer" dangerouslySetInnerHTML={{ __html: item.answer }}></div>}
            </div>
          ))}
          <br /><br /><br /><br /><br /><br /><br />
        </section>
      </main>

      <style jsx>{`
          main {
            display: flex;
            height: 100vh;
            flex-direction: column;
            gap: 15px;
            padding: 20px;
          }
  
          .faq-item {
            border-radius: 15px;
            overflow: hidden;
          }
  
          .question {
            padding: 15px;
            background-color: var(--nav-background-color);
            cursor: pointer;
            border-radius: 15px;
            transition: all 0.2s ease-in-out;
          }
  
          .answer {
            padding: 15px;
            background-color: var(--background-color);
            overflow: hidden;
            transition: all 0.2s ease-in-out;
          }

          .question:active {
            transform: scale(0.98);
          }
        `}</style>
    </>
  );
};

export default Settings;
