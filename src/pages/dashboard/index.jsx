import { AppSidebar } from "@/components/app-sidebar";
import TaskDisplayer from "@/components/TaskList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskFormDialog from "@/components/TaskFormDialog";
import TaskChart from "@/components/TaskChart";
import TotalTask from "@/components/TotalTask";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          router.push("/auth/signin");
          return;
        }

        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push("/");
          throw new Error("Failed to fetch user information.");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 bg-white items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="grid grid-cols-2 gap-4 p-4 pt-0 h-full">
            {/* right side of the dashboard */}
            <div className=" border min-h-[100vh] md:min-h-min rounded-xl bg-white">
              <TaskDisplayer />{" "}
            </div>
            {/* //left side of the dashboard */}
            <div className="flex flex-col flex-1 gap-4 ">
              <div className="aspect-video rounded-xl bg-muted/50 border">
                <TaskChart />
              </div>
              <TotalTask />
              <div className="flex flex-2 justify-end items-center rounded-xl bg-muted/50 border w-full">
                <TaskFormDialog className="pl-5" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
};

export default Dashboard;
