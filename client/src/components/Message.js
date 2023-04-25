import React from 'react'
import { Typography ,Box} from '@mui/material';

const Message = ({text,date,direction}) => {
  return (
      <Box
      display="flex"
      justifyContent={direction}
      >
              <Box>
                <Typography 
                variant="subtitle2"
                backgroundColor="#009688"
                padding="5px"
                borderRadius="10px"
                >{text}</Typography>
                <Typography 
                variant="caption"
                >{new Date(date).toLocaleTimeString()}</Typography>
            </Box>
      </Box>

  )
}

export default Message