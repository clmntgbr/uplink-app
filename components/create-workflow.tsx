import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/lib/workflow/context";
import { postWorkflowSchema } from "@/lib/workflow/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconGitBranch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export function CreateWorkflow() {
  const { postWorkflow } = useWorkflow();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof postWorkflowSchema>>({
    resolver: zodResolver(postWorkflowSchema),
  });

  const onSubmit = async (data: z.infer<typeof postWorkflowSchema>) => {
    try {
      setIsSubmitting(true);
      await postWorkflow({ name: data.name, description: data.description || "" });
      onClose();
      toast.success("Workflow created successfully");
    } catch {
      toast.error("Failed to create workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="lg" className="font-bold" onClick={() => setOpen(true)}>
            <IconGitBranch /> Add Workflow
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Workflow</DrawerTitle>
            <DrawerDescription>Add a new workflow</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-8 p-4">
                <Field>
                  <FieldLabel htmlFor="name" className={cn(errors.name && "text-destructive")}>
                    Name
                  </FieldLabel>
                  <Input id="name" {...register("name")} className="w-full shadow-none" placeholder="Workflow name" />
                  <FieldDescription className={cn(errors.name && "text-destructive")}>Choose a unique name for your workflow.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="description" className={cn(errors.description && "text-destructive")}>
                    Description
                  </FieldLabel>
                  <Input id="description" {...register("description")} className="w-full shadow-none" placeholder="Workflow description" />
                  <FieldDescription className={cn(errors.description && "text-destructive")}>Add a description for your workflow.</FieldDescription>
                </Field>
              </div>
            </div>
            <DrawerFooter className="border-t mt-auto shrink-0">
              <Button className="w-full" variant="default" type="submit" disabled={isSubmitting}>
                Create
              </Button>
              <DrawerClose asChild onClick={onClose}>
                <Button className="w-full" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
