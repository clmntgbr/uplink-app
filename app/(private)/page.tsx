"use client";

import { CreateEndpoint } from "@/components/create-endpoint";
import { CreateWorkflow } from "@/components/create-workflow";
import { HomeSectionCards } from "@/components/home/section-cards";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-row justify-end gap-2 pt-4 px-4">
          <CreateWorkflow />
          <CreateEndpoint />
        </div>
        <div className="flex flex-col gap-4 py-4">
          <HomeSectionCards />
        </div>
      </div>
    </div>
  );
}
