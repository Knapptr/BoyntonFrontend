import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import CabinAssignmentRoutes from "./pages/CabinAssignment";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import NavWrapper from "./components/NavWrapper";
import Protected from "./components/Protected";
import CabinListIndex from "./pages/CabinListIndex";
import ProgrammingSchedule from "./pages/ProgrammingSchedule";
import Slay from "./pages/Slay";
import UsersPage from "./pages/UsersPage";
import StaffSchedule from "./pages/StaffSchedule";
import ProfilePage from "./pages/ProfilePage";
import CreateAward from "./pages/CreateAward";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import RoleProtected from "./components/protectedRoutes";
import SignUpIndex from "./pages/SignUpIndex";
import CreateSchedulePage from "./pages/CreateSchedule";
import AttendanceDisplay from "./pages/Attendance";
import { UserContextProvider } from "./components/UserContext";
import { WeekContextProvider } from "./components/WeekContext";
import CreateUserPage from "./pages/CreateUserPage";
import AllCampers from "./pages/AllCampers";
import AllStaffSchedule from "./pages/AllStaffSchedule";
import OneCamper from "./pages/OneCamper";
import ActivityInfo from "./pages/Activity";
import { RegistrationPage, RegistrationIndex } from "./pages/Registration";
import UserAdminPage from "./pages/UserAdminPage";
import ActivityList from "./pages/ActivityList";
import AdminThumbs from "./pages/AdminThumbs";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="sign-up/:signUpToken" element={<CreateUserPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="slay" element={<Slay />} />
            <Route
              path=""
              element={
                <Protected>
                  <WeekContextProvider>
                    <NavWrapper />
                  </WeekContextProvider>
                </Protected>
              }
            >
              <Route
                path=""
                element={
                  <Protected>
                    <ProfilePage />
                  </Protected>
                }
              ></Route>
              <Route path="registration">
                <Route
                  path=""
                  element={
                    <Protected>
                      <RegistrationIndex />
                    </Protected>
                  }
                />
                <Route
                  path=":weekId"
                  element={
                    <Protected>
                      <RegistrationPage />
                    </Protected>
                  }
                />
              </Route>
              <Route
                path="award/:weekNumber"
                element={
                  <Protected>
                    <CreateAward />
                  </Protected>
                }
              />
              <Route
                path="camper/:camperId"
                element={
                  <Protected>
                    <OneCamper />
                  </Protected>
                }
              />
              <Route
                path="campers/:weekNumber"
                element={
                  <Protected>
                    <AllCampers />
                  </Protected>
                }
              />
              <Route path="cabins/">
                {CabinAssignmentRoutes()}{" "}
                <Route path="list/:weekNumber">
                  <Route
                    index
                    element={
                      <Protected>
                        <CabinListIndex />
                      </Protected>
                    }
                  ></Route>
                </Route>
              </Route>
              <Route
                path="admin/users"
                element={
                  <RoleProtected role="admin">
                    <UserAdminPage />
                  </RoleProtected>
                }
              />
              <Route
                path="admin/users/:username"
                element={
                  <RoleProtected role="admin">
                    <UserAdminPage />
                  </RoleProtected>
                }
              />
              <Route
                path="users"
                element={
                  <RoleProtected role="admin">
                    <UsersPage />
                  </RoleProtected>
                }
              />
              <Route
                path="admin/thumbsup/:weekNumber"
                element=<RoleProtected role="admin">
                  <AdminThumbs />
                </RoleProtected>
              />
              <Route path="schedule">
                <Route
                  path="programming/activities"
                  element={
                    <RoleProtected role="programming">
                      <ActivityList />
                    </RoleProtected>
                  }
                />
                <Route
                  path="programming/:weekNumber"
                  element={
                    <RoleProtected role="programming">
                      <ProgrammingSchedule />
                    </RoleProtected>
                  }
                />

                <Route path="sign-up" element={<SignUpIndex />}>
                  <Route
                    path=":cabin/:weekNumber"
                    element={
                      <Protected>
                        <CreateSchedulePage />
                      </Protected>
                    }
                  />
                </Route>
                <Route
                  path="staff/:weekNumber"
                  element={<AllStaffSchedule />}
                />

                <Route
                  path="staffing/:weekNumber"
                  element={
                    <RoleProtected role="unit_head">
                      <StaffSchedule />
                    </RoleProtected>
                  }
                />
                <Route
                  path="activity/:activityId"
                  element={
                    <Protected>
                      <ActivityInfo />
                    </Protected>
                  }
                />

                <Route
                  path="attendance/:periodId"
                  element={
                    <Protected>
                      <AttendanceDisplay />
                    </Protected>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
