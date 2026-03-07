import { Button } from "@/components/ui/button";
import { useEndpoint } from "@/lib/endpoint/context";
import { postEndpointSchema } from "@/lib/endpoint/schema";
import { JsonObject } from "@/lib/json";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { zodResolver } from "@hookform/resolvers/zod";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const themeMap: Record<string, Extension | undefined> = {
  Default: undefined,
  "Github Light": githubLight,
  "Github Dark": githubDark,
};

export function CreateEndpoint() {
  const { postEndpoint } = useEndpoint();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("configuration");
  const [bodyRawValue, setBodyRawValue] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
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
      setActiveTab("configuration");
      setBodyRawValue(null);
    }
  }, [open, reset]);

  const onChange = (value: string) => {
    if (value.trim() === "") {
      setValue("body", {});
      setBodyRawValue(null);
      clearErrors("body");
      return;
    }
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        setValue("body", parsed);
        setBodyRawValue(null);
        clearErrors("body");
      } else {
        setValue("body", null as unknown as z.output<typeof postEndpointSchema>["body"]);
        setBodyRawValue(value);
      }
    } catch {
      setValue("body", null as unknown as z.output<typeof postEndpointSchema>["body"]);
      setBodyRawValue(value);
    }
  };

  const onSubmitting = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 1 && errors.body) {
      setActiveTab("body");
    }
  };

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="lg" className="font-bold" variant="outline" onClick={() => setOpen(true)}>
            <LinkIcon /> Create Endpoint
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col max-w-[35vw]! w-[35vw]!">
          <DrawerHeader className="flex flex-row items-center gap-2">
            <div className="rounded-full bg-primary text-primary-foreground p-2">
              <LinkIcon />
            </div>
            <div className="flex flex-col ml-2">
              <DrawerTitle>Endpoint</DrawerTitle>
              <DrawerDescription>Create a new endpoint</DrawerDescription>
            </div>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col min-h-0">
            <Tabs className="flex flex-1 min-h-0 w-full flex-col overflow-hidden px-4" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full shrink-0">
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="query">Query</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
              </TabsList>
              <TabsContent value="configuration" className="">
                <div className="flex flex-col gap-6">
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
                  <div className="flex gap-4">
                    <Field className="flex-1">
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
                    <Field className="flex-1">
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
              </TabsContent>
              <TabsContent value="query" className="">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Query</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your notification preferences and view recent alerts and updates from your account.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="headers" className="">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Headers</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your headers preferences and view recent alerts and updates from your account.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="body" className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=active]:flex pb-2">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <CodeMirror
                    className="border h-full w-full"
                    theme={themeMap?.["Github Light"]}
                    onChange={onChange}
                    value={bodyRawValue ?? JSON.stringify(watch("body") ?? {}, null, 2)}
                    width="100%"
                    height="100%"
                    extensions={[json(), linter(jsonParseLinter()), lintGutter()]}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DrawerFooter className="border-t mt-auto shrink-0">
              <Button className="w-full" variant="default" type="submit" disabled={isSubmitting} onClick={onSubmitting}>
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
