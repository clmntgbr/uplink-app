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
import { AlertCircleIcon, LinkIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type FormValues = z.infer<typeof postEndpointSchema>;
type TabId = "configuration" | "query" | "headers" | "body";
type HeaderEntry = { id: number; key: string; value: string };
type HeaderEntryErrors = Record<number, { key?: string; value?: string }>;

const TABS: TabId[] = ["configuration", "query", "headers", "body"];

const TAB_LABELS: Record<TabId, string> = {
  configuration: "Configuration",
  query: "Query",
  headers: "Headers",
  body: "Body",
};

let headerIdCounter = 0;
const nextHeaderId = () => ++headerIdCounter;

function parseBodyJson(raw: string): { value: JsonObject; error: string | null } {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "{}") return { value: {}, error: null };
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return { value: parsed as JsonObject, error: null };
    }
    return { value: {}, error: "Body must be a JSON object, not an array or primitive." };
  } catch (e) {
    return { value: {}, error: "Invalid JSON: " + (e instanceof SyntaxError ? e.message : "parse error") };
  }
}

function validateHeaderEntries(entries: HeaderEntry[]): HeaderEntryErrors {
  const errors: HeaderEntryErrors = {};
  entries.forEach((entry) => {
    const rowErrors: { key?: string; value?: string } = {};
    if (entry.key && !entry.value) rowErrors.value = "Value is required when a key is set.";
    if (!entry.key && entry.value) rowErrors.key = "Key is required when a value is set.";
    if (Object.keys(rowErrors).length > 0) errors[entry.id] = rowErrors;
  });
  return errors;
}

