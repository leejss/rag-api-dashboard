import { createContext, useEffect, useState } from "react";
import { ErrorDialog } from "~/components/error-dialog";
import { BASE_URL } from "~/lib/api/common";

type ServerHealthContextType = {
  isServerDown: boolean;
  checkServerHealth: () => Promise<void>;
};

const ServerHealthContext = createContext<ServerHealthContextType>({
  isServerDown: false,
  checkServerHealth: () => Promise.resolve(),
});

// @app.get("/health")
// async def health_check():
//     try:
//         if await isHealthOK():
//             return {"status": "UP"}
//         else:
//             logger.error("Health check failed")
//             return {"status": "DOWN"}, 503
//     except Exception as e:
//         logger.error(
//             "Error during health check | Error: %s | Traceback: %s",
//             str(e),
//             traceback.format_exc(),
//         )
//         return {"status": "DOWN", "error": str(e)}, 503

export function ServerHealthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isServerDown, setIsServerDown] = useState(false);
  // const navigate = useNavigate();
  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Server is down");
      }

      const result = await response.json();
      if (result.status === "UP") {
        setIsServerDown(false);
      } else {
        setIsServerDown(true);
      }
    } catch (error) {
      setIsServerDown(true);
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <ServerHealthContext.Provider value={{ isServerDown, checkServerHealth }}>
      {children}
      <ErrorDialog
        open={isServerDown}
        onOpenChange={(open) => setIsServerDown(open)}
        errorMessage={"Server is down"}
        onGoToHome={() => {}}
      />
    </ServerHealthContext.Provider>
  );
}
