// import AdminFooter from "./components/AdminBlocks/AdminFooter";
import AdminHeader from "./components/AdminBlocks/AdminHeader";
import AdminNavi from "./components/AdminBlocks/AdminNavi";
import { AdminProvider } from "./context/AdminContext";
import AdminSheet from "./content/components/AdminSheet";

const MookiLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminProvider>
      <AdminSheet />
      <div className="flex h-screen w-screen flex-col">
        <div className="flex h-full w-full flex-col">
          <AdminHeader />
          <div className="flex flex-1">
            <div className="bg-gray-100">
              <AdminNavi />
            </div>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>

          {/* <AdminFooter /> */}
        </div>
      </div>
    </AdminProvider>
  );
};

export default MookiLayout;
