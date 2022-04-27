import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import {
  LineChart,
   BarChart,
   PieChart,
   ProgressChart,
   ContributionGraph,
   StackedBarChart
 } from "react-native-chart-kit";
 import {Dimensions} from 'react-native'
const screenWidth = Dimensions.get("window").width*0.8
export default function PatientOne() {
  let [temp_chart,setTemp_chart]=useState([1,2,3,4,5]);
  let [pressure_chart,setPressure_chart]=useState([5,4,3,2,1]);
  let [showPress, setShowPress] = useState(true)
  let [showTemp, setShowTemp] = useState(false)
  let[status,showStatus]=useState(true)
  let[sec,setSec]= useState(0)
  let [state,ToggleStatus]= useState([])
  let [title,setTitle] = useState('Go to Pressure')
  let [modetitle,setmodeTitle]=useState("ON")
var label=[]
  for (let i=0;i<20;i++)
  {
    label.push(i)
  }

  
//sensors Readings
  async function get_pateintData()
  {
    let response = await fetch("http://localhost:8090/patient_data?ID=1")
    let json = await response.json()
    setPressure_chart(json.pressure)
    setTemp_chart(json.temp)
    console.log(temp_chart)
    console.log(pressure_chart)

  }

  setInterval(() => {
    setSec(sec+=1)
  }, 2000);

  let [swap,setSwap]=useState(temp_chart) //swap between temperature and pressure data visualization.
  function Togglepress() //to show pressure data chart
  {
    setSwap(pressure_chart)
    setShowPress((prev)=>!prev)
    setShowTemp((prev)=>!prev)
    ToggleStatus('OFF','ON')
    setTitle('Go to Temperature')
  }
  function ToggleTemp()//to show temperature data chart
  {
    setSwap(temp_chart)
    setShowTemp((prev)=>!prev)
    setShowPress((prev)=>!prev)
    ToggleStatus('ON','OFF')
    setTitle('Go to Pressure')

  }
  async function getStatus()
  {
    // console.log(state)
    // showStatus((prev)=>!prev)


    if ((modetitle =='ON' && title =='Go to Pressure') || (modetitle =='OFF' && title =='Go to Temperature'))
    {
      // setmodeTitle("OFF")
      ToggleStatus(['OFF','ON'])
      console.log(state)

    }
    else if (((modetitle =='OFF') && (title=='Go to Pressure')) || ((modetitle =='ON') && (title=='Go to Temperature')))
    { 
      // setmodeTitle("ON")   
      ToggleStatus(['ON','OFF'])
      console.log(state)
    }
    if(modetitle=='ON')
    {
      setmodeTitle("OFF")
    }else if(modetitle=='OFF'){ setmodeTitle("ON")}
    // let response =await fetch('http://localhost:8090/state', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     temp: state[0],
    //     pressure:state[1]
    //   })
    // });    

  }
  
  // useEffect(()=>get_pateintData(),[sec])

  return (
    <>
<View style={styles.container}>
  {/* <Text>Bezier Line Chart</Text> */}
  <Text style={styles.title}> Readings visualization</Text>
  <LineChart style={{flex:1,flexDirection: "column"}}
    data={{
//this is x-axis data
      labels: label.map((index) => index),
      datasets: [
        {label: `${label.length} Temperature Readings`,
          //this is y-axis       
/*you need to add your data here from JSON, and remember the data you are requesting should be integer because it is line chart*/
          
          data:swap.map((item)=>item) 
        }
      ]
    }}
    width={500} // from react-native
    height={500}
    yAxisInterval={2} // optional, defaults to 1
    chartConfig={{
      // backgroundColor: "blue",
      backgroundGradientFrom: "#2196f3",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
      borderRadius:80,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
  />
</View>
<View style={styles.space}>
{status&&<Button style={styles.button} title={modetitle} onPress={()=>getStatus()}/>}

{status||<Button style={styles.button} title={modetitle} onPress={()=>getStatus()}/>}</View>
<View style={styles.space}>
{showPress&&<Button style={styles.button} title={title} onPress={()=>Togglepress()}/>}
{showTemp&&<Button style={styles.button} title={title} onPress={()=>ToggleTemp()}/>}</View>
  <Text style={{textAlign:"center"}}>{new Date().toLocaleTimeString()} </Text>
</>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: 'rgba(127, 255, 212, 0.062)',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart:10
  },
  button:{
    display:'flex',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginTop:150,
    marginBottom:250,
    padding:3,

  },
  space:
  {
    width:200,
    height:40,
    margin:'auto'

  },
  title:
  {   display:"flex",
      justifyContent:"center",
      alignItems:"flex-start",
      fontSize:30,
      fontWeight:'100',
      marginTop:60,
      color:'#2196f3',
      fontWeight:'bold'
      

  },
});
