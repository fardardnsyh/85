"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { LibraryBig, LineChart, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 1,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    {
      id: 1,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 1,
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();

  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    const result = await db
      .select()
      .from(jsonForms)
      .where(eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(jsonForms.id));
    setFormList(result);
  };

  return (
    <div className="h-screen shadow-md border">
      <div className="p-5">
        {menuList.map((menu, idx) => (
          <Link
            href={menu.path}
            className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${
              path === menu.path ? "bg-primary text-white" : ""
            }`}
            key={idx}
          >
            <menu.icon />
            {menu.name}
          </Link>
        ))}
      </div>
      <div className="fixed bottom-5 p-6 w-64">
        <Button className="w-full">+ Create Form</Button>
        <div className="my-7">
          <Progress value={((formList?.length)/3)*100} />
          <h2 className="text-sm mt-2 text-gray-600">
            <strong>{formList?.length}</strong> Out of <strong>3</strong> File Created
          </h2>
          <h2 className="text-xs mt-3 text-gray-500 cursor-pointer hover:underline">
            Upgrade your plan for unlimited forms 👑
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
