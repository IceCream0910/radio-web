import React, { useState } from 'react';
import Head from 'next/head';
import IonIcon from '@reacticons/ionicons';

const FAQData = [
    {
        question: 'Q. 안드로이드 앱과 웹앱의 차이가 무엇인가요?',
        answer: '안드로이드 앱을 이용하면 보다 <b>안정적인 백그라운드 재생과 종료 타이머 기능, 화면 꺼짐 방지 옵션</b> 등을 이용할 수 있습니다.<br/>웹앱은 브라우저에서 동작하는 앱으로 대부분의 기능이 동작하지만 일부 기능은 지원하지 않습니다.<br/>iOS와 같이 안드로이드 앱 설치가 불가능한 환경에서는 웹앱으로 이용해주시기 바랍니다.',
    },
    {
        question: 'Q. 현재 프로그램명과 선곡 정보가 표시되지 않는 스테이션이 있어요.',
        answer: `현재 일부 스테이션에서만 방송 중인 프로그램명과 재생되고 있는 곡 정보를 표시하고 있습니다.<br/><br/>
        KBS : 모든 지역 프로그램명 제공<br/>
        MBC : 수도권 지역 프로그램명 및 선곡 정보 제공<br/>
        SBS : 수도권 지역 프로그램명 제공<br/><br/>
        향후 모든 지역과 스테이션에서 다양한 정보를 제공할 수 있도록 노력하겠습니다.`,
    },
    {
        question: 'Q. 방송이 실제 라디오에 비해 딜레이가 있어요.',
        answer: `라디오 앱은 인터넷을 통해 스트리밍 방식으로 라디오를 재생합니다.<br/>
        따라서 실제 FM/AM 전파 수신 방식과는 달리 약간의 딜레이가 발생할 수 있습니다.<br/>
        만약 라디오 재생을 일시중지 했다가 다시 재생하는 경우 이전 일시중지 시점부터 재생되므로 실시간 방송을 다시 수신하려면 다른 스테이션을 선택했다가 다시 해당 스테이션을 재생해주시기 바랍니다.<br/>
        딜레이 개선 및 일시중지 이후 실시간 방송 시점으로 이동하는 기능은 추후 업데이트를 통해 제공할 예정입니다.`,
    },
    {
        question: 'Q. 선곡 정보가 방송보다 늦게 표시돼요.',
        answer: `수도권 MBC 스테이션에서 제공중인 재생중인 곡 정보는 실제 방송과 지연이 발생할 수 있습니다.<br/>
        이는 MBC 공식 앱에서도 동일하게 발생하는 현상으로, MBC 측에서 정보를 수동으로 업데이트하기 때문에 불가피한 지연입니다.`,
    },
    {
        question: 'Q. 인터넷 연결 없이 사용할 수 있나요?',
        answer: `이 앱은 인터넷을 통해 스트리밍 방식으로 라디오를 재생합니다.<br/>따라서 서비스 이용을 위해서는 네트워크 연결이 필요합니다.`,
    },
    {
        question: 'Q. 종료 타이머는 어떤 기능인가요?',
        answer: `종료 타이머를 이용하면 설정한 시간이 흐른 후에 자동으로 앱이 종료되도록 설정할 수 있습니다.<br/>
        자기 전 라디오를 재생하고 타이머를 설정해 두면, 잠들기 전에 앱을 종료하지 않아도 자동으로 종료되도록 할 수 있습니다.`,
    },
    {
        question: 'Q. 종료 타이머는 어떻게 취소하나요?',
        answer: `플레이어에서 다시 타이머 설정(달 아이콘)을 누르고, <b>'타이머 취소'</b> 버튼을 눌러 현재 설정된 타이머를 취소할 수 있습니다.<br/>
        또는 알림창에 표시된 종료 타이머 알림의 <b>'타이머 취소'</b> 버튼을 눌러도 취소할 수 있습니다.`,
    },
    {
        question: 'Q. 종료 타이머가 예정된 시간보다 몇 초 늦게 작동하는 것 같아요.',
        answer: `종료 타이머 기능은 초 단위를 기준으로 설정 시점부터 타이머를 설정합니다.<br/>
        예시 : 16시 0분 30초에 1분 타이머 설정 → 예정 종료 시각 16시 01분 표시 → 16시 01분 30초에 종료됨
        <br/>
        <br/>알림창에 표시된 예정 시각은 초를 표시하지 않으며, 분 단위로 정시에 종료되는 것이 아니오니 이 점 참고해주시기 바랍니다.`,
    },
];

const Settings = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex(index);
    };

    return (
        <>
            <Head>
                <title>자주하는 질문</title>
            </Head>
            <main className="settings">
                <header style={{ display: 'flex', alignItems: 'center', paddingLeft: '30px', paddingBottom: "20px" }}>
                    <span onClick={() => window.history.back()} style={{ fontSize: '1.5rem' }}>
                        <IonIcon name="arrow-back-outline" style={{ position: 'relative', top: '4px' }} />
                    </span>
                    <h2 style={{ width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '13px' }}>자주하는 질문</h2>
                </header>
                <div style={{ height: '60px' }} />

                <section style={{ marginTop: '60px', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: openIndex != null ? '0px' : '0' }}>
                    {FAQData.map((item, index) => (
                        <div key={index} className="faq-item">
                            <div className="question" onClick={() => handleToggle(index)}>
                                {item.question}
                            </div>
                            {openIndex === index && <div className="answer" dangerouslySetInnerHTML={{ __html: item.answer }}></div>}
                        </div>
                    ))}

                    <br />
                    <a href='mailto:hey@yuntae.in?subject=[라디오 앱 문의] ' style={{ textDecoration: 'underline' }}><div className='station-item'>아직 궁금한 점이 있나요?</div></a>
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
