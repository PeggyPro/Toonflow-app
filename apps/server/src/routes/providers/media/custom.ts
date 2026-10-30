import { Router } from "express";
import { z } from "zod";
import u from "@/utils";
import { validateFields } from "@/lib/middleware";
import { success } from "@/lib/responseFormat";

const modelSchema = z.object({
  id: z.string().trim().min(1).max(200),
  label: z.string().trim().min(1).max(200),
});

const providerSchema = z.object({
  id: z.string().max(96).regex(/^[a-z][a-zA-Z0-9]*$/, "供应商 ID 只能使用字母和数字，且须以小写字母开头"),
  label: z.string().trim().min(1).max(200),
  apiUrl: z.url().refine(value => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;
  }, "请填写不含查询参数的 HTTP API 基础地址"),
  protocol: z.enum(["openai-images", "openai-completions"]),
  models: z.array(modelSchema).min(1).max(2000).refine(models => new Set(models.map(model => model.id)).size === models.length, "模型 ID 不能重复"),
});

export default Router().post("/", validateFields(providerSchema.shape), async (req, res) => {
  const { id, label, apiUrl, protocol, models } = req.body as z.infer<typeof providerSchema>;
  const source = u.mediaProvider.createOpenAiImageProviderSource(id, label, apiUrl, protocol, models);
  res.json(success(await u.mediaProvider.addMediaProvider(source)));
});
