import IonIcon from '@reacticons/ionicons';
import React, { useState } from 'react';
import toast from '../../lib/toast';

export default function TimerModal({ closeModal }) {
    const [selectedHour, setSelectedHour] = useState(1);
    const [selectedMinute, setSelectedMinute] = useState(0);

    const handleHourChange = (e) => {
        setSelectedHour(parseInt(e.target.value, 10));
    };

    const handleMinuteChange = (e) => {
        setSelectedMinute(parseInt(e.target.value, 10));
    };

    const handleSetTimer = () => {
        const totalMinutes = selectedHour * 60 + selectedMinute;
        const totalMilliseconds = totalMinutes * 60 * 1000;

        Native.setSleepTimer(totalMilliseconds)
        toast(`${selectedHour}시간 ${selectedMinute}분 후에 앱을 종료할게요`, {
            icon: '⏰', duration: 2000,
            position: 'bottom-center',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                width: '100%',
                textAlign: 'left'
            }
        });
    };

    const cancelTimer = () => {
        Native.cancelSleepTimer()
        toast(`종료 타이머가 취소되었어요`, {
            icon: '❌', duration: 2000,
            position: 'bottom-center',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                width: '100%',
                textAlign: 'left'
            }
        });
    }

    return (
        <>
            <div className='timer-modal'>
                <div />
                <h2>종료 타이머

                    <span onClick={closeModal} style={{ float: 'right' }}>
                        <IonIcon name="close-outline" />
                    </span>
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '10px', marginBottom: '10px', marginTop: '10px' }}>
                    <div className="select-container">
                        <select value={selectedHour} onChange={handleHourChange}>
                            {[...Array(12).keys()].map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>
                        <label>&nbsp;&nbsp;시간</label>
                    </div>

                    <div className="select-container">
                        <select value={selectedMinute} onChange={handleMinuteChange}>
                            {[...Array(60).keys()].map((minute) => (
                                <option key={minute} value={minute}>
                                    {minute}
                                </option>
                            ))}
                        </select>
                        <label>&nbsp;&nbsp;분</label>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <button onClick={() => [closeModal(), cancelTimer()]}>타이머 취소</button>
                    <button className='primary' onClick={() => [handleSetTimer(), closeModal()]}>설정</button>
                </div>
            </div>
        </>
    );
}
