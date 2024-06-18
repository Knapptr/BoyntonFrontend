import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import useDownloadLink from "../hooks/useGetDownloadLink";
import prepareRoleMenuItems from "../utils/filterRoles";



const DrawerMenu = ({ items, handleDialogs, auth }) => {
  const [download] = useDownloadLink();
  //filter based on auth
  const authBasedItems = prepareRoleMenuItems(items, auth);
  const renderItem = (item) => {
    switch (item.type) {
      case "dialog":
        return (
          <ListItemButton
            onClick={() => {
              handleDialogs(item.dialog);
            }}
          >
          {item.icon &&<ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      case "link":
        return (
          <ListItemButton href={item.href}>
          {item.icon &&<ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      case "download":
        return (
          <ListItemButton onClick={() => download(item.href, item.filename)}>
          {item.icon &&<ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
    }
  };
  return authBasedItems.map((item) => {
    return (
      <ListItem key={`menu-item-${item.label}`}>{renderItem(item)}</ListItem>
    );
  });
};

export default DrawerMenu;
