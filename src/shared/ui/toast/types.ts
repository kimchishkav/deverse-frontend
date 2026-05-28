export type ToastType = "success" | "error" | "warning";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};
