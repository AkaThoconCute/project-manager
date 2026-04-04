import type { ReactNode } from "react";
import VerticalNav from "./VerticalNav";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: "flex" }}>
      <VerticalNav />
      <div style={{ width: "100%" }}>
        <main className="container">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