export function CreateEndpoint() {
  const { postEndpoint } = useEndpoint();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("configuration");

  const [bodyRaw, setBodyRaw] = useState("{}");
  const [bodyError, setBodyError] = useState<string | null>(null);
  const bodyValueRef = useRef<JsonObject>({});

  const [headerEntries, setHeaderEntries] = useState<HeaderEntry[]>([]);
  const [headerEntryErrors, setHeaderEntryErrors] = useState<HeaderEntryErrors>({});

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

  const tabHasError: Record<TabId, boolean> = {
    configuration: !!(errors.name || errors.baseUri || errors.path || errors.method || errors.timeoutSeconds),
    query: false,
    headers: Object.keys(headerEntryErrors).length > 0,
    body: bodyError !== null,
  };

  const handleBodyChange = (value: string) => {
    setBodyRaw(value);
    const { value: parsed, error } = parseBodyJson(value);
    setBodyError(error);
    if (!error) {
      bodyValueRef.current = parsed;
      setValue("body", parsed);
    }
  };

  const addHeader = () => {
    setHeaderEntries((prev) => [...prev, { id: nextHeaderId(), key: "", value: "" }]);
  };

  const updateHeader = (id: number, field: "key" | "value", val: string) => {
    setHeaderEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
    setHeaderEntryErrors((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev[id] };
      delete updated[field];
      if (Object.keys(updated).length === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: updated };
    });
  };

  const removeHeader = (id: number) => {
    setHeaderEntries((prev) => prev.filter((e) => e.id !== id));
    setHeaderEntryErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (bodyError !== null) {
      setActiveTab("body");
      return;
    }

    const headerErrors = validateHeaderEntries(headerEntries);
    if (Object.keys(headerErrors).length > 0) {
      setHeaderEntryErrors(headerErrors);
      setActiveTab("headers");
      return;
    }

    const headerObject: JsonObject = {};
    for (const entry of headerEntries) {
      if (entry.key && entry.value) headerObject[entry.key] = entry.value;
    }

    try {
      setIsSubmitting(true);
      await postEndpoint({
        name: data.name,
        baseUri: data.baseUri,
        path: data.path,
        method: data.method,
        timeout: data.timeoutSeconds,
        body: bodyValueRef.current,
        query: (data.query as JsonObject) ?? {},
        header: headerObject,
      });
      onClose();
      toast.success("Endpoint created successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(`Failed to create endpoint: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBeforeSubmit = () => {
    for (const tab of TABS) {
      if (tabHasError[tab]) {
        setActiveTab(tab);
        return;
      }
    }
  };

  const onClose = () => {
    reset();
    setActiveTab("configuration");
    setBodyRaw("{}");
    setBodyError(null);
    setHeaderEntries([]);
    setHeaderEntryErrors({});
    bodyValueRef.current = {};
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    reset();
    setActiveTab("configuration");
    setBodyRaw("{}");
    setBodyError(null);
    setHeaderEntries([]);
    setHeaderEntryErrors({});
    bodyValueRef.current = {};
  }, [open, reset]);

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
          <Tabs
            className="flex flex-1 min-h-0 w-full flex-col overflow-hidden px-4"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
          >
            <TabsList className="w-full shrink-0">
              {TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="relative flex items-center gap-1.5">
                  {TAB_LABELS[tab]}
                  {tabHasError[tab] && (
                    <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-destructive absolute -top-0.5 -right-0.5" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="configuration">
              <div className="flex flex-col gap-6">
                <Field>
                  <FieldLabel htmlFor="name" className={cn(errors.name && "text-destructive")}>
                    Name
                  </FieldLabel>
                  <Input
                    id="name"
                    {...register("name")}
                    className={cn("w-full shadow-none", errors.name && "border-destructive focus-visible:ring-destructive")}
                    placeholder="Endpoint name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name ? (
                    <FieldError id="name-error" message={errors.name.message} />
                  ) : (
                    <FieldDescription>Choose a unique name for your endpoint.</FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="baseUri" className={cn(errors.baseUri && "text-destructive")}>
                    Base URI
                  </FieldLabel>
                  <Input
                    id="baseUri"
                    {...register("baseUri")}
                    className={cn("w-full shadow-none", errors.baseUri && "border-destructive focus-visible:ring-destructive")}
                    placeholder="https://api.example.com"
                    aria-invalid={!!errors.baseUri}
                    aria-describedby={errors.baseUri ? "baseUri-error" : undefined}
                  />
                  {errors.baseUri ? (
                    <FieldError id="baseUri-error" message={errors.baseUri.message} />
                  ) : (
                    <FieldDescription>Enter the base URI of your endpoint.</FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="path" className={cn(errors.path && "text-destructive")}>
                    Path
                  </FieldLabel>
                  <Input
                    id="path"
                    {...register("path")}
                    className={cn("w-full shadow-none", errors.path && "border-destructive focus-visible:ring-destructive")}
                    placeholder="/api/v1/endpoint"
                    aria-invalid={!!errors.path}
                    aria-describedby={errors.path ? "path-error" : undefined}
                  />
                  {errors.path ? (
                    <FieldError id="path-error" message={errors.path.message} />
                  ) : (
                    <FieldDescription>Enter the path of your endpoint.</FieldDescription>
                  )}
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
                          <SelectTrigger className={cn(errors.method && "border-destructive")}>
                            <SelectValue placeholder="Select a method" />
                          </SelectTrigger>
                          <SelectContent>
                            {(["GET", "POST", "PUT", "DELETE"] as const).map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.method ? (
                      <FieldError message={errors.method.message} />
                    ) : (
                      <FieldDescription>Select the method of your endpoint.</FieldDescription>
                    )}
                  </Field>

                  <Field className="flex-1">
                    <FieldLabel htmlFor="timeoutSeconds" className={cn(errors.timeoutSeconds && "text-destructive")}>
                      Timeout (s)
                    </FieldLabel>
                    <Input
                      id="timeoutSeconds"
                      {...register("timeoutSeconds", { valueAsNumber: true })}
                      className={cn("w-full shadow-none", errors.timeoutSeconds && "border-destructive focus-visible:ring-destructive")}
                      placeholder="30"
                      type="number"
                      min={1}
                      aria-invalid={!!errors.timeoutSeconds}
                      aria-describedby={errors.timeoutSeconds ? "timeout-error" : undefined}
                    />
                    {errors.timeoutSeconds ? (
                      <FieldError id="timeout-error" message={errors.timeoutSeconds.message} />
                    ) : (
                      <FieldDescription>Enter the timeout in seconds.</FieldDescription>
                    )}
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
                {headerEntries.length > 0 && (
                  <div className="flex gap-2 pb-1">
                    <span className="flex-1">
                      <FieldLabel>Key</FieldLabel>
                    </span>
                    <span className="flex-1">
                      <FieldLabel>Value</FieldLabel>
                    </span>
                    <div className="w-8" />
                  </div>
                )}

                {headerEntries.map((entry) => {
                  const rowError = headerEntryErrors[entry.id];
                  return (
                    <div key={entry.id} className="flex flex-col gap-1">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 flex flex-col gap-1">
                          <Input
                            value={entry.key}
                            onChange={(e) => updateHeader(entry.id, "key", e.target.value)}
                            className={cn("shadow-none", rowError?.key && "border-destructive focus-visible:ring-destructive")}
                            placeholder="Key"
                            aria-invalid={!!rowError?.key}
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <Input
                            value={entry.value}
                            onChange={(e) => updateHeader(entry.id, "value", e.target.value)}
                            className={cn("shadow-none", rowError?.value && "border-destructive focus-visible:ring-destructive")}
                            placeholder="Value"
                            aria-invalid={!!rowError?.value}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 mt-0.5 text-muted-foreground hover:text-destructive"
                          onClick={() => removeHeader(entry.id)}
                          aria-label="Remove header"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button type="button" variant="outline" size="sm" className="w-full mt-1" onClick={addHeader}>
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Header
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="body" className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=active]:flex pb-2 gap-2">
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeMirror
                  className={cn("border h-full w-full")}
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
            <Button className="w-full" variant="default" type="submit" disabled={isSubmitting} onClick={onBeforeSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create"
              )}
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

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-center gap-1 text-xs text-destructive mt-0.5" role="alert">
      <AlertCircleIcon className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}
