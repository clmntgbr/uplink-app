import { EndpointProvider } from "@/lib/endpoint/provider";
import { ProjectProvider } from "@/lib/project/provider";
import { StepProvider } from "@/lib/step/provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { UserProvider } from "@/lib/user/provider";
import { WorkflowProvider } from "@/lib/workflow/provider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserProvider>
        <ProjectProvider>
          <EndpointProvider>
            <WorkflowProvider>
              <StepProvider>
                <div className="mx-auto px-0">{children}</div>
              </StepProvider>
            </WorkflowProvider>
          </EndpointProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
