import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Quiz from "./components/Quiz";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Quiz />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
