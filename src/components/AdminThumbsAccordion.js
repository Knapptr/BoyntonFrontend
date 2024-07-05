import { ArrowDropDown} from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import { ThumbsList } from "../pages/AdminThumbs";

const AdminThumbsAccordion = ({weekNumber})=>{
  return <Accordion >
    <AccordionSummary expandIcon={<ArrowDropDown/>}>Thumbs Ups</AccordionSummary>
    <AccordionDetails>
    <ThumbsList weekNumber={weekNumber}/>
    </AccordionDetails>
    </Accordion>
}

export default AdminThumbsAccordion;
