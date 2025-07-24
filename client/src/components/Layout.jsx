import { Outlet } from "react-router-dom";
import { lazy } from "react";
const Header = lazy(()=>import("./Header"))

export default function Layout() {

  return (
    <div>
      <Header />
      <>
        <Outlet />
      </>
    </div>
  );
}
