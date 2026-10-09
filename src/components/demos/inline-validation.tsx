"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "8 文字以上で入力してください"),
});

type FormData = z.infer<typeof schema>;

export default function InlineValidation() {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    toast.success(`サインアップ: ${data.email}`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="email">メール</Label>
        <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">パスワード</Label>
        <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={!isValid}>サインアップ</Button>
    </form>
  );
}
