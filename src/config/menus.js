const menus ={
  schedule: [
    {
      type: "dialog",
      label: "Registration",
      dialog: "registration",
      reqRole: "programming",
    },
    {
      type: "dialog",
      label: "Activity Sign Up",
      dialog: "signup",
      reqRole: "counselor",
    },
    {
      type: "dialog",
      label: "Attendance",
      dialog: "attendance",
      reqRole: "counselor",
    },
    {
      type: "dialog",
      label: "Activity Schedule",
      dialog: "programming",
      reqRole: "programming",
    },
    {
      type: "dialog",
      label: "Staff Scheduling",
      dialog: "staffing",
      reqRole: "admin",
    },
    {
      type: "link",
      href: "/schedule/programming/activities",
      label: "Activity List",
      reqRole: "programming",
    },
  ],
  campers: [
    {
      type: "dialog",
      label: "Give Award",
      dialog: "giveaward",
      reqRole: "counselor",
    },
    {
      type: "dialog",
      label: "Cabin List",
      dialog: "cabinlist",
      reqRole: "counselor",
    },
    {
      type: "dialog",
      label: "Camper List",
      dialog: "camperlist",
      reqRole: "counselor",
    },
    {
      type: "dialog",
      label: "Cabin Assignment",
      dialog: "cabinassignment",
      reqRole: "unit_head",
    },
    {
      type: "dialog",
      label: "Print Awards",
      dialog: "printawards",
      reqRole: "admin",
    },
  ],
  other: [
    {
      type: "link",
      label: "FL Eval",
      href: process.env.REACT_APP_FL_OBS_URL,
      reqRole: "counselor",
    },
    {
      type: "link",
      label: "Staff Observation",
      href: process.env.REACT_APP_STAFF_OBS_URL,
      reqRole: "counselor",
    },
    {
      type: "download",
      label: "Counselor Handbook",
      href: `/docs/counselor-handbook`,
      filename: "counselor-handbook2023.pdf",
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
