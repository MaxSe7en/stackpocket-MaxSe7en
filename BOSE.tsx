function BOSE() {

    const [selected,setSelected] = useState([])
    const [noBets,setNoBets] = useState(0)

    const getSelection = (items)=>{
        if (selected.includes(items)) {
            const left = selected.filter(x=>x !== items)
            setSelected(left)
        }else{
            setSelected(prev=>[...prev,items])
        }
    }

    useEffect(()=>{
        console.log('SELE:',selected)
        setNoBets(selected.length)
    },[selected,noBets])

  return (
    <div>
      
        <div className={styles.bay}>
        {Buttons.map((item,i)=>{
            const isPart = selected.includes(item)
            return (
               <button style={{backgroundColor:isPart?'#c79cff':'white'}} onClick={()=>getSelection(item)} className={styles.bu} key={i}>{item}</button>
            )
          }
        )}
        </div>
        <div className={styles.no_bets}>
            {noBets && noBets} bets
        </div>
    </div>
  )
}