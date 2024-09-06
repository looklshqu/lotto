import React, {Component, useState, useRef, useEffect, useMemo, useCallback} from "react";
import Ball from "./Ball";

function getWinNumbers() {
    console.log("getWinNumbers");
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while(candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
    return [...winNumbers, bonusNumber];
}

const Lotto = () => {
    const lottoNumbers = useMemo(() => getWinNumbers(), []); // 리턴값을 기억
    const [winNumbers, setwinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    // useEffect(() => {
    //     // ajax
    // }, []);

    // const mounted = useRef(false);
    // useEffect(() => {
    //     if(!mounted.current) {
    //         mounted.current = true;
    //     } else {
    //         // ajax
    //     }
    // }, [바뀌는 값]); // componentDidUpdate만 

    useEffect(() => {
        for (let i = 0; i < winNumbers.length - 1; i++) {
            timeouts.current[i] = setTimeout(() => {
                setWinBalls((prevWinBalls) => {
                    return [...prevWinBalls, winNumbers[i]]
                });
            }, (i + 1) * 1000);
        }
        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);
        return () => {
            timeouts.current.forEach((v) => {
                clearTimeout(v);
            })
        };
    }, [timeouts.current]);

    const onClickRedo = useCallback(() => { // 함수 자체를 기억, 자식 컴포넌트에 함수를 전달할 때 무조건 써야 함
        setwinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];
    }, [winNumbers]);

    return (
        <>
            <div>당첨 숫자</div>
            <div id="결과창">
                {winBalls.map((v) => {
                    return <Ball key={v} number={v} />;
                })}
            </div>
            <div>보너스</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={onClickRedo}>한 번 더!</button>}
        </>
    );
};
// class Lotto extends Component {
//     state = {
//         winNumbers: getWinNumbers(), // 당첨 숫자
//         winBalls: [],
//         bonus: null, // 보너스 공
//         redo: false,
//     };

//     timeouts = [];

//     runTimeouts = () => {
//         const {winNumbers} = this.state;
//         for (let i = 0; i < winNumbers.length - 1; i++) {
//             this.timeouts[i] = setTimeout(() => {
//                 this.setState((prevState) => {
//                     return {
//                         winBalls: [...prevState.winBalls, winNumbers[i]],
//                     };
//                 });
//             }, (i + 1) * 1000);
//         }
//         this.timeouts[6] = setTimeout(() => {
//             this.setState({
//                 bonus: winNumbers[6],
//                 redo: true,
//             });
//         }, 7000);
//     };

//     componentDidMount() {
//         this.runTimeouts();
//     }

//     componentDidUpdate(prevProps, prevState) {
//         if (this.state.winBalls.length === 0) {
//             this.runTimeouts();
//         }
//     }

//     componentWillUnmount() {
//         this.timeouts.forEach((v) => {
//             clearTimeout(v);
//         })
//     }

//     onClickRedo = () => {
//         this.setState({
//             winNumbers: getWinNumbers(), // 당첨 숫자
//             winBalls: [],
//             bonus: null, // 보너스 공
//             redo: false,
//         });
//         this.timeouts = [];
//     };

//     render() {
//         const { winBalls, bonus, redo } = this.state;
//         return (
//             <>
//                 <div>당첨 숫자</div>
//                 <div id="결과창">
//                     {winBalls.map((v) => {
//                         return <Ball key={v} number={v} />;
//                     })}
//                 </div>
//                 <div>보너스</div>
//                 {bonus && <Ball number={bonus} />}
//                 {redo && <button onClick={this.onClickRedo}>한 번 더!</button>}
//             </>
//         );
//     }
// }

export default Lotto;