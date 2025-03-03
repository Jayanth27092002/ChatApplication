import React from 'react'
import {Chart as Chartjs,CategoryScale,Tooltip,LinearScale,LineElement,ArcElement,Legend,Filler,PointElement} from "chart.js"
import { Doughnut, Line } from 'react-chartjs-2'





Chartjs.register(CategoryScale,Tooltip,LinearScale,LineElement,ArcElement,Legend,Filler,PointElement);

const LineChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false
        },
        title:{
            display:false
        }
    },

    scales:{
        x:{
            grid:{
                display:false
            }
           
        },
        y:{
            beginAtZero:true,

            grid:{
                display:false
            }
            
        }
    }
}

export const LineChart=({value=[]})=>{
   

    const data={
        labels:value,

        datasets:[{
            data:[1,24,31,4,53,5,15],
            label:"Sample",
            fill:true,
            backgroundColor:"rgba(75,12,192,0.5)",
            borderColor:"rgba(75,12,192,1)"
        }]
    }


    return (
        <Line data={data} options={LineChartOptions} >

        </Line>
    )

}


const DoughnutOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false
        },
        
        
    },
    cutout:120
}


export const DoughtNutChart=({value=[],labels=[]})=>{

    const data={
        labels:labels,

        datasets:[{
            data:value,
            label:"Total Chats vs Group Chats",
           
            backgroundColor:["rgba(75,12,192,0.5)","rgba(25,191,110,0.5)"],
            hoverBackgroundColor:["purple","green"],
            borderColor:["rgba(75,12,192,1)","rgba(25,191,110,1)"],
            offset:30
        }]
    }


    return (
        <Doughnut style={{zIndex:10}} data={data} options={DoughnutOptions} >

        </Doughnut>
    )

}