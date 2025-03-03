import { Description } from '@mui/icons-material'
import React from 'react'
import {Helmet} from "react-helmet-async"

const Title = ({title="Chat app", description="Hi I am Chatuu"}) => {
  return (
    <>
    <Helmet>
    <title>{title}</title>
    <meta name='description' content={description} ></meta>

    </Helmet>
    </>
  )
}

export default Title