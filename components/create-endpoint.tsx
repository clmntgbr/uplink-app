import { Button } from "@/components/ui/button";
import { useEndpoint } from "@/lib/endpoint/context";
import { postEndpointSchema } from "@/lib/endpoint/schema";
import { JsonObject } from "@/lib/json";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { zodResolver } from "@hookform/resolvers/zod";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { LinkIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type FormValues = z.infer<typeof postEndpointSchema>;

export function CreateEndpoint() {
  const { postEndpoint } = useEndpoint();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("configuration");
  const [bodyRaw, setBodyRaw] = useState("{}");
  const bodyIsValidRef = useRef(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
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

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headerEntries",
  });

  const onSubmit = async (data: FormValues) => {
    if (!bodyIsValidRef.current) {
      setActiveTab("body");
      return;
    }

    const header = data.header;

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
        header: header as JsonObject,
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
      setBodyRaw("{}");
      bodyIsValidRef.current = true;
    }
  }, [open, reset]);

  const handleBodyChange = (value: string) => {
    setBodyRaw(value);
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "{}") {
      setValue("body", {});
      bodyIsValidRef.current = true;
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        setValue("body", parsed);
        bodyIsValidRef.current = true;
      } else {
        bodyIsValidRef.current = false;
      }
    } catch {
      bodyIsValidRef.current = false;
    }
  };

  const onSubmitting = () => {
    if (errors.baseUri || errors.path || errors.method || errors.timeoutSeconds || errors.name) {
      setActiveTab("configuration");
      return;
    }

    if (!bodyIsValidRef.current) {
      setActiveTab("body");
      return;
    }
  };

  return (
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

            <TabsContent value="configuration">
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
                      placeholder="30"
                      type="number"
                    />
                    <FieldDescription className={cn(errors.timeoutSeconds && "text-destructive")}>Enter the timeout in seconds.</FieldDescription>
                  </Field>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="query">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Query</h3>
                <p className="text-sm text-muted-foreground">Manage your query parameters.</p>
              </div>
            </TabsContent>

            <TabsContent value="headers">
              <div className="flex flex-col gap-2">
                {headerFields.length > 0 && (
                  <div className="flex gap-2">
                    <span className="flex-1">
                      <FieldLabel htmlFor="header.key" className={cn(errors.header && "text-destructive")}>
                        Key
                      </FieldLabel>
                    </span>
                    <span className="flex-1">
                      <FieldLabel htmlFor="header.value" className={cn(errors.header && "text-destructive")}>
                        Value
                      </FieldLabel>
                    </span>
                    <div className="w-8" />
                  </div>
                )}
                {headerFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input {...register(`header.${index}.key`)} className="flex-1 shadow-none" placeholder="X-Api-Key" />
                    <Input {...register(`header.${index}.value`)} className="flex-1 shadow-none" placeholder="value" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeHeader(index)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-full mt-1" onClick={() => appendHeader({ key: "", value: "" })}>
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Header
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="body" className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=active]:flex pb-2">
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeMirror
                  className="border h-full w-full"
                  theme={githubLight}
                  onChange={handleBodyChange}
                  value={bodyRaw}
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
  );
}
