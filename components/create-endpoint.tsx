import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

export function CreateEndpoint() {
  return (
    <>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline" size="lg" className="font-bold">
            <IconGitBranch /> Create Endpoint
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Endpoint</DrawerTitle>
            <DrawerDescription>Create a new endpoint</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y"></div>
          </div>
          <div className="border-t p-4 gap-2 flex flex-col">
            <Button className="w-full" variant="default">
              Create
            </Button>
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
