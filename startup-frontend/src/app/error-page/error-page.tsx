import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-7xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button
            variant="default"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
