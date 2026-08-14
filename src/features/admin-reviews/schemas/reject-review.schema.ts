import { z } from "zod";

export const rejectAdminReviewSchema = z.object({
  adminComment: z
    .string()
    .trim()
    .min(1, "非承認の理由を入力してください。")
    .max(500, "非承認の理由は500文字以内で入力してください。"),
});

export type RejectAdminReviewFormValues = z.infer<typeof rejectAdminReviewSchema>;
