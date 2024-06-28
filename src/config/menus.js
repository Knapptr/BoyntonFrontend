import { Book, Brush, Cabin, CalendarViewMonth, Checklist, Construction, EmojiEvents, HolidayVillage, Leaderboard, ListAlt, PersonSearch, Print, SportsBasketball, TrackChanges, WbSunny } from "@mui/icons-material"

const menus ={
  schedule: [
    {
      type: "dialog",
      label: "Registration",
      dialog: "registration",
      reqRole: "programming",
      icon: <WbSunny />
    },
    {
      type: "dialog",
      label: "Activity Sign Up",
      dialog: "signup",
      reqRole: "counselor",
      icon: <Brush />
    },
    {
      type: "dialog",
      label: "Attendance",
      dialog: "attendance",
      reqRole: "counselor",
      icon: <Checklist />
    },
    {
      type: "dialog",
      label: "Activity Schedule",
      dialog: "programming",
      reqRole: "programming",
      icon: <CalendarViewMonth />
    },
    {
      type: "dialog",
      label: "Staff Scheduling",
      dialog: "staffing",
      reqRole: "admin",
      icon: <Construction />
    },
    {
      type: "link",
      href: "/schedule/programming/activities",
      label: "Activity List",
      reqRole: "programming",
      icon: <SportsBasketball />
    },
  ],
  campers: [
    {
      type: "dialog",
      label: "Give Award",
      dialog: "giveaward",
      reqRole: "counselor",
      icon: <EmojiEvents />
    },
    {
      type: "dialog",
      label: "Cabin List",
      dialog: "cabinlist",
      reqRole: "counselor",
      icon: <Cabin />
    },
    {
      type: "dialog",
      label: "Camper List",
      dialog: "camperlist",
      reqRole: "counselor",
      icon: <ListAlt />
    },
    {
      type: "dialog",
      label: "Cabin Assignment",
      dialog: "cabinassignment",
      reqRole: "unit_head",
      icon: <HolidayVillage />
    },
    {
      type: "dialog",
      label: "Print Awards",
      dialog: "printawards",
      reqRole: "admin",
      icon: <Print />
    },
  ],
  other: [
    {
      type: "link",
      label: "Staff Expectations",
      href: process.env.REACT_APP_EXPECTATIONS,
      reqRole: "counselor",
      icon: <TrackChanges/>
    },
    {
      type: "link",
      label: "FL Eval",
      href: process.env.REACT_APP_FL_OBS_URL,
      reqRole: "counselor",
      icon: <Leaderboard />
    },
    {
      type: "link",
      label: "Staff Observation",
      href: process.env.REACT_APP_STAFF_OBS_URL,
      reqRole: "counselor",
      icon: <PersonSearch/>
    },
    {
      type: "download",
      label: "Counselor Handbook",
      href: `/docs/counselor-handbook`,
      filename: "counselor-handbook2023.pdf",
      icon: <Book />
    },
  ],
  admin: [
    {type: "link",
      label: "Users",
    href: "/users",
    reqRole:"admin"},

    {type: "link",
      label: "User Config",
    href: "/admin/users",
    reqRole:"admin"}
  ],

} 
export default menus
