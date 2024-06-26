import { Box, Tab, Tabs } from "@mui/material"
import { useState } from "react"

const MyWeeksTabbed = ()=>{
  const [currentTab,setCurrentTab] = useState(null);
  const handleChange = (e,value) => {setCurrentTab(value)};
  return <Box>
    <Tabs value={currentTab} onChange={handleChange}>
    <Tab label="one" aria-controls={`tab-panel-${0}`} id={`tab-panel-${0}`}/>
    <Tab label="two" aria-controls={`tab-panel-${1}`} id={`tab-panel-${1}`}/>
    </Tabs>
    {currentTab !== null && <Box>Content</Box>}
    </Box>
}

export default MyWeeksTabbed;
