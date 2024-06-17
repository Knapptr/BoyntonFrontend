import { isAdmin, isProgramming, isUnitHead } from "./permissions";

/** Filter role based links on reqRole property*/
const prepareRoleMenuItems = (items, auth) => {
  return items.filter((item) => {
    switch (item.reqRole) {
      case "admin":
        return isAdmin(auth);
      case "unit_head":
        return isUnitHead(auth);
      case "programming":
        return isProgramming(auth);
      case "counselor":
        return true;
      case undefined:
        return true;
      default:
        return false;
    }
  });
};

export default prepareRoleMenuItems;
