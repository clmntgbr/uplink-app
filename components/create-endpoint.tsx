import { Button } from "@/components/ui/button";
import { useEndpoint } from "@/lib/endpoint/context";
import { postEndpointSchema } from "@/lib/endpoint/schema";
import { JsonObject } from "@/lib/json";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconGitBranch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function CreateEndpoint() {
  const { postEndpoint } = useEndpoint();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof postEndpointSchema>, void, z.output<typeof postEndpointSchema>>({
    resolver: zodResolver(postEndpointSchema),
    defaultValues: {
      method: "GET",
      baseUri: "",
      path: "",
      name: "",
      timeoutSeconds: 30,
      body: {},
      query: {},
      header: {},
    },
  });

  const onSubmit = async (data: z.infer<typeof postEndpointSchema>) => {
    try {
      setIsSubmitting(true);
      await postEndpoint({
        name: data.name,
        baseUri: data.baseUri,
        path: data.path,
        method: data.method,
        timeout: data.timeoutSeconds,
        body: data.body as JsonObject,
        query: data.query as JsonObject,
        header: data.header as JsonObject,
      });
      onClose();
      toast.success("Endpoint created successfully");
    } catch {
      toast.error("Failed to create endpoint");
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
          <Button size="lg" className="font-bold" variant="outline" onClick={() => setOpen(true)}>
            <IconGitBranch /> Create Endpoint
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Endpoint</DrawerTitle>
            <DrawerDescription>Create a new endpoint</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-8 p-4">
                <Field>
                  <FieldLabel htmlFor="name" className={cn(errors.name && "text-destructive")}>
                    Name
                  </FieldLabel>
                  <Input id="name" {...register("name")} className="w-full shadow-none" placeholder="Endpoint name" />
                  <FieldDescription className={cn(errors.name && "text-destructive")}>Choose a unique name for your endpoint.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="baseUri" className={cn(errors.baseUri && "text-destructive")}>
                    Base URI
                  </FieldLabel>
                  <Input id="baseUri" {...register("baseUri")} className="w-full shadow-none" placeholder="https://api.example.com" />
                  <FieldDescription className={cn(errors.baseUri && "text-destructive")}>Enter the base URI of your endpoint.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="path" className={cn(errors.path && "text-destructive")}>
                    Path
                  </FieldLabel>
                  <Input id="path" {...register("path")} className="w-full shadow-none" placeholder="/api/v1/endpoint" />
                  <FieldDescription className={cn(errors.path && "text-destructive")}>Enter the path of your endpoint.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="method" className={cn(errors.method && "text-destructive")}>
                    Method
                  </FieldLabel>
                  <Controller
                    name="method"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldDescription className={cn(errors.method && "text-destructive")}>Select the method of your endpoint.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="timeoutSeconds" className={cn(errors.timeoutSeconds && "text-destructive")}>
                    Timeout
                  </FieldLabel>
                  <Input
                    id="timeoutSeconds"
                    {...register("timeoutSeconds", { valueAsNumber: true })}
                    className="w-full shadow-none"
                    placeholder="10"
                    type="number"
                  />
                  <FieldDescription className={cn(errors.timeoutSeconds && "text-destructive")}>
                    Enter the timeout in seconds of your endpoint.
                  </FieldDescription>
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
