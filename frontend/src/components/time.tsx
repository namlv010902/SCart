import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
const Countdown = () => {
    const [remainingTime, setRemainingTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    useEffect(() => {
        const targetDate = moment().add(690000000000, 'seconds');
        const interval = setInterval(() => {
            const now = moment();
            const duration = moment.duration(targetDate.diff(now));
            setRemainingTime({
                days: duration.days(),
                hours: duration.hours(),
                minutes: duration.minutes(),
                seconds: duration.seconds()
            });
        },0);
        return () => clearInterval(interval);
    }, []);

    return (
        <Row gutter={10} style={{marginTop:"15px"}}>
            <div id='col_time' style={{ backgroundColor: "#ccc", }}>
                <span style={{ color: "#777777", fontWeight: "500", fontSize: "20px" }} >{remainingTime.days}</span>
                <p>Days</p>
            </div>
            <div id='col_time' style={{ backgroundColor: "#ccc", }}>
                <span style={{ color: "#777777", fontWeight: "500", fontSize: "20px" }} >{remainingTime.hours}</span>
                <p>Hours</p>
            </div>
            <div id='col_time' style={{ backgroundColor: "#ccc", }}>
                <span style={{ color: "#777777", fontWeight: "500", fontSize: "20px" }} >{remainingTime.minutes}</span>
                <p>Minutes</p>
            </div>
            <div id='col_time' style={{ backgroundColor: "#ccc", }}>
                <span style={{ color: "#777777", fontWeight: "500", fontSize: "20px" }} >{remainingTime.seconds}</span>
                <p>Seconds</p>
            </div>
        </Row>
    );
};
export default Countdown