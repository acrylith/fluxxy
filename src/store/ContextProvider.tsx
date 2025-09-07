import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const fetchContext = new QueryClient()

export default function ContextProvider({ children } : any) {
        return (
            <QueryClientProvider client={fetchContext}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        )
    }
