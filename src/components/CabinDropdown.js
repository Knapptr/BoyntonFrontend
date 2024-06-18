import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import fetchWithToken from "../fetchWithToken";
import UserContext from "./UserContext";

const CabinAssignmentDropdown = ({weekNumber, currentAssignment, onSelect  }) => {
  //Define contexts
  const auth = useContext(UserContext);
  // Define states
  const [cabinList,setCabinList] = useState([]);
  // get cabin list for week on load
  useEffect(()=>{
    const getData = async()=>{
      const url = `api/weeks/${ weekNumber }/cabin-sessions`;
      const result = await fetchWithToken(url,{},auth);
      if(!result.ok){console.error("Error getting cabin list");return;}
      const list = await result.json();
      list.sort()
      setCabinList(list);
    }
    getData()
  },[auth,weekNumber])
  return (
    <FormControl fullWidth>
      <InputLabel id="cobinDropdownLabel">Cabin Assignment</InputLabel>
    {cabinList.length > 0 && cabinList[0].weekNumber===weekNumber &&
      <Select
        labelId="cabinDropdownLabel"
        id="cabinDropdownAssignment"
        label="Cabin Assignment"
        value={currentAssignment || ""}
        onChange={(event)=>{
          onSelect(event);}}
      >
    {cabinList.map(cabin=><MenuItem key={`select-cabin-${cabin.id}`}value={cabin.id}>Cabin {cabin.name}</MenuItem>)}
    <MenuItem value={""}>Unassigned</MenuItem>
      </Select>
    }
    </FormControl>
  );
};
export default CabinAssignmentDropdown;
