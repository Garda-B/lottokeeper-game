import { useEffect } from "react";

function Operator({ playerTickets, setNumberofGenerated, handleGeneratedTickets, numberofGenerated, generatedTickets, handleRandomNums, randomNums, winners, pricePerWin, pricePerWinPerTicket, handleReset, reset, handleOperatorBalance, operatorBalance, previousOperatorBalance }) {


    const totalPayout = Object.keys(pricePerWin).length > 0 && Object.values(pricePerWin).reduce((a, b) => a + b)



    useEffect(() => {
        if (!reset) {

            handleOperatorBalance(previousOperatorBalance + playerTickets.length * 500 + generatedTickets.length * 500);
        }
    }, [playerTickets, generatedTickets, reset]);

    useEffect(() => {
        handleOperatorBalance((prevBalance) => prevBalance - totalPayout);
    }, [totalPayout]);


    useEffect(() => {

        console.log(numberofGenerated)

    }, [numberofGenerated])



    const handleReload = () => {
        localStorage.removeItem('playerBalance');
        localStorage.removeItem('submittedName');
        localStorage.removeItem('previousOperatorBalance');


        window.location.reload()
    }


    const calculateNonWinners = () => {

        const allTickets = [...playerTickets, ...generatedTickets];

        return allTickets.length - winners[2] - winners[3] - winners[4] - winners[5]

    }

    return (
        <>



            <>
                <div className="operator-wrapper">
                    <h2>ÜZEMELTETŐ</h2>
                    <h3>Egyenleged: {parseFloat(operatorBalance.toFixed(2)).toLocaleString('hu-HU')} akcse</h3>
                    <button onClick={handleReset} disabled={randomNums.length === 0}>ÚJ HÚZÁS</button>
                    <button onClick={handleReload}>ÚJ JÁTÉK</button>

                    {randomNums.length === 0 && generatedTickets.length == 0 ?

                        <>
                            <div>Ha szeretnél szelvényt generálni, add meg hányat:</div>

                            <form onSubmit={handleGeneratedTickets}>
                                <input type="text" value={numberofGenerated} onChange={(e) => setNumberofGenerated(e.target.value)}></input>
                                <button type="submit">MEHET</button>
                            </form>
                        </>
                        : null}

                    {generatedTickets.length > 0 || playerTickets.length > 0 ?

                        <button onClick={() => handleRandomNums()} disabled={randomNums.length > 0}>INDULHAT A JÁTÉK</button>

                        : null
                    }

                    {randomNums.length > 0 ?

                        <>

                            <h2>Kimutatás</h2>
                            <h3>Összes szelvény: {[...playerTickets, ...generatedTickets].length.toLocaleString('hu-HU')}</h3>
                            <h3>Nyerő szelvények: {([...playerTickets, ...generatedTickets].length - calculateNonWinners()).toLocaleString('hu-HU')}</h3>
                            <div>2-es: {winners[2].toLocaleString('hu-HU')}</div>
                            <div>3-as: {winners[3].toLocaleString('hu-HU')}</div>
                            <div>4-es: {winners[4].toLocaleString('hu-HU')}</div>
                            <div>5-ös: {winners[5].toLocaleString('hu-HU')}</div>
                            <h3>Nyeretlen szelvények: {calculateNonWinners().toLocaleString('hu-HU')}</h3>
                            <h3>Összes bevétel: {([...playerTickets, ...generatedTickets].length * 500).toLocaleString('hu-HU')} akcse</h3>
                            <h3>Összes kifizetés: {parseFloat(totalPayout.toFixed(2)).toLocaleString('hu-HU')} akcse</h3>
                            <div>2-es: {winners[2]} x {parseFloat(pricePerWinPerTicket[2].toFixed(2)).toLocaleString('hu-HU')} = {parseFloat((winners[2] * pricePerWinPerTicket[2]).toFixed(2)).toLocaleString('hu-HU')} akcse</div>
                            <div>3-as: {winners[3]} x {parseFloat(pricePerWinPerTicket[3].toFixed(2)).toLocaleString('hu-HU')} = {parseFloat((winners[3] * pricePerWinPerTicket[3]).toFixed(2)).toLocaleString('hu-HU')} akcse</div>
                            <div>4-es: {winners[4]} x {parseFloat(pricePerWinPerTicket[4].toFixed(2)).toLocaleString('hu-HU')} = {parseFloat((winners[4] * pricePerWinPerTicket[4]).toFixed(2)).toLocaleString('hu-HU')} akcse</div>
                            <div>5-ös: {winners[5]} x {parseFloat(pricePerWinPerTicket[5].toFixed(2)).toLocaleString('hu-HU')} = {parseFloat((winners[5] * pricePerWinPerTicket[5]).toFixed(2)).toLocaleString('hu-HU')} akcse</div>

                            <h3>Nyereség: {([...playerTickets, ...generatedTickets].length * 500 - totalPayout).toLocaleString('hu-HU')} akcse</h3>

                        </>

                        : null
                    }

                </div>
            </>




        </>
    )
}




export default Operator;