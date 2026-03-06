import { toast as toastify } from "sonner";

export const toast = {
  success: (message: string) => {
    toastify.success(message, {
      position: "top-center",
      closeButton: true,
    });
  },
  error: (message: string) => {
    toastify.error(message, {
      position: "top-center",
      description: "Please try again",
      closeButton: true,
    });
  },
};
