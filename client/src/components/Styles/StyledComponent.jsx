import React from 'react'

import {keyframes, Skeleton, styled} from "@mui/material"
import { red } from '@mui/material/colors'
import { Link } from 'react-router-dom';
import { KeyTwoTone } from '@mui/icons-material';

export const HiddenStyledComponent = styled("input")({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0
});


export const Customlink=styled(Link)`
text-decoration:none;
color:black;
padding:1rem;
&:hover{
background-color:#645a60 }
`


export const CustomChatButton=styled("input")`
width:100%;
height:100%;
border:none;
outline:none;
padding:0 3rem;
background-color:#dfdbdd;
border-radius:1.5rem;
&:hover{
    border:lightblue solid 2px; 
}
`


export const AdminSearchField=styled("input")`
padding:1rem 2rem;
width:20vmax;
border:none;
outline:none;
border-radius:2rem;
fontSize:1.1rem;
background-color:#f1f1f1;

`


export const CurveButton=styled("button")`
border-radius:2rem;
padding:1rem 2rem;
border:none;
outine:none;
color:white;
background-color:black;
fontSize:1.1rem;
&:hover{
    background-color:rgba(0,0,0,0.8);
}`


const bounceAnimation=keyframes`
0% {transform :scale(1);}
50% {transform :scale(1.5);}
100% {transform :scale(1);}`;


export const BouncingSkeleton=styled(Skeleton)(()=>({
    animation:`${bounceAnimation} 1s infinite`
}));