import React, { useState, useEffect } from "react";

function Player({ handleTickets, playerTickets, randomNums, pricePerWinPerTicket, handleWantToPlay, wantToPlay, handleResetState }) {


    const [name, setName] = useState("");
    const [playerBalance, setPlayerBalance] = useState(() => {
        const storedState = localStorage.getItem('playerBalance');
        return storedState ? JSON.parse(storedState) : 10000;
    });
    const [submittedName, setSubmittedName] = useState(() => {
        const storedState = localStorage.getItem('submittedName');
        return storedState ? JSON.parse(storedState) : "";

    });
    const [playerChoice, setPlayerChoice] = useState([]);
    const [wantPlay, setWantPlay] = useState(true)
    const [prices, setPrices] = useState({})
    const [sortOrder, setSortOrder] = useState('desc');
    const [allWins, setAllWins] = useState(0)

    useEffect(() => {

        if (randomNums.length > 0) {
            localStorage.setItem('playerBalance', JSON.stringify(playerBalance));
        }
    }, [playerBalance, randomNums]);


    useEffect(() => {
        localStorage.setItem('submittedName', JSON.stringify(submittedName));
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedName(name);
        setName("");
    };

    const handleChoice = (x) => {
        if (playerChoice.includes(x)) {

            setPlayerChoice((prevPlayerChoice) => prevPlayerChoice.filter((num) => num !== x));
        } else if (playerChoice.length % 5 !== 0 || playerChoice.length === 0) {

            setPlayerChoice((prevPlayerChoice) => [...prevPlayerChoice, x]);
        }
    };



    const handleWannaPlay = (value) => {

        handleTickets((prevTickets) => [...prevTickets, playerChoice]);
        setPlayerChoice([]);
        handleResetState();

        value === "nem" ? (setWantPlay(false), handleResetState()) : null;


    }

    useEffect(() => {

        if (playerTickets.length !== 0 && playerBalance >= 500) {
            setPlayerBalance(prevPlayerBalance => prevPlayerBalance - 500)
        }



    }, [playerTickets])



    useEffect(() => {
        setWantPlay(true)
        handleWantToPlay(false)
    }, [wantToPlay])






    useEffect(() => {

        const winnersObject = {
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        [...playerTickets].map((ticket) => {

            const matches = ticket.filter((x) => randomNums.includes(x)).length

            if (matches === 2) {
                winnersObject[2]++
            } else if (matches === 3) {
                winnersObject[3]++
            } else if (matches === 4) {

                winnersObject[4]++
            } else if (matches === 5) {
                winnersObject[5]++
            }
        }


        )




        const priceforTwo = winnersObject[2] * pricePerWinPerTicket[2]
        const priceforThree = winnersObject[3] * pricePerWinPerTicket[3]
        const priceforFour = winnersObject[4] * pricePerWinPerTicket[4]
        const priceforFive = winnersObject[5] * pricePerWinPerTicket[5]


        const all = priceforTwo + priceforThree + priceforFour + priceforFive

        setPlayerBalance(prevPlayerBalance => prevPlayerBalance + all)

        setAllWins(all)

        setPrices({
            2: priceforTwo,
            3: priceforThree,
            4: priceforFour,
            5: priceforFive
        }
        )


    }, [pricePerWinPerTicket])


    const handleSort = () => {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    const sortedTickets = playerTickets.slice().sort((a, b) => {
        const countHitsA = a.reduce((acc, x) => acc + randomNums.filter(element => element === x).length, 0);
        const countHitsB = b.reduce((acc, x) => acc + randomNums.filter(element => element === x).length, 0);

        return sortOrder === 'desc' ? countHitsB - countHitsA : countHitsA - countHitsB;
    });

    const arr = Array.from({ length: 39 }, (_, index) => index + 1);

    const ticket = (
        <>
            {arr.map((x) => (
                <div key={x} onClick={() => handleChoice(x)} style={playerChoice.some((choice) => choice === x) ? { backgroundColor: "black", color: "white" } : null}
                >
                    {x}
                </div>
            ))}
        </>
    );

    return (
        <div className="player-wrapper">
            <h2>JÁTÉKOS</h2>
            <h3>Egyenleged: {playerBalance.toLocaleString('hu-HU')} akcse</h3>

            {submittedName ? null : (<div>
                <p>Neved:</p>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></input>
                    <button type="submit">MEHET</button>

                </form>
            </div>)}

            {submittedName ? <h3>Név: {submittedName}</h3> : null}
            {submittedName ? (
                <>

                    {wantPlay && playerBalance >= 500 && randomNums.length == 0 ?
                        (
                            <>
                                <div>Válassz 5 számot:</div>
                                <div className="ticket-wrapper">{ticket}</div>
                            </>
                        ) : wantPlay && playerBalance < 500 ? (

                            <div>Sajnos nincs elég pénzed játszani.</div>

                        )
                            : null

                    }

                    {playerChoice.length % 5 === 0 && playerChoice.length !== 0 && playerBalance <= 500 ? (

                        <>
                            <div>Sajnos nincs több pénzed játszani.</div>
                            <button onClick={() => handleWannaPlay('nem')}>RENDBEN</button>
                        </>
                    ) : playerChoice.length % 5 === 0 && playerChoice.length !== 0 ? (

                        <>
                            <div>Akarsz még szelvényt kitölteni?</div>
                            <div className="wannaplay-more-wrapper">
                                <button onClick={() => handleWannaPlay('igen')}>IGEN</button>
                                <button onClick={() => handleWannaPlay('nem')}>NEM</button>
                            </div>

                        </>

                    )
                        : null
                    }


                    {playerChoice.length > 0 ? <div className="chosen-nums"><p>A választott számaid:</p> <p>{playerChoice.join(", ")}</p></div> : null}

                    {playerTickets.length > 0 ?
                        <div className="playerticket-wrapper">
                            <div className="playerticket-headers">
                                <h3>Szelvényeid</h3>
                                {randomNums.length > 0 ?
                                    <>
                                        <h3><button onClick={handleSort}>Találatok</button></h3>
                                        <h3>Kifizetés</h3>
                                    </>

                                    : null
                                }

                            </div>

                            <div>
                                {sortedTickets.map((ticket, i) => {
                                    const countHits = ticket.reduce((accumulator, x) => accumulator + randomNums.filter(element => element === x).length, 0);

                                    return (
                                        <div className="player-ticket" key={i}>
                                            <div>
                                                {ticket.map((number) => (


                                                    <div key={number} style={randomNums.includes(number) ? { fontWeight: "700" } : null}>
                                                        {number}
                                                    </div>

                                                ))}
                                            </div>
                                            {randomNums.length > 0 ? <div>{countHits}</div> : null}
                                            {prices[countHits] ? <div>{prices[countHits]} akcse</div> : null}
                                        </div>
                                    );
                                })}

                            </div>
                            <div className="total-payout">
                                {randomNums.length > 0 ?

                                    <>
                                        <p> <b>Összesen:</b></p>
                                        <div></div>
                                        <div>{allWins} akcse</div>
                                    </>
                                    : null
                                }
                            </div>

                        </div>

                        : null}
                </>

            ) : null
            }
        </div >
    );
}

export default Player;
