import { useEffect, useState, useMemo } from 'react'
import './App.css'
import Player from './components/Player'
import Operator from './components/Operator'


function App() {
  const [playerTickets, setPlayerTickets] = useState([])
  const [numberofGenerated, setNumberofGenerated] = useState("")
  const [generatedTickets, setGeneratedTickets] = useState([])
  const [randomNums, setRandomNums] = useState([])
  const [sortedTickets, setSortedTickets] = useState([])
  const [winners, setWinners] = useState({
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [pricePerWin, setPricePerWin] = useState({})


  const pricePerWinPerTicket = useMemo(() => {
    return {
      2: winners[2] !== 0 ? pricePerWin[2] / winners[2] : 0,
      3: winners[3] !== 0 ? pricePerWin[3] / winners[3] : 0,
      4: winners[4] !== 0 ? pricePerWin[4] / winners[4] : 0,
      5: winners[5] !== 0 ? pricePerWin[5] / winners[5] : 0
    };
  }, [winners, pricePerWin]);

  const [reset, setReset] = useState(false)
  const [wantToPlay, setWantToPlay] = useState(false)
  const [operatorBalance, setOperatorBalance] = useState(0)
  const [previousOperatorBalance, setPreviousOperatorBalance] = useState(() => {
    const storedState = localStorage.getItem('previousOperatorBalance');
    return storedState ? JSON.parse(storedState) : 0;
  })


  useEffect(() => {
    if (randomNums.length > 0) {
      setPreviousOperatorBalance(operatorBalance);
    }
  }, [randomNums, operatorBalance, winners]);

  useEffect(() => {
    localStorage.setItem('previousOperatorBalance', JSON.stringify(previousOperatorBalance));
    console.log(localStorage.getItem('previousOperatorBalance'));
  }, [previousOperatorBalance]);


  const handleGeneratedTickets = (e) => {

    e.preventDefault();

    setReset(false)

    const numberOfTickets = parseInt(numberofGenerated, 10);
    const numberOfRandomNumbers = 5;
    const maxNumber = 39;

    const newGeneratedNumbers = Array.from({ length: numberOfTickets }, () => {
      const uniqueNumbers = new Set();

      return Array.from({ length: numberOfRandomNumbers }, () => {
        let randomNum;

        do {
          randomNum = Math.floor(Math.random() * (maxNumber - 1)) + 1;
        } while (uniqueNumbers.has(randomNum));

        uniqueNumbers.add(randomNum);
        return randomNum;
      });
    });

    setGeneratedTickets(newGeneratedNumbers);
    setNumberofGenerated("");


  }

  const handleMatch = () => {
    const allTickets = [...playerTickets, ...generatedTickets];

    allTickets.forEach(ticket => {
      const count = ticket.filter(element => randomNums.includes(element)).length;

      if (count >= 2 && count <= 5) {

        setWinners(prevWinners => ({
          ...prevWinners,
          [count]: prevWinners[count] + 1,
        }));
      }

    });
  };



  useEffect(() => {

    if (randomNums.length > 0) {
      handleMatch();
    }
  }, [randomNums]);



  useEffect(() => {
    handlePricePerWin()
  }, [winners])


  const handlePricePerWin = () => {

    const totalIncome = [...playerTickets, ...generatedTickets].length * 500;

    // Súlyok a találatok szerint
    const weightHit2 = 1;
    const weightHit3 = 2;
    const weightHit4 = 3;
    const weightHit5 = 4;

    // Súlyozott egész kiszámítása
    const weightedTotal = weightHit2 * winners[2] + weightHit3 * winners[3] + weightHit4 * winners[4] + weightHit5 * winners[5];

    // Találatonkénti százalék kiszámítása 
    const percentageForHit2 = (weightHit2 * winners[2] / weightedTotal) * 90;
    const percentageForHit3 = (weightHit3 * winners[3] / weightedTotal) * 90;
    const percentageForHit4 = (weightHit4 * winners[4] / weightedTotal) * 90;
    const percentageForHit5 = (weightHit5 * winners[5] / weightedTotal) * 90;

    // Az összes kifizetés egyes találatonként az összes bevétel függvényében. A százalék kiszámításásnál (fent) 
    // látszik, hogy a teljes bevétel 90%-a kerül kiosztásra.  

    const winObject = {
      2: (winners[2] === 0 ? 0 : Math.ceil((percentageForHit2 / 100) * totalIncome)),
      3: (winners[3] === 0 ? 0 : Math.ceil((percentageForHit3 / 100) * totalIncome)),
      4: (winners[4] === 0 ? 0 : Math.ceil((percentageForHit4 / 100) * totalIncome)),
      5: (winners[5] === 0 ? 0 : Math.ceil((percentageForHit5 / 100) * totalIncome))
    };


    //a pricePerWin alapján a pricePerWinPerTicket mutatja meg, hogy egy szelvényre mennyi a kifizetés találatonként.

    setPricePerWin(winObject)

  }


  const handleTickets = (value) => {
    setPlayerTickets(value)
  }


  const handleRandomNums = () => {

    const min = 1;
    const max = 39;
    const newRandomNums = [];

    while (newRandomNums.length < 5) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

      if (!newRandomNums.includes(randomNum)) {
        newRandomNums.push(randomNum);
      }
    }

    setRandomNums(newRandomNums);
  }


  const calculateMatches = (ticket) => {
    return ticket.numbers.filter(num => randomNums.includes(num)).length;
  };

  const sortTickets = (allTickets, order) => {
    switch (order) {
      case 'player':
        return allTickets.sort((a, b) => (a.source === 'player' ? -1 : b.source === 'player' ? 1 : 0));

      case 'operator':
        return allTickets.sort((a, b) => (a.source === 'generated' ? -1 : b.source === 'generated' ? 1 : 0));

      case 'match':
        return allTickets.sort((a, b) => calculateMatches(b) - calculateMatches(a));

      default:
        return [...allTickets];
    }
  };

  const handleSort = (order) => {
    const playerTicketsWithSource = playerTickets.map(ticket => ({ source: 'player', numbers: ticket }));
    const generatedTicketsWithSource = generatedTickets.map(ticket => ({ source: 'generated', numbers: ticket }));
    const allTickets = [...playerTicketsWithSource, ...generatedTicketsWithSource];

    const sortedArray = sortTickets(allTickets, order);
    setSortedTickets(sortedArray);
  };

  useEffect(() => {
    handleSort('default');
  }, [playerTickets, generatedTickets]);

  const handleOperatorBalance = (value) => {

    setOperatorBalance(value)
  }


  const handleReset = () => {
    setPreviousOperatorBalance(operatorBalance)
    setReset(true)
    setPlayerTickets([])
    setNumberofGenerated("")
    setGeneratedTickets([])
    setRandomNums([])
    setSortedTickets([])
    setWinners({
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    })
    setPricePerWin({})
    setWantToPlay(true)
  }

  const handleWantToPlay = (value) => {
    setWantToPlay(value)
  }

  const handleResetState = () => {
    setReset(false)
  }







  return (

    <>
      <main>

        <h1>LOTTOKEEPER</h1>

        <section>

          <Player playerTickets={playerTickets} handleTickets={handleTickets} randomNums={randomNums} pricePerWin={pricePerWin} pricePerWinPerTicket={pricePerWinPerTicket} handleWantToPlay={handleWantToPlay} wantToPlay={wantToPlay} handleResetState={handleResetState} />


          <div>

            {randomNums.length > 0 ?
              <div className='random-numbers-section'>
                <h2>A nyerőszámok</h2>
                <div className='numbers'>
                  {randomNums.map((num, index) => (
                    <div key={index}>{num}</div>
                  ))}
                </div>
              </div>
              : null}


            <div className='mainticket-header-tickets'>

              {sortedTickets.length > 0 ?
                <div className='mainticket-headers'>
                  <div>
                    <button onClick={() => handleSort("player")} disabled={generatedTickets.length === 0 || playerTickets.length === 0}>JÁTÉKOS</button>
                    <button onClick={() => handleSort("operator")} disabled={generatedTickets.length === 0 || playerTickets.length === 0}>ÜZEMELTETŐ</button>
                  </div>
                  <button onClick={() => handleSort("match")} disabled={randomNums.length === 0}>TALÁLATOK SZÁMA</button>
                  <button onClick={() => handleSort("match")} disabled={randomNums.length === 0} style={{ width: randomNums.length > 0 ? "100px" : "auto" }}>KIFIZETÉS</button>

                </div>
                : null}
              <div className='mainticket-wrapper' style={{ display: sortedTickets.length > 0 ? "block" : "none" }}>

                {sortedTickets.map((ticket, index) => {
                  const countHits = ticket.numbers.reduce((accumulator, x) => accumulator + randomNums.filter(element => element === x).length, 0);

                  return (
                    <div className="ticket" key={index}>
                      <div>
                        {ticket.numbers.map((number) => (
                          <div key={number} style={{
                            fontWeight: randomNums.includes(number) ? "700" : "normal",
                            color: ticket.source === 'player' ? '#0066b2' : 'black',
                          }}>
                            {number}
                          </div>
                        ))}
                      </div>
                      <div>{randomNums.length > 0 && countHits}</div>
                      {pricePerWinPerTicket[countHits] ? <div>{parseFloat(pricePerWinPerTicket[countHits].toFixed(2)).toLocaleString('hu-HU')} akcse</div> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div >


          <Operator playerTickets={playerTickets} generatedTickets={generatedTickets} numberofGenerated={numberofGenerated} setNumberofGenerated={setNumberofGenerated} handleGeneratedTickets={handleGeneratedTickets} handleRandomNums={handleRandomNums} randomNums={randomNums} winners={winners} pricePerWin={pricePerWin} pricePerWinPerTicket={pricePerWinPerTicket} handleReset={handleReset} reset={reset} handleOperatorBalance={handleOperatorBalance} operatorBalance={operatorBalance} previousOperatorBalance={previousOperatorBalance} />

        </section>
      </main>


    </>

  )
}

export default App
